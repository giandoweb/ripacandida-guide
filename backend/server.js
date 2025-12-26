const express = require('express');
const cors = require('cors');

console.log('🚀 RIPACANDIDA API - START');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('GET / OK');
  res.send('Ripacandida API LIVE!');
});

app.get('/api/places', (req, res) => {
  console.log('GET /api/places');
  res.json([
    {id:1, title:'Chiesa Madre', lat:40.8701, lng:15.7338, category:'church'},
    {id:2, title:'Centro Storico', lat:40.8706, lng:15.7344, category:'historic'},
    {id:3, title:'Piazza Umberto', lat:40.8703, lng:15.7340, category:'square'}
  ]);
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ LIVE su porta ${port}`);
});
