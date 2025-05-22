const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  descripcion: {
    type: String
  }
});

const inventarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  unidad: {
    type: String,
    enum: ['kg', 'g', 'l', 'ml', 'unidades'],
    required: true
  },
  stockMinimo: {
    type: Number,
    default: 0
  },
  movimientos: [movimientoSchema]
}, {
  timestamps: true
});

const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = Inventario;