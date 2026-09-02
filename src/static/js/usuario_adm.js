/*==========================================================
                    USUARIOS ADMINISTRADOR
==========================================================*/

console.log("========================================");
console.log("USUARIO_ADM.JS CARGADO");
console.log("========================================");


/*==========================================================
                    VARIABLES GLOBALES
==========================================================*/

let usuarios = [];

let usuariosFiltrados = [];

let paginaActual = 1;

const usuariosPorPagina = 12;

let usuarioSeleccionadoId = null;

let usuarioEliminarId = null;


/*==========================================================
                    ELEMENTOS DOM
==========================================================*/

const tablaUsuarios =
    document.getElementById("tablaUsuarios");

const buscadorUsuario =
    document.getElementById("buscadorUsuario");

const filtroRol =
    document.getElementById("filtroRol");

const filtroEstado =
    document.getElementById("filtroEstado");

const btnBuscarUsuario =
    document.getElementById("btnBuscarUsuario");

const btnNuevoUsuario =
    document.getElementById("btnNuevoUsuario");


/*==========================================================
                    MODALES
==========================================================*/

const modalAgregarUsuario =
    document.getElementById("modalAgregarUsuario");

const modalEditarUsuario =
    document.getElementById("modalEditarUsuario");

const modalEliminarUsuario =
    document.getElementById("modalEliminarUsuario");

const modalVerUsuario =
    document.getElementById("modalVerUsuario");


/*==========================================================
                    UTILIDADES
==========================================================*/


/*
    Convierte cualquier respuesta en JSON de forma segura.
*/

async function obtenerRespuesta(response) {

    const contentType =
        response.headers.get("content-type") || "";

    if (
        contentType.includes("application/json")
    ) {

        return await response.json();

    }


    const texto =
        await response.text();


    return {

        error:
            texto ||
            `Error HTTP ${response.status}`

    };

}


/*
    Escapa caracteres HTML para evitar insertar
    contenido directamente sin protección.
*/

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
    Formatea una fecha.
*/

function formatearFecha(fecha) {

    if (!fecha) {

        return "-";

    }


    if (
        typeof fecha === "string" &&
        fecha.includes("T")
    ) {

        return fecha.split("T")[0];

    }


    return fecha;

}


/*
    Devuelve el estado normalizado.
*/

function obtenerEstado(usuario) {

    const estado =
        usuario.estado_cliente || "Activo";


    return String(estado)
        .trim();

}


/*
    Devuelve el rol.

    Actualmente el modelo Cliente no tiene
    un campo de rol confirmado, por lo que
    todos se consideran Cliente.
*/

function obtenerRol(usuario) {

    return (
        usuario.rol_cliente ||
        usuario.rol ||
        "Cliente"
    );

}


/*==========================================================
                    IMÁGENES
==========================================================*/

const imagenDefault =
    "/static/img/user_default.png";


/*
    Configura una imagen para que, si falla,
    cambie inmediatamente a la imagen por defecto.

    IMPORTANTE:
    No vuelve a asignar la misma URL fallida,
    evitando solicitudes infinitas.
*/

function configurarImagenSegura(img, src) {

    if (!img) {

        return;

    }


    img.onerror = function () {

        if (
            this.dataset.fallbackAplicado === "true"
        ) {

            return;

        }


        this.dataset.fallbackAplicado = "true";

        this.onerror = null;

        this.src = imagenDefault;

    };


    if (src) {

        img.src = src;

    } else {

        img.src = imagenDefault;

    }

}


/*
    Obtiene la URL de imagen si existe.
*/

function obtenerImagenUsuario(usuario) {

    return (
        usuario.imagen ||
        usuario.imagen_cliente ||
        usuario.foto ||
        usuario.foto_cliente ||
        usuario.url_imagen ||
        imagenDefault
    );

}


/*==========================================================
                    CARGAR USUARIOS
==========================================================*/

async function cargarUsuarios() {

    try {

        console.log(
            "========================================"
        );

        console.log(
            "CARGANDO USUARIOS"
        );

        console.log(
            "========================================"
        );


        const response = await fetch(
            "/admin/usuario_adm",
            {
                method: "GET",

                headers: {
                    "Accept":
                        "text/html"
                }
            }
        );


        /*
            Esta ruta devuelve HTML, no JSON.

            Por eso no intentamos convertirla
            directamente en usuarios.

            Los usuarios iniciales ya vienen
            renderizados por Jinja.
        */

        if (!response.ok) {

            console.error(
                "Error cargando página:",
                response.status
            );

            return;

        }


        console.log(
            "Página de usuarios cargada correctamente."
        );


        leerUsuariosDesdeTabla();

        aplicarFiltros();


    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

    }

}


