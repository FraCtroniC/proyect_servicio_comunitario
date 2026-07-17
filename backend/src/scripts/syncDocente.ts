import { sequelize, Usuario } from '../models';

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('Sincronizando modelo Usuario para campos de docente...');
    await Usuario.sync({ alter: true });
    console.log('Usuario sincronizado exitosamente.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

sync();
