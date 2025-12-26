const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE con gestione errori
let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} catch (err) {
  console.error('Errore DB:', err);
}

// Test API
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', message: 'Ripacandida API attiva!' });
});

// API POI (con dati finti se DB non funziona)
app.get('/api/places', async (req, res) => {
  try {
    const lang = req.query.lang || 'it';
    
    // Se DB non configurato, usa dati finti
    if (!pool) {
      return res.json([
        { id: 1, title: 'Chiesa Madre San Donato', description: 'Chiesa del XVI secolo', lat: 40.8701, lng: 15.7338, category: 'church' },
        { id: 2, title: 'Centro Storico', description: 'Cuore antico di Ripacandida', lat: 40.8706, lng: 15.7344, category: 'historic' }
      ]);
    }
    
    const result = await pool.query(`
      SELECT id, title_${lang} as title, description_${lang} as description, 
             lat, lng, category FROM places WHERE active = true
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Errore API places:', err);
    res.status(500).json({ error: err.message });
  }
});

// Inizializza DB solo se connesso
async function initDB() {
  if (!pool) return console.log('DB non configurato');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS places (
        id SERIAL PRIMARY KEY,
        title_it TEXT, title_en TEXT,
        description_it TEXT, description_en TEXT,
        lat DOUBLE PRECISION, lng DOUBLE PRECISION,
        category TEXT, active BOOLEAN DEFAULT true
      );
    `);
    
    // Inserisci POI se tabella vuota
    const count = await pool.query('SELECT COUNT(*) FROM places');
    if (parseInt(count.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO places (title_it, title_en, description_it, description_en, lat, lng, category)
        VALUES 
          ('Chiesa Madre San Donato', 'San Donato Mother Church', 'Chiesa del XVI secolo', '16th century church', 40.8701, 15.7338, 'church'),
          ('Centro Storico', 'Historic Center', 'Cuore antico di Ripacandida', 'Ancient heart of Ripacandida', 40.8706, 15.7344, 'historic')
      `);
    }
    
    console.log('DB Ripacandida inizializzato!');
  } catch (err) {
    console.error('Errore initDB:', err);
  }
}

const PORT = process.env.PORT || 3000;
initDB();

app.listen(PORT, () => {
  console.log(`🚀 Ripacandida API su porta ${PORT}`);
});
