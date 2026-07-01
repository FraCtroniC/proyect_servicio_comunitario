import { sequelize } from '../models';

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.models.Auditoria.sync({ alter: true });
    console.log('Auditoria synced');
    console.log('All models synced successfully');
  } catch (e) {
    console.error('Error syncing:', e);
  } finally {
    process.exit();
  }
}

syncDb();
