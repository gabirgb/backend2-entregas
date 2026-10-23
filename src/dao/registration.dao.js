import { registrationModel } from "../models/registration.model.js";

export class RegistrationDAO {
    // Cuenta la cantidad de usuarios inscriptos en un evento específico
    async countByEvent(eventId) {
        return await registrationModel.countDocuments({ event: eventId });
    }

    // Verifica si un usuario ya está inscripto a un evento
    async getByUserAndEvent(userId, eventId) {
        return await registrationModel.findOne({ user: userId, event: eventId }).lean();
    }

    // Crea una nueva inscripción
    async create(registrationData) {
        const newRegistration = await registrationModel.create(registrationData);
        return newRegistration.toJSON();
    }

    async getById(id) {
        return await registrationModel.findById(id).lean();
    }

    async getByUser(userId) {
        return await registrationModel.find({ user: userId }).populate('event').lean();
    }

    async delete(id) {
        return await registrationModel.findByIdAndDelete(id);
    }
}