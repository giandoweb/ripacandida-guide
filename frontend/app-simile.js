let map, userMarker, currentLang = 'it';

const translations = {
    it: {
        titlePoi: 'Punti di Interesse',
        titleItinerari: 'Itinerari'
    },
    en: {
        titlePoi: 'Points of Interest',
        titleItinerari: 'Itineraries'
    }
};

const pois = [
    { id: 1, title: 'Chiesa Madre San Donato', desc: 'Chiesa del XVI secolo', lat: 40.8701, lng: 15.7338, icon: '⛪' },
    { id: 2, title: 'Centro Storico', desc: 'Cuore antico del paese', lat: 40.8706, lng: 15.7344, icon: '🏰' },
    { id: 3, title: 'Piazza Umberto I', desc: 'Piazza principale', lat: 40.8703, lng: 15.7340, icon: '🌳' },
    { id: 4, title: "Torre dell'Orologio", desc: 'Simbolo del paese', lat: 40.8705, lng: 15.7342, icon: '🗼' },
    { id: 5, title: 'Chiesa Santa Maria', desc: 'Antica chiesa parrocchiale', lat: 40.8698, lng: 15.7350, icon: '⛪' },
    { id: 6, title: 'Belvedere Vulture', desc: 'Punto panoramico', lat: 40.8712, lng: 15.7325, icon: '🌅' },
    { id: 7, title: 'Fontana Piazza', desc: 'Fontana storica', lat: 40.8704, lng: 15.7341, icon: '⛲' },
    { id: 8, title: 'Palazzo Comunale', desc: 'Sede municipale', lat: 40.8700, lng: 15.7335, icon: '🏛️' }
];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initUI();
});

function initMap() {
    map = L.map('map').setView([40.8706, 15.7344], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap | Ripacandida Guide'
    }).addTo(map);
    
    // Aggiungi tutti i POI
    pois.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lng]).addTo(map)
            .bindPopup(`<b>${poi.icon} ${poi.title}</b><br>${poi.desc}`)
            .on('click', () => showPoiDetails(poi));
    });
    
    updateUI();
}

function initUI() {
    document.getElementById('lang-it').onclick = () => switchLang('it');
    document.getElementById('lang-en').onclick = () => switchLang('en');
    document.getElementById('geolocate').onclick = geolocate;
    document.getElementById('menu-toggle').onclick = toggleMenu;
    
    // Event listeners POI e itinerari
    document.addEventListener('click', (e) => {
        if (e.target.closest('.poi-item')) showPoiDetails(pois.find(p => p.id == e.target.closest('.poi-item').dataset.id));
        if (e.target.closest('.itinerario')) showItinerario(e.target.closest('.itinerario').dataset.places);
    });
}

function switchLang(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    updateUI();
}

function updateUI() {
    document.getElementById('title-poi').textContent = translations[currentLang].titlePoi;
    document.getElementById('title-itinerari').textContent = translations[currentLang].titleItinerari;
    
    const poiList = document.getElementById('poi-list');
    poiList.innerHTML = '';
    
    pois.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.dataset.id = poi.id;
        item.innerHTML = `<h4>${poi.icon} ${poi.title}</h4><p>${poi.desc}</p>`;
        poiList.appendChild(item);
    });
}

function geolocate() {
    if (!navigator.geolocation) return alert('Geolocalizzazione non supportata');
    
    document.getElementById('geolocate').textContent = '🔄';
    navigator.geolocation.getCurrentPosition(pos => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        if (userMarker) map.removeLayer(userMarker);
        
        userMarker = L.marker(loc, {
            icon: L.divIcon({className: 'user-icon', html: '📍', iconSize: [30, 30]})
        }).addTo(map).bindPopup('👤 La tua posizione');
        
        map.setView(loc, 16);
        document.getElementById('geolocate').textContent = '📍';
    }, () => {
        document.getElementById('geolocate').textContent = '❌';
        setTimeout(() => document.getElementById('geolocate').textContent = '📍', 2000);
    });
}

function showPoiDetails(poi) {
    map.setView([poi.lat, poi.lng], 18);
    const popup = L.popup()
        .setLatLng([poi.lat, poi.lng])
        .setContent(`<b>${poi.icon} ${poi.title}</b><br>${poi.desc}`)
        .openOn(map);
}

function showItinerario(placesStr) {
    const placesIds = placesStr.split(',').map(id => parseInt(id));
    const itineraryPois = pois.filter(poi => placesIds.includes(poi.id));
    
    // Fit bounds all'itinerario
    const group = new L.featureGroup();
    itineraryPois.forEach(poi => {
        L.marker([poi.lat, poi.lng]).addTo(group);
    });
    map.fitBounds(group.getBounds());
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}
