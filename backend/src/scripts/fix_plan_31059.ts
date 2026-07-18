import { sequelize, TipoPlanEstudio, Asignatura, PlanEstudio } from '../models';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const plan = await TipoPlanEstudio.findOne({ where: { nombre: 'Plan Oficial 31059' } });
    if (!plan) {
      console.log('No se encontró el Plan Oficial 31059');
      process.exit(1);
    }

    console.log('Actualizando materias del plan 31059...');
    
    // Obtenemos los planes actuales para este tipo de plan
    const planesActuales = await PlanEstudio.findAll({ where: { id_tipo_plan: plan.getDataValue('id_tipo_plan') } });

    const asignaturasRequeridas = [
      { nombre: 'Castellano y Literatura', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Inglés', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Matemática', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Educación Física y Deportes', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Educación Artística', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Estudios de la Naturaleza', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Historia de Venezuela', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Geografía General', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Formación Familiar y Ciudadana', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Educación para la Salud', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Geografía de Venezuela', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Ciencias Biológicas', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Física', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Química', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Cátedra Bolivariana', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Historia Contemporánea de Venezuela', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Instrucción Premilitar', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Ciencias de la Tierra', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Geografía Económica de Venezuela', tipo_calificacion: 'Cuantitativo' }
    ];

    const asignaturaIds: Record<string, number> = {};
    for (const a of asignaturasRequeridas) {
      let subject = await Asignatura.findOne({ where: { nombre: a.nombre } });
      if (!subject) {
        subject = await Asignatura.create({ nombre: a.nombre, tipo_calificacion: a.tipo_calificacion });
      }
      asignaturaIds[a.nombre] = subject.getDataValue('id_asignatura');
    }

    const planesConfig = [
      // 1er Año
      { grado: 1, asig: 'Castellano y Literatura', cod: 'CSL1', pos: 1 },
      { grado: 1, asig: 'Inglés', cod: 'ING1', pos: 2 },
      { grado: 1, asig: 'Matemática', cod: 'MAT1', pos: 3 },
      { grado: 1, asig: 'Estudios de la Naturaleza', cod: 'EDN1', pos: 4 },
      { grado: 1, asig: 'Historia de Venezuela', cod: 'HDV1', pos: 5 },
      { grado: 1, asig: 'Geografía General', cod: 'GEG1', pos: 6 },
      { grado: 1, asig: 'Formación Familiar y Ciudadana', cod: 'FFC1', pos: 7 },
      { grado: 1, asig: 'Educación Física y Deportes', cod: 'EFD1', pos: 8 },
      { grado: 1, asig: 'Educación Artística', cod: 'EDA1', pos: 9 },

      // 2do Año
      { grado: 2, asig: 'Castellano y Literatura', cod: 'CSL2', pos: 1 },
      { grado: 2, asig: 'Inglés', cod: 'ING2', pos: 2 },
      { grado: 2, asig: 'Matemática', cod: 'MAT2', pos: 3 },
      { grado: 2, asig: 'Educación para la Salud', cod: 'EPS2', pos: 4 },
      { grado: 2, asig: 'Historia de Venezuela', cod: 'HDV2', pos: 5 },
      { grado: 2, asig: 'Geografía de Venezuela', cod: 'GDV2', pos: 6 },
      { grado: 2, asig: 'Formación Familiar y Ciudadana', cod: 'FFC2', pos: 7 },
      { grado: 2, asig: 'Educación Física y Deportes', cod: 'EFD2', pos: 8 },
      { grado: 2, asig: 'Educación Artística', cod: 'EDA2', pos: 9 },

      // 3er Año
      { grado: 3, asig: 'Castellano y Literatura', cod: 'CSL3', pos: 1 },
      { grado: 3, asig: 'Inglés', cod: 'ING3', pos: 2 },
      { grado: 3, asig: 'Matemática', cod: 'MAT3', pos: 3 },
      { grado: 3, asig: 'Ciencias Biológicas', cod: 'CBI3', pos: 4 },
      { grado: 3, asig: 'Física', cod: 'FIS3', pos: 5 },
      { grado: 3, asig: 'Química', cod: 'QUI3', pos: 6 },
      { grado: 3, asig: 'Cátedra Bolivariana', cod: 'CAB3', pos: 7 },
      { grado: 3, asig: 'Geografía de Venezuela', cod: 'GDV3', pos: 8 },
      { grado: 3, asig: 'Educación Física y Deportes', cod: 'EFD3', pos: 9 },

      // 4to Año
      { grado: 4, asig: 'Castellano y Literatura', cod: 'CSL4', pos: 1 },
      { grado: 4, asig: 'Inglés', cod: 'ING4', pos: 2 },
      { grado: 4, asig: 'Matemática', cod: 'MAT4', pos: 3 },
      { grado: 4, asig: 'Ciencias Biológicas', cod: 'CBI4', pos: 4 },
      { grado: 4, asig: 'Física', cod: 'FIS4', pos: 5 },
      { grado: 4, asig: 'Química', cod: 'QUI4', pos: 6 },
      { grado: 4, asig: 'Historia Contemporánea de Venezuela', cod: 'HCV4', pos: 7 },
      { grado: 4, asig: 'Instrucción Premilitar', cod: 'IPM4', pos: 8 },
      { grado: 4, asig: 'Educación Física y Deportes', cod: 'EFD4', pos: 9 },

      // 5to Año
      { grado: 5, asig: 'Castellano y Literatura', cod: 'CSL5', pos: 1 },
      { grado: 5, asig: 'Inglés', cod: 'ING5', pos: 2 },
      { grado: 5, asig: 'Matemática', cod: 'MAT5', pos: 3 },
      { grado: 5, asig: 'Ciencias Biológicas', cod: 'CBI5', pos: 4 },
      { grado: 5, asig: 'Física', cod: 'FIS5', pos: 5 },
      { grado: 5, asig: 'Química', cod: 'QUI5', pos: 6 },
      { grado: 5, asig: 'Ciencias de la Tierra', cod: 'CDT5', pos: 7 },
      { grado: 5, asig: 'Geografía Económica de Venezuela', cod: 'GEV5', pos: 8 },
      { grado: 5, asig: 'Instrucción Premilitar', cod: 'IPM5', pos: 9 },
      { grado: 5, asig: 'Educación Física y Deportes', cod: 'EFD5', pos: 10 },
    ];

    console.log('Aplicando configuración...');
    const processedIds: number[] = [];

    for (const p of planesConfig) {
      const existing = planesActuales.find(
        (planExistente: any) => planExistente.getDataValue('id_grado') === p.grado && planExistente.getDataValue('posicion') === p.pos
      );

      if (existing) {
        await existing.update({
          id_asignatura: asignaturaIds[p.asig],
          codigo_asignatura: p.cod,
        });
        processedIds.push(existing.getDataValue('id_plan'));
      } else {
        const nuevo = await PlanEstudio.create({
          id_grado: p.grado,
          id_asignatura: asignaturaIds[p.asig],
          id_tipo_plan: plan.getDataValue('id_tipo_plan'),
          codigo_asignatura: p.cod,
          posicion: p.pos,
        });
        processedIds.push(nuevo.getDataValue('id_plan'));
      }
    }

    const toDelete = planesActuales.filter((planExistente: any) => !processedIds.includes(planExistente.getDataValue('id_plan')));
    for (const del of toDelete) {
      try {
        await del.destroy();
      } catch (e: any) {
        console.log(`No se pudo eliminar id_plan=${del.getDataValue('id_plan')} porque tiene evaluaciones. Modificando posición a un número alto.`);
        await del.update({ posicion: 99 });
      }
    }

    console.log('Script finalizado con éxito para el plan 31059.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

run();
