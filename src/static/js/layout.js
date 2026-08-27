// ======================================
// MENÚ PRINCIPAL
// ======================================

function toggleMenu() {
    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";
}


// ======================================
// MENÚ DE USUARIO
// ======================================

function toggleUser() {
    const menu = document.getElementById("ingreso");

    if (!menu) return;

    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";
}


// ======================================
// BUSCADOR DE PRODUCTOS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.getElementById("buscador");
    const productos = document.querySelectorAll(".card");

    if (buscador) {

        buscador.addEventListener("keyup", () => {

            const texto = buscador.value.toLowerCase();

            productos.forEach(producto => {

                const contenido = producto.innerText.toLowerCase();

                if (contenido.includes(texto)) {
                    producto.style.display = "block";
                } else {
                    producto.style.display = "none";
                }

            });

        });

    }

});


// ======================================
// MOSTRAR / OCULTAR OPCIONES DEL MENÚ
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const menuLogin = document.getElementById("menuLogin");
    const menuRegistro = document.getElementById("menuRegistro");
    const menuInformacion = document.getElementById("menuInformacion");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    /*
     * IMPORTANTE:
     *
     * La autenticación real está en Flask:
     *
     * session["api_token"]
     *
     * Por eso NO usamos:
     *
     * localStorage.getItem("token")
     *
     * para decidir si el usuario está autenticado.
     */

    // --------------------------------------
    // CERRAR SESIÓN
    // --------------------------------------

    if (btnCerrarSesion) {

        btnCerrarSesion.addEventListener("click", function (e) {

            e.preventDefault();

            // Flask se encarga de eliminar:
            // session["api_token"]
            // session["id_cliente"]
            // session["usuario"]

            window.location.href = "auth/logout";

        });

    }

});