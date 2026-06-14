import type { ReactNode } from 'react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <main className="auth-backdrop relative min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Liceo Estilita Orozco
          </div>
          <h1 className="mt-8 font-display text-[2.75rem] font-semibold leading-[1.15] text-ink">
            Plataforma institucional de gestión académica
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate">
            Acceso controlado para administración de asistencia, calificaciones y seguimiento operativo del plantel.
          </p>
          <dl className="mt-12 grid gap-4 border-t border-line pt-8">
            {[
              ['Seguridad', 'Validación de entradas y bloqueo por intentos fallidos'],
              ['Sesión', 'Expiración automática por inactividad prolongada'],
              ['Integridad', 'Credenciales almacenadas con hash criptográfico'],
            ].map(([term, detail]) => (
              <div key={term} className="grid grid-cols-[7rem_1fr] gap-4 text-sm">
                <dt className="font-semibold text-ink">{term}</dt>
                <dd className="text-slate">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card-elevated w-full max-w-md justify-self-center lg:max-w-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
