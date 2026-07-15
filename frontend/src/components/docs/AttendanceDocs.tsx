import { AlertTriangle, Info } from 'lucide-react';

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">{n}</span>
      <span className="text-sm text-slate-700 leading-relaxed">{children}</span>
    </li>
  );
}

function Field({ name }: { name: string }) {
  return <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200">{name}</code>;
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mt-3">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-3">
      <Info className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export default function AttendanceDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Control de Asistencia</h2>
        <p className="text-sm text-slate-500">
          Registro de asistencia estudiantil y control de entrada/salida de docentes. Accesible para <strong>Director</strong>, <strong>Control de Estudios</strong> y <strong>Docentes</strong>.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-200 pb-2">Sub-módulos Disponibles</h3>

        {/* Asistencia Estudiantil */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">1. Asistencia Estudiantil</h4>
          <p className="text-sm text-slate-600">Planilla diaria de control de asistencia para estudiantes.</p>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Filtrar la Vista</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                Seleccione el <Field name="Año Escolar" /> (1° a 5°).
              </Step>
              <Step n={2}>
                Seleccione la <Field name="Sección" />.
              </Step>
              <Step n={3}>
                Opcionalmente filtre por <Field name="Materia" />, <Field name="Docente" /> y <Field name="Bloque Horario" />.
              </Step>
              <Step n={4}>
                Use el selector <Field name="Fecha de Diario" /> para elegir la fecha (minimo inicio del año escolar, maximo hoy).
              </Step>
            </ol>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Registrar Asistencia</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                En la tabla <Field name="Planilla de Control Asistencia Diaria" />, ubique a cada estudiante.
              </Step>
              <Step n={2}>
                Para cada estudiante, haga clic en uno de los botones de estado:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong className="text-green-600">P</strong> — Presente</li>
                  <li><strong className="text-red-600">A</strong> — Ausente</li>
                  <li><strong className="text-amber-600">J</strong> — Justificado</li>
                </ul>
              </Step>
              <Step n={3}>
                Opcionalmente escriba una <Field name="Observación" /> para justificar la ausencia.
              </Step>
              <Step n={4}>
                La asistencia se guarda automaticamente al hacer clic en el boton de estado.
              </Step>
            </ol>
            <Note>
              Los resumen en la parte superior muestra: <span className="text-green-600 font-semibold">Presentes</span>, <span className="text-red-600 font-semibold">Ausentes</span>, y <span className="text-amber-600 font-semibold">Justificados</span>.
            </Note>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Acciones Adicionales</h5>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li><Field name="Reporte PDF" /> — Genera un PDF con la planilla de asistencia del dia.</li>
              <li><Field name="Sincronizar Inasistencias con Calificaciones" /> — Marca automaticamente las inasistencias como calificacion 0 en las evaluaciones del dia.</li>
            </ul>
          </div>
        </div>

        {/* Mi Clase */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">2. Mi Clase (Docentes)</h4>
          <p className="text-sm text-slate-600">Vista exclusiva del docente con su horario del día y asistencia por bloque.</p>
          <ol className="space-y-3 list-none">
            <Step n={1}>
              Al acceder a esta pestana, se muestran las <strong>tarjetas de sus clases programadas</strong> para el dia actual.
            </Step>
            <Step n={2}>
              Cada tarjeta muestra: bloque, horario, asignatura, seccion y cantidad de estudiantes.
            </Step>
            <Step n={3}>
              Haga clic en una tarjeta para tomar asistencia de esa clase especifica.
            </Step>
          </ol>
          <Note>
            Solo aparecen las clases asignadas al docente que inicio sesion.
          </Note>
        </div>

        {/* Firma de Reloj */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">3. Firma de Reloj (Docentes)</h4>
          <p className="text-sm text-slate-600">Simulador del reloj biometrico de entrada y salida del personal docente.</p>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Marcar Entrada</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                Seleccione el docente en <Field name="Seleccionar Docente de Guardia" />.
              </Step>
              <Step n={2}>
                Haga clic en <Field name="Marcar Entrada" />.
              </Step>
              <Step n={3}>
                El sistema registrara la hora automaticamente y determinara el estatus: <span className="text-green-600">Puntual</span> o <span className="text-amber-600">Retardo</span>.
              </Step>
            </ol>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Marcar Salida</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                En la tabla de <Field name="Registro del Reloj de Control" />, ubique la fila del docente.
              </Step>
              <Step n={2}>
                Haga clic en <Field name="Marcar Salida" />.
              </Step>
            </ol>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Justificar Inasistencia</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                En la tabla, haga clic en <Field name="Justificar" /> en la fila del docente.
              </Step>
              <Step n={2}>
                Ingrese el <Field name="Motivo de la Inasistencia" /> (obligatorio).
              </Step>
              <Step n={3}>
                Opcionalmente adjunte un <Field name="Soporte Digital" /> (URL o referencia).
              </Step>
              <Step n={4}>
                Haga clic en <Field name="Guardar Justificación" />.
              </Step>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
