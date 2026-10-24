import { sanitizeInput } from "../utils/sanitizer.js";
import { validateCreateUserData } from "../helpers/userValidator.js";
import { hashPassword } from '../utils/crypto.js'
import { UsersDTO } from "../dto/users.dto.js";
import { USER_ROLE } from "../constants/users.constants.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/CustomError.js";

// creo la clase
export class UsersServices {
    constructor(userRepository) {
        this.userRepository = userRepository; //el this se refiere al objeto actual.
    }

    getAllUsers = async (queryParams) => {
        const users = await this.userRepository.getAllUsers(queryParams);

        // Si no hay usuarios
        if (!users || users.length === 0) {
            throw new NotFoundError('No hay usuarios que coincidan con los criterios de busqueda');
        }

        return users;
    }

    getUsersById = async (id) => {
        const user = await this.userRepository.getById(id);

        // Si no hay usuarios
        if (!user) {
            throw new NotFoundError(`No se encontró al usuario con id ${id}`);
        }

        return user;
    }

    getUsersByEmail = async (email) => {
        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            throw new NotFoundError(`No se encontró al usuario con email ${email}`);
        }

        return user;
    }

    createUser = async (rawUserData) => {

        // 1. Ejecuto la validación en el helper userValidator pasando el body de la petición
        const validation = validateCreateUserData(rawUserData);

        // 2. Si hay errores de validación, cortamos el flujo y devolvemos 400
        if (!validation.isValid) {
            throw new BadRequestError(validation.error);
        }

        // 3. Verificamos si el email ya existe en la base de datos (Regla de negocio adicional)
        const existingUser = await this.userRepository.getByEmail(rawUserData.email);
        if (existingUser) {
            throw new ConflictError('El email ya se encuentra registrado.');
        }

        // 4. Sanitización y transformación de datos
        const hashedPassword = await hashPassword(rawUserData.password);

        // 5. Sanitizo campos de texto
        const cleanUserData = {
            first_name: sanitizeInput(rawUserData.first_name),
            last_name: sanitizeInput(rawUserData.last_name),
            email: rawUserData.email.toLowerCase().trim(),
            password: hashedPassword,
            birth: rawUserData.birth,
            role: USER_ROLE.USER, // Fuerzo q siempre sea role = 'user' por registro público
            isActive: rawUserData.isActive !== undefined ? rawUserData.isActive : true,
        }

        // 6. Si todo está ok, procedemos a crear el usuario en el DAO con la data ya validada y sanitizada
        const newUser = await this.userRepository.create(cleanUserData);

        // 7. Retorno formateado mediante DTO
        return new UsersDTO(newUser);
    }
}