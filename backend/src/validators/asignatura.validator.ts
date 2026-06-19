import { validateRules } from './index';

export const validateCrearAsignatura = validateRules([
  { field: 'nombre_asignatura', required: true },
  { field: 'codigo_asignatura', required: true },
]);

export const validateActualizarAsignatura = validateRules([
  { field: 'nombre_asignatura', required: false },
  { field: 'codigo_asignatura', required: false },
]);
