from flask import Blueprint, render_template, request, session
from clients.api_client import APIClient, APIError
from flask import Blueprint

productos_bp = Blueprint("productos", __name__)


def _client():
    return APIClient(session.get("api_token"))


@productos_bp.route("/")
def index():

    q = request.args.get("q", "").strip()

    try:
        productos = APIClient.as_list(
            _client().get("/productos/")
        )

    except APIError:

        productos = []

    return render_template(
        "productos.html",
        productos=productos,
        q=q
    )


@productos_bp.route("/<int:id_producto>")
def detalle(id_producto):

    try:

        producto = _client().get(f"/productos/{id_producto}")

    except APIError:

        producto = None

    return render_template(
        "descripcion.html",
        producto=producto
    )

@productos_bp.route("/categoria/<categoria>")
def categoria(categoria):

    try:
        productos = APIClient.as_list(
            _client().get(f"/productos/?categoria={categoria}")
        )

    except APIError:
        productos = []

    return render_template(
        "productos.html",
        productos=productos,
        q=categoria
    )

@productos_bp.route('/buscar', methods=['GET'])
def buscar_productos():

    nombre = request.args.get("nombre")
    categoria = request.args.get("categoria")
    ordenar = request.args.get("ordenar")

    productos = Productos.buscar(nombre, categoria, ordenar)

    return jsonify([p.to_dict() for p in productos]), 200