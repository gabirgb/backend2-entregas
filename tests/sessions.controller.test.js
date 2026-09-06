import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionsController } from '../src/controllers/sessions.controller.js';
import * as cryptoUtils from '../src/utils/crypto.js';

// Una prueba unitaria (o unit test) consiste en aislar la pieza de código más pequeña posible de tu aplicación —en este caso, la clase SessionsController— y probar su comportamiento en total aislamiento, sin conectarse a dependencias externas reales. En la arquitectura que estás construyendo, la "unidad" es la lógica del controlador. Para probar solo esa lógica sin que intervengan otros sistemas, reemplazas todo lo que lo rodea por simulaciones (mocks):
//Base de datos real: Se reemplaza por mockUsersDAO (un objeto falso que devuelve respuestas preparadas al instante).
// Servidor HTTP Express real: Se reemplaza por objetos JS simples (req, res, next).
// Consultas de red o hashing pesado: Se simulan en memoria con vi.fn() o vi.spyOn().

//describe('Título del bloque', () => { ... }): Sirve para agrupar tests relacionados. Piensa en él como una carpeta o sección. En tu archivo creaste un describe principal para todo el controlador, y sub-bloques describe específicos para cada método (POST /login, GET /current).
describe('Pruebas Unitarias para SessionsController', () => {
    let sessionsController;
    let mockUsersDAO;
    let req;
    let res;
    let next;

    //beforeEach(() => { ... }): Es un hook que se ejecuta automáticamente antes de cada it(). Se usa para reiniciar las variables (req, res, mockUsersDAO) de modo que cada prueba empiece con un estado limpio y no se contamine con los datos de la prueba anterior.
    beforeEach(() => {
        // 1. Instanciamos un DAO Falso (Mock)
        mockUsersDAO = {
            //vi: Es el objeto global de Vitest para gestionar Mocks, Espías y Temporizadores. Con vi.fn() creas funciones falsas que recuerdan cuántas veces fueron llamadas y con qué parámetros; con vi.spyOn() intervienes un módulo para cambiar su comportamiento durante el test.
            getByEmail: vi.fn()
        };

        // 2. Instanciamos el controlador inyectando el mockDAO
        sessionsController = new SessionsController(mockUsersDAO);

        // 3. Simulamos las funciones/objetos de Express
        req = { body: {} };
        res = {
            setHeader: vi.fn(),
            status: vi.fn().mockReturnThis(), // Permite encadenar .status().json()
            json: vi.fn().mockReturnThis()
        };
        next = vi.fn();
    });

    describe('POST /api/sessions/login', () => {

        //it('qué debe hacer el test', () => { ... }) (o test()): Define un caso de prueba individual. Es la unidad mínima donde ejecutas código y verificas un resultado.
        it('Debe devolver 400 si falta el email o la contraseña', async () => {
            req.body = { email: 'test@example.com' }; // Sin password

            await sessionsController.login(req, res, next);

            //expect(valor): Es la herramienta de aserción (las comprobaciones). Evalúa si el resultado real es igual al esperado.
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Email y contraseña son requeridos'
            });
        });

        it('Debe devolver 404 si el usuario no existe en la BD', async () => {
            req.body = { email: 'noexiste@example.com', password: '123' };
            mockUsersDAO.getByEmail.mockResolvedValue(null); // Simula usuario no encontrado

            await sessionsController.login(req, res, next);

            expect(mockUsersDAO.getByEmail).toHaveBeenCalledWith('noexiste@example.com');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Credenciales inválidas.'
            });
        });

        it('Debe devolver 401 si la contraseña es incorrecta', async () => {
            req.body = { email: 'user@example.com', password: 'wrongPassword' };

            const fakeUser = { email: 'user@example.com', password: '$2b$10$hashedPassword' };
            mockUsersDAO.getByEmail.mockResolvedValue(fakeUser);

            // Mockeamos comparePassword para que devuelva false
            vi.spyOn(cryptoUtils, 'comparePassword').mockReturnValue(false);

            await sessionsController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Credenciales inválidas.'
            });
        });

        it('Debe devolver 200 y el payload formateado cuando el login es exitoso', async () => {
            req.body = { email: 'user@example.com', password: 'password123' };

            const fakeUser = {
                _id: '60d5ec49f1b2c81128d4e568',
                first_name: 'Juan',
                last_name: 'Pérez',
                email: 'user@example.com',
                password: '$2b$10$hashedPassword',
                role: 'user'
            };

            mockUsersDAO.getByEmail.mockResolvedValue(fakeUser);
            vi.spyOn(cryptoUtils, 'comparePassword').mockReturnValue(true);

            await sessionsController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'success',
                    message: 'Bienvenido Juan Pérez',
                    payload: expect.anything() // DTO formateado
                })
            );
        });

    });

    describe('GET /api/sessions/current', () => {
        it('Debe responder con el placeholder temporal', async () => {
            await sessionsController.getCurrentSession(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Endpoint de sesión actual (sin lógica de auth aún)',
                payload: null
            });
        });
    });

    describe('POST /api/sessions/logout', () => {
        it('Debe responder con el placeholder temporal de logout', async () => {
            await sessionsController.logout(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Endpoint de logout (placeholder)'
            });
        });
    });

});