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
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-coral">Notas</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">Carga y promedio</h3>
        <p className="mt-2 text-sm text-slate-600">Vista de ejemplo con promedio calculado por materia.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.25rem] border border-slate-200/90 bg-white p-5">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">Calificaciones</h4>
          <ul className="mt-5 space-y-3">
            {sampleGrades.map((grade) => (
              <li
                key={grade.subject}
                className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-sand/40 px-4 py-3"
              >
                <span className="font-semibold text-ink">{grade.subject}</span>
                <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-sand">{grade.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] bg-panel-accent p-6 text-sand shadow-sharp">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-sun">Promedio general</p>
          <p className="mt-4 font-display text-5xl font-semibold">{average.toFixed(2)}</p>
          <p className="mt-3 text-sm text-slate-300">Calculado con la utilidad centralizada del proyecto.</p>
        </div>
      </div>
    </section>
  );
}
