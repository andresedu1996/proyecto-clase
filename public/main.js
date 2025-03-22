// Obtener el parámetro de la URL
const params = new URLSearchParams(window.location.search);
const tiendaNombre = params.get("nombre");

if (tiendaNombre) {
    document.title = tiendaNombre.charAt(0).toUpperCase() + tiendaNombre.slice(1);
    document.getElementById("titulo-tienda").textContent = `Bienvenido a ${tiendaNombre}`;

    // Obtener productos desde el servidor
    fetch(`/productos?nombre=${encodeURIComponent(tiendaNombre)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se encontraron productos para esta tienda.");
            }
            return response.json();
        })
        .then(data => {
            const productosContainer = document.getElementById("productos");
            productosContainer.innerHTML = ""; // Limpiar contenido anterior

            if (data.length === 0) {
                productosContainer.innerHTML = "<p>No hay productos disponibles.</p>";
                return;
            }

            // Mostrar los productos
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
                            <button class="btn btn-primary agregar-carrito" 
                                data-id="${producto.ID}" 
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}" 
                                data-imagen="${producto.imagen}">Agregar al Carrito</button>
                        </div>
                    </div>
                `;
                productosContainer.appendChild(div);
            });

            // Agregar eventos a los botones de "Agregar al Carrito"
            agregarEventosCarrito();
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            document.getElementById("productos").innerHTML = "<p>Error al cargar los productos.</p>";
        });
} else {
    document.getElementById("titulo-tienda").textContent = "Tienda no encontrada";
}

// Agregar eventos a los botones de agregar al carrito
function agregarEventosCarrito() {
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", function () {
            let id = this.dataset.id;
            let nombre = this.dataset.nombre;
            let precio = this.dataset.precio;
            let imagen = this.dataset.imagen;

            let producto = { id, nombre, precio, imagen, cantidad: 1 };

            // Obtener carrito del localStorage
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Verificar si el producto ya está en el carrito
            let index = carrito.findIndex(item => item.id === id);
            if (index !== -1) {
                carrito[index].cantidad++;
            } else {
                carrito.push(producto);
            }

            // Guardar carrito en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // Mostrar mensaje con Swal
            Swal.fire({
                title: "Producto agregado",
                text: `${nombre} se agregó al carrito`,
                icon: "success",
                confirmButtonText: "OK"
            });
        });
    });
}


fetch("http://localhost:3000/tiendas")
  .then((res) => res.json())
  .then((data) => {
    console.log("Tiendas:", data);
    // aquí generas el HTML de las tarjetas con la info
  })
  .catch((err) => console.error("Error:", err));

// Si no estamos viendo una tienda específica, cargar todas
if (!tiendaNombre) {
    fetch("/tiendas")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron obtener las tiendas.");
            }
            return response.json();
        })
        .then(tiendas => {
            const tiendasContainer = document.getElementById("tiendas");
            tiendasContainer.innerHTML = "";

            if (tiendas.length === 0) {
                tiendasContainer.innerHTML = "<p>No hay tiendas disponibles.</p>";
                return;
            }

            tiendas.forEach(tienda => {
                const col = document.createElement("div");
                col.className = "col-md-3";
                col.innerHTML = `
                    <div class="card mb-3">
                        <img src="${tienda.imagen}" class="card-img-top" alt="${tienda.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${tienda.nombre}</h5>
                            <p class="card-text">${tienda.descripcion || ''}</p>
                            <a href="index.html?nombre=${encodeURIComponent(tienda.nombre)}" class="btn btn-primary">Ver productos</a>
                        </div>
                    </div>
                `;
                tiendasContainer.appendChild(col);
            });
        })
        .catch(error => {
            console.error("Error al cargar tiendas:", error);
            document.getElementById("tiendas").innerHTML = "<p>Error al cargar tiendas.</p>";
        });
}