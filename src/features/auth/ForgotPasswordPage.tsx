import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">Recuperación</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Recuperar acceso</h1>
        <p className="mt-2 text-sm text-slate-600">
          Esta vista queda lista para conectar el flujo de recuperación cuando exista el servicio de backend.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-flex rounded-2xl bg-ink px-4 py-3 font-semibold text-sand transition hover:opacity-95"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}