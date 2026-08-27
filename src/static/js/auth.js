async function fetchConToken(url, opciones = {}) {

    const token = localStorage.getItem("token");

    // Si no existe token
    if (!token) {
        window.location.href =
            "/login?mensaje=Debes%20iniciar%20sesion";

        return null;
    }

    opciones.headers = {
        ...opciones.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const respuesta = await fetch(url, opciones);

    // Token vencido o inválido
    if (respuesta.status === 401) {

        // Eliminar JWT
        localStorage.removeItem("token");

        // Cerrar sesión Flask
        await fetch("/auth/logout", {
            method: "POST"
        });

        // Mandar al login
        window.location.href =
            "/login?mensaje=Tu%20sesion%20ha%20expirado";

        return null;
    }

    return respuesta;
}