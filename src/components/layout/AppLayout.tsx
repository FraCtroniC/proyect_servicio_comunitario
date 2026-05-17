import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const linkBase = 'rounded-full px-4 py-2 text-sm font-medium transition';

export function AppLayout() {
  const userName = useAuthStore((state) => state.userName);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="min-h-screen bg-hero-grid text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur md:flex md:flex-col">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-coral">Liceo</p>
            <h1 className="text-2xl font-semibold">Estilita Orozco</h1>
            <p className="text-sm text-slate-600">Gestión de notas y asistencia.</p>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? 'bg-ink text-sand' : 'text-slate-600 hover:bg-slate-100'}`}>
              Panel
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-ink text-sand' : 'text-slate-600 hover:bg-slate-100'}`}>
              Asistencia
            </NavLink>
            <NavLink to="/grades" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-ink text-sand' : 'text-slate-600 hover:bg-slate-100'}`}>
              Notas
            </NavLink>
          </nav>

          <div className="mt-auto rounded-3xl bg-sand p-4 text-sm text-slate-700">
            <p className="font-semibold text-ink">Sesión activa</p>
            <p>{userName ?? 'Usuario demo'}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-4 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur md:p-8">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-moss">Sistema escolar</p>
              <h2 className="mt-2 text-3xl font-semibold">Panel inicial</h2>
            </div>
            <div className="rounded-full bg-sand px-4 py-2 text-sm text-slate-700 md:hidden">{userName ?? 'Usuario demo'}</div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}