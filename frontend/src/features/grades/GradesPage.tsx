import { calculateAverage } from '@/utils/calculateAverage';

const sampleGrades = [
  { subject: 'Matemáticas', score: 85 },
  { subject: 'Castellano', score: 90 },
  { subject: 'Ciencias', score: 78 },
];

export function GradesPage() {
  const scores = sampleGrades.map((g) => g.score);
  const average = calculateAverage(scores);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Calificaciones</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Resumen por materia</h3>
        <p className="mt-2 text-sm text-slate">Vista de referencia con cálculo de promedio institucional.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-line bg-paper p-5">
          <h4 className="text-sm font-semibold text-ink">Detalle</h4>
          <ul className="mt-5 space-y-2">
            {sampleGrades.map((grade) => (
              <li
                key={grade.subject}
                className="flex items-center justify-between rounded-lg border border-line bg-mist px-4 py-3"
              >
                <span className="text-sm font-medium text-charcoal">{grade.subject}</span>
                <span className="rounded-md bg-accent px-3 py-1 text-sm font-semibold text-paper">{grade.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-panel-dark p-6 text-paper shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Promedio general</p>
          <p className="mt-4 font-display text-5xl font-semibold">{average.toFixed(2)}</p>
          <p className="mt-3 text-sm text-slate-300">Calculado con la utilidad centralizada del sistema.</p>
        </div>
      </div>
    </section>
  );
}
