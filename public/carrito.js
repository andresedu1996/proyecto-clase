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
        return;
    }
    
    carrito.forEach((producto, index) => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        let div = document.createElement("div");
        div.classList.add("col-md-4");
        div.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="text-success">$${producto.precio}</p>
                    <p>Cantidad: 
                        <button class="btn btn-sm btn-secondary disminuir" data-index="${index}">-</button>
                        <span>${producto.cantidad}</span>
                        <button class="btn btn-sm btn-secondary aumentar" data-index="${index}">+</button>
                    </p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <button class="btn btn-danger eliminar" data-index="${index}">Eliminar</button>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });

    document.getElementById("total").innerText = total.toFixed(2);

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

function realizarPedido() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
        Swal.fire("Error", "El carrito está vacío", "error");
        return;
    }

    Swal.fire({
        title: "Confirmar Pedido",
        text: "¿Estás seguro de que quieres realizar el pedido?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito");
            mostrarCarrito();
            Swal.fire("Pedido realizado", "Tu pedido ha sido enviado", "success");
        }
    });
}
