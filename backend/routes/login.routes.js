const express = require('express');
const router = express.Router();
const { loginUsuario, registrarUsuario } = require('../controllers/login.controller');

// Ruta de login
router.post('/login', loginUsuario);

// Ruta de registro
router.post('/register', registrarUsuario);

module.exports = router;