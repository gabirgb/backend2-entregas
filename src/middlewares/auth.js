import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    const token = req.cookies?.cookietoken;

    // 1. Verificamos que el token/cookie exista
    if (!token) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'No existen usuarios autenticados' });
    }

    // 4. Verificamos el token: confirmo q el token sea válido verificándolo contra mi secret
    try {
        const payload = jwt.verify(token, config.general.JWT_SECRET);
        req.user = payload;

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales inválidas.` });
    }

    next();
}