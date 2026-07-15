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

export default function ScheduleDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Programacion Horaria</h2>
        <p className="text-sm text-slate-500">
          Asignacion de bloques academicos a docentes, secciones y aulas. Incluye deteccion automatica de conflictos. Accesible para <strong>Director</strong>, <strong>Control de Estudios</strong> y <strong>Docentes</strong> (solo consulta).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Asignar un Bloque Academico</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En el formulario <Field name="Asignar Bloque Académico" />, seleccione:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Día" /> — Lunes, Martes, Miércoles, Jueves o Viernes</li>
              <li><Field name="Bloque Horario" /> — Franja horaria disponible</li>
              <li><Field name="Año EMG" /> — Grado (1° a 5°)</li>
              <li><Field name="Sección" /> — Letra de la seccion (A, B, C, etc.)</li>
              <li><Field name="Asignatura" /> — Materia del plan de estudio</li>
              <li><Field name="Docente Responsable" /> — Profesor asignado</li>
              <li><Field name="Salón / Aula Física" /> — Espacio fisico</li>
            </ul>
          </Step>
          <Step n={2}>
            Haga clic en <Field name="Asignar y Verificar Overlaps" />.
          </Step>
          <Step n={3}>
            Si no hay conflictos, el bloque se guardara y aparecera en la grilla semanal. Si hay conflicto, el sistema mostrara un error indicando cual es el problema.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Tipos de Conflicto Detectados</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="font-bold text-red-700">Conflicto Docente</span>
            <p className="text-slate-600 mt-1">El docente ya esta asignado a otra seccion en el mismo bloque horario.</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="font-bold text-red-700">Conflicto Aula</span>
            <p className="text-slate-600 mt-1">El aula ya esta reservada para otra seccion en el mismo bloque.</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="font-bold text-red-700">Conflicto Planificación</span>
            <p className="text-slate-600 mt-1">Los estudiantes de la seccion ya tienen asignada otra clase durante ese periodo.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Filtrar la Vista del Horario</h3>
        <p className="text-sm text-slate-600">Puede cambiar la perspectiva de visualizacion usando las pestanas:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2 mt-2">
          <li><Field name="Por Año & Sección" /> — Ver el horario de una seccion especifica</li>
          <li><Field name="Por Profesor" /> — Ver la carga horaria de un docente</li>
          <li><Field name="Por Salón" /> — Ver la ocupacion de un aula</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar un Bloque</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Pase el cursor sobre el bloque en la grilla. Apareceran iconos de edicion y eliminacion.
          </Step>
          <Step n={2}>
            Haga clic en el icono de <strong>lapiz</strong>. El formulario cambiara a modo edicion.
          </Step>
          <Step n={3}>
            Modifique los campos necesarios y haga clic en <Field name="Guardar Cambios y Verificar Overlaps" />.
          </Step>
          <Step n={4}>
            Para cancelar la edicion, haga clic en <Field name="Cancelar Edición" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Eliminar un Bloque</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Pase el cursor sobre el bloque y haga clic en el icono de <strong>basura</strong>.
          </Step>
          <Step n={2}>
            Confirme en el modal haciendo clic en <Field name="Eliminar Asignación" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Exportar Horario a PDF</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Configure los filtros que desee exportar (por seccion, profesor o aula).
          </Step>
          <Step n={2}>
            Haga clic en <Field name="Exportar PDF" />.
          </Step>
          <Step n={3}>
            Se descargara un archivo PDF con el formato de horario de clases.
          </Step>
        </ol>
      </div>
    </div>
  );
}
