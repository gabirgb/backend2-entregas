import express from 'express';
// lo importo con alias porque seguro tendré varios routers en mi app
import { router as eventsRouter } from './routes/events.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/log.js';

const app = express();

//middlewares basicos para parsear la request del servidor y handlers de errores
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

//endpoints
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

//middleware para manejar errores
app.use(errorHandler);

export default app;