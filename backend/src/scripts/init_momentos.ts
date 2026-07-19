import { sequelize, Momento, PeriodoEscolar, Calificacion } from '../models';

async function init() {
  await sequelize.authenticate();
  console.log('Limpiando calificaciones...');
  await Calificacion.destroy({ where: {} });
  console.log('Borrando momentos anteriores...');
  await Momento.destroy({ where: {} });
  
  const periodos = await PeriodoEscolar.findAll();
  for (const p of periodos) {
    await Momento.bulkCreate([
      { id_periodo: p.id_periodo, descripcion: 'Lapso 1', estatus: 'Abierto' },
      { id_periodo: p.id_periodo, descripcion: 'Lapso 2', estatus: 'Abierto' },
      { id_periodo: p.id_periodo, descripcion: 'Lapso 3', estatus: 'Abierto' }
    ]);
    console.log(`Momentos creados para periodo ${p.id_periodo}`);
  }
  process.exit(0);
}

init().catch(e => { console.error(e); process.exit(1); });
