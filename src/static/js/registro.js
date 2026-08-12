/*==================================
        FORMULARIO REGISTRO
===================================*/

const formulario = document.getElementById("formRegistro");

formulario.addEventListener("submit", registrarUsuario);


/*==================================
        REGISTRAR USUARIO
===================================*/

async function registrarUsuario(e) {

    e.preventDefault();

    const nombre = document.querySelector("[name='nombre_cliente']").value.trim();

    const email = document.querySelector("[name='email_cliente']").value.trim();

    const numero = document.querySelector("[name='numero_cliente']").value.trim();

    const direccion = document.querySelector("[name='direccion_cliente']").value.trim();

    const nacimiento = document.querySelector("[name='nacimiento_cliente']").value;

    const password = document.querySelector("[name='password']").value;

    const confirmar = document.querySelector("[name='confirmar']").value;


    /*==============================
            VALIDACIONES
    ==============================*/

    if (
        nombre === "" ||
        email === "" ||
        numero === "" ||
        direccion === "" ||
        nacimiento === "" ||
        password === "" ||
        confirmar === ""
    ) {

        alert("Debe completar todos los campos.");

        return;

    }

    if (password.length < 6) {

        alert("La contraseña debe tener al menos 6 caracteres.");

        return;

    }

    if (password !== confirmar) {

        alert("Las contraseñas no coinciden.");

        return;

    }


    const datos = {

        nombre_cliente: nombre,

        direccion_cliente: direccion,

        nacimiento_cliente: nacimiento,

        email_cliente: email,

        numero_cliente: numero,

        password: password

    };


    try {

        const respuesta = await fetch(
            "http://127.0.0.1:5000/auth/registro",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(datos)

            }

        );


        const resultado = await respuesta.json();


        if (!respuesta.ok) {

            alert(resultado.message);

            return;

        }


        alert("Usuario registrado correctamente.");

        formulario.reset();

        window.location.href = "/auth/login";


    } catch (error) {

        console.error(error);

        alert("Error al conectar con el servidor.");

    }

}


/*==================================
    MOSTRAR / OCULTAR CONTRASEÑA
===================================*/

const iconos = document.querySelectorAll(".ojo");

iconos.forEach((icono) => {

    icono.addEventListener("click", function () {

        const input = this.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";

            this.classList.remove("fa-eye");

            this.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            this.classList.remove("fa-eye-slash");

            this.classList.add("fa-eye");

        }

    });

});