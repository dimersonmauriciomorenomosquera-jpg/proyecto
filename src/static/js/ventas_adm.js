/*==================================
        MODAL VER VENTA
===================================*/
console.log("ma")
const modalVerVenta = document.getElementById("modalVerVenta");


/*==================================
        ABRIR MODAL
===================================*/

document.querySelectorAll(".ver").forEach(boton=>{

    boton.addEventListener("click",()=>{

        modalVerVenta.classList.add("activo");

    });

});


/*==================================
        CERRAR MODAL
===================================*/

function cerrarModalVenta(){

    modalVerVenta.classList.remove("activo");

}


document.querySelectorAll("#modalVerVenta .cerrar, #modalVerVenta .cerrar-modal").forEach(boton=>{

    boton.addEventListener("click",cerrarModalVenta);

});


/*==================================
        CLICK FUERA
===================================*/

modalVerVenta.addEventListener("click",(e)=>{

    if(e.target===modalVerVenta){

        cerrarModalVenta();

    }

});


/*==================================
        TECLA ESC
===================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarModalVenta();

    }

});
