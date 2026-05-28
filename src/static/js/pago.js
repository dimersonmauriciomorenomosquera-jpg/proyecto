
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarResumen() {

    let contenedor = document.querySelector(".summary");

    let subtotal = 0;

    let html = `<h2>RESUMEN DE TU PEDIDO</h2>`;

    carrito.forEach(item => {

        let totalProducto = item.precio * item.cantidad;
        subtotal += totalProducto;

        html += `
        <div class="product">

            <img src="${item.imagen}" alt="producto">

            <div class="product-info">
                <h3>${item.nombre}</h3>
                <p>Talla: ${item.talla || "Sin talla"} | Cantidad: ${item.cantidad}</p>
                <span>$ ${item.precio.toLocaleString('es-CO')}</span>
            </div>

        </div>
        `;
    });

    html += `
    <div class="totals">

    <div class="row">
        <p>Subtotal</p>
        <span>$ ${subtotal.toLocaleString('es-CO')}</span>
    </div>

    <div class="row">
        <p>Envío</p>
        <span class="gold">Gratis</span>
    </div>

    <div class="row">
        <p>Impuestos</p>
        <span>$ ${iva.toLocaleString('es-CO')}</span>
    </div>

</div>

<div class="final-total">
    <p>TOTAL</p>
    <span> ${total.toLocaleString('es-CO')}</span>
</div>
    `;

    contenedor.innerHTML = html;
}
let subtotal = 0;

carrito.forEach(item => {
    subtotal += item.precio * item.cantidad;
});

let iva = subtotal * 0.19;
let total = subtotal + iva;
window.onload = mostrarResumen;


function abrirModal(tipo){

    let modal = document.getElementById("modalPago");
    let contenido = document.getElementById("contenidoModal");

    modal.style.display = "flex";

    if(tipo === "tarjeta"){

        contenido.innerHTML = `
            <h2>Pago con tarjeta</h2>

            <input type="text" placeholder="Número de tarjeta">

            <input type="text" placeholder="Nombre del titular">

            <input type="text" placeholder="MM/AA">

            <input type="text" placeholder="CVV">

            <button onclick="confirmarPedido('Tarjeta')">
                Continuar
            </button>
        `;
    }

    if(tipo === "paypal"){

        contenido.innerHTML = `
            <h2>PayPal</h2>

            <input type="email" placeholder="Correo PayPal">

            <button onclick="confirmarPedido('PayPal')">
                Continuar
            </button>
        `;
    }

    if(tipo === "nequi"){

        contenido.innerHTML = `
            <h2>Nequi</h2>

            <input type="int" placeholder="Número celular">
            <input type="text" placeholder="Contraseña">
            <input type="text" placeholder="Clave Dinamica">

            <button  onclick="confirmarPedido('Nequi')">
                Continuar
            </button>
        `;
    }

    if(tipo === "googlepay"){

        contenido.innerHTML = `
            <h2>Google Pay</h2>

            <input type="email" placeholder="Correo Google">

            <button onclick="confirmarPedido('Google Pay')">
                Continuar
            </button>
        `;
    }
}

function cerrarModal(){
    document.getElementById("modalPago").style.display = "none";
}

function confirmarPedido(metodo){

    let productosHTML = ""; 

    carrito.forEach(item => {

        productosHTML += `
    <div class="pedido">

        <img src="${item.imagen}" 
        alt="${item.nombre}" 
        class="imagen_modulo">

        <div class="info_pedido">

            <strong>${item.nombre}</strong><br>

            Cantidad: ${item.cantidad}<br>

            Precio: $${item.precio.toLocaleString('es-CO')}<br>

            Talla: ${item.talla}

        </div>

    </div>
`;
    });

    document.getElementById("contenidoModal").innerHTML = `
        <h2>Confirmar tu pedido</h2>

        ${productosHTML}

        <hr style="margin:20px 0;">

        <p><strong>Método de pago:</strong> ${metodo}</p>

        <p class="pago"><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>

        <button onclick="finalizarCompra()">
            Confirmar y pagar
        </button>
    `;
}

function finalizarCompra(){

    alert("Pago realizado correctamente");

    localStorage.removeItem("carrito");

    window.location.href = "/";
}
