import { Router } from "express";
import { eventsController } from "../controllers/index.js";

export const router = Router();

router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventsById);
router.post('/', eventsController.createEvent);

