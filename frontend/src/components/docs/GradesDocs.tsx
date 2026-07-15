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

export default function GradesDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Calificaciones</h2>
        <p className="text-sm text-slate-500">
          Modulo central de carga y consulta de calificaciones. Conforme a la escala oficial MPPE (1-20) y al Art. 108 del RLOE. Accesible para todos los roles.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-200 pb-2">Sub-módulos Disponibles</h3>

        {/* Carga de Notas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">1. Carga de Notas</h4>
          <p className="text-sm text-slate-600">Donde los docentes y control de estudios ingresas las calificaciones al sistema.</p>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Configurar Plan de Evaluación</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                Seleccione el <Field name="Año de Educación Media" />, <Field name="Sección" />, <Field name="Asignatura" /> y <Field name={'Período ("Lapso")'} /> (Primer, Segundo o Tercer Lapso).
              </Step>
              <Step n={2}>
                Haga clic en <Field name="Configurar Plan de Evaluación" />.
              </Step>
              <Step n={3}>
                En el constructor, defina las actividades de evaluacion para el lapso. Cada actividad tiene:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Nombre</strong> de la actividad (ej. "Examen Parcial")</li>
                  <li><strong>Ponderación</strong> en porcentaje (ej. 25%)</li>
                </ul>
              </Step>
              <Step n={4}>
                Use el boton <Field name="+ Actividad" /> para agregar mas actividades.
              </Step>
              <Step n={5}>
                La sumatoria de las ponderaciones debe ser <strong>exactamente 100%</strong>.
              </Step>
              <Step n={6}>
                Haga clic en <Field name="Guardar Cambios" />.
              </Step>
            </ol>
            <Warn>
              Debe configurar el plan de evaluacion ANTES de guardar calificaciones. Si no lo hace, el sistema mostrara un error.
            </Warn>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Ingresar Calificaciones</h5>
            <ol className="space-y-3 list-none">
              <Step n={1}>
                Seleccione año, seccion, materia y lapso.
              </Step>
              <Step n={2}>
                Se mostrara una matriz con los estudiantes en las filas y las evaluaciones en las columnas.
              </Step>
              <Step n={3}>
                Haga clic en cualquier celda y escriba la calificacion del <strong>1 al 20</strong>.
              </Step>
              <Step n={4}>
                Las columnas <strong>LAPSO RAW</strong> y <strong>LAPSO REDONDEADO</strong> se calculan automaticamente.
              </Step>
              <Step n={5}>
                Haga clic en <Field name="Guardar Calificaciones" />.
              </Step>
            </ol>
            <Note>
              Colores de referencia: <span className="text-red-600 font-semibold">Insuficiente (1-9)</span>, <span className="text-amber-600 font-semibold">Mínima (10-14)</span>, <span className="text-green-600 font-semibold">Sobresaliente (15-20)</span>.
            </Note>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800">Historial de Auditoria</h5>
            <p className="text-sm text-slate-600">Debajo de la matriz de calificaciones se muestra el historial de modificaciones realizadas. Puede ver los archivos de notas y expandir registros con <Field name="Ver más" />.</p>
          </div>
        </div>

        {/* Sabana de Notas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">2. Sabana de Notas (Formato MPPE)</h4>
          <p className="text-sm text-slate-600">Formato oficial de acta de evaluaciones continuas conforme al MPPE.</p>
          <ol className="space-y-3 list-none">
            <Step n={1}>
              Seleccione <Field name="Año Académico" />, <Field name="Sección" /> y <Field name="Asignatura" />.
            </Step>
            <Step n={2}>
              Se mostrara la sabana con las columnas: N°, Cedula, Nombres y Apellidos, LAPSO 1 (L1), LAPSO 2 (L2), LAPSO 3 (L3), NOTA FINAL, ESTADO.
            </Step>
            <Step n={3}>
              El <strong>ESTADO</strong> se calcula automaticamente: <span className="text-green-600">Aprobado</span> (nota final {'>='} 10), <span className="text-red-600">A Aplazar / Reprobado</span> ({'<'}10), o <span className="text-amber-600">Cursando</span> (sin notas).
            </Step>
            <Step n={4}>
              Para imprimir en formato oficial, haga clic en <Field name="Imprimir Formato MPPE" />.
            </Step>
            <Step n={5}>
              Para exportar a Excel, haga clic en <Field name="Excel (Sábana)" />.
            </Step>
          </ol>
          <Note>
            La sabana incluye las firmas: Director Principal, Control de Estudios y Profesor de Cátedra.
          </Note>
        </div>

        {/* Boletin Informativo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">3. Boletín Informativo</h4>
          <p className="text-sm text-slate-600">Boleta de notas individual por estudiante con todas las asignaturas.</p>
          <ol className="space-y-3 list-none">
            <Step n={1}>
              Seleccione un estudiante matriculado en <Field name="Seleccione Alumno Matriculado" />.
            </Step>
            <Step n={2}>
              Se mostrara la tabla del boletin con: Asignatura / Plan de Estudio, Lapso 1, Lapso 2, Lapso 3, FINAL PROM., ESTATUS ASIGNATURA.
            </Step>
            <Step n={3}>
              El <strong>ESTATUS</strong> puede ser: <span className="text-green-600">Aprobado (AP)</span>, <span className="text-red-600">Materia Pendiente</span>, o <span className="text-amber-600">Cursando</span>.
            </Step>
            <Step n={4}>
              Para imprimir, haga clic en <Field name="Imprimir Boleta de Notas" />.
            </Step>
          </ol>
        </div>

        {/* Notas Certificadas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h4 className="font-bold text-indigo-700">4. Notas Certificadas</h4>
          <p className="text-sm text-slate-600">Registro de calificaciones historicas de otros establecimientos educativos.</p>
          <ol className="space-y-3 list-none">
            <Step n={1}>
              Seleccione un estudiante en <Field name="Seleccionar Estudiante" />.
            </Step>
            <Step n={2}>
              Haga clic en <Field name="Registrar Notas Certificadas" />.
            </Step>
            <Step n={3}>
              Seleccione la institucion de origen y el plan de estudio (<Field name="Plan 31059 — EMG Vigente (2017+)" /> o <Field name="Plan 32011/31018 — Antiguo (pre-2017)" />).
            </Step>
            <Step n={4}>
              Ingrese las calificaciones (rango 1-20) para cada materia.
            </Step>
            <Step n={5}>
              Haga clic en <Field name="Guardar Notas Certificadas" />.
            </Step>
            <Step n={6}>
              Para exportar el historial a Excel, haga clic en <Field name="Generar Excel Certificado" />.
            </Step>
          </ol>
          <Warn>
            Las calificaciones deben estar en el rango de 1 a 20 puntos segun la normativa MPPE.
          </Warn>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Algoritmo de Redondeo Oficial (Art. 108 RLOE)</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 space-y-2">
          <p><strong>Calificación de Lapso:</strong> Sumatoria de evaluaciones parciales ponderadas.</p>
          <p className="font-mono text-xs bg-white p-2 rounded border">Nota_Lapso = Suma(Nota_Evaluacion_i * Porcentaje_i / 100)</p>
          <p><strong>Redondeo:</strong> Fracciones de 0.50 o mas se redondean al entero superior. Ej: 9.50 = 10 (Aprobado). Inferiores a 0.50 bajan. Ej: 9.49 = 9.</p>
          <p><strong>Nota Final:</strong> Promedio simple de los 3 lapsos ya redondeados.</p>
          <p className="font-mono text-xs bg-white p-2 rounded border">Nota_Final = Redondear((Nota_Lapso1 + Nota_Lapso2 + Nota_Lapso3) / 3)</p>
        </div>
      </div>
    </div>
  );
}
