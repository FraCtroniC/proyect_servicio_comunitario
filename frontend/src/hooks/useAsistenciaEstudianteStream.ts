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

export interface AsistenciaEstudianteStreamEvent {
  tipo: 'create' | 'update' | 'batch';
  data: any;
}

export function useAsistenciaEstudianteStream(
  isLoggedIn: boolean,
  onEvent: (event: AsistenciaEstudianteStreamEvent) => void
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    const token = getSessionToken();
    if (!token) return;

    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/asistencias-estudiantes/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onopen = () => {
      console.log('[SSE-AsistenciaEstudiante] Conexión establecida');
    };

    es.onmessage = (msg) => {
      try {
        const event: AsistenciaEstudianteStreamEvent = JSON.parse(msg.data);
        console.log('[SSE-AsistenciaEstudiante] Evento recibido:', event.tipo);
        onEventRef.current(event);
      } catch {
        // ignorar mensajes malformados
      }
    };

    es.onerror = () => {
      console.warn('[SSE-AsistenciaEstudiante] Conexión perdida, reconectando en 3s...');
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
