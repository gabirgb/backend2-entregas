import { EventsDAO } from "../dao/events.dao.js";
import { UsersDAO } from "../dao/users.dao.js";
import { RegistrationDAO } from "../dao/registration.dao.js";

import { UserRepository } from "../repositories/user.repository.js";
import { EventRepository } from "../repositories/event.repository.js";
import { RegistrationRepository } from "../repositories/registration.repository.js";

import { EventsServices } from "../services/events.services.js";
import { UsersServices } from "../services/users.services.js";
import { RegistrationServices } from "../services/registration.services.js";

import { EventsController } from "./events.controller.js";
import { UsersController } from "./users.controller.js";
import { RegistrationsController } from "./registrations.controller.js";

// 1. DAOs (Persistencia pura con Mongoose)
export const eventsDAO = new EventsDAO();
export const usersDAO = new UsersDAO();
export const registrationDAO = new RegistrationDAO();

// 2. Repositories (Abstracción del dominio)
export const userRepository = new UserRepository(usersDAO);
export const eventRepository = new EventRepository(eventsDAO);
export const registrationRepository = new RegistrationRepository(registrationDAO);

// 3. Services (Lógica de negocio inyectando repositorios)
export const eventsService = new EventsServices(eventRepository, registrationRepository);
export const usersService = new UsersServices(userRepository);
export const registrationService = new RegistrationServices(registrationRepository, eventRepository, userRepository);

// 4. Controllers (Coordinación de respuesta)
export const eventsController = new EventsController(eventsService);
export const usersController = new UsersController(usersService);
export const registrationsController = new RegistrationsController(registrationService);