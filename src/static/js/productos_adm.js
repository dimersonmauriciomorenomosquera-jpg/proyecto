
/*==========================================================
                    PRODUCTOS ADMINISTRADOR
==========================================================*/


/*==========================================================
                        MODALES
==========================================================*/

const modalAgregar =
    document.getElementById("modalAgregar");

const modalEditar =
    document.getElementById("modalEditar");

const modalVer =
    document.getElementById("modalVer");

const modalEliminar =
    document.getElementById("modalEliminar");


/*==========================================================
                    IMAGEN POR DEFECTO
==========================================================*/

/*
    IMPORTANTE:

    Esta imagen debe existir realmente en:

    static/img/sin_imagen.png

    Si la imagen no existe, también tendrás errores
    de carga.
*/

const IMAGEN_POR_DEFECTO =
    "/static/img/sin_imagen.png";


/*==========================================================
                    DATOS DE PRODUCTOS
==========================================================*/

const filasProductos = Array.from(
    document.querySelectorAll(
        "#tablaProductos tr[data-id]"
    )
);


let productos = filasProductos.map(fila => ({

    id_producto:
        fila.dataset.id || "",

    nombre_producto:
        fila.dataset.nombre || "",

    categoria:
        fila.dataset.categoria || "",

    marca_producto:
        fila.dataset.marca || "",

    precio_producto:
        Number(
            fila.dataset.precio
        ) || 0,

    stock_producto:
        Number(
            fila.dataset.stock
        ) || 0,

    descripcion_producto:
        fila.dataset.descripcion || "",

    talla:
        fila.dataset.talla || "",

    sku:
        fila.dataset.sku || "",

    codigo_barras:
        fila.dataset.codigoBarras || "",

    imagen:
        fila.dataset.imagen || ""

}));


/*==========================================================
                    PAGINACIÓN
==========================================================*/

const PRODUCTOS_POR_PAGINA = 12;

let paginaActual = 1;

let productosFiltrados = [
    ...productos
];


const paginacion =
    document.getElementById("paginacion");

const paginaAnterior =
    document.getElementById("paginaAnterior");

const numerosPaginas =
    document.getElementById("numerosPaginas");

const paginaSiguiente =
    document.getElementById("paginaSiguiente");


/*==========================================================
                    ELEMENTOS
==========================================================*/

const totalProductos =
    document.getElementById("totalProductos");

const totalAgotados =
    document.getElementById("totalAgotados");

const totalCategorias =
    document.getElementById("totalCategorias");

const totalInventario =
    document.getElementById("totalInventario");


const buscador =
    document.getElementById("buscadorProducto");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const btnBuscar =
    document.getElementById("btnBuscar");


const tablaProductos =
    document.getElementById("tablaProductos");


/*==========================================================
                    ESTADÍSTICAS
==========================================================*/

function actualizarEstadisticas(
    lista = productos
) {

    if (totalProductos) {

        totalProductos.textContent =
            lista.length;

    }


    const agotados =
        lista.filter(
            producto =>
                Number(
                    producto.stock_producto
                ) <= 0
        );


    if (totalAgotados) {

        totalAgotados.textContent =
            agotados.length;

    }


    const categorias =
        new Set(

            lista
                .map(
                    producto =>
                        (
                            producto.categoria || ""
                        )
                        .trim()
                        .toLowerCase()
                )
                .filter(
                    categoria =>
                        categoria !== ""
                )

        );


    if (totalCategorias) {

        totalCategorias.textContent =
            categorias.size;

    }


    const inventario =
        lista.reduce(

            (total, producto) => {

                const precio =
                    Number(
                        producto.precio_producto
                    ) || 0;

                const stock =
                    Number(
                        producto.stock_producto
                    ) || 0;

                return (
                    total +
                    (
                        precio *
                        stock
                    )
                );

            },

            0

        );


    if (totalInventario) {

        totalInventario.textContent =
            formatearPrecio(
                inventario
            );

    }

}


