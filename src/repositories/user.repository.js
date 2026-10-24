export class UserRepository {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async getAllUsers(queryParams) {
        return await this.userDAO.getAllUsers(queryParams);
    }

    async getById(id) {
        return await this.userDAO.getById(id);
    }

    async getByEmail(email) {
        return await this.userDAO.getByEmail(email);
    }

    async create(userData) {
        return await this.userDAO.create(userData);
    }

    async update(id, updateData) {
        return await this.userDAO.update(id, updateData);
    }

    async delete(id) {
        return await this.userDAO.delete(id);
    }
}