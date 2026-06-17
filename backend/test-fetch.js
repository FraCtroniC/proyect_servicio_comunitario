fetch('http://localhost:3000/api/usuarios')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
