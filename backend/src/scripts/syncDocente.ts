import { sequelize, Docente } from '../models';

async function syncDocente() {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();

    console.log('Sincronizando modelo Docente para agregar fecha_nac...');
    await Docente.sync({ alter: true });

    console.log('Migración completada.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

syncDocente();
