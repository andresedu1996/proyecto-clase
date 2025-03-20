document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita que el formulario se recargue

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");
    errorDiv.innerHTML = ""; // Limpia mensajes de error anteriores

    try {
        const response = await fetch("http://localhost/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al iniciar sesión");
        }

        localStorage.setItem("token", data.token); // Guarda el token en localStorage
        alert("Inicio de sesión exitoso");

        // Redirige según el tipo de usuario
        const user = JSON.parse(atob(data.token.split(".")[1])); // Decodificar JWT
        if (user.role === "admin") {
            window.location.href = "admin.html";
        } else if (user.role === "cliente") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "empleado.html";
        }

    } catch (error) {
        errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
    }
});
