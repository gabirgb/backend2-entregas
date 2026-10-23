<h1 align="center">Esto es Eventeala 🎫</h1>
<h2 align="center">Una API para gestión de eventos orientada a talleres y charlas educativas</h2>

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
  <li><b>Middlewares:</b> Capa intermedia encargada de la autenticación (<code>passportCall</code>), autorización basada en roles (<code>authorization</code>) y validación de propiedad de recursos (<code>verifyEventOwner</code>).</li>
  <li><b>Controladores (Controllers):</b> Manejan la interacción HTTP (req/res), gestionan la autenticación con Passport y devuelven las respuestas JSON.</li>
  <li><b>DTOs (Data Transfer Objects):</b> Filtran y formatean los datos expuestos hacia y desde el cliente.</li>
  <li><b>Servicios (Services / Repositories):</b> Contienen la lógica de negocio pura y la orquestación de datos.</li>
  <li><b>DAOs y Modelos (Data Access / Models):</b> Gestionan el acceso directo a la base de datos y la definición de esquemas.</li>
</ul>

<h5>🌲 Árbol de directorios</h5>
<pre>
src/<br />
├── app.js<br />
├── server.js<br />
├── config/        # Configuración de entorno, Passport y DB<br />
├── constants/     # Enums y constantes globales<br />
├── controllers/   # Capa de Presentación (Manejo de req/res)<br />
├── dao/           # Objetos de Acceso a Datos (Persistencia)<br />
├── dto/           # Transformación de datos para transferencias<br />
├── helpers/       # Funciones auxiliares genéricas<br />
├── middlewares/   # Middlewares para validaciones, roles, custom errors, passport, etc.<br />
├── models/        # Esquemas y modelos (Mongoose / ORM)<br />
├── public/        # Archivos estáticos<br />
├── repositories/  # Patrón Repositorio (abstracción sobre DAOs)<br />
├── routes/        # Definición de endpoints y rutas<br />
├── services/      # Capa de Lógica de Negocio<br />
└── utils/         # Utilidades generales (logger, BCrypt, etc.)<br />
tests/             # Pruebas y testing<br />
├── .env.example<br />
├── .gitignore<br />
├── package.json<br />
└── README.md<br />
</pre>

