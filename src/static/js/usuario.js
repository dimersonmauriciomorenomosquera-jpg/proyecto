/*==================================================
                REFERENCIAS
==================================================*/

const overlay = document.getElementById("overlay");

const botonesModal = document.querySelectorAll("[data-modal]");

const botonesCerrar = document.querySelectorAll("[data-close]");

const modales = document.querySelectorAll(".modal");


/*==================================================
                ABRIR MODAL
==================================================*/

function abrirModal(idModal){

    const modal = document.getElementById(idModal);

    if(!modal) return;

    overlay.classList.add("active");

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/*==================================================
                CERRAR MODAL
==================================================*/

function cerrarModal(modal){

    modal.classList.remove("active");

    if(document.querySelectorAll(".modal.active").length === 0){

        overlay.classList.remove("active");

        document.body.style.overflow = "auto";

    }

}


/*==================================================
            CERRAR TODOS
==================================================*/

function cerrarTodos(){

    modales.forEach(modal=>{

        modal.classList.remove("active");

    });

    overlay.classList.remove("active");

    document.body.style.overflow="auto";

}


/*==================================================
            ABRIR MODALES
==================================================*/

botonesModal.forEach(boton=>{

    boton.addEventListener("click",()=>{

        abrirModal(boton.dataset.modal);

    });

});


/*==================================================
            CERRAR MODALES
==================================================*/

botonesCerrar.forEach(boton=>{

    boton.addEventListener("click",()=>{

        const modal = boton.closest(".modal");

        cerrarModal(modal);

    });

});


/*==================================================
            CLICK EN OVERLAY
==================================================*/

overlay.addEventListener("click",()=>{

    cerrarTodos();

});


/*==================================================
            TECLA ESC
==================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarTodos();

    }

});


/*==================================================
        EVITAR PROPAGACIÓN
==================================================*/

modales.forEach(modal=>{

    modal.querySelector(".modal-contenido")
    .addEventListener("click",(e)=>{

        e.stopPropagation();

    });

});


/*==================================================
            ANIMACIÓN TARJETAS
==================================================*/

const cards = document.querySelectorAll(".card");

cards.forEach((card,index)=>{

    card.animate(

        [

            {

                opacity:0,

                transform:"translateY(25px)"

            },

            {

                opacity:1,

                transform:"translateY(0px)"

            }

        ],

        {

            duration:500,

            delay:index*120,

            fill:"forwards"

        }

    );

});

/*==================================================
        FORMULARIO EDITAR INFORMACIÓN
==================================================*/

const formEditar = document.getElementById("formEditarUsuario");

if(formEditar){

    formEditar.addEventListener("submit",(e)=>{

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();

        const correo = document.getElementById("correo").value.trim();

        const telefono = document.getElementById("telefono").value.trim();

        const direccion = document.getElementById("direccion").value.trim();

        const fecha = document.getElementById("fecha").value;

        if(
            nombre === "" ||
            correo === "" ||
            telefono === "" ||
            direccion === ""
        ){

            alert("Todos los campos son obligatorios.");

            return;

        }

        console.log({

            nombre,
            correo,
            telefono,
            direccion,
            fecha

        });

        alert("Información validada correctamente.");

        cerrarTodos();

    });

}


/*==================================================
        FORMULARIO CAMBIAR CONTRASEÑA
==================================================*/

const formPassword = document.getElementById("formPassword");

if(formPassword){

    formPassword.addEventListener("submit",(e)=>{

        e.preventDefault();

        const actual = document
        .getElementById("passwordActual")
        .value;

        const nueva = document
        .getElementById("passwordNueva")
        .value;

        const confirmar = document
        .getElementById("confirmarPassword")
        .value;


        if(

            actual === "" ||

            nueva === "" ||

            confirmar === ""

        ){

            alert("Debes completar todos los campos.");

            return;

        }


        if(nueva.length < 8){

            alert("La contraseña debe tener mínimo 8 caracteres.");

            return;

        }


        if(nueva !== confirmar){

            alert("Las contraseñas no coinciden.");

            return;

        }


        console.log({

            actual,

            nueva

        });


        alert("Contraseña validada correctamente.");

        formPassword.reset();

        cerrarTodos();

    });

}


/*==================================================
            TABLA PEDIDOS
==================================================*/

const tablaPedidos = document.querySelector("table");

if(tablaPedidos){

    const filas = tablaPedidos.querySelectorAll("tbody tr");

    filas.forEach((fila)=>{

        fila.addEventListener("mouseenter",()=>{

            fila.style.cursor="pointer";

        });

    });

}


/*==================================================
        LIMPIAR FORMULARIOS
==================================================*/

function limpiarFormularios(){

    if(formPassword){

        formPassword.reset();

    }

}

overlay.addEventListener("click",limpiarFormularios);

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        limpiarFormularios();

    }

});