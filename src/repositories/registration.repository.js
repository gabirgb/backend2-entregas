export class RegistrationRepository {
    constructor(registrationDAO) {
        this.registrationDAO = registrationDAO;
    }

    async getById(id) {
        return await this.registrationDAO.getById(id);
    }

    async create(registrationData) {
        return await this.registrationDAO.create(registrationData);
    }

    async getByUser(userId) {
        return await this.registrationDAO.getByUser(userId);
    }

    async getByEvent(eventId) {
        return await this.registrationDAO.getByEvent(eventId);
    }

    async getActiveByUserAndEvent(userId, eventId) {
        return await this.registrationDAO.getActiveByUserAndEvent(userId, eventId);
    }

    async getActiveQuantityByEvent(eventId) {
        return await this.registrationDAO.getActiveQuantityByEvent(eventId);
    }

    async countByEvent(eventId) {
        return await this.registrationDAO.countByEvent(eventId);
    }

    async updateStatus(id, status, cancellationDate = null) {
        return await this.registrationDAO.updateStatus(id, status, cancellationDate);
    }
}