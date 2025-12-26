console.log('🚀 AVVIO RIPACANDIDA API...');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('✅ Express configurato OK');

// ROOT - test base
app.get('/', (req, res) => {
  console.log('🏠 Root chiamata');
  res.json({ status: 'Ripacandida API LIVE!', timestamp: new Date().toISOString() });
});

// API POI - dati reali Ripacandida
app.get('/api/places', (req, res) => {
  console.log('📍 Places API chiamata, lang:', req.query.lang || 'it');
  
  const places = [
    {
      id: 1,
      title: 'Chiesa Madre San Donato',
      description: 'Chiesa del XVI secolo con affreschi preziosi',
      lat: 40.8701,
      lng: 15.7338,
      category: 'church'
    },
    {
      id: 2,
      title: 'Centro Storico',
      description: 'Cuore antico di Ripacandida con palazzi storici',
      lat: 40.8706,
      lng: 15.7344,
      category: 'historic'
    },
    {
      id: 3,
      title: 'Piazza Umberto I',
      description: 'Piazza principale con vista sul Vulture',
      lat: 40.8703,
      lng: 15.7340,
      category: 'square'
    },
    {
      id: 4,
      title: "Torre dell'Orologio",
      description: 'Simbolo del paese con vista panoramica',
      lat: 40.8705,
      lng: 15.7342,
      category: 'tower'
    }
  ];
  
  res.json(places);
});

// API itinerari
app.get('/api/itineraries', (req, res) => {
  console.log('🛤️ Itineraries API chiamata');
  res.json([
    {
      id: 1,
      title: 'Centro Storico',
      description: 'Percorso completo del cuore antico'
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server LIVE su porta ${PORT}`);
  console.log(`🌐 Testa: http://localhost:${PORT}`);
});
