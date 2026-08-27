from flask import (
    Blueprint,
    render_template,
    redirect,
    url_for,
    flash,
    request,
    session
)

from clients.api_client import APIClient, APIError


# ==========================================================
# BLUEPRINT
# ==========================================================

usuario_bp = Blueprint(
    "usuario",
    __name__
)


# ==========================================================
# CLIENTE API
# ==========================================================

def _client():

    return APIClient(
        session.get("api_token")
    )


# ==========================================================
# VER PERFIL
# ==========================================================

@usuario_bp.route("/")
def perfil():

    print("======================================")
    print("PERFIL DE USUARIO")
    print("======================================")

    print(
        "TOKEN:",
        repr(session.get("api_token"))
    )

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("HAY TOKEN")

    # ======================================================
    # OBTENER PERFIL DESDE BACKEND
    # ======================================================

    try:

        usuario = _client().get(
            "/clientes/perfil"
        )

        print(
            "USUARIO RECIBIDO:",
            usuario
        )

    except APIError as e:

        print(
            "ERROR OBTENIENDO PERFIL:",
            e
        )

        flash(
            str(e),
            "danger"
        )

        return redirect(
            url_for("inicio.index")
        )

    # ======================================================
    # MOSTRAR PERFIL
    # ======================================================

    return render_template(
        "usuario.html",
        usuario=usuario
    )


# ==========================================================
# EDITAR PERFIL
# ==========================================================

@usuario_bp.route(
    "/editar",
    methods=["POST"]
)
def editar_perfil():

    print("======================================")
    print("EDITAR PERFIL")
    print("======================================")

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("HAY TOKEN")

    # ======================================================
    # OBTENER DATOS DEL FORMULARIO
    # ======================================================

    datos = {

    "nombre":
        request.form.get("nombre"),

    "email":
        request.form.get("correo"),

    "telefono":
        request.form.get("telefono"),

    "direccion":
        request.form.get("direccion"),

    "nacimiento":
        request.form.get("fecha")

}

    print("======================================")
    print("DATOS PERFIL:")
    print(datos)
    print("======================================")

    # ======================================================
    # ENVIAR AL BACKEND
    # ======================================================

    try:

        respuesta = _client().put(
            "/clientes/perfil",
            datos
        )

        print("======================================")
        print("RESPUESTA ACTUALIZAR PERFIL:")
        print(respuesta)
        print("======================================")

        flash(
            "Información actualizada correctamente.",
            "success"
        )

    except APIError as e:

        print("======================================")
        print("ERROR ACTUALIZANDO PERFIL:")
        print(e)
        print("======================================")

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # VOLVER AL PERFIL
    # ======================================================

    return redirect(
        url_for("usuario.perfil")
    )

    # ==========================================================
# CAMBIAR CONTRASEÑA
# ==========================================================

@usuario_bp.route(
    "/cambiar-password",
    methods=["POST"]
)
def cambiar_password():

    print("======================================")
    print("CAMBIAR CONTRASEÑA")
    print("======================================")

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("HAY TOKEN")

    # ======================================================
    # OBTENER DATOS DEL FORMULARIO
    # ======================================================

    password_actual = request.form.get(
        "password_actual"
    )

    password_nueva = request.form.get(
        "password_nueva"
    )

    print("======================================")
    print("DATOS CAMBIO CONTRASEÑA")
    print("======================================")

    print(
        "PASSWORD ACTUAL:",
        "***" if password_actual else None
    )

    print(
        "PASSWORD NUEVA:",
        "***" if password_nueva else None
    )

    # ======================================================
    # VALIDAR CAMPOS
    # ======================================================

    if not password_actual:

        flash(
            "Debes ingresar tu contraseña actual.",
            "danger"
        )

        return redirect(
            url_for("usuario.perfil")
        )

    if not password_nueva:

        flash(
            "Debes ingresar la nueva contraseña.",
            "danger"
        )

        return redirect(
            url_for("usuario.perfil")
        )

    # ======================================================
    # ENVIAR AL BACKEND
    # ======================================================

    datos = {

        "password_actual":
            password_actual,

        "password_nueva":
            password_nueva

    }

    print("DATOS ENVIADOS AL BACKEND:")
    print({
        "password_actual": "***",
        "password_nueva": "***"
    })

    try:

        respuesta = _client().put(
            "/clientes/cambiar-password",
            datos
        )

        print("======================================")
        print("RESPUESTA CAMBIO CONTRASEÑA:")
        print(respuesta)
        print("======================================")

        flash(
            "Contraseña actualizada correctamente.",
            "success"
        )

    except APIError as e:

        print("======================================")
        print("ERROR CAMBIANDO CONTRASEÑA:")
        print(e)
        print("======================================")

        flash(
            str(e),
            "danger"
        )

    return redirect(
        url_for("usuario.perfil")
    )