import { validateRules } from './index';

export const validateCrearPeriodoEscolar = validateRules([
  { field: 'nombre', required: true },
  { field: 'estatus', required: true },
  { field: 'fecha_inicio', required: false },
  { field: 'fecha_fin', required: false },
]);

export const validateActualizarPeriodoEscolar = validateRules([
  { field: 'nombre', required: false },
  { field: 'estatus', required: false },
  { field: 'fecha_inicio', required: false },
  { field: 'fecha_fin', required: false },
]);
