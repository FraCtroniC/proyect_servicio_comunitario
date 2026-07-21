import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'white' | 'slate';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const colorMap = {
  indigo: 'text-indigo-600',
  white: 'text-white',
  slate: 'text-slate-400',
};

export function Spinner({ size = 'md', color = 'indigo', label, className = '' }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} role="status" aria-label={label || 'Cargando'}>
      <Loader2 className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} />
      {label && <span className={`text-sm font-medium ${colorMap[color]}`}>{label}</span>}
    </div>
  );
}
