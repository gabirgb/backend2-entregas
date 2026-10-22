// config de directorios base
import { fileURLToPath } from 'url';
import path from 'path';

import express from 'express';

//ruteadores
import { router as eventsRouter } from './routes/events.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as adminRouter } from './routes/admin.router.js';

//middlewares
import { errorHandler } from './middlewares/errorHandler.js';

//sesiones
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { inicializarPassport } from './config/passport.config.js';
import { passportCall } from './middlewares/passportCall.js';

//autorizacion
import { authorization } from './middlewares/authorization.js';

//DTOs
import { UsersDTO } from './dto/users.dto.js';

const app = express();

// defino mi carpeta de archivos estaticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//MMIDLEWARES BASICOS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport
app.use(passport.initialize());
inicializarPassport();

// Cookies
app.use(cookieParser());

//ruteadores
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/admin', adminRouter);

// ENDPOINTS BASICOS
//-home
app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.status(200).send('<h1>Bienvenido a mi app de Venta de Tickets para Talleres y Cursos.</h1>');
});

app.get(
    '/test',
    passportCall('current'),
    authorization("user", "admin"),
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            payload: `Usted tiene acceso a este recurso porque está autenticado con email ${req.user.email} y autorizado con permisos ${req.user.role}`,
            user: new UsersDTO(req.user)
        });
    }
);

//-health
app.get('/api/health', (req, res) => {
    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json("Servidor OK");
});

// Manejo de errores
app.use(errorHandler);

export default app;