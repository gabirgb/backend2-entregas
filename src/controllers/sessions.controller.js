import { UsersDTO } from "../dto/users.dto.js";
import { generateToken } from '../utils/jwt.js';
import { config } from "../config/config.js"

export const sessionsController = {

    // GET /api/sessions/current
    getCurrentSession: async (req, res, next) => {
        try {

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Detalles de la sesión activa',
                payload: req.user
            });

        } catch (error) {
            next(error);
        }
    },

    // POST /api/sessions/login
    login: async (req, res, next) => {

        try {
            const userDTO = new UsersDTO(req.user);
            const userPayload = { ...userDTO };
            const token = generateToken(userPayload);

            res.cookie("currentUser", token, {
                httpOnly: true,
                secure: config.general.NODE_ENV === 'production', // Solo se envía sobre HTTPS
                sameSite: 'lax', // para protejer contra ataques CSRF
                maxAge: 24 * 60 * 60 * 1000, // 86,400,000 ms (24 horas)
                path: '/'
            })

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: `Bienvenido ${req.user.first_name} ${req.user.last_name}`,
                payload: userPayload
            });

        } catch (error) {
            next(error);
        }
    },

    // POST /api/sessions/logout
    logout: async (req, res, next) => {
        try {
            res.clearCookie('currentUser', {
                httpOnly: true,
                secure: config.general.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
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