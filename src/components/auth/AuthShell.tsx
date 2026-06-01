import type { ReactNode } from 'react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-coral/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-moss/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-coral">Liceo Estilita Orozco</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-ink">
            Gestión escolar con <span className="text-gradient">carácter</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
            Notas, asistencia y panel administrativo en un entorno seguro, claro y listo para el día a día del plantel.
          </p>
          <ul className="mt-10 space-y-4 text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-sand">01</span>
              Acceso con usuario y contraseña
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">02</span>
              Recuperación de credenciales integrada
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-moss text-xs font-bold text-white">03</span>
              Módulos de asistencia y calificaciones
            </li>
          </ul>
        </section>

        <section className="card-sharp w-full max-w-md justify-self-center lg:max-w-none">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-coral">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
