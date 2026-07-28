from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from clients.api_client import APIClient, APIError
from flask import Blueprint


usuario_bp = Blueprint("usuario", __name__)


def _client():
    return APIClient(session.get("api_token"))


@usuario_bp.route("/")
def perfil():

    try:

        usuario = _client().get("/clientes/perfil")

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("inicio.index"))

    return render_template(
        "usuario.html",
        usuario=usuario
    )


@usuario_bp.route("/editar", methods=["GET", "POST"])
def editar_perfil():

    if request.method == "POST":

        datos = {
            "nombre": request.form["nombre"],
            "apellido": request.form["apellido"],
            "email": request.form["email"],
            "telefono": request.form["telefono"],
            "direccion": request.form["direccion"]
        }

        try:

            _client().put("/clientes/perfil", datos)

            flash("Perfil actualizado correctamente.", "success")

            return redirect(url_for("usuario.perfil"))

        except APIError as e:

            flash(str(e), "danger")

    try:

        usuario = _client().get("/clientes/perfil")

    except APIError:

        usuario = None

    return render_template(
        "editar_usuario.html",
        usuario=usuario
    )