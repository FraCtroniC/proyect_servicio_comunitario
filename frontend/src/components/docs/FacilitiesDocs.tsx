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

export default function FacilitiesDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Salones y Aulas</h2>
        <p className="text-sm text-slate-500">
          Inventario de planta fisica del liceo: aulas teoricas, laboratorios y espacios deportivos. Accesible para <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Ver el Inventario de Aulas</h3>
        <p className="text-sm text-slate-600">
          Al acceder al modulo, se muestra un directorio de aulas en formato de tarjetas. Cada tarjeta muestra:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>Nombre/Identificador</strong> del espacio (ej. "LABORATORIO DE BIOLOGÍA")</li>
          <li><strong>Capacidad Máxima</strong> de pupitres/alumnos</li>
          <li><strong>Ocupado</strong> — Cantidad de clases asignadas por semana</li>
          <li><strong>Badge de capacidad</strong>: <span className="text-amber-600">Capacidad Reducida</span> (lab/taller) o <span className="text-green-600">Capacidad Óptima EMG</span></li>
          <li><strong>Aula Base</strong> — Seccion a la que esta asignada (si aplica)</li>
          <li><strong>Ubicación</strong> — Planta Baja, Piso 1, Piso 2</li>
        </ul>
        <Note>
          Si hay muchas aulas, haga clic en <Field name="Cargar más aulas" /> para ver las restantes.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Registrar una Nueva Aula</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en el boton <Field name="Agregar Aula" />.
          </Step>
          <Step n={2}>
            Complete los campos del formulario:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Nombre / Identificador del Espacio" /> — Ej. "LABORATORIO DE BIOLOGÍA"</li>
              <li><Field name="Aforo / Capacidad de Pupitres" /> — Numero entero mayor a 0</li>
              <li><Field name="Función / Tipología" /> — Seleccione: Teórica, Laboratorio Especializado, o Deportiva / Recreativa</li>
              <li><Field name="Ubicación (Nivel / Piso)" /> — Seleccione: Planta Baja, Piso 1, o Piso 2</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Registrar Aula en Inventario" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar un Aula</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la tarjeta del aula, haga clic en <Field name="Editar" />.
          </Step>
          <Step n={2}>
            Modifique los campos que desee cambiar (nombre, capacidad, tipo, ubicacion).
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Registrar Aula en Inventario" /> para guardar los cambios.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Desincorporar un Aula</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Desincorporar" /> en la tarjeta del aula.
          </Step>
          <Step n={2}>
            Se abrira un modal de confirmacion. Haga clic en <Field name="Desincorporar" /> para confirmar.
          </Step>
        </ol>
        <Warn>
          No se puede desincorporar un aula que tenga bloques horarios planificados pendientes. Primero debe eliminar o reasignar los horarios asociados.
        </Warn>
      </div>
    </div>
  );
}
