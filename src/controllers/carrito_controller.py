from flask import (
    Blueprint,
    render_template,
    redirect,
    url_for,
    flash,
    request,
    session,
    jsonify
)

from clients.api_client import APIClient, APIError


# ==========================================================
# BLUEPRINT
# ==========================================================

carrito_bp = Blueprint(
    "carrito",
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
# VER MI CARRITO
# ==========================================================
# GET /carrito/
#
# Esta ruta solamente carga la página.
#
# Los productos se cargan posteriormente mediante
# JavaScript → GET /carrito/detalles
# ==========================================================

@carrito_bp.route("/", methods=["GET"])
def index():

    print("======================================")
    print("CARRITO")
    print("======================================")

    print(
        "TOKEN:",
        repr(session.get("api_token"))
    )

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("❌ NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("✅ SÍ HAY TOKEN")

    # ======================================================
    # MOSTRAR PÁGINA
    # ======================================================

    return render_template(
        "carrito.html"
    )


# ==========================================================
# OBTENER DETALLES DEL CARRITO
# ==========================================================
# GET /carrito/detalles
#
# Esta es la ruta que utiliza carrito.js.
#
# Frontend:
#
#     GET /carrito/detalles
#
# Luego Flask consulta:
#
#     GET /detalle_carrito/
#
# en el backend API.
# ==========================================================

@carrito_bp.route(
    "/detalles",
    methods=["GET"]
)
def detalles():

    print("======================================")
    print("OBTENER DETALLES DEL CARRITO")
    print("======================================")

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("❌ NO HAY TOKEN")

        return jsonify({
            "message": "Debes iniciar sesión."
        }), 401

    print("✅ SÍ HAY TOKEN")

    # ======================================================
    # CONSULTAR BACKEND API
    # ======================================================

    try:

        respuesta = _client().get(
            "/detalle_carrito/"
        )

        print(
            "DETALLES RECIBIDOS DE LA API:",
            respuesta
        )

        # ==================================================
        # DEVOLVER JSON AL JAVASCRIPT
        # ==================================================

        return jsonify(
            respuesta
        ), 200

    except APIError as e:

        print(
            "ERROR API DETALLES:",
            e
        )

        return jsonify({
            "message": str(e)
        }), 500


# ==========================================================
# AGREGAR PRODUCTO
# ==========================================================
# POST /carrito/agregar/<id_producto>
# ==========================================================

@carrito_bp.route(
    "/agregar/<int:id_producto>",
    methods=["POST"]
)
def agregar_producto(id_producto):

    print("======================================")
    print("AGREGAR AL CARRITO")
    print("======================================")

    print(
        "TOKEN:",
        repr(session.get("api_token"))
    )

    print(
        "ID PRODUCTO:",
        id_producto
    )

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("❌ NO HAY TOKEN")

        flash(
            "Debes iniciar sesión para agregar productos al carrito.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("✅ SÍ HAY TOKEN")

    # ======================================================
    # OBTENER CANTIDAD
    # ======================================================

    try:

        cantidad = int(
            request.form.get(
                "cantidad",
                1
            )
        )

        if cantidad <= 0:

            raise ValueError

    except (
        ValueError,
        TypeError
    ):

        flash(
            "La cantidad debe ser mayor que cero.",
            "danger"
        )

        return redirect(
            request.referrer
            or
            url_for("productos.index")
        )

    # ======================================================
    # OBTENER TALLA
    # ======================================================

    talla = request.form.get(
        "talla"
    )

    print(
        "TALLA RECIBIDA:",
        repr(talla)
    )

    # ======================================================
    # ENVIAR PRODUCTO AL BACKEND API
    # ======================================================

    try:

        respuesta = _client().post(
            "/detalle_carrito/",
            {
                "id_producto": id_producto,
                "cantidad": cantidad,
                "talla": talla
            }
        )

        print(
            "RESPUESTA AGREGAR:",
            respuesta
        )

        flash(
            "Producto agregado al carrito.",
            "success"
        )

    except APIError as e:

        print(
            "ERROR AGREGANDO:",
            e
        )

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # VOLVER AL CARRITO
    # ======================================================

    return redirect(
        url_for("carrito.index")
    )


# ==========================================================
# ACTUALIZAR CANTIDAD
# ==========================================================
# POST /carrito/actualizar/<id_detalle>
# ==========================================================

@carrito_bp.route(
    "/actualizar/<int:id_detalle>",
    methods=["POST"]
)
def actualizar_cantidad(id_detalle):

    print("======================================")
    print("ACTUALIZAR CANTIDAD")
    print("======================================")

    print(
        "ID DETALLE:",
        id_detalle
    )

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("❌ NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("✅ SÍ HAY TOKEN")

    # ======================================================
    # OBTENER CANTIDAD
    # ======================================================

    try:

        cantidad = int(
            request.form.get(
                "cantidad"
            )
        )

        if cantidad <= 0:

            raise ValueError

    except (
        ValueError,
        TypeError
    ):

        flash(
            "Cantidad inválida.",
            "danger"
        )

        return redirect(
            url_for("carrito.index")
        )

    # ======================================================
    # ACTUALIZAR EN BACKEND API
    # ======================================================

    try:

        respuesta = _client().put(
            f"/detalle_carrito/{id_detalle}",
            {
                "cantidad": cantidad
            }
        )

        print(
            "RESPUESTA ACTUALIZAR:",
            respuesta
        )

        flash(
            "Cantidad actualizada.",
            "success"
        )

    except APIError as e:

        print(
            "ERROR ACTUALIZANDO:",
            e
        )

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # VOLVER AL CARRITO
    # ======================================================

    return redirect(
        url_for("carrito.index")
    )


# ==========================================================
# ELIMINAR PRODUCTO
# ==========================================================
# POST /carrito/eliminar/<id_detalle>
# ==========================================================

@carrito_bp.route(
    "/eliminar/<int:id_detalle>",
    methods=["POST"]
)
def eliminar_producto(id_detalle):

    print("======================================")
    print("ELIMINAR PRODUCTO")
    print("======================================")

    print(
        "ID DETALLE:",
        id_detalle
    )

    # ======================================================
    # VERIFICAR SESIÓN
    # ======================================================

    if "api_token" not in session:

        print("❌ NO HAY TOKEN")

        flash(
            "Debes iniciar sesión.",
            "warning"
        )

        return redirect(
            url_for("auth.index")
        )

    print("✅ SÍ HAY TOKEN")

    # ======================================================
    # ELIMINAR EN BACKEND API
    # ======================================================

    try:

        respuesta = _client().delete(
            f"/detalle_carrito/{id_detalle}"
        )

        print(
            "RESPUESTA ELIMINAR:",
            respuesta
        )

        flash(
            "Producto eliminado del carrito.",
            "success"
        )

    except APIError as e:

        print(
            "ERROR ELIMINANDO:",
            e
        )

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # VOLVER AL CARRITO
    # ======================================================

    return redirect(
        url_for("carrito.index")
    )