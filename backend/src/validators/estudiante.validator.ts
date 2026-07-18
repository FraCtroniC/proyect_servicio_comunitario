import { Request, Response, NextFunction } from 'express';
import { validateRules } from './index';
import { calculateAgeFromBirth, validateAgeForYear } from '../shared/constants/ageByYear';
import { ValidationError } from '../shared/errors';

export const validateCrearEstudiante = validateRules([
  { field: 'cedula', required: true },
  { field: 'nombre1', required: true },
  { field: 'apellido1', required: true },
  { field: 'fecha_nac', required: true },
  { field: 'id_representante', required: true, type: 'number' },
  { field: 'id_grado', required: true, type: 'number' },
]);

export const validateAgeByGrade = (req: Request, _res: Response, next: NextFunction): void => {
  const { fecha_nac, id_grado } = req.body;

  if (!fecha_nac || !id_grado) {
    next();
    return;
  }

  const age = calculateAgeFromBirth(fecha_nac);
  const error = validateAgeForYear(age, Number(id_grado));

  if (error) {
    throw new ValidationError({ fecha_nac: [error] });
  }

  next();
};

export const validateActualizarEstudiante = validateRules([
  { field: 'cedula', required: false },
  { field: 'nombre1', required: false },
  { field: 'apellido1', required: false },
]);
