// ==========================================================
// CARRITO
// ==========================================================

let carrito = [];


// ==========================================================
// CARGAR CARRITO
// ==========================================================

async function cargarCarrito() {

    console.log("======================================");
    console.log("CARGANDO CARRITO");
    console.log("======================================");

    try {

        /*
         * NO llamamos directamente a:
         *
         * /detalle_carrito/
         *
         * porque esa ruta pertenece al backend.
         *
         * El frontend utiliza una ruta propia:
         *
         * /carrito/detalles
         *
         * Flask recibe la petición y consulta
         * la API con el JWT guardado en session.
         */

        const respuesta = await fetch(
            "/carrito/detalles"
        );


        // ==================================================
        // VERIFICAR RESPUESTA
        // ==================================================

        if (!respuesta.ok) {

            const texto = await respuesta.text();

            console.error(
                "RESPUESTA DEL SERVIDOR:",
                texto
            );

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }


        // ==================================================
        // CONVERTIR JSON
        // ==================================================

        const datos = await respuesta.json();


        console.log(
            "DETALLES RECIBIDOS:",
            datos
        );


        // ==================================================
        // VALIDAR ARRAY
        // ==================================================

        if (!Array.isArray(datos)) {

            console.error(
                "La respuesta no es un array:",
                datos
            );

            carrito = [];

        } else {

            carrito = datos;

        }


        // ==================================================
        // MOSTRAR
        // ==================================================

        mostrarCarrito();


    } catch (error) {

        console.error(
            "ERROR CARGANDO CARRITO:",
            error
        );


        carrito = [];


        const contenedor =
            document.getElementById("carrito");


        if (contenedor) {

            contenedor.innerHTML = `
                <h2>
                    No se pudo cargar el carrito.
                </h2>
            `;

        }


        const totalElemento =
            document.getElementById("total");


        if (totalElemento) {

            totalElemento.innerText =
                "$ 0";

        }

    }

}


// ==========================================================
// MOSTRAR CARRITO
// ==========================================================

