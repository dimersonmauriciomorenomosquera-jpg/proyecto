/*==================================
        MODAL RECUPERAR
===================================*/

const modalRecuperar = document.getElementById("modalRecuperar");
const abrirRecuperar = document.getElementById("abrirRecuperar");
const cerrarRecuperar = document.querySelector(".cerrar-modal");

/*==================================
        ABRIR MODAL
===================================*/

abrirRecuperar.addEventListener("click", function (e) {

    e.preventDefault();

    modalRecuperar.classList.add("activo");

});

/*==================================
        CERRAR MODAL
===================================*/

function cerrarModal() {

    modalRecuperar.classList.remove("activo");

}

cerrarRecuperar.addEventListener("click", cerrarModal);

/*==================================
        CERRAR HACIENDO CLICK FUERA
===================================*/

modalRecuperar.addEventListener("click", function (e) {

    if (e.target === modalRecuperar) {

        cerrarModal();

    }

});

/*==================================
        CERRAR CON ESC
===================================*/

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        cerrarModal();

    }

});

/*==================================
        LOGIN
===================================*/

const formularioLogin = document.getElementById("formLogin");

formularioLogin.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email_cliente").value.trim();

    const password = document.getElementById("password").value;

    if (email === "" || password === "") {

        alert("Debe completar todos los campos.");

        return;

    }

    try {

        const respuesta = await fetch("http://127.0.0.1:5000/auth/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email_cliente: email,

                password: password

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.message);

            return;

        }

        // Guardar token JWT

        localStorage.setItem("token", datos.token);

        // Guardar usuario

        localStorage.setItem(

            "usuario",

            JSON.stringify(datos.usuario)

        );

        alert("Bienvenido " + datos.usuario.nombre);

        // Redirigir al inicio

        window.location.href = "/";

    }

    catch (error) {

        console.error(error);

        alert("Error al conectar con el servidor.");

    }

});

/*==================================
    MOSTRAR / OCULTAR CONTRASEÑA
===================================*/

const inputPassword = document.getElementById("password");

const iconoPassword = document.getElementById("mostrarPassword");

iconoPassword.addEventListener("click", function () {

    if (inputPassword.type === "password") {

        inputPassword.type = "text";

        iconoPassword.classList.remove("fa-eye");

        iconoPassword.classList.add("fa-eye-slash");

    }

    else {

        inputPassword.type = "password";

        iconoPassword.classList.remove("fa-eye-slash");

        iconoPassword.classList.add("fa-eye");

    }

});