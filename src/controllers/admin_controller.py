from flask import Blueprint, render_template, session, flash
from clients.api_client import APIClient, APIError
from flask import Blueprint

admin_bp = Blueprint("admin", __name__)


def _client():
    return APIClient(session.get("api_token"))


@admin_bp.route("/")
def dashboard():
    return render_template("admin/admnistrador.html")


@admin_bp.route("/productos_adm")
def productos_adm():

    try:
        productos = APIClient.as_list(
            _client().get("/productos_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        productos = []

    return render_template(
        "admin/productos_adm.html",
        productos=productos
    )


@admin_bp.route("/usuario_adm")
def usuario_adm():

    try:
        clientes = APIClient.as_list(
            _client().get("/usuario_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        clientes = []

    return render_template(
        "admin/usuario_adm.html",
        clientes=clientes
    )


@admin_bp.route("/facturas")
def facturas():

    try:
        facturas = APIClient.as_list(
            _client().get("/facturas_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        facturas = []

    return render_template(
        "admin/facturas_adm.html",
        facturas=facturas
    )


@admin_bp.route("/pagos")
def pagos():

    try:
        pagos = APIClient.as_list(
            _client().get("/pagos_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        pagos = []

    return render_template(
        "admin/pagos_adm.html",
        pagos=pagos
    )


@admin_bp.route("/envios_adm")
def envios_adm():

    try:
        envios = APIClient.as_list(
            _client().get("/envios_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        envios = []

    return render_template(
        "admin/envios_adm.html",
        envios=envios
    )

@admin_bp.route("/ventas_adm")
def ventas_adm():

    try:
        ventas = APIClient.as_list(
            _client().get("/ventas_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        ventas = []

    return render_template(
        "admin/ventas_adm.html",
        ventas=ventas
    )


@admin_bp.route("/configuracion_adm")
def configuracion_adm():

    try:
        configuracion = _client().get("/configuracion_adm/")
    except APIError as e:
        flash(str(e), "danger")
        configuracion = {}

    return render_template(
        "admin/configuracion_adm.html",
        configuracion=configuracion
    )

@admin_bp.route("/reportes_adm")
def reportes_adm():

    try:
        reportes = APIClient.as_list(
            _client().get("/reportes_adm/")
        )
    except APIError as e:
        flash(str(e), "danger")
        reportes = []

    return render_template(
        "admin/reportes_adm.html",
        reportes=reportes
    )