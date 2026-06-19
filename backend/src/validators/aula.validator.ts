import { validateRules } from './index';

export const validateCrearAula = validateRules([
  { field: 'nombre_codigo', required: true },
  { field: 'capacidad', required: true, type: 'number' },
]);

export const validateActualizarAula = validateRules([
  { field: 'nombre_codigo', required: false },
  { field: 'capacidad', type: 'number', required: false },
]);
