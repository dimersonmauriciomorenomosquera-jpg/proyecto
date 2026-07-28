//==============================
// ABRIR MODALES
//==============================

const abrirPerfil=document.getElementById("abrirPerfil");
const abrirPassword=document.getElementById("abrirPassword");
const abrirPago=document.getElementById("abrirPago");

const modalPerfil=document.getElementById("modalPerfil");
const modalPassword=document.getElementById("modalPassword");
const modalPago=document.getElementById("modalPago");

abrirPerfil.addEventListener("click",()=>{

    modalPerfil.classList.add("activo");

});

abrirPassword.addEventListener("click",()=>{

    modalPassword.classList.add("activo");

});

abrirPago.addEventListener("click",()=>{

    modalPago.classList.add("activo");

});

//==============================
// CERRAR
//==============================

document.querySelectorAll(".cerrar-modal").forEach(btn=>{

    btn.onclick=()=>{

        btn.closest(".modal").classList.remove("activo");

    }

});

document.querySelectorAll(".cerrar").forEach(btn=>{

    btn.onclick=()=>{

        btn.closest(".modal").classList.remove("activo");

    }

});

//==============================
// CLICK FUERA
//==============================

document.querySelectorAll(".modal").forEach(modal=>{

    modal.onclick=(e)=>{

        if(e.target===modal){

            modal.classList.remove("activo");

        }

    }

});

//==============================
// ESC
//==============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        document.querySelectorAll(".modal").forEach(modal=>{

            modal.classList.remove("activo");

        });

    }

});