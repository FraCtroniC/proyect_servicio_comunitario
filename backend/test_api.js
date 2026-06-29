const http = require('http');

http.get('http://localhost:3000/api/docentes', {
  headers: {
    // Auth middleware might block it, let's see. Wait, I'll just check the db
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
}).on('error', err => console.log('Error:', err.message));