/*==========================================================
                    FORMATO DE PRECIO
==========================================================*/

function formatearPrecio(valor) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(
        Number(valor) || 0
    );

}


/*==========================================================
                    IMÁGENES
==========================================================*/

/*
    Esta función evita el problema de solicitudes infinitas.

    Si una imagen falla:

    1. Cambia a la imagen por defecto.
    2. Elimina el evento de error.
    3. No vuelve a intentar cambiar la imagen.

    De esta manera no existe un ciclo infinito.
*/

function manejarErrorImagen(imagen) {

    if (!imagen) {

        return;

    }


    /*
        Si ya estamos usando la imagen por defecto,
        no hacemos absolutamente nada.
    */

    if (
        imagen.dataset.errorImagen === "true"
    ) {

        return;

    }


    imagen.dataset.errorImagen =
        "true";


    imagen.onerror = null;


    /*
        Usamos la ruta absoluta de Flask.
    */

    imagen.src =
        IMAGEN_POR_DEFECTO;

}


/*
    Configura una imagen para que tenga
    protección contra errores.
*/

function configurarImagen(
    imagen,
    url
) {

    if (!imagen) {

        return;

    }


    /*
        Limpiamos cualquier error anterior.
    */

    imagen.onerror = null;

    delete imagen.dataset.errorImagen;


    /*
        Si no hay URL,
        directamente usamos la imagen por defecto.

        IMPORTANTE:
        No intentamos cargar una URL vacía.
    */

    if (
        !url ||
        !url.trim()
    ) {

        imagen.src =
            IMAGEN_POR_DEFECTO;

        return;

    }


    /*
        Evento de error.

        Si la URL está dañada o no existe,
        se utiliza la imagen por defecto.
    */

    imagen.onerror = function () {

        manejarErrorImagen(
            imagen
        );

    };


    imagen.src =
        url.trim();

}


/*==========================================================
                    TOTAL DE PÁGINAS
==========================================================*/

function obtenerTotalPaginas() {

    return Math.max(

        1,

        Math.ceil(
            productosFiltrados.length
            /
            PRODUCTOS_POR_PAGINA
        )

    );

}


/*==========================================================
                OBTENER PRODUCTOS DE PÁGINA
==========================================================*/

function obtenerProductosPagina() {

    const inicio =
        (
            paginaActual - 1
        )
        *
        PRODUCTOS_POR_PAGINA;


    const fin =
        inicio +
        PRODUCTOS_POR_PAGINA;


    return productosFiltrados.slice(
        inicio,
        fin
    );

}


/*==========================================================
                    RENDERIZAR TABLA
==========================================================*/

