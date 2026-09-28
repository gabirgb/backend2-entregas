<h1 align="center">Esto es Eventeala 🎫</h1>
<h2 align="center">Una API para gestión de eventos (WIP) orientada a talleres y charlas educativas</h2>

<h3 align="center">Información técnica del proyecto</h3>
<h4>🧱 Stack</h4>
<p>Node.js (usando ESM) con las siguientes dependencias:</p>
<ul>
<li>Express</li>
<li>Mongoose</li>
<li>bcrypt</li>
<li>dotenv</li>
<li>cookie-parser</li>
<li>jsonWebToken</li>
<li>Passport</li>
<li>Passport-JWT</li>
<li>Passport-local</li>
</ul>

<h5>🏢 Arquitectura</h5>
<p>La API sigue una arquitectura en capas con separación de responsabilidades:</p>
<ul>
  <li><b>Rutas (Routes):</b> Definen los endpoints de la API y mapean las solicitudes hacia los controladores.</li>
  <li><b>Controladores (Controllers):</b> Manejan la interacción HTTP (req/res), gestionan la autenticación con Passport y devuelven las respuestas JSON.</li>
  <li><b>DTOs (Data Transfer Objects):</b> Filtran y formatean los datos expuestos hacia y desde el cliente.</li>
  <li><b>Servicios (Services / Repositories):</b> Contienen la lógica de negocio pura y la orquestación de datos.</li>
  <li><b>DAOs y Modelos (Data Access / Models):</b> Gestionan el acceso directo a la base de datos y la definición de esquemas.</li>
</ul>

<h5>🌲 Árbol de directorios</h5>
├── src/</br>
│   ├── app.js</br>
│   ├── server.js</br>
│   ├── config/ - # Configuración de entorno, Passport y DB</br>
│   ├── constants/ - # Enums y constantes globales</br>
│   ├── controllers/ - # Capa de Presentación (Manejo de req/res)</br>
│   ├── dao/ - # Objetos de Acceso a Datos (Persistencia)</br>
│   ├── dto/ - # Transformación de datos para transferencias</br>
│   ├── helpers/ - # Funciones auxiliares genéricas</br>
│   ├── middlewares/ - # Middlewares de Express (validaciones, roles, etc.)</br>
│   ├── models/ - # Esquemas y modelos (Mongoose / ORM)</br>
│   ├── public/ - # Archivos estáticos</br>
│   ├── repositories/ - # Patrón Repositorio (abstracción sobre DAOs)</br>
│   ├── routes/ - # Definición de endpoints y rutas</br>
│   ├── services/ - # Capa de Lógica de Negocio</br>
│   └── utils/ - # Utilidades generales (logger, BCrypt, etc.)</br>
├── tests/ - # Pruebas y testing</br>
├── .env.example</br>
├── .gitignore</br>
├── package.json</br>
└── README.md</br>

