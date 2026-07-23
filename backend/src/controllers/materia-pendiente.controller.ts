import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { MateriaPendiente } from '../models/MateriaPendiente';
import { Asignatura } from '../models/Asignatura';
import { Estudiante } from '../models/Estudiante';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { Usuario } from '../models/Usuario';
import { Calificacion } from '../models/Calificacion';
import { Matricula } from '../models/Matricula';
import { PlanEstudio } from '../models/PlanEstudio';
import { EscalaCalificacion } from '../models/EscalaCalificacion';
import { Evaluacion } from '../models/Evaluacion';
import { Seccion } from '../models/Seccion';
import { GradoAno } from '../models/GradoAno';
import { Momento } from '../models/Momento';
import { getIO } from '../socket';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const FULL_INCLUDES = [
  { model: Asignatura, as: 'asignatura' },
  { model: Estudiante, as: 'estudiante' },
  { model: PeriodoEscolar, as: 'periodo' },
  { model: Usuario, as: 'docente_evaluador' },
];

async function findCompleta(id: number) {
  return MateriaPendiente.findByPk(id, { include: FULL_INCLUDES });
}

async function resolveDocenteId(idUsuario: number): Promise<number | null> {
  const usuario = await Usuario.findByPk(idUsuario, { attributes: ['id_usuario'] });
  return usuario?.id_usuario ?? null;
}

