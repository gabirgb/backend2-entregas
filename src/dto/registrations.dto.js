import { UsersDTO } from "./users.dto.js";
import { EventsDTO } from "./events.dto.js";

export class RegistrationDTO {
    constructor(registration) {
        this.id = registration._id || registration.id;
        this.codigoReserva = registration.codigoReserva;
        this.quantity = registration.quantity;
        this.status = registration.status;
        this.cancelledAt = registration.cancelledAt;
        this.createdAt = registration.createdAt;

        // Si el usuario viene populado, lo pasamos por el UsersDTO para garantizar CERO passwords
        this.user = registration.user && typeof registration.user === 'object'
            ? new UsersDTO(registration.user)
            : registration.user;

        // Si el evento viene populado, lo pasamos por el EventsDTO
        this.event = registration.event && typeof registration.event === 'object'
            ? new EventsDTO(registration.event)
            : registration.event;
    }
}