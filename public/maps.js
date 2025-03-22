
document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([15.530261, -88.032025], 13);
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