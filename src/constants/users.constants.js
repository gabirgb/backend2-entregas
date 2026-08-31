// Congelo el objeto (Object.freeze) para evitar que se modifique en ejecución
export const USER_ROLE = Object.freeze({
    CUSTOMER: 'customer',
    ORGANIZER: 'organizer',
    ADMIN: 'admin',
})

// Extraigo la lista de valores válidos en un Array
export const VALID_USER_ROLES = Object.values(USER_ROLE);