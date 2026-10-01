import { sanitizeInput } from "../utils/sanitizer.js";
import { validateEventHours, validateEventStartDate } from "../helpers/dateValidationRules.js";
import { VALID_EVENT_STATUSES } from "../constants/events.constants.js";
import { BadRequestError, NotFoundError } from "../utils/CustomError.js";

export class EventsServices {
    constructor(eventsDAO) {
        this.eventsDAO = eventsDAO; //el this se refiere al objeto actual.
    }

    getAllEvents = async (queryParams) => {
        const events = await this.eventsDAO.getAllEvents(queryParams);
        if (!events || events.length === 0) {
            throw new NotFoundError('No hay resultados que coincidan con sus criterios de busqueda.');
        }
        return events;
    }

    //TODO: filtrar los eventos por fecha (implementar fromDate y toDate)

    getEventById = async (id) => {
        const event = await this.eventsDAO.getById(id);
        if (!event || event.length === 0) {
            throw new NotFoundError('No se encontró el evento con id ${id}');
        }
        return event;
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
            throw new BadRequestError('Faltan datos obligatorios');
        }

        //3. Valido tipo de datos y errores logicos
        if (typeof price !== 'number' || typeof totalTickets !== 'number' || totalTickets < 0) {
            throw new BadRequestError('El precio y la cantidad de tickets deben ser números. El stock no pueden ser negativo');
        }

        if (status && !VALID_EVENT_STATUSES.includes(status.toLowerCase())) {
            throw new BadRequestError(`El estado ${status} no es válido. Opciones permitidas: ${VALID_EVENT_STATUSES.join(', ')}`);
        }

        // 4. Validar fecha (si viene informada)
        if (date) {
            const dateValidation = validateEventStartDate(date);
            if (!dateValidation.isValid) {
                throw new BadRequestError('La fecha del evento no es válida.');
            }
        }

        // 4b. Validar horarios (si vienen informados startTime y/or endTime)
        if (startTime || endTime) {
            const hoursValidation = validateEventHours(startTime, endTime);
            if (!hoursValidation.isValid) {
                throw new BadRequestError('Los horarios del evento no son válidos. Asegúrese de que el horario de inicio sea anterior al horario de finalización y que ambos estén en formato HH:mm.');
            }
        }

        //5. Armo un objeto limpio con los datos validados y sanitizados para enviarlo al DAO
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