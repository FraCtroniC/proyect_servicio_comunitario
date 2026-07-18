import { sequelize, TipoPlanEstudio, PlanEstudio, Asignatura } from '../models';

async function verify() {
  await sequelize.authenticate();
  const planes = await PlanEstudio.findAll({
    include: [{ model: Asignatura, as: 'asignatura' }, { model: TipoPlanEstudio, as: 'tipo_plan' }],
    order: [['id_grado', 'ASC'], ['posicion', 'ASC']]
  });
  console.log(`Found ${planes.length} total planes.`);
  for (const p of planes.slice(0, 10)) {
    console.log(`${(p as any).tipo_plan.nombre} - G${p.getDataValue('id_grado')} - P${p.getDataValue('posicion')} - ${(p as any).asignatura.nombre}`);
  }
  process.exit(0);
}
verify();
