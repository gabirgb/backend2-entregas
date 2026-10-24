import crypto from 'crypto';
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/CustomError.js";
import { sendTicketConfirmationEmail } from '../utils/mailer.services.js';
import { REGISTRATION_STATUS } from '../constants/registration.constants.js';

export class RegistrationServices {
    constructor(registrationRepository, eventRepository, userRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // 1. Inscribir usuario a un evento
    registerUserToEvent = async (eventId, userId, quantity = 1) => {
        // Validar que la cantidad sea un número válido > 0
        const parsedQuantity = Number(quantity);
        if (!parsedQuantity || parsedQuantity < 1 || !Number.isInteger(parsedQuantity)) {
            throw new BadRequestError("La cantidad solicitada debe ser un número entero mayor a 0.");
        }

        // Verificar que el evento exista
        const event = await this.eventRepository.getById(eventId);
        if (!event) {
            throw new NotFoundError(`No se encontró el evento con id ${eventId}`);
        }

        // Validar estado del evento ('published') y que no esté cancelado o finalizado
        if (event.status !== 'published') {
            throw new BadRequestError(`No te puedes inscribir a este evento porque su estado actual es '${event.status}'. Solo se permiten inscripciones a eventos publicados.`);
        }

        const eventDate = new Date(event.fromDate);
        if (eventDate <= new Date() || event.status === 'cancelled' || event.status === 'finished') {
            throw new BadRequestError('No te puedes inscribir a un evento cuya fecha ya pasó, o que se encuentra cancelado/finalizado.');
        }

        // Verificar que el usuario no tenga ya un ticket/inscripción activa para este evento
        const existingRegistration = await this.registrationRepository.getActiveByUserAndEvent(userId, eventId);
        if (existingRegistration) {
            throw new BadRequestError('El usuario ya se encuentra inscripto y activo en este evento.');
        }

        // Validar el cupo disponible (descontando tickets activos)
        const currentOccupied = await this.registrationRepository.getActiveQuantityByEvent(eventId);
        const availableCapacity = event.capacity - currentOccupied;

        if (parsedQuantity > availableCapacity) {
            throw new BadRequestError(`Lo sentimos, no hay suficientes cupos disponibles. Lugares libres: ${availableCapacity}`);
        }

        // Generar código de reserva único
        const codigoReserva = `RES-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // Crear la inscripción
        const newRegistration = await this.registrationRepository.create({
            user: userId,
            event: eventId,
            quantity: parsedQuantity,
            codigoReserva,
            status: REGISTRATION_STATUS.ACTIVE
        });

        // Obtener datos del usuario para enviar el correo con Nodemailer
        const user = await this.userRepository.getById(userId);
        if (user && user.email) {
            await sendTicketConfirmationEmail({
                to: user.email,
                userName: `${user.first_name} ${user.last_name}`,
                eventTitle: event.title,
                ticketCode: codigoReserva
            });
        }

        return newRegistration;
    }

    // 2. Obtener inscripciones del usuario logueado
    getUserRegistrations = async (userId) => {
        return await this.registrationRepository.getByUser(userId);
    }

    // 3. Obtener inscripciones de un evento (para organizador dueño o admin)
    getEventRegistrationsForOrganizer = async (eventId, sessionUser) => {
        const event = await this.eventRepository.getById(eventId);
        if (!event) {
            throw new NotFoundError("Evento no encontrado.");
        }

        // Validar permisos: debe ser admin o el organizador dueño del evento
        if (sessionUser.role !== 'admin' && event.organizerId?.toString() !== sessionUser._id.toString()) {
            throw new ForbiddenError("No tienes permisos para ver las inscripciones de este evento.");
        }

        return await this.registrationRepository.getByEvent(eventId);
    }

    // 4. Cancelación lógica de una inscripción (libera cupo automáticamente)
    cancelRegistration = async (registrationId, sessionUser) => {
        const registration = await this.registrationRepository.getById(registrationId);
        if (!registration) {
            throw new NotFoundError('No se encontró la inscripción.');
        }

        // Validar que la inscripción pertenezca al usuario solicitante o sea admin
        if (sessionUser.role !== 'admin' && registration.user.toString() !== sessionUser._id.toString()) {
            throw new ForbiddenError('No tienes permisos para cancelar esta inscripción.');
        }

        if (registration.status === REGISTRATION_STATUS.CANCELLED) {
            throw new BadRequestError('La inscripción ya se encuentra cancelada.');
        }

        // Cancelación lógica: actualiza estado a 'cancelled' y guarda fecha
        const updatedRegistration = await this.registrationRepository.updateStatus(
            registrationId,
            REGISTRATION_STATUS.CANCELLED,
            new Date()
        );

        return updatedRegistration;
    }
}