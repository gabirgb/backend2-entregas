import { UnauthorizedError, ForbiddenError } from "../utils/CustomError.js";

export const authorization = (...permisos) => {
    return (req, res, next) => {
        // 1. Verificamos que exista req.user (adjuntado previamente por passportCall)
        if (!req.user) {
            return next(new UnauthorizedError('Usuario no autenticado'));
        }

        //console.log(`Evaluando autorización. Rol del usuario: ${req.user.role}. Permisos requeridos:`, permisos);

        //2. evalúo si el rol del usuario (req.user.role) está incluido en los permisos permitidos (permisos) y normalizo el rol a minúsculas por seguridad
        const userRole = req.user.role ? req.user.role.toLowerCase() : '';
        const permisosNormalizados = permisos.flat().map(p => typeof p === 'string' ? p.toLowerCase() : '');

        // 3. Evaluamos si el rol está incluido en los permisos permitidos
        if (!permisosNormalizados.includes(userRole)) {
            //console.log(`Acceso denegado: El rol ${userRole} no está en [${permisosNormalizados.join(', ')}]`);

            // Tiene sesión pero carece de privilegios -> 403 Forbidden
            return next(new ForbiddenError('No tienes permisos suficientes para acceder a este recurso'));
        }

        //console.log('Autorización exitosa. Dando paso al siguiente middleware/controlador.');
        next();
    };
};