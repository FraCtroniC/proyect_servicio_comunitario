const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgresql://neondb_owner:npg_Z2rWfRlH8EGV@ep-late-tooth-at7fexxk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require', {
  logging: false,
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});
(async () => {
  try {
    const [dias] = await sequelize.query('SELECT * FROM dias_semana');
    console.log('DIAS:', dias);
    const [bloques] = await sequelize.query('SELECT * FROM bloques_horario');
    console.log('BLOQUES:', bloques);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await sequelize.close();
  }
})();