/*==========================================================
                LEER USUARIOS DESDE TABLA
==========================================================*/

function leerUsuariosDesdeTabla() {

    usuarios = [];


    if (!tablaUsuarios) {

        console.error(
            "No existe #tablaUsuarios"
        );

        return;

    }


    const filas =
        tablaUsuarios.querySelectorAll(
            "tr[data-id]"
        );


    filas.forEach(fila => {

        const usuario = {

            id_cliente:
                fila.dataset.id || "",

            nombre_cliente:
                fila.dataset.nombre || "",

            email_cliente:
                fila.dataset.email || "",

            numero_cliente:
                fila.dataset.telefono || "",

            direccion_cliente:
                fila.dataset.direccion || "",

            nacimiento_cliente:
                fila.dataset.nacimiento || "",

            estado_cliente:
                fila.dataset.estado || "Activo",

            rol_cliente:
                fila.dataset.rol || "Cliente"

        };


        const imagen =
            fila.querySelector(
                ".foto-usuario"
            );


        if (imagen) {

            usuario.imagen =
                imagen.getAttribute("src");

        }


        usuarios.push(usuario);

    });


    console.log(
        "Usuarios encontrados:",
        usuarios
    );


    actualizarEstadisticas();

}


/*==========================================================
                    FILTROS
==========================================================*/

function aplicarFiltros() {

    const texto =
        (
            buscadorUsuario?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const rol =
        (
            filtroRol?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const estado =
        (
            filtroEstado?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    usuariosFiltrados =
        usuarios.filter(usuario => {

            const nombre =
                (
                    usuario.nombre_cliente ||
                    ""
                )
                .toLowerCase();


            const email =
                (
                    usuario.email_cliente ||
                    ""
                )
                .toLowerCase();


            const telefono =
                (
                    usuario.numero_cliente ||
                    ""
                )
                .toLowerCase();


            const estadoUsuario =
                obtenerEstado(usuario)
                    .toLowerCase();


            const rolUsuario =
                obtenerRol(usuario)
                    .toLowerCase();


            const coincideTexto =
                !texto ||
                nombre.includes(texto) ||
                email.includes(texto) ||
                telefono.includes(texto);


            const coincideRol =
                !rol ||
                rolUsuario === rol;


            const coincideEstado =
                !estado ||
                estadoUsuario === estado;


            return (
                coincideTexto &&
                coincideRol &&
                coincideEstado
            );

        });


    paginaActual = 1;

    renderizarUsuarios();

}


/*==========================================================
                    BUSCADOR
==========================================================*/

if (btnBuscarUsuario) {

    btnBuscarUsuario.addEventListener(
        "click",
        function () {

            aplicarFiltros();

        }
    );

}


if (buscadorUsuario) {

    buscadorUsuario.addEventListener(
        "input",
        function () {

            aplicarFiltros();

        }
    );


    buscadorUsuario.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                aplicarFiltros();

            }

        }
    );

}


if (filtroRol) {

    filtroRol.addEventListener(
        "change",
        aplicarFiltros
    );

}


if (filtroEstado) {

    filtroEstado.addEventListener(
        "change",
        aplicarFiltros
    );

}


/*==========================================================
                RENDERIZAR USUARIOS
==========================================================*/

function renderizarUsuarios() {

    if (!tablaUsuarios) {

        return;

    }


    tablaUsuarios.innerHTML = "";


    if (
        usuariosFiltrados.length === 0
    ) {

        tablaUsuarios.innerHTML = `

            <tr>

                <td colspan="8">

                    No hay usuarios que coincidan
                    con los filtros.

                </td>

            </tr>

        `;


        actualizarPaginacion();

        return;

    }


    const inicio =
        (paginaActual - 1) *
        usuariosPorPagina;


    const fin =
        inicio +
        usuariosPorPagina;


    const usuariosPagina =
        usuariosFiltrados.slice(
            inicio,
            fin
        );


    usuariosPagina.forEach(usuario => {

        const fila =
            crearFilaUsuario(usuario);

        tablaUsuarios.appendChild(
            fila
        );

    });


    configurarImagenesTabla();

    actualizarPaginacion();

}


/*==========================================================
                CREAR FILA USUARIO
==========================================================*/

