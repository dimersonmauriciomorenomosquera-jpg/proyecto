from flask import (
    Blueprint,
    render_template,
    request,
    session,
    jsonify
)

from clients.api_client import APIClient, APIError


productos_bp = Blueprint(
    "productos",
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
# MOSTRAR PRODUCTOS
# ==========================================================

@productos_bp.route("/")
def index():

    q = request.args.get(
        "q",
        ""
    ).strip()


    try:

        productos = APIClient.as_list(
            _client().get(
                "/productos/"
            )
        )


    except APIError as e:

        print(
            "ERROR CARGANDO PRODUCTOS:",
            e
        )

        productos = []


    return render_template(
        "productos.html",
        productos=productos,
        q=q
    )


# ==========================================================
# DETALLE PRODUCTO
# ==========================================================

@productos_bp.route(
    "/<int:id_producto>"
)
def detalle(id_producto):

    try:

        producto = _client().get(
            f"/productos/{id_producto}"
        )


    except APIError as e:

        print(
            "ERROR DETALLE PRODUCTO:",
            e
        )

        producto = None


    return render_template(
        "descripcion.html",
        producto=producto
    )


# ==========================================================
# PRODUCTOS POR CATEGORÍA
# ==========================================================

@productos_bp.route(
    "/categoria/<categoria>"
)
def categoria(categoria):

    try:

        productos = APIClient.as_list(
            _client().get(
                "/productos/",
                params={
                    "categoria": categoria
                }
            )
        )


    except APIError as e:

        print(
            "ERROR CATEGORÍA:",
            e
        )

        productos = []


    return render_template(
        "productos.html",
        productos=productos,
        q=categoria
    )


# ==========================================================
# BUSCAR / FILTRAR / ORDENAR / PAGINAR
# ==========================================================

@productos_bp.route(
    "/buscar",
    methods=["GET"]
)
def buscar_productos():

    # ======================================================
    # OBTENER PARÁMETROS DEL FRONTEND
    # ======================================================

    buscar = request.args.get(
        "buscar",
        ""
    ).strip()


    categoria = request.args.get(
        "categoria",
        ""
    ).strip()


    ordenar = request.args.get(
        "ordenar",
        ""
    ).strip()


    pagina = request.args.get(
        "pagina",
        1,
        type=int
    )


    por_pagina = request.args.get(
        "por_pagina",
        12,
        type=int
    )


    # ======================================================
    # VALIDAR PAGINACIÓN
    # ======================================================

    if pagina < 1:

        pagina = 1


    if por_pagina < 1:

        por_pagina = 12


    # ======================================================
    # ENVIAR PETICIÓN AL BACKEND
    # ======================================================

    try:

        respuesta = _client().get(
            "/productos/buscar",
            params={
                "buscar": buscar,
                "categoria": categoria,
                "ordenar": ordenar,
                "pagina": pagina,
                "por_pagina": por_pagina
            }
        )


        print(
            "========================================"
        )

        print(
            "RESPUESTA BÚSQUEDA PRODUCTOS:"
        )

        print(
            respuesta
        )

        print(
            "========================================"
        )


        # ==================================================
        # DEVOLVER RESPUESTA AL JAVASCRIPT
        # ==================================================

        return jsonify(
            respuesta
        ), 200


    except APIError as e:

        print(
            "========================================"
        )

        print(
            "ERROR BUSCAR PRODUCTOS:"
        )

        print(
            e
        )

        print(
            "========================================"
        )


        return jsonify({

            "message": str(e)

        }), 500