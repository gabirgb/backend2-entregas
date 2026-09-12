import { describe, it, expect } from 'vitest';
import { UsersDTO } from '../src/dto/Users.dto.js'; // Ajusta la ruta a tu DTO
import { isValidEmail } from '../src/utils/accountValidator.js'; // Ajusta las rutas a tus helpers
import { sanitizeInput, sanitizeEmail } from '../src/utils/sanitizer.js';

describe('Pruebas Unitarias para Helpers y DTOs', () => {

    describe('UsersDTO', () => {
        it('Debe formatear un objeto de usuario correctamente y mapear _id a id', () => {
            const rawUser = {
                _id: '66e23a1b8f9c10123456789a',
                first_name: 'Gabriela',
                last_name: 'Pérez',
                email: 'gabriela@example.com',
                role: 'user'
            };

            const userDTO = new UsersDTO(rawUser);

            expect(userDTO.id).toBe('66e23a1b8f9c10123456789a');
            expect(userDTO.nombre).toBe('Gabriela');
            expect(userDTO.apellido).toBe('Pérez');
            expect(userDTO.casilla).toBe('gabriela@example.com');
            expect(userDTO.rol).toBe('user');
            expect(userDTO).not.toHaveProperty('password'); // Verifica que no exponga la clave
        });
    });

    describe('Validaciones y Sanitización', () => {
        it('isValidEmail debe validar correos correctamente', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('correo-invalido')).toBe(false);
            expect(isValidEmail(null)).toBe(false);
        });

        it('sanitizeEmail debe limpiar espacios y pasar a minúsculas', () => {
            const cleanEmail = sanitizeEmail('  Gabriela@TEST.Com  ');
            expect(cleanEmail).toBe('gabriela@test.com');
        });

        it('sanitizeInput debe escapar caracteres HTML para prevenir XSS', () => {
            const unsafeString = '<script>alert("xss")</script>';
            const safeString = sanitizeInput(unsafeString);
            expect(safeString).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
        });
    });

});