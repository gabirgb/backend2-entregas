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


            res.cookie("cookietoken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo se envía sobre HTTPS
                sameSite: 'lax' // para protejer contra ataques CSRF
            })

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${user.first_name} ${user.last_name}`,
                payload: userPayload
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
    logout = async (req, res, next) => {
        try {
            res.clearCookie('cookietoken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Sesión cerrada correctamente. ¡Gracias por visitarnos!'
            });

        } catch (error) {
            next(error);
        }
    }
}