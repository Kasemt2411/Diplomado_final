const express = require('express');
const router = express.Router();
const {
  crearProducto,
  obtenerInventario,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  registrarMovimiento
} = require('../controllers/inventario.controller');

// CRUD básico
router.post('/', crearProducto);
router.get('/', obtenerInventario);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

// Registrar entrada/salida
router.post('/:id/movimientos', registrarMovimiento);

module.exports = router;