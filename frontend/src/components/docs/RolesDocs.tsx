export default function RolesDocs() {
  const modules = [
    { name: 'Dashboard / Indicadores', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Periodos Escolares', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Usuarios', super: true, ctrl: 'toggle', coord: false, doc: false },
    { name: 'Salones y Aulas', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Plan de Estudio', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Personal Docente', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Programación Horaria', super: true, ctrl: true, coord: false, doc: 'view' },
    { name: 'Gestión de Secciones', super: true, ctrl: true, coord: false, doc: false },
    { name: 'Estudiantes', super: true, ctrl: true, coord: true, doc: 'view' },
    { name: 'Calificaciones', super: true, ctrl: true, coord: 'view', doc: 'grade' },
    { name: 'Control Asistencia', super: true, ctrl: true, coord: 'view', doc: 'mark' },
    { name: 'Materias Pendientes', super: true, ctrl: true, coord: true, doc: 'view' },
  ];

  const renderAccess = (val: boolean | string) => {
    if (val === true) return <span className="text-green-600 font-bold">Total</span>;
    if (val === 'toggle') return <span className="text-amber-600 font-bold">Parcial</span>;
    if (val === 'view') return <span className="text-blue-600 font-bold">Consulta</span>;
    if (val === 'grade') return <span className="text-blue-600 font-bold">Carga</span>;
    if (val === 'mark') return <span className="text-blue-600 font-bold">Registro</span>;
    return <span className="text-red-500 font-bold">No</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Roles y Permisos</h2>
        <p className="text-sm text-slate-500">
          Tabla comparativa de accesos por rol en cada modulo del sistema.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-bold text-slate-800">Módulo</th>
                <th className="text-center py-3 px-4 font-bold text-red-700">Director</th>
                <th className="text-center py-3 px-4 font-bold text-indigo-700">Ctrl de Estudios</th>
                <th className="text-center py-3 px-4 font-bold text-amber-700">Coordinador</th>
                <th className="text-center py-3 px-4 font-bold text-emerald-700">Docente</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{m.name}</td>
                  <td className="text-center py-3 px-4">{renderAccess(m.super)}</td>
                  <td className="text-center py-3 px-4">{renderAccess(m.ctrl)}</td>
                  <td className="text-center py-3 px-4">{renderAccess(m.coord)}</td>
                  <td className="text-center py-3 px-4">{renderAccess(m.doc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">Total</span>
            <span className="text-slate-500">CRUD completo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-bold">Parcial</span>
            <span className="text-slate-500">Solo activar/desactivar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">Consulta</span>
            <span className="text-slate-500">Solo ver datos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold">Carga</span>
            <span className="text-slate-500">Solo ingresar notas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">No</span>
            <span className="text-slate-500">Sin acceso</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-800">Descripción de Roles</h3>

        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">Director / Principal</h4>
            <p className="text-slate-600 mt-1">
              Acceso total e irrestricto a todos los modulos. Puede crear, editar y eliminar cualquier registro. Es el unico rol que puede: descargar respaldos de base de datos, reactivar periodos cerrados, y eliminar usuarios del sistema.
            </p>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-bold text-indigo-700">Control de Estudios</h4>
            <p className="text-slate-600 mt-1">
              Gestion academica completa. Puede administrar periodos, secciones, docentes, estudiantes, calificaciones y asistencia. Puede activar/desactivar usuarios pero no crearlos ni eliminarlos.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-bold text-amber-700">Coordinador</h4>
            <p className="text-slate-600 mt-1">
              Rol de consulta y seguimiento. Puede ver estudiantes, calificaciones y asistencia. Puede gestionar materias pendientes. No tiene acceso a configuracion, periodos, usuarios, aulas, docentes ni horarios.
            </p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4">
            <h4 className="font-bold text-emerald-700">Docente / Profesor</h4>
            <p className="text-slate-600 mt-1">
              Puede cargar calificaciones para sus asignaturas asignadas, registrar asistencia de sus estudiantes, y ver su horario personal. Tiene acceso de consulta a estudiantes y puede firmar el reloj biometrico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
