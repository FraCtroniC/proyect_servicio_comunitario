import { validateRules } from './index';

export const validateCrearSeccion = validateRules([
  { field: 'nombre_seccion', required: true },
  { field: 'id_grado_ano', required: true, type: 'number' },
]);

export const validateActualizarSeccion = validateRules([
  { field: 'nombre_seccion', required: false },
  { field: 'id_grado_ano', type: 'number', required: false },
]);
