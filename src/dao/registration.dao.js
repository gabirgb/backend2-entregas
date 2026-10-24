import { registrationModel } from "../models/registration.model.js";
import { REGISTRATION_STATUS } from "../constants/registration.constants.js";

export class RegistrationDAO {
    // 1. Crear una nueva inscripción
    async create(registrationData) {
        const newRegistration = await registrationModel.create(registrationData);
        return newRegistration.toJSON();
    }

    // 2. Obtener inscripción por su ID
    async getById(id) {
        return await registrationModel.findById(id).lean();
    }

    // 3. Verificar si el usuario ya tiene una inscripción ACTIVA para un evento
    async getActiveByUserAndEvent(userId, eventId) {
        return await registrationModel.findOne({
            user: userId,
            event: eventId,
            status: { $ne: REGISTRATION_STATUS.CANCELLED }
        }).lean();
    }

    // 4. Calcular el total de cupos ocupados sumando 'quantity' de los tickets activos (no cancelados)
    async getActiveQuantityByEvent(eventId) {
        const activeRegistrations = await registrationModel.find({
            event: eventId,
            status: { $ne: REGISTRATION_STATUS.CANCELLED }
        }).lean();

        // Sumamos las cantidades solicitadas por cada usuario activo
        return activeRegistrations.reduce((acc, reg) => acc + (reg.quantity || 1), 0);
    }

    // 5. Obtener todas las inscripciones de un usuario (con populate del evento)
    async getByUser(userId) {
        return await registrationModel.find({ user: userId })
            .populate({
                path: 'event',
                select: 'title fromDate location status'
            })
            .lean();
    }

    // 6. Obtener todas las inscripciones de un evento (para el organizador o admin)
    async getByEvent(eventId) {
        return await registrationModel.find({ event: eventId })
            .populate('user', 'first_name last_name email')
            .lean();
    }

    // 7. Cancelación lógica (actualiza estado y registra fecha de cancelación en lugar de borrar)
    async updateStatus(registrationId, status, cancelledAt = null) {
        return await registrationModel.findByIdAndUpdate(
            registrationId,
            { status, cancelledAt },
            { new: true }
        ).lean();
    }
}