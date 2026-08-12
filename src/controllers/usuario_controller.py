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


usuario_bp = Blueprint("usuario", __name__)


def _client():
    return APIClient(session.get("api_token"))


@usuario_bp.route("/")
def perfil():

    if "api_token" not in session:

        flash("Debes iniciar sesión.", "warning")
        return redirect(url_for("auth.login"))

    try:

        usuario = _client().get("/clientes/perfil")

    except APIError as e:

        flash(str(e), "danger")
        return redirect(url_for("inicio.index"))

    return render_template(
        "usuario.html",
        usuario=usuario
    )


@usuario_bp.route("/editar", methods=["POST"])
def editar_perfil():

    if "api_token" not in session:

        flash("Debes iniciar sesión.", "warning")
        return redirect(url_for("auth.login"))

    datos = {

        "nombre": request.form.get("nombre"),
        "apellido": request.form.get("apellido"),
        "email": request.form.get("email"),
        "telefono": request.form.get("telefono"),
        "direccion": request.form.get("direccion")

    }

    try:

        _client().put("/clientes/perfil", datos)

        flash(
            "Perfil actualizado correctamente.",
            "success"
        )

    except APIError as e:

        flash(str(e), "danger")

    return redirect(url_for("usuario.perfil"))