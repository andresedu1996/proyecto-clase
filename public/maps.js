/*

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
    autocomplete = new google.maps.places.Autocomplete(inputDireccion, {
        componentRestrictions: { country: "HN" }, // Limitar autocompletado a Honduras
        fields: ["formatted_address", "geometry.location"], // Obtener dirección y coordenadas
    });

    autocomplete.addListener("place_changed", function () {
        let place = autocomplete.getPlace();
        if (!place.geometry) {
            Swal.fire("Error", "No se encontraron coordenadas para la dirección ingresada.", "error");
            return;
        }
    });
}

function calcularRuta() {
    let direccionDestino = document.getElementById("direccion").value;
    if (!direccionDestino) {
        Swal.fire("Error", "Por favor, ingresa una dirección.", "error");
        return;
    }

    let origen = "Tienda ShopZone, Centro, San Pedro Sula, Honduras"; // Dirección de la tienda
    let destino = direccionDestino;

    let request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Obtener distancia en km
            let distanciaKm = result.routes[0].legs[0].distance.value / 1000;
            let costoEnvio = distanciaKm * 2; // $2 por km
            document.getElementById("costoEnvio").innerText = costoEnvio.toFixed(2);

            // Obtener total actual del carrito y actualizar total con envío
            let totalActual = parseFloat(document.getElementById("total").innerText);
            let totalConEnvio = totalActual + costoEnvio;
            document.getElementById("totalConEnvio").innerText = totalConEnvio.toFixed(2);
        } else {
            Swal.fire("Error", "No se pudo calcular la ruta: " + status, "error");
        }
    });
}
*/
document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([15.530261, -88.032025], 12);
    let rutaLayer = L.layerGroup().addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker = L.marker([15.530261, -88.032025]).addTo(map).bindPopup('Tienda ShopZone');

    window.calcularRuta = function () {
        let direccionDestino = document.getElementById("direccion").value;
        if (!direccionDestino) {
            Swal.fire("Error", "Por favor, ingresa una dirección.", "error");
            return;
        }

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${direccionDestino}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    Swal.fire("Error", "Dirección no encontrada.", "error");
                    return;
                }

                let destinoLat = data[0].lat;
                let destinoLng = data[0].lon;

                rutaLayer.clearLayers();
                L.marker([destinoLat, destinoLng]).addTo(rutaLayer).bindPopup("Destino");

                let osrmUrl = `https://router.project-osrm.org/route/v1/driving/-88.032025,15.530261;${destinoLng},${destinoLat}?overview=full&geometries=geojson`;

                fetch(osrmUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.code !== "Ok") {
                            Swal.fire("Error", "No se pudo calcular la ruta.", "error");
                            return;
                        }

                        let distanciaKm = data.routes[0].distance / 1000;
                        let costoEnvio = distanciaKm * 2;

                        document.getElementById("costoEnvio").innerText = costoEnvio.toFixed(2);
                        let totalActual = parseFloat(document.getElementById("total").innerText);
                        document.getElementById("totalConEnvio").innerText = (totalActual + costoEnvio).toFixed(2);

                        let routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(rutaLayer);
                    });
            });
    };
});