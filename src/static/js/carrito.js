document.addEventListener("DOMContentLoaded", () => {
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// MOSTRAR
function mostrarCarrito() {

    let contenedor = document.getElementById("carrito");

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {

        if(!item.cantidad){
            item.cantidad = 1;
        }

        let subtotal = item.precio * item.cantidad;

        total += subtotal;

        contenedor.innerHTML += `

        <div class="producto">

            <div class="imagen">
                <img src="${item.imagen}">
            </div>

            <div class="info">

                <div class="info-top">

                    <div>

                        <h3 class="nombre">${item.nombre}</h3>

                        <p class="descripcion">
                            ${item.descripcion}
                        </p>

                        <p class="talla">
                            <strong>Talla:</strong>
                            ${item.talla ? item.talla : "Sin talla"}
                        </p>

                    </div>

                    <button class="eliminar"
                    onclick="eliminar(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

                <div class="info-bottom">

                    <div class="precios">

                        <p class="precio">
                            Precio: ${formatear(item.precio)}
                        </p>

                        <p class="sub">
                            Subtotal: ${formatear(subtotal)}
                        </p>

                    </div>

                    <div class="cantidad">

                        <button onclick="cambiarCantidad(${index}, -1)">
                            -
                        </button>

                        <span>${item.cantidad}</span>

                        <button onclick="cambiarCantidad(${index}, 1)">
                            +
                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

    document.getElementById("total").innerText = formatear(total);

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// CAMBIAR CANTIDAD
function cambiarCantidad(index, valor) {

    carrito[index].cantidad += valor;

    if (carrito[index].cantidad < 1) {
        carrito.splice(index, 1);
    }

    mostrarCarrito();
}

// ELIMINAR
function eliminar(index) {

    carrito.splice(index, 1);

    mostrarCarrito();
}

// FORMATO
function formatear(valor) {

    return "$ " + Number(valor).toLocaleString('es-CO');
}

// INICIAR
mostrarCarrito();

// IR A PAGO
function irAPago(){

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if(carrito.length === 0){

        alert("Tu carrito está vacío");

        return;
    }

    window.location.href = "/pago";
}
