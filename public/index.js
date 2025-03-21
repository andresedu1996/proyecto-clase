// index.js
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    
    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
        const userRole = decoded.role;

        // Mostrar el enlace al Dashboard solo si el rol es admin
        if (userRole === 'admin') {
            document.getElementById("adminLink").style.display = "block";
        } else {
            document.getElementById("adminLink").style.display = "none";
        }
    }
});
