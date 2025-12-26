console.log('🚀 Avvio Ripacandida API...');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

console.log('✅ Express configurato');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Presente' : 'MANCANTE');

// Test immediato
app.get('/', (req, res) => res.send('Ripacandida API OK!'));

app.get('/api/test', (req, res) => {
  console.log('📡 Test API chiamata');
  res.json({ status: 'OK', message: 'Ripacandida API attiva!' });
});

app.get('/api/places', async (req, res) => {
  console.log('📍 API places chiamata, lang:', req.query.lang);
  
  // Dati finti per test immediato
  const fakePlaces = [
    { id: 1, title: 'Chiesa Madre San Donato', description: 'Chiesa del XVI secolo', lat: 40.8701, lng: 15.7338, category: 'church' },
    { id: 2, title: 'Centro Storico', description: 'Cuore antico di Ripacandida', lat: 40.8706, lng: 15.7344, category: 'historic' },
    { id: 3, title: 'Piazza Umberto I', description: 'Piazza principale', lat: 40.8703, lng: 15.7340, category: 'square' }
  ];
  
  res.json(fakePlaces);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server in ascolto su porta ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
