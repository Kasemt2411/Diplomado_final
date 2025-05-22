const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombreCliente: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    lowercase: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha de la reserva es obligatoria']
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria']
  },
  cantidadPersonas: {
    type: Number,
    required: [true, 'Debes indicar cuántas personas asistirán']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;