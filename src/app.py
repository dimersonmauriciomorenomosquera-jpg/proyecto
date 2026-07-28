from flask import Flask
from flask import Blueprint


from controllers.inicio_controller import inicio_bp
from controllers.productos_controller import productos_bp
from controllers.carrito_controller import carrito_bp
from controllers.pago_controller import pago_bp
from controllers.factura_controller import factura_bp
from controllers.envio_controller import envio_bp
from controllers.usuario_controller import usuario_bp
from controllers.admin_controller import admin_bp
from controllers.auth_controller import auth_bp
from controllers.descripcion_controller import descripcion_bp
from controllers.novedades_controller import novedades_bp

app = Flask(__name__)

app.secret_key = "tu_clave_secreta"

app.register_blueprint(inicio_bp)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(productos_bp, url_prefix="/productos")
app.register_blueprint(carrito_bp, url_prefix="/carrito")
app.register_blueprint(pago_bp, url_prefix="/pago")
app.register_blueprint(factura_bp, url_prefix="/facturas")
app.register_blueprint(envio_bp, url_prefix="/envios")
app.register_blueprint(usuario_bp, url_prefix="/usuario")
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint( descripcion_bp,url_prefix="/descripcion")
app.register_blueprint(novedades_bp)


if __name__ == "__main__":
    app.run(debug=True, port=5001)