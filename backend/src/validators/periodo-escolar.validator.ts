import { validateRules } from './index';

export const validateCrearPeriodoEscolar = validateRules([
  { field: 'nombre', required: true },
  { field: 'estatus', required: true },
]);

export const validateActualizarPeriodoEscolar = validateRules([
  { field: 'nombre', required: false },
  { field: 'estatus', required: false },
]);
