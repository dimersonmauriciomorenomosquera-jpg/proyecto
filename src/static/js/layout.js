
                function toggleMenu(){
                const menu = document.getElementById("menu");
                menu.style.display = menu.style.display === "block" ? "none" : "block";
                }
        
                function toggleUser(){
                const menu = document.getElementById("ingreso");
                menu.style.display = menu.style.display === "block" ? "none" : "block";
                }

        
document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.getElementById("buscador");
    const productos = document.querySelectorAll(".card");

    if(buscador){

        buscador.addEventListener("keyup", () => {

            let texto = buscador.value.toLowerCase();

            productos.forEach(producto => {

                let contenido = producto.innerText.toLowerCase();

                if(contenido.includes(texto)) {
                    producto.style.display = "block";
                } else {
                    producto.style.display = "none";
                }

            });

        });

    }

});
