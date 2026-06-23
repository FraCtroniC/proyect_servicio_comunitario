import { validateRules } from './index';

export const validateCrearGradoAno = validateRules([
  { field: 'nombre', required: true },
  { field: 'numero', required: true, type: 'number' },
]);

export const validateActualizarGradoAno = validateRules([
  { field: 'nombre', required: false },
  { field: 'numero', type: 'number', required: false },
]);
