const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');
const { check }  = require('express-validator');

router.post('/',
    [
      check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
      check('email', 'El Nombre es Obligatorio').isEmail(),
      check('password', 'El password debe se de almenos 6 caracteres').isLength({min:6}),
    ],
   usuarioController.nuevoUsuario
);

module.exports= router;