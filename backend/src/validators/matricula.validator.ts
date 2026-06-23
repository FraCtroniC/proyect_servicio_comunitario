import { validateRules } from './index';

export const validateCrearMatricula = validateRules([
  { field: 'id_estudiante', required: true, type: 'number' },
  { field: 'id_seccion', required: true, type: 'number' },
  { field: 'id_periodo', required: true, type: 'number' },
]);

export const validateActualizarMatricula = validateRules([
  { field: 'id_estudiante', type: 'number', required: false },
  { field: 'id_seccion', type: 'number', required: false },
]);
