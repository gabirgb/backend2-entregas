import { Router } from "express";
import { registrationsController } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.js";

export const router = Router();

// 1. POST /api/registrations/events/:eid - Inscribirse a un evento
router.post(
    "/events/:eid",
    passportCall("current"),
    registrationsController.registerUserToEvent
);

// 2. GET /api/registrations/my-registrations - Ver mis inscripciones
router.get(
    "/my-registrations",
    passportCall("current"),
    registrationsController.getUserRegistrations
);

// 3. GET /api/registrations/events/:eid - Ver inscripciones de un evento (Organizer/Admin)
router.get(
    "/events/:eid",
    passportCall("current"),
    authorization(["organizer", "admin"]),
    registrationsController.getEventRegistrations
);

// 4. PATCH /api/registrations/:tid/cancel - Cancelar inscripción
router.patch(
    "/:tid/cancel",
    passportCall("current"),
    registrationsController.cancelRegistration
);