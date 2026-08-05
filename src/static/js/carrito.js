let carrito = [];

const URL_API = "http://127.0.0.1:5000/detalle_carrito/";


// ==================================
// CARGAR CARRITO DESDE BACKEND
// ==================================

async function cargarCarrito() {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Debe iniciar sesión.");

        window.location.href = "/login";

        return;

    }

    try {

        const respuesta = await fetch(URL_API, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        if (!respuesta.ok) {

            throw new Error("Error al obtener el carrito");

        }

        carrito = await respuesta.json();

        mostrarCarrito();

    } catch (error) {

        console.error(error);

        alert("No se pudo cargar el carrito");

    }

}


// ==================================
// MOSTRAR CARRITO
// ==================================

function mostrarCarrito() {

    const contenedor = document.getElementById("carrito");

    contenedor.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <h2>Tu carrito está vacío</h2>

        `;

        document.getElementById("total").innerText = "$0";

        return;

    }

    carrito.forEach((item) => {

        let subtotal = item.precio_unitario * item.cantidad;

        total += subtotal;

        contenedor.innerHTML += `

        <div class="producto">

            <div class="imagen">

                <img
                    src="${item.imagen || ''}"
                    alt="${item.nombre || ''}">

            </div>

            <div class="info">

                <div class="info-top">

                    <div>

                        <h3 class="nombre">

                            ${item.nombre || "Sin nombre"}

                        </h3>

                        <p class="descripcion">

                            ${item.descripcion || ""}

                        </p>

                        ${item.talla ? `

                        <p class="talla">

                            <strong>Talla:</strong>

                            ${item.talla}

                        </p>

                        ` : ""}

                    </div>

                    <button
                        class="eliminar"
                        onclick="eliminarProducto(${item.id_detalle_carrito})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

                <div class="info-bottom">

                    <div class="precios">

                        <p class="precio">

                            Precio:
                            ${formatear(item.precio_unitario)}

                        </p>

                        <p class="sub">

                            Subtotal:
                            ${formatear(subtotal)}

                        </p>

                    </div>

                    <div class="cantidad">

                        <button onclick="actualizarCantidad(${item.id_detalle_carrito}, ${item.cantidad - 1})">

                            -

                        </button>

                        <span>

                            ${item.cantidad}

                        </span>

                        <button onclick="actualizarCantidad(${item.id_detalle_carrito}, ${item.cantidad + 1})">

                            +

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("total").innerText = formatear(total);

}


// ==================================
// ACTUALIZAR CANTIDAD
// ==================================

async function actualizarCantidad(id, cantidad) {

    if (cantidad < 1) {

        eliminarProducto(id);

        return;

    }

    const token = localStorage.getItem("token");

    try {

        const respuesta = await fetch(`${URL_API}${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                cantidad: cantidad

            })

        });

        if (!respuesta.ok) {

            const error = await respuesta.json();

            alert(error.message);

            return;

        }

        cargarCarrito();

    } catch (error) {

        console.error(error);

    }

}


// ==================================
// ELIMINAR PRODUCTO
// ==================================

async function eliminarProducto(id) {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    try {

        const respuesta = await fetch(`${URL_API}${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        if (!respuesta.ok) {

            throw new Error("No se pudo eliminar");

        }

        cargarCarrito();

    } catch (error) {

        console.error(error);

    }

}


// ==================================
// FORMATO MONEDA
// ==================================

function formatear(valor) {

    return "$ " + Number(valor).toLocaleString("es-CO");

}


// ==================================
// IR A PAGO
// ==================================

function irAPago() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío");

        return;

    }

    window.location.href = "/pago";

}


// ==================================
// INICIO
// ==================================

document.addEventListener("DOMContentLoaded", () => {

    cargarCarrito();

});