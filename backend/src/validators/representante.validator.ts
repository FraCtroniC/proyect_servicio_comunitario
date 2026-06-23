import { validateRules } from './index';

export const validateCrearRepresentante = validateRules([
  { field: 'cedula_rep', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
  { field: 'telefono', required: true },
]);

export const validateActualizarRepresentante = validateRules([
  { field: 'cedula_rep', required: false },
  { field: 'correo', type: 'email', required: false },
]);
