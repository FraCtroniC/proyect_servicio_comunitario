import { validateRules } from './index';

export const validateCrearMomento = validateRules([
  { field: 'nombre_momento', required: true },
  { field: 'ponderacion', required: true, type: 'number' },
]);

export const validateActualizarMomento = validateRules([
  { field: 'nombre_momento', required: false },
  { field: 'ponderacion', type: 'number', required: false },
]);
