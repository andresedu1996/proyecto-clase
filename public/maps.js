let map;
let directionsService;
let directionsRenderer;
let autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 15.530261144379857, lng: -88.03202504600166 }, // Ceutec SC
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

 // Habilitar Autocompletado en el input de dirección
 let inputDireccion = document.getElementById("direccion");
 autocomplete = new google.maps.places.Autocomplete(inputDireccion);
 autocomplete.setFields(["formatted_address", "geometry"]); // Obtiene dirección formateada y coordenadas
}



function calcularRuta() {
    let direccionDestino = document.getElementById("direccion").value;
    if (!direccionDestino) {
        Swal.fire("Error", "Por favor, ingresa una dirección.", "error");
        return;
    }

    let origen = "Tienda ShopZone, Centro"; // Dirección de la tienda
    let destino = direccionDestino;

    let request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Calcular costo de envío según distancia
            let distanciaKm = result.routes[0].legs[0].distance.value / 1000; // En km
            let costoEnvio = distanciaKm * 2; // $2 por km
            document.getElementById("costoEnvio").innerText = costoEnvio.toFixed(2);

            // Obtener total actual del carrito
            let totalActual = parseFloat(document.getElementById("total").innerText);
            let totalConEnvio = totalActual + costoEnvio;

            document.getElementById("totalConEnvio").innerText = totalConEnvio.toFixed(2);
        } else {
            Swal.fire("Error", "No se pudo calcular la ruta.", "error");
        }
    });
}
