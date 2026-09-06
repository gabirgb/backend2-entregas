import { Router } from "express";
import { sessionsController } from "../controllers/index.js";
//import { auth } from "../middlewares/auth.js";

export const router = Router();
//router.use(auth);
// Instanciamos el controlador

// Mapeamos los endpoints iniciales
router.get('/current', sessionsController.getCurrentSession);
router.post('/login', sessionsController.login);
router.post('/logout', sessionsController.logout);