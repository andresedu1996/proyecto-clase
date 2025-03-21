// En logout.js
document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = "login.html"; // Redirigir al login
});
