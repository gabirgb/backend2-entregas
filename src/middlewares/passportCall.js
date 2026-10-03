import passport from 'passport';
import { UnauthorizedError } from '../utils/CustomError.js';

export const passportCall = (strategy, options = {}) => {
    const defaultOptions = {
        session: false,
        failureMessage: 'No autorizado',
        ...options
    }

    return (req, res, next) => {
        console.log('Query recibida en callback:', req.query);

        passport.authenticate(strategy, defaultOptions,
            (err, user, info) => {
                console.log('2. Callback interno de Passport ejecutado:');
                console.log('   - Error:', err);
                console.log('   - User:', user);
                console.log('   - Info:', info);

                // 1. Error técnico o de BD -> va al errorHandler
                if (err) return next(err);

                // 2. Si no hay usuario (credenciales inválidas o token ausente/inválido)
                if (!user) {
                    if (defaultOptions.failureMessage) {
                        return res.redirect(`${defaultOptions.failureRedirect}?error=access_denied`)
                    }
                    const message = info?.message || info?.toString() || defaultOptions.failureMessage;
                    return next(new UnauthorizedError(message));
                }

                // 3. Autenticación exitosa: adjuntamos el usuario a la request
                req.user = user;

                next();

            })(req, res, next);
    };
};