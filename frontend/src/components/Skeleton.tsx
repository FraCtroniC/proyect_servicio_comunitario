interface SkeletonProps {
  className?: string;
}

function SkeletonBox({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <SkeletonBox className={`h-4 w-full ${className}`} />;
}

export function SkeletonTitle({ className = '' }: SkeletonProps) {
  return <SkeletonBox className={`h-6 w-3/4 ${className}`} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <SkeletonBox className={`h-10 w-10 rounded-full ${className}`} />;
}

export function SkeletonTableRow({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <div className={`flex gap-4 p-4 ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} className={i === 0 ? 'w-1/4' : 'w-1/6'} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`p-6 border border-slate-200 rounded-2xl space-y-4 ${className}`}>
      <SkeletonTitle />
      <SkeletonText className="w-1/2" />
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonPage({ className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-6 p-4 ${className}`}>
      <SkeletonTitle className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard />
    </div>
  );
}
