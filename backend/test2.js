const http = require('http');

async function run() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'arturo', password: '1234' })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginRes.status, loginData);
    
    if (!loginData.data || !loginData.data.token) {
      console.log('No token');
      return;
    }
    const token = loginData.data.token;

    // 2. Patch Periodo 6
    const patchRes = await fetch('http://localhost:3000/api/periodos/6', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estatus: 'Activo' })
    });
    const patchData = await patchRes.json();
    console.log('Patch Status:', patchRes.status);
    console.log('Patch Data:', patchData);
  } catch (e) {
    console.error(e);
  }
}

run();