function crearFilaUsuario(usuario) {

    const tr =
        document.createElement("tr");


    const id =
        usuario.id_cliente;


    const nombre =
        usuario.nombre_cliente || "-";


    const email =
        usuario.email_cliente || "-";


    const telefono =
        usuario.numero_cliente || "-";


    const direccion =
        usuario.direccion_cliente || "-";


    const nacimiento =
        formatearFecha(
            usuario.nacimiento_cliente
        );


    const estado =
        obtenerEstado(usuario);


    const rol =
        obtenerRol(usuario);


    const activo =
        estado.toLowerCase() === "activo";


    tr.dataset.id = id;

    tr.dataset.nombre =
        usuario.nombre_cliente || "";

    tr.dataset.email =
        usuario.email_cliente || "";

    tr.dataset.telefono =
        usuario.numero_cliente || "";

    tr.dataset.direccion =
        usuario.direccion_cliente || "";

    tr.dataset.nacimiento =
        usuario.nacimiento_cliente || "";

    tr.dataset.estado =
        estado;

    tr.dataset.rol =
        rol;


    const imagen =
        document.createElement("img");


    imagen.className =
        "foto-usuario";

    imagen.alt =
        `Foto de ${nombre}`;

    imagen.loading =
        "lazy";


    configurarImagenSegura(
        imagen,
        obtenerImagenUsuario(usuario)
    );


    const tdFoto =
        document.createElement("td");


    tdFoto.appendChild(
        imagen
    );


    const tdNombre =
        document.createElement("td");


    tdNombre.textContent =
        nombre;


    const tdEmail =
        document.createElement("td");


    tdEmail.textContent =
        email;


    const tdTelefono =
        document.createElement("td");


    tdTelefono.textContent =
        telefono;


    const tdRol =
        document.createElement("td");


    const spanRol =
        document.createElement("span");


    spanRol.className =
        "cliente";

    spanRol.textContent =
        rol;


    tdRol.appendChild(
        spanRol
    );


    const tdEstado =
        document.createElement("td");


    const spanEstado =
        document.createElement("span");


    spanEstado.className =
        activo
            ? "activo"
            : "inactivo";


    spanEstado.textContent =
        estado;


    tdEstado.appendChild(
        spanEstado
    );


    const tdNacimiento =
        document.createElement("td");


    tdNacimiento.textContent =
        nacimiento;


    const tdAcciones =
        document.createElement("td");


    tdAcciones.className =
        "acciones";


    /*======================================================
                        VER
    ======================================================*/

    const btnVer =
        document.createElement("button");


    btnVer.type =
        "button";

    btnVer.className =
        "ver";

    btnVer.dataset.id =
        id;

    btnVer.title =
        "Ver usuario";


    btnVer.innerHTML =
        `<i class="fa-solid fa-eye"></i>`;


    /*======================================================
                        EDITAR
    ======================================================*/

    const btnEditar =
        document.createElement("button");


    btnEditar.type =
        "button";

    btnEditar.className =
        "editar";

    btnEditar.dataset.id =
        id;

    btnEditar.title =
        "Editar usuario";


    btnEditar.innerHTML =
        `<i class="fa-solid fa-pen"></i>`;


    /*======================================================
                    CAMBIAR ESTADO
    ======================================================*/

    const btnEstado =
        document.createElement("button");


    btnEstado.type =
        "button";

    btnEstado.className =
        "eliminar";

    btnEstado.dataset.id =
        id;

    btnEstado.dataset.nombre =
        nombre;

    btnEstado.dataset.estado =
        estado;


    if (activo) {

        btnEstado.title =
            "Desactivar usuario";


        btnEstado.innerHTML =
            `<i class="fa-solid fa-user-slash"></i>`;

    } else {

        btnEstado.title =
            "Activar usuario";


        btnEstado.innerHTML =
            `<i class="fa-solid fa-user-check"></i>`;

    }


    tdAcciones.appendChild(
        btnVer
    );

    tdAcciones.appendChild(
        btnEditar
    );

    tdAcciones.appendChild(
        btnEstado
    );


    tr.appendChild(
        tdFoto
    );

    tr.appendChild(
        tdNombre
    );

    tr.appendChild(
        tdEmail
    );

    tr.appendChild(
        tdTelefono
    );

    tr.appendChild(
        tdRol
    );

    tr.appendChild(
        tdEstado
    );

    tr.appendChild(
        tdNacimiento
    );

    tr.appendChild(
        tdAcciones
    );


    return tr;

}


/*==========================================================
                CONFIGURAR IMÁGENES TABLA
==========================================================*/

function configurarImagenesTabla() {

    const imagenes =
        tablaUsuarios.querySelectorAll(
            ".foto-usuario"
        );


    imagenes.forEach(img => {

        img.onerror = function () {

            if (
                this.dataset.fallbackAplicado ===
                "true"
            ) {

                return;

            }


            this.dataset.fallbackAplicado =
                "true";

            this.onerror =
                null;

            this.src =
                imagenDefault;

        };

    });

}


