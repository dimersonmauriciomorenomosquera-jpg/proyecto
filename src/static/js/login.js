// ==========================================================
// LOGIN
// ==========================================================

const formularioLogin =
    document.getElementById("formLogin");

formularioLogin.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();

        const email =
            document
                .getElementById("email_cliente")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        // ==============================================
        // VALIDACIÓN
        // ==============================================

        if (email === "" || password === "") {

            alert(
                "Debe completar todos los campos."
            );

            return;

        }


        try {

            const datos =
                new URLSearchParams();

            datos.append(
                "email",
                email
            );

            datos.append(
                "password",
                password
            );


            const respuesta =
                await fetch(
                    "/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body: datos
                    }
                );


            if (respuesta.redirected) {

                window.location.href =
                    respuesta.url;

                return;

            }


            if (!respuesta.ok) {

                alert(
                    "No fue posible iniciar sesión."
                );

                return;

            }


            window.location.href =
                "/";


        } catch (error) {

            console.error(
                "ERROR LOGIN:",
                error
            );

            alert(
                "Error al conectar con el servidor."
            );

        }

    }
);


// ==========================================================
// MOSTRAR / OCULTAR CONTRASEÑA DEL LOGIN
// ==========================================================

const inputPassword =
    document.getElementById("password");

const iconoPassword =
    document.getElementById("mostrarPassword");

if (
    inputPassword &&
    iconoPassword
) {

    iconoPassword.addEventListener(
        "click",
        function () {

            if (
                inputPassword.type === "password"
            ) {

                inputPassword.type =
                    "text";

                iconoPassword.classList.remove(
                    "fa-eye"
                );

                iconoPassword.classList.add(
                    "fa-eye-slash"
                );

            } else {

                inputPassword.type =
                    "password";

                iconoPassword.classList.remove(
                    "fa-eye-slash"
                );

                iconoPassword.classList.add(
                    "fa-eye"
                );

            }

        }
    );

}
// ==========================================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================================

const modalRecuperar =
    document.getElementById("modalRecuperar");

const abrirRecuperar =
    document.getElementById("abrirRecuperar");

const cerrarRecuperar =
    document.getElementById("cerrarRecuperar");

const pasoCorreo =
    document.getElementById("pasoCorreo");

const pasoPassword =
    document.getElementById("pasoPassword");

const formRecuperar =
    document.getElementById("formRecuperar");

const correoRecuperar =
    document.getElementById("correoRecuperar");

const correoVerificado =
    document.getElementById("correoVerificado");

const nuevaPassword =
    document.getElementById("nuevaPassword");

const confirmarPassword =
    document.getElementById("confirmarPassword");

const btnRestablecer =
    document.getElementById("btnRestablecer");

const mensajeRecuperacion =
    document.getElementById("mensajeRecuperacion");


// ==========================================================
// ABRIR MODAL
// ==========================================================

if (abrirRecuperar && modalRecuperar) {

    abrirRecuperar.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            modalRecuperar.classList.add("activo");

            mostrarPasoCorreo();

        }
    );

}


// ==========================================================
// CERRAR MODAL
// ==========================================================

if (cerrarRecuperar && modalRecuperar) {

    cerrarRecuperar.addEventListener(
        "click",
        function () {

            modalRecuperar.classList.remove("activo");

            limpiarModal();

        }
    );

}


// ==========================================================
// CERRAR HACIENDO CLICK AFUERA
// ==========================================================

if (modalRecuperar) {

    modalRecuperar.addEventListener(
        "click",
        function (e) {

            if (e.target === modalRecuperar) {

                modalRecuperar.classList.remove("activo");

                limpiarModal();

            }

        }
    );

}


// ==========================================================
// CERRAR CON ESC
// ==========================================================

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape" &&
            modalRecuperar &&
            modalRecuperar.classList.contains("activo")
        ) {

            modalRecuperar.classList.remove("activo");

            limpiarModal();

        }

    }
);


// ==========================================================
// MOSTRAR PASO 1
// ==========================================================

