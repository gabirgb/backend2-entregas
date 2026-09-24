//matcheo las variables con los campos q tengo en el html
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

const divMensajes = document.getElementById("divMensajes");

const divDatos = document.getElementById("divDatos");
const btnDatos = document.getElementById("btnDatos");

/**
 * Función auxiliar para mostrar alertas de Bootstrap y ocultarlas tras unos segundos
 * lleva 2 params: 
 * mensaje - Texto a mostrar
 * tipo: "danger" para errores, "success" para éxito, "warning", etc.
 *
 */

function mostrarMensaje(mensaje, tipo = "danger") {
    // 1. reseteamos estilos de color previos y asignamos el nuevo
    divMensajes.className = `alert alert-${tipo} text-center`;

    // 2. Insertamos el mensaje y mostramos la caja (quitando d-none)
    divMensajes.textContent = mensaje;
    divMensajes.classList.remove("d-none");

    // 3. Ocultamos la caja automáticamente después de 3 segundos
    setTimeout(() => {
        divMensajes.classList.add("d-none");
        divMensajes.textContent = "";
    }, 3000);
}


btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = inputEmail.value;
    let password = inputPassword.value;

    if (!email || !password) {
        mostrarMensaje("Email y pass son obligatorios", "danger");
        return;
    }

    try {
        //validaciones pertinentes
        let response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        //no es concole.log pero eliminar detalles del error abajo
        if (response.status >= 400) {
            let data = await response.json();
            // mostrarMensaje("Error al autenticar: " + (data.error || data.message || "Credenciales inválidas"), "danger");
            mostrarMensaje("Error al autenticar. Credenciales inválidas", "danger");
            return;
        }

        // si pasa las validaciones procedo a autenticar
        let data = await response.json();

        mostrarMensaje(`Login exitoso para ${data.payload.nombre}`, "success");

    } catch (error) {
        mostrarMensaje("Error de conexión con el servidorr", "danger");
    }


})

//Pruebas
btnDatos.addEventListener("click", async (e) => {
    e.preventDefault();

    let response = await fetch("/test");
    let data = await response.json();

    divDatos.textContent = JSON.stringify(data, null, 2);
})