/*==========================================================
                    EVENTOS TABLA
==========================================================*/

if (tablaUsuarios) {

    tablaUsuarios.addEventListener(
        "click",
        function (event) {

            const boton =
                event.target.closest(
                    "button"
                );


            if (!boton) {

                return;

            }


            const id =
                boton.dataset.id;


            if (!id) {

                return;

            }


            if (
                boton.classList.contains(
                    "ver"
                )
            ) {

                abrirVerUsuario(id);

            }


            else if (
                boton.classList.contains(
                    "editar"
                )
            ) {

                abrirEditarUsuario(id);

            }


            else if (
                boton.classList.contains(
                    "eliminar"
                )
            ) {

                abrirCambiarEstadoUsuario(
                    id
                );

            }

        }
    );

}


/*==========================================================
                ESTADÍSTICAS
==========================================================*/

function actualizarEstadisticas() {

    const totalUsuarios =
        document.getElementById(
            "totalUsuarios"
        );


    const usuariosActivos =
        document.getElementById(
            "usuariosActivos"
        );


    const totalAdministradores =
        document.getElementById(
            "totalAdministradores"
        );


    const usuariosMes =
        document.getElementById(
            "usuariosMes"
        );


    if (totalUsuarios) {

        totalUsuarios.textContent =
            usuarios.length;

    }


    const activos =
        usuarios.filter(
            usuario =>
                obtenerEstado(usuario)
                    .toLowerCase() ===
                "activo"
        ).length;


    if (usuariosActivos) {

        usuariosActivos.textContent =
            activos;

    }


    /*
        Actualmente todos los registros obtenidos
        desde /clientes/ son clientes.

        No contamos administradores porque
        pertenecen a otra entidad.
    */

    if (totalAdministradores) {

        totalAdministradores.textContent =
            0;

    }


    /*
        El modelo Cliente actual no tiene
        fecha de registro confirmada.

        Por eso NO inventamos este dato.
    */

    if (usuariosMes) {

        usuariosMes.textContent =
            0;

    }

}


/*==========================================================
                    PAGINACIÓN
==========================================================*/

function actualizarPaginacion() {

    const contenedor =
        document.getElementById(
            "numerosPaginasUsuarios"
        );


    const anterior =
        document.getElementById(
            "paginaAnteriorUsuario"
        );


    const siguiente =
        document.getElementById(
            "paginaSiguienteUsuario"
        );


    if (
        !contenedor ||
        !anterior ||
        !siguiente
    ) {

        return;

    }


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                usuariosFiltrados.length /
                usuariosPorPagina
            )
        );


    if (
        paginaActual >
        totalPaginas
    ) {

        paginaActual =
            totalPaginas;

    }


    contenedor.innerHTML =
        "";


    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        const boton =
            document.createElement(
                "button"
            );


        boton.type =
            "button";

        boton.textContent =
            pagina;

        boton.dataset.pagina =
            pagina;


        if (
            pagina === paginaActual
        ) {

            boton.classList.add(
                "activo"
            );

        }


        boton.addEventListener(
            "click",
            function () {

                paginaActual =
                    pagina;

                renderizarUsuarios();

            }
        );


        contenedor.appendChild(
            boton
        );

    }


    anterior.disabled =
        paginaActual <= 1;


    siguiente.disabled =
        paginaActual >= totalPaginas;

}


/*==========================================================
                PÁGINA ANTERIOR
==========================================================*/

const paginaAnterior =
    document.getElementById(
        "paginaAnteriorUsuario"
    );


if (paginaAnterior) {

    paginaAnterior.addEventListener(
        "click",
        function () {

            if (
                paginaActual > 1
            ) {

                paginaActual--;

                renderizarUsuarios();

            }

        }
    );

}


/*==========================================================
                PÁGINA SIGUIENTE
==========================================================*/

const paginaSiguiente =
    document.getElementById(
        "paginaSiguienteUsuario"
    );


if (paginaSiguiente) {

    paginaSiguiente.addEventListener(
        "click",
        function () {

            const totalPaginas =
                Math.ceil(
                    usuariosFiltrados.length /
                    usuariosPorPagina
                );


            if (
                paginaActual <
                totalPaginas
            ) {

                paginaActual++;

                renderizarUsuarios();

            }

        }
    );

}


/*==========================================================
                ABRIR MODAL NUEVO
==========================================================*/

