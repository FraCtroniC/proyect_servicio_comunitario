const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/proyecto_servicio_comunitario', { logging: false });
async function run() {
  const [dias] = await sequelize.query('SELECT * FROM dias_semana');
  console.log('Dias:', dias);
  const [bloques] = await sequelize.query('SELECT * FROM bloques_horario');
  console.log('Bloques:', bloques);
  await sequelize.close();
}
run();
