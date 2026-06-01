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
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-moss">Asistencia</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Control diario</h3>
          <p className="mt-2 text-sm text-slate-600">Marca presentes y guarda el registro del día.</p>
        </div>
        <div className="rounded-xl border border-moss/25 bg-moss/10 px-4 py-2 text-sm font-bold text-moss">
          {presentCount} / {students.length} presentes
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.25rem] border border-slate-200/90 bg-sand/30 p-5">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">Lista de estudiantes</h4>
          <ul className="mt-5 space-y-3">
            {students.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-xl border border-white/80 bg-white px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-ink">{name}</span>
                <label className="inline-flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!presence[name]}
                    onChange={() => togglePresence(name)}
                    className="h-4 w-4 accent-moss"
                  />
                  <span className="text-sm font-medium text-slate-600">Presente</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => saveRecord()} className="btn-primary">
              Guardar registro
            </button>
            <button
              onClick={() => clearPresence()}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-slate-200/90 bg-white p-5">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">Registros recientes</h4>
          <ul className="mt-5 space-y-4">
            {records.length === 0 && (
              <li className="rounded-xl bg-sand/60 px-4 py-6 text-center text-sm text-slate-500">No hay registros guardados.</li>
            )}
            {records.map((r) => (
              <li key={r.id} className="rounded-xl border border-slate-200/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-ink">{new Date(r.date).toLocaleString()}</div>
                  <div className="stat-pill bg-moss/15 text-moss">
                    {r.entries.filter((e) => e.present).length} presentes
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.entries.map((e) => (
                    <span
                      key={e.name}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${e.present ? 'bg-moss text-white' : 'bg-sand text-slate-600'}`}
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
