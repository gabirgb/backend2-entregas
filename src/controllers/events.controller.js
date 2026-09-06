export class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }

    getEvents = async (req, res, next) => {
        try {
            // 1. Pedimos los eventos al DAO pasándole los query params de la URL
            const events = await this.eventsService.getAllEvents(req.query);

            //2. evalúo si la busqueda tuvo resultados
            if (!events || events.length === 0) {
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
            const event = await this.eventsService.getEventById(id);

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

    //TODO: filtrar los eventos por fecha (implementar fromDate y toDate)

    createEvent = async (req, res, next) => {
        try {
            const newEvent = await this.eventsService.createEvent(req.body);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ status: 'success', payload: newEvent });

        } catch (error) {
            // Si el servicio lanzó un error de validacion (statusCode 400)
            if (error.satstusCode) {
                return res.status(error.statusCode).json({ status: 'error', message: error.message });
            }
            // Si no, paso directamente al middleware errorHandler
            next(error);

        }
    }


}