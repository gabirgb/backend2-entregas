// permitir ÚNICAMENTE formato ISO 8601 (Recomendado para eventos con hora)
export const isISO8601Date = (dateString) => {
    // Regex estricto para ISO 8601 (ej: 2026-10-15T20:00:00Z o con desfase +03:00)
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/;

    if (!iso8601Regex.test(dateString)) return false;

    return !isNaN(Date.parse(dateString));
};

// 2. Validador de fecha futura
export const isFutureDate = (dateString) => {
    return new Date(dateString) > new Date();
};

// 3. Helper principal que agrupa toda la validación opcional
export const validateOptionalEventDate = (date) => {
    if (!date) return { isValid: true }; // Si no hay fecha, no hay error

    if (!isISO8601Date(date)) {
        return {
            isValid: false,
            error: 'El formato de fecha no es válido. Usar formato ISO8601: YYYY-MM-DDTHH:mm:ss.sssZ (ej: 2026-10-15T20:00:00Z)'
        };
    }

    if (!isFutureDate(date)) {
        return {
            isValid: false,
            error: 'La fecha del evento debe ser posterior a la fecha actual'
        };
    }

    return { isValid: true };
};