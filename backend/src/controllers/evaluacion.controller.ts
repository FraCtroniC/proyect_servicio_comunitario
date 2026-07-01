import { Request, Response } from 'express';
import { Evaluacion, NotaParcial, Matricula, Calificacion, PlanEstudio, PeriodoEscolar, Momento } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const EvaluacionController = {
  // Obtener planes de evaluación
  listarPlanes: wrapAsync(async (req: Request, res: Response) => {
    const result = await Evaluacion.findAll({
      include: [{ model: Momento, as: 'momento' }]
    });
    res.json({ data: result });
  }),

  // Guardar plan de evaluación (sobrescribe cortes anteriores para ese plan/seccion/momento)
  upsertPlan: wrapAsync(async (req: Request, res: Response) => {
    const { id_plan, id_seccion, id_momento, evaluaciones } = req.body;
    
    if (!id_plan || !id_seccion || !id_momento || !Array.isArray(evaluaciones)) {
      res.status(400).json({ error: { message: 'Parámetros inválidos' } });
      return;
    }

    // Calcular suma de ponderación
    const suma = evaluaciones.reduce((acc: number, curr: any) => acc + Number(curr.ponderacion), 0);
    if (suma !== 100 && evaluaciones.length > 0) {
      res.status(400).json({ error: { message: 'La suma de las ponderaciones debe ser 100' } });
      return;
    }

    // 1. Eliminar evaluaciones viejas (que no vienen en el nuevo array, o borrar todo y reinsertar)
    // Para no perder las notas parciales, lo correcto es actualizar las existentes y borrar las quitadas.
    // Pero por simplicidad, podemos buscar por descripción, o usar el ID.
    // Si la UI envía ID "nuevo-XXX", es nuevo.

    // Encontrar el Momento real a partir de 'lap' (id_momento 1,2,3) enviado por el frontend
    const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } }) as any;
    if (!periodoActivo) {
      res.status(400).json({ error: { message: 'No hay un Periodo Escolar activo registrado' } });
      return;
    }

    let realMomentoId = id_momento;
    if ([1, 2, 3].includes(id_momento)) {
      const descripciones = ['Primer Lapso', 'Segundo Lapso', 'Tercer Lapso'];
      const [momento] = await Momento.findOrCreate({
        where: { id_periodo: periodoActivo.id_periodo, descripcion: descripciones[id_momento - 1] }
      });
      realMomentoId = (momento as any).id_momento;
    }
    
    const saved = [];
    const receivedIds: number[] = [];

    for (const ev of evaluaciones) {
      if (ev.id_evaluacion && typeof ev.id_evaluacion === 'number') {
        // Actualizar
        const record = await Evaluacion.findByPk(ev.id_evaluacion);
        if (record) {
          await record.update({ descripcion: ev.descripcion, ponderacion: ev.ponderacion });
          saved.push(record);
          receivedIds.push(record.id_evaluacion);
        }
      } else {
        // Crear
        const record = await Evaluacion.create({
          id_plan, id_seccion, id_momento: realMomentoId,
          descripcion: ev.descripcion,
          ponderacion: ev.ponderacion
        });
        saved.push(record);
        receivedIds.push(record.id_evaluacion);
      }
    }

    // 2. Eliminar evaluaciones viejas (que no vienen en el nuevo array)
    // Extraer los IDs que SI vinieron en el array o fueron recién creados (ya en receivedIds)


    // Buscar las evaluaciones actuales para este plan, seccion y momento
    const existingEvals = await Evaluacion.findAll({
      where: { id_plan, id_seccion, id_momento: realMomentoId }
    });

    for (const ex of existingEvals) {
      if (!receivedIds.includes(ex.id_evaluacion)) {
        // Esta evaluación fue eliminada en la UI
        // Primero eliminar sus notas parciales para evitar errores de llave foránea
        await NotaParcial.destroy({ where: { id_evaluacion: ex.id_evaluacion } });
        // Luego eliminar la evaluación
        await ex.destroy();
      }
    }

    res.json({ data: saved });
  }),

  // Obtener notas parciales
  listarNotas: wrapAsync(async (req: Request, res: Response) => {
    const Momento = require('../models').Momento;
    const result = await NotaParcial.findAll({
      include: [
        {
          model: Evaluacion,
          as: 'evaluacion',
          include: [
            {
              model: PlanEstudio,
              as: 'plan'
            },
            {
              model: Momento,
              as: 'momento'
            }
          ]
        }
      ]
    });
    res.json({ data: result });
  }),

  // Guardar notas parciales en bloque
  upsertNotas: wrapAsync(async (req: Request, res: Response) => {
    const { notas_parciales } = req.body;
    if (!Array.isArray(notas_parciales)) {
      res.status(400).json({ error: { message: 'notas_parciales debe ser un arreglo' } });
      return;
    }

    const savedRecords = [];
    // Agrupar para actualizar Calificacion final
    const affectedLapsos = new Set<string>();

    for (const item of notas_parciales) {
      let { id_matricula } = item;
      const { id_estudiante, id_evaluacion, id_escala } = item;

      if (!id_evaluacion) continue;

      if (!id_matricula && id_estudiante) {
        const matricula = await Matricula.findOne({ where: { id_estudiante } });
        if (matricula) id_matricula = (matricula as any).id_matricula;
        else continue;
      }

      if (!id_matricula) continue;

      const [record, created] = await NotaParcial.findOrCreate({
        where: { id_matricula, id_evaluacion },
        defaults: { id_escala }
      });

      if (!created) {
        await record.update({ id_escala });
      }
      savedRecords.push(record);

      // Extraer datos para recalcular la nota final
      const ev = await Evaluacion.findByPk(id_evaluacion);
      if (ev) {
        affectedLapsos.add(`${id_matricula}-${ev.id_plan}-${ev.id_momento}`);
      }
    }

    // Recalcular la nota definitiva del Lapso (Calificacion) para cada alumno afectado
    for (const lapso of affectedLapsos) {
      const [matId, planId, momId] = lapso.split('-').map(Number);
      
      const evaluaciones = await Evaluacion.findAll({ where: { id_plan: planId, id_momento: momId } });
      let sumaPonderada = 0;
      
      for (const ev of evaluaciones) {
        const nota = await NotaParcial.findOne({ where: { id_matricula: matId, id_evaluacion: ev.id_evaluacion } });
        const valorNota = nota ? nota.id_escala : 0; // Si no tiene nota, asume 0 o 1
        sumaPonderada += (valorNota * ev.ponderacion) / 100;
      }
      
      const notaDefinitiva = Math.max(1, Math.min(20, Math.round(sumaPonderada)));

      // Upsert a Calificacion
      const [calif, cCreated] = await Calificacion.findOrCreate({
        where: { id_matricula: matId, id_plan: planId, id_momento: momId },
        defaults: { id_escala: notaDefinitiva, inasistencias_asignatura: 0 }
      });

      if (!cCreated) {
        await calif.update({ id_escala: notaDefinitiva });
      }
    }

    res.json({ data: savedRecords });
  }),
};
