from flask import Flask , render_template , request , redirect, session

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

@app.route("/productos/<categoria>")
def productos_categoria(categoria):

    return render_template(
        "productos.html",
        categoria=categoria
    )

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

@app.route('/usuario')
def usuario():
    return render_template("usuario.html")



@app.route("/descripcion/<producto>")
def descripcion(producto):

    productos = {

        "saco-dama": {
            "categoria": "ropa",
            "id": "saco-dama",
            "nombre": "Saco para dama",
            "precio": 99999, 
            "imagen": "https://blackmountain.com.co/cdn/shop/files/Capturadepantalla2024-05-03ala_s_3.35.56a.m..png?v=1714759361&width=1445",
            "descripcion": "Saco de dama manga larga diseñado para brindar comodidad y estilo en cualquier ocasión. Su diseño sin capota le da un toque elegante y versátil, ideal para combinar con jeans, pantalones o faldas. Fabricado con materiales suaves y cómodos, perfecto para climas frescos y para usar tanto en salidas casuales como en looks más modernos. Su ajuste cómodo y acabado delicado hacen de este saco una prenda esencial en el guardarropa femenino."
        },
    
        "reloj-hombre": {
            "categoria": "accesorios",
            "id": "reloj-hombre",
            "nombre": "Reloj Hombre",
            "precio": 120000, 
            "imagen": "https://exitocol.vtexassets.com/arquivos/ids/18895297/reloj-hombre-megir-plateado-formal-meg-8.jpg?v=638219432937530000",
            "descripcion":"Reloj elegante para hombre con diseño moderno."

        },
    
        "cadena-cubana": {
            "categoria": "accesorios",
            "id": "cadena-cubana",
            "nombre": "Cadena Cubana",
            "precio": 150000, 
            "imagen": "https://m.media-amazon.com/images/I/81X8Hb05PvL._AC_UY1000_.jpg",
            "descripcion": "Cadena cubana con acabado brillante y diseño elegante. Ideal para complementar outfits urbanos y modernos con un estilo llamativo."
        },
    

        "force-one": {
            "categoria": "zapatos",
            "id": "force-one",
            "nombre": "Nike Force One",
            "precio": 100000, 
            "imagen": "https://fenixstore.com.co/wp-content/uploads/2023/08/WhatsApp-Image-2021-01-09-at-18.33.26-1-1.jpeg",
            "descripcion": " Tenis Nike Force One con diseño clásico y cómodo. Perfectos para uso diario gracias a su estilo versátil y moderno."
        },

        "new-balance": {
            "categoria": "zapatos",
            "id": "new-balance",
            "nombre": "New Balance",
            "precio": 120000, 
            "imagen": "https://www.sportline.com.co/media/catalog/product/u/5/u530sma_frontf1-01.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:",
            "descripcion": " Zapatillas New Balance con diseño deportivo y excelente comodidad. Ideales para caminar, salir o completar un look casual."
        },

        "north-face": {
            "categoria": "ropa",
            "id": "north-face",
            "nombre": "Chaqueta North Face",
            "precio": 130000, 
            "imagen": "https://www.bfgcdn.com/1500_1500_90/004-5262-0811/the-north-face-aconcagua-3-hoodie-chaqueta-de-plumas.jpg",
            "descripcion": " Chaqueta North Face resistente y cómoda, perfecta para climas fríos y outfits urbanos con un toque moderno."
        },

        "vestido-corto": {
            "categoria": "ropa",
            "id": "vestido-corto",
            "nombre": "Vestido Corto",
            "precio": 150000, 
            "imagen": "https://m.media-amazon.com/images/I/710OozkVprL._AC_UF894,1000_QL80_.jpg",
            "descripcion": "Vestido clásico elegante y cómodo, ideal para ocasiones especiales o salidas casuales con estilo sofisticado."
        },

        "levis-basica": {
            "categoria": "ropa",
            "id": "levis-basica",
            "nombre": "Camiseta Levis Basica",
            "precio": 100000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1RThgHtNKoWHIUXSho-uuh0g9QXybey3DA&s",
            "descripcion": "Camiseta Levis básica de diseño minimalista y tela suave. Fácil de combinar para cualquier ocasión."
        },

        "manga-larga": {
            "categoria": "ropa",
            "id": "manga-larga",
            "nombre": "Camisa Manga Larga",
            "precio": 110000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs_A2K2H-7kZ4tMv-ANDEDPJ9cZTaS8G7dOQ&s",
            "descripcion": " Camisa manga larga con acabado elegante y moderno. Perfecta para eventos, oficina o reuniones especiales."
        },

        "manga-corta": {
            "categoria": "ropa",
            "id": "manga-corta",
            "nombre": "Camisa Manga Corta",
            "precio": 100000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUTm5_mcDNHnT96PZG7Z2ErcOWkI-CPTOiQ&s",
            "descripcion": "Camisa manga corta fresca y cómoda, ideal para climas cálidos y looks casuales con estilo moderno."
        },

        "zapatillas": {
            "categoria": "zapatos",
            "id": "zapatillas",
            "nombre": "Zapatillas Caballero",
            "precio": 130000, 
            "imagen": "https://www.quest.com.co/cdn/shop/files/QUE116250027-0-1.jpg?v=1761177681",
            "descripcion": "Zapatillas cómodas y ligeras con diseño moderno. Perfectas para el día a día y outfits casuales."
        },

        "zapatillas-plataforma": {
            "categoria": "zapatos",
            "id": "zapatillas-plataforma",
            "nombre": "Zapatillas en Plataforma",
            "precio": 150000, 
            "imagen": "https://down-co.img.susercontent.com/file/17123d0e53d3436e04171704dd215180",
            "descripcion": "Zapatillas en plataforma con estilo moderno y llamativo. Brindan comodidad y un toque de altura elegante."
        },

        "arretes-esmeralda": {
            "categoria": "accesorios",
            "id": "arretes-esmeralda",
            "nombre": "Arretes Esmeralda",
            "precio": 180000, 
            "imagen": "https://esmeraldascolombia.com/cdn/shop/files/medidas_Aretes_Celeste.jpg?v=1759355225&width=1024",
            "descripcion": "Aretes con diseño elegante y detalles tipo esmeralda que aportan sofisticación y brillo a cualquier outfit."
        },

        "arretes-dorados": {
            "categoria": "accesorios",
            "id": "arrtes-dorados",
            "nombre": "Arretes Dorados",
            "precio": 100000, 
            "imagen": "https://opalodesigns.com/storage/product/ON2ZGfSKx4JU6F3RgefqnHLgipu57qmObmfR7xDv.jpg",
            "descripcion": "Aretes dorados minimalistas y modernos, ideales para complementar looks elegantes y casuales."
        },

        "arretes-hombre": {
            "categoria": "accesorios",
            "id": "arretes-hombre",
            "nombre": "Arretes para Hombre",
            "precio": 100000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1sQgT00b8BZ-tDr2rbcyPxfJoa3cXiTo4og&s",
            "descripcion": "Aretes para hombre con diseño moderno y urbano. Perfectos para destacar un estilo auténtico y juvenil."
        },

        "anillos": {
            "categoria": "accesorios",
            "id": "anillos",
            "nombre": "Anillos",
            "precio": 130000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2zZ_pHtDOW5AXKM2QbnuwfO-U7dJ5Gl9sKA&s",
            "descripcion": "Anillos elegantes con acabado moderno y sofisticado. Ideales para complementar cualquier estilo."
        },

        "blusa-escotada": {
            "categoria": "ropa",
            "id": "blusa-escotada",
            "nombre": "Blusa Escotada",
            "precio": 110000, 
            "imagen": "https://pinkrose.com.co/cdn/shop/files/BLM16341WHTM1.jpg?v=1771271374&width=1024",
            "descripcion": "Blusa escotada moderna y elegante, perfecta para salidas, reuniones o looks casuales con estilo."
        },

        "baggy-hombre": {
            "categoria": "ropa",
            "id": "baggy-hombre",
            "nombre": "Pantalon Baggy  Hombre",
            "precio": 130000, 
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfyhX9NSEIBpeUscDjTVALddhDTTvjosUB5w&s",
            "descripcion": "Pantalón baggy para hombre con ajuste cómodo y estilo urbano. Ideal para outfits relajados y modernos"
        },

        "cargo-negro": {
            "categoria": "ropa",
            "id": "cargo-negro",
            "nombre": "Pantalon Cargo Negro",
            "precio": 130000, 
            "imagen": "https://system.costaldeanzuelos.com/assets/img/multimedia/109417389410007/jean-manual-lilith-cargo-mujer-negro-1.webp",
            "descripcion": "Pantalón cargo negro con múltiples bolsillos y diseño moderno. Perfecto para un look urbano y cómodo."
        },

        "cargo-gris": {
            "categoria": "ropa",
            "id": "cargo-gris",
            "nombre": "Pantalon Cargo Gris Humo",
            "precio": 130000, 
            "imagen": "https://backstakeclo.com/cdn/shop/files/Cargo_gris_humo_multipockets_hombre_1.jpg?v=1744444744&width=1946",
            "descripcion": "Pantalón cargo gris humo con estilo moderno y cómodo. Ideal para combinar con outfits casuales y urbanos."
        },

        "polo-negra": {
            "categoria": "ropa",
            "id": "polo-negro",
            "nombre": "Camisa Polo Negra",
            "precio": 100000, 
            "imagen": "https://www.gef.co/cdn/shop/files/new-tod-negro-799-730593_000799-1.jpg?v=1767192741",
            "descripcion": "Camisa polo negra elegante y versátil. Perfecta para ocasiones casuales o semi formales."
        },

        "pantalon-clasico": {
            "categoria": "ropa",
            "id": "pantalon-clasico",
            "nombre": "Pantalon clasico",
            "precio": 130000, 
            "imagen": "https://marcacedro.com/cdn/shop/files/pantalon_tipo_sastre_para_hombre_corte_regular_fit_de_la_marca_cedro_color_mocca_hecho_con_fibra_inteligente_de_alta_resistencia_frontal_2b504019-f07d-4b1c-a84f-c70b23cf582a.webp?v=1758317104&width=2048",
            "descripcion": "Pantalón clásico con diseño elegante y cómodo. Ideal para eventos, oficina o combinaciones formales."
        },

        "zamba": {
            "categoria": "zapatos",
            "id": "zamba",
            "nombre": "Adidas Zamba",
            "precio": 150000, 
            "imagen": "https://freemans.scene7.com/is/image/OttoUK/355w/adidas-Originals-Samba-XLG-Lace-Up-Trainers~25152534FRSC.jpg",
            "descripcion": "Tenis Adidas Zamba con diseño icónico y moderno. Perfectos para outfits casuales y urbanos."
        },

        "botas": {
            "categoria": "zapatos",
            "id": "botas",
            "nombre": "Botas para Caballero",
            "precio": 180000, 
            "imagen": "https://pisandofuertecol.com/cdn/shop/files/bota-cuero-hombre-unisex-alvines-montanismo-brahma-amarilla-caterpillar-2.jpg?v=1761590727&width=1445",
            "descripcion": "Botas para caballero resistentes y cómodas, ideales para climas fríos y looks modernos con personalidad."
        }
    }


    producto_actual = productos.get(producto)

    if producto_actual is None:
        return "Producto no encontrado", 404

    return render_template(
        "descripcion.html",
        producto=producto_actual
    )




@app.route("/soporte", methods=["GET", "POST"])
def soporte():

    if request.method == "POST":

        nombre = request.form["nombre"]
        correo = request.form["correo"]
        asunto = request.form["asunto"]
        mensaje = request.form["mensaje"]

        print(nombre)
        print(correo)
        print(asunto)
        print(mensaje)

        return "Mensaje enviado correctamente"

    return render_template("soporte.html")

if __name__ == '__main__':
    app.run(debug=True)

    

