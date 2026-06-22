import { Request, Response } from 'express';
import { MateriaPendiente } from '../models/MateriaPendiente';
import { Asignatura } from '../models/Asignatura';

export const MateriaPendienteController = {
  // Get all pending subjects for a student
  getByStudent: async (req: Request, res: Response) => {
    try {
      const { id_estudiante } = req.params;
      const materias = await MateriaPendiente.findAll({
        where: { id_estudiante },
        include: [{ model: Asignatura, as: 'asignatura' }]
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
      const { id_estudiante, id_asignatura, id_periodo } = req.body;
      const nueva = await MateriaPendiente.create({
        id_estudiante,
        id_asignatura,
        id_periodo,
        estatus: 'Cursando'
      });
      res.status(201).json(nueva);
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
      if (nota_definitiva !== undefined) {
        estatus = nota_definitiva >= 10 ? 'Aprobada' : 'Aplazada';
      }

      await materia.update({
        nota_definitiva,
        estatus,
        id_docente_evaluador
      });

      res.json(materia);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error updating pending subject' });
    }
  }
};
