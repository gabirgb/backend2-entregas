import { Router } from "express";
import { SessionsController } from "../controllers/sessions.controller.js";
import { auth } from "../middlewares/auth.js";

export const router = Router();
router.use(auth);
// Instanciamos el controlador
const sessionsController = new SessionsController();

// Mapeamos los endpoints iniciales
router.get('/current', sessionsController.getCurrentSession);
router.post('/login', sessionsController.login);
router.post('/logout', sessionsController.logout);