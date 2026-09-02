<h1 align="center">Esto es Eventeala 🎫</h1>
<h2 align="center">Una API para gestión de eventos orientada a talleres y charlas educativas.</h2>

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
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── constatnts/
│   ├── dao/
│   ├── helpers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md

</br>
<h5>🪸 Variables de entorno</h5>
</br>
PORT: Puerto en el que escucha el servidor (ej: 8080)
NODE_ENV: Entorno de ejecución (development, production)
MONGO_URI: URI de conexión a la base de datos MongoDB ( ej: mongodb://localhost:27017/eventos )
DB_NAME: Nombre de la base de datos en MongoDB (ej: "mibase")

</br>
<h5>👩🏻‍💻 Instalación y Ejecución</h5>
</br>

<ol>
<li>Clonar el repositorio:</br>
git clone &gt URL_DE_TU_REPOSITORIO></br>
cd <nombre-carpeta></br>
</li>
</ol>

- 📫 You can reach me at **gabienelmundo@gmail.com**
