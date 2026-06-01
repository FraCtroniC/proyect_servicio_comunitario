import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const linkBase =
  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition';

const titles: Record<string, { eyebrow: string; title: string }> = {
  '/': { eyebrow: 'Panel', title: 'Resumen general' },
  '/attendance': { eyebrow: 'Operación', title: 'Control de asistencia' },
  '/grades': { eyebrow: 'Académico', title: 'Gestión de notas' },
};

export function AppLayout() {
  const location = useLocation();
  const userName = useAuthStore((state) => state.userName);
  const displayName = useAuthStore((state) => state.displayName);
  const signOut = useAuthStore((state) => state.signOut);
  const header = titles[location.pathname] ?? titles['/'];

  return (
    <div className="min-h-screen bg-hero-grid font-sans text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-sharp backdrop-blur-xl md:flex">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-coral">Liceo</p>
            <h1 className="font-display text-2xl font-semibold leading-tight">Estilita Orozco</h1>
            <p className="text-sm text-slate-600">Notas, asistencia y administración.</p>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-ink text-sand shadow-sharp' : 'text-slate-600 hover:bg-sand'}`
              }
            >
              <span className="text-lg" aria-hidden>
                ◆
              </span>
              Panel
            </NavLink>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-coral text-white shadow-glow' : 'text-slate-600 hover:bg-sand'}`
              }
            >
              <span className="text-lg" aria-hidden>
                ✓
              </span>
              Asistencia
            </NavLink>
            <NavLink
              to="/grades"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-moss text-white shadow-sharp' : 'text-slate-600 hover:bg-sand'}`
              }
            >
              <span className="text-lg" aria-hidden>
                ★
              </span>
              Notas
            </NavLink>
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200/80 bg-sand/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-moss">Sesión</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{displayName ?? userName ?? 'Usuario'}</p>
            <p className="text-xs text-slate-500">@{userName ?? 'demo'}</p>
            <button type="button" onClick={signOut} className="mt-4 w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-95">
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-sharp backdrop-blur-xl md:p-8">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200/70 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-moss">{header.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">{header.title}</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-sand/80 px-4 py-2 text-sm font-semibold text-slate-700 md:hidden">
              {displayName ?? userName}
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
