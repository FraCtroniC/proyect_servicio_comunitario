import { sequelize } from '../models';

async function clearGrades() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.models.NotaParcial.destroy({ where: {} });
    console.log('Notas Parciales cleared.');
    await sequelize.models.Calificacion.destroy({ where: {} });
    console.log('Calificaciones cleared.');
    console.log('Done.');
  } catch (e) {
    console.error('Error clearing grades:', e);
  } finally {
    process.exit();
  }
}

clearGrades();
