const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE (Render lo imposterà automaticamente)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Inizializza DB con POI di Ripacandida
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS places (
      id SERIAL PRIMARY KEY,
      title_it TEXT, title_en TEXT,
      description_it TEXT, description_en TEXT,
      lat DOUBLE PRECISION, lng DOUBLE PRECISION,
      category TEXT, active BOOLEAN DEFAULT true
    );
  `);
  
  // POI di Ripacandida reali
  await pool.query(`
    INSERT INTO places (title_it, title_en, description_it, description_en, lat, lng, category)
    VALUES 
      ('Chiesa Madre San Donato', 'San Donato Mother Church', 'Chiesa del XVI secolo con affreschi preziosi', '16th century church with precious frescoes', 40.8701, 15.7338, 'church'),
      ('Centro Storico', 'Historic Center', 'Cuore antico di Ripacandida con palazzi storici', 'Ancient heart of Ripacandida with historic buildings', 40.8706, 15.7344, 'historic'),
      ('Piazza Umberto I', 'Umberto I Square', 'Piazza principale con vista sul Vulture', 'Main square with Vulture mountain view', 40.8703, 15.7340, 'square'),
      ('Torre dell''Orologio', 'Clock Tower', 'Simbolo del paese con vista panoramica', 'Town symbol with panoramic view', 40.8705, 15.7342, 'tower')
    ON CONFLICT DO NOTHING;
  `);
  
  console.log('DB inizializzato con POI Ripacandida!');
}

// API POI
app.get('/api/places', async (req, res) => {
  try {
    const lang = req.query.lang || 'it';
    const result = await pool.query(`
      SELECT id, title_${lang} as title, description_${lang} as description, 
             lat, lng, category FROM places WHERE active = true
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test API
app.get('/api/test', (req, res) => res.json({ status: 'OK', message: 'Ripacandida API attiva!' }));

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server su porta ${PORT}`));
});