if (btnNuevoUsuario) {

    btnNuevoUsuario.addEventListener(
        "click",
        function () {

            abrirModal(
                modalAgregarUsuario
            );

        }
    );

}


/*==========================================================
                    ABRIR MODAL
==========================================================*/

function abrirModal(modal) {

    if (!modal) {

        return;

    }


    modal.classList.add(
        "mostrar"
    );

}


/*==========================================================
                    CERRAR MODALES
==========================================================*/

function cerrarModal(modal) {

    if (!modal) {

        return;

    }


    modal.classList.remove(
        "mostrar"
    );

}


/*==========================================================
                BOTONES CERRAR
==========================================================*/

document.addEventListener(
    "click",
    function (event) {

        const botonCerrar =
            event.target.closest(
                ".cerrar-modal, .cerrar"
            );


        if (!botonCerrar) {

            return;

        }


        const modal =
            botonCerrar.closest(
                ".modal"
            );


        cerrarModal(modal);

    }
);


/*==========================================================
            CERRAR MODAL AL HACER CLICK AFUERA
==========================================================*/

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "modal"
            )
        ) {

            return;

        }


        cerrarModal(
            event.target
        );

    }
);


/*==========================================================
                CERRAR CON ESC
==========================================================*/

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal.mostrar"
            )
            .forEach(modal => {

                cerrarModal(modal);

            });

    }
);


/*==========================================================
                PREVISUALIZAR IMAGEN
==========================================================*/

function configurarPreviewImagen(
    inputId,
    previewId
) {

    const input =
        document.getElementById(
            inputId
        );


    const preview =
        document.getElementById(
            previewId
        );


    if (
        !input ||
        !preview
    ) {

        return;

    }


    input.addEventListener(
        "change",
        function () {

            const archivo =
                this.files?.[0];


            if (!archivo) {

                return;

            }


            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecciona un archivo de imagen válido."
                );

                this.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    preview.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                archivo
            );

        }
    );

}


configurarPreviewImagen(
    "imagenAgregarUsuario",
    "previewUsuario"
);


configurarPreviewImagen(
    "imagenEditarUsuario",
    "previewEditarUsuario"
);


/*==========================================================
                FORMULARIO AGREGAR
==========================================================*/

const formAgregarUsuario =
    document.getElementById(
        "formAgregarUsuario"
    );


if (formAgregarUsuario) {

    formAgregarUsuario.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const boton =
                document.getElementById(
                    "guardarUsuario"
                );


            const datos = {

                nombre_cliente:
                    document.getElementById(
                        "nombreAgregarUsuario"
                    )?.value.trim(),

                email_cliente:
                    document.getElementById(
                        "emailAgregarUsuario"
                    )?.value.trim(),

                numero_cliente:
                    document.getElementById(
                        "telefonoAgregarUsuario"
                    )?.value.trim(),

                nacimiento_cliente:
                    document.getElementById(
                        "nacimientoAgregarUsuario"
                    )?.value,

                direccion_cliente:
                    document.getElementById(
                        "direccionAgregarUsuario"
                    )?.value.trim(),

                password:
                    document.getElementById(
                        "passwordAgregarUsuario"
                    )?.value,

                estado_cliente:
                    "Activo"

            };


            console.log(
                "========================================"
            );

            console.log(
                "CREAR USUARIO"
            );

            console.log(
                datos
            );

            console.log(
                "========================================"
            );


            if (
                !datos.nombre_cliente ||
                !datos.email_cliente ||
                !datos.numero_cliente ||
                !datos.nacimiento_cliente ||
                !datos.direccion_cliente ||
                !datos.password
            ) {

                alert(
                    "Completa todos los campos obligatorios."
                );

                return;

            }


            try {

                boton.disabled =
                    true;

                boton.textContent =
                    "Guardando...";


                const response =
                    await fetch(
                        "/admin/usuarios/crear",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    datos
                                )

                        }
                    );


                const resultado =
                    await obtenerRespuesta(
                        response
                    );


                console.log(
                    "STATUS:",
                    response.status
                );

                console.log(
                    "RESPUESTA:",
                    resultado
                );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        resultado.error ||
                        resultado.mensaje ||
                        `Error HTTP ${response.status}`
                    );

                }


                alert(
                    "Cliente creado correctamente."
                );


                cerrarModal(
                    modalAgregarUsuario
                );


                formAgregarUsuario.reset();


                const preview =
                    document.getElementById(
                        "previewUsuario"
                    );


                if (preview) {

                    preview.src =
                        imagenDefault;

                }


                /*
                    Recargamos la página porque
                    el servidor debe obtener nuevamente
                    los clientes desde la API.
                */

                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR CREANDO USUARIO:",
                    error
                );


                alert(
                    error.message ||
                    "No fue posible crear el cliente."
                );


            } finally {

                boton.disabled =
                    false;

                boton.textContent =
                    "Guardar Cliente";

            }

        }
    );

}