<h5>🪸 Variables de entorno</h5>
<strong>PORT:</strong> Puerto en el que escucha el servidor (ej: 8080)<br/>
<strong>NODE_ENV:</strong> Entorno de ejecución (development, production)<br/>
<strong>JWT_SECRET:</strong> Secreto para la firma y verificación de tokens JWT.<br/>
<strong>JWT_EXPIRES_IN:</strong> Tiempo de expiración del token (ej: 24h).<br/>
<strong>MONGO_URL:</strong> URI de conexión a la base de datos MongoDB (ej: mongodb://localhost:27017/eventos)<br/>
<strong>DB_NAME:</strong> Nombre de la base de datos en MongoDB (ej: "eventeala")<br/>
<strong>CALLBACK_URL:</strong> URL de retorno OAuth2 de GitHub.<br/>
<strong>CALLBACK_PATH:</strong> Path relativo para la ruta de Express de GitHub.<br/>
<strong>CLIENT_SECRET:</strong> Clave privada de aplicación en GitHub.<br/>
<strong>CLIENT_ID:</strong> ID público de aplicación en GitHub.<br/>
<strong>USER_AGENT:</strong> Nombre del proyecto para GitHub App.<br/>

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
      <td>Consultar eventos y detalle (<code>GET /api/events</code>)</td>
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
      <td>Modificar eventos <b>propios</b> (<code>PUT /api/events/:id</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Cancelar eventos <b>propios</b> (<code>PATCH /api/events/:id/status</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Inscribirse a eventos (<code>POST /api/registrations</code>)</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Cancelar inscripción propia (<code>DELETE /api/registrations/:id</code>)</td>
      <td align="center">✅ Sí</td>
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
      <td>Ver todos los usuarios (<code>GET /api/users</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí</td>
    </tr>
  </tbody>
</table>

<h5>🚨 Manejo Explícito de Errores</h5>
<p>La API distingue estrictamente los códigos de respuesta de autorización y validación:</p>
<ul>
  <li><b>HTTP 400 Bad Request:</b> Errores de formato (fechas no ISO, horas con formato inválido), falta de datos obligatorios o violaciones de reglas de negocio (evento sin cupo, intento de editar evento cancelado/finalizado).</li>
  <li><b>HTTP 401 Unauthorized:</b> No hay una sesión activa o válida (falta el token JWT en la cookie <code>currentUser</code>, expiró o credenciales erróneas).</li>
  <li><b>HTTP 403 Forbidden:</b> Existe sesión pero el usuario no posee el rol o la propiedad sobre el recurso (ej. un <code>organizer</code> intentando editar un evento ajeno).</li>
  <li><b>HTTP 404 Not Found:</b> El ID consultado no existe en la base de datos o no coincide con ningún recurso.</li>
</ul>

<h5>📋 Reglas de Negocio Principales</h5>
<ol>
  <li><b>Formatos Temporales:</b>
    <ul>
      <li>Creación / Edición de eventos: Las fechas <code>fromDate</code> y <code>toDate</code> se requieren en formato ISO 8601 completo (ej: <code>2027-01-15T20:00:00Z</code>).</li>
      <li>Horarios: Se validan bajo el formato <code>HH:mm</code> de 24 horas.</li>
      <li>Filtros de búsqueda: Se aceptan en formato simple de calendario <code>YYYY-MM-DD</code>.</li>
    </ul>
  </li>
  <li><b>Control de Capacidad e Inscripciones:</b>
    <ul>
      <li>Índice compuesto único en Mongoose (<code>user</code> + <code>event</code>) que impide duplicar inscripciones.</li>
      <li>Se valida el cupo disponible (<code>capacity</code>) antes de registrar a un usuario.</li>
      <li>Al actualizar un evento, la capacidad no se puede reducir a un número menor que la cantidad de usuarios inscriptos activos.</li>
    </ul>
  </li>
  <li><b>Inmutabilidad de Eventos Inactivos:</b>
    <ul>
      <li>No se permite editar (<code>PUT</code>) ni re-cancelar eventos que tengan estado <code>finished</code> o <code>cancelled</code>.</li>
      <li>La cancelación es lógica (<code>status: "cancelled"</code>), sin borrado físico en la base de datos.</li>
    </ul>
  </li>
  <li><b>Propiedad de Recursos:</b>
    <ul>
      <li>Los eventos guardan de manera transparente el ID del organizador logueado mediante <code>req.user._id</code>. El cliente no puede inyectar este campo.</li>
    </ul>
  </li>
</ol>

<h5>📍 Rutas y Endpoints de la API</h5>

<h6>1. Entidad Eventos (<code>/api/events</code>)</h6>

<ul>
  <li>
    <code>GET /api/events</code>
    <ul>
      <li><b>Rol requerido:</b> Público (No requiere autenticación).</li>
      <li><b>Descripción:</b> Obtiene el listado de eventos de forma paginada y ordenada.</li>
      <li><b>Filtros disponibles (Query Parameters):</b>
        <ul>
          <li><code>page</code>: Número de página (default: 1).</li>
          <li><code>limit</code>: Elementos por página (default: 10, máx: 50).</li>
          <li><code>sort</code>: Ordenamiento permitido (<code>date</code>, <code>-date</code>, <code>price</code>, <code>-price</code>, <code>title</code>, <code>-title</code>).</li>
          <li><code>status</code>: Filtra por estado (<code>draft</code>, <code>published</code>, <code>finished</code>, <code>cancelled</code>).</li>
          <li><code>fromDate</code>: Fecha mínima de búsqueda en formato <code>YYYY-MM-DD</code>.</li>
          <li><code>toDate</code>: Fecha máxima de búsqueda en formato <code>YYYY-MM-DD</code>.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <code>GET /api/events/:id</code>
    <ul>
      <li><b>Rol requerido:</b> Público.</li>
      <li><b>Descripción:</b> Obtiene los detalles de un evento específico por su ObjectId.</li>
    </ul>
  </li>
  <li>
    <code>POST /api/events</code>
    <ul>
      <li><b>Rol requerido:</b> <code>organizer</code> o <code>admin</code>.</li>
      <li><b>Descripción:</b> Crea un nuevo evento. El organizador se asocia automáticamente a la sesión del usuario.</li>
      <li><b>Body de ejemplo:</b>
<pre>json
{<br />
  "code": "S011",<br />
  "title": "Taller de Node.js Avanzado",<br />
  "description": "Aprende arquitectura en capas y Mongoose.",<br />
  "location": "Aulas Coderhouse",<br />
  "category": "Educacion",<br />
  "artist": "Profe Backend",<br />
  "fromDate": "2027-01-15T20:00:00Z",<br />
  "toDate": "2027-01-15T23:00:00Z",<br />
  "startTime": "20:00",<br />
  "endTime": "23:00",<br />
  "price": 10000,<br />
  "capacity": 50,<br />
  "status": "published"<br />
}
</pre>
      </li>
    </ul>
  </li>
  <li>
    <code>PUT /api/events/:id</code>
    <ul>
      <li><b>Rol requerido:</b> <code>organizer</code> (dueño del evento) o <code>admin</code>.</li>
      <li><b>Descripción:</b> Actualización parcial o total de los datos de un evento activo.</li>
    </ul>
  </li>
  <li>
    <code>PATCH /api/events/:id/status</code>
    <ul>
      <li><b>Rol requerido:</b> <code>organizer</code> (dueño del evento) o <code>admin</code>.</li>
      <li><b>Descripción:</b> Cancelación lógica del evento. Cambia el estado a <code>cancelled</code>.</li>
    </ul>
  </li>
</ul>

<h6>2. Entidad Inscripciones (<code>/api/registrations</code>)</h6>

<ul>
  <li>
    <code>POST /api/registrations</code>
    <ul>
      <li><b>Rol requerido:</b> <code>user</code>, <code>organizer</code> o <code>admin</code>.</li>
      <li><b>Descripción:</b> Registra la inscripción del usuario logueado a un evento activo. Se valida cupo y duplicados.</li>
      <li><b>Body de ejemplo:</b>
<pre>json
{
  "eventId": "654a12345678901234567890"
}
</pre>
      </li>
    </ul>
  </li>
  <li>
    <code>GET /api/registrations/my-registrations</code>
    <ul>
      <li><b>Rol requerido:</b> Usuario autenticado.</li>
      <li><b>Descripción:</b> Lista todas las inscripciones del usuario en sesión.</li>
    </ul>
  </li>
  <li>
    <code>DELETE /api/registrations/:id</code>
    <ul>
      <li><b>Rol requerido:</b> Dueño de la inscripción o <code>admin</code>.</li>
      <li><b>Descripción:</b> Cancela una inscripción y libera un cupo en el evento.</li>
    </ul>
  </li>
</ul>

<h6>3. Entidad Sesiones y Usuarios (<code>/api/sessions</code> y <code>/api/users</code>)</h6>

<ul>
  <li><code>POST /api/users/register</code> - Registro público (fuerza rol <code>user</code>).</li>
  <li><code>POST /api/sessions/login</code> - Inicio de sesión. Genera JWT en cookie HTTP-Only.</li>
  <li><code>GET /api/sessions/current</code> - Retorna DTO del usuario autenticado sin datos sensibles.</li>
  <li><code>POST /api/sessions/logout</code> - Destruye la cookie de sesión.</li>
  <li><code>GET /api/users</code> - Exclusivo para <code>admin</code>. Lista todos los usuarios registrados.</li>
</ul>

<h5>👩🏻‍💻 Sobre mi</h5>
<p>- Me llamo Gabriela, soy de Argentina y este proyecto corresponde a una práctica para mi curso de Backend II en Coderhouse.</p>
<p>- 📫 Podés encontrarme en <b>gabienelmundo@gmail.com</b></p>

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

<h3>Filtros y validación de reglas de negocio</h3>

<h2>Creación y Validación de Eventos</h2>
<p>Intentar crear un evento autenticado como rol user.<br />
Esperado: Error 403 Forbidden </p>
<img src="./assets/Screenshot 2026-10-22 232221.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<p>Crear un evento exitosamente autenticado como organizer o admin enviando el body correcto con formato de fecha ISO (YYYY-MM-DDTHH:mm:ssZ) y el campo capacity<br />
Esperado:201 Created (o 200 OK) y guardado del ID del evento creado (event_id_A).</p>
<img src="./assets/Screenshot 2026-10-22 233928.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<h2>Consultas y Filtros de Eventos</h2>
<p>Probar filtros por estado (?status=published) y rangos de fecha simples (?fromDate=...&toDate=...).</p>
<img src="./assets/Screenshot 2026-10-23 003006.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<p>Consultar el detalle de un evento específico mediante GET /api/events/:id</p>
<img src="./assets/Screenshot 2026-10-23 003055.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<h2>Modificación, Permisos y Propiedad de Recursos (Ownership)</h2>
<p>Loguearse como Organizer B e intentar actualizar o cancelar el evento creado por el Organizer A (PUT /api/events/:id o PATCH /api/events/:id/status) <br />
Esperado: Error 403 Forbidden por validación de verifyEventOwner.</p>
<img src="./assets/Screenshot 2026-10-22 235820.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<p>Loguearse como el Organizer A (dueño) y modificar con éxito los datos del evento (ej. ubicación o precio).<br />
Esperado: 200 OK.</p>
<img src="./assets/Screenshot 2026-10-23 000704.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<p>Loguearse como Admin y realizar una actualización o cancelación sobre el evento de cualquier organizador.<br />
Esperado: 200 OK (demuestra acceso total del administrador).</p>
<img src="./assets/Screenshot 2026-10-23 001438.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<h2>Control de Estados e Inmutabilidad</h2>

<p>Intentar editar un evento que se encuentra en estado cancelled o finished.<br />
Esperado: Error 400 Bad Request (No se puede editar un evento que ya ha finalizado/cancelado).</p>
<img src="./assets/Screenshot 2026-10-23 002420.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />
