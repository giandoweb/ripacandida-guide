let map, userMarker;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Caricamento mappa...');
    
    // Inizializza mappa dopo 500ms per sicurezza
    setTimeout(initMap, 500);
    
    document.getElementById('lang-it').onclick = () => switchLang('it');
    document.getElementById('lang-en').onclick = () => switchLang('en');
    
    document.getElementById('geolocate').onclick = geolocate;
    
    // POI cliccabili
    document.querySelectorAll('.poi-item').forEach(item => {
        item.onclick = () => {
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);
            map.setView([lat, lng], 17);
            if (userMarker) {
                calculateRoute(userMarker.getLatLng(), [lat, lng]);
            }
        };
    });
});

function initMap() {
    console.log('Inizializzazione mappa...');
    
    map = L.map('map').setView([40.8706, 15.7344], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Marker centro Ripacandida
    L.marker([40.8706, 15.7344]).addTo(map)
        .bindPopup('Ripacandida Centro')
        .openPopup();
    
    console.log('Mappa caricata!');
}

function geolocate() {
    if (!navigator.geolocation) {
        alert('Geolocalizzazione non supportata');
        return;
    }
    
    document.getElementById('geolocate').textContent = '🔄 Rilevamento...';
    
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            const loc = [pos.coords.latitude, pos.coords.longitude];
            if (userMarker) map.removeLayer(userMarker);
            
            userMarker = L.marker(loc, {
                icon: L.divIcon({
                    className: 'user-icon',
                    html: '📍',
                    iconSize: [30, 30]
                })
            }).addTo(map).bindPopup('La tua posizione');
            
            map.setView(loc, 16);
            document.getElementById('geolocate').textContent = '📍 Aggiorna posizione';
        },
        function(err) {
            alert('Errore geolocalizzazione: ' + err.message);
            document.getElementById('geolocate').textContent = '📍 La mia posizione';
        }
    );
}

function switchLang(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    console.log('Lingua cambiata:', lang);
}

function calculateRoute(start, end) {
    console.log('Calcolo percorso da', start, 'a', end);
    // TODO: integrazione routing nel backend
}
