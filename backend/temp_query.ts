import { Usuario } from './src/models'; 
Usuario.findAll({ attributes: ['username', 'correo'] }).then(u => { 
  console.log(JSON.stringify(u, null, 2)); 
  process.exit(0); 
}).catch(e => {
  console.error(e);
  process.exit(1);
});
