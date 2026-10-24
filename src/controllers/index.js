import { EventsServices } from "../services/events.services.js";
import { UsersServices } from "../services/users.services.js";
import { RegistrationServices } from "../services/registration.services.js";

import { EventsController } from "./events.controller.js";
import { UsersController } from "./users.controller.js";
import { RegistrationsController } from "./registrations.controller.js";

import { EventsDAO } from "../dao/events.dao.js";
import { UsersDAO } from "../dao/users.dao.js";
import { RegistrationDAO } from "../dao/registration.dao.js";

// instancio los DAO
export const eventsDAO = new EventsDAO();
export const usersDAO = new UsersDAO();
export const registrationDAO = new RegistrationDAO();

// instancio los servicios
export const eventsService = new EventsServices(eventsDAO);
export const usersService = new UsersServices(usersDAO);
export const registrationService = new RegistrationServices(registrationDAO, eventsDAO, usersDAO);

// instancio los controladores
export const eventsController = new EventsController(eventsService);
export const usersController = new UsersController(usersService);
export const registrationsController = new RegistrationsController(registrationService);