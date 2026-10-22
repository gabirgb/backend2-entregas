import { ForbiddenError, NotFoundError } from "../utils/CustomError.js";

export const verifyEventOwner = (eventsService) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = req.user; // Inyectado por passportCall('current')

            // 1. Buscamos el evento existente
            const event = await eventsService.getEventById(id);
            if (!event) {
                throw new NotFoundError(`Evento con id ${id} no encontrado`);
            }

            // 2. Si es ADMIN, tiene acceso total
            if (user.role === 'admin') {
                req.event = event; // Opcional: pasamos el evento al controlador para no volver a buscarlo
                return next();
            }

            // 3. Si es ORGANIZER, verificamos que sea el dueño
            // (Asegurate de comparar como String si usás ObjectId de Mongoose)
            const isOwner = event.organizerId?.toString() === user._id?.toString();

            if (!isOwner) {
                return next(new ForbiddenError('No tienes permisos para modificar o cancelar este evento porque no eres el creador'));
            }

            req.event = event;
            next();
        } catch (error) {
            next(error);
        }
    };
};