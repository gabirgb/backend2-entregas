import express from 'express';
import { router as eventsRouter } from './routes/events.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/log.js';

const app = express();

//MMIDLEWARES BASICOS
//parsear la request del servidor
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
app.get('/api/health', logger, (req, res) => {
    if (req.query.error) {
        throw new Error("Error de pruebas!");
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json("Test ok!!");
});

//MMIDLEWARES BASICOS
// Manejo de errores
app.use(errorHandler);

export default app;