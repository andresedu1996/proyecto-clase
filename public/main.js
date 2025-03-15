// Obtener el parámetro de la URL
const params = new URLSearchParams(window.location.search);
const tiendaNombre = params.get("nombre");

if (tiendaNombre) {
    // Cambiar el título de la página y el encabezado
    document.title = tiendaNombre.charAt(0).toUpperCase() + tiendaNombre.slice(1);
    document.getElementById("titulo-tienda").textContent = `Bienvenido a ${tiendaNombre}`;

    // Obtener productos desde el servidor Node.js
    fetch(`/productos?nombre=${tiendaNombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se encontraron productos para esta tienda.");
            }
            return response.json();
        })
        .then(data => {
            const productosContainer = document.getElementById("productos");
            productosContainer.innerHTML = ""; // Limpiar antes de agregar nuevos productos

            if (data.length === 0) {
                productosContainer.innerHTML = "<p>No hay productos disponibles en esta tienda.</p>";
                return;
            }

            data.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("col-md-4");
                div.innerHTML = `
                    <div class="card">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="text-success">$${producto.precio}</p>
                            <p>Unidades disponibles: ${producto.unidades}</p>
                        </div>
                    </div>
                `;
                productosContainer.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            document.getElementById("productos").innerHTML = "<p>Error al cargar los productos.</p>";
        });
} else {
    document.getElementById("titulo-tienda").textContent = "Tienda no encontrada";
}