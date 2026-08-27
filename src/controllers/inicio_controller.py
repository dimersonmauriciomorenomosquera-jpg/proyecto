from flask import (
    Blueprint,
    render_template,
    session,
    jsonify
)

from clients.api_client import (
    APIClient,
    APIError
)


# ==========================================================
# BLUEPRINT
# ==========================================================

inicio_bp = Blueprint(
    "inicio",
    __name__
)


# ==========================================================
# CLIENTE API
# ==========================================================

def _client():

    return APIClient(
        session.get("api_token")
    )


# ==========================================================
# INICIO
# ==========================================================

@inicio_bp.route("/")
def index():

    productos = []
    categorias = []
    ofertas = []

    try:

        productos = APIClient.as_list(
            _client().get(
                "/productos/"
            )
        )

        categorias = APIClient.as_list(
            _client().get(
                "/categorias/"
            )
        )

        ofertas = APIClient.as_list(
            _client().get(
                "/productos/"
            )
        )

    except APIError as e:

        print(
            "ERROR CARGANDO DATOS DEL INICIO:",
            e
        )

    return render_template(
        "inicio.html",
        productos=productos,
        categorias=categorias,
        ofertas=ofertas
    )


# ==========================================================
# PRODUCTO DESTACADO POR ID
# ==========================================================

@inicio_bp.route(
    "/producto/<int:id_producto>",
    methods=["GET"]
)
def producto_destacado(id_producto):

    try:

        producto = _client().get(
            f"/productos/{id_producto}"
        )

        return jsonify(producto), 200

    except APIError as e:

        print(
            f"ERROR OBTENIENDO PRODUCTO {id_producto}:",
            e
        )

        return jsonify({
            "message": str(e)
        }), 404