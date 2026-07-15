import { Request, Response } from 'express';
import { MateriaPendiente } from '../models/MateriaPendiente';
import { Asignatura } from '../models/Asignatura';
import { Estudiante } from '../models/Estudiante';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { Docente } from '../models/Docente';
import { Usuario } from '../models/Usuario';
import { Calificacion } from '../models/Calificacion';
import { Matricula } from '../models/Matricula';
import { PlanEstudio } from '../models/PlanEstudio';
import { EscalaCalificacion } from '../models/EscalaCalificacion';
import { getIO } from '../socket';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const FULL_INCLUDES = [
  { model: Asignatura, as: 'asignatura' },
  { model: Estudiante, as: 'estudiante' },
  { model: PeriodoEscolar, as: 'periodo' },
  { model: Docente, as: 'docente_evaluador' },
];

async function findCompleta(id: number) {
  return MateriaPendiente.findByPk(id, { include: FULL_INCLUDES });
}

async function resolveDocenteId(idUsuario: number): Promise<number | null> {
  const usuario = await Usuario.findByPk(idUsuario, { attributes: ['id_docente'] });
  return usuario?.id_docente ?? null;
}

export const MateriaPendienteController = {
  getAll: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const where: any = {};

      if (req.user?.rol === 'Docente') {
        const docenteId = await resolveDocenteId(req.user.idUsuario);
        if (docenteId) where.id_docente_evaluador = docenteId;
      }

      const materias = await MateriaPendiente.findAll({
        where,
        include: FULL_INCLUDES,
        order: [['created_at', 'DESC']],
      });
      res.json(materias);
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

      const matriculas = await Matricula.findAll({
        where: { id_estudiante: idEstudiante },
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
};
