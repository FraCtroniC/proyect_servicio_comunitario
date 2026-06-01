import type { ReactNode } from 'react';
import { useSessionGuard } from '@/hooks/useSessionGuard';

export function SessionGuard({ children }: { children: ReactNode }) {
  useSessionGuard();
  return children;
}
