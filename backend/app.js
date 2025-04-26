// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Rutas
const rutasUsuario = require('./routes/usuario.routes');
const loginRoutes = require('./routes/login.routes'); 
const rutasReserva = require('./routes/reserva.routes');
const rutasPedido = require('./routes/pedido.routes');
const rutasInventario = require('./routes/inventario.routes');

// App
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas o protegidas
app.use('/api/usuarios', rutasUsuario);
app.use('/api', loginRoutes); 
app.use('/api/reservas', rutasReserva);
app.use('/api/pedidos', rutasPedido);
app.use('/api/inventario', rutasInventario);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error);
  });