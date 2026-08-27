import httpx

from clients.config import API_URL
from clients.api_error import APIError


class APIClient:

    def __init__(self, token=None):

        self.base_url = API_URL
        self.headers = {}

        if token:
            self.headers["Authorization"] = f"Bearer {token}"


    # ==========================================================
    # CONSTRUIR URL
    # ==========================================================

    def _url(self, path: str) -> str:

        full_url = (
            f"{self.base_url.rstrip('/')}/"
            f"{path.lstrip('/')}"
        )

        print(f"APIClient: {full_url}")

        return full_url


    # ==========================================================
    # MANEJAR RESPUESTA
    # ==========================================================

    def _handle(self, response: httpx.Response):

        # ======================================================
        # RESPUESTA VACÍA
        # ======================================================

        if not response.content:

            raise APIError(
                "El servidor retornó una respuesta vacía.",
                response.status_code
            )


        # ======================================================
        # CONVERTIR RESPUESTA A JSON
        # ======================================================

        try:

            body = response.json()

        except Exception:

            raise APIError(
                f"Respuesta no es JSON válido "
                f"(status {response.status_code}): "
                f"{response.text[:200]}",
                response.status_code
            )


        # ======================================================
        # TOKEN EXPIRADO / NO AUTORIZADO
        # ======================================================

        if response.status_code == 401:

            mensaje = (
                body.get("msg")
                or body.get("message")
                or body.get("error")
                or "Sesión expirada."
            ) if isinstance(body, dict) else "Sesión expirada."


            raise APIError(
                mensaje,
                401
            )


        # ======================================================
        # RESPUESTA EN FORMA DE LISTA
        # ======================================================

        if isinstance(body, list):

            return body


        # ======================================================
        # LA RESPUESTA DEBE SER UN DICCIONARIO
        # ======================================================

        if not isinstance(body, dict):

            raise APIError(
                f"Formato de respuesta inesperado: "
                f"{type(body).__name__}",
                response.status_code
            )


        # ======================================================
        # BACKEND CON WRAPPER
        # ======================================================

        if "success" in body:

            if not body.get("success"):

                raise APIError(
                    body.get(
                        "message",
                        "Error desconocido."
                    ),
                    response.status_code,
                    body.get("errors")
                )

            return body.get("data")


        # ======================================================
        # RESPUESTA EXITOSA DIRECTA
        # ======================================================

        if response.status_code < 400:

            return body


        # ======================================================
        # ERROR DEL BACKEND
        # ======================================================

        raise APIError(
            body.get("message")
            or body.get("error")
            or body.get("msg")
            or "Error del servidor.",
            response.status_code
        )


    # ==========================================================
    # GET
    # ==========================================================

    def get(self, path, params=None):

        print(f"GET {path}")

        response = httpx.get(
            self._url(path),
            params=params,
            headers=self.headers,
            timeout=10
        )

        print(response.text)

        return self._handle(response)


    # ==========================================================
    # POST
    # ==========================================================

    def post(self, path, data=None):

        print(f"POST {path}")

        response = httpx.post(
            self._url(path),
            json=data,
            headers=self.headers,
            timeout=10
        )

        print(response.text)

        return self._handle(response)


    # ==========================================================
    # PUT
    # ==========================================================

    def put(self, path, data=None):

        print(f"PUT {path}")

        response = httpx.put(
            self._url(path),
            json=data,
            headers=self.headers,
            timeout=10
        )

        print(response.text)

        return self._handle(response)


    # ==========================================================
    # DELETE
    # ==========================================================

    def delete(self, path):

        print(f"DELETE {path}")

        response = httpx.delete(
            self._url(path),
            headers=self.headers,
            timeout=10
        )

        print(response.text)

        return self._handle(response)


    # ==========================================================
    # NORMALIZAR LISTAS
    # ==========================================================

    @staticmethod
    def as_list(data):

        if isinstance(data, list):

            return data


        if isinstance(data, dict):

            return (
                data.get("items")
                or data.get("data")
                or data.get("results")
                or []
            )


        return []