// ==========================================================
// VARIABLE GLOBAL
// ==========================================================

let tallaSeleccionada = null;


// ==========================================================
// INICIALIZAR TODO
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("======================================");
    console.log("DESCRIPCIÓN DEL PRODUCTO CARGADA");
    console.log("======================================");

    cargarTallas();
    inicializarGaleria();
    inicializarColores();
    inicializarCantidad();
    inicializarCarrito();

});


// ==========================================================
// CARGAR TALLAS
// ==========================================================

function cargarTallas() {

    const contenedor =
        document.getElementById("tallas-container");

    const contenedorPadre =
        document.getElementById("opcion-tallas");


    // ------------------------------------------------------
    // VERIFICAR ELEMENTOS
    // ------------------------------------------------------

    if (!contenedor) {

        console.error(
            "ERROR: No existe #tallas-container"
        );

        return;
    }


    // ------------------------------------------------------
    // OBTENER CATEGORÍA
    // ------------------------------------------------------

    let categoria =
        contenedor.dataset.categoria || "";

    categoria =
        categoria
            .toLowerCase()
            .trim();


    console.log(
        "CATEGORÍA DEL PRODUCTO:",
        categoria
    );


    // ------------------------------------------------------
    // ACCESORIOS
    // ------------------------------------------------------

    if (
        categoria === "accesorio" ||
        categoria === "accesorios"
    ) {

        tallaSeleccionada = null;

        contenedor.innerHTML = "";


        if (contenedorPadre) {

            contenedorPadre.style.display =
                "none";

        }


        console.log(
            "ACCESORIO: no necesita talla."
        );

        return;
    }


    // ------------------------------------------------------
    // ROPA
    // ------------------------------------------------------

    let tallas = [];


    if (
        categoria === "ropa" ||
        categoria === "ropas"
    ) {

        tallas = [
            "S",
            "M",
            "L",
            "XL"
        ];

    }


    // ------------------------------------------------------
    // ZAPATOS
    // ------------------------------------------------------

    else if (
        categoria === "zapato" ||
        categoria === "zapatos" ||
        categoria === "calzado"
    ) {

        for (
            let i = 33;
            i <= 43;
            i++
        ) {

            tallas.push(
                String(i)
            );

        }

    }


    // ------------------------------------------------------
    // CATEGORÍA DESCONOCIDA
    // ------------------------------------------------------

    else {

        console.error(
            "CATEGORÍA NO RECONOCIDA:",
            categoria
        );


        tallaSeleccionada = null;


        if (contenedorPadre) {

            contenedorPadre.style.display =
                "none";

        }


        return;
    }


    // ------------------------------------------------------
    // MOSTRAR SELECTOR
    // ------------------------------------------------------

    if (contenedorPadre) {

        contenedorPadre.style.display =
            "";

    }


    // ------------------------------------------------------
    // LIMPIAR TALLAS
    // ------------------------------------------------------

    contenedor.innerHTML = "";

    tallaSeleccionada = null;


    // ------------------------------------------------------
    // CREAR BOTONES
    // ------------------------------------------------------

    tallas.forEach(
        (talla, index) => {

            const boton =
                document.createElement("button");


            boton.type =
                "button";


            boton.textContent =
                talla;


            // ----------------------------------------------
            // PRIMERA TALLA SELECCIONADA
            // ----------------------------------------------

            if (index === 0) {

                boton.classList.add(
                    "activo"
                );

                tallaSeleccionada =
                    String(talla);

            }


            // ----------------------------------------------
            // CLICK TALLA
            // ----------------------------------------------

            boton.addEventListener(
                "click",
                () => {

                    const botones =
                        contenedor.querySelectorAll(
                            "button"
                        );


                    botones.forEach(
                        btn => {

                            btn.classList.remove(
                                "activo"
                            );

                        }
                    );


                    boton.classList.add(
                        "activo"
                    );


                    tallaSeleccionada =
                        String(talla);


                    console.log(
                        "TALLA SELECCIONADA:",
                        tallaSeleccionada
                    );

                }
            );


            contenedor.appendChild(
                boton
            );

        }
    );


    console.log(
        "TALLAS CARGADAS:",
        tallas
    );

}


// ==========================================================
// GALERÍA
// ==========================================================

function inicializarGaleria() {

    const miniaturas =
        document.querySelectorAll(
            ".miniaturas img"
        );


    const imagenPrincipal =
        document.querySelector(
            ".imagen-principal img"
        );


    if (
        !imagenPrincipal ||
        miniaturas.length === 0
    ) {

        console.log(
            "Galería no encontrada."
        );

        return;
    }


    miniaturas.forEach(
        img => {

            img.addEventListener(
                "click",
                () => {

                    imagenPrincipal.src =
                        img.src;


                    miniaturas.forEach(
                        imagen => {

                            imagen.classList.remove(
                                "activa"
                            );

                        }
                    );


                    img.classList.add(
                        "activa"
                    );

                }
            );

        }
    );

}


