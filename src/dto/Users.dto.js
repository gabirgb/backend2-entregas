export class UsersDTO {
    constructor(user) {
        this.id = user._id;
        this.nombre = user.first_name;
        this.apellido = user.last_name;
        this.casilla = user.email;
        this.rol = user.role;
    }
}