var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');


// Configuración de almacenamiento personalizado con diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configuración de multer con límites y filtro de archivos
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de tamaño: 2MB
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPG files are allowed!'));
    }
  }
});

/* GET home page */
router.get('/', function (req, res, next) {
  res.redirect('form.html');
});

// Ruta para manejar la carga de archivos y texto
router.post('/', upload.single('avatar'), function (req, res, next) {
  const { username } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('File upload failed!');
  }

  // Construcción del enlace clickeable
  const fileUrl = `http://localhost:3000/uploads/${file.filename}`;


  res.json({izena: username, fitxategia: fileUrl});
});

module.exports = router;
