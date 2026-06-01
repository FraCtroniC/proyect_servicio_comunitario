import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const titles: Record<string, { eyebrow: string; title: string }> = {
  '/': { eyebrow: 'Resumen', title: 'Panel general' },
  '/attendance': { eyebrow: 'Operaciones', title: 'Control de asistencia' },
  '/grades': { eyebrow: 'Académico', title: 'Gestión de calificaciones' },
};

export function AppLayout() {
  const location = useLocation();
  const userName = useAuthStore((state) => state.userName);
  const displayName = useAuthStore((state) => state.displayName);
  const signOut = useAuthStore((state) => state.signOut);
  const header = titles[location.pathname] ?? titles['/'];

  const navClass = (isActive: boolean) =>
    `nav-item ${isActive ? 'nav-item-active' : 'nav-item-idle'}`;

  return (
    <div className="min-h-screen bg-app-surface font-sans text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 flex-col rounded-2xl border border-line bg-paper p-6 shadow-card md:flex">
          <div className="border-b border-line pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Liceo Estilita Orozco</p>
            <h1 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">Sistema escolar</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate">Administración académica</p>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5" aria-label="Navegación principal">
            <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>
              Panel general
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => navClass(isActive)}>
              Asistencia
            </NavLink>
            <NavLink to="/grades" className={({ isActive }) => navClass(isActive)}>
              Calificaciones
            </NavLink>
          </nav>

          <div className="mt-auto rounded-xl border border-line bg-mist p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Sesión activa</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{displayName ?? userName}</p>
            <p className="text-xs text-slate">@{userName}</p>
            <button type="button" onClick={signOut} className="btn-secondary mt-4 w-full">
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-2xl border border-line bg-paper p-5 shadow-card md:p-8">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">{header.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{header.title}</h2>
            </div>
            <div className="badge border-line bg-mist text-charcoal md:hidden">{displayName ?? userName}</div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
