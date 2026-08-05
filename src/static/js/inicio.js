function irCatalogo(categoria){
    window.location.href = "/productos/categoria/" + categoria;
}
const contenedor = document.getElementById("productos-destacados");

// IDs de los productos que quieres mostrar
const productosDestacados = [20, 14, 18, 10];

async function cargarDestacados() {

    contenedor.innerHTML = "";

    for (const id of productosDestacados) {

        const respuesta = await fetch(`http://127.0.0.1:5000/productos/${id}`);

        if (!respuesta.ok) continue;

        const producto = await respuesta.json();

        contenedor.innerHTML += `
        
        <div class="card-producto">

            <button class="favorito">
                <i class="fa-regular fa-heart"></i>
            </button>

            <img src="${producto.imagen}" alt="${producto.nombre_producto}">

            <div class="info-producto">

                <span class="categoria-producto">
                    ${producto.categoria}
                </span>

                <h3>${producto.nombre_producto}</h3>

                <div class="estrellas">
                    ★★★★★
                </div>

                <div class="precio">

                    <span class="nuevo">
                        $${producto.precio_producto}
                    </span>

                </div>

                <button class="btn-carrito">

                    <i class="fa-solid fa-cart-shopping"></i>

                    Agregar al carrito

                </button>

            </div>

        </div>

        `;
    }

}

cargarDestacados();