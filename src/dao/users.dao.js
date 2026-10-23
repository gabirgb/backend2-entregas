import { userModel } from "../models/users.model.js";

export class UsersDAO {

    async getAllUsers(queryOptions = {}) {
        const { first_name, last_name, email, role, isActive } = queryOptions;
        const filter = {};

        // 1. Búsqueda por nombre/ ape/ email/ (insensible a mayúsculas/minúsculas y parcial)
        if (first_name) { filter.first_name = { $regex: first_name, $options: 'i' }; }
        if (last_name) { filter.last_name = { $regex: last_name, $options: 'i' }; }
        if (email) { filter.email = { $regex: email, $options: 'i' }; }

        // Búsquedas por valor exacto (enum y boolean)
        if (role) { filter.role = role.toLowerCase(); }
        if (isActive !== undefined) { filter.isActive = isActive === 'true'; }

        return await userModel.find(filter).lean();
    }

    // Busca un usuario por su ID de MongoDB
    async getById(id) {
        return await userModel.findById(id).lean();
    }

    // Busca un usuario por su Email exacto
    async getByEmail(email) {
        return await userModel.findOne({ email: email.toLowerCase() }).lean();
    }

    // creamos un usuario
    async create(userData = {}) {
        const newUser = await userModel.create(userData);
        return newUser.toJSON(); // toJSON() limpia los metadatos internos de Mongoose
    }
}

