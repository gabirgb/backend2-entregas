import { EventsController } from "./events.controller.js";
import { UsersController } from "./users.controller.js";
import { SessionsController } from "./sessions.controller.js";

import { EventsDAO } from "../dao/events.dao.js";
import { UsersDAO } from "../dao/users.dao.js";

export const eventsDAO = new EventsDAO();
export const usersDAO = new UsersDAO();

export const eventsController = new EventsController(eventsDAO);
export const usersController = new UsersController(usersDAO);

export const sessionsController = new SessionsController(usersDAO);