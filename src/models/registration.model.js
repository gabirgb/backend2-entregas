import mongoose from "mongoose";
import { REGISTRATION_STATUS, VALID_REGISTRATION_STATUSES } from '../constants/registration.constants.js'

const registrationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
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
        },
        codigoReserva: {
            type: String,
            unique: true,
            required: [true, "El código de reserva es obligatorio"],
            trim: true // siempre trimear los strings
        },
        status: {
            type: String,
            enum: {
                values: VALID_REGISTRATION_STATUSES,
                message: '{VALUE} no es un estado válido',
            },
            default: REGISTRATION_STATUS.ACTIVE, // Por defecto la reserva está activa
        },
        quantity: {
            type: Number,
            required: [true, "La cantidad de reservas es obligatoria."],
            min: [1, "Las reservas deben debe ser un numero positivo mayor o igual a 1, Usted ingresó {VALUE}"],
            validate: {
                validator: Number.isInteger, //validar que sea un número entero
                message: (n) => `No se aceptan valores negativos. Usted ingresó ${n.value}` //se muestra si es false
            },
            default: 1
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