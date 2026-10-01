// tests/unit/usersService.test.js
import { describe, it, expect, vi } from 'vitest';
import { UsersServices } from '../../src/services/users.services.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../src/utils/CustomError.js';

// Simulamos los helpers externos para evitar dependencias en la prueba unitaria
vi.mock('../../src/helpers/userValidator.js', () => ({
    validateCreateUserData: vi.fn((data) => {
        // Valida simuladamente que si están los campos básicos la validación pasa
        if (!data.email || !data.password) {
            return { isValid: false, error: 'Faltan campos obligatorios' };
        }
        return { isValid: true };
    })
}));

vi.mock('../../src/utils/sanitizer.js', () => ({
    sanitizeInput: vi.fn((val) => val)
}));

vi.mock('../../src/utils/crypto.js', () => ({
    hashPassword: vi.fn().mockResolvedValue('hashed_password')
}));


describe('UsersService - Pruebas de errores', () => {

    it('debe lanzar NotFoundError si el usuario no existe por ID', async () => {
        // Mock del DAO
        const mockDAO = { getById: vi.fn().mockResolvedValue(null) };
        const service = new UsersServices(mockDAO);

        // Verificamos que al ejecutar el servicio se lance exactamente la clase NotFoundError
        await expect(service.getUsersById('12345')).rejects.toThrow(NotFoundError);
        await expect(service.getUsersById('12345')).rejects.toThrow('No se encontró al usuario con id 12345');
    });

    it('debe lanzar NotFoundError si no se encuentran usuarios en getAllUsers', async () => {
        const mockDAO = { getAllUsers: vi.fn().mockResolvedValue([]) };
        const service = new UsersServices(mockDAO);

        await expect(service.getAllUsers({})).rejects.toThrow(NotFoundError);
        await expect(service.getAllUsers({})).rejects.toThrow('No hay usuarios que coincidan con los criterios de busqueda');
    });

    it('debe lanzar BadRequestError si los datos de creación no son válidos', async () => {
        const mockDAO = {
            getByEmail: vi.fn().mockResolvedValue(null)
        };
        const service = new UsersServices(mockDAO);

        const invalidUserData = { email: '' };

        await expect(service.createUser(invalidUserData)).rejects.toThrow(BadRequestError);
        await expect(service.createUser(invalidUserData)).rejects.toThrow('Faltan campos obligatorios');
    });


    it('debe lanzar ConflictError si el email ya está registrado', async () => {
        // 1. Simulamos que el DAO encuentra un usuario existente con ese email
        const mockDAO = {
            getByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'test@mail.com' })
        };
        const service = new UsersServices(mockDAO);

        // 2. Enviamos los datos COMPLETOS del usuario (nombre, apellido, etc.) 
        //    para que supere las validaciones de campos requeridos (BadRequestError)
        const userData = {
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'test@mail.com',
            password: 'password123'
            // Agrega aquí cualquier otro campo que valide tu createUser
        };

        // 3. Ahora sí llegará a la comprobación de duplicados y lanzará ConflictError
        await expect(service.createUser(userData)).rejects.toThrow(ConflictError);
        await expect(service.createUser(userData)).rejects.toThrow('El email ya se encuentra registrado.');
    });
});