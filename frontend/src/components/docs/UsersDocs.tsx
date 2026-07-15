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

export default function UsersDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Gestion de Usuarios</h2>
        <p className="text-sm text-slate-500">
          Administracion de cuentas de acceso al sistema. Solo accesible para el rol de <strong>Director</strong>. Control de Estudios puede activar/desactivar usuarios.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Buscar y Filtrar Usuarios</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En el campo <Field name="Buscar por nombre, cédula o correo..." />, escriba el termino de busqueda. La lista se filtrara automaticamente.
          </Step>
          <Step n={2}>
            Use el dropdown <Field name="Todos los roles" /> para filtrar por rol: Director/Principal, Control de Estudios, Coordinador, o Docente.
          </Step>
          <Step n={3}>
            Si hay mas de 8 usuarios, haga clic en <Field name="Ver más (X ocultos)" /> para cargar mas registros.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Crear un Nuevo Usuario</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en el boton <Field name="Agregar" />.
          </Step>
          <Step n={2}>
            Complete los campos del formulario:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><Field name="Nombre" /> — Nombre completo del usuario</li>
              <li><Field name="Usuario / Cedula" /> — Cedula de identidad (ej. V-12345678)</li>
              <li><Field name="Email" /> — Correo electronico institucional</li>
              <li><Field name="Teléfono" /> — Numero de telefono (formato xxxx-xxxxxxx)</li>
              <li><Field name="Rol" /> — Seleccione: Docente, Control de Estudios, Coordinador, o Administrador</li>
              <li><Field name="Contraseña" /> — Contraseña inicial para el usuario</li>
            </ul>
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Guardar" />.
          </Step>
        </ol>
        <Note>
          Si el rol seleccionado es "Docente", el sistema buscara automaticamente un docente registrado con la misma cedula para vincularlo al usuario.
        </Note>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Editar un Usuario</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Ubique el usuario en la lista y haga clic en <Field name="Editar" />.
          </Step>
          <Step n={2}>
            Modifique los campos que desee cambiar. El campo <Field name="Contraseña" /> es opcional: si lo deja en blanco, la contraseña no se modifica.
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Guardar" />.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Activar / Desactivar un Usuario</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la tarjeta del usuario, haga clic en el toggle de estatus (<Field name="Activo" /> o <Field name="Inactivo" />).
          </Step>
          <Step n={2}>
            El usuario desactivado no podra iniciar sesion en el sistema, pero su informacion se mantiene en la base de datos.
          </Step>
        </ol>
        <Warn>
          No se pueden desactivar los usuarios del staff fundadores de demostración.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Eliminar un Usuario</h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Haga clic en <Field name="Eliminar" /> en la tarjeta del usuario.
          </Step>
          <Step n={2}>
            Se abrira un modal de confirmacion. Para confirmar, escriba el <strong>nombre exacto</strong> del usuario en el campo de texto.
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Eliminar Permanentemente" />.
          </Step>
        </ol>
        <Warn>
          Esta accion es irreversible. Todos los datos del usuario seran eliminados permanentemente.
        </Warn>
      </div>
    </div>
  );
}
