/*==========================================================
        CONFIGURACION ADMINISTRADOR
==========================================================*/

console.log("========================================");
console.log("CONFIGURACION_ADM.JS CARGADO");
console.log("========================================");


document.addEventListener("DOMContentLoaded", () => {

    console.log("========================================");
    console.log("DOM CARGADO CORRECTAMENTE");
    console.log("========================================");


    /*======================================================
                    ELEMENTOS HTML
    ======================================================*/

    const btnGuardarPerfil =
        document.getElementById("btnGuardarPerfil");

    const idAdministrador =
        document.getElementById("idAdministrador");

    const nombreAdministrador =
        document.getElementById("nombreAdministrador");

    const emailAdministrador =
        document.getElementById("emailAdministrador");

    const telefonoAdministrador =
        document.getElementById("telefonoAdministrador");


    console.log("========================================");
    console.log("ELEMENTOS ENCONTRADOS");
    console.log("========================================");

    console.log(
        "btnGuardarPerfil:",
        btnGuardarPerfil
    );

    console.log(
        "idAdministrador:",
        idAdministrador
    );

    console.log(
        "nombreAdministrador:",
        nombreAdministrador
    );

    console.log(
        "emailAdministrador:",
        emailAdministrador
    );

    console.log(
        "telefonoAdministrador:",
        telefonoAdministrador
    );


    /*======================================================
                    VALIDAR ELEMENTOS
    ======================================================*/

    if (!btnGuardarPerfil) {
        console.error(
            "ERROR: NO EXISTE #btnGuardarPerfil"
        );
        return;
    }

    if (!idAdministrador) {
        console.error(
            "ERROR: NO EXISTE #idAdministrador"
        );
        return;
    }

    if (!nombreAdministrador) {
        console.error(
            "ERROR: NO EXISTE #nombreAdministrador"
        );
        return;
    }

    if (!emailAdministrador) {
        console.error(
            "ERROR: NO EXISTE #emailAdministrador"
        );
        return;
    }

    if (!telefonoAdministrador) {
        console.error(
            "ERROR: NO EXISTE #telefonoAdministrador"
        );
        return;
    }


    console.log("========================================");
    console.log("TODOS LOS ELEMENTOS HTML EXISTEN");
    console.log("========================================");


    /*======================================================
                    DATOS INICIALES
    ======================================================*/

    console.log("========================================");
    console.log("DATOS INICIALES DEL FORMULARIO");
    console.log("========================================");

    console.log(
        "ID:",
        idAdministrador.value
    );

    console.log(
        "NOMBRE:",
        nombreAdministrador.value
    );

    console.log(
        "EMAIL:",
        emailAdministrador.value
    );

    console.log(
        "TELEFONO:",
        telefonoAdministrador.value
    );


    /*======================================================
                    GUARDAR PERFIL
    ======================================================*/

    btnGuardarPerfil.addEventListener(
        "click",
        async () => {

            console.log("");
            console.log("========================================");
            console.log("CLICK DETECTADO");
            console.log("BOTON: GUARDAR CAMBIOS");
            console.log("========================================");


            /*==================================================
                        OBTENER VALORES
            ==================================================*/

            const id =
                idAdministrador.value.trim();

            const nombre =
                nombreAdministrador.value.trim();

            const email =
                emailAdministrador.value.trim();

            const telefono =
                telefonoAdministrador.value.trim();


            console.log("========================================");
            console.log("VALORES OBTENIDOS");
            console.log("========================================");

            console.log("ID:", id);
            console.log("NOMBRE:", nombre);
            console.log("EMAIL:", email);
            console.log("TELEFONO:", telefono);


            /*==================================================
                            VALIDAR ID
            ==================================================*/

            if (!id) {

                console.error(
                    "ERROR: EL ID DEL ADMINISTRADOR ESTA VACIO"
                );

                alert(
                    "No se encontró el administrador autenticado."
                );

                return;
            }


            /*==================================================
                            VALIDAR NOMBRE
            ==================================================*/

            if (!nombre) {

                console.error(
                    "ERROR: EL NOMBRE ESTA VACIO"
                );

                alert(
                    "El nombre es obligatorio."
                );

                nombreAdministrador.focus();

                return;
            }


            /*==================================================
                            VALIDAR EMAIL
            ==================================================*/

            if (!email) {

                console.error(
                    "ERROR: EL EMAIL ESTA VACIO"
                );

                alert(
                    "El correo electrónico es obligatorio."
                );

                emailAdministrador.focus();

                return;
            }


            const regexEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!regexEmail.test(email)) {

                console.error(
                    "ERROR: EMAIL INVALIDO"
                );

                alert(
                    "Ingrese un correo electrónico válido."
                );

                emailAdministrador.focus();

                return;
            }


            /*==================================================
                            VALIDAR TELEFONO
            ==================================================*/

            if (!telefono) {

                console.error(
                    "ERROR: EL TELEFONO ESTA VACIO"
                );

                alert(
                    "El teléfono es obligatorio."
                );

                telefonoAdministrador.focus();

                return;
            }


            const regexTelefono =
                /^[0-9]+$/;


            if (!regexTelefono.test(telefono)) {

                console.error(
                    "ERROR: TELEFONO INVALIDO"
                );

                alert(
                    "El teléfono debe contener únicamente números."
                );

                telefonoAdministrador.focus();

                return;
            }


            /*==================================================
                        CREAR OBJETO
            ==================================================*/

            const datos = {

                nombre_administrador:
                    nombre,

                email_administrador:
                    email,

                telefono_administrador:
                    telefono

            };


            console.log("========================================");
            console.log("DATOS QUE SE ENVIARAN");
            console.log("========================================");

            console.log(datos);


            /*==================================================
                        DESHABILITAR BOTON
            ==================================================*/

            btnGuardarPerfil.disabled = true;

            const textoOriginal =
                btnGuardarPerfil.textContent;

            btnGuardarPerfil.textContent =
                "Guardando...";


            /*==================================================
                            FETCH
            ==================================================*/

            try {

                console.log("========================================");
                console.log("ENVIANDO PETICION AL FRONTEND");
                console.log("========================================");

                console.log(
                    "URL:",
                    `/admin/configuracion_adm/editar/${id}`
                );

                console.log(
                    "METHOD:",
                    "PUT"
                );


                const respuesta =
                    await fetch(
                        `/admin/configuracion_adm/editar/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(datos)
                        }
                    );


                console.log("========================================");
                console.log("RESPUESTA DEL FRONTEND");
                console.log("========================================");

                console.log(
                    "STATUS:",
                    respuesta.status
                );

                console.log(
                    "OK:",
                    respuesta.ok
                );


                /*==================================================
                        LEER RESPUESTA
                ==================================================*/

                const resultado =
                    await respuesta.json();


                console.log("========================================");
                console.log("JSON RECIBIDO");
                console.log("========================================");

                console.log(resultado);


                /*==================================================
                        ERROR
                ==================================================*/

                if (!respuesta.ok) {

                    console.error(
                        "ERROR EN LA PETICION:",
                        resultado
                    );

                    alert(
                        resultado.error ||
                        resultado.message ||
                        "No se pudieron guardar los cambios."
                    );

                    return;
                }


                /*==================================================
                        EXITO
                ==================================================*/

                console.log("========================================");
                console.log("PERFIL ACTUALIZADO CORRECTAMENTE");
                console.log("========================================");


                alert(
                    "Perfil actualizado correctamente."
                );


                /*==================================================
                    ACTUALIZAR CAMPOS CON RESPUESTA
                ==================================================*/

                if (resultado.administrador) {

                    const administrador =
                        resultado.administrador;


                    if (
                        administrador
                            .nombre_administrador
                            !== undefined
                    ) {

                        nombreAdministrador.value =
                            administrador
                                .nombre_administrador;
                    }


                    if (
                        administrador
                            .email_administrador
                            !== undefined
                    ) {

                        emailAdministrador.value =
                            administrador
                                .email_administrador;
                    }


                    if (
                        administrador
                            .telefono_administrador
                            !== undefined
                    ) {

                        telefonoAdministrador.value =
                            administrador
                                .telefono_administrador;
                    }

                }

            }

            catch (error) {

                console.error(
                    "========================================"
                );

                console.error(
                    "ERROR DE CONEXION"
                );

                console.error(
                    error
                );

                console.error(
                    "========================================"
                );


                alert(
                    "No fue posible conectar con el servidor."
                );

            }

            finally {

                btnGuardarPerfil.disabled =
                    false;

                btnGuardarPerfil.textContent =
                    textoOriginal;

            }

        }
    );


});
/*==========================================================
                SEGURIDAD
        ACTUALIZAR CONTRASEÑA
==========================================================*/

const btnActualizarPassword =
    document.getElementById("btnActualizarPassword");

const passwordActual =
    document.getElementById("passwordActual");

const passwordNueva =
    document.getElementById("passwordNueva");

const passwordConfirmar =
    document.getElementById("passwordConfirmar");


if (!btnActualizarPassword) {

    console.error(
        "ERROR: NO EXISTE #btnActualizarPassword"
    );

} else {

    console.log(
        "BOTON DE ACTUALIZAR CONTRASEÑA ENCONTRADO"
    );


    btnActualizarPassword.addEventListener(
        "click",
        async () => {

            console.log("========================================");
            console.log("CAMBIO DE CONTRASEÑA");
            console.log("========================================");


            /*==================================================
                    OBTENER VALORES
            ==================================================*/

            const actual =
                passwordActual.value.trim();

            const nueva =
                passwordNueva.value.trim();

            const confirmar =
                passwordConfirmar.value.trim();


            console.log(
                "CONTRASEÑA ACTUAL RECIBIDA:",
                actual ? "SI" : "NO"
            );

            console.log(
                "NUEVA CONTRASEÑA RECIBIDA:",
                nueva ? "SI" : "NO"
            );

            console.log(
                "CONFIRMACION RECIBIDA:",
                confirmar ? "SI" : "NO"
            );


            /*==================================================
                    VALIDAR CONTRASEÑA ACTUAL
            ==================================================*/

            if (!actual) {

                alert(
                    "Ingrese su contraseña actual."
                );

                passwordActual.focus();

                return;
            }


            /*==================================================
                    VALIDAR NUEVA CONTRASEÑA
            ==================================================*/

            if (!nueva) {

                alert(
                    "Ingrese una nueva contraseña."
                );

                passwordNueva.focus();

                return;
            }


            /*==================================================
                    VALIDAR LONGITUD
            ==================================================*/

            if (nueva.length < 8) {

                alert(
                    "La nueva contraseña debe tener mínimo 8 caracteres."
                );

                passwordNueva.focus();

                return;
            }


            /*==================================================
                    VALIDAR CONFIRMACION
            ==================================================*/

            if (!confirmar) {

                alert(
                    "Confirme la nueva contraseña."
                );

                passwordConfirmar.focus();

                return;
            }


            /*==================================================
                    COMPARAR CONTRASEÑAS
            ==================================================*/

            if (nueva !== confirmar) {

                alert(
                    "Las nuevas contraseñas no coinciden."
                );

                passwordConfirmar.focus();

                return;
            }


            /*==================================================
                    PREPARAR DATOS
            ==================================================*/

            const datosPassword = {

                password_actual:
                    actual,

                password_nueva:
                    nueva,

                password_confirmar:
                    confirmar

            };


            console.log(
                "DATOS DE CONTRASEÑA PREPARADOS"
            );


            /*==================================================
                    DESHABILITAR BOTON
            ==================================================*/

            btnActualizarPassword.disabled =
                true;

            const textoOriginal =
                btnActualizarPassword.textContent;

            btnActualizarPassword.textContent =
                "Actualizando...";


            /*==================================================
                        PETICION
            ==================================================*/

            try {

                console.log(
                    "ENVIANDO PETICION DE CAMBIO DE CONTRASEÑA"
                );


                const respuesta =
                    await fetch(
                        "/admin/configuracion_adm/password",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    datosPassword
                                )
                        }
                    );


                console.log(
                    "STATUS:",
                    respuesta.status
                );


                const resultado =
                    await respuesta.json();


                console.log(
                    "RESPUESTA:",
                    resultado
                );


                /*==================================================
                        ERROR
                ==================================================*/

                if (!respuesta.ok) {

                    alert(
                        resultado.error ||
                        resultado.message ||
                        "No se pudo actualizar la contraseña."
                    );

                    return;
                }


                /*==================================================
                        EXITO
                ==================================================*/

                alert(
                    "Contraseña actualizada correctamente."
                );


                /*==================================================
                    LIMPIAR CAMPOS
                ==================================================*/

                passwordActual.value = "";

                passwordNueva.value = "";

                passwordConfirmar.value = "";


                console.log(
                    "CONTRASEÑA ACTUALIZADA CORRECTAMENTE"
                );

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

            finally {

                btnActualizarPassword.disabled =
                    false;

                btnActualizarPassword.textContent =
                    textoOriginal;

            }

        }
    );

}