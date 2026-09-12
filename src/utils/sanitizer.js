export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return false;
    // convierto caracteres especiales a entidades html para evitar inyeccion xss
    return input
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

// Sanitiza (devuelve String)
export const sanitizeEmail = (email) => {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
};