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
<li>Nodemailer</li>
</ul>

<h5>🏢 Arquitectura en Capas (Módulo 8)</h5>
<p>La API sigue estrictamente una arquitectura en capas formal con separación de responsabilidades e inyección de dependencias:</p>
<ul>
  <li><b>Rutas (Routes):</b> Definen los endpoints de la API, aplican autenticación/roles generales y derivan las peticiones a los controladores.</li>
  <li><b>Middlewares:</b> Capa de transporte encargada de la autenticación por token (<code>passportCall</code>), la autorización basada en roles (<code>authorization</code>) y la gestión centralizada de errores (<code>errorHandler</code>).</li>
  <li><b>Controladores (Controllers):</b> Manejan la interacción HTTP (extraen <code>req.body</code>, <code>req.params</code>, <code>req.query</code>), delegan la ejecución a los servicios y devuelven respuestas formateadas mediante DTOs.</li>
  <li><b>DTOs (Data Transfer Objects):</b> Limpian, sanean y estructuran las respuestas enviadas al cliente (<code>UsersDTO</code>, <code>EventsDTO</code>, <code>RegistrationDTO</code>), garantizando la no filtración de contraseñas u otros datos sensibles.</li>
  <li><b>Servicios (Services):</b> Encapsulan la lógica de negocio pura, sanitizan inputs, aplican validaciones de dominio y verifican la propiedad de los recursos. Consumen exclusivamente Repositorios.</li>
  <li><b>Repositorios (Repositories):</b> Abstraen el acceso a datos actuando como puente entre el dominio y la persistencia. Consumen únicamente DAOs.</li>
  <li><b>DAOs y Modelos (Data Access / Models):</b> Gestionan el acceso directo a la base de datos MongoDB mediante esquemas de Mongoose con operaciones optimizadas (<code>.lean()</code>).</li>
</ul>

