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

export default function PendingDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Materias Pendientes</h2>
        <p className="text-sm text-slate-500">
          Gestion de asignaturas de arrastre y revision para estudiantes que no aprobaron. Accesible para <strong>Director</strong>, <strong>Control de Estudios</strong> y <strong>Coordinador</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Buscar y Filtrar</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En <Field name="Buscar por cédula o nombre del estudiante..." />, escriba el termino de busqueda.
          </Step>
          <Step n={2}>
            Use el dropdown <Field name="Todos los Estatus" /> para filtrar por: Solo Cursando, Solo Aprobadas, o Solo Aplazadas.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Inscribir una Materia Pendiente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Inscribir Materia" />.
          </Step>
          <Step n={2}>
            Seleccione el <Field name="Estudiante" /> en el dropdown.
          </Step>
          <Step n={3}>
            Seleccione la <Field name="Asignatura Reprobada" />. Solo apareceran las materias reprobadas del estudiante.
          </Step>
          <Step n={4}>
            Seleccione el <Field name="Período Escolar" />.
          </Step>
          <Step n={5}>
            Opcionalmente seleccione un <Field name="Docente Evaluador" />.
          </Step>
          <Step n={6}>
            Haga clic en <Field name="Inscribir Materia" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Evaluar una Materia Pendiente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la tabla, ubique la materia con estatus <Field name="Cursando" />.
          </Step>
          <Step n={2}>
            Haga clic en <Field name="Evaluar (Cargar Nota)" />.
          </Step>
          <Step n={3}>
            Ingrese la <Field name="Nota Definitiva (1-20)" /> (ej. 14).
          </Step>
          <Step n={4}>
            Haga clic en <Field name="Guardar Calificación" />.
          </Step>
        </ol>
        <Warn>
          La calificacion debe ser un numero entre 1 y 20. Si el estudiante obtiene 10 o mas, la materia quedara como "Aprobada".
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Eliminar una Materia Pendiente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Eliminar" /> en la fila de la materia.
          </Step>
          <Step n={2}>
            Confirme en el modal haciendo clic en <Field name="Eliminar" />.
          </Step>
        </ol>
        <Warn>
          Esta accion no se puede deshacer.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Generar Acta PDF</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Generar Acta PDF" /> en la fila de la materia pendiente.
          </Step>
          <Step n={2}>
            Se descargara un documento PDF con el acta de evaluacion de la materia pendiente.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Tabla de Materias Pendientes</h3>
        <p className="text-sm text-slate-600">La tabla muestra las siguientes columnas:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>Estudiante</strong> — Nombre y cedula</li>
          <li><strong>Asignatura</strong> — Materia reprobada</li>
          <li><strong>Período / Evaluador</strong> — Periodo escolar y docente asignado</li>
          <li><strong>Nota Def.</strong> — Calificacion definitiva (si fue evaluada)</li>
          <li><strong>Estatus</strong> — Badge: <span className="text-amber-600">Cursando</span>, <span className="text-green-600">Aprobada</span>, <span className="text-red-600">Aplazada</span></li>
          <li><strong>Acciones</strong> — Botones de Evaluar, Eliminar y Generar Acta PDF</li>
        </ul>
      </div>
    </div>
  );
}
