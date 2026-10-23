import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "El usuario es obligatorio para la inscripción."]
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
            required: [true, "El evento es obligatorio para la inscripción."]
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Índice compuesto: un usuario solo puede tener una inscripción activa por evento.
// Un índice único compuesto es una herramienta de optimización y restricción a nivel de base de datos que combina dos o más campos para garantizar que esa combinación exacta sea única en toda la colección.
// compuesto: Significa que el índice no mira un solo campo por separado, sino que toma dos campos juntos: el campo user y el campo event.
// unico: que no va a permitir esa combinacion más de una vez (lanza un error de clave duplicada o Duplicate Key Error)
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export const registrationModel = mongoose.model('registration', registrationSchema);