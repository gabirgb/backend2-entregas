import passport from 'passport';
import { UnauthorizedError } from '../utils/CustomError.js';

export const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy,
            {
                session: false
            },
            (err, user, info) => {
                // 1. Error técnico o de BD -> va al errorHandler
                if (err) return next(err);

                // 2. Si no hay usuario (credenciales inválidas o token ausente/inválido)
                if (!user) {
                    const message = info?.message || info?.toString() || 'No autorizado';
                    return next(new UnauthorizedError(message));
                }

                // 3. Autenticación exitosa: adjuntamos el usuario a la request
                req.user = user;

                next();

            })(req, res, next);
    };
};