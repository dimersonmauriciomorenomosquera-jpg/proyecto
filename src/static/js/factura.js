
function abrirModalEnvio(){

    document.getElementById("modalEnvio").style.display="flex";

}

function cerrarModalEnvio(){

    document.getElementById("modalEnvio").style.display="none";

}

window.onclick=function(event){

    const modal=document.getElementById("modalEnvio");

    if(event.target===modal){

        modal.style.display="none";

    }

}

