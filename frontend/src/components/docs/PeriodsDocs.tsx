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

export default function PeriodsDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Periodos Escolares</h2>
        <p className="text-sm text-slate-500">
          Gestion de años academicos. Permite crear, activar y cerrar periodos escolares. Solo accesible para <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Crear un Periodo Escolar</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en el boton <Field name="Aperturar Nuevo Periodo" />.
          </Step>
          <Step n={2}>
            Ingrese el <Field name="Año de Inicio" /> (ejemplo: 2025). El sistema generara automaticamente el año escolar completo (ejemplo: "2025-2026").
          </Step>
          <Step n={3}>
            Seleccione el <Field name="Estatus Inicial" />:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>En Planificación</strong> — Solo permite configuraciones previas, sin inscripciones ni carga de notas.</li>
              <li><strong>Activo</strong> — Permite inscripciones de inmediato y carga de notas.</li>
            </ul>
          </Step>
          <Step n={4}>
            Haga clic en <Field name="Registrar Periodo" />.
          </Step>
        </ol>
        <Warn>
          Solo puede haber un periodo con estatus "Activo" a la vez. Si ya existe uno activo, debera cerrarlo antes de activar otro.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Activar un Periodo</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la tabla de historico de periodos, ubique el periodo con estatus <Field name="En Planificación" />.
          </Step>
          <Step n={2}>
            Haga clic en el boton <Field name="Activar" /> (o <Field name="Reactivar" /> si esta cerrado).
          </Step>
          <Step n={3}>
            Se abrira un modal de confirmacion. Haga clic en <Field name="Sí, Activar Periodo" />.
          </Step>
        </ol>
        <Note>
          Si el periodo esta cerrado y desea reactivarlo, solo el rol de <strong>Director</strong> puede realizar esta accion.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Cerrar un Periodo</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Ubique el periodo activo en la tabla. Haga clic en <Field name="Cerrar" />.
          </Step>
          <Step n={2}>
            Se abrira un modal con una advertencia de <strong>"Acción Irreversible"</strong>. Lea cuidadosamente: todas las secciones y notas vinculadas quedaran congeladas como historico.
          </Step>
          <Step n={3}>
            Para confirmar, escriba exactamente la palabra <Field name="CERRAR" /> en el campo de texto.
          </Step>
          <Step n={4}>
            Haga clic en <Field name="Confirmar Cierre Definitivo" />.
          </Step>
        </ol>
        <Warn>
          El cierre de periodo es irreversible. Las calificaciones y secciones quedaran como historico y no podran ser modificadas.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Tabla de Historico</h3>
        <p className="text-sm text-slate-600">La tabla muestra todos los periodos registrados con las siguientes columnas:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><strong>ID</strong> — Identificador numerico del periodo</li>
          <li><strong>AÑO ESCOLAR</strong> — Nombre del periodo (ej. "2025-2026")</li>
          <li><strong>ESTATUS</strong> — Badge con color: <span className="text-green-600 font-semibold">Activo</span>, <span className="text-red-600 font-semibold">Cerrado</span>, o <span className="text-amber-600 font-semibold">En Planificación</span></li>
          <li><strong>ACCIONES</strong> — Botones de Activar/Cerrar/Reactivar segun el estatus</li>
        </ul>
      </div>
    </div>
  );
}
