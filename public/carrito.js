document.addEventListener("DOMContentLoaded", function () {
    mostrarCarrito();
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
    document.getElementById("realizar-pedido").addEventListener("click", realizarPedido);
});

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let contenedor = document.getElementById("carrito");
    let total = 0;

    contenedor.innerHTML = "";
    
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p class='text-center'>Tu carrito está vacío.</p>";
        document.getElementById("total").innerText = "0.00";
        document.getElementById("totalConEnvio").innerText = "0.00";
        return;
    }
    
    carrito.forEach((producto, index) => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        let div = document.createElement("div");
div.classList.add("d-flex", "align-items-center", "mb-3", "border", "p-3", "rounded");
div.style = `
    background: rgba(79, 78, 78, 0.28);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    gap: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;
div.style.gap = "15px";
div.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: auto; object-fit: cover; border-radius: 8px;">

    <div class="flex-grow-1 text-white">
        <h5 class="mb-1" style="font-size: 1.2rem;">${producto.nombre}</h5>
        <p class="mb-1" style="font-size: 1rem;">L.${producto.precio.toFixed(2)} x ${producto.cantidad} = L.${subtotal.toFixed(2)}</p>
        
        <div class="d-flex align-items-center gap-2 mt-2">
            <button class="btn btn-sm btn-outline-light disminuir" data-index="${index}">
                <i class="bi bi-dash-lg"></i>
            </button>
            <span style="font-size: 1.1rem;">${producto.cantidad}</span>
            <button class="btn btn-sm btn-outline-light aumentar" data-index="${index}">
                <i class="bi bi-plus-lg"></i>
            </button>
            <button class="btn btn-sm btn-danger eliminar ms-3" data-index="${index}">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    </div>
        `;
        contenedor.appendChild(div);
    });

    document.getElementById("total").innerText = total.toFixed(2);

    actualizarCostoEnvio(); // Llamamos a la función para actualizar el total con envío

    // Agregar eventos a botones
    document.querySelectorAll(".disminuir").forEach(boton => {
        boton.addEventListener("click", function () {
            let index = this.dataset.index;
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            }
        });
    });

    document.querySelectorAll(".aumentar").forEach(boton => {
        boton.addEventListener("click", function () {
            let index = this.dataset.index;
            carrito[index].cantidad++;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });
    });

    document.querySelectorAll(".eliminar").forEach(boton => {
        boton.addEventListener("click", function () {
            let index = this.dataset.index;
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });
    });
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}


function calcularCostoEnvio(direccion) {
    // Simulación de reglas de costo de envío
    if (direccion.toLowerCase().includes("centro") || direccion.toLowerCase().includes("ciudad")) {
        return 5.00; // Dentro de la ciudad
    } else {
        return 10.00; // Fuera de la ciudad
    }
}

function actualizarCostoEnvio() {
    let direccion = document.getElementById("direccion").value;
    let costoEnvio = calcularCostoEnvio(direccion);
    document.getElementById("costoEnvio").innerText = costoEnvio.toFixed(2);
    
    let total = parseFloat(document.getElementById("total").innerText);
    let totalConEnvio = total + costoEnvio;
    document.getElementById("totalConEnvio").innerText = totalConEnvio.toFixed(2);
}

document.getElementById("direccion").addEventListener("input", actualizarCostoEnvio);

function realizarPedido() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let direccion = document.getElementById("direccion").value;
    let costoEnvio = parseFloat(document.getElementById("costoEnvio").innerText);

    if (carrito.length === 0) {
        Swal.fire("Error", "El carrito está vacío", "error");
        return;
    }

    Swal.fire({
        title: "Confirmar Pedido",
        text: `Tu pedido será enviado a: ${direccion}. Costo de envío: $${costoEnvio}. ¿Confirmas?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/create-checkout-session', {  
                method: 'POST',
                body: JSON.stringify({ carrito: carrito, direccion: direccion, costoEnvio: costoEnvio }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(session => {
                localStorage.removeItem("carrito");
                mostrarCarrito();
                const stripe = Stripe('pk_test_51R37twCQDSjoSGpDeNFrhrtCqyZJVmoqvcLW0mPKWx2HDJuXLzTi6y6j6Ium2T7dIlUEeexW79hCQINYKWGxyYvF007cdqsniW');
                stripe.redirectToCheckout({ sessionId: session.id });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire("Error", "Hubo un problema al procesar el pago", "error");
            });
        }
    });
}