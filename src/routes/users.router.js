import { Router } from "express";
import { usersController } from "../controllers/index.js";
import { logger } from "../middlewares/log.js";
import { auth } from "../middlewares/auth.js";

export const router = Router();

// router.use(logger);
router.use(auth);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUsersById);
router.get('/email/:email', usersController.getUsersByEmail);

router.post('/', usersController.createUser);


