/*==================================
        MODAL RECUPERAR
===================================*/

const modalRecuperar = document.getElementById("modalRecuperar");
const abrirRecuperar = document.getElementById("abrirRecuperar");
const cerrarRecuperar = document.querySelector(".cerrar-modal");


/*==================================
        ABRIR MODAL
===================================*/

abrirRecuperar.addEventListener("click", function(e){

    e.preventDefault();

    modalRecuperar.classList.add("activo");

});


/*==================================
        CERRAR MODAL
===================================*/

function cerrarModal(){

    modalRecuperar.classList.remove("activo");

}


cerrarRecuperar.addEventListener("click", cerrarModal);


/*==================================
        CERRAR AL HACER CLICK FUERA
===================================*/

modalRecuperar.addEventListener("click", function(e){

    if(e.target === modalRecuperar){

        cerrarModal();

    }

});


/*==================================
        CERRAR CON ESC
===================================*/

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        cerrarModal();

    }

});