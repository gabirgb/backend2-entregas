// Validar formato estándar de email (usuario@dominio.com)
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

// Validar complejidad/longitud de contraseña (mínimo 8 caracteres)
export const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8;
};

// Valido fecha de nacimiento en formato ISO 8601 (YYYY-MM-DD)
export const isAdult = (birthdate) => {
    // 1. Reutilizo tu validador de formato ISO 8601
    if (!isValidISO8601Date(birthdate)) {
        return false;
    }

    // 2. Calculo la edad exacta
    const birthDateObj = new Date(birthdate);
    const today = new Date();

    // 3. Calculo la edad en años
    let age = today.getFullYear() - birthDateObj.getFullYear();
    // 4. Ajusto si el cumpleaños aún no ha ocurrido este año
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    // 5. Si el mes actual es menor al mes de nacimiento, o si es el mismo mes pero el día actual es menor al día de nacimiento, resto 1 a la edad
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age >= 18;
};