function mostrarCarrito() {

    const contenedor =
        document.getElementById("carrito");


    if (!contenedor) {

        console.warn(
            "No existe el elemento #carrito"
        );

        return;

    }


    contenedor.innerHTML = "";


    let total = 0;


    // ======================================================
    // CARRITO VACÍO
    // ======================================================

    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <h2>
                Tu carrito está vacío
            </h2>
        `;


        actualizarTotal(0);

        return;

    }


    // ======================================================
    // MOSTRAR PRODUCTOS
    // ======================================================

    carrito.forEach((item) => {

        const cantidad =
            Number(item.cantidad) || 1;


        const precio =
            Number(item.precio_unitario) || 0;


        const subtotal =
            Number(item.subtotal) ||
            precio * cantidad;


        total += subtotal;


        const idDetalle =
            Number(item.id_detalle_carrito);


        // ==================================================
        // IMAGEN
        // ==================================================

        const imagen =
            limpiarImagen(item.imagen);


        // ==================================================
        // NOMBRE
        // ==================================================

        const nombre =
            item.nombre ||
            "Producto sin nombre";


        // ==================================================
        // DESCRIPCIÓN
        // ==================================================

        const descripcion =
            item.descripcion ||
            "";


        // ==================================================
        // TALLA
        // ==================================================

        const tallaHTML =
            item.talla
                ? `
                    <p class="talla">
                        <strong>Talla:</strong>
                        ${item.talla}
                    </p>
                  `
                : "";


        // ==================================================
        // PRODUCTO
        // ==================================================

        contenedor.innerHTML += `

            <div class="producto">

                <!-- ======================================
                     IMAGEN
                ======================================= -->

                <div class="imagen">

                    <img
                        src="${imagen}"
                        alt="${nombre}"
                    >

                </div>


                <!-- ======================================
                     INFORMACIÓN
                ======================================= -->

                <div class="info">


                    <!-- ==================================
                         PARTE SUPERIOR
                    =================================== -->

                    <div class="info-top">

                        <div>

                            <h3 class="nombre">
                                ${nombre}
                            </h3>


                            <p class="descripcion">
                                ${descripcion}
                            </p>


                            ${tallaHTML}

                        </div>


                        <!-- ==============================
                             ELIMINAR
                        =============================== -->

                        <button
                            type="button"
                            class="eliminar"
                            onclick="eliminarProducto(${idDetalle})"
                        >

                            <i
                                class="fa-solid fa-trash"
                            ></i>

                        </button>

                    </div>


                    <!-- ==================================
                         PARTE INFERIOR
                    =================================== -->

                    <div class="info-bottom">


                        <!-- ==============================
                             PRECIOS
                        =============================== -->

                        <div class="precios">

                            <p class="precio">

                                Precio:

                                ${formatear(precio)}

                            </p>


                            <p class="sub">

                                Subtotal:

                                ${formatear(subtotal)}

                            </p>

                        </div>


                        <!-- ==============================
                             CANTIDAD
                        =============================== -->

                        <div class="cantidad">


                            <button
                                type="button"
                                onclick="actualizarCantidad(
                                    ${idDetalle},
                                    ${cantidad - 1}
                                )"
                            >
                                -
                            </button>


                            <span>
                                ${cantidad}
                            </span>


                            <button
                                type="button"
                                onclick="actualizarCantidad(
                                    ${idDetalle},
                                    ${cantidad + 1}
                                )"
                            >
                                +
                            </button>


                        </div>


                    </div>


                </div>

            </div>

        `;

    });


    // ======================================================
    // TOTAL
    // ======================================================

    actualizarTotal(total);

}


// ==========================================================
// ACTUALIZAR TOTAL
// ==========================================================

function actualizarTotal(total) {

    const totalElemento =
        document.getElementById("total");


    if (!totalElemento) {
        return;
    }


    totalElemento.innerText =
        formatear(total);

}


// ==========================================================
// ACTUALIZAR CANTIDAD
// ==========================================================

async function actualizarCantidad(
    idDetalle,
    cantidad
) {

    console.log(
        "======================================"
    );

    console.log(
        "ACTUALIZANDO DETALLE"
    );

    console.log(
        "ID DETALLE:",
        idDetalle
    );

    console.log(
        "NUEVA CANTIDAD:",
        cantidad
    );


    // ==================================================
    // SI LLEGA A CERO
    // ==================================================

    if (cantidad < 1) {

        await eliminarProducto(
            idDetalle
        );

        return;

    }


    try {

        /*
         * Esta ruta pertenece al FRONTEND.
         *
         * Flask recibe la petición y después
         * llama al backend:
         *
         * PUT /detalle_carrito/<id>
         */

        const respuesta =
            await fetch(
                `/carrito/actualizar/${idDetalle}`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        `cantidad=${encodeURIComponent(cantidad)}`

                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo actualizar la cantidad."
            );

        }


        /*
         * Como Flask devuelve nuevamente
         * la página del carrito, simplemente
         * volvemos a pedir los detalles.
         */

        await cargarCarrito();


    } catch (error) {

        console.error(
            "ERROR ACTUALIZANDO CANTIDAD:",
            error
        );


        alert(
            error.message ||
            "No se pudo actualizar la cantidad."
        );

    }

}


// ==========================================================
// ELIMINAR PRODUCTO
// ==========================================================

async function eliminarProducto(
    idDetalle
) {

    console.log(
        "======================================"
    );

    console.log(
        "ELIMINANDO DETALLE:",
        idDetalle
    );


    try {

        /*
         * Esta ruta pertenece al FRONTEND.
         */

        const respuesta =
            await fetch(
                `/carrito/eliminar/${idDetalle}`,
                {

                    method: "POST"

                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo eliminar el producto."
            );

        }


        /*
         * Volvemos a consultar
         * los productos reales.
         */

        await cargarCarrito();


    } catch (error) {

        console.error(
            "ERROR ELIMINANDO PRODUCTO:",
            error
        );


        alert(
            error.message ||
            "No se pudo eliminar el producto."
        );

    }

}


// ==========================================================
// LIMPIAR IMAGEN
// ==========================================================

function limpiarImagen(imagen) {

    if (!imagen) {

        return "";

    }


    /*
     * Tu API está devolviendo algo como:
     *
     * [https://ejemplo.com/imagen.jpg](https://ejemplo.com/imagen.jpg)
     *
     * Eso NO sirve directamente para <img src="">.
     *
     * Extraemos la URL real.
     */

    const match =
        imagen.match(
            /^\[.*?\]\((.*?)\)$/
        );


    if (match) {

        return match[1];

    }


    return imagen;

}


// ==========================================================
// FORMATEAR MONEDA
// ==========================================================

function formatear(valor) {

    const numero =
        Number(valor) || 0;


    return "$ " +
        numero.toLocaleString(
            "es-CO"
        );

}


// ==========================================================
// IR A PAGO
// ==========================================================

function irAPago() {

    if (carrito.length === 0) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    window.location.href =
        "/pago";

}


// ==========================================================
// INICIO
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "======================================"
        );

        console.log(
            "CARRITO.JS CARGADO"
        );

        console.log(
            "======================================"
        );


        cargarCarrito();

    }
);