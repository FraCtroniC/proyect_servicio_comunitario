import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSessionValid, useAuthStore } from '@/store/useAuthStore';

export function useSessionGuard() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const syncSession = useAuthStore((s) => s.syncSession);

  useEffect(() => {
    syncSession();

    const interval = window.setInterval(() => {
      if (!isSessionValid()) {
        signOut();
        navigate('/login', { replace: true, state: { reason: 'expired' } });
      }
    }, 60_000);

    const onActivity = () => useAuthStore.getState().touchSession();

    window.addEventListener('click', onActivity);
    window.addEventListener('keydown', onActivity);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('click', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [navigate, signOut, syncSession]);
}
