const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio']
  },
  mesa: {
    type: String,
    required: [true, 'El número o nombre de la mesa es obligatorio']
  },
  platos: [
    {
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
      observaciones: { type: String }
    }
  ],  
  estado: {
    type: String,
    enum: ['pendiente', 'en preparación', 'listo', 'entregado'],
    default: 'pendiente'
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;