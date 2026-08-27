/* =========================================================
   USUARIO.JS - SERENITY MODE
   ========================================================= */


/* =========================================================
   REFERENCIAS
   ========================================================= */

const overlay = document.getElementById("overlay");

const modalEditar = document.getElementById("modalEditar");
const modalPassword = document.getElementById("modalPassword");
const modalPedidos = document.getElementById("modalPedidos");

const btnEditarInfo = document.getElementById("btnEditarInfo");
const btnPassword = document.getElementById("btnPassword");
const btnPedidos = document.getElementById("btnPedidos");
const btnVerTodosPedidos = document.getElementById("btnVerTodosPedidos");

const modales = document.querySelectorAll(".modal");

const botonesCerrar = document.querySelectorAll("[data-close]");


/* =========================================================
   ABRIR MODAL
   ========================================================= */

function abrirModal(modal) {

    if (!modal) {
        console.error("No se encontró el modal.");
        return;
    }

    if (!overlay) {
        console.error("No se encontró el overlay.");
        return;
    }

    // Primero cerramos cualquier modal abierto
    modales.forEach(function (m) {
        m.classList.remove("active");
    });

    // Abrimos el modal seleccionado
    modal.classList.add("active");

    // Mostramos el fondo oscuro
    overlay.classList.add("active");

    // Evitamos hacer scroll en la página
    document.body.style.overflow = "hidden";
}


/* =========================================================
   CERRAR MODAL
   ========================================================= */

function cerrarModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    // Si ya no queda ningún modal abierto
    const algunModalAbierto =
        document.querySelector(".modal.active");

    if (!algunModalAbierto) {

        overlay.classList.remove("active");

        document.body.style.overflow = "auto";
    }
}


/* =========================================================
   CERRAR TODOS LOS MODALES
   ========================================================= */

function cerrarTodosLosModales() {

    modales.forEach(function (modal) {

        modal.classList.remove("active");

    });

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.style.overflow = "auto";
}


/* =========================================================
   MODAL EDITAR INFORMACIÓN
   ========================================================= */

if (btnEditarInfo) {

    btnEditarInfo.addEventListener("click", function () {

        console.log("Abriendo modal de editar información");

        abrirModal(modalEditar);

    });

}


/* =========================================================
   MODAL CAMBIAR CONTRASEÑA
   ========================================================= */

if (btnPassword) {

    btnPassword.addEventListener("click", function () {

        console.log("Abriendo modal de contraseña");

        abrirModal(modalPassword);

    });

}


/* =========================================================
   MODAL PEDIDOS
   ========================================================= */

if (btnPedidos) {

    btnPedidos.addEventListener("click", function () {

        console.log("Abriendo historial de pedidos");

        abrirModal(modalPedidos);

    });

}


/* =========================================================
   BOTÓN "VER TODOS"
   ========================================================= */

if (btnVerTodosPedidos) {

    btnVerTodosPedidos.addEventListener("click", function () {

        console.log("Abriendo todos los pedidos");

        abrirModal(modalPedidos);

    });

}


/* =========================================================
   BOTONES X Y CANCELAR
   ========================================================= */

botonesCerrar.forEach(function (boton) {

    boton.addEventListener("click", function (evento) {

        evento.preventDefault();

        const modal = boton.closest(".modal");

        cerrarModal(modal);

    });

});


/* =========================================================
   CLICK EN OVERLAY
   ========================================================= */

if (overlay) {

    overlay.addEventListener("click", function () {

        cerrarTodosLosModales();

    });

}


/* =========================================================
   TECLA ESC
   ========================================================= */

document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {

        cerrarTodosLosModales();

    }

});


/* =========================================================
   EVITAR QUE EL CLICK DENTRO DEL MODAL LO CIERRE
   ========================================================= */

modales.forEach(function (modal) {

    const contenido = modal.querySelector(".modal-contenido");

    if (contenido) {

        contenido.addEventListener("click", function (evento) {

            evento.stopPropagation();

        });

    }

});
/* =========================================================
FORMULARIO EDITAR INFORMACIÓN
========================================================= */

const formEditarUsuario =
    document.getElementById("formEditarUsuario");

