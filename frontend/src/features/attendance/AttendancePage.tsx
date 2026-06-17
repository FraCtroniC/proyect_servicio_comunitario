import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { AlertBanner } from '@/components/ui/AlertBanner';

type Docente = {
  id_docente: number;
  cedula_docente: string;
  nombre1: string;
  apellido1: string;
  correo: string;
  especialidad: string;
};

type Justificacion = {
  id_justificacion?: number;
  id_asistencia: number;
  motivo: string;
  soporte_digital?: string;
};

type AsistenciaDocente = {
  id_asistencia?: number;
  id_docente: number;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estatus: string | null;
  justificaciones?: Justificacion[];
};

type Horario = {
  id_horario: number;
  id_docente: number;
  asignatura?: { nombre: string };
  seccion?: { letra: string };
  dia?: { nombre: string };
  bloque?: { hora_inicio: string; hora_fin: string };
  aula?: { nombre_codigo: string };
};

// Estudiante / Matrícula / Calificación tipos
type Periodo = { id_periodo: number; nombre: string; estatus: string };
type Grado = { id_grado: number; nombre: string };
type Seccion = { id_seccion: number; id_grado: number; letra: string };
type PlanEstudio = { id_plan: number; id_grado: number; id_asignatura: number; codigo_asignatura: string };
type Asignatura = { id_asignatura: number; nombre: string };
type Momento = { id_momento: number; id_periodo: number; descripcion: string };
type Escala = { id_escala: number; nota_impresa: string; nota_literal: string; nota_calculo: number | null };

type Estudiante = {
  id_estudiante: number;
  cedula_escolar: string;
  nombre1: string;
  apellido1: string;
};

