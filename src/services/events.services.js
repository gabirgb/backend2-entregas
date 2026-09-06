import { sanitizeInput } from "../utils/sanitizer.js";
import { validateEventHours, validateEventStartDate } from "../helpers/dateValidationRules.js";
import { VALID_EVENT_STATUSES } from "../constants/events.constants.js";

// creo la clase
export class EventsServices {
    constructor(eventsDAO) {
        this.eventsDAO = eventsDAO; //el this se refiere al objeto actual.
    }

    getAllEvents = async (queryParams) => {
        return await this.eventsDAO.get(queryParams);
    }

    //TODO: filtrar los eventos por fecha (implementar fromDate y toDate)

    getEventById = async (id) => {
        return await this.eventsDAO.getById(id);
    }

    createEvent = async (rawEventData) => {
        //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
        let { code, title, description, date, startTime, endTime, location, category, artist, thumbnail, price, totalTickets, status } = rawEventData;

        // Sanitizo manualmente
        code = sanitizeInput(code);
        title = sanitizeInput(title);
        description = sanitizeInput(description);
        location = sanitizeInput(location);
        category = sanitizeInput(category);
        artist = sanitizeInput(artist);
        thumbnail = sanitizeInput(thumbnail);
        status = sanitizeInput(status);

        //2. valido campos obligatorios
        if (!code || !title || !description || !artist || !category || !location || !price || !totalTickets) {
            const error = new Error('Faltan campos obligatorios (code/ title/ description/ location/ artist/ category/ price/ totalTickets)');
            error.statusCode = 400;
            throw error;
        }

        //3. Valido tipo de datos y errores logicos
        if (typeof price !== 'number' || typeof totalTickets !== 'number' || totalTickets < 0) {
            const error = new Error('Valores inválidos: El precio y los tickets deben ser números, la fecha debe ser  y los tickets no pueden ser negativos');
            error.statusCode = 400;
            throw error;
        }

        if (status && !VALID_EVENT_STATUSES.includes(status.toLowerCase())) {
            const error = new Error(`El estado ${status} no es válido. Opciones permitidas: ${VALID_EVENT_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }

        // 4. Validar fecha (si viene informada)
        if (date) {
            const dateValidation = validateEventStartDate(date);
            if (!dateValidation.isValid) {
                const error = new Error(dateValidation.error);
                error.statusCode = 400;
                throw error;
            }
        }

        // 4b. Validar horarios (si vienen informados startTime y/or endTime)
        if (startTime || endTime) {
            const hoursValidation = validateEventHours(startTime, endTime);
            if (!hoursValidation.isValid) {
                const error = new Error(hoursValidation.error);
                error.statusCode = 400;
                throw error;
            }
        }

        // 5. Crear el evento enviando solo los campos desestructurados y limpios: Al construir EventData explícitamente, evito que el cliente inyecte propiedades no deseadas que vengan en el req.body.
        //Además, creo el date solamente si el usuario asignó fecha al evento
        // 5. Crear el objeto eventData limpio
        const cleanEventData = {
            code,
            title,
            description,
            ...(date && { date: new Date(date) }),
            ...(startTime && { startTime }),
            ...(endTime && { endTime }),
            location,
            category,
            artist,
            thumbnail,
            price,
            totalTickets,
            status
        };

        return await this.eventsDAO.create(cleanEventData);

    }
}