/*==========================================================
                ABRIR EDITAR USUARIO
==========================================================*/

function abrirEditarUsuario(id) {

    const usuario =
        usuarios.find(
            u =>
                String(u.id_cliente) ===
                String(id)
        );


    if (!usuario) {

        console.error(
            "Usuario no encontrado:",
            id
        );

        return;

    }


    usuarioSeleccionadoId =
        usuario.id_cliente;


    document.getElementById(
        "idEditarUsuario"
    ).value =
        usuario.id_cliente || "";


    document.getElementById(
        "nombreEditarUsuario"
    ).value =
        usuario.nombre_cliente || "";


    document.getElementById(
        "emailEditarUsuario"
    ).value =
        usuario.email_cliente || "";


    document.getElementById(
        "telefonoEditarUsuario"
    ).value =
        usuario.numero_cliente || "";


    document.getElementById(
        "nacimientoEditarUsuario"
    ).value =
        formatearFecha(
            usuario.nacimiento_cliente
        );


    document.getElementById(
        "direccionEditarUsuario"
    ).value =
        usuario.direccion_cliente || "";


    document.getElementById(
        "estadoEditarUsuario"
    ).value =
        obtenerEstado(usuario);


    document.getElementById(
        "passwordEditarUsuario"
    ).value =
        "";


    const preview =
        document.getElementById(
            "previewEditarUsuario"
        );


    if (preview) {

        configurarImagenSegura(
            preview,
            obtenerImagenUsuario(usuario)
        );

    }


    abrirModal(
        modalEditarUsuario
    );

}


/*==========================================================
                FORMULARIO EDITAR
==========================================================*/

const formEditarUsuario =
    document.getElementById(
        "formEditarUsuario"
    );


