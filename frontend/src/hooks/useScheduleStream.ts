import { useEffect, useRef, useCallback } from 'react';

const SESSION_KEY = 'liceo-auth-session';

function getSessionToken(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.sessionToken && data.expiresAt && Date.now() < data.expiresAt) {
      return data.sessionToken;
    }
  } catch {
    // ignorar
  }
  return null;
}

export interface HorarioStreamEvent {
  tipo: 'create' | 'update' | 'delete';
  data: any;
}

export function useScheduleStream(
  isLoggedIn: boolean,
  onEvent: (event: HorarioStreamEvent) => void
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    const token = getSessionToken();
    if (!token) return;

    const url = `/api/horarios/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onopen = () => {
      console.log('[SSE] Conexión establecida');
    };

    es.onmessage = (msg) => {
      try {
        const event: HorarioStreamEvent = JSON.parse(msg.data);
        console.log('[SSE] Evento recibido:', event.tipo, event.data?.id_horario);
        onEventRef.current(event);
      } catch {
        // ignorar mensajes malformados
      }
    };

    es.onerror = () => {
      console.warn('[SSE] Conexión perdida, reconectando en 3s...');
      es.close();
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          connect();
        }
      }, 3000);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && es.readyState === EventSource.CLOSED) {
        connect();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      es.close();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [isLoggedIn, connect]);
}
