import { Router } from "express";
import { usersController } from "../controllers/index.js";

export const router = Router();

//router.use(auth);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUsersById);
router.get('/email/:email', usersController.getUsersByEmail);

router.post('/register', usersController.createUser);


