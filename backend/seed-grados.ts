import { sequelize } from './src/models';
import { GradoAno } from './src/models/GradoAno';

async function seedGrados() {
  try {
    await sequelize.authenticate();
    const count = await GradoAno.count();
    if (count === 0) {
      await GradoAno.bulkCreate([
        { id_grado: 1, numero: 1, nombre: '1er Año' },
        { id_grado: 2, numero: 2, nombre: '2do Año' },
        { id_grado: 3, numero: 3, nombre: '3er Año' },
        { id_grado: 4, numero: 4, nombre: '4to Año' },
        { id_grado: 5, numero: 5, nombre: '5to Año' },
      ]);
      console.log('Grados creados exitosamente');
    } else {
      console.log('Grados ya existen');
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seedGrados();