function renderizarProductos(lista) {

    tablaProductos.innerHTML = "";


    if (
        !lista ||
        lista.length === 0
    ) {

        tablaProductos.innerHTML = `

            <tr>

                <td colspan="8">

                    No se encontraron productos.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        producto => {

            const fila =
                document.createElement("tr");


            /*==================================================
                        DATASET
            ==================================================*/

            fila.dataset.id =
                producto.id_producto;

            fila.dataset.nombre =
                producto.nombre_producto || "";

            fila.dataset.categoria =
                producto.categoria || "";

            fila.dataset.marca =
                producto.marca_producto || "";

            fila.dataset.precio =
                producto.precio_producto || 0;

            fila.dataset.stock =
                producto.stock_producto || 0;

            fila.dataset.descripcion =
                producto.descripcion_producto || "";

            fila.dataset.talla =
                producto.talla || "";

            fila.dataset.sku =
                producto.sku || "";

            fila.dataset.codigoBarras =
                producto.codigo_barras || "";

            fila.dataset.imagen =
                producto.imagen || "";


            /*==================================================
                        CONTENIDO
            ==================================================*/

            fila.innerHTML = `

                <td>

                    <img
                        src="${IMAGEN_POR_DEFECTO}"
                        alt="${
                            producto.nombre_producto ||
                            "Producto"
                        }"
                        class="imagen-producto"
                    >

                </td>


                <td>
                    ${
                        producto.nombre_producto ||
                        "-"
                    }
                </td>


                <td>
                    ${
                        producto.marca_producto ||
                        "-"
                    }
                </td>


                <td>
                    ${
                        producto.categoria ||
                        "-"
                    }
                </td>


                <td>
                    ${
                        formatearPrecio(
                            producto.precio_producto
                        )
                    }
                </td>


                <td>
                    ${
                        producto.stock_producto
                    }
                </td>


                <td>

                    ${
                        Number(
                            producto.stock_producto
                        ) > 0

                        ?

                        `<span class="disponible">
                            Disponible
                        </span>`

                        :

                        `<span class="agotado">
                            Agotado
                        </span>`
                    }

                </td>


                <td class="acciones">

                    <button
                        type="button"
                        class="editar"
                        data-id="${
                            producto.id_producto
                        }"
                        title="Editar producto">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="eliminar"
                        data-id="${
                            producto.id_producto
                        }"
                        title="Eliminar producto">

                        <i class="fa-solid fa-trash"></i>

                    </button>


                    <button
                        type="button"
                        class="ver"
                        data-id="${
                            producto.id_producto
                        }"
                        title="Ver producto">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tablaProductos.appendChild(
                fila
            );


            /*
                Configuramos la imagen DESPUÉS
                de crear la fila.

                Así no usamos onerror dentro
                del HTML.
            */

            const imagen =
                fila.querySelector(
                    ".imagen-producto"
                );


            configurarImagen(
                imagen,
                producto.imagen
            );

        }
    );


    /*
        Volvemos a asignar los eventos
        de los botones.
    */

    asignarEventosAcciones();

}


/*==========================================================
                RENDERIZAR PAGINACIÓN
==========================================================*/

function renderizarPaginacion() {

    if (
        !paginacion ||
        !numerosPaginas
    ) {

        return;

    }


    const totalPaginas =
        obtenerTotalPaginas();


    numerosPaginas.innerHTML = "";


    /*
        Si solamente hay una página,
        ocultamos la paginación.
    */

    if (
        totalPaginas <= 1
    ) {

        paginacion.style.display =
            "none";

        return;

    }


    paginacion.style.display =
        "flex";


    /*
        Botón anterior.
    */

    if (paginaAnterior) {

        paginaAnterior.disabled =
            paginaActual <= 1;

    }


    /*
        Botón siguiente.
    */

    if (paginaSiguiente) {

        paginaSiguiente.disabled =
            paginaActual >= totalPaginas;

    }


    /*
        Números de páginas.
    */

    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        const boton =
            document.createElement("button");


        boton.type =
            "button";


        boton.textContent =
            pagina;


        boton.classList.add(
            "numero-pagina"
        );


        if (
            pagina === paginaActual
        ) {

            boton.classList.add(
                "activo"
            );

        }


        boton.addEventListener(
            "click",
            () => {

                cambiarPagina(
                    pagina
                );

            }
        );


        numerosPaginas.appendChild(
            boton
        );

    }

}


/*==========================================================
                    MOSTRAR PÁGINA
==========================================================*/

function mostrarPagina() {

    const totalPaginas =
        obtenerTotalPaginas();


    /*
        Si por algún motivo la página actual
        quedó fuera del rango, la corregimos.
    */

    if (
        paginaActual > totalPaginas
    ) {

        paginaActual =
            totalPaginas;

    }


    if (
        paginaActual < 1
    ) {

        paginaActual =
            1;

    }


    const productosPagina =
        obtenerProductosPagina();


    renderizarProductos(
        productosPagina
    );


    renderizarPaginacion();

}


/*==========================================================
                    CAMBIAR PÁGINA
==========================================================*/

