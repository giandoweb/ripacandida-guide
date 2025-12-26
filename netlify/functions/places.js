exports.handler = async (event, context) => {
  const lang = event.queryStringParameters?.lang || 'it';
  
  console.log(`API places chiamata: ${lang}`);
  
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
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(places)
  };
};
