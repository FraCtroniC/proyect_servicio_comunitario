import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { environment } from '../../config/environment';
import { Usuario } from '../models';

interface SSEClient {
  id: number;
  res: Response;
}

const clients: Set<SSEClient> = new Set();

const allSecrets = getSecretList();

function getSecretList(): string[] {
  const secrets = [environment.jwtSecret];
  if (environment.jwtLegacySecrets) {
    secrets.push(...environment.jwtLegacySecrets.split(',').map(s => s.trim()).filter(Boolean));
  }
  return secrets;
}

function verifyToken(token: string): any {
  let lastError: any = null;
  for (const secret of allSecrets) {
    try {
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Token inválido');
}

export const AsistenciaDocenteStreamController = {
  connect: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const token = req.query.token as string;

      if (!token) {
        res.status(401).json({ error: { message: 'Token requerido' } });
        return;
      }

      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch {
        res.status(401).json({ error: { message: 'Token inválido' } });
        return;
      }

      const usuario = await Usuario.findByPk(decoded.idUsuario, {
        attributes: ['id_usuario', 'token_version'],
      });

      if (!usuario) {
        res.status(401).json({ error: { message: 'Usuario no encontrado' } });
        return;
      }

      const tokenVersion = usuario.getDataValue('token_version') as number;
      if (decoded.tokenVersion !== tokenVersion) {
        res.status(401).json({ error: { message: 'Sesión inválida' } });
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      res.write(':\n\n');

      const client: SSEClient = { id: decoded.idUsuario, res };
      clients.add(client);

      console.log(`[SSE-AsistenciaDocente] Conexión establecida para usuario ${decoded.idUsuario}, total: ${clients.size}`);

      req.on('close', () => {
        clients.delete(client);
        console.log(`[SSE-AsistenciaDocente] Conexión cerrada para usuario ${decoded.idUsuario}, total: ${clients.size}`);
      });
    } catch (err) {
      console.error('[SSE-AsistenciaDocente] Error en connect:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: { message: 'Error al conectar SSE' } });
      }
    }
  },
};

export function broadcastAsistenciaDocenteEvent(event: { tipo: 'create' | 'update' | 'delete'; data: any }) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  const dead: SSEClient[] = [];
  for (const client of clients) {
    try {
      client.res.write(payload);
    } catch {
      dead.push(client);
    }
  }
  for (const client of dead) {
    clients.delete(client);
  }
}
