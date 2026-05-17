export function DashboardPage() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-3xl bg-ink p-6 text-sand lg:col-span-2">
        <p className="text-sm uppercase tracking-[0.3em] text-sun">Inicio</p>
        <h3 className="mt-3 text-2xl font-semibold">Base operativa del sistema</h3>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Esta primera entrega deja montada la navegación, el estado global con Zustand y la estructura de módulos para continuar con autenticación, asistencia y notas.
        </p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-500">Estado</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          <li>Arquitectura por features</li>
          <li>Rutas protegidas preparadas</li>
          <li>Lógica de promedio aislada</li>
        </ul>
      </article>
    </section>
  );
}