import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'warning' | 'success' | 'info';

const styles: Record<AlertVariant, string> = {
  error: 'border-danger/25 bg-danger/5 text-danger',
  warning: 'border-warning/30 bg-warning/5 text-warning',
  success: 'border-success/25 bg-success/5 text-success',
  info: 'border-accent/25 bg-accent/5 text-accent',
};

type AlertBannerProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
};

export function AlertBanner({ variant = 'error', title, children }: AlertBannerProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`} role="alert">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
