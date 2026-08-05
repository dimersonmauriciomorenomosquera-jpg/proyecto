// ==========================
// AGREGAR AL CARRITO
// ==========================

let tallaSeleccionada = null;

function agregarCarrito(nombre, precio, imagen, descripcion) {

    let carrito = JSON.parse(localStorage.getItem("carrito"));

    if (!Array.isArray(carrito)) {
        carrito = [];
    }

    let cantidad = parseInt(document.querySelector(".cantidad input").value);

    let productoExistente = carrito.find(producto =>
        producto.nombre === nombre &&
        producto.talla === tallaSeleccionada
    );

    if (productoExistente) {

        productoExistente.cantidad += cantidad;

    } else {

        carrito.push({
            nombre,
            precio,
            imagen,
            descripcion,
            talla: tallaSeleccionada,
            cantidad
        });

    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");

}


// ==========================
// CARGAR TALLAS
// ==========================

function cargarTallas() {

    const contenedor = document.getElementById("tallas-container");

    if (!contenedor) return;

    let categoria = contenedor.dataset.categoria.toLowerCase().trim();

    let tallas = [];

    if (categoria === "ropa") {

        tallas = ["S", "M", "L", "XL"];

    } else if (categoria === "zapatos") {

        tallas = [35, 36, 37, 38, 39, 40, 41, 42, 43];

    } else if (categoria === "accesorios") {

        contenedor.parentElement.style.display = "none";
        return;

    }

    contenedor.innerHTML = "";

    tallas.forEach((talla, index) => {

        const boton = document.createElement("button");

        boton.textContent = talla;

        if (index === 0) {

            boton.classList.add("activo");
            tallaSeleccionada = talla;

        }

        boton.addEventListener("click", () => {

            document.querySelectorAll("#tallas-container button").forEach(btn => {
                btn.classList.remove("activo");
            });

            boton.classList.add("activo");

            tallaSeleccionada = talla;

        });

        contenedor.appendChild(boton);

    });

}


// ==========================
// GALERÍA
// ==========================

const miniaturas = document.querySelectorAll(".miniaturas img");
const imagenPrincipal = document.querySelector(".imagen-principal img");

miniaturas.forEach(img => {

    img.addEventListener("click", () => {

        imagenPrincipal.src = img.src;

        miniaturas.forEach(i => i.classList.remove("activa"));

        img.classList.add("activa");

    });

});


// ==========================
// COLORES
// ==========================

const colores = document.querySelectorAll(".color");

colores.forEach(color => {

    color.addEventListener("click", () => {

        colores.forEach(c => c.classList.remove("activo"));

        color.classList.add("activo");

    });

});


// ==========================
// CANTIDAD
// ==========================

const menos = document.querySelector(".cantidad button:first-child");
const mas = document.querySelector(".cantidad button:last-child");
const cantidad = document.querySelector(".cantidad input");

menos.addEventListener("click", () => {

    if (cantidad.value > 1) {

        cantidad.value--;

    }

});

mas.addEventListener("click", () => {

    cantidad.value++;

});


// ==========================
// INICIO
// ==========================

window.addEventListener("load", () => {

    cargarTallas();

});

/*==================================
    AGREGAR AL CARRITO
==================================*/
/*==================================
    AGREGAR AL CARRITO
==================================*/

const btnAgregarCarrito = document.getElementById("btn-agregar-carrito");

btnAgregarCarrito.addEventListener("click", agregarAlCarrito);

async function agregarAlCarrito() {

    // Verificar si el usuario inició sesión
    const token = localStorage.getItem("token");

    if (!token) {

        alert("Debes iniciar sesión para agregar productos al carrito.");

        window.location.href = "/login";

        return;

    }

    // Obtener datos del producto
    const detalle = document.querySelector(".detalle-producto");

    const idProducto = Number(detalle.dataset.id);

    const cantidad = Number(document.getElementById("cantidad").value);

    const categoria = detalle.dataset.categoria.toLowerCase().trim();

    let talla = null;

    // Solo ropa y zapatos necesitan talla
    if (categoria === "ropa" || categoria === "zapatos") {

        const tallaSeleccionada = document.querySelector(".tallas button.activo");

        if (!tallaSeleccionada) {

            alert("Selecciona una talla.");

            return;

        }

        talla = tallaSeleccionada.textContent.trim();

    }

    // Validar cantidad
    if (cantidad <= 0) {

        alert("La cantidad debe ser mayor que cero.");

        return;

    }

    // Datos que espera el backend
    const datos = {

        id_producto: idProducto,

        cantidad: cantidad,

        talla: talla

    };

    try {

        const respuesta = await fetch(
            "http://127.0.0.1:5000/detalle_carrito/",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify(datos)

            }
        );

        const resultado = await respuesta.json();

        if (respuesta.ok) {

            alert("Producto agregado al carrito correctamente.");

        } else {

            alert(resultado.message);

        }

    } catch (error) {

        console.error(error);

        alert("Error al conectar con el servidor.");

    }

}