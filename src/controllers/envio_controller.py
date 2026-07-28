from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from clients.api_client import APIClient, APIError


envio_bp = Blueprint("envio", __name__)


def _client():
    return APIClient(session.get("api_token"))

@envio_bp.route("/")
def index():

    try:

        envios = _client().get("/envios/")
        envios = APIClient.as_list(envios)

    except APIError as e:

        flash(str(e), "danger")
        envios = []

    return render_template(
        "envio.html",
        envios=envios
    )


@envio_bp.route("/<int:id_envio>")
def detalle(id_envio):

    try:

        envio = _client().get(f"/envios/{id_envio}")

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("envio.index"))

    return render_template(
        "detalle_envio.html",
        envio=envio
    )


@envio_bp.route("/actualizar/<int:id_envio>", methods=["POST"])
def actualizar(id_envio):

    datos = {
        "direccion": request.form["direccion"],
        "ciudad": request.form["ciudad"]
    }

    try:

        _client().put(
            f"/envios/{id_envio}",
            datos
        )

        flash("Información del envío actualizada.", "success")

    except APIError as e:

        flash(str(e), "danger")

    return redirect(url_for("envio.detalle", id_envio=id_envio))