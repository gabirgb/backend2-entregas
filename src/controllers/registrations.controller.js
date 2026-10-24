export class RegistrationsController {
    constructor(registrationService) {
        this.registrationService = registrationService;
    }

    // 1. Inscribir al usuario logueado a un evento (POST /api/events/:eid/registrations)
    registerUserToEvent = async (req, res, next) => {
        try {
            const { eid } = req.params;
            const { quantity = 1 } = req.body;
            const userId = req.user._id; // Inyectado por Passport ('current')

            const newRegistration = await this.registrationService.registerUserToEvent(eid, userId, quantity);

            res.status(201).json({
                status: "success",
                message: "Inscripción realizada con éxito. Correo de confirmación enviado.",
                payload: newRegistration
            });
        } catch (error) {
            next(error);
        }
    }

    // 2. Ver las inscripciones del usuario autenticado (GET /api/registrations/my-registrations)
    getUserRegistrations = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const registrations = await this.registrationService.getUserRegistrations(userId);

            res.status(200).json({
                status: "success",
                payload: registrations
            });
        } catch (error) {
            next(error);
        }
    }

    // 3. Ver las inscripciones de un evento específico (GET /api/events/:eid/registrations - Organizer/Admin)
    getEventRegistrations = async (req, res, next) => {
        try {
            const { eid } = req.params;
            const sessionUser = req.user;

            const registrations = await this.registrationService.getEventRegistrationsForOrganizer(eid, sessionUser);

            res.status(200).json({
                status: "success",
                payload: registrations
            });
        } catch (error) {
            next(error);
        }
    }

    // 4. Cancelación lógica de una inscripción (PATCH /api/registrations/:tid/cancel)
    cancelRegistration = async (req, res, next) => {
        try {
            const { tid } = req.params;
            const sessionUser = req.user;

            const updatedRegistration = await this.registrationService.cancelRegistration(tid, sessionUser);

            res.status(200).json({
                status: "success",
                message: "Inscripción cancelada correctamente. Cupo liberado.",
                payload: updatedRegistration
            });
        } catch (error) {
            next(error);
        }
    }
}