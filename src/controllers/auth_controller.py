
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify

from clients.api_client import APIClient, APIError


auth_bp = Blueprint("auth", __name__)


def _client():
    return APIClient(session.get("api_token"))


# ==========================================================
# LOGIN - MOSTRAR FORMULARIO
# ==========================================================

@auth_bp.route("/login", methods=["GET"])
def index():

    return render_template("login.html")


# ==========================================================
# LOGIN - PROCESAR
# ==========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    datos = {
        "email_cliente": request.form["email"],
        "password": request.form["password"]
    }

    try:

        respuesta = _client().post(
            "/auth/login",
            datos
        )

        print("========================================")
        print("RESPUESTA LOGIN:")
        print(respuesta)
        print("========================================")

        # ==================================================
        # OBTENER TOKEN
        # ==================================================

        token = respuesta.get("token")

        print("TOKEN RECIBIDO:", token)

        if not token:

            flash(
                "El servidor no devolvió el token.",
                "danger"
            )

            return redirect(
                url_for("auth.index")
            )

        # ==================================================
        # OBTENER INFORMACIÓN DEL USUARIO
        # ==================================================

        usuario = respuesta.get("usuario")

        if not usuario:

            flash(
                "El servidor no devolvió los datos del usuario.",
                "danger"
            )

            return redirect(
                url_for("auth.index")
            )

        id_cliente = usuario.get("id_cliente")

        if not id_cliente:

            flash(
                "El servidor no devolvió el ID del cliente.",
                "danger"
            )

            return redirect(
                url_for("auth.index")
            )

        # ==================================================
        # GUARDAR INFORMACIÓN EN SESSION
        # ==================================================

        session["api_token"] = token

        session["id_cliente"] = id_cliente

        session["usuario"] = usuario

        print("========================================")
        print("TOKEN GUARDADO:", session.get("api_token"))
        print("ID CLIENTE GUARDADO:", session.get("id_cliente"))
        print("USUARIO GUARDADO:", session.get("usuario"))
        print("========================================")

        flash(
            "Bienvenido.",
            "success"
        )

        return redirect(
            url_for("inicio.index")
        )

    except APIError as e:

        print("ERROR LOGIN:", e)

        flash(
            str(e),
            "danger"
        )

        return redirect(
            url_for("auth.index")
        )


# ==========================================================
# REGISTRO
# ==========================================================

@auth_bp.route("/registro", methods=["GET", "POST"])
def registro():

    if request.method == "GET":

        return render_template(
            "Registro.html"
        )

    datos = {
        "nombre": request.form["nombre"],
        "apellido": request.form["apellido"],
        "email": request.form["email"],
        "telefono": request.form["telefono"],
        "direccion": request.form["direccion"],
        "password": request.form["password"]
    }

    try:

        _client().post(
            "/clientes/",
            datos
        )

        flash(
            "Usuario registrado correctamente.",
            "success"
        )

        return redirect(
            url_for("auth.index")
        )

    except APIError as e:

        print("ERROR REGISTRO:", e)

        flash(
            str(e),
            "danger"
        )

        return redirect(
            url_for("auth.registro")
        )


# ==========================================================
# LOGOUT
# ==========================================================

@auth_bp.route("/logout")
def logout():

    session.pop("api_token", None)
    session.pop("id_cliente", None)
    session.pop("usuario", None)

    flash(
        "Sesión cerrada.",
        "success"
    )

    return redirect(
        url_for("inicio.index")
    )

# ==========================================================
# VERIFICAR CORREO PARA RECUPERAR CONTRASEÑA
# ==========================================================

@auth_bp.route("/recuperar/verificar", methods=["POST"])
def verificar_correo():

    datos = request.get_json()

    if not datos:

        return jsonify({
            "error": "Debe enviar información."
        }), 400

    email = datos.get("email_cliente")

    if not email:

        return jsonify({
            "error": "El correo es obligatorio."
        }), 400

    try:

        respuesta = _client().post(
            "/auth/recuperar/verificar",
            datos
        )

        return jsonify(respuesta), 200

    except APIError as e:

        print("ERROR VERIFICAR CORREO:", e)

        return jsonify({
            "error": str(e)
        }), 404

# ==========================================================
# RESTABLECER CONTRASEÑA
# ==========================================================

@auth_bp.route("/recuperar/restablecer", methods=["PUT"])
def restablecer_password():

    datos = request.get_json()

    if not datos:

        return jsonify({
            "error": "Debe enviar información."
        }), 400

    try:

        respuesta = _client().put(
            "/auth/recuperar/restablecer",
            datos
        )

        return jsonify(respuesta), 200

    except APIError as e:

        print("ERROR RESTABLECER PASSWORD:", e)

        return jsonify({
            "error": str(e)
        }), 400