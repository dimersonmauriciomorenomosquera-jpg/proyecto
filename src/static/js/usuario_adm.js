/*==========================================
            MODALES USUARIOS
==========================================*/

console.log("JS cargado");

const modalAgregar = document.getElementById("modalAgregarUsuario");
const modalEditar = document.getElementById("modalEditarUsuario");
const modalVer = document.getElementById("modalVerUsuario");
const modalEliminar = document.getElementById("modalEliminarUsuario");


/*==========================================
        ABRIR MODAL NUEVO USUARIO
==========================================*/

const btnNuevo = document.querySelector(".nuevo");

if(btnNuevo && modalAgregar){

    btnNuevo.addEventListener("click",()=>{

        modalAgregar.classList.add("activo");

    });

}


/*==========================================
        ABRIR MODAL EDITAR
==========================================*/

if(modalEditar){

    document.querySelectorAll(".editar").forEach(boton=>{

        boton.addEventListener("click",()=>{

            modalEditar.classList.add("activo");

        });

    });

}


/*==========================================
        ABRIR MODAL VER
==========================================*/

if(modalVer){

    document.querySelectorAll(".ver").forEach(boton=>{

        boton.addEventListener("click",()=>{

            modalVer.classList.add("activo");

        });

    });

}


/*==========================================
        ABRIR MODAL ELIMINAR
==========================================*/

if(modalEliminar){

    document.querySelectorAll(".eliminar").forEach(boton=>{

        boton.addEventListener("click",()=>{

            modalEliminar.classList.add("activo");

        });

    });

}


/*==========================================
        CERRAR TODOS LOS MODALES
==========================================*/

function cerrarTodos(){

    if(modalAgregar)
        modalAgregar.classList.remove("activo");

    if(modalEditar)
        modalEditar.classList.remove("activo");

    if(modalVer)
        modalVer.classList.remove("activo");

    if(modalEliminar)
        modalEliminar.classList.remove("activo");

}


/*==========================================
        BOTONES CERRAR
==========================================*/

document.querySelectorAll(".cerrar, .cerrar-modal").forEach(boton=>{

    boton.addEventListener("click",cerrarTodos);

});


/*==========================================
        CERRAR AL DAR CLICK AFUERA
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

function preview(input,imagen){

    if(!input || !imagen) return;

    input.addEventListener("change",()=>{

        if(input.files.length>0){

            imagen.src=URL.createObjectURL(input.files[0]);

        }

    });

}

preview(

document.querySelector("#modalAgregarUsuario input[type=file]"),

document.getElementById("previewUsuario")

);

preview(

document.querySelector("#modalEditarUsuario input[type=file]"),

document.getElementById("previewEditarUsuario")

);


/*==========================================
        GUARDAR USUARIO
==========================================*/

const guardarUsuario=document.getElementById("guardarUsuario");

if(guardarUsuario){

    guardarUsuario.addEventListener("click",(e)=>{

        e.preventDefault();

        alert("Usuario guardado correctamente.");

        cerrarTodos();

    });

}


/*==========================================
        GUARDAR CAMBIOS
==========================================*/

const guardarCambios=document.getElementById("guardarCambiosUsuario");

if(guardarCambios){

    guardarCambios.addEventListener("click",(e)=>{

        e.preventDefault();

        alert("Cambios guardados correctamente.");

        cerrarTodos();

    });

}


/*==========================================
        ELIMINAR USUARIO
==========================================*/

const eliminarUsuario=document.getElementById("eliminarUsuario");

if(eliminarUsuario){

    eliminarUsuario.addEventListener("click",()=>{

        alert("Usuario eliminado correctamente.");

        cerrarTodos();

    });

}