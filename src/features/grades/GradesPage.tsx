import { calculateAverage } from '@/utils/calculateAverage';

const sampleGrades = [85, 90, 78];

export function GradesPage() {
  const average = calculateAverage(sampleGrades);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coral">Notas</p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">Carga y promedio</h3>
      <p className="mt-2 text-sm text-slate-600">
        Base para la gestión de calificaciones de media general con lógica de promedio separada.
      </p>
      <div className="mt-6 rounded-3xl bg-sand p-5">
        <p className="text-sm text-slate-600">Promedio de ejemplo</p>
        <p className="text-4xl font-semibold text-ink">{average.toFixed(2)}</p>
      </div>
    </section>
  );
}