const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.contraseña = await bcrypt.hash(nuevoUsuario.contraseña, salt);
    await nuevoUsuario.save();
      res.status(201).json(nuevoUsuario);
  } catch (error) {
      res.status(400).json({ mensaje: 'Error al crear usuario', error });
  }
};  

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el usuario', error });
  }
};

// Actualizar un usuario por ID
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
    req.params.id,
    req.body,
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar usuario', error });
  }
};
  
  // Eliminar un usuario por ID
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);  
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
      res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
  }
};
  
module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