function mostrarPasoCorreo() {

    pasoCorreo.style.display = "block";

    pasoPassword.style.display = "none";

    mensajeRecuperacion.textContent = "";

    mensajeRecuperacion.className =
        "mensaje-recuperacion";

}


// ==========================================================
// MOSTRAR PASO 2
// ==========================================================

function mostrarPasoPassword() {

    pasoCorreo.style.display = "none";

    pasoPassword.style.display = "block";

    mensajeRecuperacion.textContent = "";

    mensajeRecuperacion.className =
        "mensaje-recuperacion";

}


// ==========================================================
// VERIFICAR CORREO
// ==========================================================

if (formRecuperar) {

    formRecuperar.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const correo =
                correoRecuperar.value.trim();

            if (!correo) {

                mostrarMensaje(
                    "Ingresa un correo electrónico.",
                    "error"
                );

                return;

            }

            try {

                mostrarMensaje(
                    "Verificando correo...",
                    ""
                );


                const respuesta =
                    await fetch(
                        "/auth/recuperar/verificar",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email_cliente: correo
                            })
                        }
                    );


                const data =
                    await respuesta.json();


                console.log(
                    "RESPUESTA VERIFICAR:",
                    data
                );


                if (!respuesta.ok) {

                    mostrarMensaje(
                        data.error ||
                        data.message ||
                        "El correo no está registrado.",
                        "error"
                    );

                    return;

                }


                // ==================================
                // CORREO ENCONTRADO
                // ==================================

                correoVerificado.textContent =
                    correo;


                mostrarPasoPassword();

            }
            catch (error) {

                console.error(
                    "ERROR RECUPERACIÓN:",
                    error
                );

                mostrarMensaje(
                    "No se pudo conectar con el servidor.",
                    "error"
                );

            }

        }
    );

}


// ==========================================================
// RESTABLECER CONTRASEÑA
// ==========================================================

if (btnRestablecer) {

    btnRestablecer.addEventListener(
        "click",
        async function () {

            const nueva =
                nuevaPassword.value;

            const confirmar =
                confirmarPassword.value;


            // ==================================
            // VALIDACIONES
            // ==================================

            if (!nueva || !confirmar) {

                mostrarMensaje(
                    "Debes completar los dos campos.",
                    "error"
                );

                return;

            }


            if (nueva.length < 8) {

                mostrarMensaje(
                    "La contraseña debe tener mínimo 8 caracteres.",
                    "error"
                );

                return;

            }


            if (nueva !== confirmar) {

                mostrarMensaje(
                    "Las contraseñas no coinciden.",
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

                                email_cliente:
                                    correoRecuperar.value.trim(),

                                nueva_password:
                                    nueva

                            })
                        }
                    );


                const data =
                    await respuesta.json();


                console.log(
                    "RESPUESTA RESTABLECER:",
                    data
                );


                if (!respuesta.ok) {

                    mostrarMensaje(
                        data.error ||
                        data.message ||
                        "No se pudo actualizar la contraseña.",
                        "error"
                    );

                    return;

                }


                // ==================================
                // ÉXITO
                // ==================================

                mostrarMensaje(
                    "Contraseña actualizada correctamente.",
                    "exito"
                );


                setTimeout(
                    function () {

                        modalRecuperar.classList.remove(
                            "activo"
                        );

                        limpiarModal();

                    },
                    2000
                );

            }
            catch (error) {

                console.error(
                    "ERROR RESTABLECER:",
                    error
                );

                mostrarMensaje(
                    "No se pudo conectar con el servidor.",
                    "error"
                );

            }

        }
    );

}


// ==========================================================
// MOSTRAR MENSAJE
// ==========================================================

function mostrarMensaje(texto, tipo) {

    mensajeRecuperacion.textContent =
        texto;

    mensajeRecuperacion.className =
        "mensaje-recuperacion " + tipo;

}


// ==========================================================
// LIMPIAR MODAL
// ==========================================================

function limpiarModal() {

    correoRecuperar.value = "";

    nuevaPassword.value = "";

    confirmarPassword.value = "";

    correoVerificado.textContent = "";

    mostrarPasoCorreo();

}