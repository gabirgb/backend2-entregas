import mongoose from "mongoose";
import { EVENT_STATUS, VALID_EVENT_STATUSES } from '../constants/events.constants.js'

const eventSchema = new mongoose.Schema(
    // el schema tiene 2 argumentos q se configuran como 2 obj:
    {//en el 1er arg defino las propiedades de mi elemento
        code: {
            //una vez q defini "unique" por mas q lo quite desde acá en la DB queda marcado. SI lo quiero eliminar tengo q ir a la db en mangodb.com
            type: String,
            unique: true,
            required: [true, "El código del producto es obligatorio"],
            trim: true // siempre trimear los strings
        },
        title:
        {
            type: String,
            required: [true, "El título es obligatorio"],
            minLength: [3, "El título debe tener al menos 3 caracteres"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            minLength: [10, "La cantidad min de caracteres es 10. Ud ingresó {VALUE}"],
            trim: true
        },
        date: {
            type: Date,
            validate: {
                // Valida que la fecha del evento no sea en el pasado
                validator: function (value) {
                    return value > new Date();
                },
                message: 'La fecha del evento debe ser posterior a la fecha actual.',
            },
        },
        location: {
            type: String,
            required: [true, "La ubicación es obligatoria"],
            minLength: [10, "La cantidad min de caracteres es de 10. Ustes ingresó {VALUE}"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "La categoría es obligatoria"],
            trim: true
        },
        artist: {
            type: String,
            required: [true, "El artista es obligatorio"],
            minLength: [2, "La cantidad min de caracteres es de 2. Ustes ingresó {VALUE}"],
            trim: true
        },
        thumbnail: {
            type: String,
            trim: true,
            default: ""
        },
        price: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0, "El precio debe ser un numero positivo mayor o igual a cero, Usted ingresó {VALUE}"],
        },
        totalTickets: {
            type: Number,
            required: [true, "La cantidad de tickets a vender es obligatorio."],
            min: [0, "La cantidad de tickets no puede ser negativa. Usted ingresó {VALUE}"],
            validate: {
                //validar que sea un número entero
                validator: Number.isInteger, //validador de num enteros que trae por defecto Mongoose, así como este hay muchos otros validadores que trae x default...
                //Se supone q aca no tengo q poner mucho código sino que la validacion más grosa la tengo q hacer en el controlador, pero la realidad es que este "validator" puede tener tanta logica como uno requiera, por ej:
                // validator: data => {
                //     return data < 0 ? false : true
                // },
                message: (n) => `No se aceptan valores negativos. Usted ingresó ${n.value}` //se muestra si es false
            }
        },
        status: {
            type: String,
            // enum restringe los valores permitidos únicamente a esta lista
            enum: {
                values: VALID_EVENT_STATUSES, // uso la constante centralizada
                message: '{VALUE} no es un estado válido',
            },
            default: EVENT_STATUS.DRAFT, // Por defecto se crea en borrador
            lowercase: true,  // Convierte automáticamente el string a minúsculas
        },
    },
    {
        timestamps: true, // Crea automáticamente createdAt y updatedAt
        // collection: "", CREO q se usa para sobreescribir a qué coleccion conectarme cuando hago la solicitud
        strict: true, //por defecto es true. Si es TRUE verifica la validez de los campos con type asignado, que se envíen solo los campos declarados en el schema, si es false las deja pasar...
    }
)

export const eventModel = mongoose.model('events', eventSchema);