import { validateRules } from './index';

export const validateCrearCalificacion = validateRules([
  { field: 'id_matricula', required: true, type: 'number' },
  { field: 'id_momento', required: true, type: 'number' },
  { field: 'nota', required: true, type: 'number' },
]);

export const validateActualizarCalificacion = validateRules([
  { field: 'id_matricula', type: 'number', required: false },
  { field: 'id_momento', type: 'number', required: false },
  { field: 'nota', type: 'number', required: false },
]);
