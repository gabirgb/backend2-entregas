export class EventRepository {
    constructor(eventDAO) {
        this.eventDAO = eventDAO;
    }

    async getAllEvents(cleanQueryOptions) {
        return await this.eventDAO.getAllEvents(cleanQueryOptions);
    }

    async getById(id) {
        return await this.eventDAO.getById(id);
    }

    async create(eventData) {
        return await this.eventDAO.create(eventData);
    }

    async update(id, updateData) {
        return await this.eventDAO.update(id, updateData);
    }

    async updateStatus(id, status) {
        return await this.eventDAO.update(id, { status });
    }
}