import { sequelize } from '../models';

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.models.Seccion.sync({ alter: true });
    console.log('Seccion synced (capacidad_maxima field added)');
    console.log('Sync completed successfully');
  } catch (e) {
    console.error('Error syncing:', e);
  } finally {
    process.exit();
  }
}

syncDb();
