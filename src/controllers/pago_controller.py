from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from clients.api_client import APIClient, APIError
from flask import Blueprint

pago_bp = Blueprint("pago", __name__)


def _client():
    return APIClient(session.get("api_token"))


@pago_bp.route("/")
def index():

    try:

        carrito = _client().get("/carrito/")
        carrito = APIClient.as_list(carrito)

    except APIError:

        carrito = []

    return render_template(
        "pago.html",
        carrito=carrito
    )


@pago_bp.route("/procesar", methods=["POST"])
def procesar_pago():

    datos = {
        "metodo_pago": request.form["metodo_pago"],
        "direccion_envio": request.form["direccion_envio"]
    }

    try:

        _client().post("/pagos/", datos)

        flash("Pago realizado correctamente.", "success")

        return redirect(url_for("factura.index"))

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("pago.index"))