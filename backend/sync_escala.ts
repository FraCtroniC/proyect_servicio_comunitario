import { sequelize } from './src/models';

async function syncEscala() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    // Sync table
    await sequelize.models.EscalaCalificacion.sync({ alter: true });
    console.log('EscalaCalificacion table synced');
    
    // Check if empty
    const count = await sequelize.models.EscalaCalificacion.count();
    if (count === 0) {
      // Seed 1 to 20
      const data = [];
      for (let i = 1; i <= 20; i++) {
        data.push({
          id_escala: i,
          nota_impresa: String(i).padStart(2, '0'),
          nota_literal: i >= 10 ? 'Aprobado' : 'Reprobado',
          nota_calculo: i,
          ponderacion_letra: i >= 10 ? 'A' : 'D',
        });
      }
      await sequelize.models.EscalaCalificacion.bulkCreate(data);
      console.log('Inserted 20 scale records');
    }
    
  } catch (e) {
    console.error('Error syncing:', e);
  } finally {
    process.exit();
  }
}

syncEscala();
