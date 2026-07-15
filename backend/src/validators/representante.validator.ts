import { validateRules } from './index';

export const validateCrearRepresentante = validateRules([
  { field: 'cedula', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
  { field: 'telefono', required: true },
]);

export const validateActualizarRepresentante = validateRules([
  { field: 'cedula', required: false },
  { field: 'correo', type: 'email', required: false },
]);
