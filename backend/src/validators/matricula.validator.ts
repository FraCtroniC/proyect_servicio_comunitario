import { validateRules } from './index';

export const validateCrearMatricula = validateRules([
  { field: 'id_estudiante', required: true, type: 'number' },
  { field: 'idSeccion', required: true, type: 'number' },
  { field: 'id_periodo_escolar', required: true, type: 'number' },
]);

export const validateActualizarMatricula = validateRules([
  { field: 'id_estudiante', type: 'number', required: false },
  { field: 'idSeccion', type: 'number', required: false },
]);
