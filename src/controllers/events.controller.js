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
            // valido si hay usuario autenticado y creo un DTO para enviar solo los datos necesarios al cliente
            const userAuth = req.user ? new UsersDTO(req.user) : null;
            const { id } = req.params;
            const event = await this.eventsService.getEventById(id);

            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                usuarioConsulta: userAuth ? userAuth.nombre : 'Invitado', // <-- Evaluamos si existe
                payload: event
            });

        } catch (error) {
            next(error);
        }
    }

    //TODO: filtrar los eventos por fecha (implementar fromDate y toDate)

    createEvent = async (req, res, next) => {
        try {
            // req.user viene gracias a passportCall('current')
            const userId = req.user._id;
            const newEvent = await this.eventsService.createEvent(req.body, userId);
            const userAuth = new UsersDTO(req.user);

            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({
                status: 'success',
                message: 'Evento creado exitosamente',
                usuarioConsulta: userAuth.nombre,
                payload: newEvent
            });

        } catch (error) {

            next(error);

        }
    }

    updateEvent = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updatedEvent = await this.eventsService.updateEvent(id, req.body);

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Evento actualizado exitosamente',
                payload: updatedEvent
            });
        } catch (error) {
            next(error);
        }
    }

    deleteEvent = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.eventsService.deleteEvent(id);

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Evento cancelado/eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }


}