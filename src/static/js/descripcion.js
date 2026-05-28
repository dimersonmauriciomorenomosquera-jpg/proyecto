//funcion agregar al carrito//

function agregarCarrito(nombre, precio, imagen, descripcion, talla){

    let carrito = JSON.parse(localStorage.getItem("carrito"));

    if(!Array.isArray(carrito)){
        carrito = [];
    }

    let cantidad = parseInt(
        document.querySelector(".cantidad").innerText
    );

    let productoExistente = carrito.find(producto => 
        producto.nombre === nombre &&
        producto.talla === talla
    );

    if(productoExistente){

        productoExistente.cantidad += cantidad;

    } else {

        carrito.push({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            descripcion: descripcion,
            talla: talla,
            cantidad: cantidad
        });

    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");

}


//funcion de cantidad//

function cambiarCantidad(boton, valor){

    let producto = boton.parentElement;

    let cantidadElemento = producto.querySelector(".cantidad");

    let cantidad = parseInt(cantidadElemento.innerText);

    cantidad += valor;

    if(cantidad < 1){
        cantidad = 1;
    }

    cantidadElemento.innerText = cantidad;

}





let tallaSeleccionada = null;



function cargarTallas(){

    const contenedor = document.getElementById("tallas-container");

    let categoria = contenedor.dataset.categoria.trim();

    let tallas = [];

    // 👟 ZAPATOS
if(categoria.includes("zapatos")){
    tallas = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
}

// 👕 ROPA
else if(categoria.includes("ropa")){
    tallas = ["S", "M", "L", "XL"];
}

// 💍 ACCESORIOS
else if(categoria.includes("accesorios")){
    contenedor.innerHTML = "";
    tallaSeleccionada = "sin talla";
    return;
}
    // 🧨 SI NO HAY CATEGORÍA
    if(tallas.length === 0){
        tallas = ["S", "M", "L","XL"];
    }

    contenedor.innerHTML = "";

    tallas.forEach((talla, index) => {

        let btn = document.createElement("button");
        btn.innerText = talla;

        if(index === 0){
            btn.classList.add("active");
            tallaSeleccionada = talla;
        }

        btn.onclick = function(){

            document.querySelectorAll(".tallas button").forEach(b => {
                b.classList.remove("active");
            });

            btn.classList.add("active");
            tallaSeleccionada = talla;
        };

        contenedor.appendChild(btn);
    });
}


let estrellasSeleccionadas = 0;

const estrellas = document.querySelectorAll(".estrella");

estrellas.forEach(estrella => {

    estrella.addEventListener("click", () => {

        estrellasSeleccionadas = estrella.dataset.valor;

        estrellas.forEach(e => {

            if(e.dataset.valor <= estrellasSeleccionadas){
                e.innerText = "★";
            } else {
                e.innerText = "☆";
            }

        });

    });

});


function enviarOpinion(producto){

    if(estrellasSeleccionadas == 0){
        alert("Selecciona estrellas");
        return;
    }

    let opiniones = JSON.parse(localStorage.getItem("opiniones"));

    if(typeof opiniones !== "object" || opiniones === null){
        opiniones = {};
    }

    if(!Array.isArray(opiniones[producto])){
        opiniones[producto] = [];
    }

    let yaOpino = opiniones[producto].find(
        opinion => opinion.usuario === "usuario1"
    );

    if(yaOpino){
        alert("Ya enviaste una opinión para este producto");
        return;
    }

    opiniones[producto].push({
        usuario: "usuario1",
        estrellas: Number(estrellasSeleccionadas)
    });

    localStorage.setItem("opiniones", JSON.stringify(opiniones));

    alert("Opinión guardada");
}
window.addEventListener("load", function(){
    cargarTallas();
    cargarOpiniones()
});
