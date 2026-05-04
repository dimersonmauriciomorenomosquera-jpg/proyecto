from flask import Flask , render_template

app = Flask(__name__)


@app.route('/')
def pagina_de_inicio():
    return render_template("inicio.html")
    
@app.route('/inicio')
def inicio():
    return render_template("inicio.html")

@app.route('/productos')
def productos():
    return render_template("productos.html")

@app.route('/carrito')
def carrito():
    return render_template("carrito.html")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/pago')
def pago():
    return render_template("pago.html")

@app.route('/registro')
def registro():
    return render_template("registro.html")

@app.route('/panel_administrador')
def panel_administrador():
    return render_template("panel_administrador.html")

if __name__ == '__main__':
    app.run(debug=True)
