require('dotenv').config();
const { Docente, sequelize } = require('./src/models/index');

async function testFindAll() {
  try {
    const docentes = await Docente.findAll();
    console.log("Success! Found", docentes.length, "docentes.");
  } catch (err) {
    console.error("Error in Docente.findAll():", err);
  } finally {
    await sequelize.close();
  }
}

testFindAll();