if (formEditarUsuario) {

    formEditarUsuario.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "idEditarUsuario"
                )?.value;


            if (!id) {

                alert(
                    "No se encontró el ID del usuario."
                );

                return;

            }


            const datos = {

                nombre_cliente:
                    document.getElementById(
                        "nombreEditarUsuario"
                    )?.value.trim(),

                email_cliente:
                    document.getElementById(
                        "emailEditarUsuario"
                    )?.value.trim(),

                numero_cliente:
                    document.getElementById(
                        "telefonoEditarUsuario"
                    )?.value.trim(),

                nacimiento_cliente:
                    document.getElementById(
                        "nacimientoEditarUsuario"
                    )?.value,

                direccion_cliente:
                    document.getElementById(
                        "direccionEditarUsuario"
                    )?.value.trim(),

                estado_cliente:
                    document.getElementById(
                        "estadoEditarUsuario"
                    )?.value

            };


            const password =
                document.getElementById(
                    "passwordEditarUsuario"
                )?.value;


            /*
                Solo enviamos password si el administrador
                escribió una nueva.
            */

            if (password) {

                datos.password =
                    password;

            }


            console.log(
                "========================================"
            );

            console.log(
                "EDITAR USUARIO"
            );

            console.log(
                "ID:",
                id
            );

            console.log(
                "DATOS:",
                datos
            );

            console.log(
                "========================================"
            );


            const boton =
                document.getElementById(
                    "guardarCambiosUsuario"
                );


            try {

                boton.disabled =
                    true;

                boton.textContent =
                    "Guardando...";


                const response =
                    await fetch(
                        `/admin/usuarios/editar/${id}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    datos
                                )

                        }
                    );


                const resultado =
                    await obtenerRespuesta(
                        response
                    );


                console.log(
                    "STATUS:",
                    response.status
                );

                console.log(
                    "RESPUESTA:",
                    resultado
                );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        resultado.error ||
                        resultado.mensaje ||
                        `Error HTTP ${response.status}`
                    );

                }


                alert(
                    "Cliente actualizado correctamente."
                );


                cerrarModal(
                    modalEditarUsuario
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR EDITANDO USUARIO:",
                    error
                );


                alert(
                    error.message ||
                    "No fue posible actualizar el cliente."
                );


            } finally {

                boton.disabled =
                    false;

                boton.textContent =
                    "Guardar Cambios";

            }

        }
    );

}


/*==========================================================
                ABRIR MODAL VER
==========================================================*/

function abrirVerUsuario(id) {

    const usuario =
        usuarios.find(
            u =>
                String(u.id_cliente) ===
                String(id)
        );


    if (!usuario) {

        console.error(
            "Usuario no encontrado:",
            id
        );

        return;

    }


    document.getElementById(
        "verNombreUsuario"
    ).textContent =
        usuario.nombre_cliente || "-";


    document.getElementById(
        "verEmailUsuario"
    ).value =
        usuario.email_cliente || "-";


    document.getElementById(
        "verTelefonoUsuario"
    ).value =
        usuario.numero_cliente || "-";


    document.getElementById(
        "verEstadoUsuario"
    ).value =
        obtenerEstado(usuario);


    document.getElementById(
        "verNacimientoUsuario"
    ).value =
        formatearFecha(
            usuario.nacimiento_cliente
        );


    document.getElementById(
        "verRolUsuario"
    ).value =
        obtenerRol(usuario);


    document.getElementById(
        "verDireccionUsuario"
    ).value =
        usuario.direccion_cliente || "-";


    const imagen =
        document.getElementById(
            "verImagenUsuario"
        );


    if (imagen) {

        configurarImagenSegura(
            imagen,
            obtenerImagenUsuario(usuario)
        );

    }


    abrirModal(
        modalVerUsuario
    );

}


/*==========================================================
                ABRIR CAMBIAR ESTADO
==========================================================*/

function abrirCambiarEstadoUsuario(id) {

    const usuario =
        usuarios.find(
            u =>
                String(u.id_cliente) ===
                String(id)
        );


    if (!usuario) {

        console.error(
            "Usuario no encontrado:",
            id
        );

        return;

    }


    usuarioEliminarId =
        usuario.id_cliente;


    const estadoActual =
        obtenerEstado(usuario);


    const estaActivo =
        estadoActual.toLowerCase() ===
        "activo";


    const nombre =
        document.getElementById(
            "nombreEliminarUsuario"
        );


    const pregunta =
        document.getElementById(
            "preguntaEstadoUsuario"
        );


    const mensaje =
        document.getElementById(
            "mensajeEstadoUsuario"
        );


    const boton =
        document.getElementById(
            "cambiarEstadoUsuario"
        );


    const titulo =
        document.getElementById(
            "tituloEstadoUsuario"
        );


    const iconoTitulo =
        document.getElementById(
            "iconoTituloEstadoUsuario"
        );


    const iconoEstado =
        document.getElementById(
            "iconoEstadoUsuario"
        );


    if (nombre) {

        nombre.textContent =
            usuario.nombre_cliente || "-";

    }


    if (estaActivo) {

        if (titulo) {

            titulo.innerHTML = `
                <i
                    class="fa-solid fa-user-slash"
                    id="iconoTituloEstadoUsuario"
                ></i>

                Desactivar Usuario
            `;

        }


        if (pregunta) {

            pregunta.textContent =
                "¿Desactivar usuario?";

        }


        if (mensaje) {

            mensaje.innerHTML = `
                El usuario no será eliminado.

                Su estado pasará a
                <strong>Inactivo</strong>
                y conservará todos sus datos.
            `;

        }


        if (boton) {

            boton.textContent =
                "Desactivar";

            boton.classList.remove(
                "btn-success"
            );

            boton.classList.add(
                "btn-danger"
            );

        }


        if (iconoEstado) {

            iconoEstado.className =
                "fa-solid fa-triangle-exclamation";

        }

    } else {

        if (titulo) {

            titulo.innerHTML = `
                <i
                    class="fa-solid fa-user-check"
                    id="iconoTituloEstadoUsuario"
                ></i>

                Activar Usuario
            `;

        }


        if (pregunta) {

            pregunta.textContent =
                "¿Activar usuario?";

        }


        if (mensaje) {

            mensaje.innerHTML = `
                El usuario no será eliminado.

                Su estado pasará a
                <strong>Activo</strong>
                y conservará todos sus datos.
            `;

        }


        if (boton) {

            boton.textContent =
                "Activar";

            boton.classList.remove(
                "btn-danger"
            );

            boton.classList.add(
                "btn-success"
            );

        }


        if (iconoEstado) {

            iconoEstado.className =
                "fa-solid fa-user-check";

        }

    }


    abrirModal(
        modalEliminarUsuario
    );

}


/*==========================================================
                CONFIRMAR CAMBIO DE ESTADO
==========================================================*/

const cambiarEstadoUsuario =
    document.getElementById(
        "cambiarEstadoUsuario"
    );


if (cambiarEstadoUsuario) {

    cambiarEstadoUsuario.addEventListener(
        "click",
        async function () {

            if (!usuarioEliminarId) {

                console.error(
                    "No hay usuario seleccionado."
                );

                return;

            }


            const usuario =
                usuarios.find(
                    u =>
                        String(u.id_cliente) ===
                        String(usuarioEliminarId)
                );


            if (!usuario) {

                console.error(
                    "No se encontró el usuario seleccionado."
                );

                return;

            }


            const estadoActual =
                obtenerEstado(usuario);


            const estaActivo =
                estadoActual.toLowerCase() ===
                "activo";


            const nuevoEstado =
                estaActivo
                    ? "Inactivo"
                    : "Activo";


            const textoOriginal =
                cambiarEstadoUsuario.textContent;


            try {

                cambiarEstadoUsuario.disabled =
                    true;


                cambiarEstadoUsuario.textContent =
                    "Procesando...";


                console.log(
                    "========================================"
                );

                console.log(
                    "CAMBIAR ESTADO USUARIO"
                );

                console.log(
                    "ID:",
                    usuarioEliminarId
                );

                console.log(
                    "Estado actual:",
                    estadoActual
                );

                console.log(
                    "Nuevo estado:",
                    nuevoEstado
                );

                console.log(
                    "URL:",
                    `/admin/usuarios/estado/${usuarioEliminarId}`
                );

                console.log(
                    "========================================"
                );


                /*
                    ESTA ES LA RUTA CORRECTA
                    SEGÚN TU admin.py

                    PUT /admin/usuarios/estado/<id>
                */

                const response =
                    await fetch(
                        `/admin/usuarios/estado/${usuarioEliminarId}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    estado_cliente:
                                        nuevoEstado

                                })

                        }
                    );


                const resultado =
                    await obtenerRespuesta(
                        response
                    );


                console.log(
                    "STATUS:",
                    response.status
                );

                console.log(
                    "RESPUESTA:",
                    resultado
                );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        resultado.error ||
                        resultado.mensaje ||
                        `Error HTTP ${response.status}`
                    );

                }


                /*
                    Actualizamos el objeto local.
                */

                usuario.estado_cliente =
                    nuevoEstado;


                /*
                    Actualizamos también
                    la fila existente.
                */

                const fila =
                    tablaUsuarios?.querySelector(
                        `tr[data-id="${usuarioEliminarId}"]`
                    );


                if (fila) {

                    fila.dataset.estado =
                        nuevoEstado;


                    const estadoSpan =
                        fila.querySelector(
                            ".activo, .inactivo"
                        );


                    if (estadoSpan) {

                        estadoSpan.textContent =
                            nuevoEstado;


                        estadoSpan.classList.remove(
                            "activo",
                            "inactivo"
                        );


                        estadoSpan.classList.add(
                            nuevoEstado
                                .toLowerCase() ===
                            "activo"
                                ? "activo"
                                : "inactivo"
                        );

                    }


                    const botonEstado =
                        fila.querySelector(
                            ".eliminar"
                        );


                    if (botonEstado) {

                        botonEstado.dataset.estado =
                            nuevoEstado;


                        if (
                            nuevoEstado
                                .toLowerCase() ===
                            "activo"
                        ) {

                            botonEstado.title =
                                "Desactivar usuario";


                            botonEstado.innerHTML =
                                `<i class="fa-solid fa-user-slash"></i>`;

                        } else {

                            botonEstado.title =
                                "Activar usuario";


                            botonEstado.innerHTML =
                                `<i class="fa-solid fa-user-check"></i>`;

                        }

                    }

                }


                /*
                    Actualizar estadísticas.
                */

                actualizarEstadisticas();


                /*
                    Cerrar modal.
                */

                cerrarModal(
                    modalEliminarUsuario
                );


                usuarioEliminarId =
                    null;


                /*
                    Volvemos a aplicar filtros.
                */

                aplicarFiltros();


                alert(
                    `Usuario marcado como ${nuevoEstado}.`
                );


            } catch (error) {

                console.error(
                    "========================================"
                );

                console.error(
                    "ERROR CAMBIANDO ESTADO"
                );

                console.error(
                    error
                );

                console.error(
                    "========================================"
                );


                alert(
                    error.message ||
                    "No fue posible cambiar el estado del usuario."
                );


            } finally {

                cambiarEstadoUsuario.disabled =
                    false;


                cambiarEstadoUsuario.textContent =
                    textoOriginal;

            }

        }
    );

}


/*==========================================================
                INICIALIZAR
==========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "========================================"
        );

        console.log(
            "INICIALIZANDO USUARIOS ADMIN"
        );

        console.log(
            "========================================"
        );


        leerUsuariosDesdeTabla();

        aplicarFiltros();

    }
);