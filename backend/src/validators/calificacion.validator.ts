import { validateRules } from './index';

export const validateCrearCalificacion = validateRules([
  { field: 'id_matricula', required: true, type: 'number' },
  { field: 'id_plan', required: true, type: 'number' },
  { field: 'id_momento', required: true, type: 'number' },
  { field: 'id_escala', required: true, type: 'number' },
]);

export const validateActualizarCalificacion = validateRules([
  { field: 'id_matricula', type: 'number', required: false },
  { field: 'id_plan', type: 'number', required: false },
  { field: 'id_momento', type: 'number', required: false },
  { field: 'id_escala', type: 'number', required: false },
]);