// ==========================================================
// COLORES
// ==========================================================

function inicializarColores() {

    const colores =
        document.querySelectorAll(
            ".color"
        );


    if (colores.length === 0) {

        console.log(
            "No hay colores disponibles."
        );

        return;
    }


    colores.forEach(
        color => {

            color.addEventListener(
                "click",
                () => {

                    colores.forEach(
                        c => {

                            c.classList.remove(
                                "activo"
                            );

                        }
                    );


                    color.classList.add(
                        "activo"
                    );


                    console.log(
                        "COLOR SELECCIONADO:",
                        color.className
                    );

                }
            );

        }
    );

}


// ==========================================================
// CANTIDAD
// ==========================================================

function inicializarCantidad() {

    const cantidad =
        document.getElementById(
            "cantidad"
        );


    const botonMenos =
        document.getElementById(
            "btn-menos"
        );


    const botonMas =
        document.getElementById(
            "btn-mas"
        );


    // ------------------------------------------------------
    // VERIFICAR ELEMENTOS
    // ------------------------------------------------------

    if (
        !cantidad ||
        !botonMenos ||
        !botonMas
    ) {

        console.error(
            "ERROR: No se encontraron los controles de cantidad."
        );

        return;
    }


    // ------------------------------------------------------
    // OBTENER CANTIDAD VÁLIDA
    // ------------------------------------------------------

    function obtenerCantidad() {

        let valor =
            parseInt(
                cantidad.value,
                10
            );


        if (
            isNaN(valor) ||
            valor < 1
        ) {

            valor = 1;

        }


        return valor;

    }


    // ------------------------------------------------------
    // BOTÓN MENOS
    // ------------------------------------------------------

    botonMenos.addEventListener(
        "click",
        () => {

            let valor =
                obtenerCantidad();


            if (valor > 1) {

                valor--;

            }


            cantidad.value =
                valor;


            console.log(
                "CANTIDAD:",
                valor
            );

        }
    );


    // ------------------------------------------------------
    // BOTÓN MÁS
    // ------------------------------------------------------

    botonMas.addEventListener(
        "click",
        () => {

            let valor =
                obtenerCantidad();


            valor++;


            cantidad.value =
                valor;


            console.log(
                "CANTIDAD:",
                valor
            );

        }
    );


    // ------------------------------------------------------
    // CAMBIO MANUAL
    // ------------------------------------------------------

    cantidad.addEventListener(
        "change",
        () => {

            cantidad.value =
                obtenerCantidad();

        }
    );


    // ------------------------------------------------------
    // ESCRITURA MANUAL
    // ------------------------------------------------------

    cantidad.addEventListener(
        "input",
        () => {

            let valor =
                parseInt(
                    cantidad.value,
                    10
                );


            if (
                isNaN(valor) ||
                valor < 1
            ) {

                cantidad.value = 1;

            }

        }
    );


    console.log(
        "CONTROLES DE CANTIDAD INICIALIZADOS."
    );

}


// ==========================================================
// INICIALIZAR CARRITO
// ==========================================================

function inicializarCarrito() {

    const boton =
        document.getElementById(
            "btn-agregar-carrito"
        );


    if (!boton) {

        console.error(
            "ERROR: No existe #btn-agregar-carrito"
        );

        return;
    }


    boton.addEventListener(
        "click",
        agregarAlCarrito
    );


    console.log(
        "BOTÓN DE CARRITO INICIALIZADO."
    );

}


// ==========================================================
// AGREGAR AL CARRITO
// ==========================================================

