/*==========================================
        MODALES ENVÍOS
==========================================*/
console.log("hola")
const modalVer = document.getElementById("modalVerEnvio");
const modalRuta = document.getElementById("modalRuta");


/*==========================================
        ABRIR MODAL VER
==========================================*/

document.querySelectorAll(".ver").forEach(boton=>{

    boton.addEventListener("click",()=>{

        modalVer.classList.add("activo");

    });

});


/*==========================================
        ABRIR MODAL RUTA
==========================================*/

document.querySelectorAll(".ruta").forEach(boton=>{

    boton.addEventListener("click",()=>{

        modalRuta.classList.add("activo");

    });

});


/*==========================================
        CERRAR TODOS LOS MODALES
==========================================*/

function cerrarTodos(){

    modalVer.classList.remove("activo");

    modalRuta.classList.remove("activo");

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