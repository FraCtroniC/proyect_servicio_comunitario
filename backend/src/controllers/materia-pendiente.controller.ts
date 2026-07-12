import { Request, Response } from 'express';
import { MateriaPendiente } from '../models/MateriaPendiente';
import { Asignatura } from '../models/Asignatura';
import { Estudiante } from '../models/Estudiante';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { Docente } from '../models/Docente';

export const MateriaPendienteController = {
  // Get all pending subjects (global)
  getAll: async (req: Request, res: Response) => {
    try {
      const materias = await MateriaPendiente.findAll({
        include: [
          { model: Asignatura, as: 'asignatura' },
          { model: Estudiante, as: 'estudiante' },
          { model: PeriodoEscolar, as: 'periodo' },
          { model: Docente, as: 'docente_evaluador' }
        ],
        order: [['created_at', 'DESC']]
      });
      res.json(materias);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving all pending subjects' });
    }
  },

  // Get all pending subjects for a student
  getByStudent: async (req: Request, res: Response) => {
    try {
      const { id_estudiante } = req.params;
      const materias = await MateriaPendiente.findAll({
        where: { id_estudiante },
        include: [
          { model: Asignatura, as: 'asignatura' },
          { model: Estudiante, as: 'estudiante' },
          { model: PeriodoEscolar, as: 'periodo' },
          { model: Docente, as: 'docente_evaluador' }
        ]
      });
      res.json(materias);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving pending subjects' });
    }
  },

  // Enroll a student in a pending subject
  create: async (req: Request, res: Response) => {
    try {
      const { id_estudiante, id_asignatura, id_periodo, id_docente_evaluador } = req.body;
      const nueva = await MateriaPendiente.create({
        id_estudiante,
        id_asignatura,
        id_periodo,
        id_docente_evaluador,
        estatus: 'Cursando'
      });
      
      const materiaCompleta = await MateriaPendiente.findByPk(nueva.id_materia_pendiente, {
        include: [
          { model: Asignatura, as: 'asignatura' },
          { model: Estudiante, as: 'estudiante' },
          { model: PeriodoEscolar, as: 'periodo' },
          { model: Docente, as: 'docente_evaluador' }
        ]
      });
      
      res.status(201).json(materiaCompleta);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error creating pending subject enrollment' });
    }
  },

  // Update a pending subject (e.g. final grade)
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nota_definitiva, id_docente_evaluador } = req.body;
      
      const materia = await MateriaPendiente.findByPk(id);
      if (!materia) return res.status(404).json({ message: 'Not found' });

      let estatus = materia.estatus;
      if (nota_definitiva !== undefined && nota_definitiva !== null) {
        estatus = nota_definitiva >= 10 ? 'Aprobada' : 'Aplazada';
      }

      await materia.update({
        nota_definitiva,
        estatus,
        id_docente_evaluador
      });
      
      const materiaCompleta = await MateriaPendiente.findByPk(materia.id_materia_pendiente, {
        include: [
          { model: Asignatura, as: 'asignatura' },
          { model: Estudiante, as: 'estudiante' },
          { model: PeriodoEscolar, as: 'periodo' },
          { model: Docente, as: 'docente_evaluador' }
        ]
      });

      res.json(materiaCompleta);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error updating pending subject' });
    }
  }
};
