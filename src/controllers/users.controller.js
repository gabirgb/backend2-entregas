import { UsersDTO } from "../dto/users.dto.js";

export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    getUsers = async (req, res, next) => {
        try {

            const users = await this.usersService.getAllUsers(req.query);
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
            // recibo desde passport.authenticate
            const newUser = req.user;

            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                payload: newUser
            });

        } catch (error) {

            next(error);

        }
    }


}