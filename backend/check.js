const { Client } = require('pg');
const client = new Client({ user: 'postgres', password: 'password', host: 'localhost', database: 'proyecto_sc' });
client.connect().then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'secciones'"))
  .then(res => { console.log(res.rows.map(r => r.column_name)); client.end(); })
  .catch(console.error);
