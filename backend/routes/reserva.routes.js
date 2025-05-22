const express = require('express');
const router = express.Router();
const {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
} = require('../controllers/reserva.controller');

// Rutas públicas o protegidas según tu necesidad
router.post('/', crearReserva);
router.get('/', obtenerReservas);
router.get('/:id', obtenerReservaPorId);
router.put('/:id', actualizarReserva);
router.delete('/:id', eliminarReserva);

module.exports = router;