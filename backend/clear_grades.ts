import { sequelize } from './src/models';

async function clearGrades() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    // Clear partial grades
    await sequelize.models.NotaParcial.destroy({ where: {} });
    console.log('Notas Parciales cleared.');

    // Clear final grades (calificaciones)
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
