import { sanitizeInput } from "../utils/sanitizer.js";
import { validateEventHours, validateEventStartDate, validateDateRange } from "../helpers/dateValidationRules.js";
import { VALID_EVENT_STATUSES } from "../constants/events.constants.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/CustomError.js";

export class EventsServices {
    constructor(eventRepository, registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository; //el this se refiere al objeto actual.
    }

    getAllEvents = async (queryParams) => {
        // 1. Extraemos y sanitizamos/validamos los parámetros de paginación y orden
        let { page, limit, sort, fromDate, toDate, status, ...otherFilters } = queryParams;

        // Validar y normalizar 'page' (debe ser un entero positivo, por defecto 1)
        const pageNumber = parseInt(page, 10);
        const validPage = (!isNaN(pageNumber) && pageNumber > 0) ? pageNumber : 1;

        // Validar y normalizar 'limit' (por defecto 10, con un tope máximo de seguridad por ejemplo 50)
        const limitNumber = parseInt(limit, 10);
        const validLimit = (!isNaN(limitNumber) && limitNumber > 0) ? Math.min(limitNumber, 50) : 10;

        // Validar campos permitidos para el ordenamiento (evita inyecciones de sort en Mongoose)
        const allowedSortFields = ['date', 'price', '-date', '-price', 'title', '-title', 'createdAt', '-createdAt'];
        const validSort = allowedSortFields.includes(sort) ? sort : 'date';

        // 2. Validaciones lógicas para rango de fechas si el usuario las envió
        if (fromDate || toDate) {
            const rangeValidation = validateDateRange(fromDate, toDate);
            if (!rangeValidation.isValid) {
                throw new BadRequestError('Los parámetros de fecha (fromDate / toDate) deben tener el formato YYYY-MM-DD y ser coherentes.');
            }
        }

        // 3. Reorganizamos el objeto limpio que viaja al DAO
        const cleanQueryOptions = {
            ...otherFilters,
            fromDate,
            toDate,
            status,
            page: validPage,
            limit: validLimit,
            sort: validSort
        };

        // 4. Llamamos al DAO pasándole los filtros ya validados
        const result = await this.eventRepository.getAllEvents(cleanQueryOptions);

        // 5. Validación de resultados vacíos
        if (!result || !result.docs || result.docs.length === 0) {
            throw new NotFoundError('No hay resultados que coincidan con sus criterios de búsqueda.');
        }

        return result;
    }


    getEventById = async (id) => {
        const event = await this.eventRepository.getById(id);
        if (!event || event.length === 0) {
            throw new NotFoundError(`No se encontró el evento con id ${id}`);
        }
        return event;
    }

    createEvent = async (rawEventData, userId) => {
        //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
        let { code, title, description, fromDate, toDate, startTime, endTime, location, category, artist, thumbnail, price, capacity, status } = rawEventData;

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
        if (!code || !title || !description || !artist || !category || !location || !price || !capacity || !fromDate) {
            throw new BadRequestError('Faltan datos obligatorios: code, title, description, artist, category, location, price, capacity, fromDate.');
        }

        //3. Valido tipo de datos y errores logicos
        if (typeof price !== 'number' || typeof capacity !== 'number' || capacity <= 0 || price < 0) {
            throw new BadRequestError('El precio y la capacidad del espacio deben ser números. La capacidad no pueden ser negativa.');
        }

        if (status && !VALID_EVENT_STATUSES.includes(status.toLowerCase())) {
            throw new BadRequestError(`El estado ${status} no es válido. Opciones permitidas: ${VALID_EVENT_STATUSES.join(', ')}`);
        }

        // 4. Validar fechas
        if (fromDate) {
            const fromDateValidation = validateEventStartDate(fromDate);
            if (!fromDateValidation.isValid) {
                throw new BadRequestError('La fecha de comienzo del evento no es válida.');
            }
        }

        if (toDate) {
            const toDateValidation = validateEventStartDate(toDate);
            if (!toDateValidation.isValid) {
                throw new BadRequestError('La fecha de finalizacion del evento no es válida.');
            }
        }

        // 4b. Validar que la fecha de fin sea posterior o igual a la de inicio (formato ISO)
        if (toDate) {
            if (new Date(toDate) < new Date(fromDate)) {
                throw new BadRequestError('La fecha de finalización debe ser posterior o igual a la fecha de inicio.');
            }
        }

        // 4c. Validar horarios (si vienen informados startTime y/or endTime)
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
            ...(fromDate && { fromDate: new Date(fromDate) }),
            ...(toDate && { toDate: new Date(toDate) }),
            ...(startTime && { startTime }),
            ...(endTime && { endTime }),
            location,
            category,
            artist,
            thumbnail,
            price,
            capacity,
            status,
            organizer: userId // acá guardo el ID del usuario que creó el evento
        };

