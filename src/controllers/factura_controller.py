from flask import Blueprint, render_template, session, flash, redirect, url_for
from clients.api_client import APIClient, APIError
from flask import Blueprint

factura_bp = Blueprint("factura", __name__)


def _client():
    return APIClient(session.get("api_token"))


@factura_bp.route("/")
def index():

    try:

        factura = _client().get("/facturas/")
        factura = APIClient.as_list(facturas)

    except APIError as e:

        flash(str(e), "danger")
        factura = []

    return render_template(
        "factura.html",
        factura=factura
    )


@factura_bp.route("/<int:id_factura>")
def detalle(id_factura):

    try:

        factura = _client().get(f"/facturas/{id_factura}")

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("factura.index"))

    return render_template(
        "detalle_factura.html",
        factura=factura
    )