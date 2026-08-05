
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

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        alert("Sesión cerrada correctamente.");

        window.location.href = "/";

    });

}

// ======================================
// MOSTRAR U OCULTAR OPCIONES DEL MENÚ
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    const menuLogin = document.getElementById("menuLogin");
    const menuRegistro = document.getElementById("menuRegistro");
    const menuInformacion = document.getElementById("menuInformacion");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (token) {

        // Usuario autenticado
        menuLogin.style.display = "none";
        menuRegistro.style.display = "none";

        menuInformacion.style.display = "block";
        btnCerrarSesion.style.display = "block";

    } else {

        // Usuario no autenticado
        menuLogin.style.display = "block";
        menuRegistro.style.display = "block";

        menuInformacion.style.display = "none";
        btnCerrarSesion.style.display = "none";

    }

    // Cerrar sesión
    btnCerrarSesion.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/";

    });

});
