// Punto de entrada para levantar el servicio
import app from './app.js';
import { config } from './config/config.js';
import { connDB } from './config/db.js';

const PORT = config.PORT;

//inicio el servidor
const startServer = async () => {
    try {
        await connDB(config.database.MONGO_URI, config.database.DB_NAME);

        const server = app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${server.address().port}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();