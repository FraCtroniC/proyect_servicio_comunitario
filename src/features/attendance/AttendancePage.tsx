import { useEffect } from 'react';
import { useAttendanceStore } from '@/store/useAttendanceStore';

const sampleStudents = ['María Pérez', 'Juan Gómez', 'Ana Torres', 'Luis Martínez'];

export function AttendancePage() {
  const { students, presence, setStudents, togglePresence, saveRecord, records, clearPresence } = useAttendanceStore((s) => s);

  useEffect(() => {
    if (students.length === 0) setStudents(sampleStudents);
  }, [students.length, setStudents]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-moss">Asistencia</p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">Control diario</h3>
      <p className="mt-2 text-sm text-slate-600">Marca asistencia para los estudiantes listados y guarda el registro.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <h4 className="text-sm font-semibold text-slate-700">Lista de estudiantes</h4>
          <ul className="mt-4 space-y-3">
            {students.map((name) => (
              <li key={name} className="flex items-center justify-between">
                <span>{name}</span>
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" checked={!!presence[name]} onChange={() => togglePresence(name)} />
                  <span className="text-sm text-slate-600">Presente</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => saveRecord()}
              className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-sand"
            >
              Guardar registro
            </button>
            <button
              onClick={() => clearPresence()}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border p-4">
          <h4 className="text-sm font-semibold text-slate-700">Registros recientes</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {records.length === 0 && <li>No hay registros guardados.</li>}
            {records.map((r) => (
              <li key={r.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{new Date(r.date).toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{r.entries.filter((e) => e.present).length} presentes</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.entries.map((e) => (
                    <span key={e.name} className={`rounded-full px-3 py-1 text-xs ${e.present ? 'bg-moss text-white' : 'bg-sand text-slate-700'}`}>
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