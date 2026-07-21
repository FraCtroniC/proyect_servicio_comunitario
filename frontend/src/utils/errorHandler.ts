import toast from 'react-hot-toast';

export function getErrorMessage(e: unknown, fallback = 'Error desconocido'): string {
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') {
    const err = e as Record<string, unknown>;
    if (err.message && typeof err.message === 'string') return err.message;
    if (err.error && typeof err.error === 'string') return err.error;
  }
  return fallback;
}

const statusIcons: Record<number, string> = {
  400: '⚠️ ',
  403: '🔒 ',
  404: '🔍 ',
  409: '⚠️ ',
  422: '⚠️ ',
  500: '❌ ',
};

export function showToastError(e: unknown, fallback = 'Error desconocido'): void {
  const msg = getErrorMessage(e, fallback);
  const err = e as Record<string, unknown>;
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 0;
  const icon = statusIcons[statusCode] || '';
  const prefix = statusCode >= 500 ? 'Error del servidor: ' : statusCode >= 400 ? 'Error: ' : '';
  toast.error(`${icon}${prefix}${msg}`, { duration: statusCode >= 500 ? 8000 : 4000 });
}
