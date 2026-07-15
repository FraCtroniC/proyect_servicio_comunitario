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

export default function SectionsDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Gestion de Secciones</h2>
        <p className="text-sm text-slate-500">
          Administracion de secciones activas por grado y periodo escolar. Cada seccion representa un grupo de estudiantes dentro de un año escolar. Accesible para <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Filtrar Secciones</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Use el filtro <Field name="Periodo Académico" /> para ver secciones de un periodo especifico o <Field name="Todos los Períodos" />.
          </Step>
          <Step n={2}>
            Use el filtro de año (<Field name="Todos los Años" />, <Field name="1° Año" />, etc.) para filtrar por grado.
          </Step>
          <Step n={3}>
            Las tarjetas se actualizaran automaticamente mostrando las secciones que coincidan con los filtros.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Aperturar una Nueva Seccion</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Aperturar Sección" />.
          </Step>
          <Step n={2}>
            Complete los campos:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Periodo Académico" /> — Seleccione el periodo escolar</li>
              <li><Field name="Grado / Año" /> — Seleccione de 1° a 5° año</li>
              <li><Field name="Letra" /> — Seleccione la letra (A, B, C, D, E, F)</li>
              <li><Field name="Docente Guía" /> — Seleccione el docente encargado de guiar la seccion</li>
              <li><Field name="Aula Base" /> — Seleccione el aula asignada a esta seccion</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Aperturar Sección" />.
          </Step>
        </ol>
        <Note>
          No pueden existir dos secciones con la misma letra en el mismo año y periodo.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Ver Detalle de una Seccion</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic sobre la tarjeta de la seccion que desea consultar.
          </Step>
          <Step n={2}>
            Se abrira un modal con la informacion detallada:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>Periodo</strong> escolar al que pertenece</li>
              <li><strong>Docente Guía</strong> asignado</li>
              <li><strong>Aula Base</strong> del grupo</li>
              <li><strong>Estudiantes</strong> matriculados (cantidad)</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Cerrar" /> para volver a la grilla de secciones.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Informacion en las Tarjetas</h3>
        <p className="text-sm text-slate-600">Cada tarjeta muestra:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>Sección "X"</strong> — Letra de la seccion</li>
          <li><strong>Cupos</strong> — Ej. "15 / 35 cupos" (ocupados / maximos)</li>
          <li><strong>Badge LLENO</strong> — Cuando la seccion alcanza su capacidad maxima</li>
          <li><strong>Aula Base</strong> — Nombre del aula asignada</li>
        </ul>
      </div>
    </div>
  );
}
