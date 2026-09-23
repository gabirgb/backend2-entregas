import { UsersDTO } from "../dto/users.dto.js";
import { comparePassword } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js"

export class SessionsController {
    constructor(usersDAO) {
        this.usersDAO = usersDAO;
    }

    // GET /api/sessions/current (Suele pedirlo el enunciado)
    getCurrentSession = async (req, res, next) => {
        try {
            if (!req.user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    status: 'error',
                    message: 'No hay sesion activa'
                });
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Detalles de la sesión activa',
                payload: req.user
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/login
    login = async (req, res, next) => {
        let { email, password } = req.body;
        if (!email || !password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                status: 'error',
                message: 'Email y contraseña son requeridos'
            });
        }

        try {
            let user = await this.usersDAO.getByEmail(email);
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }

            if (!comparePassword(password, user.password)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }

            const userPayload = new UsersDTO(user);
            const token = jwt.sign(
                { ...userPayload },
                config.general.JWT_SECRET,
                { expiresIn: "24h" }
            )

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${user.first_name} ${user.last_name}`,
                payload: userPayload,
                token
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
    logout = async (req, res, next) => {
        try {
            req.session.destroy((error) => {
                if (error) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(500).json({
                        status: 'error',
                        message: `No se pudo cerrar sesión.`
                    });
                }
                //limpia la cookie de sesion por defecto
                res.clearCookie('connect.sid');

                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({
                    status: 'success',
                    message: 'Gracias por visitarnos.'
                });
            });

        } catch (error) {
            next(error);
        }
    }
}