function cambiarPagina(
    nuevaPagina
) {

    const totalPaginas =
        obtenerTotalPaginas();


    if (
        nuevaPagina < 1 ||
        nuevaPagina > totalPaginas
    ) {

        return;

    }


    paginaActual =
        nuevaPagina;


    mostrarPagina();


    /*
        Subimos al comienzo de la tabla.
    */

    if (tablaProductos) {

        tablaProductos.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/*==========================================================
                    PÁGINA ANTERIOR
==========================================================*/

if (paginaAnterior) {

    paginaAnterior.addEventListener(
        "click",
        () => {

            cambiarPagina(
                paginaActual - 1
            );

        }
    );

}


/*==========================================================
                    PÁGINA SIGUIENTE
==========================================================*/

if (paginaSiguiente) {

    paginaSiguiente.addEventListener(
        "click",
        () => {

            cambiarPagina(
                paginaActual + 1
            );

        }
    );

}


/*==========================================================
                    BUSCADOR
==========================================================*/

function buscarProductos() {

    const texto =
        buscador
            ?
            buscador.value
                .trim()
                .toLowerCase()
            :
            "";


    const categoria =
        filtroCategoria
            ?
            filtroCategoria.value
                .trim()
                .toLowerCase()
            :
            "";


    productosFiltrados =
        productos.filter(
            producto => {

                const nombre =
                    (
                        producto.nombre_producto ||
                        ""
                    )
                    .toLowerCase();


                const marca =
                    (
                        producto.marca_producto ||
                        ""
                    )
                    .toLowerCase();


                const sku =
                    (
                        producto.sku ||
                        ""
                    )
                    .toLowerCase();


                const coincideTexto =

                    nombre.includes(texto)

                    ||

                    marca.includes(texto)

                    ||

                    sku.includes(texto);


                const categoriaProducto =
                    (
                        producto.categoria ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const coincideCategoria =

                    !categoria

                    ||

                    categoriaProducto ===
                    categoria;


                return (
                    coincideTexto &&
                    coincideCategoria
                );

            }
        );


    /*
        Cada nueva búsqueda comienza
        desde la página 1.
    */

    paginaActual = 1;


    /*
        Las estadísticas representan
        TODOS los resultados filtrados,
        no solamente los 12 visibles.
    */

    actualizarEstadisticas(
        productosFiltrados
    );


    mostrarPagina();

}


/*==========================================================
                EVENTOS DEL BUSCADOR
==========================================================*/

if (btnBuscar) {

    btnBuscar.addEventListener(
        "click",
        buscarProductos
    );

}


if (buscador) {

    buscador.addEventListener(
        "input",
        buscarProductos
    );

}


if (filtroCategoria) {

    filtroCategoria.addEventListener(
        "change",
        buscarProductos
    );

}


/*==========================================================
                ABRIR MODAL AGREGAR
==========================================================*/

const btnNuevoProducto =
    document.getElementById(
        "btnNuevoProducto"
    );


if (btnNuevoProducto) {

    btnNuevoProducto.addEventListener(
        "click",
        () => {

            modalAgregar.classList.add(
                "activo"
            );

        }
    );

}


/*==========================================================
                    ABRIR MODAL EDITAR
==========================================================*/

function abrirEditar(id) {

    const producto =
        productos.find(
            p =>
                String(
                    p.id_producto
                )
                ===
                String(id)
        );


    if (!producto) {

        console.error(
            "No se encontró el producto:",
            id
        );

        return;

    }


    document.getElementById(
        "idEditar"
    ).value =
        producto.id_producto;


    document.getElementById(
        "nombreEditar"
    ).value =
        producto.nombre_producto || "";


    document.getElementById(
        "marcaEditar"
    ).value =
        producto.marca_producto || "";


    document.getElementById(
        "categoriaEditar"
    ).value =
        producto.categoria || "";


    document.getElementById(
        "precioEditar"
    ).value =
        producto.precio_producto || 0;


    document.getElementById(
        "stockEditar"
    ).value =
        producto.stock_producto || 0;


    document.getElementById(
        "skuEditar"
    ).value =
        producto.sku || "";


    document.getElementById(
        "codigoEditar"
    ).value =
        producto.codigo_barras || "";


    document.getElementById(
        "tallaEditar"
    ).value =
        producto.talla || "";


    document.getElementById(
        "descripcionEditar"
    ).value =
        producto.descripcion_producto || "";


    const inputImagen =
        document.getElementById(
            "imagenEditar"
        );


    const previewImagen =
        document.getElementById(
            "previewEditar"
        );


    inputImagen.value =
        producto.imagen || "";


    configurarImagen(
        previewImagen,
        producto.imagen
    );


    modalEditar.classList.add(
        "activo"
    );

}


/*==========================================================
                    ABRIR MODAL VER
==========================================================*/

function abrirVer(id) {

    const producto =
        productos.find(
            p =>
                String(
                    p.id_producto
                )
                ===
                String(id)
        );


    if (!producto) {

        console.error(
            "No se encontró el producto:",
            id
        );

        return;

    }


    const verImagen =
        document.getElementById(
            "verImagen"
        );


    configurarImagen(
        verImagen,
        producto.imagen
    );


    document.getElementById(
        "verNombre"
    ).textContent =
        producto.nombre_producto || "-";


    document.getElementById(
        "verMarca"
    ).textContent =
        producto.marca_producto || "-";


    document.getElementById(
        "verCategoria"
    ).textContent =
        producto.categoria || "-";


    document.getElementById(
        "verPrecio"
    ).textContent =
        formatearPrecio(
            producto.precio_producto
        );


    document.getElementById(
        "verStock"
    ).textContent =
        `${
            producto.stock_producto
        } unidades`;


    document.getElementById(
        "verTalla"
    ).textContent =
        producto.talla || "-";


    document.getElementById(
        "verSku"
    ).textContent =
        producto.sku || "-";


    document.getElementById(
        "verDescripcion"
    ).textContent =
        producto.descripcion_producto || "-";


    const estado =
        document.getElementById(
            "verEstado"
        );


    if (
        Number(
            producto.stock_producto
        ) > 0
    ) {

        estado.innerHTML = `

            <span class="disponible">
                Disponible
            </span>

        `;

    } else {

        estado.innerHTML = `

            <span class="agotado">
                Agotado
            </span>

        `;

    }


    modalVer.classList.add(
        "activo"
    );

}


/*==========================================================
                    ABRIR ELIMINAR
==========================================================*/

function abrirEliminar(id) {

    const producto =
        productos.find(
            p =>
                String(
                    p.id_producto
                )
                ===
                String(id)
        );


    if (!producto) {

        console.error(
            "No se encontró el producto:",
            id
        );

        return;

    }


    document.getElementById(
        "idEliminar"
    ).value =
        producto.id_producto;


    document.getElementById(
        "nombreEliminar"
    ).textContent =
        producto.nombre_producto || "-";


    modalEliminar.classList.add(
        "activo"
    );

}


/*==========================================================
                EVENTOS DE ACCIONES
==========================================================*/

function asignarEventosAcciones() {

    document
        .querySelectorAll(".editar")
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        abrirEditar(
                            boton.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(".ver")
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        abrirVer(
                            boton.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(".eliminar")
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        abrirEliminar(
                            boton.dataset.id
                        );

                    }
                );

            }
        );

}


/*==========================================================
                    CERRAR MODALES
==========================================================*/

function cerrarTodos() {

    if (modalAgregar) {

        modalAgregar.classList.remove(
            "activo"
        );

    }


    if (modalEditar) {

        modalEditar.classList.remove(
            "activo"
        );

    }


    if (modalVer) {

        modalVer.classList.remove(
            "activo"
        );

    }


    if (modalEliminar) {

        modalEliminar.classList.remove(
            "activo"
        );

    }

}


document
    .querySelectorAll(
        ".cerrar, .cerrar-modal"
    )
    .forEach(
        boton => {

            boton.addEventListener(
                "click",
                cerrarTodos
            );

        }
    );


/*==========================================================
                CERRAR CLICK AFUERA
==========================================================*/

document
    .querySelectorAll(".modal")
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                evento => {

                    if (
                        evento.target === modal
                    ) {

                        modal.classList.remove(
                            "activo"
                        );

                    }

                }
            );

        }
    );


