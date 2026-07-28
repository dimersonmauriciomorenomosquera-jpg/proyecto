from flask import Blueprint, render_template, session, flash, redirect, url_for
from clients.api_client import APIClient, APIError
from flask import Blueprint

descripcion_bp = Blueprint("descripcion", __name__)


def _client():
    return APIClient(session.get("api_token"))


@descripcion_bp.route("/<int:id_producto>")
def index(id_producto):

    try:

        producto = _client().get(f"/productos/{id_producto}")

    except APIError as e:

        flash(str(e), "danger")

        return redirect(url_for("productos.index"))

    return render_template(
        "descripcion.html",
        producto=producto
    ) 

@descripcion_bp.route("/prueba")
def prueba():

    producto = {
        "id_producto": 1,
        "nombre_producto": "Nike Air Force 1",
        "precio_producto": 350000,
        "descripcion_producto": "Tenis urbanos de cuero con suela de goma.",
        "imagen_producto": "zapato1.png"
    }

    return render_template(
        "descripcion.html",
        producto=producto
    )