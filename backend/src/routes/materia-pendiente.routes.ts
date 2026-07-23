import { Router } from 'express';
import { MateriaPendienteController } from '../controllers/materia-pendiente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const materiaPendienteRoutes = Router();

const roles = ['Administrador', 'Control de Estudios', 'Coordinador', 'Docente'];

materiaPendienteRoutes.get('/reprobadas/:id_estudiante', authorize(...roles), MateriaPendienteController.getReprobadas);
materiaPendienteRoutes.get('/estudiante/:id_estudiante', MateriaPendienteController.getByStudent);
materiaPendienteRoutes.get('/', authorize(...roles), MateriaPendienteController.getAll);
materiaPendienteRoutes.post('/', authorize(...roles), MateriaPendienteController.create);
materiaPendienteRoutes.patch('/:id', authorize(...roles), MateriaPendienteController.update);
materiaPendienteRoutes.post('/auto-crear-materias', authorize(...roles), MateriaPendienteController.autoCrearMaterias);
materiaPendienteRoutes.delete('/:id', authorize(...roles), MateriaPendienteController.eliminar);