type Matricula = {
  id_matricula: number;
  id_estudiante: number;
  id_seccion: number;
  id_periodo: number;
  numero_lista: number | null;
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

export function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'docentes' | 'estudiantes'>('docentes');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- ESTADOS TAB DOCENTES ---
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [fechaDocente, setFechaDocente] = useState<string>(new Date().toISOString().split('T')[0]);
  const [asistenciasDocente, setAsistenciasDocente] = useState<AsistenciaDocente[]>([]);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [savingDocenteId, setSavingDocenteId] = useState<number | null>(null);

  // Justificaciones en edición temporal
  const [justificacionesEdit, setJustificacionesEdit] = useState<Record<number, string>>({}); // id_docente -> motivo
  // Horario en visualización temporal
  const [horariosDocente, setHorariosDocente] = useState<Record<number, Horario[]>>({});
  const [loadingHorarioId, setLoadingHorarioId] = useState<number | null>(null);
  const [openScheduleDocenteId, setOpenScheduleDocenteId] = useState<number | null>(null);

  // Inputs temporales para docente
  const [inputsDocente, setInputsDocente] = useState<
    Record<number, { hora_entrada: string; hora_salida: string; estatus: string }>
  >({});

  // --- ESTADOS TAB ESTUDIANTES ---
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [planEstudios, setPlanEstudios] = useState<PlanEstudio[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);

  const [selectedPeriodo, setSelectedPeriodo] = useState<number | ''>('');
  const [selectedGrado, setSelectedGrado] = useState<number | ''>('');
  const [selectedSeccion, setSelectedSeccion] = useState<number | ''>('');
  const [selectedPlan, setSelectedPlan] = useState<number | ''>('');
  const [selectedMomento, setSelectedMomento] = useState<number | ''>('');

  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [studentAbsences, setStudentAbsences] = useState<Record<number, number>>({}); // id_matricula -> absences
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [savingEstudiantes, setSavingEstudiantes] = useState(false);

  // Cargar datos docentes al iniciar y cuando cambia la fecha
  useEffect(() => {
    if (activeTab !== 'docentes') return;

    const loadDocentesData = async () => {
      setLoadingDocentes(true);
      setError(null);
      setSuccessMsg(null);
      try {
        const docList = await api.get<Docente[]>('/api/docentes');
        setDocentes(docList);

        const asistList = await api.get<AsistenciaDocente[]>('/api/asistencias', { fecha: fechaDocente });
        setAsistenciasDocente(asistList);

        // Inicializar entradas del formulario
        const initialInputs: typeof inputsDocente = {};
        const initialJusts: typeof justificacionesEdit = {};

        docList.forEach((d) => {
          const matchingAsist = asistList.find((a) => a.id_docente === d.id_docente);
          initialInputs[d.id_docente] = {
            hora_entrada: matchingAsist?.hora_entrada ? matchingAsist.hora_entrada.slice(0, 5) : '',
            hora_salida: matchingAsist?.hora_salida ? matchingAsist.hora_salida.slice(0, 5) : '',
            estatus: matchingAsist?.estatus || 'Asistió',
          };
          
          const firstJust = matchingAsist?.justificaciones?.[0];
          initialJusts[d.id_docente] = firstJust?.motivo || '';
        });

        setInputsDocente(initialInputs);
        setJustificacionesEdit(initialJusts);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos de docentes.');
      } finally {
        setLoadingDocentes(false);
      }
    };

    loadDocentesData();
  }, [activeTab, fechaDocente]);

  // Cargar datos maestros para estudiantes
  useEffect(() => {
    if (activeTab !== 'estudiantes') return;
    if (periodos.length > 0) return; // Ya cargados

    const fetchMaster = async () => {
      try {
        const [p, g, s, pl, a, m, e] = await Promise.all([
          api.get<Periodo[]>('/api/periodos'),
          api.get<Grado[]>('/api/grados'),
          api.get<Seccion[]>('/api/secciones'),
          api.get<PlanEstudio[]>('/api/plan-estudio'),
          api.get<Asignatura[]>('/api/asignaturas'),
          api.get<Momento[]>('/api/momentos'),
          api.get<Escala[]>('/api/escalas'),
        ]);
        setPeriodos(p);
        setGrados(g);
        setSecciones(s);
        setPlanEstudios(pl);
        setAsignaturas(a);
        setMomentos(m);
        setEscalas(e);

        const activo = p.find((item) => item.estatus === 'Activo');
        if (activo) setSelectedPeriodo(activo.id_periodo);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos maestros.');
      }
    };
    fetchMaster();
  }, [activeTab]);

  // Cargar matrículas y asistencias (calificaciones) de estudiantes
  useEffect(() => {
    if (activeTab !== 'estudiantes' || !selectedPeriodo || !selectedSeccion || !selectedPlan || !selectedMomento) {
      setMatriculas([]);
      setStudentAbsences({});
      return;
    }

    const fetchStudentsAttendance = async () => {
      setLoadingEstudiantes(true);
      setError(null);
      setSuccessMsg(null);
      try {
        const mat = await api.get<Matricula[]>('/api/matriculas', {
          id_seccion: selectedSeccion,
          id_periodo: selectedPeriodo,
        });
        const sortedMat = mat.sort((a, b) => (a.numero_lista ?? 0) - (b.numero_lista ?? 0));
        setMatriculas(sortedMat);

        const califs = await api.get<Calificacion[]>('/api/calificaciones', {
          id_plan: selectedPlan,
          id_momento: selectedMomento,
        });
        setCalificaciones(califs);

        // Inicializar ausencias
        const initialAbsences: Record<number, number> = {};
        sortedMat.forEach((m) => {
          const matched = califs.find((c) => c.id_matricula === m.id_matricula);
          initialAbsences[m.id_matricula] = matched ? matched.inasistencias_asignatura : 0;
        });
        setStudentAbsences(initialAbsences);
      } catch (err: any) {
        setError(err.message || 'Error al cargar inasistencias de estudiantes.');
      } finally {
        setLoadingEstudiantes(false);
      }
    };

    fetchStudentsAttendance();
  }, [activeTab, selectedPeriodo, selectedSeccion, selectedPlan, selectedMomento]);

  // Guardar asistencia docente individual
  const handleSaveDocente = async (docenteId: number) => {
    setSavingDocenteId(docenteId);
    setError(null);
    setSuccessMsg(null);
    try {
      const inputs = inputsDocente[docenteId];
      const matchingAsist = asistenciasDocente.find((a) => a.id_docente === docenteId);
      
      const payload: Partial<AsistenciaDocente> = {
        id_docente: docenteId,
        fecha: fechaDocente,
        hora_entrada: inputs.hora_entrada ? `${inputs.hora_entrada}:00` : null,
        hora_salida: inputs.hora_salida ? `${inputs.hora_salida}:00` : null,
        estatus: inputs.estatus,
      };

      let savedAsistencia: AsistenciaDocente;

      if (matchingAsist && matchingAsist.id_asistencia) {
        // Actualizar
        savedAsistencia = await api.patch<AsistenciaDocente>(
          `/api/asistencias/${matchingAsist.id_asistencia}`,
          payload
        );
      } else {
        // Crear
        savedAsistencia = await api.post<AsistenciaDocente>('/api/asistencias', payload);
      }

      // Si tiene estatus de inasistencia/permiso y hay justificación
      const motivo = justificacionesEdit[docenteId];
      if ((inputs.estatus === 'Inasistencia' || inputs.estatus === 'Permiso') && motivo.trim() !== '') {
        const existJust = matchingAsist?.justificaciones?.[0];
        const justPayload: Partial<Justificacion> = {
          id_asistencia: savedAsistencia.id_asistencia || matchingAsist?.id_asistencia,
          motivo: motivo.trim(),
        };

        if (existJust && existJust.id_justificacion) {
          await api.patch(`/api/justificaciones/${existJust.id_justificacion}`, justPayload);
        } else {
          await api.post('/api/justificaciones', justPayload);
        }
      }

      setSuccessMsg('Asistencia docente guardada correctamente.');
      // Actualizar listado local
      const updatedAsistList = await api.get<AsistenciaDocente[]>('/api/asistencias', { fecha: fechaDocente });
      setAsistenciasDocente(updatedAsistList);
    } catch (err: any) {
      setError(err.message || 'Error al guardar asistencia del docente.');
    } finally {
      setSavingDocenteId(null);
    }
  };

  // Cargar y mostrar horario del docente
  const toggleSchedule = async (docenteId: number) => {
    if (openScheduleDocenteId === docenteId) {
      setOpenScheduleDocenteId(null);
      return;
    }

    if (horariosDocente[docenteId]) {
      setOpenScheduleDocenteId(docenteId);
      return;
    }

    setLoadingHorarioId(docenteId);
    try {
      const scheduleData = await api.get<Horario[]>('/api/horarios', { id_docente: docenteId });
      setHorariosDocente((prev) => ({ ...prev, [docenteId]: scheduleData }));
      setOpenScheduleDocenteId(docenteId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar horario del docente.');
    } finally {
      setLoadingHorarioId(null);
    }
  };

  // Guardar asistencia estudiantes
  const handleSaveEstudiantes = async () => {
    if (!selectedPlan || !selectedMomento) return;

    setSavingEstudiantes(true);
    setError(null);
    setSuccessMsg(null);

    // Encontrar escala por defecto
    const defaultEsc = escalas.find((e) => e.nota_impresa === '01' || e.nota_calculo === 1) || escalas[0];

    const payload = Object.entries(studentAbsences).map(([matIdStr, absences]) => {
      const matId = Number(matIdStr);
      const matchingC = calificaciones.find((c) => c.id_matricula === matId);
      return {
        id_matricula: matId,
        id_plan: Number(selectedPlan),
        id_momento: Number(selectedMomento),
        id_escala: matchingC ? matchingC.id_escala : (defaultEsc?.id_escala ?? 0),
        inasistencias_asignatura: absences,
      };
    });

    try {
      await api.post('/api/calificaciones/bulk', { calificaciones: payload });
      setSuccessMsg('Asistencias/Faltas de estudiantes actualizadas con éxito.');
      const updatedCalifs = await api.get<Calificacion[]>('/api/calificaciones', {
        id_plan: selectedPlan,
        id_momento: selectedMomento,
      });
      setCalificaciones(updatedCalifs);
    } catch (err: any) {
      setError(err.message || 'Error al guardar asistencia de estudiantes.');
    } finally {
      setSavingEstudiantes(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-line">
        <button
          type="button"
          onClick={() => {
            setActiveTab('docentes');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'docentes'
              ? 'border-accent text-accent'
              : 'border-transparent text-slate hover:text-charcoal'
          }`}
        >
          Asistencia Docentes
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('estudiantes');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'estudiantes'
              ? 'border-accent text-accent'
              : 'border-transparent text-slate hover:text-charcoal'
          }`}
        >
          Asistencia Estudiantes
        </button>
      </div>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}
      {successMsg && <AlertBanner variant="success">{successMsg}</AlertBanner>}

      {/* --- TAB DOCENTES --- */}
      {activeTab === 'docentes' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-paper p-4 shadow-card">
            <div>
              <h4 className="text-sm font-semibold text-ink">Registro Diario Docente</h4>
              <p className="text-xs text-slate">Indique la fecha de registro y verifique firmas de entrada/salida.</p>
            </div>
            <div>
              <input
                type="date"
                value={fechaDocente}
                onChange={(e) => setFechaDocente(e.target.value)}
                className="input-field py-1.5 px-3 text-xs w-44"
              />
            </div>
          </div>

          {loadingDocentes ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
            </div>
          ) : docentes.length === 0 ? (
            <div className="rounded-2xl border border-line bg-paper p-12 text-center text-slate">
              No hay docentes registrados en la base de datos.
            </div>
          ) : (
            <div className="space-y-4">
              {docentes.map((d) => {
                const inputs = inputsDocente[d.id_docente] || { hora_entrada: '', hora_salida: '', estatus: 'Asistió' };
                const schedule = horariosDocente[d.id_docente] || [];
                const matchingAsist = asistenciasDocente.find((a) => a.id_docente === d.id_docente);

                return (
                  <div key={d.id_docente} className="rounded-xl border border-line bg-paper p-5 shadow-card space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
                      <div>
                        <h4 className="font-display text-base font-semibold text-ink">
                          {d.nombre1} {d.apellido1}
                        </h4>
                        <p className="text-xs text-slate">
                          C.I: {d.cedula_docente} | Especialidad: {d.especialidad}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSchedule(d.id_docente)}
                          className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                        >
                          {loadingHorarioId === d.id_docente ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate border-t-transparent"></div>
                          ) : null}
                          Horario
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveDocente(d.id_docente)}
                          disabled={savingDocenteId === d.id_docente}
                          className="btn-primary py-1.5 px-4 text-xs"
                        >
                          {savingDocenteId === d.id_docente ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </div>

                    {/* Inputs de Asistencia */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal">
                          Estatus Asistencia
                          <select
                            value={inputs.estatus}
                            onChange={(e) =>
                              setInputsDocente((prev) => ({
                                ...prev,
                                [d.id_docente]: { ...prev[d.id_docente], estatus: e.target.value },
                              }))
                            }
                            className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                          >
                            <option value="Asistió">Asistió</option>
                            <option value="Inasistencia">Inasistencia</option>
                            <option value="Permiso">Permiso</option>
                          </select>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal">
                          Hora Entrada
                          <input
                            type="time"
                            disabled={inputs.estatus !== 'Asistió'}
                            value={inputs.hora_entrada}
                            onChange={(e) =>
                              setInputsDocente((prev) => ({
                                ...prev,
                                [d.id_docente]: { ...prev[d.id_docente], hora_entrada: e.target.value },
                              }))
                            }
                            className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal">
                          Hora Salida
                          <input
                            type="time"
                            disabled={inputs.estatus !== 'Asistió'}
                            value={inputs.hora_salida}
                            onChange={(e) =>
                              setInputsDocente((prev) => ({
                                ...prev,
                                [d.id_docente]: { ...prev[d.id_docente], hora_salida: e.target.value },
                              }))
                            }
                            className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Justificación Form */}
                    {(inputs.estatus === 'Inasistencia' || inputs.estatus === 'Permiso') && (
                      <div className="rounded-lg bg-warning/5 border border-warning/15 p-3.5 space-y-2">
                        <label className="block text-xs font-semibold text-warning">
                          Justificación / Motivo del Permiso
                          <input
                            type="text"
                            value={justificacionesEdit[d.id_docente] || ''}
                            onChange={(e) =>
                              setJustificacionesEdit((prev) => ({ ...prev, [d.id_docente]: e.target.value }))
                            }
                            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-xs text-ink outline-none mt-1.5 focus:border-warning"
                            placeholder="Ej. Cita médica IVSS, reposo de 3 días, etc."
                          />
                        </label>
                        {matchingAsist?.justificaciones?.[0] && (
                          <p className="text-[10px] text-slate-500 font-medium">
                            * Justificación guardada anteriormente: "{matchingAsist.justificaciones[0].motivo}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mostrar Horario si está abierto */}
                    {openScheduleDocenteId === d.id_docente && (
                      <div className="rounded-lg border border-line bg-mist p-4 space-y-2.5">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate">Horarios asignados</h5>
                        {schedule.length === 0 ? (
                          <p className="text-xs text-slate">Este docente no tiene bloques horarios asignados.</p>
                        ) : (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                            {schedule.map((item) => (
                              <div key={item.id_horario} className="rounded-md border border-line bg-paper p-2.5 shadow-sm">
                                <p className="font-semibold text-charcoal">{item.asignatura?.nombre}</p>
                                <p className="text-slate-500 mt-1">
                                  Día: {item.dia?.nombre} | Sección: {item.seccion?.letra}
                                </p>
                                <p className="text-slate-500">
                                  Bloque: {item.bloque?.hora_inicio.slice(0, 5)} - {item.bloque?.hora_fin.slice(0, 5)}
                                </p>
                                <p className="text-slate-500">Aula: {item.aula?.nombre_codigo}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- TAB ESTUDIANTES --- */}
      {activeTab === 'estudiantes' && (
        <div className="space-y-5">
          {/* Selectores */}
          <div className="rounded-xl border border-line bg-paper p-5 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Periodo
                  <select
                    value={selectedPeriodo}
                    onChange={(e) => {
                      setSelectedPeriodo(Number(e.target.value) || '');
                      setSelectedGrado('');
                      setSelectedSeccion('');
                      setSelectedPlan('');
                      setSelectedMomento('');
                    }}
                    className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                  >
                    <option value="">Seleccione...</option>
                    {periodos.map((p) => (
                      <option key={p.id_periodo} value={p.id_periodo}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Grado
                  <select
                    disabled={!selectedPeriodo}
                    value={selectedGrado}
                    onChange={(e) => {
                      setSelectedGrado(Number(e.target.value) || '');
                      setSelectedSeccion('');
                      setSelectedPlan('');
                    }}
                    className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
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
                    className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                  >
                    <option value="">Seleccione...</option>
                    {secciones
                      .filter((s) => s.id_grado === selectedGrado)
                      .map((s) => (
                        <option key={s.id_seccion} value={s.id_seccion}>
                          Sección {s.letra}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal">
                  Asignatura
                  <select
                    disabled={!selectedGrado}
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(Number(e.target.value) || '')}
                    className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                  >
                    <option value="">Seleccione...</option>
                    {planEstudios
                      .filter((p) => p.id_grado === selectedGrado)
                      .map((p) => {
                        const asig = asignaturas.find((a) => a.id_asignatura === p.id_asignatura);
                        return (
                          <option key={p.id_plan} value={p.id_plan}>
                            {asig ? asig.nombre : p.codigo_asignatura}
                          </option>
                        );
                      })}
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
                    className="input-field mt-1.5 py-1.5 px-2.5 text-xs"
                  >
                    <option value="">Seleccione...</option>
                    {momentos
                      .filter((m) => m.id_periodo === selectedPeriodo)
                      .map((m) => (
                        <option key={m.id_momento} value={m.id_momento}>
                          {m.descripcion}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Listado Estudiantes */}
          {selectedPeriodo && selectedSeccion && selectedPlan && selectedMomento ? (
            loadingEstudiantes ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-paper">
                <div className="flex flex-col items-center gap-3 text-slate">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                  <p className="text-sm">Obteniendo matrícula del grupo...</p>
                </div>
              </div>
            ) : matriculas.length === 0 ? (
              <div className="rounded-2xl border border-line bg-paper p-12 text-center text-slate">
                No hay estudiantes matriculados en la sección seleccionada.
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-paper shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-line bg-mist text-[11px] font-bold uppercase tracking-wider text-slate">
                        <th className="py-3 px-4 text-center w-12">#</th>
                        <th className="py-3 px-4">Cédula Escolar</th>
                        <th className="py-3 px-4">Estudiante</th>
                        <th className="py-3 px-4 text-center w-48">Inasistencias Acumuladas</th>
                        <th className="py-3 px-4 text-center w-48">Ajustar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-sm text-charcoal">
                      {matriculas.map((m, idx) => {
                        const est = m.estudiante;
                        const absences = studentAbsences[m.id_matricula] || 0;
                        const fullName = est
                          ? `${est.apellido1}, ${est.nombre1}`
                          : `Matrícula #${m.id_matricula}`;

                        return (
                          <tr key={m.id_matricula} className="hover:bg-mist/40 transition">
                            <td className="py-3 px-4 text-center font-semibold text-slate">
                              {m.numero_lista ?? idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">{est?.cedula_escolar || 'N/A'}</td>
                            <td className="py-3 px-4 font-medium text-ink">{fullName}</td>
                            <td className="py-3 px-4 text-center font-bold text-base text-accent">
                              {absences} faltas
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentAbsences((prev) => ({
                                      ...prev,
                                      [m.id_matricula]: Math.max(0, prev[m.id_matricula] - 1),
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg border border-line bg-mist flex items-center justify-center font-bold hover:bg-paper active:scale-95 transition"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentAbsences((prev) => ({
                                      ...prev,
                                      [m.id_matricula]: prev[m.id_matricula] + 1,
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg border border-line bg-mist flex items-center justify-center font-bold hover:bg-paper active:scale-95 transition"
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStudentAbsences((prev) => ({
                                      ...prev,
                                      [m.id_matricula]: prev[m.id_matricula] + 1,
                                    }))
                                  }
                                  className="px-2.5 py-1.5 rounded-lg border border-danger/20 bg-danger/5 hover:bg-danger/10 text-xs font-semibold text-danger active:scale-95 transition"
                                >
                                  Ausente hoy (+1)
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end p-4 border-t border-line bg-mist/30">
                  <button
                    type="button"
                    onClick={handleSaveEstudiantes}
                    disabled={savingEstudiantes}
                    className="btn-primary py-2 px-6 flex items-center gap-2"
                  >
                    {savingEstudiantes ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Guardando asistencias...
                      </>
                    ) : (
                      'Guardar asistencias'
                    )}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-line bg-mist p-12 text-center text-slate">
              Seleccione los parámetros académicos del panel superior para registrar la asistencia de los estudiantes.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
