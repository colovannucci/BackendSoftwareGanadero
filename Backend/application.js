// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();
const PORT = process.env.PORT;

// Require express to create a server instance
const express = require("express");
const app = express();

// CORS - Cross-Origin Resource Sharing
const cors = require('cors');
//app.use(cors())
app.use(cors({ origin: '*', methods: ['GET','POST', 'PATCH', 'DELETE']}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Application routes
const systemRoutes = require("./Routes/systemRoutes");
app.use("/api/v1/system", systemRoutes);

const userRoutes = require("./Routes/userRoutes");
app.use("/api/v1/user", userRoutes);

const establishmentRoutes = require("./Routes/establishmentRoutes");
app.use("/api/v1/establishment", establishmentRoutes);

const animalRoutes = require("./Routes/animalRoutes");
app.use("/api/v1/animal", animalRoutes);

// Send a message indicating the server is working properly
app.use('/test', (req, res) => {
  //res.send({ code: 204, status: "No Content", message: "Hello World! Welcome!" });
  res.send('Hello World! Welcome!');
});


////////////////////////////////////////////////////////////////////////////////
const multer  = require('multer')

const fileStorage = multer.diskStorage({
  destination: 'tmp/my-uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname )
  }
})
//const upload = multer({ dest: 'uploads/' });
/*
const upload = multer({ storage: fileStorage });
app.post('/multer', upload.single('PlanillaAnimales'), function (req, res, next) {
  // Todo salió bien.
  // Collect Content-Type header value
  const contentTypeHeaderValue = req.get('Content-Type');
  // Collect Content-Type Value from authorization header
  const contentTypeValue = contentTypeHeaderValue.split(';')[0];
  console.log('file');
  console.log(req.file);
  res.status(200).send({ code: 200, status: "OK", message: "Recibido-"+contentTypeValue });
  // req.file es el `avatar` del archivo
  // req.body tendrá los campos textuales, en caso de haber alguno.
})
*/
const upload = multer({ storage: fileStorage }).single('PlanillaAnimales');
app.post('/multer', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Un error de Multer ocurrió durante la subida.
      res.status(500).send({ code: 500, status: "ERROR", message: "Un error de Multer ocurrió durante la subida.\n"+err });
    } else if (err) {
      // Un error desconocido ocurrió durante la subida.
      res.status(500).send({ code: 500, status: "ERROR", message: "Un error desconocido ocurrió durante la subida." });
    }
    // Todo salió bien.
    // Collect Content-Type header value
    const contentTypeHeaderValue = req.get('Content-Type');
    // Collect Content-Type Value from authorization header
    const contentTypeValue = contentTypeHeaderValue.split(';')[0];
    console.log('file');
    console.log(req.file);
    res.status(200).send({ code: 200, status: "OK", message: "Recibido-"+contentTypeValue });
    // req.file es el `avatar` del archivo
    // req.body tendrá los campos textuales, en caso de haber alguno.
  })
})

/*
COMENTARIOS
validar content type
validar fieldname: 'PlanillaAnimales'
almacenar originalname: 'TEST-PlanillaAnimales.xlsx' para mostrar
almacenar path: 'tmp\\my-uploads\\1672974242230-TEST-PlanillaAnimales.xlsx' para leer y eliminar
*/
////////////////////////////////////////////////////////////////////////////////

// If none route matches the request will fail and sent this message
app.use('*', (req, res) => {
  res.status(404).send({ code: 404, status: "Not Found", message: "Empty Route! Are you lost?" });
});

// Web server connection function
const mainStart = async () => {
  try {
    await app.listen(PORT);
    console.log('Web server listening on port', PORT);
  } catch (err) {
    console.log('Failed to start the web server', err);
  }
}

module.exports = {
  mainStart
};