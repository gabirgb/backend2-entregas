// para llamar a las variables de entorno node se conecta con los procesos del sistema operativo usando el objeto process.
// si yo no tengo realmente estas .env corriendo en mi SO, la llamada me va a dar undefined, SALVO que tenga instalado dotenv (que me levanta el arch .env y las conecta al config). Tambien puedo usar el método del objeto precess "loadEnvFile()" que hace lo mismo que dotenv (es una f nueva porterior a la creacion de la dependencia dotenv)

process.loadEnvFile("./.env");

export const config = {
    // puedo llamar las env sueltas o agruparlas en objetos para que queden más ordenadas, sobre todo si son muchas.
    PORT: process.env.PORT,
    general: {
        SECRET: process.env.SECRET,
    },
    database: {
        MONGO_URI: process.env.MONGO_URI,
        DB_NAME: process.env.DB_NAME,
    }
}

// para checkear qué vars de entorno estoy viendo:
//console.log(config)

//TODO: configurar node_env: development