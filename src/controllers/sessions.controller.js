// creo la clase
export class SessionsController {

    // GET /api/sessions/current (Suele pedirlo el enunciado)
    getCurrentSession = async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Endpoint de sesión actual (sin lógica de auth aún)',
                payload: null
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/login
    login = async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Endpoint de login (placeholder)'
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/sessions/logout
    logout = async (req, res, next) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Endpoint de logout (placeholder)'
            });
        } catch (error) {
            next(error);
        }
    }
}