import { validateRules } from './index';

export const validateCrearAsignatura = validateRules([
  { field: 'nombre', required: true },
  { field: 'tipo_calificacion', required: true },
]);

export const validateActualizarAsignatura = validateRules([
  { field: 'nombre', required: false },
  { field: 'tipo_calificacion', required: false },
]);
