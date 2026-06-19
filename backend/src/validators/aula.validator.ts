import { validateRules } from './index';

export const validateCrearAula = validateRules([
  { field: 'nombre_aula', required: true },
  { field: 'capacidad', required: true, type: 'number' },
]);

export const validateActualizarAula = validateRules([
  { field: 'nombre_aula', required: false },
  { field: 'capacidad', type: 'number', required: false },
]);
