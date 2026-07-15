import { validateRules } from './index';

export const validateCrearEstudiante = validateRules([
  { field: 'cedula', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
  { field: 'fecha_nac', required: true },
  { field: 'id_representante', required: true, type: 'number' },
]);

export const validateActualizarEstudiante = validateRules([
  { field: 'cedula', required: false },
  { field: 'nombre1', required: false },
  { field: 'apellido1', required: false },
]);
