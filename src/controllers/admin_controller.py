from flask import (
    Blueprint,
    render_template,
    session,
    flash,
    request,
    jsonify
)

from clients.api_client import (
    APIClient,
    APIError
)

from decorators.admin_required import (
    admin_required
)


# ==========================================================
# BLUEPRINT
# ==========================================================

admin_bp = Blueprint(
    "admin",
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
# DASHBOARD
# ==========================================================

@admin_bp.route("/")
@admin_required
def dashboard():

    print("========================================")
    print("SESION EN DASHBOARD:")
    print(dict(session))
    print("========================================")

    productos = []
    total_productos = 0
    productos_agotados = 0
    ultimos_productos = []
    total_usuarios = 0

    # ======================================================
    # OBTENER PRODUCTOS DESDE EL BACKEND
    # ======================================================

    try:

        respuesta = _client().get(
            "/productos/"
        )

        print("========================================")
        print("RESPUESTA PRODUCTOS DASHBOARD:")
        print(respuesta)
        print("========================================")

        productos = respuesta.get(
            "productos",
            []
        )

        total_productos = respuesta.get(
            "total_productos",
            0
        )

        # ==================================================
        # PRODUCTOS AGOTADOS
        # ==================================================

        for producto in productos:

            stock = producto.get(
                "stock_producto",
                0
            )

            try:

                stock = int(stock)

            except (
                ValueError,
                TypeError
            ):

                stock = 0

            if stock <= 0:

                productos_agotados += 1

        # ==================================================
        # ÚLTIMOS 5 PRODUCTOS
        # ==================================================

        ultimos_productos = sorted(

            productos,

            key=lambda producto: int(
                producto.get(
                    "id_producto",
                    0
                ) or 0
            ),

            reverse=True

        )[:5]

    except APIError as e:

        print("========================================")
        print("ERROR CARGANDO PRODUCTOS:")
        print(e)
        print("========================================")

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # OBTENER TOTAL DE USUARIOS
    # ======================================================

    try:

        respuesta_clientes = _client().get(

            "/clientes/",

            params={
                "page": 1,
                "per_page": 1
            }

        )

        print("========================================")
        print("RESPUESTA CLIENTES DASHBOARD:")
        print(respuesta_clientes)
        print("========================================")

        pagination = respuesta_clientes.get(
            "pagination",
            {}
        )

        total_usuarios = pagination.get(
            "total",
            0
        )

    except APIError as e:

        print("========================================")
        print("ERROR CARGANDO TOTAL DE USUARIOS:")
        print(e)
        print("========================================")

        flash(
            str(e),
            "danger"
        )

    # ======================================================
    # DEBUG
    # ======================================================

    print("========================================")
    print("TOTAL PRODUCTOS:", total_productos)
    print("TOTAL USUARIOS:", total_usuarios)
    print("PRODUCTOS AGOTADOS:", productos_agotados)
    print("ULTIMOS PRODUCTOS:", ultimos_productos)
    print("========================================")

    # ======================================================
    # ENVIAR DATOS AL HTML
    # ======================================================

    return render_template(

        "admin/admnistrador.html",

        productos=productos,

        total_productos=total_productos,

        total_usuarios=total_usuarios,

        productos_agotados=productos_agotados,

        ultimos_productos=ultimos_productos

    )


# ==========================================================
# PRODUCTOS
# ==========================================================

@admin_bp.route("/productos")
@admin_required
def productos_adm():

    productos = []
    total_productos = 0
    productos_agotados = 0
    total_inventario = 0
    total_categorias = 0
    pagina_actual = 1
    total_paginas = 1

    try:

        respuesta = _client().get(
            "/productos/"
        )

        print("========================================")
        print("RESPUESTA PRODUCTOS:")
        print(respuesta)
        print("========================================")

        productos = respuesta.get(
            "productos",
            []
        )

        total_productos = respuesta.get(
            "total_productos",
            len(productos)
        )

        pagina_actual = respuesta.get(
            "pagina",
            1
        )

        total_paginas = respuesta.get(
            "total_paginas",
            1
        )

        # ==================================================
        # PRODUCTOS AGOTADOS
        # ==================================================

        for producto in productos:

            try:

                stock = int(
                    producto.get(
                        "stock_producto",
                        0
                    ) or 0
                )

            except (
                ValueError,
                TypeError
            ):

                stock = 0

            if stock <= 0:

                productos_agotados += 1

        # ==================================================
        # INVENTARIO
        # ==================================================

        for producto in productos:

            try:

                precio = float(
                    producto.get(
                        "precio_producto",
                        0
                    ) or 0
                )

            except (
                ValueError,
                TypeError
            ):

                precio = 0

            try:

                stock = int(
                    producto.get(
                        "stock_producto",
                        0
                    ) or 0
                )

            except (
                ValueError,
                TypeError
            ):

                stock = 0

            total_inventario += precio * stock

        # ==================================================
        # CATEGORIAS
        # ==================================================

        categorias = set()

        for producto in productos:

            categoria = producto.get(
                "categoria"
            )

            if categoria:

                categorias.add(
                    categoria.lower()
                )

        total_categorias = len(
            categorias
        )

    except APIError as e:

        print("========================================")
        print("ERROR CARGANDO PRODUCTOS:")
        print(e)
        print("========================================")

        flash(
            str(e),
            "danger"
        )

    return render_template(

        "admin/productos_adm.html",

        productos=productos,

        total_productos=total_productos,

        productos_agotados=productos_agotados,

        total_inventario=total_inventario,

        total_categorias=total_categorias,

        pagina_actual=pagina_actual,

        total_paginas=total_paginas

    )


# ==========================================================
# FACTURAS
# ==========================================================

@admin_bp.route("/facturas")
@admin_required
def facturas():

    try:

        facturas = APIClient.as_list(

            _client().get(
                "/facturas_adm/"
            )

        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        facturas = []

    return render_template(

        "admin/facturas_adm.html",

        facturas=facturas

    )


# ==========================================================
# PAGOS
# ==========================================================

@admin_bp.route("/pagos")
@admin_required
def pagos():

    try:

        pagos = APIClient.as_list(

            _client().get(
                "/pagos_adm/"
            )

        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        pagos = []

    return render_template(

        "admin/pagos_adm.html",

        pagos=pagos

    )


# ==========================================================
# ENVIOS
# ==========================================================

@admin_bp.route("/envios_adm")
@admin_required
def envios_adm():

    try:

        envios = APIClient.as_list(

            _client().get(
                "/envios_adm/"
            )

        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        envios = []

    return render_template(

        "admin/envios_adm.html",

        envios=envios

    )


# ==========================================================
# VENTAS
# ==========================================================

@admin_bp.route("/ventas_adm")
@admin_required
def ventas_adm():

    try:

        ventas = APIClient.as_list(

            _client().get(
                "/ventas_adm/"
            )

        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        ventas = []

    return render_template(

        "admin/ventas_adm.html",

        ventas=ventas

    )


# ==========================================================
# CONFIGURACION
# ==========================================================

@admin_bp.route("/configuracion_adm")
@admin_required
def configuracion_adm():

    administrador = {}

    try:

        administrador = _client().get(
            "/administrador/perfil"
        )

        print("========================================")
        print("PERFIL ADMINISTRADOR:")
        print(administrador)
        print("========================================")

    except APIError as e:

        print("========================================")
        print("ERROR CARGANDO PERFIL ADMINISTRADOR:")
        print(e)
        print("========================================")

        flash(
            str(e),
            "danger"
        )

    return render_template(

        "admin/configuracion_adm.html",

        administrador=administrador

    )


# ==========================================================
# ACTUALIZAR PERFIL ADMINISTRADOR
# ==========================================================

@admin_bp.route(
    "/configuracion_adm/editar/<int:id_administrador>",
    methods=["PUT"]
)
@admin_required
def actualizar_perfil_administrador(
    id_administrador
):

    try:

        datos = request.get_json()

        print("========================================")
        print("ACTUALIZAR PERFIL ADMINISTRADOR")
        print("ID:")
        print(id_administrador)
        print("DATOS RECIBIDOS:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        respuesta = _client().put(

            f"/administrador/{id_administrador}",

            data=datos

        )

        print("========================================")
        print("RESPUESTA BACKEND ACTUALIZAR ADMIN:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 200

    except APIError as e:

        print("========================================")
        print("ERROR ACTUALIZANDO PERFIL ADMINISTRADOR:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# REPORTES
# ==========================================================

@admin_bp.route("/reportes_adm")
@admin_required
def reportes_adm():

    try:

        reportes = APIClient.as_list(

            _client().get(
                "/reportes_adm/"
            )

        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        reportes = []

    return render_template(

        "admin/reportes_adm.html",

        reportes=reportes

    )


# ==========================================================
# CREAR PRODUCTO
# ==========================================================

@admin_bp.route(
    "/productos/crear",
    methods=["POST"]
)
@admin_required
def crear_producto():

    try:

        datos = request.get_json()

        print("========================================")
        print("DATOS RECIBIDOS PARA CREAR PRODUCTO:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        respuesta = _client().post(

            "/productos/",

            data=datos

        )

        print("========================================")
        print("RESPUESTA BACKEND CREAR PRODUCTO:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 201

    except APIError as e:

        print("========================================")
        print("ERROR CREANDO PRODUCTO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# EDITAR PRODUCTO
# ==========================================================

@admin_bp.route(
    "/productos/editar/<int:id_producto>",
    methods=["PUT"]
)
@admin_required
def editar_producto(id_producto):

    try:

        datos = request.get_json()

        print("========================================")
        print("ID PRODUCTO A EDITAR:")
        print(id_producto)
        print("DATOS RECIBIDOS:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        respuesta = _client().put(

            f"/productos/{id_producto}",

            data=datos

        )

        print("========================================")
        print("RESPUESTA BACKEND EDITAR PRODUCTO:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 200

    except APIError as e:

        print("========================================")
        print("ERROR EDITANDO PRODUCTO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# ELIMINAR PRODUCTO
# ==========================================================

@admin_bp.route(
    "/productos/eliminar/<int:id_producto>",
    methods=["DELETE"]
)
@admin_required
def eliminar_producto(id_producto):

    try:

        print("========================================")
        print("ID PRODUCTO A ELIMINAR:")
        print(id_producto)
        print("========================================")

        respuesta = _client().delete(

            f"/productos/{id_producto}"

        )

        print("========================================")
        print("RESPUESTA BACKEND ELIMINAR PRODUCTO:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 200

    except APIError as e:

        print("========================================")
        print("ERROR ELIMINANDO PRODUCTO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# USUARIOS
# ==========================================================

@admin_bp.route("/usuario_adm")
@admin_required
def usuario_adm():

    clientes = []

    total_usuarios = 0

    try:

        respuesta = _client().get(

            "/clientes/",

            params={
                "page": 1,
                "per_page": 12
            }

        )

        print("========================================")
        print("RESPUESTA CLIENTES:")
        print(respuesta)
        print("========================================")

        clientes = respuesta.get(
            "data",
            []
        )

        pagination = respuesta.get(
            "pagination",
            {}
        )

        total_usuarios = pagination.get(

            "total",

            len(clientes)

        )

    except APIError as e:

        print("========================================")
        print("ERROR CARGANDO CLIENTES:")
        print(e)
        print("========================================")

        flash(
            str(e),
            "danger"
        )

    return render_template(

        "admin/usuario_adm.html",

        clientes=clientes,

        total_usuarios=total_usuarios

    )


# ==========================================================
# AGREGAR USUARIO
# ==========================================================

@admin_bp.route(
    "/usuarios/crear",
    methods=["POST"]
)
@admin_required
def agregar_usuario():

    try:

        datos = request.get_json()

        print("========================================")
        print("DATOS RECIBIDOS PARA CREAR USUARIO:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        respuesta = _client().post(

            "/clientes/",

            data=datos

        )

        print("========================================")
        print("RESPUESTA BACKEND CREAR USUARIO:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 201

    except APIError as e:

        print("========================================")
        print("ERROR CREANDO USUARIO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# EDITAR USUARIO
# ==========================================================

@admin_bp.route(
    "/usuarios/editar/<int:id_cliente>",
    methods=["PUT"]
)
@admin_required
def editar_usuario(id_cliente):

    try:

        datos = request.get_json()

        print("========================================")
        print("ID USUARIO A EDITAR:")
        print(id_cliente)
        print("DATOS RECIBIDOS:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        respuesta = _client().put(

            f"/clientes/{id_cliente}",

            data=datos

        )

        print("========================================")
        print("RESPUESTA BACKEND EDITAR USUARIO:")
        print(respuesta)
        print("========================================")

        return jsonify(
            respuesta
        ), 200

    except APIError as e:

        print("========================================")
        print("ERROR EDITANDO USUARIO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400


# ==========================================================
# CAMBIAR ESTADO USUARIO
# ==========================================================

@admin_bp.route(
    "/usuarios/estado/<int:id_cliente>",
    methods=["PUT"]
)
@admin_required
def cambiar_estado_usuario(id_cliente):

    try:

        datos = request.get_json()

        print("========================================")
        print("CAMBIAR ESTADO USUARIO")
        print("ID USUARIO:")
        print(id_cliente)
        print("DATOS RECIBIDOS:")
        print(datos)
        print("========================================")

        if not datos:

            return jsonify({

                "error":
                    "No se recibieron datos."

            }), 400

        estado = datos.get(
            "estado_cliente"
        )

        if estado not in [
            "Activo",
            "Inactivo"
        ]:

            return jsonify({

                "error":
                    "El estado debe ser Activo o Inactivo."

            }), 400

        respuesta = _client().put(

            f"/clientes/{id_cliente}",

            data={
                "estado_cliente": estado
            }

        )

        print("========================================")
        print("RESPUESTA BACKEND CAMBIO ESTADO:")
        print(respuesta)
        print("========================================")

        return jsonify({

            "mensaje":
                f"Usuario marcado como {estado}.",

            "usuario":
                respuesta

        }), 200

    except APIError as e:

        print("========================================")
        print("ERROR CAMBIANDO ESTADO:")
        print(e)
        print("========================================")

        return jsonify({

            "error":
                str(e)

        }), 400

# ==========================================================
# CAMBIAR CONTRASEÑA DEL ADMINISTRADOR
# ==========================================================

@admin_bp.route(
    "/configuracion_adm/password",
    methods=["PUT"]
)
@admin_required
def cambiar_password_administrador():

    try:

        datos = request.get_json()

        print("========================================")
        print("CAMBIAR CONTRASEÑA ADMINISTRADOR")
        print("DATOS RECIBIDOS")
        print(datos)
        print("========================================")


        if not datos:

            return jsonify({
                "error": "No se recibieron datos."
            }), 400


        respuesta = _client().put(
            "/administrador/cambiar-password",
            data=datos
        )


        print("========================================")
        print("RESPUESTA BACKEND")
        print(respuesta)
        print("========================================")


        return jsonify(respuesta), 200


    except APIError as e:

        print("========================================")
        print("ERROR CAMBIANDO CONTRASEÑA")
        print(e)
        print("========================================")


        return jsonify({
            "error": str(e)
        }), 400