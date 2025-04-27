Pasos para iniciar servidor Backend
Este es el backend del proyecto, desarrollado en **Node.js**, **Express** y **MongoDB**.
1. Requisitos
- Node.js >= 20.11.1
- MongoDB Atlas o local
- npm >= 10.2.4
2. Clona el repositorio o descarga los archivos.
git clone https://github.com/Kasemt2411/Diplomado_final.git
Navega a la carpeta
cd Diplomado_final/backend
3. Instalar dependencias
npm install
4. Crear el archivo .env en la raíz de backend/ con el siguiente contenido
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/Diplomado
5. Iniciar el servidor en la ruta cd Diplomado_final/backend
node app.js
6. Verificación
Conexión a MongoDB exitosa
Servidor escuchando en http://localhost:3000
7. Notas importantes
- El backend escucha por defecto en http://localhost:3000
- Usa CORS habilitado para permitir la conexión con el frontend Angular
- Todas las rutas API están prefijadas con /api
8. Endpoints principales
- POST /api/login → Iniciar sesión
- POST /api/register → Registrar usuario
- GET /api/usuarios → Obtener usuarios
- GET /api/pedidos → Obtener pedidos
- GET /api/reservas → Obtener reservas
- GET /api/inventario → Obtener inventario