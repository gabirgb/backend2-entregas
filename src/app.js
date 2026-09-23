import express from 'express';
import { router as eventsRouter } from './routes/events.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/log.js';
import { config } from './config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from './middlewares/auth.js';

const app = express();

// defino mi carpeta de archivos estaticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//MMIDLEWARES BASICOS
//parsear la request del servidor y logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
// eventsRouter: getAll, getById, createEvent, updateEvent, deleteEvent
app.use('/api/events', eventsRouter);
// usersRouter: getById, getByEmail, createUser
app.use('/api/users', usersRouter);
// SessionsRouter: login, logout, getCurrentSession
app.use('/api/sessions', sessionsRouter);

// ENDPOINTS BASICOS
//-home
app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.status(200).send('<h1>Bienvenido a mi app de Venta de Tickets para eventos.</h1>');
});

//-health
app.get('/api/health', requestLogger, (req, res) => {
    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json("Servidor OK");
});

//-tests
app.get('/test', auth, (req, res) => {
    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        payload: "Test ok!!",
        user: req.user.nombre
    });
});

//MMIDLEWARES BASICOS
// Manejo de errores
app.use(errorHandler);

export default app;