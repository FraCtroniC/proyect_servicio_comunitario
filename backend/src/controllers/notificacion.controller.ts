import { Request, Response } from 'express';
import { sendAcademicAlert } from '../services/email.service';

export const NotificacionController = {
  alertaAcademica: async (req: Request, res: Response) => {
    try {
      const { emailRepresentante, studentName, subjectName, notes } = req.body;

      if (!emailRepresentante) {
        return res.status(400).json({ message: 'El correo del representante es obligatorio' });
      }

      await sendAcademicAlert(emailRepresentante, studentName, subjectName || 'Bajo rendimiento general', notes || 'Riesgo de repitencia');

      res.status(200).json({ message: 'Alerta académica enviada correctamente' });
    } catch (e: any) {
      console.error('Error in alertaAcademica:', e);
      res.status(500).json({ message: 'Error al enviar la notificación' });
    }
  }
};
