import { sequelize } from '../models';
async function test() {
  await sequelize.authenticate();
  const [res] = await sequelize.query('SELECT * FROM momentos');
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
test();
