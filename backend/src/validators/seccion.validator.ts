import { validateRules } from './index';

export const validateCrearSeccion = validateRules([
  { field: 'id_periodo', required: true, type: 'number' },
  { field: 'id_grado', required: true, type: 'number' },
  { field: 'letra', required: true },
  { field: 'id_docente_guia', required: true, type: 'number' },
  { field: 'capacidad_maxima', type: 'number', required: false },
]);

export const validateActualizarSeccion = validateRules([
  { field: 'id_periodo', type: 'number', required: false },
  { field: 'id_grado', type: 'number', required: false },
  { field: 'letra', required: false },
  { field: 'id_docente_guia', type: 'number', required: false },
  { field: 'capacidad_maxima', type: 'number', required: false },
]);
