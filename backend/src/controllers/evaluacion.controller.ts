import { Request, Response } from 'express';
import { Evaluacion, NotaParcial, Matricula, Calificacion, PlanEstudio, PeriodoEscolar, Momento, Estudiante, EscalaCalificacion } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

export const EvaluacionController = {
  // Obtener planes de evaluación
  listarPlanes: wrapAsync(async (req: Request, res: Response) => {
    let id_periodo = req.query.id_periodo ? Number(req.query.id_periodo) : null;
    if (!id_periodo) {
      const activo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activo) id_periodo = activo.id_periodo;
    }

    if (!id_periodo) {
      res.json({ data: [] });
      return;
    }

    const result = await Evaluacion.findAll({
      include: [{ model: Momento, as: 'momento', where: { id_periodo }, required: true }]
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
    const descripciones = ['Primer Lapso', 'Segundo Lapso', 'Tercer Lapso'];
    const lapsoIndex = [1, 2, 3].indexOf(id_momento);
    if (lapsoIndex >= 0) {
      const [momento] = await Momento.findOrCreate({
        where: { id_periodo: periodoActivo.id_periodo, descripcion: descripciones[lapsoIndex] }
      });
      realMomentoId = (momento as any).id_momento;
    } else {
      const momentoExistente = await Momento.findOne({
        where: { id_momento, id_periodo: periodoActivo.id_periodo }
      });
      if (!momentoExistente) {
        res.status(400).json({ error: { message: 'El id_momento no pertenece al periodo activo' } });
        return;
      }
      realMomentoId = momentoExistente.id_momento;
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
        // Verificar si la evaluación tiene notas parciales antes de eliminar
        const notasCount = await NotaParcial.count({ where: { id_evaluacion: ex.id_evaluacion } });
        if (notasCount > 0) {
          // No eliminar evaluaciones que tengan notas asociadas
          continue;
        }
        // Eliminar la evaluación solo si no tiene notas
        await ex.destroy();
      }
    }

    res.json({ data: saved });
    getIO().emit('evaluacion:plan-update', { data: saved });
  }),

  // Obtener notas parciales
  listarNotas: wrapAsync(async (req: Request, res: Response) => {
    let id_periodo = req.query.id_periodo ? Number(req.query.id_periodo) : null;
    if (!id_periodo) {
      const activo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activo) id_periodo = activo.id_periodo;
    }

    if (!id_periodo) {
      res.json({ data: [] });
      return;
    }

    const result = await NotaParcial.findAll({
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            {
              model: Estudiante,
              as: 'estudiante'
            }
          ]
        },
        {
          model: Evaluacion,
          as: 'evaluacion',
          required: true,
          include: [
            {
              model: PlanEstudio,
              as: 'plan'
            },
            {
              model: Momento,
              as: 'momento',
              where: { id_periodo },
              required: true
            }
          ]
        },
        {
          model: EscalaCalificacion,
          as: 'escala'
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

    // Obtener periodo activo para filtrar matrículas
    const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } }) as any;

    for (const item of notas_parciales) {
      let { id_matricula } = item;
      const { id_estudiante, id_evaluacion, id_escala } = item;

      if (!id_evaluacion) continue;

      if (!id_matricula && id_estudiante) {
        const whereClause: any = { id_estudiante };
        if (periodoActivo) whereClause.id_periodo = periodoActivo.id_periodo;
        const matricula = await Matricula.findOne({ where: whereClause });
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

    getIO().emit('evaluacion:notas-update', { data: savedRecords });
    res.json({ data: savedRecords });
  }),
};
