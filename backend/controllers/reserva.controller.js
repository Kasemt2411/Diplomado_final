const Reserva = require('../models/Reserva');

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    const nuevaReserva = new Reserva(req.body);
    await nuevaReserva.save();
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la reserva', error });
  }
};

// Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reservas', error });
  }
};

// Obtener reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la reserva', error });
  }
};

// Actualizar reserva
const actualizarReserva = async (req, res) => {
  try {
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reservaActualizada) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
    res.status(200).json(reservaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la reserva', error });
  }
};

// Eliminar reserva
const eliminarReserva = async (req, res) => {
  try {
    const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id);
    if (!reservaEliminada) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
    res.status(200).json({ mensaje: 'Reserva eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la reserva', error });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
};