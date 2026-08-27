from functools import wraps

from flask import (
    session,
    redirect,
    url_for,
    flash
)


def admin_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        # ======================================================
        # VERIFICAR TOKEN
        # ======================================================

        token = session.get(
            "api_token"
        )

        if not token:

            flash(
                "Debes iniciar sesión como administrador.",
                "warning"
            )

            return redirect(
                url_for("auth.login")
            )


        # ======================================================
        # VERIFICAR TIPO DE USUARIO
        # ======================================================

        tipo = session.get(
            "tipo"
        )

        if tipo != "administrador":

            flash(
                "Acceso denegado. Se requiere una cuenta de administrador.",
                "danger"
            )

            return redirect(
                url_for("auth.login")
            )


        # ======================================================
        # ACCESO PERMITIDO
        # ======================================================

        return fn(
            *args,
            **kwargs
        )


    return wrapper