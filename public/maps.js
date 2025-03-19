let map;
let directionsService;
let directionsRenderer;

fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origen}&destination=${destino}&key=AIzaSyApoVw2YRyjWtvkj02sKM4kaOZDIO9XUV0`)

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 14.6349, lng: -90.5069 }, // Ubicación de referencia (Ciudad de Guatemala)
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function calcularRuta() {
    let direccionDestino = document.getElementById("direccion").value;
    if (!direccionDestino) return;

    let origen = "Tienda ShopZone, Centro"; // Dirección de origen
    let destino = direccionDestino;

    let request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("No se pudo calcular la ruta.");
        }
    });
}

document.getElementById("direccion").addEventListener("change", calcularRuta);
window.onload = initMap;
