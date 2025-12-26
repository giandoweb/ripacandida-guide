let map, userMarker, currentPoi = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Caricamento mappa...');
    
    // Inizializza mappa dopo 500ms per sicurezza
    setTimeout(initMap, 500);
    
    document.getElementById('lang-it').onclick = () => switchLang('it');
    document.getElementById('lang-en').onclick = () => switchLang('en');
    
    document.getElementById('geolocate').onclick = geolocate;
});

async function initMap() {
    console.log('Inizializzazione mappa...');
    
    map = L.map('map').setView([40.8706, 15.7344], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Carica POI dall'API Netlify
    try {
        console.log('Caricamento POI da API...');
        const response = await fetch('/api/places');
        const places = await response.json();
        
        console.log(`${places.length} POI caricati:`, places);
        
        places.forEach(place => {
            const marker = L.marker([place.lat, place.lng]).addTo(map)
                .bindPopup(`${place.title}<br>${place.description}`)
                .on('click', () => selectPoi(place.lat, place.lng, place));
        });
        
        // Aggiorna lista POI dinamica
        updatePoiList(places);
        
    } catch (err) {
        console.error('Errore API POI:', err);
        // Fallback POI statici
        const fallbackPois = [
            { lat: 40.8701, lng: 15.7338, title: 'Chiesa Madre Fallback', description: 'Fallback' },
            { lat: 40.8706, lng: 15.7344, title: 'Centro Storico Fallback', description: 'Fallback' }
        ];
        fallbackPois.forEach(poi => {
            L.marker([poi.lat, poi.lng]).addTo(map)
                .bindPopup(poi.title)
                .on('click', () => selectPoi(poi.lat, poi.lng, poi));
        });
        updatePoiList(fallbackPois);
    }
    
    // Marker centro Ripacandida
    L.marker([40.8706, 15.7344]).addTo(map)
        .bindPopup('Ripacandida Centro')
        .openPopup();
    
    console.log('Mappa caricata!');
}

function updatePoiList(places) {
    const container = document.getElementById('poi-list');
    if (!container) return;
    
    container.innerHTML = '<h3>Punti di Interesse</h3>';
    
    places.forEach(place => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.dataset.lat = place.lat;
        item.dataset.lng = place.lng;
        item.innerHTML = `
            <h4>${place.title}</h4>
            <p>${place.description}</p>
        `;
        item.onclick = () => selectPoi(place.lat, place.lng, place);
        container.appendChild(item);
    });
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
            
            // Se hai un POI selezionato, calcola percorso
            if (currentPoi) {
                calculateRoute(userMarker.getLatLng(), [currentPoi.lat, currentPoi.lng]);
            }
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
    // TODO: ricarica POI con lingua
}

function selectPoi(lat, lng, place) {
    map.setView([lat, lng], 17);
    currentPoi = { lat, lng, place };
    
    // Evidenzia POI selezionato
    document.querySelectorAll('.poi-item').forEach(item => {
        item.style.background = '';
    });
    event?.currentTarget?.style.background = '#e3f2fd';
    
    console.log('POI selezionato:', place?.title || 'sconosciuto');
}

function calculateRoute(start, end) {
    console.log('Calcolo percorso da', start, 'a', end);
    // TODO: Leaflet Routing Machine
}
