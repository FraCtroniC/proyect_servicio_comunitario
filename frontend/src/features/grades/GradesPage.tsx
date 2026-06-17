import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { AlertBanner } from '@/components/ui/AlertBanner';

type Periodo = { id_periodo: number; nombre: string; estatus: string };
type Grado = { id_grado: number; numero: number; nombre: string };
type Seccion = { id_seccion: number; id_grado: number; letra: string };
type Asignatura = { id_asignatura: number; nombre: string; tipo_calificacion: string };
type PlanEstudio = { id_plan: number; id_grado: number; id_asignatura: number; codigo_asignatura: string };
type Momento = { id_momento: number; id_periodo: number; descripcion: string };
type Escala = { id_escala: number; nota_impresa: string; nota_literal: string; nota_calculo: number | null };

type Estudiante = {
  id_estudiante: number;
  cedula_escolar: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
};

type Matricula = {
  id_matricula: number;
  id_estudiante: number;
  id_seccion: number;
  id_periodo: number;
  numero_lista: number | null;
  estatus_matricula: string | null;
  estudiante?: Estudiante;
};

type Calificacion = {
  id_calificacion?: number;
  id_matricula: number;
  id_plan: number;
  id_momento: number;
  id_escala: number;
  inasistencias_asignatura: number;
};

