// ==========================================================
// LOGIN.JS
// ==========================================================

console.log("========================================");
console.log("LOGIN.JS CARGADO");
console.log("========================================");


// ==========================================================
// LOGIN
// ==========================================================

const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function (e) {

        const emailInput =
            document.getElementById("email_cliente");

        const passwordInput =
            document.getElementById("password");


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        // ==================================================
        // VALIDAR CORREO
        // ==================================================

        if (email === "") {

            e.preventDefault();

            alert("El correo es obligatorio.");

            emailInput.focus();

            return;
        }


        // ==================================================
        // VALIDAR CONTRASEÑA
        // ==================================================

        if (password === "") {

            e.preventDefault();

            alert("La contraseña es obligatoria.");

            passwordInput.focus();

            return;
        }


        // ==================================================
        // LOGIN NORMAL
        // ==================================================
        //
        // IMPORTANTE:
        //
        // NO usamos:
        //
        // e.preventDefault();
        //
        // NO usamos fetch().
        //
        // El navegador enviará normalmente:
        //
        // POST /auth/login
        //
        // Flask recibirá el formulario.
        //
        // auth.py llamará al backend.
        //
        // Si hay error:
        //     flash(...)
        //     redirect(...)
        //
        // Si es correcto:
        //     guarda la sesión
        //     redirect(...)
        //
        // ==================================================

    });

}


// ==========================================================
// MOSTRAR / OCULTAR CONTRASEÑA DEL LOGIN
// ==========================================================

const mostrarPassword =
    document.getElementById("mostrarPassword");

const password =
    document.getElementById("password");


if (mostrarPassword && password) {

    mostrarPassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            mostrarPassword.classList.remove(
                "fa-eye"
            );

            mostrarPassword.classList.add(
                "fa-eye-slash"
            );

        } else {

            password.type = "password";

            mostrarPassword.classList.remove(
                "fa-eye-slash"
            );

            mostrarPassword.classList.add(
                "fa-eye"
            );

        }

    });

}


// ==========================================================
// MODAL RECUPERAR CONTRASEÑA
// ==========================================================

const modalRecuperar =
    document.getElementById("modalRecuperar");

const abrirRecuperar =
    document.getElementById("abrirRecuperar");

const cerrarRecuperar =
    document.getElementById("cerrarRecuperar");


if (abrirRecuperar && modalRecuperar) {

    abrirRecuperar.addEventListener("click", function (e) {

        e.preventDefault();

        modalRecuperar.style.display = "flex";

    });

}


if (cerrarRecuperar && modalRecuperar) {

    cerrarRecuperar.addEventListener("click", function () {

        modalRecuperar.style.display = "none";

    });

}


// ==========================================================
// CERRAR MODAL HACIENDO CLICK AFUERA
// ==========================================================

if (modalRecuperar) {

    modalRecuperar.addEventListener("click", function (e) {

        if (e.target === modalRecuperar) {

            modalRecuperar.style.display = "none";

        }

    });

}


// ==========================================================
// RECUPERAR CONTRASEÑA
// ==========================================================

const formularioRecuperar =
    document.getElementById("formRecuperar");


if (formularioRecuperar) {

    formularioRecuperar.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const correoInput =
                document.getElementById("correoRecuperar");

            const correo =
                correoInput.value.trim();


            // ==================================================
            // VALIDAR CORREO
            // ==================================================

            if (correo === "") {

                alert(
                    "El correo es obligatorio."
                );

                correoInput.focus();

                return;
            }


            try {

                console.log(
                    "VERIFICANDO CORREO:",
                    correo
                );


                const respuesta = await fetch(
                    "/auth/recuperar/verificar",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: correo
                        })
                    }
                );


                const datos =
                    await respuesta.json();


                console.log(
                    "RESPUESTA RECUPERACIÓN:",
                    datos
                );


                // ==================================================
                // ERROR
                // ==================================================

                if (!respuesta.ok) {

                    const mensaje =
                        datos.message ||
                        datos.error ||
                        "No fue posible verificar el correo.";

                    mostrarMensajeRecuperacion(
                        mensaje,
                        "error"
                    );

                    return;
                }


                // ==================================================
                // CORREO ENCONTRADO
                // ==================================================

                const correoVerificado =
                    document.getElementById(
                        "correoVerificado"
                    );

                const pasoCorreo =
                    document.getElementById(
                        "pasoCorreo"
                    );

                const pasoPassword =
                    document.getElementById(
                        "pasoPassword"
                    );


                if (correoVerificado) {

                    correoVerificado.textContent =
                        correo;

                }


                if (pasoCorreo) {

                    pasoCorreo.style.display =
                        "none";

                }


                if (pasoPassword) {

                    pasoPassword.style.display =
                        "block";

                }


                limpiarMensajeRecuperacion();

            } catch (error) {

                console.error(
                    "ERROR RECUPERACIÓN:",
                    error
                );

                mostrarMensajeRecuperacion(
                    "No se pudo conectar con el servidor.",
                    "error"
                );

            }

        }
    );

}


// ==========================================================
// MOSTRAR / OCULTAR NUEVA CONTRASEÑA
// ==========================================================

const mostrarNuevaPassword =
    document.getElementById(
        "mostrarNuevaPassword"
    );

const nuevaPassword =
    document.getElementById(
        "nuevaPassword"
    );


