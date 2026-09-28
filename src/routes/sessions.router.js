import { Router } from "express";
import { sessionsController } from "../controllers/sessions.controller.js";
import passport from "passport";

export const router = Router();

// current user
router.get(
    '/current',
    passport.authenticate(
        "current",
        {
            session: false,
            failureRedirect: "/error"
        }
    ),
    sessionsController.getCurrentSession);

// login
router.post(
    '/login',
    passport.authenticate(
        "login",
        {
            session: false,
            failureRedirect: "/error"
        }
    ),
    sessionsController.login);

// logout sin passport
router.get('/logout', sessionsController.logout);