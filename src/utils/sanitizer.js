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
