import { Router } from "express";
import { registrationsController } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";

export const router = Router();

// Endpoints protegidos con Passport ('current')
router.post(
    "/",
    passportCall("current"),
    registrationsController.registerUserToEvent
);

router.get(
    "/my-registrations",
    passportCall("current"),
    registrationsController.getUserRegistrations
);

router.delete(
    "/:id",
    passportCall("current"),
    registrationsController.cancelRegistration
);