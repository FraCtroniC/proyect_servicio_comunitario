import { validateRules } from './index';

export const validateCrearGradoAno = validateRules([
  { field: 'nombre_grado', required: true },
  { field: 'nivel', required: true },
]);

export const validateActualizarGradoAno = validateRules([
  { field: 'nombre_grado', required: false },
  { field: 'nivel', required: false },
]);
