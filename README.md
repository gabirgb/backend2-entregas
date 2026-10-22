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
<li>Passport-Github2</li>
</ul>

<h5>🏢 Arquitectura</h5>
<p>La API sigue una arquitectura en capas con separación de responsabilidades:</p>
<ul>
  <li><b>Rutas (Routes):</b> Definen los endpoints de la API y mapean las solicitudes hacia los controladores.</li>
  <li><b>Middlewares:</b> Capa intermedia encargada de la autenticación (`passportCall`), autorización basada en roles (`authorization`) y validación de propiedad de recursos (`verifyEventOwner`).</li>
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
│   ├── middlewares/ - # Middlewares para validaciones, roles, custom errors, passport, etc.</br>
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
<strong>CALLBACK_URL:</strong> URL de retorno una vez que el usuario fue autenticado en Github (URL completa para la consola de GitHub y para Passport).</br>
<strong>CALLBACK_PATH:</strong> Path relativo ÚNICAMENTE para la ruta de Express.</br>
<strong>CLIENT_SECRET:</strong> Clave de github.
<strong>CLIENT_ID:</strong> ID de Github.
<strong>USER_AGENT:</strong> Nombre del proyecto en Github.

<h5>🔐 Sistema de Roles y Matriz de Permisos</h5>
<p>El modelo de usuario incluye el campo <code>role</code> con los valores permitidos: <code>user</code>, <code>organizer</code> y <code>admin</code> (por defecto: <code>user</code>). El registro público fuerza automáticamente el rol a <code>user</code> para evitar la inyección ilícita de roles elevados desde el cliente.</p>
<table align="center">
  <thead>
    <tr>
      <th>Permiso / Acción</th>
      <th align="center">user 👤</th>
      <th align="center">organizer 🎟️</th>
      <th align="center">admin ⚡</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Consultar eventos publicados (<code>GET /api/events</code>)</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Crear nuevos eventos (<code>POST /api/events</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Modificar / cancelar eventos <b>propios</b> (<code>PUT/DELETE /api/events/:id</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Modificar / cancelar <b>cualquier</b> evento</td>
      <td align="center">❌ No</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Ver todos los usuarios (<code>GET /api/admin/users</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
    </tr>
  </tbody>
</table>

<h5>🚨 Manejo Explicito de Errores de Autenticación y Autorización</h5>
<p>La API distingue estrictamente la diferencia entre fallas de identificación y falta de privilegios:</p>
<ul>
  <li>
    <b>HTTP 401 Unauthorized:</b> Se responde cuando <b>NO hay una sesión válida</b> (falta el token JWT en la cookie <code>currentUser</code>, el token está expirado, o las credenciales de login son inválidas).
  </li>
  <li>
    <b>HTTP 403 Forbidden:</b> Se responde cuando <b>SI hay una sesión activa</b> pero el usuario no posee los permisos requeridos (ej. un <code>user</code> intentando crear un evento, o un <code>organizer</code> intentando modificar un evento que no le pertenece).
  </li>
</ul>

<h5>👩🏻‍💻 Instalación y Ejecución</h5>
<ol>
<li>Clonar el repositorio:</br>
<code>git clone &lt URL_DE_TU_REPOSITORIO &gt</code>
<code>cd &lt nombre-carpeta &gt</code>
</li>
<li>Instalar dependencias:</br>
<code>npm install [dependencies]</code>
</li>
<li>Configurar el entorno:</br>
<code>cp .env.example .env</code>
</li>
<li>Ejecutar en modo desarrollo:</br>
<code>npm run dev</code>
</li>
</ol>

<h5>📍 Rutas Disponibles (Endpoints)</h5>
<h6>Públicas</h6>
<ul>
  <li><code>GET /api/health</code> - Muestra el estado del servidor.</li>
  <li><code>GET /api/events</code> - Listado público de eventos.</li>
  <li><code>GET /api/events/:id</code> - Detalle público de un evento.</li>
  <li><code>POST /api/users/register</code> - Registro de nuevo usuario (fuerza rol <code>user</code>).</li>
  <li><code>POST /api/sessions/login</code> - Autenticación y generación de JWT en cookie HTTP-Only.</li>
  <li><code>GET /api/sessions/login/github</code> - Inicio de sesión vía GitHub OAuth2.</li>
</ul>
<h6>Protegidas (Requieren Autenticación)</h6>
<ul>
  <li>
    <code>GET /api/sessions/current</code>
    <ul>
      <li><b>Acceso:</b> Cualquier usuario autenticado (<code>401</code> si no hay sesión).</li>
      <li><b>Respuesta:</b> DTO del usuario autenticado sin datos sensibles.</li>
    </ul>
  </li>
  <li>
    <code>POST /api/sessions/logout</code>
    <ul>
      <li><b>Acceso:</b> Cualquier usuario autenticado. Limpia la cookie de sesión.</li>
    </ul>
  </li>
  <li>
    <code>POST /api/events</code>
    <ul>
      <li><b>Acceso:</b> Solo <code>organizer</code> o <code>admin</code> (<code>403</code> para rol <code>user</code>).</li>
      <li><b>Asignación:</b> El evento guarda automáticamente el <code>organizerId</code> del creador.</li>
    </ul>
  </li>
  <li>
    <code>PUT /api/events/:id</code> & <code>DELETE /api/events/:id</code>
    <ul>
      <li><b>Acceso:</b> <code>organizer</code> (solo si es el creador del evento) o <code>admin</code> (acceso total).</li>
      <li><b>Middleware:</b> <code>verifyEventOwner</code> valida la propiedad del recurso mediante el ID del organizador.</li>
    </ul>
  </li>
  <li>
    <code>GET /api/admin/users</code>
    <ul>
      <li><b>Acceso:</b> Exclusivo para <code>admin</code> (<code>403</code> para otros roles).</li>
      <li><b>Respuesta:</b> Listado completo de usuarios registrados mediante <code>UsersDTO</code>.</li>
    </ul>
  </li>
</ul>

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

<h5>🛂 Passport & Seguridad</h5>
<p>Estrategias implementadas en <code>passport.config.js</code>:</p>
<ul>
  <li><b><code>current</code>:</b> Extrae el token JWT desde la cookie <code>currentUser</code> para validar la sesión activa.</li>
  <li><b><code>login</code>:</b> Valida las credenciales (email y contraseña con <code>bcrypt</code>).</li>
  <li><b><code>registro</code>:</b> Crea nuevos usuarios con contraseñas hasheadas.</li>
  <li><b><code>github</code>:</b> Autenticación OAuth2 de terceros.</li>
</ul>

<h6>👩🏻‍💻 Sobre mi </h6>
<p>- Me llamo Gabriela, soy de Argentina y este proyecto corresponde a una práctica para mi curso de Backend II en Coderhouse.</p>
<p>- 📫 Podés encontrarme en **gabienelmundo@gmail.com**</p>

<h2>📷 Screenshots</h2>
<h3>Autorización: POST /api/events con user (403) y con organizer (201).</h3>
<p align="center">
  <img src="./assets/Screenshot 2026-10-21 223510.png" alt="Captura de pantalla de Postman - User (403)" width="500" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-10-21 223639.png" alt="Captura de pantalla de Postman - Organizer (201)" width="500" />
</p>

<h3>Autorización: ruta administrativa con organizer (403) vs admin (200).</h3>
<p align="center">
  <img src="./assets/Screenshot 2026-10-21 223932.png" alt="Captura de pantalla de Postman - Organizer (403)" width="500" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-10-21 224000.png" alt="Captura de pantalla de Postman - Admin (201)" width="500" />
</p>
