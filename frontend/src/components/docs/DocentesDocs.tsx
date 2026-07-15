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

export default function DocentesDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Personal Docente</h2>
        <p className="text-sm text-slate-500">
          Gestion del personal academico: registro, especialidades y control de estatus. Accesible para <strong>Director</strong> y <strong>Control de Estudios</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Buscar y Filtrar Docentes</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En <Field name="Buscar por Nombre o Cédula" />, escriba el nombre o cedula del docente. La lista se filtrara automaticamente.
          </Step>
          <Step n={2}>
            Use el dropdown <Field name="Filtrar por Especialidad" /> para ver solo docentes de una especialidad especifica.
          </Step>
          <Step n={3}>
            Si hay muchos docentes, haga clic en <Field name="Cargar más docentes" /> para ver mas registros.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Registrar un Nuevo Docente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Registrar Docente" />.
          </Step>
          <Step n={2}>
            Complete la <strong>Ficha del Docente</strong>:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Cédula de Identidad" /> — Seleccione tipo (V o E) e ingrese los numeros (7-9 digitos)</li>
              <li><Field name="Fecha de Nacimiento" /> — El sistema validara que la edad este entre 18 y 70 años</li>
              <li><Field name="Primer Nombre" /> y <Field name="Segundo Nombre" /></li>
              <li><Field name="Primer Apellido" /> y <Field name="Segundo Apellido" /></li>
              <li><Field name="Especialidad" /> — Seleccione una especialidad existente o cree una nueva</li>
              <li><Field name="Correo Electrónico" /> — Ej. docente@ejemplo.com</li>
              <li><Field name="Teléfono" /> — Formato 04XX-XXXXXXX</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Registrar Docente" />.
          </Step>
          <Step n={4}>
            El sistema mostrara la <strong>contraseña temporal</strong> generada automaticamente. Anote o copie esta contraseña para entregarla al docente.
          </Step>
        </ol>
        <Note>
          Al registrar un docente, se crea automaticamente un usuario vinculado con rol "Docente" usando la cedula como nombre de usuario.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Crear una Nueva Especialidad</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Dentro del formulario de registro de docente, haga clic en el boton de crear especialidad (icono +).
          </Step>
          <Step n={2}>
            Ingrese el <Field name="Nombre de la Especialidad" /> (ej. "Profesor de Biología").
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Aceptar" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar / Activar / Desactivar Docente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Para <strong>editar</strong>: haga clic en <Field name="Editar" /> en la tarjeta del docente, modifique los campos y guarde.
          </Step>
          <Step n={2}>
            Para <strong>activar/desactivar</strong>: haga clic en el badge de estatus (<Field name="Activo" /> o <Field name="Inactivo" />). El docente desactivado no aparecera en las asignaciones.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Eliminar un Docente</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Eliminar" /> en la tarjeta del docente.
          </Step>
          <Step n={2}>
            Confirme en el modal haciendo clic en <Field name="Eliminar" />.
          </Step>
        </ol>
        <Warn>
          No se puede eliminar un docente que tenga horarios asignados. Primero debe eliminar o reasignar los horarios.
        </Warn>
      </div>
    </div>
  );
}
