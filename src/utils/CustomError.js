// Genero mi propia clase para lanzar errores.
export class CustomError extends Error {

    constructor(message = 'Ocurrió un error inesperado', statusCode = 500, errorType = 'InternalError', details = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.details = details;
        this.isOperational = true; // Identifica que es un error esperado/controlado por la app

        // Captura el stack trace limpio omitiendo el constructor de esta clase
        Error.captureStackTrace(this, this.constructor);
    }
}

// 2. Clases Hijas Especificas
export class BadRequestError extends CustomError {
    constructor(message = 'Los datos enviados son inválidos', details = null) {
        super(message, 400, 'BadRequest', details);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'No estás autenticado') {
        super(message, 401, 'Unauthorized');
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'No tienes permisos para realizar esta acción') {
        super(message, 403, 'Forbidden');
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404, 'NotFound');
    }
}

export class ConflictError extends CustomError {
    constructor(message = 'Conflicto con un recurso existente') {
        super(message, 409, 'Conflict');
    }
}