<h5>🌲 Árbol de directorios</h5>
<pre>
src/<br />
├── app.js<br />
├── server.js<br />
├── config/        # Configuración de entorno, Passport, DB y Nodemailer<br />
├── constants/     # Enums y constantes globales<br />
├── controllers/   # Capa de Presentación (req/res e inyección en index.js)<br />
├── dao/           # Objetos de Acceso a Datos (Persistencia Mongoose)<br />
├── dto/           # Transformación y filtrado seguro de datos (DTOs)<br />
├── helpers/       # Funciones auxiliares genéricas y validadores de fechas/usuarios<br />
├── middlewares/   # Middlewares (passportCall, authorization, errorHandler)<br />
├── models/        # Esquemas y modelos de Mongoose<br />
├── public/        # Archivos estáticos<br />
├── repositories/  # Patrón Repositorio (abstracción sobre DAOs)<br />
├── routes/        # Definición de endpoints y ruteadores<br />
├── services/      # Capa de Lógica de Negocio y Reglas de Dominio<br />
└── utils/         # Utilidades generales (sanitizer, BCrypt, mailer services, CustomError)<br />
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
<strong>MAIL_HOST:</strong> Servidor SMTP para el envío de correos (ej: sandbox.smtp.mailtrap.io)<br/>
<strong>MAIL_PORT:</strong> Puerto del servidor SMTP (ej: 2525 o 587)<br/>
<strong>MAIL_USER:</strong> Usuario de autenticación SMTP<br/>
<strong>MAIL_PASS:</strong> Contraseña de autenticación SMTP<br/>
<strong>MAIL_FROM:</strong> Remitente por defecto de los correos (ej: Eventeala Soporte &lt;no-reply@eventeala.com&gt;)<br/>

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
      <td>Inscribirse a eventos (<code>POST /api/registrations/events/:eid</code>)</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Ver inscripciones de un evento (<code>GET /api/registrations/events/:eid</code>)</td>
      <td align="center">❌ No</td>
      <td align="center">✅ Sí (dueño)</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Cancelar inscripción propia (<code>PATCH /api/registrations/:tid/cancel</code>)</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
      <td align="center">✅ Sí</td>
    </tr>
    <tr>
      <td>Modificar / cancelar <b>cualquier</b> evento o registro</td>
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
<p>La API distingue estrictamente los códigos de respuesta de autorización y validación mediante clases hijas de <code>CustomError</code>:</p>
<ul>
  <li><b>HTTP 400 Bad Request:</b> Errores de formato (fechas no ISO, horas con formato inválido), falta de datos obligatorios o violaciones de reglas de negocio (evento sin cupo, intento de editar evento cancelado/finalizado, inscripción duplicada activa).</li>
  <li><b>HTTP 401 Unauthorized:</b> No hay una sesión activa o válida (falta el token JWT en la cookie, expiró o credenciales erróneas).</li>
  <li><b>HTTP 403 Forbidden:</b> Existe sesión pero el usuario no posee el rol o la propiedad sobre el recurso (ej. un <code>organizer</code> intentando editar un evento ajeno o ver inscripciones sin ser dueño). La validación de propiedad de recursos la realiza internamente el Servicio (<code>EventsServices</code>).</li>
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
      <li>Se valida el cupo disponible (<code>capacity</code>) restando únicamente las inscripciones con estado activo (las canceladas no ocupan cupo).</li>
      <li>Al actualizar un evento, la capacidad no se puede reducir a un número menor que la cantidad de usuarios inscriptos activos.</li>
    </ul>
  </li>
  <li><b>Inmutabilidad de Eventos Inactivos:</b>
    <ul>
      <li>No se permite editar (<code>PUT</code>) ni re-cancelar eventos que tengan estado <code>finished</code> o <code>cancelled</code>.</li>
      <li>La cancelación de eventos e inscripciones es lógica (<code>status: "cancelled"</code>), sin borrado físico en la base de datos.</li>
    </ul>
  </li>
  <li><b>Notificaciones por Correo (Nodemailer):</b>
    <ul>
      <li>Al registrarse exitosamente a un evento, el sistema genera un código de reserva único (<code>codigoReserva</code>) y envía automáticamente un correo de confirmación al email del usuario utilizando Nodemailer y plantillas HTML.</li>
    </ul>
  </li>
  <li><b>Propiedad de Recursos (Ownership en Services):</b>
    <ul>
      <li>Los eventos guardan de manera transparente el ID del organizador logueado mediante <code>req.user._id</code>. Los métodos del servicio de eventos validan si el usuario que intenta modificar o cancelar es el creador o un <code>admin</code>.</li>
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

<h6>2. Entidad Inscripciones y Tickets (<code>/api/registrations</code>)</h6>

<ul>
  <li>
    <code>POST /api/registrations/events/:eid</code>
    <ul>
      <li><b>Rol requerido:</b> <code>user</code>, <code>organizer</code> o <code>admin</code>.</li>
      <li><b>Descripción:</b> Registra la inscripción del usuario logueado a un evento activo. Valida cupos, duplicados activos, genera un código de reserva único y envía email de confirmación vía Nodemailer.</li>
      <li><b>Body de ejemplo:</b>
<pre>json
{
  "quantity": 1
}
</pre>
      </li>
    </ul>
  </li>
  <li>
    <code>GET /api/registrations/my-registrations</code>
    <ul>
      <li><b>Rol requerido:</b> Usuario autenticado.</li>
      <li><b>Descripción:</b> Lista todas las inscripciones del usuario en sesión con populate de los datos del evento.</li>
    </ul>
  </li>
  <li>
    <code>GET /api/registrations/events/:eid</code>
    <ul>
      <li><b>Rol requerido:</b> <code>organizer</code> (dueño del evento) o <code>admin</code>.</li>
      <li><b>Descripción:</b> Lista todas las inscripciones asociadas a un evento específico.</li>
    </ul>
  </li>
  <li>
    <code>PATCH /api/registrations/:tid/cancel</code>
    <ul>
      <li><b>Rol requerido:</b> Dueño de la inscripción o <code>admin</code>.</li>
      <li><b>Descripción:</b> Realiza una cancelación lógica de la inscripción (cambia estado a <code>cancelled</code> y registra <code>cancelledAt</code>) liberando automáticamente el cupo en el evento.</li>
    </ul>
  </li>
