/*==========================================
            MODALES PRODUCTOS
==========================================*/

const modalAgregar = document.getElementById("modalAgregar");
const modalEditar = document.getElementById("modalEditar");
const modalVer = document.getElementById("modalVer");
const modalEliminar = document.getElementById("modalEliminar");


/*==========================================
        ABRIR MODAL AGREGAR
==========================================*/

document.querySelector(".nuevo").addEventListener("click", () => {

    modalAgregar.classList.add("activo");

});


/*==========================================
        ABRIR MODAL EDITAR
==========================================*/

document.querySelectorAll(".editar").forEach(boton => {

    boton.addEventListener("click", () => {

        modalEditar.classList.add("activo");

    });

});


/*==========================================
        ABRIR MODAL VER
==========================================*/

document.querySelectorAll(".ver").forEach(boton => {

    boton.addEventListener("click", () => {

        modalVer.classList.add("activo");

    });

});


/*==========================================
        ABRIR MODAL ELIMINAR
==========================================*/

document.querySelectorAll(".eliminar").forEach(boton => {

    boton.addEventListener("click", () => {

        modalEliminar.classList.add("activo");

    });

});


/*==========================================
        CERRAR MODALES
==========================================*/

const cerrarBotones = document.querySelectorAll(".cerrar, .cerrar-modal");

cerrarBotones.forEach(boton => {

    boton.addEventListener("click", () => {

        cerrarTodos();

    });

});


function cerrarTodos(){

    modalAgregar.classList.remove("activo");

    modalEditar.classList.remove("activo");

    modalVer.classList.remove("activo");

    modalEliminar.classList.remove("activo");

}


/*==========================================
    CERRAR HACIENDO CLICK AFUERA
==========================================*/

document.querySelectorAll(".modal").forEach(modal=>{

    modal.addEventListener("click",(e)=>{

        if(e.target===modal){

            modal.classList.remove("activo");

        }

    });

});


/*==========================================
        CERRAR CON ESC
==========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarTodos();

    }

});


/*==========================================
        PREVISUALIZAR IMAGEN
==========================================*/

function preview(input, imagen){

    input.addEventListener("change", ()=>{

        if(input.files.length>0){

            imagen.src=URL.createObjectURL(input.files[0]);

        }

    });

}

preview(

document.querySelector("#modalAgregar input[type=file]"),

document.getElementById("previewAgregar")

);

preview(

document.querySelector("#modalEditar input[type=file]"),

document.getElementById("previewEditar")

);

/*==========================================
        BOTONES DE ACCIÓN
==========================================*/

document.getElementById("guardarProducto").addEventListener("click", () => {

    // Aquí luego irá el fetch al backend

    cerrarTodos();

});

document.getElementById("guardarCambios").addEventListener("click", () => {

    cerrarTodos();

});

document.getElementById("eliminarProducto").addEventListener("click", () => {

    cerrarTodos();

});

document.getElementById("guardarProducto").addEventListener("click",(e)=>{

    e.preventDefault();

    cerrarTodos();

});