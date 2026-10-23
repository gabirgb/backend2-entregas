import { BadRequestError, NotFoundError } from "../utils/CustomError.js";

export class RegistrationServices {
    constructor(registrationDAO, eventsDAO) {
        this.registrationDAO = registrationDAO;
        this.eventsDAO = eventsDAO;
    }

    registerUserToEvent = async (eventId, userId) => {
        // 1. Verificar que el evento exista
        const event = await this.eventsDAO.getById(eventId);
        if (!event) {
            throw new NotFoundError(`No se encontró el evento con id ${eventId}`);
        }

        // 2. REGLA: Validar inscripción según estado (Solo se permite si está 'published')
        if (event.status !== 'published') {
            throw new BadRequestError(`No te puedes inscribir a este evento porque su estado actual es '${event.status}'. Solo se permiten inscripciones a eventos publicados.`);
        }

        // 3. REGLA: Validar que el evento no haya pasado
        const eventDate = new Date(event.fromDate);
        if (eventDate <= new Date()) {
            throw new BadRequestError('No te puedes inscribir a un evento cuya fecha ya ha pasado.');
        }

        // 4. REGLA: Verificar que el usuario no esté ya inscripto
        const existingRegistration = await this.registrationDAO.getByUserAndEvent(userId, eventId);
        if (existingRegistration) {
            throw new BadRequestError('El usuario ya se encuentra inscripto a este evento.');
        }

        // 5. REGLA: Validar el cupo disponible
        const currentRegistrationsCount = await this.registrationDAO.countByEvent(eventId);
        if (currentRegistrationsCount >= event.capacity) {
            throw new BadRequestError('Lo sentimos, el evento ha alcanzado su capacidad máxima (no hay cupos disponibles).');
        }

        // 6. Si pasa todas las validaciones, creamos la inscripción
        const newRegistration = await this.registrationDAO.create({
            user: userId,
            event: eventId
        });

        return newRegistration;
    }

    getUserRegistrations = async (userId) => {
        return await this.registrationDAO.getByUser(userId);
    }

    cancelRegistration = async (registrationId, userId) => {
        const registration = await this.registrationDAO.getById(registrationId);
        if (!registration) {
            throw new NotFoundError('No se encontró la inscripción.');
        }
        // Validar que la inscripción pertenezca al usuario (o sea admin)
        if (registration.user.toString() !== userId.toString()) {
            throw new ForbiddenError('No tienes permisos para cancelar esta inscripción.');
        }
        return await this.registrationDAO.delete(registrationId);
    }
}