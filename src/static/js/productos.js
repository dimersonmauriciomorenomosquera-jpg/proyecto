/*==================================
        FAVORITOS
==================================*/

let paginaActual = 1;

const contenedor = document.getElementById("productos-grid");

function activarFavoritos() {

    document.querySelectorAll(".favorito").forEach(boton => {

        boton.addEventListener("click", () => {

            boton.classList.toggle("activo");

            const icono = boton.querySelector("i");

            if (boton.classList.contains("activo")) {

                icono.classList.remove("fa-regular");
                icono.classList.add("fa-solid");

            } else {

                icono.classList.remove("fa-solid");
                icono.classList.add("fa-regular");

            }

        });

    });

}

/*==================================
        CARGAR PRODUCTOS
==================================*/

async function cargarProductos() {

    const buscar = document.getElementById("buscar").value;

    const categoria = document.querySelector(
        "input[name='categoria']:checked"
    ).value;

    const ordenar = document.getElementById("ordenar").value;

    let url = `http://127.0.0.1:5000/productos/buscar?pagina=${paginaActual}`;

    const parametros = [];

    if (buscar !== "") {

        parametros.push(`buscar=${encodeURIComponent(buscar)}`);

    }

    if (categoria !== "Todos") {

        parametros.push(`categoria=${encodeURIComponent(categoria)}`);

    }

    if (ordenar !== "") {

        parametros.push(`ordenar=${encodeURIComponent(ordenar)}`);

    }

    if (parametros.length > 0) {

        url += "&" + parametros.join("&");

    }

    try {

        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error("No fue posible cargar los productos");

        }

        const datos = await respuesta.json();

        mostrarProductos(datos.productos);

        crearPaginacion(datos.total_paginas);

    } catch (error) {

        console.error(error);

    }

}

/*==================================
        MOSTRAR PRODUCTOS
==================================*/

function mostrarProductos(productos) {

    contenedor.innerHTML = "";

    productos.forEach(producto => {

        contenedor.innerHTML += `

        <article class="producto">

            <button class="favorito">
                <i class="fa-regular fa-heart"></i>
            </button>

            <a href="/productos/${producto.id_producto}">

                <img src="${producto.imagen}" alt="${producto.nombre_producto}">

            </a>

            <div class="info">

                <span class="categoria">
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
                    <i class="fa-regular fa-star"></i>

                </div>

                <p class="precio">

                    $${Number(producto.precio_producto).toLocaleString("es-CO")}

                </p>

                <button
                    class="btn-comprar"
                    onclick="verProducto(${producto.id_producto})">

                    Ver producto

                </button>

            </div>

        </article>

        `;

    });

    activarFavoritos();

}

/*==================================
        PAGINACIÓN
==================================*/

function crearPaginacion(totalPaginas) {

    const paginacion = document.getElementById("paginacion");

    paginacion.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {

        paginacion.innerHTML += `

            <button
                class="${i === paginaActual ? "activo" : ""}"
                onclick="cambiarPagina(${i})">

                ${i}

            </button>

        `;

    }

}

function cambiarPagina(pagina) {

    paginaActual = pagina;

    cargarProductos();

}

/*==================================
        VER PRODUCTO
==================================*/

function verProducto(id) {

    window.location.href = `/productos/${id}`;

}

/*==================================
        EVENTOS FILTROS
==================================*/

document.getElementById("buscar").addEventListener("input", () => {

    paginaActual = 1;

    cargarProductos();

});

document.querySelectorAll("input[name='categoria']").forEach(radio => {

    radio.addEventListener("change", () => {

        paginaActual = 1;

        cargarProductos();

    });

});

document.getElementById("ordenar").addEventListener("change", () => {

    paginaActual = 1;

    cargarProductos();

});

document.getElementById("limpiar").addEventListener("click", () => {

    document.getElementById("buscar").value = "";

    document.querySelector(
        "input[name='categoria'][value='Todos']"
    ).checked = true;

    document.getElementById("ordenar").value = "";

    paginaActual = 1;

    cargarProductos();

});

/*==================================
        INICIO
==================================*/

cargarProductos();