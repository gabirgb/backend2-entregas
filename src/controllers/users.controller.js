import { sanitizeInput } from "../utils/sanitizer.js";
import { validateCreateUserData } from "../helpers/userValidator.js";
import { hashPassword } from '../utils/crypto.js'

// creo la clase
export class UsersController {
    constructor(usersDAO) {
        this.usersDAO = usersDAO; //el this se refiere al objeto actual.
    }

    getUsers = async (req, res, next) => {
        try {
            // 1. Pedimos los usuarios al DAO pasándole los query params de la URL
            const users = await this.usersDAO.get(req.query);

            //2. evalúo si la busqueda tuvo resultados
            if (users.length === 0) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: 'No hay usuarios que coincidan con sus criterios de búsqueda'
                });
            }
            //3. si hay usuarios devuelvo la rta exitosa
            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                payload: users
            });

        } catch (error) {
            next(error);
        }
    }

    getUsersById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.usersDAO.getById(id);

            if (!user) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: `No se encontró al usuario con id ${id}`
                });
            }

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                payload: user
            });

        } catch (error) {
            next(error);
        }
    }

    getUsersByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await this.usersDAO.getByEmail(email);

            if (!user) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: `No se encontró al usuario con email ${email}`
                });
            }

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                payload: user
            });

        } catch (error) {
            next(error);
        }
    }

    createUser = async (req, res, next) => {
        try {
            // 1. Ejecuto la validación en el helper userValidator pasando el body de la petición
            const validation = validateCreateUserData(req.body);

            // 2. Si hay errores de validación, cortamos el flujo y devolvemos 400

            if (!validation.isValid) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    status: 'error',
                    message: validation.error,
                })
            }
            // 3. Verificamos si el email ya existe en la base de datos (Regla de negocio adicional)
            const existingUser = await this.usersDAO.getByEmail(req.body.email);
            if (existingUser) {
                res.setHeader('Content-type', 'application/json');
                return res.status(409).json({
                    status: 'error',
                    message: 'El email ya se encuentra registrado'
                });
            }

            // sanitizo campos de texto
            const userData = {
                ...req.body,
                first_name: sanitizeInput(req.body.first_name),
                last_name: sanitizeInput(req.body.last_name),
                email: req.body.email.toLowerCase().trim(),
                password: hashPassword(req.body.password)
            }

            //Cuando termino de sanitizar y validar, encripto el pass para que a continuacion viaje a la BD ya hasheado, y no se almacena en texto plano

            // 4. Si todo está ok, procedemos a crear el usuario en el DAO con la data ya validada y sanitizada
            const newUser = await this.usersDAO.create(userData);

            // por seguridad elimino el pass en txt plano
            delete newUser.password;

            // 5. Devolvemos respuesta exitosa 201 Created
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                payload: newUser
            });

        } catch (error) {
            // Pasa el error directamente al middleware errorHandler
            next(error);

        }
    }


}