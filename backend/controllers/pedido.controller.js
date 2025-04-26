const Pedido = require('../models/Pedido');

// Crear pedido
const crearPedido = async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el pedido', error });
  }
};

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error });
  }
};

// Obtener pedido por ID
const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el pedido', error });
  }
};

// Actualizar pedido
const actualizarPedido = async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pedidoActualizado) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el pedido', error });
  }
};

// Eliminar pedido
const eliminarPedido = async (req, res) => {
  try {
    const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedidoEliminado) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el pedido', error });
  }
};

module.exports = {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido
};