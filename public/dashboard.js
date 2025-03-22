document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const tipoUsuario = decoded.tipo;

        if (tipoUsuario !== 'admin') {
            window.location.href = "index.html";
        } else {
            // Mostrar contenido del dashboard
            document.getElementById("adminContent").style.display = "block";
        }
    } catch (e) {
        console.error("Token inválido", e);
        window.location.href = "login.html";
    }
});
