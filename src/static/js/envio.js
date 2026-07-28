function abrirModal(tipo, empresa, precio){

    const modal = document.getElementById("modalEnvio");

    modal.style.display = "flex";

    document.getElementById("tipoEnvio").textContent = tipo;

    document.getElementById("empresaEnvio").textContent = empresa;

    document.getElementById("precioEnvio").textContent = precio;

}

function cerrarModal(){

    document.getElementById("modalEnvio").style.display = "none";

}

// Cerrar haciendo clic fuera del modal

window.onclick = function(event){

    const modal = document.getElementById("modalEnvio");

    if(event.target == modal){

        modal.style.display = "none";

    }

}
