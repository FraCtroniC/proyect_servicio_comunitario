import { validateRules } from './index';

export const validateCrearPlanEstudio = validateRules([
  { field: 'id_asignatura', required: true, type: 'number' },
  { field: 'id_grado', required: true, type: 'number' },
]);

export const validateActualizarPlanEstudio = validateRules([
  { field: 'id_asignatura', type: 'number', required: false },
  { field: 'id_grado', type: 'number', required: false },
]);