function agregarAlCarrito() {

    console.log("======================================");
    console.log("AGREGAR AL CARRITO");
    console.log("======================================");


    // ======================================================
    // OBTENER CONTENEDOR DEL PRODUCTO
    // ======================================================

    const detalle =
        document.querySelector(
            ".detalle-contenedor"
        );


    if (!detalle) {

        console.error(
            "ERROR: No existe .detalle-contenedor"
        );

        alert(
            "No se pudo identificar el producto."
        );

        return;
    }


    // ======================================================
    // OBTENER ID DEL PRODUCTO
    // ======================================================

    const idProducto =
        Number(
            detalle.dataset.id
        );


    console.log(
        "ID PRODUCTO:",
        idProducto
    );


    if (
        !idProducto ||
        idProducto <= 0
    ) {

        console.error(
            "ERROR: .detalle-contenedor no tiene data-id válido."
        );

        alert(
            "No se pudo identificar el producto."
        );

        return;
    }


    // ======================================================
    // OBTENER CATEGORÍA
    // ======================================================

    const contenedorTallas =
        document.getElementById(
            "tallas-container"
        );


    const categoria =
        (
            contenedorTallas?.dataset.categoria ||
            ""
        )
        .toLowerCase()
        .trim();


    console.log(
        "CATEGORÍA:",
        categoria
    );


    // ======================================================
    // OBTENER CANTIDAD
    // ======================================================

    const inputCantidad =
        document.getElementById(
            "cantidad"
        );


    let cantidadProducto =
        inputCantidad
            ? parseInt(
                inputCantidad.value,
                10
            )
            : 1;


    if (
        isNaN(cantidadProducto) ||
        cantidadProducto < 1
    ) {

        cantidadProducto = 1;


        if (inputCantidad) {

            inputCantidad.value =
                1;

        }

    }


    console.log(
        "CANTIDAD:",
        cantidadProducto
    );


    // ======================================================
    // OBTENER TALLA
    // ======================================================

    let talla = "";


    // ------------------------------------------------------
    // ROPA
    // ------------------------------------------------------

    if (
        categoria === "ropa" ||
        categoria === "ropas"
    ) {

        const botonTalla =
            document.querySelector(
                "#tallas-container button.activo"
            );


        if (!botonTalla) {

            alert(
                "Selecciona una talla."
            );

            return;
        }


        talla =
            botonTalla.textContent.trim();


        console.log(
            "TALLA:",
            talla
        );

    }


    // ------------------------------------------------------
    // ZAPATOS
    // ------------------------------------------------------

    else if (
        categoria === "zapato" ||
        categoria === "zapatos" ||
        categoria === "calzado"
    ) {

        const botonTalla =
            document.querySelector(
                "#tallas-container button.activo"
            );


        if (!botonTalla) {

            alert(
                "Selecciona una talla."
            );

            return;
        }


        talla =
            botonTalla.textContent.trim();


        console.log(
            "TALLA:",
            talla
        );

    }


    // ------------------------------------------------------
    // ACCESORIOS
    // ------------------------------------------------------

    else if (
        categoria === "accesorio" ||
        categoria === "accesorios"
    ) {

        talla = "";


        console.log(
            "ACCESORIO: no necesita talla."
        );

    }


    // ------------------------------------------------------
    // CATEGORÍA INVÁLIDA
    // ------------------------------------------------------

    else {

        console.error(
            "Categoría inválida:",
            categoria
        );

        alert(
            "La categoría del producto no es válida."
        );

        return;
    }


    // ======================================================
    // MOSTRAR DATOS
    // ======================================================

    console.log("======================================");
    console.log("DATOS A ENVIAR");
    console.log("ID:", idProducto);
    console.log("CATEGORÍA:", categoria);
    console.log("CANTIDAD:", cantidadProducto);
    console.log("TALLA:", talla);
    console.log("======================================");


    // ======================================================
    // CREAR FORMULARIO
    // ======================================================

    const formulario =
        document.createElement(
            "form"
        );


    formulario.method =
        "POST";


    formulario.action =
        `/carrito/agregar/${idProducto}`;


    // ======================================================
    // INPUT CANTIDAD
    // ======================================================

    const inputCantidadForm =
        document.createElement(
            "input"
        );


    inputCantidadForm.type =
        "hidden";


    inputCantidadForm.name =
        "cantidad";


    inputCantidadForm.value =
        cantidadProducto;


    formulario.appendChild(
        inputCantidadForm
    );


    // ======================================================
    // INPUT TALLA
    // ======================================================

    const inputTalla =
        document.createElement(
            "input"
        );


    inputTalla.type =
        "hidden";


    inputTalla.name =
        "talla";


    inputTalla.value =
        talla;


    formulario.appendChild(
        inputTalla
    );


    // ======================================================
    // AGREGAR FORMULARIO AL DOM
    // ======================================================

    document.body.appendChild(
        formulario
    );


    // ======================================================
    // BLOQUEAR BOTÓN
    // ======================================================

    const boton =
        document.getElementById(
            "btn-agregar-carrito"
        );


    if (boton) {

        boton.disabled =
            true;

        boton.style.opacity =
            "0.7";

        boton.style.cursor =
            "not-allowed";

    }


    // ======================================================
    // ENVIAR A FLASK
    // ======================================================

    console.log(
        "ENVIANDO FORMULARIO A:",
        formulario.action
    );


    formulario.submit();

}