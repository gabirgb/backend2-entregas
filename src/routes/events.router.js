import { Router } from "express";
import { eventsController, eventsService } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.js";
import { verifyEventOwner } from "../middlewares/verifyEventOwner.js";

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

// Modificar evento propio u de cualquiera si es Admin
router.put(
    '/:id',
    passportCall('current'),
    authorization('organizer', 'admin'),
    verifyEventOwner(eventsService),
    eventsController.updateEvent
);

// Cancelar / Eliminar evento
router.delete(
    '/:id',
    passportCall('current'),
    authorization('organizer', 'admin'),
    verifyEventOwner(eventsService),
    eventsController.deleteEvent
);