        return await this.eventRepository.create(cleanEventData);

    }

    // Actualizacion de eventos
    // Actualizacion de eventos
    updateEvent = async (eventId, rawUpdateData, user) => {

        // 1. Buscamos el evento actual en la base de datos para comparar su estado y datos previos
        const existingEvent = await this.eventRepository.getById(eventId);
        if (!existingEvent) {
            throw new NotFoundError(`No se encontró el evento con id ${eventId}`);
        }

        // Validación de permisos de dueño o admin
        if (user.role !== 'admin' && existingEvent.organizer.toString() !== user._id.toString()) {
            throw new ForbiddenError("No tienes permisos para modificar este evento.");
        }

        // Regla: No se puede editar un evento si ya está finalizado o cancelado
        if (existingEvent.status === 'finished') {
            throw new BadRequestError('No se puede editar un evento que ya ha finalizado.');
        }

        if (existingEvent.status === 'cancelled') {
            throw new BadRequestError('No se puede editar un evento que se encuentra cancelado.');
        }

        // 2. Evitamos que modifiquen el código único de Mongoose por seguridad
        delete rawUpdateData.code;

        // 3. En este obj voy a acumular los datos limpios a actualizar
        const cleanUpdateData = {};

        // 4. Sanitización y validación condicional de campos recibidos
        if (rawUpdateData.status !== undefined) {
            const sanitizedStatus = sanitizeInput(rawUpdateData.status).toLowerCase();
            if (!VALID_EVENT_STATUSES.includes(sanitizedStatus)) {
                throw new BadRequestError(`Estado no válido. Opciones permitidas: ${VALID_EVENT_STATUSES.join(', ')}`);
            }
            cleanUpdateData.status = sanitizedStatus;
        }

        if (rawUpdateData.title !== undefined) {
            cleanUpdateData.title = sanitizeInput(rawUpdateData.title);
            if (cleanUpdateData.title.length < 3) {
                throw new BadRequestError('El título debe tener al menos 3 caracteres');
            }
        }

        if (rawUpdateData.description !== undefined) {
            cleanUpdateData.description = sanitizeInput(rawUpdateData.description);
            if (cleanUpdateData.description.length < 10) {
                throw new BadRequestError('La descripción debe tener al menos 10 caracteres');
            }
        }

        if (rawUpdateData.location !== undefined) {
            cleanUpdateData.location = sanitizeInput(rawUpdateData.location);
            if (cleanUpdateData.location.length < 2) {
                throw new BadRequestError('La ubicación debe tener al menos 2 caracteres');
            }
        }

        if (rawUpdateData.price !== undefined) {
            if (typeof rawUpdateData.price !== 'number' || rawUpdateData.price < 0) {
                throw new BadRequestError('El precio debe ser un número positivo');
            }
            cleanUpdateData.price = rawUpdateData.price;
        }

        // Validación de capacidad y control contra inscriptos existentes
        if (rawUpdateData.capacity !== undefined) {
            if (!Number.isInteger(rawUpdateData.capacity) || rawUpdateData.capacity <= 0) {
                throw new BadRequestError('La capacidad debe ser un número entero mayor a cero.');
            }

            // Consultamos cuántos inscriptos reales tiene el evento actualmente
            const currentRegistrationsCount = await this.registrationRepository.countByEvent(eventId);

            // REGLA: No reducir la capacidad por debajo de los ya inscriptos
            if (rawUpdateData.capacity < currentRegistrationsCount) {
                throw new BadRequestError(`No se puede reducir la capacidad a ${rawUpdateData.capacity} porque ya hay ${currentRegistrationsCount} usuarios inscriptos.`);
            }

            cleanUpdateData.capacity = rawUpdateData.capacity;
        }

        // Validaciones de fechas ISO con hora al actualizar
        if (rawUpdateData.fromDate) {
            const fromDateValidation = validateEventStartDate(rawUpdateData.fromDate);
            if (!fromDateValidation.isValid) throw new BadRequestError('La fecha de comienzo no es válida.');
            cleanUpdateData.fromDate = new Date(rawUpdateData.fromDate);
        }

        if (rawUpdateData.toDate) {
            const toDateValidation = validateEventStartDate(rawUpdateData.toDate);
            if (!toDateValidation.isValid) throw new BadRequestError('La fecha de finalización no es válida.');
            cleanUpdateData.toDate = new Date(rawUpdateData.toDate);
        }

        // Validación lógica de rango con fechas ISO (toDate >= fromDate)
        const finalFromDate = rawUpdateData.fromDate || existingEvent.fromDate;
        const finalToDate = rawUpdateData.toDate || existingEvent.toDate;

        if (finalToDate && finalFromDate) {
            if (new Date(finalToDate) < new Date(finalFromDate)) {
                throw new BadRequestError('La fecha de finalización debe ser posterior o igual a la fecha de inicio.');
            }
        }

        // 5. Ejecutamos la actualización en el DAO
        const updatedEvent = await this.eventRepository.update(eventId, cleanUpdateData);

        if (!updatedEvent) {
            throw new NotFoundError(`No se encontró el evento con id ${eventId} para actualizar`);
        }

        return updatedEvent;
    }

    cancelEvent = async (eventId, userId, userRole) => {
        // 1. Buscamos el evento actual en la base de datos
        const event = await this.eventRepository.getById(eventId);
        if (!event) {
            throw new NotFoundError(`No se encontró el evento con id ${eventId}`);
        }

        // 2. REGLA: Impedir cancelar eventos que ya finalizaron
        if (event.status === 'finished') {
            throw new BadRequestError('No se puede cancelar un evento que ya ha finalizado.');
        }

        // 3. (Opcional extra de seguridad) Validar permisos si el middleware no lo cubriera:
        // Si no es admin y el usuario logueado no coincide con el organizador del evento
        const isOwner = event.organizer.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (!isAdmin && !isOwner) {
            throw new ForbiddenError('No tienes permisos para cancelar este evento.');
        }

        // 4. REGLA: Cambiar el estado a 'cancelled' (no se elimina físicamente)
        const updatedEvent = await this.eventRepository.update(eventId, { status: 'cancelled' });

        return updatedEvent;
    }

}