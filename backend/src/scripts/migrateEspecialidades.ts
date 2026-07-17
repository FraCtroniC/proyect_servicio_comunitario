import { sequelize, Usuario, Especialidad } from '../models';

async function migrateEspecialidades() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    console.log('Verificando especialidades...');
    await Especialidad.sync({ alter: true });

    console.log('Sincronizando modelo Usuario...');
    await Usuario.sync({ alter: true });

    console.log('Migración de especialidades completada.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

migrateEspecialidades();