if (
    mostrarNuevaPassword &&
    nuevaPassword
) {

    mostrarNuevaPassword.addEventListener(
        "click",
        function () {

            if (
                nuevaPassword.type ===
                "password"
            ) {

                nuevaPassword.type =
                    "text";

                mostrarNuevaPassword.classList.remove(
                    "fa-eye"
                );

                mostrarNuevaPassword.classList.add(
                    "fa-eye-slash"
                );

            } else {

                nuevaPassword.type =
                    "password";

                mostrarNuevaPassword.classList.remove(
                    "fa-eye-slash"
                );

                mostrarNuevaPassword.classList.add(
                    "fa-eye"
                );

            }

        }
    );

}


// ==========================================================
// MOSTRAR / OCULTAR CONFIRMAR CONTRASEÑA
// ==========================================================

const mostrarConfirmarPassword =
    document.getElementById(
        "mostrarConfirmarPassword"
    );

const confirmarPassword =
    document.getElementById(
        "confirmarPassword"
    );


if (
    mostrarConfirmarPassword &&
    confirmarPassword
) {

    mostrarConfirmarPassword.addEventListener(
        "click",
        function () {

            if (
                confirmarPassword.type ===
                "password"
            ) {

                confirmarPassword.type =
                    "text";

                mostrarConfirmarPassword.classList.remove(
                    "fa-eye"
                );

                mostrarConfirmarPassword.classList.add(
                    "fa-eye-slash"
                );

            } else {

                confirmarPassword.type =
                    "password";

                mostrarConfirmarPassword.classList.remove(
                    "fa-eye-slash"
                );

                mostrarConfirmarPassword.classList.add(
                    "fa-eye"
                );

            }

        }
    );

}


// ==========================================================
// RESTABLECER CONTRASEÑA
// ==========================================================

const btnRestablecer =
    document.getElementById(
        "btnRestablecer"
    );


if (btnRestablecer) {

    btnRestablecer.addEventListener(
        "click",
        async function () {

            const correoVerificado =
                document.getElementById(
                    "correoVerificado"
                );

            const nuevaPasswordInput =
                document.getElementById(
                    "nuevaPassword"
                );

            const confirmarPasswordInput =
                document.getElementById(
                    "confirmarPassword"
                );


            const correo =
                correoVerificado
                    ? correoVerificado.textContent.trim()
                    : "";

            const nuevaPassword =
                nuevaPasswordInput
                    ? nuevaPasswordInput.value
                    : "";

            const confirmarPassword =
                confirmarPasswordInput
                    ? confirmarPasswordInput.value
                    : "";


            // ==================================================
            // VALIDAR
            // ==================================================

            if (nuevaPassword === "") {

                mostrarMensajeRecuperacion(
                    "La nueva contraseña es obligatoria.",
                    "error"
                );

                return;
            }


            if (confirmarPassword === "") {

                mostrarMensajeRecuperacion(
                    "Debe confirmar la contraseña.",
                    "error"
                );

                return;
            }


            if (
                nuevaPassword !==
                confirmarPassword
            ) {

                mostrarMensajeRecuperacion(
                    "Las contraseñas no coinciden.",
                    "error"
                );

                return;
            }


            if (nuevaPassword.length < 8) {

                mostrarMensajeRecuperacion(
                    "La contraseña debe tener mínimo 8 caracteres.",
                    "error"
                );

                return;
            }


            try {

                const respuesta =
                    await fetch(
                        "/auth/recuperar/restablecer",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: correo,

                                password:
                                    nuevaPassword

                            })
                        }
                    );


                const datos =
                    await respuesta.json();


                console.log(
                    "RESPUESTA RESTABLECER:",
                    datos
                );


                if (!respuesta.ok) {

                    const mensaje =
                        datos.message ||
                        datos.error ||
                        "No fue posible restablecer la contraseña.";

                    mostrarMensajeRecuperacion(
                        mensaje,
                        "error"
                    );

                    return;
                }


                // ==================================================
                // ÉXITO
                // ==================================================

                mostrarMensajeRecuperacion(
                    datos.message ||
                    "Contraseña restablecida correctamente.",
                    "success"
                );


                // ==================================================
                // VOLVER AL LOGIN
                // ==================================================

                setTimeout(
                    function () {

                        if (modalRecuperar) {

                            modalRecuperar.style.display =
                                "none";

                        }


                        if (nuevaPasswordInput) {

                            nuevaPasswordInput.value =
                                "";

                        }


                        if (confirmarPasswordInput) {

                            confirmarPasswordInput.value =
                                "";

                        }


                        const pasoCorreo =
                            document.getElementById(
                                "pasoCorreo"
                            );

                        const pasoPassword =
                            document.getElementById(
                                "pasoPassword"
                            );


                        if (pasoCorreo) {

                            pasoCorreo.style.display =
                                "block";

                        }


                        if (pasoPassword) {

                            pasoPassword.style.display =
                                "none";

                        }


                        limpiarMensajeRecuperacion();

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    "ERROR RESTABLECIENDO CONTRASEÑA:",
                    error
                );

                mostrarMensajeRecuperacion(
                    "No se pudo conectar con el servidor.",
                    "error"
                );

            }

        }
    );

}


// ==========================================================
// MOSTRAR MENSAJE DE RECUPERACIÓN
// ==========================================================

function mostrarMensajeRecuperacion(
    mensaje,
    tipo
) {

    const elemento =
        document.getElementById(
            "mensajeRecuperacion"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        mensaje;


    elemento.className =
        "mensaje-recuperacion " + tipo;

}


// ==========================================================
// LIMPIAR MENSAJE DE RECUPERACIÓN
// ==========================================================

function limpiarMensajeRecuperacion() {

    const elemento =
        document.getElementById(
            "mensajeRecuperacion"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        "";

    elemento.className =
        "mensaje-recuperacion";

}