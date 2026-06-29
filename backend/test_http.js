const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/docentes',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' // I don't have a token, it will return 401. But let's check!
  }
}, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});
req.on('error', e => console.log('ERR:', e));
req.end();
