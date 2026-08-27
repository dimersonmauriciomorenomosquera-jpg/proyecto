from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
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

auth_bp = Blueprint(
    "auth",
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
# LOGIN - MOSTRAR FORMULARIO
# ==========================================================

@auth_bp.route(
    "/login",
    methods=["GET"]
)
def index():

    return render_template(
        "login.html"
    )


# ==========================================================
# LOGIN - PROCESAR
# ==========================================================

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    # ======================================================
    # OBTENER DATOS
    # ======================================================

    if request.is_json:

        datos = request.get_json()

    else:

        datos = {
            "email": request.form.get("email"),
            "password": request.form.get("password")
        }


    # ======================================================
    # VALIDAR DATOS
    # ======================================================

    if not datos:

        flash(
            "Debe enviar información.",
            "danger"
        )

        return redirect(
            url_for("auth.index")
        )


    email = datos.get("email")

    password = datos.get("password")


    if not email:

        flash(
            "El correo es obligatorio.",
            "danger"
        )

        return redirect(
            url_for("auth.index")
        )


    if not password:

        flash(
            "La contraseña es obligatoria.",
            "danger"
        )

        return redirect(
            url_for("auth.index")
        )


    # ======================================================
    # ENVIAR LOGIN AL BACKEND
    # ======================================================

    try:

        respuesta = _client().post(

            "/auth/login",

            {
                "email": email,
                "password": password
            }

        )


        print("========================================")
        print("RESPUESTA LOGIN:")
        print(respuesta)
        print("========================================")


        # ==================================================
        # OBTENER TOKEN
        # ==================================================

        token = respuesta.get(
            "token"
        )


        if not token:

            flash(
                "El servidor no devolvió el token.",
                "danger"
            )

            return redirect(
                url_for("auth.index")
            )


        # ==================================================
        # OBTENER TIPO
        # ==================================================

        tipo = respuesta.get(
            "tipo"
        )


        # ==================================================
        # LOGIN CLIENTE
        # ==================================================

        if tipo == "cliente":

            usuario = respuesta.get(
                "usuario"
            )


            if not usuario:

                flash(
                    "El servidor no devolvió los datos del usuario.",
                    "danger"
                )

                return redirect(
                    url_for("auth.index")
                )


            # ==============================================
            # GUARDAR SESIÓN CLIENTE
            # ==============================================

            session["api_token"] = token

            session["tipo"] = "cliente"

            session["id_cliente"] = (
                usuario.get("id_cliente")
            )

            session["usuario"] = usuario


            print("========================================")
            print("LOGIN CLIENTE")
            print("TOKEN:", session.get("api_token"))
            print("TIPO:", session.get("tipo"))
            print("USUARIO:", session.get("usuario"))
            print("========================================")


            flash(
                "Bienvenido.",
                "success"
            )


            return redirect(
                url_for("inicio.index")
            )


        # ==================================================
        # LOGIN ADMINISTRADOR
        # ==================================================

        elif tipo == "administrador":

            administrador = respuesta.get(
                "administrador"
            )


            if not administrador:

                flash(
                    "El servidor no devolvió los datos del administrador.",
                    "danger"
                )

                return redirect(
                    url_for("auth.index")
                )


            # ==============================================
            # GUARDAR SESIÓN ADMINISTRADOR
            # ==============================================

            session["api_token"] = token

            session["tipo"] = "administrador"

            session["id_administrador"] = (
                administrador.get(
                    "id_administrador"
                )
            )

            session["administrador"] = administrador


            print("========================================")
            print("LOGIN ADMINISTRADOR")
            print("TOKEN:", session.get("api_token"))
            print("TIPO:", session.get("tipo"))
            print(
                "ADMINISTRADOR:",
                session.get("administrador")
            )
            print(
                "ID ADMIN:",
                session.get("id_administrador")
            )
            print("========================================")


            flash(
                "Bienvenido administrador.",
                "success"
            )


            return redirect(
                url_for("admin.dashboard")
            )


        # ==================================================
        # TIPO DESCONOCIDO
        # ==================================================

        else:

            flash(
                "Tipo de usuario desconocido.",
                "danger"
            )

            return redirect(
                url_for("auth.index")
            )


    # ======================================================
    # ERROR API
    # ======================================================

    except APIError as e:

        print("========================================")
        print("ERROR LOGIN:")
        print(e)
        print("========================================")


        flash(
            str(e),
            "danger"
        )


        return redirect(
            url_for("auth.index")
        )


# ==========================================================
# LOGOUT
# ==========================================================

@auth_bp.route(
    "/logout",
    methods=["GET"]
)
def logout():

    print("========================================")
    print("CERRANDO SESIÓN")
    print("========================================")


    session.clear()


    print("SESIÓN DESPUÉS DEL LOGOUT:")
    print(dict(session))


    flash(
        "Sesión cerrada correctamente.",
        "success"
    )


    return redirect(
        url_for("auth.index")
    )

    # ==========================================================
# REGISTRO
# ==========================================================

@auth_bp.route(
    "/registro",
    methods=["GET", "POST"]
)
def registro():

    # ======================================================
    # MOSTRAR FORMULARIO
    # ======================================================

    if request.method == "GET":

        return render_template(
            "Registro.html"
        )


    # ======================================================
    # OBTENER DATOS DEL FORMULARIO
    # ======================================================

    datos = {

        "nombre":
            request.form.get("nombre"),

        "apellido":
            request.form.get("apellido"),

        "email":
            request.form.get("email"),

        "telefono":
            request.form.get("telefono"),

        "direccion":
            request.form.get("direccion"),

        "password":
            request.form.get("password")

    }


    # ======================================================
    # ENVIAR REGISTRO AL BACKEND
    # ======================================================

    try:

        respuesta = _client().post(

            "/clientes/",

            datos

        )


        print("========================================")
        print("RESPUESTA REGISTRO:")
        print(respuesta)
        print("========================================")


        flash(
            "Usuario registrado correctamente.",
            "success"
        )


        return redirect(
            url_for("auth.index")
        )


    except APIError as e:

        print("========================================")
        print("ERROR REGISTRO:")
        print(e)
        print("========================================")


        flash(
            str(e),
            "danger"
        )


        return redirect(
            url_for("auth.registro")
        )