// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// uuid library to generate unique IDs
const { v4: uuid } = require("uuid");

// Call MongoDB model
const ProductDBModel = require('./product_model');

// Define array with valid categories
// In the future it will be in .env file
const validCategories = ['computers', 'phones', 'accesories'];

function getProduct (req, res) {
    const productId = req.params.productId;

    // Search in products DB
    ProductDBModel.findById(productId)
        .then(productFound => {
            res.status(200).send({ status: "OK", product: productFound });
        })
        .catch(err => {
            res.status(404).send({ status: "ERROR", message: 'Error finding product' });
            console.log(`Error finding product ${productId}-Error: ${err}`);
        });
}

function createProduct (req, res) {
    // Collect body fields
    const { body } = req;
    // Check if body is not empty
    if (
        !body.name ||
        !body.price ||
        !body.category ||
        !body.description
    ) {
        return res.status(400).send({ status: "ERROR", message: 'Missing fields' });
    }
    // Check if cretedId, createdAt and updatedAt are empty
    if (
        body.createdId ||
        body.createdAt ||
        body.updatedAt
    ) {
        return res.status(400).send({ status: "ERROR", message: 'Prohibited fields added' });
    }
    // Check if category is valid
    if (!(validCategories.includes(body.category))) return res.status(404).send({ message: 'Invalid category' });

    // Declare new product object with data received
    const newProduct = new ProductDBModel();
    newProduct.name = body.name;
    newProduct.price = body.price;
    newProduct.category = body.category;
    newProduct.description = body.description;
    // Add fields createdId, createdAt and updatedAt
    newProduct.createdId = uuid();
    newProduct.createdAt = Date().toLocaleString("en-US", { timezone: "UTC" });
    newProduct.updatedAt = Date().toLocaleString("en-US", { timezone: "UTC" });
    
    // Store new product in DB
    newProduct.save()
        .then(productStored => {
            res.status(201).send({ status: "OK", message: 'Product created successfully', product: productStored });
        })
        .catch(err => {
            res.status(500).send({ status: "ERROR", message: 'Error saving new product' });
            console.log(`Error saving new product: ${err.message}`);
        });
}

function updateProduct (req, res) {
    const productId = req.params.productId;
    const dataToUpdate = req.body;

    // Check if cretedId, createdAt and updatedAt are empty
    if (
        dataToUpdate.createdId ||
        dataToUpdate.createdAt ||
        dataToUpdate.updatedAt
    ) {
        return res.status(400).send({ message: 'Prohibited fields added' });
    }
    // Check if category is valid
    if (dataToUpdate.category && !(validCategories.includes(dataToUpdate.category))) return res.status(404).send({ message: 'Invalid category' });

    // Modify field updatedAt
    dataToUpdate.updatedAt = Date().toLocaleString("en-US", { timezone: "UTC" });

    // Search in product DB by generic id and update it
    ProductDBModel.updateOne({ _id: productId }, dataToUpdate)
      .then (res.status(200).send({ status: "OK", message: 'Product updated successfully' }))
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error updating product' });
        console.log(`Error updating product ${userEmail}-Error: ${err}`);
      });
}

function deleteProduct (req, res) {
    const productId = req.params.productId;

    // Search in product DB by generic id and delete it
    ProductDBModel.deleteOne({ _id: productId })
      .then (res.status(200).send({ status: "OK", message: 'Product deleted successfully' }))
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error deleting product' });
        console.log(`Error deleting product ${userEmail}-Error: ${err}`);
      });
}

function getAllProducts (req, res) {
    // Search for products without any query parameters
    ProductDBModel.find({})
        .then(productsFound => {
            res.status(200).send({ status: "OK", products: productsFound });
        })
        .catch(err => {
            res.status(500).send({ status: "ERROR", message: 'Error finding all products' });
            console.log(`Error finding all products: ${err}`);
        });
}

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}