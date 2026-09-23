import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Verificamos que el header exista
    if (!authHeader) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'No existen usuarios autenticados' });
    }

    // 2. Separamos el formato "Bearer <token>"
    const parts = authHeader.split(" ");
    const scheme = parts[0];
    const token = parts[1];

    // 3. Validamos que el esquema sea 'Bearer' y que el token realmente contenga valor
    if (scheme !== "Bearer" || !token || token.trim() === "") {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Credenciales inválidas.' });
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