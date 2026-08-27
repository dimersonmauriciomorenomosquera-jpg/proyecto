/*==================================
        CATÁLOGO
==================================*/

function irCatalogo(categoria) {

    window.location.href =
        "/productos/categoria/" +
        encodeURIComponent(categoria);

}


/*==================================
        PRODUCTOS DESTACADOS
==================================*/

const productosDestacados = [
    20,
    14,
    18,
    10
];


/*==================================
        CARGAR PRODUCTOS
==================================*/

async function cargarDestacados() {

    const contenedor =
        document.getElementById(
            "productos-destacados"
        );


    if (!contenedor) {

        console.error(
            "No existe el contenedor productos-destacados"
        );

        return;
    }


    contenedor.innerHTML = "";


    for (const id of productosDestacados) {

        try {

            console.log(
                "Solicitando producto:",
                id
            );


            const respuesta = await fetch(
                `/producto/${id}`
            );


            console.log(
                "Respuesta:",
                respuesta.status
            );


            if (!respuesta.ok) {

                console.error(
                    `No se pudo obtener el producto ${id}`
                );

                continue;
            }


            const producto =
                await respuesta.json();


            console.log(
                "Producto recibido:",
                producto
            );


            contenedor.innerHTML += `

                <div class="card-producto">

                    <button
                        class="favorito"
                        type="button">

                        <i class="fa-regular fa-heart"></i>

                    </button>


                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre_producto}"
                    >


                    <div class="info-producto">

                        <span class="categoria-producto">
                            ${producto.categoria}
                        </span>


                        <h3>
                            ${producto.nombre_producto}
                        </h3>


                        <div class="estrellas">

                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>

                        </div>


                        <div class="precio">

                            <span class="nuevo">

                                $${Number(
                                    producto.precio_producto
                                ).toLocaleString("es-CO")}

                            </span>

                        </div>


                        <button
                            class="btn-carrito"
                            type="button"
                            onclick="verProducto(
                                ${producto.id_producto}
                            )">

                            <i class="fa-solid fa-cart-shopping"></i>

                            Agregar al carrito

                        </button>

                    </div>

                </div>

            `;

        }

        catch (error) {

            console.error(
                `Error cargando producto ${id}:`,
                error
            );

        }

    }


    activarFavoritos();

}


/*==================================
        FAVORITOS
==================================*/

function activarFavoritos() {

    document
        .querySelectorAll(".favorito")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    boton.classList.toggle(
                        "activo"
                    );


                    const icono =
                        boton.querySelector("i");


                    if (
                        boton.classList.contains(
                            "activo"
                        )
                    ) {

                        icono.classList.remove(
                            "fa-regular"
                        );

                        icono.classList.add(
                            "fa-solid"
                        );

                    }

                    else {

                        icono.classList.remove(
                            "fa-solid"
                        );

                        icono.classList.add(
                            "fa-regular"
                        );

                    }

                }
            );

        });

}


/*==================================
        VER PRODUCTO
==================================*/

function verProducto(id) {

    window.location.href =
        `/productos/${id}`;

}


/*==================================
        INICIO
==================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarDestacados();

    }
);