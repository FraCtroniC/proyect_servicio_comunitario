import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  page: number;
  limit: number;
  total: number;
  pages: number;
  loading?: boolean;
  showLimitSelector?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function PaginationBar({ page, limit, total, pages, loading, showLimitSelector = true, onPageChange, onLimitChange }: PaginationBarProps) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageNumbers: (number | '...')[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push('...');
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (page < pages - 2) pageNumbers.push('...');
    pageNumbers.push(pages);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm">
      <span className="text-slate-500 font-medium">
        Mostrando {from}–{to} de {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-1 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              disabled={loading}
              onClick={() => onPageChange(p)}
              className={`px-2.5 py-1 rounded font-semibold text-xs transition-colors ${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= pages || loading}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {showLimitSelector && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={loading}
            className="ml-2 border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        )}
      </div>
    </div>
  );
}
