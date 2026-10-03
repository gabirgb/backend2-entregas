import { Router } from "express";
import { sessionsController } from "../controllers/sessions.controller.js";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
import { config } from '../config/config.js'

export const router = Router();

// current user
router.get('/current', passportCall('current'), sessionsController.getCurrentSession);
// login
router.post('/login', passportCall('login'), sessionsController.login);

// Github App OAuth
// 1. Redirección: passport.authenticate directo (sin scope en la llamada)
router.get('/login/github', passport.authenticate('github', { session: false, failureRedirect: '/login' }))
//2. Callback: passportCall para procesar el resultado de la estrategia
router.get(config.github.CALLBACK_PATH, passportCall('github', { failureRedirect: '/' }, sessionsController.loginGithub))

// logout sin passport
router.get('/logout', sessionsController.logout);