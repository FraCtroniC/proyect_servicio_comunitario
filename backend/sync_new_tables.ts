import { sequelize } from './src/models';

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.models.Evaluacion.sync({ alter: true });
    console.log('Evaluacion synced');
    await sequelize.models.NotaParcial.sync({ alter: true });
    console.log('NotaParcial synced');
    await sequelize.models.AsistenciaEstudiante.sync({ alter: true });
    console.log('AsistenciaEstudiante synced');
    console.log('All new models synced successfully');
  } catch (e) {
    console.error('Error syncing:', e);
  } finally {
    process.exit();
  }
}

syncDb();
