class APIError(Exception):

    def __init__(self, mensaje, codigo=None):
        self.mensaje = mensaje
        self.codigo = codigo
        super().__init__(self.mensaje)
class APIError(Exception):

    def __init__(
        self,
        message,
        status_code=None,
        errors=None
    ):

        super().__init__(message)

        self.message = message
        self.status_code = status_code
        self.errors = errors

    def __str__(self):

        return self.message