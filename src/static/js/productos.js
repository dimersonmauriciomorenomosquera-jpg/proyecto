

function cargarOpiniones(producto){

    let opiniones = JSON.parse(localStorage.getItem("opiniones")) || {};

    let lista = opiniones[producto] || [];

    let total = 0;

    lista.forEach(opinion => {
        total += opinion.estrellas;
    });

    let promedio = 0;

    if(lista.length > 0){
        promedio = Math.round(total / lista.length);
    }

    let estrellas = "";

    for(let i = 1; i <= 5; i++){

        if(i <= promedio){
            estrellas += "★";
        } else {
            estrellas += "☆";
        }

    }

    let estrellasElemento = document.getElementById("estrellas-" + producto);
    let cantidadElemento = document.getElementById("cantidad-" + producto);

    if(estrellasElemento && cantidadElemento){

        estrellasElemento.innerText = estrellas;

        cantidadElemento.innerText =
            "(" + lista.length + " opiniones)";
    }
}





                function toggleUser(){
                const menu = document.getElementById("usuario");
                menu.style.display = menu.style.display === "block" ? "none" : "block";
                }
                function togglehome(){
                const menu = document.getElementById("home");
                menu.style.display = menu.style.display === "block" ? "none" : "block";
                }

        
    



function filtrarProductos(categoria){

    let productos = document.querySelectorAll(".card");

    productos.forEach(producto => {

        let categorias = producto.dataset.categoria.split(" ");

        if(categoria === "todos"){

            producto.style.display = "block";

        } else if(categorias.includes(categoria)){

            producto.style.display = "block";

        } else {

            producto.style.display = "none";
        }

    });

}



window.onload = function(){

    cargarOpiniones("saco-dama");
    cargarOpiniones("reloj-hombre");
    cargarOpiniones("cadena-cubana");
    cargarOpiniones("force-one");
    cargarOpiniones("new-balance");
    cargarOpiniones("north-face");
    cargarOpiniones("vestido-corto");
    cargarOpiniones("levis-basica");
    cargarOpiniones("manga-larga");
    cargarOpiniones("manga-corta");
    cargarOpiniones("zapatillas");
    cargarOpiniones("zapatillas-plataforma");
    cargarOpiniones("arretes-esmeralda");
    cargarOpiniones("arretes-dorados");
    cargarOpiniones("arretes-hombre");
    cargarOpiniones("anillos");
    cargarOpiniones("blusa-escotada");
    cargarOpiniones("baggy-hombre");
    cargarOpiniones("cargo-negro");
    cargarOpiniones("cargo-gris");
    cargarOpiniones("polo-negra");
    cargarOpiniones("pantalon-clasico");
    cargarOpiniones("zamba");
    cargarOpiniones("botas");

}




function verDescripcion(producto){
    window.location.href = "/descripcion/" + producto;
}

