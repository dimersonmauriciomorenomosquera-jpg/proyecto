from flask import Blueprint, render_template

novedades_bp = Blueprint(
    "novedades",
    __name__,
    url_prefix="/novedades"
)

@novedades_bp.route("/")
def index():
    return render_template("novedades.html")