const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario');

// Controladores existentes
const {
  crearProducto,
  obtenerInventario,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  registrarMovimiento
} = require('../controllers/inventario.controller');

// --- CRUD Básico ---
router.post('/', crearProducto);
router.get('/', obtenerInventario);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

// --- Registrar entrada/salida ---
router.post('/:id/movimientos', registrarMovimiento);

// --- Cargue masivo desde archivo Excel ---
router.post('/masivo', async (req, res) => {
  try {
    const productos = req.body;

    if (!Array.isArray(productos)) {
      return res.status(400).json({ error: 'El cuerpo debe ser un arreglo de productos.' });
    }

    const productosValidos = productos.filter(p =>
      p.nombre &&
      typeof p.nombre === 'string' &&
      typeof p.cantidad === 'number' &&
      typeof p.unidad === 'string' &&
      p.unidad.trim() !== ''
    );

    if (productosValidos.length === 0) {
      return res.status(400).json({ error: 'No se encontraron productos válidos.' });
    }

    const resultado = await Inventario.insertMany(productosValidos);
    res.status(201).json({
      mensaje: `Se cargaron correctamente ${resultado.length} productos.`,
      productos: resultado
    });
  } catch (error) {
    console.error('Error al guardar productos masivos:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor al guardar productos.',
      detalle: error.message
    });
  }
});

module.exports = router;