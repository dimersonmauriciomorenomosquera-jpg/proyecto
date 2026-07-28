/*==================================
        FAVORITOS
==================================*/

document.querySelectorAll(".favorito").forEach(boton=>{

    boton.addEventListener("click",()=>{

        boton.classList.toggle("activo");

        const icono=boton.querySelector("i");

        if(boton.classList.contains("activo")){

            icono.classList.remove("fa-regular");
            icono.classList.add("fa-solid");

        }else{

            icono.classList.remove("fa-solid");
            icono.classList.add("fa-regular");

        }

    });

});


/*==================================
        TALLAS
==================================*/

document.querySelectorAll(".tallas button").forEach(boton=>{

    boton.addEventListener("click",()=>{

        document.querySelectorAll(".tallas button").forEach(btn=>{

            btn.classList.remove("seleccionado");

        });

        boton.classList.add("seleccionado");

    });

});


/*==================================
        COLORES
==================================*/

document.querySelectorAll(".colores span").forEach(color=>{

    color.addEventListener("click",()=>{

        document.querySelectorAll(".colores span").forEach(c=>{

            c.classList.remove("activo");

        });

        color.classList.add("activo");

    });

});


/*==================================
        BOTÓN PRODUCTO
==================================*/

document.querySelectorAll(".btn-comprar").forEach(boton=>{

    boton.addEventListener("mouseenter",()=>{

        boton.innerHTML='<i class="fa-solid fa-bag-shopping"></i> Ver producto';

    });

    boton.addEventListener("mouseleave",()=>{

        boton.innerHTML="Ver producto";

    });

});