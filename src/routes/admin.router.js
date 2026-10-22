import { Router } from "express";
// TODO: adminController para separar la lógica
import { usersController } from "../controllers/index.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.js";

export const router = Router();

// Todas las rutas de este router exigirán estar autenticado y ser exclusivamente 'admin'
router.use(passportCall('current'), authorization('admin'));

// ver todos los usuarios del sistema
router.get('/users', usersController.getUsers);

// Podrías agregar más rutas administrativas acá (ej: eliminar usuarios, cambiar roles, etc.)