export const MateriaPendienteController = {
  getAll: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const where: any = {};

      if (req.user?.rol === 'Docente') {
        const docenteId = await resolveDocenteId(req.user.idUsuario);
        if (docenteId) where.id_docente_evaluador = docenteId;
      }

      const page = req.query.page ? Number(req.query.page) : null;

      if (page) {
        const limitNum = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const offset = (page - 1) * limitNum;
        const busqueda = (req.query.busqueda as string || '').trim();
        const estatus = req.query.estatus as string;

        if (estatus && estatus !== 'All') {
          where.estatus = estatus;
        }

        if (busqueda) {
          const estudiantes = await Estudiante.findAll({
            where: {
              [Op.or]: [
                { cedula: { [Op.like]: `%${busqueda}%` } },
                { nombre1: { [Op.like]: `%${busqueda}%` } },
                { apellido1: { [Op.like]: `%${busqueda}%` } },
              ],
            },
            attributes: ['id_estudiante'],
          });
          where.id_estudiante = { [Op.in]: estudiantes.map(e => e.id_estudiante) };
        }

        const { count, rows } = await MateriaPendiente.findAndCountAll({
          where,
          include: FULL_INCLUDES,
          order: [['created_at', 'DESC']],
          limit: limitNum,
          offset,
          distinct: true,
        });

        res.json({
          data: rows,
          meta: { total: count, page, limit: limitNum, pages: Math.ceil(count / limitNum) },
        });
      } else {
        const materias = await MateriaPendiente.findAll({
          where,
          include: FULL_INCLUDES,
          order: [['created_at', 'DESC']],
        });
        res.json(materias);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving pending subjects' });
    }
  },

  getByStudent: async (req: Request, res: Response) => {
    try {
      const { id_estudiante } = req.params;
      const materias = await MateriaPendiente.findAll({
        where: { id_estudiante },
        include: FULL_INCLUDES,
        order: [['created_at', 'DESC']],
      });
      res.json(materias);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving pending subjects' });
    }
  },

  getReprobadas: async (req: Request, res: Response) => {
    try {
      const idEstudiante = Number(req.params.id_estudiante);

      const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } }) as any;
      if (!periodoActivo) {
        res.json([]);
        return;
      }

      const matriculas = await Matricula.findAll({
        where: { id_estudiante: idEstudiante, id_periodo: periodoActivo.id_periodo },
        attributes: ['id_matricula', 'id_periodo'],
        order: [['id_periodo', 'DESC']],
      });

      if (matriculas.length === 0) {
        res.json([]);
        return;
      }

      const matriculaIds = matriculas.map(m => m.id_matricula);

      const calificaciones = await Calificacion.findAll({
        where: { id_matricula: matriculaIds },
        include: [
          { model: PlanEstudio, as: 'plan', include: [{ model: Asignatura, as: 'asignatura' }] },
          { model: EscalaCalificacion, as: 'escala', attributes: ['nota_calculo'] },
        ],
      });

      const notasByAsignatura: Record<number, { id_asignatura: number; nombre: string; grades: number[] }> = {};
      for (const cal of calificaciones) {
        const plan = (cal as any).plan;
        const escala = (cal as any).escala;
        if (!plan || !escala || escala.nota_calculo == null) continue;

        const idAsig = plan.id_asignatura;
        if (!notasByAsignatura[idAsig]) {
          notasByAsignatura[idAsig] = {
            id_asignatura: idAsig,
            nombre: plan.asignatura?.nombre || 'Desconocida',
            grades: [],
          };
        }
        notasByAsignatura[idAsig].grades.push(escala.nota_calculo);
      }

      const activas = await MateriaPendiente.findAll({
        where: { id_estudiante: idEstudiante, estatus: 'Cursando' },
        attributes: ['id_asignatura'],
      });
      const activasSet = new Set(activas.map(a => a.id_asignatura));

      const reprobadas = Object.values(notasByAsignatura)
        .filter(a => !activasSet.has(a.id_asignatura))
        .map(a => {
          const sumaLapsos = a.grades.reduce((s, g) => s + g, 0);
          const notaFinal = Math.round(sumaLapsos / 3);
          return {
            id_asignatura: a.id_asignatura,
            nombre: a.nombre,
            nota_final: notaFinal,
          };
        })
        .filter(a => a.nota_final >= 1 && a.nota_final <= 10)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      res.json(reprobadas);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error fetching failed subjects' });
    }
  },

  create: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id_estudiante, id_asignatura, id_periodo, id_docente_evaluador } = req.body;

      if (!id_estudiante || !id_asignatura || !id_periodo) {
        res.status(400).json({ message: 'Faltan campos obligatorios: id_estudiante, id_asignatura, id_periodo' });
        return;
      }

      const existente = await MateriaPendiente.findOne({
        where: { id_estudiante, id_asignatura, id_periodo, estatus: 'Cursando' },
      });

      if (existente) {
        res.status(409).json({ message: 'Ya existe una materia pendiente activa para este estudiante, asignatura y período.' });
        return;
      }

      let docenteId = id_docente_evaluador || null;
      if (req.user?.rol === 'Docente' && !docenteId) {
        docenteId = await resolveDocenteId(req.user.idUsuario);
      }

      const nueva = await MateriaPendiente.create({
        id_estudiante,
        id_asignatura,
        id_periodo,
        id_docente_evaluador: docenteId,
        estatus: 'Cursando',
      });

      const completa = await findCompleta(nueva.id_materia_pendiente);
      getIO().emit('materia-pendiente:create', { data: completa });

      res.status(201).json(completa);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error creating pending subject enrollment' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nota_definitiva, id_docente_evaluador } = req.body;

      const materia = await MateriaPendiente.findByPk(id);
      if (!materia) {
        res.status(404).json({ message: 'Materia pendiente no encontrada' });
        return;
      }

      let estatus = materia.estatus;
      if (nota_definitiva !== undefined && nota_definitiva !== null) {
        const num = Number(nota_definitiva);
        if (num < 1 || num > 20) {
          res.status(400).json({ message: 'La calificación debe ser un número entre 1 y 20' });
          return;
        }
        estatus = num >= 10 ? 'Aprobada' : 'Aplazada';
      }

      const updateData: any = { estatus };
      if (nota_definitiva !== undefined) updateData.nota_definitiva = Number(nota_definitiva);
      if (id_docente_evaluador !== undefined) updateData.id_docente_evaluador = id_docente_evaluador;

      await materia.update(updateData);

      const completa = await findCompleta(materia.id_materia_pendiente);
      getIO().emit('materia-pendiente:update', { data: completa });

      res.json(completa);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error updating pending subject' });
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const materia = await MateriaPendiente.findByPk(id);
      if (!materia) {
        res.status(404).json({ message: 'Materia pendiente no encontrada' });
        return;
      }

      await materia.destroy();
      getIO().emit('materia-pendiente:delete', { data: { id_materia_pendiente: Number(id) } });

      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error deleting pending subject' });
    }
  },

  autoCrearMaterias: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const activo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } }) as any;
      if (!activo) {
        res.status(400).json({ message: 'No hay un período escolar activo.' });
        return;
      }

      const momentos = await Momento.findAll({ where: { id_periodo: activo.id_periodo } });
      if (momentos.length === 0) {
        res.status(400).json({ message: 'El período activo no tiene momentos (lapsos).' });
        return;
      }

      // 1. Obtener matrículas del período activo
      const matriculas = await Matricula.findAll({
        where: { id_periodo: activo.id_periodo },
        include: [{ model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] }],
      });

      if (matriculas.length === 0) {
        res.json({ message: 'No hay estudiantes matriculados en el período activo.', materiasCreadas: 0, evaluacionesCreadas: 0 });
        return;
      }

      // 2. Obtener calificaciones
      const matriculaIds = matriculas.map(m => m.id_matricula);
      const calificaciones = await Calificacion.findAll({
        where: { id_matricula: matriculaIds },
        include: [
          { model: PlanEstudio, as: 'plan' },
          { model: EscalaCalificacion, as: 'escala', attributes: ['nota_calculo'] },
        ],
      });

      // 3. Agrupar notas por (estudiante, asignatura)
      const notasByEstudiante: Record<number, Record<number, number[]>> = {};
      const existingPlanIdsByMatricula: Record<number, Set<number>> = {};

      for (const cal of calificaciones) {
        const plan = (cal as any).plan;
        const escala = (cal as any).escala;
        if (!plan || !escala || escala.nota_calculo == null) continue;

        const mat = matriculas.find(m => m.id_matricula === cal.id_matricula);
        if (!mat) continue;

        if (!existingPlanIdsByMatricula[cal.id_matricula]) {
          existingPlanIdsByMatricula[cal.id_matricula] = new Set();
        }
        existingPlanIdsByMatricula[cal.id_matricula].add(cal.id_plan);

        const idAsig = plan.id_asignatura;
        if (!notasByEstudiante[mat.id_estudiante]) notasByEstudiante[mat.id_estudiante] = {};
        if (!notasByEstudiante[mat.id_estudiante][idAsig]) notasByEstudiante[mat.id_estudiante][idAsig] = [];
        notasByEstudiante[mat.id_estudiante][idAsig].push(escala.nota_calculo);
      }

      // 4. Determinar materias reprobadas (promedio < 10) y faltantes
      const materiasARegistrar: any[] = [];
      const evaluacionesACrear: Array<{ id_plan: number; id_seccion: number; id_asignatura: number; nombre: string }> = [];
      const pendientesSet = new Set<string>();

      // 4a. De calificaciones existentes con promedio < 10
      for (const idEstudianteStr of Object.keys(notasByEstudiante)) {
        const idEstudiante = Number(idEstudianteStr);
        for (const idAsigStr of Object.keys(notasByEstudiante[idEstudiante])) {
          const idAsig = Number(idAsigStr);
          const grades = notasByEstudiante[idEstudiante][idAsig];
          const suma = grades.reduce((s, g) => s + g, 0);
          const notaFinal = Math.round(suma / 3);

          if (notaFinal < 10) {
            const key = `${idEstudiante}-${idAsig}`;
            pendientesSet.add(key);
            materiasARegistrar.push({ id_estudiante: idEstudiante, id_asignatura: idAsig, id_periodo: activo.id_periodo, estatus: 'Cursando' });
          }
        }
      }

      // 4b. Materias sin calificaciones (nunca se ingresaron notas)
      for (const mat of matriculas) {
        const sec = (mat as any).seccion;
        const grado = sec?.grado;
        if (!grado) continue;

        const existingPlans = existingPlanIdsByMatricula[mat.id_matricula] || new Set();
        const allPlans = await PlanEstudio.findAll({ where: { id_grado: grado.id_grado } });

        for (const plan of allPlans) {
          if (!existingPlans.has(plan.id_plan)) {
            const key = `${mat.id_estudiante}-${plan.id_asignatura}`;
            if (!pendientesSet.has(key)) {
              pendientesSet.add(key);
              materiasARegistrar.push({
                id_estudiante: mat.id_estudiante,
                id_asignatura: plan.id_asignatura,
                id_periodo: activo.id_periodo,
                estatus: 'Cursando',
              });
            }
          }
        }
      }

      // 5. Insertar materias pendientes (solo las que no existan ya)
      const existentesDB = await MateriaPendiente.findAll({
        where: { id_periodo: activo.id_periodo },
      });
      const existentesSet = new Set(existentesDB.map(mp => `${mp.id_estudiante}-${mp.id_asignatura}`));

      const materiasNuevas = materiasARegistrar.filter(m => !existentesSet.has(`${m.id_estudiante}-${m.id_asignatura}`));
      if (materiasNuevas.length > 0) {
        await MateriaPendiente.bulkCreate(materiasNuevas);
      }

      // 6. Recopilar (plan, seccion, asignatura.nombre) para crear evaluaciones
      const evalSet = new Set<string>();
      for (const m of materiasARegistrar) {
        const mat = matriculas.find(mm => mm.id_estudiante === m.id_estudiante);
        if (!mat) continue;
        const sec = (mat as any).seccion;
        if (!sec) continue;

        const planEntry = await PlanEstudio.findOne({
          where: { id_grado: sec.id_grado, id_asignatura: m.id_asignatura },
        });
        if (!planEntry) continue;

        const asignatura = await Asignatura.findByPk(m.id_asignatura);
        const nombreAsig = asignatura?.nombre || 'Desconocida';
        const evalKey = `${planEntry.id_plan}-${sec.id_seccion}`;
        if (!evalSet.has(evalKey)) {
          evalSet.add(evalKey);
          evaluacionesACrear.push({ id_plan: planEntry.id_plan, id_seccion: sec.id_seccion, id_asignatura: m.id_asignatura, nombre: nombreAsig });
        }
      }

      // 7. Crear evaluaciones
      let evaluacionesCreadas = 0;
      for (const ev of evaluacionesACrear) {
        for (const momento of momentos) {
          const existente = await Evaluacion.findOne({
            where: {
              id_plan: ev.id_plan,
              id_seccion: ev.id_seccion,
              id_momento: momento.id_momento,
              descripcion: `Recuperación: ${ev.nombre}`,
            },
          });
          if (!existente) {
            await Evaluacion.create({
              id_plan: ev.id_plan,
              id_seccion: ev.id_seccion,
              id_momento: momento.id_momento,
              descripcion: `Recuperación: ${ev.nombre}`,
              ponderacion: 100,
            });
            evaluacionesCreadas++;
          }
        }
      }

      getIO().emit('evaluacion:plan-update', { data: [] });
      getIO().emit('materia-pendiente:create', { data: [] });
      res.json({
        message: `Auto-generación completada. ${materiasNuevas.length} materias pendientes y ${evaluacionesCreadas} evaluaciones creadas.`,
        materiasCreadas: materiasNuevas.length,
        evaluacionesCreadas,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error en auto-generación de materias' });
    }
  },
};
