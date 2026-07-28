from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from clients.api_client import APIClient, APIError

auth_bp = Blueprint("auth", __name__)


def _client():
    return APIClient(session.get("api_token"))


# ==========================
# LOGIN
# ==========================

@auth_bp.route("/login")
def index():
    return render_template("login.html")


@auth_bp.route("/login", methods=["POST"])
def login():

    datos = {
        "email": request.form["email"],
        "password": request.form["password"]
    }

    try:

        respuesta = _client().post("/auth/login", datos)

        session["api_token"] = respuesta["token"]

        flash("Bienvenido.", "success")

        return redirect(url_for("inicio.index"))

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("auth.index"))


# ==========================
# REGISTRO
# ==========================

from flask import Blueprint, render_template, request, redirect, url_for, flash

@auth_bp.route("/registro", methods=["GET", "POST"])
def registro():

    if request.method == "GET":
        return render_template("Registro.html")

    datos = {
        "nombre": request.form["nombre"],
        "apellido": request.form["apellido"],
        "email": request.form["email"],
        "telefono": request.form["telefono"],
        "direccion": request.form["direccion"],
        "password": request.form["password"]
    }

    try:
        _client().post("/clientes/", datos)

        flash("Usuario registrado correctamente.", "success")

        return redirect(url_for("auth.login"))

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("auth.registro"))
# ==========================
# LOGOUT
# ==========================

@auth_bp.route("/logout")
def logout():

    session.pop("api_token", None)

    flash("Sesión cerrada.", "success")

    return redirect(url_for("inicio.index"))

from flask import render_template, request, redirect, url_for, flash

# ==========================
# INFORMACIÓN DEL USUARIO
# ==========================

@auth_bp.route("/usuario", methods=["GET"])
def usuario():
    return render_template("usuario.html")


@auth_bp.route("/usuario", methods=["POST"])
def actualizar_usuario():
    pass