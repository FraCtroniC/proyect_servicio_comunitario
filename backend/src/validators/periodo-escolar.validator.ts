import { validateRules } from './index';

export const validateCrearPeriodoEscolar = validateRules([
  { field: 'nombre_periodo', required: true },
  { field: 'fecha_inicio', required: true },
  { field: 'fecha_fin', required: true },
]);

export const validateActualizarPeriodoEscolar = validateRules([
  { field: 'nombre_periodo', required: false },
]);
