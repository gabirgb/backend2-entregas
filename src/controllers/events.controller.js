import { sanitizeInput } from "../utils/sanitizer.js";
import { validateEventHours, validateEventStartDate } from "../helpers/dateValidationRules.js";
import { VALID_EVENT_STATUSES } from "../constants/events.constants.js";

// creo la clase
export class EventsController {
    constructor(eventsDAO) {
        this.eventsDAO = eventsDAO; //el this se refiere al objeto actual.
    }

    getEvents = async (req, res, next) => {
        try {
            // 1. Pedimos los eventos al DAO pasándole los query params de la URL
            const events = await this.eventsDAO.get(req.query);

            //2. evalúo si la busqueda tuvo resultados
            if (events.length === 0) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: 'No hay eventos que coincidan con sus criterios de búsqueda'
                });
            }
            //3. si hay eventos devuelvo la rta exitosa
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                payload: events
            });

        } catch (error) {
            next(error);
        }
    }

    getEventsById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const event = await this.eventsDAO.getById(id);

            if (!event) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({
                    status: 'error',
                    message: `No se encontró el evento con id ${id}`
                });
            }

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                payload: event
            });

        } catch (error) {
            next(error);
        }
    }

    createEvent = async (req, res, next) => {
        try {
            //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
            let { code, title, description, date, startTime, endTime, location, category, artist, thumbnail, price, totalTickets, status } = req.body;

            //TODO: pasar toda la validacion del evento a un helper eventValidator.js
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
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    error: 'Faltan campos obligatorios (code/ title/ description/ location/ artist/ category/ price/ totalTickets)'
                });
            }

            //3. Valido tipo de datos y errores logicos
            if (typeof price !== 'number' || typeof totalTickets !== 'number' || totalTickets < 0) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    error: 'Valores inválidos: El precio y los tickets deben ser números, la fecha debe ser  y los tickets no pueden ser negativos'
                });
            }

            if (status && !VALID_EVENT_STATUSES.includes(status.toLowerCase())) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({
                    error: `El estado ${status} no es válido. Opciones permitidas: ${VALID_EVENT_STATUSES.join(', ')}`
                });
            }

            // 4. Validar fecha (si viene informada)
            if (date) {
                const dateValidation = validateEventStartDate(date);
                if (!dateValidation.isValid) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(400).json({ error: dateValidation.error });
                }
            }

            // 4b. Validar horarios (si vienen informados startTime y/or endTime)
            if (startTime || endTime) {
                const hoursValidation = validateEventHours(startTime, endTime);
                if (!hoursValidation.isValid) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(400).json({ error: hoursValidation.error });
                }
            }

            // 5. Crear el evento enviando solo los campos desestructurados y limpios: Al construir EventData explícitamente, evito que el cliente inyecte propiedades no deseadas que vengan en el req.body.
            //Además, creo el date solamente si el usuario asignó fecha al evento
            // 5. Crear el objeto eventData limpio
            const eventData = {
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

            let newEvent = await this.eventsDAO.create(eventData);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ status: 'success', payload: newEvent });

        } catch (error) {
            // Pasa el error directamente al middleware errorHandler
            next(error);

        }
    }


}