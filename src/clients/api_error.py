class APIError(Exception):

    def __init__(self, mensaje, codigo=None):
        self.mensaje = mensaje
        self.codigo = codigo
        super().__init__(self.mensaje)