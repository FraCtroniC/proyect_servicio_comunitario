import { validateRules } from './index';

export const validateCrearEstudiante = validateRules([
  { field: 'cedula_escolar', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
  { field: 'fecha_nac', required: true },
]);

export const validateActualizarEstudiante = validateRules([
  { field: 'cedula_escolar', required: false },
  { field: 'nombre1', required: false },
  { field: 'apellido1', required: false },
]);