/*==========================================================
                        ESC
==========================================================*/

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape"
        ) {

            cerrarTodos();

        }

    }
);


/*==========================================================
                PREVISUALIZAR URL
==========================================================*/

function configurarPreviewURL(
    inputId,
    imagenId
) {

    const input =
        document.getElementById(
            inputId
        );

    const imagen =
        document.getElementById(
            imagenId
        );


    if (
        !input ||
        !imagen
    ) {

        return;

    }


    /*
        Cuando el usuario escribe una URL,
        esperamos un momento antes de cambiar
        la imagen.

        Esto evita estar haciendo solicitudes
        por cada letra escrita.
    */

    let temporizador = null;


    input.addEventListener(
        "input",
        () => {

            clearTimeout(
                temporizador
            );


            temporizador =
                setTimeout(
                    () => {

                        const url =
                            input.value.trim();


                        if (!url) {

                            configurarImagen(
                                imagen,
                                ""
                            );

                            return;

                        }


                        configurarImagen(
                            imagen,
                            url
                        );

                    },
                    400
                );

        }
    );

}


configurarPreviewURL(
    "imagenAgregar",
    "previewAgregar"
);


configurarPreviewURL(
    "imagenEditar",
    "previewEditar"
);


/*==========================================================
                AGREGAR PRODUCTO
==========================================================*/

