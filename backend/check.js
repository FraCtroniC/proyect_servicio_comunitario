require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

async function run() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT * FROM docentes LIMIT 1');
    console.log("Success:", results);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await sequelize.close();
  }
}
run();
