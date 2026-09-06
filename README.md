<h1 align="center">Esto es Eventeala 🎫</h1>
<h2 align="center">Una API para gestión de eventos (WIP) orientada a talleres y charlas educativas</h2>

<h3 align="center">Información técnica del proyecto</h3>
<h4>🧱 Stack</h4>
Node.js (usando ESM) con las siguientes dependencias:
<ul>
<li>Express</li>
<li>Mongoose</li>
<li>bcrypt</li>
<li>dotenv</li>
</ul>

<h5>🏢 Arquitectura</h5>
La API sigue una arquitectura en capas con separación de responsabilidades:
<ul>
<li>Enrutadores: Definen los endpoints y dirigen las solicitudes.</li>
<li>Controladores: Manejan el flujo de la petición HTTP, validan la entrada y envían la respuesta en formato JSON.</li>
<li>Servicios: Contienen la lógica de negocio y las reglas de la aplicación.</li>
<li>DAOs: Gestionan el acceso y la persistencia de datos (persistencia desacoplada).</li>
<li>Modelos: Definen los esquemas y estructuras de los datos.</li>
</ul>
<h5>🌲 Árbol de directorios</h5>
├── src/</br>
│   ├── app.js</br>
│   ├── server.js</br>
│   ├── config/</br>
│   ├── controllers/</br>
│   ├── constatnts/</br>
│   ├── dao/</br>
│   ├── helpers/</br>
│   ├── middlewares/</br>
│   ├── models/</br>
│   ├── repositories/</br>
│   ├── routes/</br>
│   ├── services/</br>
│   └── utils/</br>
├── .env.example</br>
├── .gitignore</br>
├── package.json</br>
└── README.md</br>

<h5>🪸 Variables de entorno</h5>
<strong>PORT:</strong> Puerto en el que escucha el servidor (ej: 8080)</br>
<strong>NODE_ENV:</strong> Entorno de ejecución (development, production)</br>
<strong>USER_DUMMY:</strong> nombre de usuario dummy en esta primera etapa hasta que comencemos a usar autenticacion de usuarios.</br>
<strong>SECRET_DUMMY:</strong> password de usuario dummy en esta primera etapa hasta que comencemos a usar autenticacion de usuarios.</br>
<strong>MONGO_URI:</strong> URI de conexión a la base de datos MongoDB ( ej: mongodb://localhost:27017/eventos )</br>
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
<ul>
<li>GET /api/health → Estado del servidor ({ "status": "200", "message": "Servidor OK" })</li>
</ul>
<ul>
<li>GET /api/events → Listado de eventos ({ "status": "success", "payload": [] })</li>
<li>GET /api/events/:id → Traigo un evento por ID ({ "status": "success", "payload": [] })</li>
<li>POST /api/events → Crea un nuevo evento ({ "status": "success", "payload": [] })</li>
</ul>
<ul>
<li>GET /api/users → Listado de eventos ({ "status": "success", "payload": [] })</li>
<li>GET /api/users/email/:email → Traigo un usuario por email ({ "status": "success", "payload": [] })</li>
<li>POST /api/users/register → Creo un nuevo usuario ({ "status": "success", "message": "Usuario creado exitosamente", "payload": [] })</li>
</ul>
<ul>
<li>POST /api/sessions/login → Login de usuario ({ "status": "success", "message": "Bienvenido $first_name $last_name", "payload": [] })</li>
<li>GET /api/sessions/current → Sesión activa ({ "status": "success", "message": "Endpoint de sesión actual (sin lógica de auth aún)", "payload": null })</li>
<li>POST /api/sessions/logout → Cierra la sesión activa ({ "status": "success", "message": "Endpoint de logout (placeholder)" })</li>
</ul>

<h5>👩🏻‍💻 Sobre mi </h5>
- Me llamo Gabriela, soy de Argentina y este proyecto corresponde a una práctica para mi curso de Backend II en Coderhouse.
- 📫 Podés encontrarme en **gabienelmundo@gmail.com**
