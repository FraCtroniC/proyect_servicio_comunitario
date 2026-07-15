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

export default function LoginDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Pantalla de Inicio de Sesion</h2>
        <p className="text-sm text-slate-500">
          Acceso al sistema mediante credenciales institucionales. Todos los usuarios (Director, Control de Estudios, Coordinador y Docentes) inician sesion desde esta pantalla.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          Iniciar Sesion
        </h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            Abra el navegador e ingrese a la URL del sistema. Se mostrara la pantalla de login con el logo del <strong>Liceo Nacional Estilita Orozco</strong>.
          </Step>
          <Step n={2}>
            En el campo <Field name="Usuario o correo electronico" />, ingrese su nombre de usuario o correo electronico registrado.
          </Step>
          <Step n={3}>
            En el campo <Field name="Contraseña" />, ingrese su contraseña. Puede hacer clic en el icono de ojo para mostrar u ocultar la contraseña.
          </Step>
          <Step n={4}>
            Haga clic en el boton <Field name="Iniciar Sesion en el Panel" />.
          </Step>
        </ol>

        <Note>
          Si es la primera vez que ingresa, su contraseña inicial es <strong>Temporal</strong> seguida de caracteres aleatorios. Debera cambiarla al acceder por primera vez.
        </Note>

        <Warn>
          Si comete 3 intentos fallidos, debera verificar sus credenciales con el administrador del sistema.
        </Warn>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          Recuperar Contraseña
        </h3>
        <ol className="space-y-4 list-none">
          <Step n={1}>
            En la pantalla de login, haga clic en <Field name="¿Olvidó su contraseña?" />.
          </Step>
          <Step n={2}>
            Se abrira un formulario. Ingrese su correo electronico en el campo <Field name="Correo Electrónico" /> (ejemplo: <code className="bg-slate-100 text-indigo-700 px-1 rounded text-xs">director@liceo.edu.ve</code>).
          </Step>
          <Step n={3}>
            Haga clic en <Field name="Enviar Enlace de Recuperación" />.
          </Step>
          <Step n={4}>
            Revista su correo electronico y siga el enlace para restablecer su contraseña.
          </Step>
          <Step n={5}>
            Ingrese su nueva contraseña (minimo 6 caracteres) en <Field name="Nueva Contraseña" /> y repitala en <Field name="Confirmar Contraseña" />.
          </Step>
          <Step n={6}>
            Haga clic en <Field name="Restablecer Contraseña" />. A continuacion, haga clic en <Field name="Iniciar Sesión" /> para volver al login.
          </Step>
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Errores Comunes</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong className="text-red-600">"Usuario o contraseña incorrectos."</strong> — Verifique mayusculas/minusculas y que este usando su usuario o correo correcto.</p>
          <p><strong className="text-red-600">"No se pudo conectar con el servidor."</strong> — Verifique su conexion a internet o al servidor institucional.</p>
          <p><strong className="text-red-600">"La contraseña debe tener al menos 6 caracteres."</strong> — Su contraseña temporal es mas corta; contacte al administrador.</p>
          <p><strong className="text-red-600">"Las contraseñas no coinciden."</strong> — Asegurese de escribir la misma contraseña en ambos campos.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Roles del Sistema</h3>
        <p className="text-sm text-slate-600 mb-3">El sistema cuenta con 4 roles que determinan que modulos puede ver y que acciones puede realizar:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="font-bold text-red-700">Director / Principal</span>
            <p className="text-slate-600 mt-1">Acceso total a todos los modulos. Puede crear, editar y eliminar cualquier registro.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <span className="font-bold text-indigo-700">Control de Estudios</span>
            <p className="text-slate-600 mt-1">Gestion academica completa: secciones, calificaciones, asistencia, docentes, periodos.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="font-bold text-amber-700">Coordinador</span>
            <p className="text-slate-600 mt-1">Acceso de consulta a estudiantes, calificaciones y asistencia. Sin permisos de escritura en configuracion.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <span className="font-bold text-emerald-700">Docente / Profesor</span>
            <p className="text-slate-600 mt-1">Carga de notas para sus asignaturas, registro de asistencia y consulta de su horario.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
