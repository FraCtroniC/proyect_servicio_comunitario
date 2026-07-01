import { sequelize } from '../models';

async function fixDB() {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE periodos_escolares ALTER COLUMN estatus TYPE VARCHAR(20);');
    console.log('Columna estatus actualizada a VARCHAR(20).');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixDB();