const formAgregarProducto =
    document.getElementById(
        "formAgregarProducto"
    );


if (formAgregarProducto) {

    formAgregarProducto.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const producto = {

                nombre_producto:
                    document.getElementById(
                        "nombreAgregar"
                    ).value.trim(),


                marca_producto:
                    document.getElementById(
                        "marcaAgregar"
                    ).value.trim(),


                categoria:
                    document.getElementById(
                        "categoriaAgregar"
                    ).value,


                precio_producto:
                    Number(
                        document.getElementById(
                            "precioAgregar"
                        ).value
                    ),


                stock_producto:
                    Number(
                        document.getElementById(
                            "stockAgregar"
                        ).value
                    ),


                sku:
                    document.getElementById(
                        "skuAgregar"
                    ).value.trim(),


                codigo_barras:
                    document.getElementById(
                        "codigoAgregar"
                    ).value.trim(),


                talla:
                    document.getElementById(
                        "tallaAgregar"
                    ).value.trim(),


                descripcion_producto:
                    document.getElementById(
                        "descripcionAgregar"
                    ).value.trim(),


                imagen:
                    document.getElementById(
                        "imagenAgregar"
                    ).value.trim()

            };


            console.log(
                "========================================"
            );

            console.log(
                "PRODUCTO A CREAR:"
            );

            console.log(producto);

            console.log(
                "========================================"
            );


            try {

                const respuesta =
                    await fetch(
                        "/admin/productos/crear",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    producto
                                )
                        }
                    );


                const datos =
                    await respuesta.json();


                console.log(
                    "RESPUESTA CREAR PRODUCTO:"
                );

                console.log(datos);


                if (
                    !respuesta.ok
                ) {

                    throw new Error(
                        datos.error
                        ||
                        datos.message
                        ||
                        "No se pudo crear el producto."
                    );

                }


                alert(
                    "Producto creado correctamente."
                );


                formAgregarProducto.reset();


                configurarImagen(
                    document.getElementById(
                        "previewAgregar"
                    ),
                    ""
                );


                modalAgregar.classList.remove(
                    "activo"
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR CREANDO PRODUCTO:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


/*==========================================================
                    EDITAR PRODUCTO
==========================================================*/

const formEditarProducto =
    document.getElementById(
        "formEditarProducto"
    );


if (formEditarProducto) {

    formEditarProducto.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const id =
                document.getElementById(
                    "idEditar"
                ).value;


            if (!id) {

                alert(
                    "No se encontró el ID del producto."
                );

                return;

            }


            const producto = {

                nombre_producto:
                    document.getElementById(
                        "nombreEditar"
                    ).value.trim(),


                marca_producto:
                    document.getElementById(
                        "marcaEditar"
                    ).value.trim(),


                categoria:
                    document.getElementById(
                        "categoriaEditar"
                    ).value,


                precio_producto:
                    Number(
                        document.getElementById(
                            "precioEditar"
                        ).value
                    ),


                stock_producto:
                    Number(
                        document.getElementById(
                            "stockEditar"
                        ).value
                    ),


                sku:
                    document.getElementById(
                        "skuEditar"
                    ).value.trim(),


                codigo_barras:
                    document.getElementById(
                        "codigoEditar"
                    ).value.trim(),


                talla:
                    document.getElementById(
                        "tallaEditar"
                    ).value.trim(),


                descripcion_producto:
                    document.getElementById(
                        "descripcionEditar"
                    ).value.trim(),


                imagen:
                    document.getElementById(
                        "imagenEditar"
                    ).value.trim()

            };


            console.log(
                "========================================"
            );

            console.log(
                "ID PRODUCTO A EDITAR:",
                id
            );

            console.log(
                "DATOS A ENVIAR:"
            );

            console.log(producto);

            console.log(
                "========================================"
            );


            try {

                const respuesta =
                    await fetch(
                        `/admin/productos/editar/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    producto
                                )
                        }
                    );


                const datos =
                    await respuesta.json();


                console.log(
                    "RESPUESTA EDITAR PRODUCTO:"
                );

                console.log(datos);


                if (
                    !respuesta.ok
                ) {

                    throw new Error(
                        datos.error
                        ||
                        datos.message
                        ||
                        "No se pudo actualizar el producto."
                    );

                }


                alert(
                    "Producto actualizado correctamente."
                );


                modalEditar.classList.remove(
                    "activo"
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR EDITANDO PRODUCTO:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


/*==========================================================
                    ELIMINAR PRODUCTO
==========================================================*/

const confirmarEliminar =
    document.getElementById(
        "confirmarEliminar"
    );


if (confirmarEliminar) {

    confirmarEliminar.addEventListener(
        "click",
        async () => {

            const id =
                document.getElementById(
                    "idEliminar"
                ).value;


            if (!id) {

                alert(
                    "No se encontró el ID del producto."
                );

                return;

            }


            console.log(
                "========================================"
            );

            console.log(
                "ELIMINANDO PRODUCTO:",
                id
            );

            console.log(
                "========================================"
            );


            try {

                const respuesta =
                    await fetch(
                        `/admin/productos/eliminar/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                const datos =
                    await respuesta.json();


                console.log(
                    "RESPUESTA ELIMINAR PRODUCTO:"
                );

                console.log(datos);


                if (
                    !respuesta.ok
                ) {

                    throw new Error(
                        datos.error
                        ||
                        datos.message
                        ||
                        "No se pudo eliminar el producto."
                    );

                }


                alert(
                    "Producto eliminado correctamente."
                );


                modalEliminar.classList.remove(
                    "activo"
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR ELIMINANDO PRODUCTO:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


/*==========================================================
                    INICIALIZAR
==========================================================*/

/*
    Inicialmente mostramos todos
    los productos filtrados.

    Las estadísticas se calculan
    sobre TODOS los productos.

    La tabla solamente muestra 12.
*/

productosFiltrados =
    [...productos];


actualizarEstadisticas(
    productosFiltrados
);


mostrarPagina();
