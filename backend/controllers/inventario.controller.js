const Inventario = require('../models/Inventario');

// Crear producto de inventario
const crearProducto = async (req, res) => {
  try {
    const producto = new Inventario(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el producto', error });
  }
};

// Obtener todos los productos
const obtenerInventario = async (req, res) => {
  try {
    const inventario = await Inventario.find();
    res.status(200).json(inventario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener inventario', error });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Inventario.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar producto', error });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const producto = await Inventario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar producto', error });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Inventario.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error });
  }
};

// Registrar movimiento de inventario (entrada o salida)
const registrarMovimiento = async (req, res) => {
  try {
    const { tipo, cantidad, descripcion } = req.body;
    const producto = await Inventario.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const nuevoMovimiento = { tipo, cantidad, descripcion };
    producto.movimientos.push(nuevoMovimiento);

    // Actualizar stock
    producto.cantidad += tipo === 'entrada' ? cantidad : -cantidad;

    await producto.save();
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar movimiento', error });
  }
};

module.exports = {
  crearProducto,
  obtenerInventario,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  registrarMovimiento
};