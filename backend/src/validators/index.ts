import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../shared/errors';

type Rule = {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email';
  minLength?: number;
  maxLength?: number;
  message?: string;
};

export function validateRules(rules: Rule[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        (errors[rule.field] ??= []).push(rule.message || `El campo ${rule.field} es requerido`);
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      if (rule.type === 'number' && isNaN(Number(value))) {
        (errors[rule.field] ??= []).push(`El campo ${rule.field} debe ser un número`);
      }

      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        (errors[rule.field] ??= []).push(`El campo ${rule.field} debe ser un email válido`);
      }

      if (rule.minLength && String(value).length < rule.minLength) {
        (errors[rule.field] ??= []).push(`El campo ${rule.field} debe tener al menos ${rule.minLength} caracteres`);
      }

      if (rule.maxLength && String(value).length > rule.maxLength) {
        (errors[rule.field] ??= []).push(`El campo ${rule.field} debe tener máximo ${rule.maxLength} caracteres`);
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    next();
  };
}
