import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function DashboardPage() {
  const displayName = useAuthStore((s) => s.displayName) ?? 'Usuario';

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <article className="rounded-2xl bg-panel-dark p-7 text-paper lg:col-span-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze">Bienvenida</p>
        <h3 className="mt-3 font-display text-3xl font-semibold">Estimado(a), {displayName}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
          Desde este panel puede acceder a los módulos de asistencia y calificaciones. Todas las acciones quedan
          asociadas a su sesión institucional activa.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/attendance" className="btn-primary">
            Registrar asistencia
          </Link>
          <Link to="/grades" className="btn-secondary border-white/20 bg-transparent text-paper hover:bg-white/10">
            Ver calificaciones
          </Link>
        </div>
      </article>

      <article className="rounded-2xl border border-line bg-mist p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Estado del sistema</p>
        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span className="text-charcoal">Autenticación</span>
            <span className="badge border-success/30 bg-success/10 text-success">Activa</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="text-charcoal">Protección de sesión</span>
            <span className="badge border-accent/20 bg-accent/10 text-accent">Habilitada</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="text-charcoal">Módulos académicos</span>
            <span className="badge border-line bg-paper text-charcoal">Operativos</span>
          </li>
        </ul>
      </article>

      <article className="rounded-2xl border border-line bg-paper p-6 lg:col-span-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Accesos directos</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Control de asistencia diaria', to: '/attendance' },
            { label: 'Consulta de promedios', to: '/grades' },
            { label: 'Cerrar sesión al finalizar', to: '/login' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-xl border border-line bg-mist p-4 text-sm font-medium text-charcoal transition hover:border-accent/25 hover:bg-paper"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
