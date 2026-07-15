import { validateRules } from './index';

export const validateCrearDocente = validateRules([
  { field: 'cedula', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
]);

export const validateActualizarDocente = validateRules([
  { field: 'cedula', required: false },
  { field: 'nombre1', required: false },
  { field: 'apellido1', required: false },
  { field: 'correo', type: 'email', required: false },
]);
