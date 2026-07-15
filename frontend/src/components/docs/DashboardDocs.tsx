import { Info } from 'lucide-react';

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

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-3">
      <Info className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export default function DashboardDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Dashboard / Indicadores</h2>
        <p className="text-sm text-slate-500">
          Panel principal con estadisticas generales del liceo. Primer modulo que se muestra al iniciar sesion. Solo visible para roles de <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Tarjetas de Indicadores (KPIs)</h3>
        <p className="text-sm text-slate-600">En la parte superior se muestran 4 tarjetas con datos clave:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <span className="font-bold text-slate-800 block">Estudiantes</span>
            <span className="text-xs text-slate-500">Total de alumnos activos matriculados</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <span className="font-bold text-slate-800 block">Docentes</span>
            <span className="text-xs text-slate-500">Personal academico activo</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <span className="font-bold text-slate-800 block">Asistencia Gral.</span>
            <span className="text-xs text-slate-500">Promedio de puntualidad docente</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <span className="font-bold text-slate-800 block">Promedio Escolar</span>
            <span className="text-xs text-slate-500">Promedio general de calificaciones</span>
          </div>
        </div>
        <Note>
          Las tarjetas de Estudiantes y Docentes son clickeables y redirigen a los modulos correspondientes.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Grafico de Rendimiento Academico</h3>
        <p className="text-sm text-slate-600">Muestra un grafico de barras con el rendimiento promedio por año de Educacion Media (1° a 5°):</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong className="text-green-600">Aprobados</strong> — Alumnos con promedio {'>='} 10</li>
          <li><strong className="text-red-600">Aplazados</strong> — Alumnos con promedio {'<'} 10</li>
        </ul>
        <p className="text-sm text-slate-600">La escala utilizada es la oficial MPPE del <strong>1 al 20</strong>.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Alertas de Repitencia</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            El sistema identifica automaticamente estudiantes con promedio acumulado inferior a 10 puntos.
          </Step>
          <Step n={2}>
            Si hay estudiantes en riesgo, se muestra un panel de <Field name="Notificaciones de Control de Estudios" /> con la lista de alumnos afectados.
          </Step>
          <Step n={3}>
            Para cada estudiante en riesgo, haga clic en <Field name="Enviar Alerta" /> para notificar al representante.
          </Step>
          <Step n={4}>
            Se abrira un modal de confirmacion. Haga clic en <Field name="Enviar Alerta" /> para confirmar el envio.
          </Step>
        </ol>
        <Note>
          La normativa de repitencia (Art. 112 RLOE) establece que los alumnos de 1° a 5° año que reprueben 3 o mas asignaturas deben repetir el año completo. Con 1 o 2 materias pendientes tienen derecho a presentar evaluaciones extraordinarias.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Descarga de Respaldo (Solo Director)</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Si tiene el rol de <strong>Director</strong>, vera el boton <Field name="Descargar Respaldo BD (.sql)" /> en la parte inferior del dashboard.
          </Step>
          <Step n={2}>
            Haga clic en el boton. Se descargara un archivo <code className="bg-slate-100 text-indigo-700 px-1 rounded text-xs">.sql</code> con el respaldo completo de la base de datos.
          </Step>
        </ol>
        <Note>
          Este respaldo es exclusivo del rol de Director. Los demás roles no tienen acceso a esta funcion.
        </Note>
      </div>
    </div>
  );
}
