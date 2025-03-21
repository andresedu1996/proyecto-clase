// dashboard.js
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    
    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
        const userRole = decoded.role;

        // Verificar si el usuario es admin
        if (userRole !== 'admin') {
            // Si no es admin, redirigir al inicio
            window.location.href = "index.html";
        } else {
            // Si es admin, mostrar el contenido del dashboard
            document.getElementById("adminContent").style.display = "block";
        }
    } else {
        // Si no hay token, redirigir al login
        window.location.href = "login.html";
    }
});
