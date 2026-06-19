import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { Auditoria } from '../models';

export function auditLog(accion: string, tablaAfectada: string) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const oldJson = _res.json.bind(_res);

    _res.json = function (body: any) {
      if (req.user && _res.statusCode < 400) {
        const registroId = body?.data?.id || body?.data?.id_usuario || Number(req.params.id) || null;

        Auditoria.create({
          id_usuario: req.user.idUsuario,
          accion,
          tabla_afectada: tablaAfectada,
          registro_id: registroId,
          valores_antiguos: null,
          valores_nuevos: ['POST', 'PATCH', 'PUT'].includes(req.method) ? req.body : null,
          ip_direccion: req.ip || req.socket.remoteAddress || null,
        }).catch((err) => console.error('[Audit] Error al registrar auditoría:', err));
      }

      return oldJson.call(this, body);
    };

    next();
  };
}
