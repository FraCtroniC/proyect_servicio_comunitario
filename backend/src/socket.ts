import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';

let io: Server;

function getSecretList(): string[] {
  const secrets = [environment.jwtSecret];
  if (environment.jwtLegacySecrets) {
    secrets.push(...environment.jwtLegacySecrets.split(',').map(s => s.trim()).filter(Boolean));
  }
  return secrets;
}

const allSecrets = getSecretList();

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

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: environment.frontendUrl || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Autenticación requerida'));
    try {
      verifyToken(token);
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WS] Conectado: ${socket.id}`);
    socket.on('disconnect', () => console.log(`[WS] Desconectado: ${socket.id}`));
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO no está inicializado');
  return io;
}
