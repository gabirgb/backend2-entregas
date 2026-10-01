import { Router } from "express";
import { sessionsController } from "../controllers/sessions.controller.js";
import { passportCall } from "../middlewares/passportCall.js";

export const router = Router();

// current user
router.get('/current', passportCall('current'), sessionsController.getCurrentSession);
// login
router.post('/login', passportCall('login'), sessionsController.login);
// logout sin passport
router.get('/logout', sessionsController.logout);