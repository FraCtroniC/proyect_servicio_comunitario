import { useEffect } from 'react';
import { useAttendanceStore } from '@/store/useAttendanceStore';

const sampleStudents = ['María Pérez', 'Juan Gómez', 'Ana Torres', 'Luis Martínez'];

export function AttendancePage() {
  const { students, presence, setStudents, togglePresence, saveRecord, records, clearPresence } = useAttendanceStore((s) => s);

  useEffect(() => {
    if (students.length === 0) setStudents(sampleStudents);
  }, [students.length, setStudents]);

  const presentCount = students.filter((name) => presence[name]).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Registro diario</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Lista de asistencia</h3>
          <p className="mt-2 text-sm text-slate">Marque los estudiantes presentes y guarde el registro oficial.</p>
        </div>
        <div className="badge border-accent/20 bg-accent/5 text-accent">
          {presentCount} / {students.length} presentes
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-mist p-5">
          <h4 className="text-sm font-semibold text-ink">Estudiantes</h4>
          <ul className="mt-5 space-y-2">
            {students.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3"
              >
                <span className="text-sm font-medium text-charcoal">{name}</span>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate">
                  <input
                    type="checkbox"
                    checked={!!presence[name]}
                    onChange={() => togglePresence(name)}
                    className="h-4 w-4 accent-accent"
                  />
                  Presente
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => saveRecord()} className="btn-primary">
              Guardar registro
            </button>
            <button type="button" onClick={() => clearPresence()} className="btn-secondary">
              Limpiar selección
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-paper p-5">
          <h4 className="text-sm font-semibold text-ink">Historial reciente</h4>
          <ul className="mt-5 space-y-3">
            {records.length === 0 && (
              <li className="rounded-lg bg-mist px-4 py-8 text-center text-sm text-slate">Sin registros guardados.</li>
            )}
            {records.map((r) => (
              <li key={r.id} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{new Date(r.date).toLocaleString()}</p>
                  <span className="badge border-success/25 bg-success/10 text-success">
                    {r.entries.filter((e) => e.present).length} presentes
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.entries.map((e) => (
                    <span
                      key={e.name}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${e.present ? 'bg-accent text-paper' : 'bg-mist text-charcoal'}`}
                    >
                      {e.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
