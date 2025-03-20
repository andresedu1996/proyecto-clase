async function verificarSesion() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión");
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("http://localhost/api/verify.php", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.json();
    if (!response.ok) {
        alert("Sesión inválida. Inicia sesión nuevamente.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

// Llamar esta función en cada página protegida
verificarSesion();
