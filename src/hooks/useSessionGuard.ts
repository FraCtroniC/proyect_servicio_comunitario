import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function useSessionGuard() {
  const navigate = useNavigate();
  const checkSession = useAuthStore((s) => s.checkSession);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    const valid = checkSession();
    if (!valid) return;

    const interval = window.setInterval(() => {
      if (!checkSession()) {
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
  }, [checkSession, navigate, signOut]);
}
