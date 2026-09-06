import { UsersDTO } from "../dto/users.dto.js";

export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    getUsers = async (req, res, next) => {
        try {
            // 1. Pedimos los usuarios al DAO pasándole los query params de la URL
            const users = await this.usersService.getAllUsers(req.query);

            //2. evalúo si la busqueda tuvo resultados
            if (!users || users.length === 0) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: 'No hay usuarios que coincidan con sus criterios de búsqueda'
                });
            }

            //3. si hay usuarios devuelvo la rta exitosa
            // Mapeamos cada objeto de usuario a su DTO correspondiente
            const usersDTO = users.map(user => new UsersDTO(user));

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                payload: usersDTO
            });

        } catch (error) {
            next(error);
        }
    }

    getUsersById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.usersService.getUsersById(id);

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
                payload: new UsersDTO(user)
            });

        } catch (error) {
            next(error);
        }
    }

    getUsersByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await this.usersService.getUsersByEmail(email);

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
                payload: new UsersDTO(user)
            });
        } catch (error) {
            next(error);
        }
    }

    createUser = async (req, res, next) => {
        try {
            const newUser = await this.usersService.createUser(req.body);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                payload: newUser // Devolver solo los campos necesarios usando DTO
            });

        } catch (error) {
            // Si el servicio lanzó un error de validacion (statusCode 400)
            if (error.statusCode) {
                return res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }
            // Si no, paso directamente al middleware errorHandler
            next(error);

        }
    }


}