from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from clients.api_client import APIClient, APIError
from flask import Blueprint

carrito_bp = Blueprint("carrito", __name__)


def _client():
    return APIClient(session.get("api_token"))


@carrito_bp.route("/")
def index():

    try:
        carrito = _client().get("/carrito/")
        carrito = APIClient.as_list(carrito)

    except APIError:
        carrito = []

    return render_template(
        "carrito.html",
        carrito=carrito
    )


@carrito_bp.route("/agregar/<int:id_producto>", methods=["POST"])
def agregar_producto(id_producto):

    cantidad = int(request.form.get("cantidad", 1))

    try:

        _client().post(
            "/carrito/",
            {
                "id_producto": id_producto,
                "cantidad": cantidad
            }
        )

        flash("Producto agregado al carrito.", "success")

    except APIError as e:

        flash(str(e), "danger")

    return redirect(url_for("carrito.index"))


@carrito_bp.route("/actualizar/<int:id_producto>", methods=["POST"])
def actualizar_cantidad(id_producto):

    cantidad = int(request.form["cantidad"])

    try:

        _client().put(
            f"/carrito/{id_producto}",
            {
                "cantidad": cantidad
            }
        )

        flash("Cantidad actualizada.", "success")

    except APIError as e:

        flash(str(e), "danger")

    return redirect(url_for("carrito.index"))


@carrito_bp.route("/eliminar/<int:id_producto>", methods=["POST"])
def eliminar_producto(id_producto):

    try:

        _client().delete(f"/carrito/{id_producto}")

        flash("Producto eliminado del carrito.", "success")

    except APIError as e:

        flash(str(e), "danger")

    return redirect(url_for("carrito.index"))