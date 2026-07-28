from clients.api_client import APIClient
from clients.api_error import APIError
from flask import Blueprint, render_template, session, flash

inicio_bp = Blueprint("inicio", __name__)


def _client():
    return APIClient(session.get("api_token"))


@inicio_bp.route("/")
def index():

    try:
        productos = APIClient.as_list(
            _client().get("/productos/")
        )

        categorias = APIClient.as_list(
            _client().get("/categorias/")
        )

        ofertas = APIClient.as_list(
            _client().get("/productos")
        )

    except APIError:

        productos = []
        categorias = []
        ofertas = []

    return render_template(
        "inicio.html",
        productos=productos,
        categorias=categorias,
    )