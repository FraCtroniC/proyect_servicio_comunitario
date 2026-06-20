const { Matricula, PlanEstudio, EscalaCalificacion, Calificacion } = require('./src/models');
const { sequelize } = require('./src/models');

async function test() {
  try {
    await sequelize.authenticate();
    
    // Simulate what the payload is sending
    const id_matricula = 1; // Assuming Daniel Alvarez is ID 1
    const id_plan = 1;      // Assuming Castellano is ID 1
    const id_momento = 1;   // Lapso 1
    const id_escala = 15;   // Score 15
    
    console.log("Checking Matricula ID:", id_matricula);
    const m = await Matricula.findByPk(id_matricula);
    console.log("Matricula exists?", !!m);

    console.log("Checking PlanEstudio ID:", id_plan);
    const p = await PlanEstudio.findByPk(id_plan);
    console.log("PlanEstudio exists?", !!p);

    console.log("Checking EscalaCalificacion ID:", id_escala);
    const e = await EscalaCalificacion.findByPk(id_escala);
    console.log("Escala exists?", !!e);

    console.log("Trying to insert Calificacion...");
    const [record, created] = await Calificacion.findOrCreate({
      where: { id_matricula, id_plan, id_momento },
      defaults: { id_escala, inasistencias_asignatura: 0 }
    });
    console.log("SUCCESS! Created:", created);

  } catch(e) {
    console.error("ERROR:");
    console.error(e.message);
    if (e.original) console.error(e.original.message);
  } finally {
    process.exit();
  }
}
test();
