import { EventsServices } from "../services/events.services.js";
import { UsersServices } from "../services/users.services.js";

import { EventsController } from "./events.controller.js";
import { UsersController } from "./users.controller.js";
import { SessionsController } from "./sessions.controller.js";

import { EventsDAO } from "../dao/events.dao.js";
import { UsersDAO } from "../dao/users.dao.js";

// instancio los DAO
export const eventsDAO = new EventsDAO();
export const usersDAO = new UsersDAO();

// instancio los servicios
export const eventsService = new EventsServices(eventsDAO);
export const usersService = new UsersServices(usersDAO);

// instancio los controladores
export const eventsController = new EventsController(eventsService);
export const usersController = new UsersController(usersService);
export const sessionsController = new SessionsController(usersDAO);
