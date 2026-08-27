// ==========================================================
// LOGIN
// ==========================================================

const formularioLogin =
    document.getElementById("formLogin");


if (formularioLogin) {

    formularioLogin.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ==================================================
            // OBTENER DATOS
            // ==================================================

            const email =
                document
                    .getElementById("email_cliente")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            // ==================================================
            // VALIDACIÓN
            // ==================================================

            if (
                email === "" ||
                password === ""
            ) {

                alert(
                    "Debe completar todos los campos."
                );

                return;

            }


            try {

                // ==================================================
                // DATOS DEL FORMULARIO
                // ==================================================

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


                // ==================================================
                // ENVIAR AL FRONTEND
                // ==================================================

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


                // ==================================================
                // SI EL CONTROLLER REDIRIGE
                // ==================================================

                if (respuesta.redirected) {

                    window.location.href =
                        respuesta.url;

                    return;

                }


                // ==================================================
                // ERROR
                // ==================================================

                if (!respuesta.ok) {

                    console.error(
                        "ERROR HTTP:",
                        respuesta.status
                    );


                    alert(
                        "No fue posible iniciar sesión."
                    );

                    return;

                }


                // ==================================================
                // ÉXITO
                // ==================================================

                window.location.href = "/";


            }
            catch (error) {

                console.error(
                    "ERROR LOGIN:",
                    error
                );


                alert(
                    "No se pudo conectar con el servidor."
                );

            }

        }
    );

}