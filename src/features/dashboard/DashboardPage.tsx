import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function DashboardPage() {
  const displayName = useAuthStore((s) => s.displayName) ?? 'Usuario';

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <article className="relative overflow-hidden rounded-[1.5rem] bg-panel-accent p-7 text-sand lg:col-span-2">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-coral/30 blur-2xl" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-sun">Bienvenido</p>
        <h3 className="mt-3 font-display text-3xl font-semibold">Hola, {displayName}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
          Panel central del liceo. Desde aquí accedes a asistencia diaria, calificaciones y el resumen operativo del
          sistema.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/attendance" className="rounded-xl bg-coral px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-glow">
            Ir a asistencia
          </Link>
          <Link
            to="/grades"
            className="rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold text-sand transition hover:bg-white/20"
          >
            Ver notas
          </Link>
        </div>
      </article>

      <article className="rounded-[1.5rem] border border-slate-200/90 bg-sand/50 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Estado</p>
        <ul className="mt-5 space-y-4">
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Autenticación</span>
            <span className="stat-pill bg-moss/15 text-moss">Activa</span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Módulo asistencia</span>
            <span className="stat-pill bg-coral/15 text-coral">Listo</span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Promedio de notas</span>
            <span className="stat-pill bg-gold/20 text-charcoal">Operativo</span>
          </li>
        </ul>
      </article>

      <article className="rounded-[1.5rem] border border-slate-200/90 bg-white p-6 lg:col-span-3">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-coral">Acceso rápido</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Marcar asistencia del día', to: '/attendance', tone: 'text-coral' },
            { label: 'Consultar promedios', to: '/grades', tone: 'text-moss' },
            { label: 'Cerrar sesión al terminar', to: '/login', tone: 'text-slate-600' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-xl border border-slate-200 bg-sand/40 p-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-coral/40 hover:bg-white hover:shadow-soft"
            >
              <span className={`text-xs font-bold uppercase tracking-wide ${item.tone}`}>→</span>
              <p className="mt-2 text-ink">{item.label}</p>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
