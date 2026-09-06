// Congelo el objeto (Object.freeze) para evitar que se modifique en ejecución
export const EVENT_STATUS = Object.freeze({
    DRAFT: 'draft',
    PRESALE: 'presale',
    PUBLISHED: 'published',
    CANCELLED: 'cancelled',
})

// Extraigo la lista de valores válidos en un Array
export const VALID_EVENT_STATUSES = Object.values(EVENT_STATUS);