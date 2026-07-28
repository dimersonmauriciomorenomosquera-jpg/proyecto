/*==========================
    ANIMACIÓN DE ENTRADA
==========================*/

const elementos=document.querySelectorAll(

".card-producto,.producto,.categoria,.look-card,.best-card,.editorial-card"

);

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("mostrar");

}

});

},{threshold:.15});

elementos.forEach(el=>observer.observe(el));


/*==========================
        BOTONES
==========================*/

document.querySelectorAll("button").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-4px)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0px)";

});

});


/*==========================
    NEWSLETTER
==========================*/

const boton=document.querySelector(".newsletter button");

boton.addEventListener("click",()=>{

const correo=document.querySelector(".newsletter input");

if(correo.value===""){

alert("Ingresa un correo electrónico.");

return;

}

alert(

"Gracias por suscribirte a Serenity Mode."

);

correo.value="";

});


/*==========================
    HEADER
==========================*/

window.addEventListener("scroll",()=>{

const header=document.querySelector(".header");

if(window.scrollY>80){

header.classList.add("header-scroll");

}else{

header.classList.remove("header-scroll");

}

});