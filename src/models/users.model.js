import mongoose from "mongoose";
import { USER_ROLE, VALID_USER_ROLES } from '../constants/users.constants.js'

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        last_name: {
            type: String,
            required: [true, 'El apellido es obligatorio'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        },
        birth: {
            type: Date,
            required: [true, 'La fecha de nacimiento es obligatoria']
        },
        role: {
            type: String,
            enum: {
                values: VALID_USER_ROLES,
                message: '{VALUE} no es un rol válido',
            },
            default: USER_ROLE.USER,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        strict: true,
    }
)

export const userModel = mongoose.model('user', userSchema);