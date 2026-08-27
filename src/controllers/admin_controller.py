from flask import (
    Blueprint,
    render_template,
    session,
    flash
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


        # ==================================================
        # EXTRAER LISTA DE PRODUCTOS
        # ==================================================

        productos = respuesta.get(
            "productos",
            []
        )


        # ==================================================
        # TOTAL DE PRODUCTOS
        # ==================================================

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
                )
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
            "/usuario_adm/",
            params={
                "page": 1,
                "per_page": 1
            }
        )


        print("========================================")
        print("RESPUESTA CLIENTES DASHBOARD:")
        print(respuesta_clientes)
        print("========================================")


        # ==================================================
        # OBTENER PAGINACIÓN
        # ==================================================

        pagination = respuesta_clientes.get(
            "pagination",
            {}
        )


        # ==================================================
        # TOTAL DE USUARIOS
        # ==================================================

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
    print("ÚLTIMOS PRODUCTOS:", ultimos_productos)
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

@admin_bp.route("/productos_adm")
@admin_required
def productos_adm():

    try:

        productos = APIClient.as_list(
            _client().get(
                "/productos/"
            )
        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        productos = []


    return render_template(

        "admin/productos_adm.html",

        productos=productos

    )


# ==========================================================
# USUARIOS
# ==========================================================

@admin_bp.route("/usuario_adm")
@admin_required
def usuario_adm():

    try:

        clientes = APIClient.as_list(
            _client().get(
                "/usuario_adm/"
            )
        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        clientes = []


    return render_template(

        "admin/usuario_adm.html",

        clientes=clientes

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
# ENVÍOS
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
# CONFIGURACIÓN
# ==========================================================

@admin_bp.route("/configuracion_adm")
@admin_required
def configuracion_adm():

    try:

        configuracion = _client().get(
            "/configuracion_adm/"
        )

    except APIError as e:

        flash(
            str(e),
            "danger"
        )

        configuracion = {}


    return render_template(

        "admin/configuracion_adm.html",

        configuracion=configuracion

    )


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