export function GradesPage() {
  // Datos maestros
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [planes, setPlanes] = useState<PlanEstudio[]>([]);
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);

  // Filtros seleccionados
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | ''>('');
  const [selectedGrado, setSelectedGrado] = useState<number | ''>('');
  const [selectedSeccion, setSelectedSeccion] = useState<number | ''>('');
  const [selectedPlan, setSelectedPlan] = useState<number | ''>('');
  const [selectedMomento, setSelectedMomento] = useState<number | ''>('');

  // Estudiantes y sus calificaciones actuales
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [existingGrades, setExistingGrades] = useState<Calificacion[]>([]);
  
  // Estado de edición (id_matricula -> { id_escala, inasistencias })
  const [formGrades, setFormGrades] = useState<Record<number, { id_escala: number; inasistencias: number }>>({});

  // Carga e información de interfaz
  const [loading, setLoading] = useState(false);
  const [masterLoading, setMasterLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cargar datos maestros al iniciar
  useEffect(() => {
    const fetchMasterData = async () => {
      setMasterLoading(true);
      try {
        const [pData, gData, sData, aData, plData, mData, eData] = await Promise.all([
          api.get<Periodo[]>('/api/periodos'),
          api.get<Grado[]>('/api/grados'),
          api.get<Seccion[]>('/api/secciones'),
          api.get<Asignatura[]>('/api/asignaturas'),
          api.get<PlanEstudio[]>('/api/plan-estudio'),
          api.get<Momento[]>('/api/momentos'),
          api.get<Escala[]>('/api/escalas'),
        ]);

        setPeriodos(pData);
        setGrados(gData);
        setSecciones(sData);
        setAsignaturas(aData);
        setPlanes(plData);
        setMomentos(mData);
        setEscalas(eData);

        // Preseleccionar periodo activo si existe
        const activo = pData.find((p) => p.estatus === 'Activo');
        if (activo) {
          setSelectedPeriodo(activo.id_periodo);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos de configuración escolar.');
      } finally {
        setMasterLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  // Filtrar momentos basados en periodo seleccionado
  const filteredMomentos = momentos.filter((m) => m.id_periodo === selectedPeriodo);

  // Filtrar secciones basadas en grado seleccionado
  const filteredSecciones = secciones.filter((s) => s.id_grado === selectedGrado);

  // Filtrar planes de estudio basados en grado seleccionado
  const filteredPlanes = planes.filter((p) => p.id_grado === selectedGrado);

  // Obtener nombre de asignatura para cada plan filtrado
  const getPlanName = (plan: PlanEstudio) => {
    const asig = asignaturas.find((a) => a.id_asignatura === plan.id_asignatura);
    return asig ? `${asig.nombre} (${plan.codigo_asignatura})` : plan.codigo_asignatura;
  };

  // Cargar estudiantes e inasistencias/calificaciones actuales cuando cambian los filtros principales
  useEffect(() => {
    if (!selectedPeriodo || !selectedSeccion || !selectedPlan || !selectedMomento) {
      setMatriculas([]);
      setFormGrades({});
      return;
    }

    const fetchGradesData = async () => {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      try {
        // 1. Cargar matrículas de la sección y período
        const matData = await api.get<Matricula[]>('/api/matriculas', {
          id_seccion: selectedSeccion,
          id_periodo: selectedPeriodo,
        });

        // Ordenar estudiantes por número de lista
        const sortedMatriculas = matData.sort((a, b) => (a.numero_lista ?? 0) - (b.numero_lista ?? 0));
        setMatriculas(sortedMatriculas);

        // 2. Cargar calificaciones ya existentes para esta materia (plan) y momento
        const gradData = await api.get<Calificacion[]>('/api/calificaciones', {
          id_plan: selectedPlan,
          id_momento: selectedMomento,
        });
        setExistingGrades(gradData);

        // 3. Inicializar el formulario con los valores existentes (o escala por defecto si no existen)
        const initialFormState: Record<number, { id_escala: number; inasistencias: number }> = {};
        
        // Buscar o definir escala por defecto (usualmente una nota intermedia o vacía si aplica)
        // Buscamos una nota en la escala de calificación cuantitativa
        const defaultEscala = escalas.find(e => e.nota_impresa === '01' || e.nota_calculo === 1) || escalas[0];

        sortedMatriculas.forEach((m) => {
          const exG = gradData.find((g) => g.id_matricula === m.id_matricula);
          initialFormState[m.id_matricula] = {
            id_escala: exG ? exG.id_escala : (defaultEscala?.id_escala ?? 0),
            inasistencias: exG ? exG.inasistencias_asignatura : 0,
          };
        });

        setFormGrades(initialFormState);
      } catch (err: any) {
        setError(err.message || 'Error al obtener las calificaciones del grupo.');
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, [selectedPeriodo, selectedSeccion, selectedPlan, selectedMomento, escalas]);

  // Manejar cambio en inputs
  const handleGradeChange = (matriculaId: number, escalaId: number) => {
    setFormGrades((prev) => ({
      ...prev,
      [matriculaId]: {
        ...prev[matriculaId],
        id_escala: escalaId,
      },
    }));
  };

  const handleAbsencesChange = (matriculaId: number, absences: number) => {
    setFormGrades((prev) => ({
      ...prev,
      [matriculaId]: {
        ...prev[matriculaId],
        inasistencias: isNaN(absences) || absences < 0 ? 0 : absences,
      },
    }));
  };

  // Guardar calificaciones en lote
  const handleSave = async () => {
    if (!selectedPlan || !selectedMomento) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const payload = Object.entries(formGrades).map(([matIdStr, data]) => ({
      id_matricula: Number(matIdStr),
      id_plan: Number(selectedPlan),
      id_momento: Number(selectedMomento),
      id_escala: data.id_escala,
      inasistencias_asignatura: data.inasistencias,
    }));

    try {
      await api.post('/api/calificaciones/bulk', { calificaciones: payload });
      setSuccessMsg('Calificaciones actualizadas y guardadas con éxito en el servidor.');
      // Recargar datos actuales
      const gradData = await api.get<Calificacion[]>('/api/calificaciones', {
        id_plan: selectedPlan,
        id_momento: selectedMomento,
      });
      setExistingGrades(gradData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el listado de calificaciones.');
    } finally {
      setSaving(false);
    }
  };

  // Estadísticas locales de la sección cargada
  const getStats = () => {
    const gradesWithScore = Object.values(formGrades)
      .map((g) => escalas.find((e) => e.id_escala === g.id_escala))
      .filter((e) => e && e.nota_calculo !== null) as Escala[];

    if (gradesWithScore.length === 0) return { promedio: 0, aprobados: 0, aplazados: 0, total: 0 };

    const total = gradesWithScore.length;
    const suma = gradesWithScore.reduce((acc, curr) => acc + (curr.nota_calculo ?? 0), 0);
    const promedio = suma / total;
    const aprobados = gradesWithScore.filter((e) => (e.nota_calculo ?? 0) >= 10).length; // En Vzla la nota mínima aprobatoria es 10 de 20
    const aplazados = total - aprobados;

    return { promedio, aprobados, aplazados, total };
  };

  const stats = getStats();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Control de estudios</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Carga de Calificaciones</h3>
        <p className="mt-2 text-sm text-slate">Seleccione los parámetros académicos para desplegar la matrícula de estudiantes.</p>
      </div>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}
      {successMsg && <AlertBanner variant="success">{successMsg}</AlertBanner>}

      {/* Selectores */}
      <div className="rounded-xl border border-line bg-paper p-5 shadow-card">
        {masterLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate py-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
            Cargando configuración escolar...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal">
                Periodo Escolar
                <select
                  value={selectedPeriodo}
                  onChange={(e) => {
                    setSelectedPeriodo(Number(e.target.value) || '');
                    setSelectedGrado('');
                    setSelectedSeccion('');
                    setSelectedPlan('');
                    setSelectedMomento('');
                  }}
                  className="input-field mt-1.5 py-2 px-3 text-xs"
                >
                  <option value="">Seleccione...</option>
                  {periodos.map((p) => (
                    <option key={p.id_periodo} value={p.id_periodo}>
                      {p.nombre} ({p.estatus})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal">
                Grado / Año
                <select
                  disabled={!selectedPeriodo}
                  value={selectedGrado}
                  onChange={(e) => {
                    setSelectedGrado(Number(e.target.value) || '');
                    setSelectedSeccion('');
                    setSelectedPlan('');
                  }}
                  className="input-field mt-1.5 py-2 px-3 text-xs"
                >
                  <option value="">Seleccione...</option>
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal">
                Sección
                <select
                  disabled={!selectedGrado}
                  value={selectedSeccion}
                  onChange={(e) => setSelectedSeccion(Number(e.target.value) || '')}
                  className="input-field mt-1.5 py-2 px-3 text-xs"
                >
                  <option value="">Seleccione...</option>
                  {filteredSecciones.map((s) => (
                    <option key={s.id_seccion} value={s.id_seccion}>
                      Sección {s.letra}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal">
                Asignatura / Materia
                <select
                  disabled={!selectedGrado}
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(Number(e.target.value) || '')}
                  className="input-field mt-1.5 py-2 px-3 text-xs"
                >
                  <option value="">Seleccione...</option>
                  {filteredPlanes.map((p) => (
                    <option key={p.id_plan} value={p.id_plan}>
                      {getPlanName(p)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal">
                Momento
                <select
                  disabled={!selectedPeriodo}
                  value={selectedMomento}
                  onChange={(e) => setSelectedMomento(Number(e.target.value) || '')}
                  className="input-field mt-1.5 py-2 px-3 text-xs"
                >
                  <option value="">Seleccione...</option>
                  {filteredMomentos.map((m) => (
                    <option key={m.id_momento} value={m.id_momento}>
                      {m.descripcion}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Vista de Carga o Estadísticas */}
      {selectedPeriodo && selectedSeccion && selectedPlan && selectedMomento ? (
        loading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-paper">
            <div className="flex flex-col items-center gap-3 text-slate">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
              <p className="text-sm">Buscando listado de estudiantes inscritos...</p>
            </div>
          </div>
        ) : matriculas.length === 0 ? (
          <div className="rounded-2xl border border-line bg-paper p-12 text-center text-slate">
            No se encontraron estudiantes matriculados en esta sección para el periodo activo.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Tabla Principal */}
            <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-mist text-[11px] font-bold uppercase tracking-wider text-slate">
                      <th className="py-3.5 px-4 text-center w-12">#</th>
                      <th className="py-3.5 px-4">Cédula</th>
                      <th className="py-3.5 px-4">Nombre y Apellido</th>
                      <th className="py-3.5 px-4 w-40">Nota Impresa</th>
                      <th className="py-3.5 px-4 w-28">Inasistencias</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm text-charcoal">
                    {matriculas.map((m, idx) => {
                      const est = m.estudiante;
                      const record = formGrades[m.id_matricula] || { id_escala: 0, inasistencias: 0 };
                      const fullName = est
                        ? `${est.apellido1} ${est.apellido2 || ''}, ${est.nombre1} ${est.nombre2 || ''}`
                        : `Matrícula #${m.id_matricula}`;
                      
                      return (
                        <tr key={m.id_matricula} className="hover:bg-mist/40 transition">
                          <td className="py-3 px-4 text-center font-medium text-slate">
                            {m.numero_lista ?? idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs">{est?.cedula_escolar || 'N/A'}</td>
                          <td className="py-3 px-4 font-medium text-ink">{fullName}</td>
                          <td className="py-3 px-4">
                            <select
                              value={record.id_escala}
                              onChange={(e) => handleGradeChange(m.id_matricula, Number(e.target.value))}
                              className="w-full rounded-md border border-line bg-mist px-2.5 py-1.5 text-xs text-ink outline-none transition focus:border-accent focus:bg-paper"
                            >
                              <option value="0">Sin nota</option>
                              {escalas.map((e) => (
                                <option key={e.id_escala} value={e.id_escala}>
                                  {e.nota_impresa} - {e.nota_literal}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min={0}
                              value={record.inasistencias}
                              onChange={(e) => handleAbsencesChange(m.id_matricula, parseInt(e.target.value, 10))}
                              className="w-full rounded-md border border-line bg-mist px-2.5 py-1.5 text-xs text-ink text-center outline-none transition focus:border-accent focus:bg-paper"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line p-4 bg-mist/30">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary py-2 px-6 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar notas'
                  )}
                </button>
              </div>
            </div>

            {/* Panel de Estadísticas */}
            <div className="space-y-5">
              <div className="rounded-xl bg-panel-dark p-6 text-paper shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Promedio del Grupo</p>
                <p className="mt-4 font-display text-5xl font-semibold">
                  {stats.promedio ? stats.promedio.toFixed(2) : '0.00'}
                </p>
                <p className="mt-3 text-xs text-slate-300">
                  Calculado matemáticamente sobre las calificaciones cuantitativas ingresadas.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-paper p-5 shadow-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate">Resumen de Notas</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-success/5 border border-success/15 p-3">
                    <p className="text-2xl font-bold text-success">{stats.aprobados}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate mt-1">Aprobados</p>
                  </div>
                  <div className="rounded-lg bg-danger/5 border border-danger/15 p-3">
                    <p className="text-2xl font-bold text-danger">{stats.aplazados}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate mt-1">Aplazados</p>
                  </div>
                </div>

                <div className="border-t border-line pt-3 flex items-center justify-between text-xs text-slate">
                  <span>Matrícula Total:</span>
                  <span className="font-semibold text-charcoal">{stats.total} evaluados</span>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-line bg-mist p-12 text-center text-slate">
          Para ver o registrar notas, elija el Período, Año, Sección, Materia y Momento en el panel superior.
        </div>
      )}
    </section>
  );
}
