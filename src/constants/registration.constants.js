// Congelo el objeto (Object.freeze) para evitar que se modifique en ejecución
export const REGISTRATION_STATUS = Object.freeze({
    ACTIVE: 'active',
    USED: 'used',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
})

// Extraigo la lista de valores válidos en un Array
export const VALID_REGISTRATION_STATUSES = Object.values(REGISTRATION_STATUS);