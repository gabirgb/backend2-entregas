import { UsersDTO } from "../dto/users.dto.js";
import { EventsDTO } from "../dto/events.dto.js";

export class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }

    getEvents = async (req, res, next) => {
        try {
            // pido los eventos al DAO pasándole los query params de la URL
            const result = await this.eventsService.getAllEvents(req.query);

            // Mapeamos los documentos de la página actual con el DTO de eventos
            const eventsDTO = result.docs.map(event => new EventsDTO(event));

            // si hay eventos devuelvo la rta exitosa
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({
                status: 'success',
                payload: eventsDTO, // uso el array mapeado
                pagination: { // Los metadatos de paginación
                    totalDocs: result.totalDocs,
                    limit: result.limit,
                    page: result.page,
                    totalPages: result.totalPages,
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage
                }
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
                payload: new EventsDTO(event)
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
                payload: new EventsDTO(newEvent)
            });

        } catch (error) {

            next(error);

        }
    }

    updateEvent = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const user = req.user; // Obtenido gracias a passportCall('current')

            const updatedEvent = await this.eventsService.updateEvent(id, updateData, user);

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({
                status: 'success',
                message: 'Evento actualizado exitosamente',
                payload: new EventsDTO(updatedEvent)
            });
        } catch (error) {
            next(error);
        }
    }

    cancelEvent = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;   // Inyectado por passport
            const userRole = req.user.role; // Inyectado por passport

            const cancelledEvent = await this.eventsService.cancelEvent(id, userId, userRole);

            res.status(200).json({
                status: 'success',
                message: 'El evento ha sido cancelado exitosamente.',
                payload: new EventsDTO(cancelledEvent)
            });
        } catch (error) {
            next(error);
        }
    }

}