if (formEditarUsuario) {

    formEditarUsuario.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            const nombre =
                document.getElementById("nombre").value.trim();

            const correo =
                document.getElementById("correo").value.trim();

            const telefono =
                document.getElementById("telefono").value.trim();

            const direccion =
                document.getElementById("direccion").value.trim();

            const fecha =
                document.getElementById("fecha").value;


            /* =========================================
               VALIDACIONES
            ========================================= */

            if (nombre === "") {

                alert("El nombre es obligatorio.");
                return;

            }

            if (correo === "") {

                alert("El correo electrónico es obligatorio.");
                return;

            }

            if (telefono === "") {

                alert("El número telefónico es obligatorio.");
                return;

            }

            if (direccion === "") {

                alert("La dirección es obligatoria.");
                return;

            }


            /* =========================================
               DATOS
            ========================================= */

            const datos = {

                nombre: nombre,

                email: correo,

                telefono: telefono,

                direccion: direccion,

                fecha: fecha

            };


            console.log("DATOS ENVIADOS:");

            console.log(datos);


            try {

                /* =========================================
                   ENVIAR AL FLASK FRONTEND
                ========================================= */

                const respuesta = await fetch(
                    "/usuario/editar",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/x-www-form-urlencoded"

                        },

                        body: new URLSearchParams({

                            nombre: nombre,

                            correo: correo,

                            telefono: telefono,

                            direccion: direccion,

                            fecha: fecha

                        })

                    }
                );


                /* =========================================
                   FLASK REDIRIGE AL PERFIL
                ========================================= */

                if (!respuesta.ok) {

                    console.error(
                        "Error HTTP:",
                        respuesta.status
                    );

                    alert(
                        "No se pudo actualizar la información."
                    );

                    return;

                }


                /* =========================================
                   RECARGAR PERFIL
                ========================================= */

                cerrarTodosLosModales();

                window.location.href =
                    "/usuario/";

            }

            catch (error) {

                console.error(
                    "ERROR ACTUALIZANDO PERFIL:",
                    error
                );

                alert(
                    "No fue posible conectar con el servidor."
                );

            }

        }
    );

}


/* =========================================================
   FORMULARIO CAMBIAR CONTRASEÑA
========================================================= */

const formPassword =
    document.getElementById("formPassword");

if (formPassword) {

    formPassword.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            /* =========================================
               OBTENER CAMPOS
            ========================================= */

            const passwordActual =
                document
                    .getElementById("passwordActual")
                    .value;

            const passwordNueva =
                document
                    .getElementById("passwordNueva")
                    .value;

            const confirmarPassword =
                document
                    .getElementById("confirmarPassword")
                    .value;


            /* =========================================
               VALIDACIONES
            ========================================= */

            if (passwordActual === "") {

                alert(
                    "Debes ingresar tu contraseña actual."
                );

                return;
            }


            if (passwordNueva === "") {

                alert(
                    "Debes ingresar la nueva contraseña."
                );

                return;
            }


            if (confirmarPassword === "") {

                alert(
                    "Debes confirmar la nueva contraseña."
                );

                return;
            }


            if (passwordNueva.length < 8) {

                alert(
                    "La nueva contraseña debe tener mínimo 8 caracteres."
                );

                return;
            }


            if (passwordNueva !== confirmarPassword) {

                alert(
                    "Las contraseñas nuevas no coinciden."
                );

                return;
            }


            /* =========================================
               DATOS
            ========================================= */

            const datos = {

                password_actual:
                    passwordActual,

                password_nueva:
                    passwordNueva

            };


            console.log(
                "DATOS CAMBIO CONTRASEÑA:"
            );

            console.log({
                password_actual: "***",
                password_nueva: "***"
            });


            /* =========================================
               ENVIAR AL FLASK FRONTEND
            ========================================= */

            try {

                const respuesta = await fetch(
                    "/usuario/cambiar-password",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/x-www-form-urlencoded"

                        },

                        body: new URLSearchParams({

                            password_actual:
                                passwordActual,

                            password_nueva:
                                passwordNueva

                        })

                    }
                );


                /* =========================================
                   RESPUESTA DEL FRONTEND
                ========================================= */

                if (!respuesta.ok) {

                    console.error(
                        "Error HTTP:",
                        respuesta.status
                    );

                    alert(
                        "No se pudo cambiar la contraseña."
                    );

                    return;
                }


                /* =========================================
                   ÉXITO
                ========================================= */

                alert(
                    "Contraseña actualizada correctamente."
                );

                formPassword.reset();

                cerrarTodosLosModales();

            }

            catch (error) {

                console.error(
                    "ERROR CAMBIANDO CONTRASEÑA:",
                    error
                );

                alert(
                    "No fue posible conectar con el servidor."
                );

            }

        }
    );

}



/* =========================================================
   ANIMACIÓN DE TARJETAS
   ========================================================= */

const cards =
    document.querySelectorAll(".card, .accion");

cards.forEach(function (card, index) {

    card.animate(

        [
            {
                opacity: 0,
                transform: "translateY(20px)"
            },

            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],

        {
            duration: 500,
            delay: index * 100,
            fill: "forwards"
        }

    );

});


/* =========================================================
   DEBUG
   ========================================================= */

console.log("====================================");
console.log("usuario.js cargado correctamente");
console.log("====================================");

console.log("btnEditarInfo:", btnEditarInfo);
console.log("btnPassword:", btnPassword);
console.log("btnPedidos:", btnPedidos);
console.log("btnVerTodosPedidos:", btnVerTodosPedidos);

console.log("modalEditar:", modalEditar);
console.log("modalPassword:", modalPassword);
console.log("modalPedidos:", modalPedidos);
console.log("overlay:", overlay);