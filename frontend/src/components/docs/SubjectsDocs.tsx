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

export default function SubjectsDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Plan de Estudio</h2>
        <p className="text-sm text-slate-500">
          Configuracion de las materias del plan de estudio segun normativa MPPE. Define codigos, tipos de calificacion y posiciones en el boletin. Accesible para <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Filtrar Materias por Año</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Use el dropdown de filtro para seleccionar: <Field name="Todos los Años" />, <Field name="1er Año" />, <Field name="2do Año" />, etc.
          </Step>
          <Step n={2}>
            La tabla se actualizara mostrando solo las materias del año seleccionado.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Agregar una Materia al Plan</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Agregar Materia" />.
          </Step>
          <Step n={2}>
            Complete los campos:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Materia" /> — Nombre de la asignatura (ej. "Castellano"). Solo letras y espacios.</li>
              <li><Field name="Código Asignatura" /> — Codigo corto MPPE (ej. "CAS1"). Sin espacios.</li>
              <li><Field name="Tipo de Calificación" /> — <strong>Cuantitativo</strong> (Numerico 1-20) o <strong>Cualitativo</strong> (Letras A-D).</li>
              <li><Field name="Posición en Boletín" /> — Numero de posicion (mayor a 0). No puede repetirse en el mismo año.</li>
              <li><Field name="Año Escolar" /> — Seleccione de 1° a 5° año.</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Guardar Materia" />.
          </Step>
        </ol>
        <Warn>
          No puede haber dos materias con el mismo codigo ni la misma posicion en el mismo año.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar una Materia</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Editar" /> en la fila de la materia.
          </Step>
          <Step n={2}>
            Modifique los campos que desee.
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Guardar Cambios" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Eliminar una Materia</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Eliminar" /> en la fila de la materia.
          </Step>
          <Step n={2}>
            Confirme la eliminacion en el modal haciendo clic en <Field name="Eliminar" />.
          </Step>
        </ol>
        <Warn>
          Solo puede eliminar materias que no tengan calificaciones registradas.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Tabla del Plan de Estudio</h3>
        <p className="text-sm text-slate-600">La tabla muestra las siguientes columnas:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>CÓDIGO</strong> — Codigo MPPE de la materia</li>
          <li><strong>TIPO</strong> — Badge: <span className="text-blue-600">CUANTI</span> o <span className="text-purple-600">CUALI</span></li>
          <li><strong>MATERIA</strong> — Nombre completo de la asignatura</li>
          <li><strong>POSICIÓN</strong> — Numero de orden en el boletin</li>
          <li><strong>AÑO</strong> — Grado al que pertenece (1° a 5°)</li>
          <li><strong>ACCIONES</strong> — Botones Editar y Eliminar</li>
        </ul>
      </div>
    </div>
  );
}
