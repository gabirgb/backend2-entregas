import { sanitizeInput } from "../utils/sanitizer.js";
import { validateOptionalEventDate } from "../utils/dateValidator.js";
import { VALID_EVENT_STATUSES } from "../constants/events.js";

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
            res.status(200).json({ message: 'Listado de Eventos', events });

        } catch (error) {
            next(error);
        }
    }

    getEventsById = async (req, res, next) => {
        try {
            const event = `Evento ${req.params.id}`; //capturo el id que me llega por params desde la ruta /api/products/:id para mostrarlo en la rta
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({ event });
        } catch (error) {
            next(error);
        }
    }

    createEvent = async (req, res, next) => {
        try {
            //1. desestructuro propiedades para hacer la validacion de c/u, uso LET para poder reasignarles valor luego de la sanitizacion
            let { code, title, description, date, location, category, artist, thumbnail, price, totalTickets, status } = req.body;

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

            //4. Valido que la fecha tenga formato correcto y sea a futuro
            const { isValid, error } = validateOptionalEventDate(date);
            if (!isValid) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error });
            }


            // 5. Crear el evento enviando solo los campos desestructurados y limpios: Al construir EventData explícitamente, evito que el cliente inyecte propiedades no deseadas que vengan en el req.body.
            //Además, creo el date solamente si el usuario asignó fecha al evento
            const eventData = {
                code, title, description, ...(date && { date: new Date(date) }), location, category, artist, thumbnail, price, totalTickets, status
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