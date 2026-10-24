import { Router } from "express";
import { eventsController } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.js";

export const router = Router();

// Consultas públicas
router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventsById);

// Crear eventos (Organizer o Admin)
router.post(
    '/',
    passportCall('current'),
    authorization('organizer', 'admin'),
    eventsController.createEvent
);

// Modificar evento propio o de cualquiera si es Admin
router.put(
    '/:id',
    passportCall('current'),
    authorization('organizer', 'admin'),
    eventsController.updateEvent
);

// Cancelar/actualizar estado del evento
router.patch(
    '/:id/status',
    passportCall('current'),
    authorization('admin', 'organizer'),
    eventsController.cancelEvent
);