<h5>🪸 Variables de entorno</h5>
<strong>PORT:</strong> Puerto en el que escucha el servidor (ej: 8080)</br>
<strong>NODE_ENV:</strong> Entorno de ejecución (development, production)</br>
<strong>JWT_SECRET=</strong> password de usuario dummy en esta primera etapa hasta que comencemos a usar autenticacion de usuarios.</br>
<strong>JWT_EXPIRES_IN=</strong> tiempo de expiración del token.</br>
<strong>MONGO_URL:</strong> URI de conexión a la base de datos MongoDB ( ej: mongodb://localhost:27017/eventos )</br>
<strong>DB_NAME:</strong> Nombre de la base de datos en MongoDB (ej: "mibase")</br>

<h5>👩🏻‍💻 Instalación y Ejecución</h5>
<ol>
<li>Clonar el repositorio:</br>
<code>git clone &lt URL_DE_TU_REPOSITORIO &gt</code>
<code>cd &lt nombre-carpeta &gt</code>
</li>
<li>Instalar dependencias:</br>
<code>npm install [dependencie]</code>
</li>
<li>Configurar el entorno:</br>
<code>cp .env.example .env</code>
</li>
<li>Ejecutar en modo desarrollo:</br>
<code>npm run dev</code>
</li>
</ol>

<h5>📍 Rutas Disponibles (Endpoints)</h5>
<h6>GET /api/health</h6>
<ul>
<li>Muestra el estado del servidor</li>
<li>Ejemplo: localhost:3000/api/health</li>
<li>Respuesta esperada: <code>({ "status": "200", "message": "Servidor OK" })</code></li>
</ul>

<h6>GET /api/events</h6>
<ul>
<li>Muestra el listado completo de eventos</li>
<li>Ejemplo: localhost:3000/api/events</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>GET /api/events/:id</h6>
<ul>
<li>Trae un evento filtrado por su id de MongoDB</li>
<li>Ejemplo: localhost:3000/api/events/6a94c3e06cb44444444447e9</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>POST /api/events</h6>
<ul>
<li>Crea un nuevo evento</li>
<li>Ejemplo: localhost:3000/api/events</li>
<li>Datos: {
    "code": "",
"title": "",
"description": "",
"location": "",
"category": "",
"artist": "",
"date": "yyyy-mm-ddThh:mm:ssZ",
"startTime": "hh:mm",
"endTime": "hh:ss",
"price": ,
"totalTickets": ,
}</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>GET /api/users</h6>
<ul>
<li>Muestra el listado completo de usuarios</li>
<li>Ejemplo: localhost:3000/api/users</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>GET /api/users/email/:email</h6>
<ul>
<li>Filtra un usuario por su email</li>
<li>Ejemplo: localhost:3000/api/users/email/jorge@gmail.com</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>GET /api/users/email/:id</h6>
<ul>
<li>Filtra un usuario por su id de MongoDB</li>
<li>Ejemplo: localhost:3000/api/users/6a9c22222222202284b56a4</li>
<li>Respuesta esperada: <code>({ "status": "success", "payload": [] })</code></li>
</ul>

<h6>POST /api/users/register</h6>
<ul>
<li>Crea un nuevo usuario</li>
<li>Ejemplo: localhost:3000/api/users/register</li>
<li>Datos: {
    "first_name": "",
    "last_name": "",
    "email": "",
    "birth": "yyyy-mm-dd",
    "password": "12345678"
}</li>
<li>Respuesta esperada: <code>({ "status": "success", "message": "Usuario creado exitosamente", "payload": [] })</code></li>
</ul>

<h6>POST /api/sessions/login</h6>
<ul>
<li>Login de usuario</li>
<li>Ejemplo: localhost:3000/api/sessions/login</li>
<li>Datos: {
    "email": "",
    "password": ""
}</li>
<li>Respuesta esperada <code>({ "status": "success", "message": "Bienvenido $first_name $last_name", "payload": [] })</code></li>
</ul>

<ul>
<h6>GET /api/sessions/current</h6>
<li>Muestra la sesión activa</li>
<li>Ejemplo: localhost:3000/api/sessions/current</li>
<li>Respuesta esperada: <code>({ "status": "success", "message": "Detalles de la sesión activa", "payload": [] })</code></li>
</ul>

<h6>POST /api/sessions/logout</h6>
<ul>
<li>Cierra la sesión activa</li>
<li>Ejemplo: localhost:3000/api/sessions/logout</li>
<li>Respuesta esperada: <code>({ "status": "success", "message": "Gracias por visitarnos." })</code></li>
</ul>

<h5>🛂 Passport</h5>
<p>Estrategias implementadas: current, login y registro. La aplicación queda preparada para agregar nuevas estrategias de proveedores externos en passport.config.js.</p>

<h6>👩🏻‍💻 Sobre mi </h6>
<p>- Me llamo Gabriela, soy de Argentina y este proyecto corresponde a una práctica para mi curso de Backend II en Coderhouse.</p>
<p>- 📫 Podés encontrarme en **gabienelmundo@gmail.com**</p>

<h2>📷 Screenshots</h2>
<h3>Registro de usuarios: password hasheado y payload sin datos sensibles.</h3>
<p align="center">
  <img src="./assets/screenshot.png" alt="Captura de pantalla MongoDB Compass - Postman" width="500" />
</p>

<h3>Passport y flujo de autenticación: register → login → /current (200) → logout → /current (401)</h3>

<h4>Registro</h3>
<p align="center">
  <img src="./assets/registro.png" alt="Registro" width="500" />
</p>

<h4>Login</h3>
<p align="center">
  <img src="./assets/login.png" alt="Login" width="500" />
</p>

<h4>Current - Estado 200</h3>
<p align="center">
  <img src="./assets/current-200.png" alt="Current - Estado 200" width="500" />
</p>

<h4>Logout</h3>
<p align="center">
  <img src="./assets/logout.png" alt="Logout" width="500" />
</p>

<h4>Current - Estado 401</h3>
<p align="center">
  <img src="./assets/current-401.png" alt="Current - Estado 401" width="500" />
</p>
