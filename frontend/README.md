Pasos para iniciar servidor Frontend
Este es el frontend del proyecto, desarrollado en **Angular Standalone** (sin módulos tradicionales).
1. Requisitos
- Node.js >= 20.11.1
- Angular CLI >= 19.0.5
- npm >= 10.2.4
2. Clona el repositorio o descarga los archivos.
git clone https://github.com/Kasemt2411/Diplomado_final.git
Navega a la carpeta
cd Diplomado_final/frontend
3. Instalar dependencias
npm install 
( en caso de ser nesesario instalar esta dependencia por si soloa npm install xlsx)
4. Iniciar el servidor en la ruta cd Diplomado_final/frontend
ng serve
5. Verificación
Watch mode enabled. Watching for file changes...
Re-optimizing dependencies because vite config has changed
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
6. Notas importantes
- El archivo de rutas routes.ts gestiona la navegación
- Se usa loadComponent() para cargar componentes de forma optimizada
- En caso de no tener un token, se redirige automáticamente al login
7. Funcionalidades principales
- Autenticación de usuarios (Login y Registro).
- Navegación entre Home, Login y Dashboard.
- Formulario reactivo con validaciones.
- Protección de rutas con AuthGuard.
- Consumo de servicios REST del backend (usuarios, pedidos).
- Almacenamiento de token JWT en localStorage.