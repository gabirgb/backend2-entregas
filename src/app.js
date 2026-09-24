import express from 'express';
import { router as eventsRouter } from './routes/events.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/log.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from './middlewares/auth.js';
import cookieParser from 'cookie-parser';
import { verifySameOrigin } from './middlewares/verifySameOrigin.js';

const app = express();

// defino mi carpeta de archivos estaticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//MMIDLEWARES BASICOS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(verifySameOrigin);

//ROUTES
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// ENDPOINTS BASICOS
//-home
app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.status(200).send('<h1>Bienvenido a mi app de Venta de Tickets para Talleres y Cursos.</h1>');
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

// Manejo de errores
app.use(errorHandler);

export default app;