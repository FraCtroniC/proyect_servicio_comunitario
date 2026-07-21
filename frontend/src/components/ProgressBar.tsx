interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ progress, label, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-600">{label}</span>
          <span className="text-xs font-bold text-indigo-600">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
