let map, userMarker, currentPoi = null;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initLanguage();
    initEvents();
});

function initMap() {
    map = L.map('map').setView([40.8706, 15.7344], 15); // Ripacandida
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // POI iniziali
    const pois = [
        { lat: 40.8706, lng: 15.7344, title: 'Centro Storico' },
        { lat: 40.8701, lng: 15.7338, title: 'Chiesa Madre' }
    ];
    
    pois.forEach(poi => {
        L.marker([poi.lat, poi.lng]).addTo(map)
            .bindPopup(poi.title)
            .on('click', () => selectPoi(poi.lat, poi.lng));
    });
}

function initLanguage() {
    document.getElementById('lang-it').onclick = () => switchLang('it');
    document.getElementById('lang-en').onclick = () => switchLang('en');
}

function switchLang(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    // TODO: traduci contenuti
}

function initEvents() {
    document.getElementById('geolocate').onclick = geolocate;
    document.querySelectorAll('.poi-item').forEach(item => {
        item.onclick = () => {
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);
            selectPoi(lat, lng);
        };
    });
}

function geolocate() {
    if (!navigator.geolocation) return alert('Geolocalizzazione non supportata');
    navigator.geolocation.getCurrentPosition(pos => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(loc).addTo(map).bindPopup('Tu sei qui');
        map.setView(loc, 16);
    });
}

function selectPoi(lat, lng) {
    map.setView([lat, lng], 17);
    currentPoi = { lat, lng };
}
