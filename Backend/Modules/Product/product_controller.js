// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Call MongoDB model
const ProductModelDB = require('./product_model');

// uuid library to generate unique IDs
const { v4: uuid } = require("uuid");

// Define array with valid categories
// In the future it will be in .env file
const validCategories = ['computers', 'phones', 'accesories'];

function getAllProducts (req, res) {
    // Search for products without any query parameters
    ProductModelDB.find({}, (err, productsFound) => {
        if (err) return res.status(500).send({ message: `Error getting all products: ${err}` });
        if (!productsFound) return res.status(404).send({ message: `There are no products availables` });
        
        res.status(200).send({ products: productsFound });
    });
}

function getProduct (req, res) {
    const productId = req.params.productId;

    // Search in DB products
    ProductModelDB.findById(productId, (err, productFound) => {
        if (err) return res.status(500).send({ message: `Error getting product: ${err}` });
        // Check if product already exists
        if (!productFound) return res.status(404).send({ message: `Product ${productId} doesn't exists` });

        res.status(200).send({ product: productFound}); 
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
        return res.status(404).send({ message: 'Missing fields' });
    }
    // Check if cretedId, createdAt and updatedAt are empty
    if (
        body.createdId ||
        body.createdAt ||
        body.updatedAt
    ) {
        return res.status(404).send({ message: 'Prohibited fields added' });
    }
    // Check if category is valid
    if (!(validCategories.includes(body.category))) return res.status(404).send({ message: 'Invalid category' });

    // Declare new product object with data received
    const newProduct = new ProductModelDB();
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
            res.status(201).send({ message: 'Product saved successfully', product: productStored });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error saving new product' });
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
        return res.status(404).send({ message: 'Prohibited fields added' });
    }
    // Check if category is valid
    if (dataToUpdate.category && !(validCategories.includes(dataToUpdate.category))) return res.status(404).send({ message: 'Invalid category' });

    // Modify field updatedAt
    dataToUpdate.updatedAt = Date().toLocaleString("en-US", { timezone: "UTC" });

    ProductModelDB.findByIdAndUpdate(productId, dataToUpdate, (err, productUpdated) => {
        if (err) return res.status(500).send({ message: 'Error updating product' });
        if (!productUpdated) return res.status(404).send({ message: 'Product not found' });

        res.status(200).send({ message: 'El producto se ha actualizado correctamente' });

    });
}

function deleteProduct (req, res) {
    const productId = req.params.productId;
    // Search the product
    ProductModelDB.findById(productId, (err, productFound) => {
        if (err) return res.status(500).send({ message: `Error getting product ${err}`});
        if (!productFound) return res.status(404).send({ message: 'Product not found' });
        
        productFound.remove()
            .then(productRemoved => {
                res.status(200).send({ message: 'Product deleted successfully' });
            })
            .catch(err => {
                res.status(500).send({ message: 'Error removing product' });
                console.log(`Error removing product ${productId}-Error: ${err}`);
            });
    });
}

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}