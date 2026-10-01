import { UsersDTO } from "../dto/users.dto.js";

export class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }

    getEvents = async (req, res, next) => {
        try {
            // pido los eventos al DAO pasándole los query params de la URL
            const events = await this.eventsService.getAllEvents(req.query);

            // si hay eventos devuelvo la rta exitosa
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

            const userAuth = new UsersDTO(req.user);
            const { id } = req.params;
            const event = await this.eventsService.getEventById(id);

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                usuarioConsulta: userAuth.nombre,
                payload: event
            });

        } catch (error) {
            next(error);
        }
    }

    //TODO: filtrar los eventos por fecha (implementar fromDate y toDate)

    createEvent = async (req, res, next) => {
        try {

            const userAuth = new UsersDTO(req.user);
            const newEvent = await this.eventsService.createEvent(req.body);
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                usuarioConsulta: userAuth.nombre,
                payload: newEvent
            });

        } catch (error) {

            next(error);

        }
    }


}