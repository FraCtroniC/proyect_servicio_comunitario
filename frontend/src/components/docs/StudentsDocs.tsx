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

export default function StudentsDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Matricula de Estudiantes</h2>
        <p className="text-sm text-slate-500">
          Directorio de estudiantes matriculados y sus representantes (conforme a LOPNA). Accesible para <strong>Director</strong>, <strong>Control de Estudios</strong> y <strong>Coordinador</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Buscar y Filtrar Estudiantes</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Use el filtro <Field name="Año Escolar" />: Todos, 1er a 5to Año.
          </Step>
          <Step n={2}>
            Use el filtro <Field name="Sección" />: Todas o una seccion especifica.
          </Step>
          <Step n={3}>
            En <Field name="Buscar por Nombre, Cédula, Rep..." />, escriba el termino de busqueda.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Inscribir un Nuevo Estudiante</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Matricular Alumno" />.
          </Step>
          <Step n={2}>
            Complete la <strong>Ficha del Estudiante</strong>:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Cédula Escolar" /> — Cedula del estudiante</li>
              <li><Field name="Fecha Nac." /> — Fecha de nacimiento (el sistema validara que tenga al menos 10 años)</li>
              <li><Field name="Primer Nombre" />, <Field name="Segundo Nombre" />, <Field name="Primer Apellido" />, <Field name="Segundo Apellido" /></li>
              <li><Field name="Estado (Nacimiento)" /> y <Field name="Municipio (Nacimiento)" /></li>
              <li><Field name="Género" /> — Masculino o Femenino</li>
              <li><Field name="Año Escolar" /> y <Field name="Sección" /></li>
            </ul>
          </Step>
          <Step n={3}>
            Complete la seccion <strong>Representante Legal (LOPNA)</strong>:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Cédula Rep." /> — Cedula del representante</li>
              <li><Field name="Teléfono Rep." /></li>
              <li><Field name="Primer Nombre" />, <Field name="Segundo Nombre" />, <Field name="Primer Apellido" />, <Field name="Segundo Apellido" /></li>
              <li><Field name="Correo Rep." /> y <Field name="Dirección Rep." /></li>
            </ul>
          </Step>
          <Step n={4}>
            Haga clic en <Field name="Inscribir y Matricular" />.
          </Step>
        </ol>
        <Note>
          Todos los campos marcados con * son obligatorios. El sistema validara la cedula duplicada automaticamente.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar un Estudiante</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la columna <strong>Acciones</strong>, haga clic en el icono de <strong>lapiz</strong> (<Field name="Editar Registro" />).
          </Step>
          <Step n={2}>
            Modifique los campos necesarios en la ficha del estudiante y/o representante.
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Guardar Cambios" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Cambiar Estatus del Estudiante</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la columna <strong>Estatus</strong>, use el dropdown para seleccionar:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Activar" /> — Marcar como activo</li>
              <li><Field name="Pasar Inactivo" /> — Marcar temporalmente inactivo</li>
              <li><Field name="Marcar Retirado" /> — Retirado definitivo del año escolar</li>
            </ul>
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Ver Materias Pendientes de un Estudiante</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en el icono de <strong>libro</strong> (<Field name="Materias Pendientes" />) en la fila del estudiante.
          </Step>
          <Step n={2}>
            Se abrira el perfil academico del estudiante mostrando sus materias pendientes (arrastre).
          </Step>
          <Step n={3}>
            Para registrar una nueva materia pendiente, haga clic en <Field name="+ Registrar Nueva Materia Pendiente" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Generar Constancia de Estudio (PDF)</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en el icono de <strong>documento</strong> (<Field name="Constancia de Estudio" />) en la fila del estudiante.
          </Step>
          <Step n={2}>
            Se descargara un PDF con la constancia de estudio del estudiante.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Exportar Nomina de Estudiantes</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Aplique los filtros deseados (año, seccion, busqueda).
          </Step>
          <Step n={2}>
            Haga clic en <Field name="Exportar Nómina" />.
          </Step>
          <Step n={3}>
            Se descargara un archivo Excel con la lista de estudiantes filtrados.
          </Step>
        </ol>
      </div>
    </div>
  );
}
