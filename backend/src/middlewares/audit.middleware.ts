import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { Auditoria } from '../models';

const SENSITIVE_FIELDS = ['password', 'password_hash', 'token', 'authorization', 'confirmPassword'];

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;
  const sanitized = Array.isArray(body) ? [...body] : { ...body };
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeBody(sanitized[key]);
    }
  }
  return sanitized;
}

export function auditLog(accion: string, tablaAfectada: string) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const oldJson = _res.json.bind(_res);

    _res.json = function (body: any) {
      if (req.user && req.user.idUsuario && _res.statusCode < 400) {
        const registroId = body?.data?.id || body?.data?.id_usuario || Number(req.params.id) || null;

        Auditoria.create({
          id_usuario: req.user.idUsuario,
          accion,
          tabla_afectada: tablaAfectada,
          registro_id: registroId,
          valores_antiguos: null,
          valores_nuevos: ['POST', 'PATCH', 'PUT'].includes(req.method) ? sanitizeBody(req.body) : null,
          ip_direccion: req.ip || req.socket.remoteAddress || null,
        }).catch((err) => console.error('[Audit] Error al registrar auditoría:', err.message || err));
      }

      return oldJson.call(this, body);
    };

    next();
  };
}
