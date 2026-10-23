export class RegistrationsController {
    constructor(registrationService) {
        this.registrationService = registrationService;
    }

    // Inscribir al usuario logueado a un evento
    registerUserToEvent = async (req, res, next) => {
        try {
            const { eventId } = req.body;
            const userId = req.user._id; // Inyectado por Passport ('current')

            const newRegistration = await this.registrationService.registerUserToEvent(eventId, userId);

            res.status(201).json({
                status: "success",
                message: "Inscripción realizada con éxito",
                payload: newRegistration
            });
        } catch (error) {
            next(error);
        }
    }

    // Ver las inscripciones del usuario autenticado
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

    // Cancelar una inscripción
    cancelRegistration = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            await this.registrationService.cancelRegistration(id, userId);

            res.status(200).json({
                status: "success",
                message: "Inscripción cancelada correctamente"
            });
        } catch (error) {
            next(error);
        }
    }
}