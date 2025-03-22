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

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const tipoUsuario = decoded.tipo;

            if (tipoUsuario === 'admin') {
                document.getElementById("adminLink").style.display = "block"; // Mostrar el enlace al dashboard
            }
        } catch (e) {
            console.error("Token inválido", e);
        }
    }
});