</ul>

<h6>3. Entidad Sesiones y Usuarios (<code>/api/sessions</code> y <code>/api/users</code>)</h6>

<ul>
  <li><code>POST /api/users/register</code> - Registro público (fuerza rol <code>user</code>).</li>
  <li><code>POST /api/sessions/login</code> - Inicio de sesión. Genera JWT en cookie HTTP-Only.</li>
  <li><code>GET /api/sessions/current</code> - Retorna <code>UsersDTO</code> del usuario autenticado sin datos sensibles.</li>
  <li><code>POST /api/sessions/logout</code> - Destruye la cookie de sesión.</li>
  <li><code>GET /api/users</code> - Exclusivo para <code>admin</code>. Lista todos los usuarios registrados procesados vía DTO.</li>
</ul>

<h5>👩🏻‍💻 Sobre mí</h5>
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
Esperado: 201 Created y guardado del ID del evento creado.</p>
<img src="./assets/Screenshot 2026-10-22 233928.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<h2>Consultas y Filtros de Eventos</h2>
<p>Probar filtros por estado (?status=published) y rangos de fecha simples (?fromDate=...&toDate=...).</p>
<img src="./assets/Screenshot 2026-10-23 003006.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<p>Consultar el detalle de un evento específico mediante GET /api/events/:id</p>
<img src="./assets/Screenshot 2026-10-23 003055.png" alt="Captura de pantalla de Postman - Reglas de Negocio" width="500" />

<h2>Modificación, Permisos y Propiedad de Recursos (Ownership)</h2>
<p>Loguearse como Organizer B e intentar actualizar o cancelar el evento creado por el Organizer A (PUT /api/events/:id o PATCH /api/events/:id/status) <br />
Esperado: Error 403 Forbidden por validación de permisos en el servicio.</p>
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

<h3>Registro a eventos e Emails de confirmación usando Nodemailer</h3>

<h2>Registro al evento</h2>
<p>Inscripción a un evento autenticado con rol user.<br />
Esperado: 201 Created </p>
<img src="./assets/Screenshot 2026-10-23 222509.png" alt="Captura de pantalla de Postman - Registro al evento" width="500" />

<h2>Validación de registro duplicado</h2>
<p>El usuario no se puede inscribir más de una vez al mismo evento.<br />
Esperado: Error 400 Bad Request (indicando que el usuario ya se encuentra inscripto y activo en este evento)</p>
<img src="./assets/Screenshot 2026-10-23 222529.png" alt="Captura de pantalla de Postman - Validación de registro duplicado" width="500" />

<h2>Consultar mis inscripciones</h2>
<p>El usuario puede ver sus inscripciones activas junto con los datos del evento mediante el 'populate'.<br />
Esperado: 200 OK</p>
<img src="./assets/Screenshot 2026-10-23 222639.png" alt="Captura de pantalla de Postman - Consultar mis inscripciones" width="500" />

<h2>Cancelación lógica y liberación de cupo</h2>
<p>El usuario puede cancelar su inscripción.<br />
Esperado: 200 OK (indicando que la inscripción fue cancelada correctamente y el cupo liberado).</p>
<img src="./assets/Screenshot 2026-10-23 222748.png" alt="Captura de pantalla de Postman - Cancelación lógica y liberación de cupo" width="500" />

<h2>Notificaciones por email</h2>
<p>El usuario recibe las notificaciones vía email cuando se registra o cancela su participación en un evento.</p>
<img src="./assets/Screenshot 2026-10-23 231121.png" alt="Captura de pantalla de Mailtrap - Notificaciones por email" width="500" />
