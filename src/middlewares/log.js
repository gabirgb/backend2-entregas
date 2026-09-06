// middleware super sencillo para crear logs, por lo general todo lo q se trate de seguridad se loggea

export const requestLogger = (req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
        const start = Date.now();
        const { method, url } = req;

        // Escuchamos el evento 'finish' para registrar el log una vez emitida la respuesta
        res.on('finish', () => {
            const duration = Date.now() - start;
            const statusCode = res.statusCode;

            console.log(`[${new Date().toISOString()}] ${method} ${url} -> ${statusCode} (${duration}ms)`);
        });

        next(); // Continuar hacia la ruta o siguiente middleware
    };
};