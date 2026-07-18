import { sequelize, TipoPlanEstudio, Asignatura, PlanEstudio, GradoAno } from '../models';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const plan = await TipoPlanEstudio.findOne({ where: { nombre: 'Plan Oficial 32011' } });
    if (!plan) {
      console.log('No se encontró el Plan Oficial 32011');
      process.exit(1);
    }

    console.log('Actualizando materias existentes del plan 32011...');
    
    // Obtenemos los planes actuales para este tipo de plan
    const planesActuales = await PlanEstudio.findAll({ where: { id_tipo_plan: plan.getDataValue('id_tipo_plan') } });

    const asignaturasRequeridas = [
      { nombre: 'Castellano', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Inglés', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Matemática', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Educación Física', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Arte y Patrimonio', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Ciencias Naturales', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Geografía, Historia y Ciudadanía', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Orientación y Convivencia', tipo_calificacion: 'Cualitativo' },
      { nombre: 'Grupos de Creación, Recreación y Producción', tipo_calificacion: 'Cualitativo' },
      { nombre: 'Biología', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Física', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Química', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Formación para la Soberanía Nacional', tipo_calificacion: 'Cuantitativo' },
      { nombre: 'Ciencias de la Tierra', tipo_calificacion: 'Cuantitativo' },
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
      { grado: 1, asig: 'Castellano', cod: 'CAS1', pos: 1 },
      { grado: 1, asig: 'Inglés', cod: 'ING1', pos: 2 },
      { grado: 1, asig: 'Matemática', cod: 'MAT1', pos: 3 },
      { grado: 1, asig: 'Educación Física', cod: 'EDF1', pos: 4 },
      { grado: 1, asig: 'Arte y Patrimonio', cod: 'AYP1', pos: 5 },
      { grado: 1, asig: 'Ciencias Naturales', cod: 'CSN1', pos: 6 },
      { grado: 1, asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC1', pos: 7 },
      { grado: 1, asig: 'Orientación y Convivencia', cod: 'OYC1', pos: 8 },
      { grado: 1, asig: 'Grupos de Creación, Recreación y Producción', cod: 'CRP1', pos: 9 },

      // 2do Año
      { grado: 2, asig: 'Castellano', cod: 'CAS2', pos: 1 },
      { grado: 2, asig: 'Inglés', cod: 'ING2', pos: 2 },
      { grado: 2, asig: 'Matemática', cod: 'MAT2', pos: 3 },
      { grado: 2, asig: 'Educación Física', cod: 'EDF2', pos: 4 },
      { grado: 2, asig: 'Arte y Patrimonio', cod: 'AYP2', pos: 5 },
      { grado: 2, asig: 'Ciencias Naturales', cod: 'CSN2', pos: 6 },
      { grado: 2, asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC2', pos: 7 },
      { grado: 2, asig: 'Orientación y Convivencia', cod: 'OYC2', pos: 8 },
      { grado: 2, asig: 'Grupos de Creación, Recreación y Producción', cod: 'CRP2', pos: 9 },

      // 3er Año
      { grado: 3, asig: 'Castellano', cod: 'CAS3', pos: 1 },
      { grado: 3, asig: 'Inglés', cod: 'ING3', pos: 2 },
      { grado: 3, asig: 'Matemática', cod: 'MAT3', pos: 3 },
      { grado: 3, asig: 'Educación Física', cod: 'EDF3', pos: 4 },
      { grado: 3, asig: 'Biología', cod: 'BIO3', pos: 5 },
      { grado: 3, asig: 'Física', cod: 'FIS3', pos: 6 },
      { grado: 3, asig: 'Química', cod: 'QUI3', pos: 7 },
      { grado: 3, asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC3', pos: 8 },
      { grado: 3, asig: 'Orientación y Convivencia', cod: 'OYC3', pos: 9 },
      { grado: 3, asig: 'Grupos de Creación, Recreación y Producción', cod: 'CRP3', pos: 10 },

      // 4to Año
      { grado: 4, asig: 'Castellano', cod: 'CAS4', pos: 1 },
      { grado: 4, asig: 'Inglés', cod: 'ING4', pos: 2 },
      { grado: 4, asig: 'Matemática', cod: 'MAT4', pos: 3 },
      { grado: 4, asig: 'Educación Física', cod: 'EDF4', pos: 4 },
      { grado: 4, asig: 'Biología', cod: 'BIO4', pos: 5 },
      { grado: 4, asig: 'Física', cod: 'FIS4', pos: 6 },
      { grado: 4, asig: 'Química', cod: 'QUI4', pos: 7 },
      { grado: 4, asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC4', pos: 8 },
      { grado: 4, asig: 'Formación para la Soberanía Nacional', cod: 'FSN4', pos: 9 },
      { grado: 4, asig: 'Orientación y Convivencia', cod: 'OYC4', pos: 10 },
      { grado: 4, asig: 'Grupos de Creación, Recreación y Producción', cod: 'CRP4', pos: 11 },

      // 5to Año
      { grado: 5, asig: 'Castellano', cod: 'CAS5', pos: 1 },
      { grado: 5, asig: 'Inglés', cod: 'ING5', pos: 2 },
      { grado: 5, asig: 'Matemática', cod: 'MAT5', pos: 3 },
      { grado: 5, asig: 'Educación Física', cod: 'EDF5', pos: 4 },
      { grado: 5, asig: 'Biología', cod: 'BIO5', pos: 5 },
      { grado: 5, asig: 'Física', cod: 'FIS5', pos: 6 },
      { grado: 5, asig: 'Química', cod: 'QUI5', pos: 7 },
      { grado: 5, asig: 'Ciencias de la Tierra', cod: 'CDT5', pos: 8 },
      { grado: 5, asig: 'Geografía, Historia y Ciudadanía', cod: 'GHC5', pos: 9 },
      { grado: 5, asig: 'Formación para la Soberanía Nacional', cod: 'FSN5', pos: 10 },
      { grado: 5, asig: 'Orientación y Convivencia', cod: 'OYC5', pos: 11 },
      { grado: 5, asig: 'Grupos de Creación, Recreación y Producción', cod: 'CRP5', pos: 12 },
    ];

    console.log('Aplicando configuración...');
    const processedIds: number[] = [];

    for (const p of planesConfig) {
      // Buscar si ya existe una materia en esa posicion para ese grado y plan
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

    // Borrar las materias sobrantes que no estaban en la configuracion oficial
    const toDelete = planesActuales.filter((planExistente: any) => !processedIds.includes(planExistente.getDataValue('id_plan')));
    for (const del of toDelete) {
      try {
        await del.destroy();
      } catch (e: any) {
        console.log(`No se pudo eliminar id_plan=${del.getDataValue('id_plan')} porque tiene evaluaciones. Modificando posición a un número alto.`);
        await del.update({ posicion: 99 });
      }
    }

    console.log('Script finalizado con éxito.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

run();
