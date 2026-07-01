const http = require('http');

const data = JSON.stringify({
  nombre: '2026-2027',
  estatus: 'Planificación'
});

// Assuming server is running on 3001 or 3000. Need to check port.
// I'll just check .env first.
