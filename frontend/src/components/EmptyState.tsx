import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="h-7 w-7 text-slate-400" />}
      </div>
      <p className="text-sm font-semibold text-slate-400 text-center max-w-xs">
        {message}
      </p>
    </div>
  );
}
