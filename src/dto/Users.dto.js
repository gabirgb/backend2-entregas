// SOLO para dar la respuesta al cliente
export class UsersDTO {
    constructor(user) {
        this.id = user._id || user.id;
        this.nombre = user.first_name;
        this.apellido = user.last_name;
        this.casilla = user.email;
        this.role = user.role;
    }
}