import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

function getSessionToken(): string | null {
  try {
    const raw = sessionStorage.getItem('liceo-auth-session');
    if (raw) return JSON.parse(raw).sessionToken || null;
  } catch { /* ignore */ }
  return null;
}

export function useSocket(isLoggedIn: boolean, onEvent: (event: string, data: any) => void) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!isLoggedIn) return;

    const token = getSessionToken();
    if (!token) return;

    const socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => console.log('[WS] Conectado'));
    socket.on('connect_error', (err) => console.error('[WS] Error de conexión:', err.message));

    socket.on('periodo:create', (d) => onEventRef.current('periodo:create', d));
    socket.on('periodo:update', (d) => onEventRef.current('periodo:update', d));
    socket.on('periodo:delete', (d) => onEventRef.current('periodo:delete', d));

    socket.on('usuario:create', (d) => onEventRef.current('usuario:create', d));
    socket.on('usuario:update', (d) => onEventRef.current('usuario:update', d));
    socket.on('usuario:delete', (d) => onEventRef.current('usuario:delete', d));

    socket.on('aula:create', (d) => onEventRef.current('aula:create', d));
    socket.on('aula:update', (d) => onEventRef.current('aula:update', d));
    socket.on('aula:delete', (d) => onEventRef.current('aula:delete', d));

    socket.on('plan-estudio:create', (d) => onEventRef.current('plan-estudio:create', d));
    socket.on('plan-estudio:update', (d) => onEventRef.current('plan-estudio:update', d));
    socket.on('plan-estudio:delete', (d) => onEventRef.current('plan-estudio:delete', d));

    return () => { socket.disconnect(); };
  }, [isLoggedIn]);
}
