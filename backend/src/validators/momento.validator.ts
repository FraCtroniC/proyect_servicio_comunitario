import { validateRules } from './index';

export const validateCrearMomento = validateRules([
  { field: 'id_periodo', required: true, type: 'number' },
  { field: 'descripcion', required: true },
]);

export const validateActualizarMomento = validateRules([
  { field: 'id_periodo', type: 'number', required: false },
  { field: 'descripcion', required: false },
]);
