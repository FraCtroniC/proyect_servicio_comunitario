import { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Search, User, PlusCircle, CheckCircle, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Student, Subject, SchoolPeriod, User as AppUser, MateriaPendiente, Docente } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { generateActaMateriaPendiente } from '../utils/pdfGenerator';

interface Reprobada {
  id_asignatura: number;
  nombre: string;
  nota_final: number;
}

interface PendingSubjectsManagerProps {
  students: Student[];
  subjects: Subject[];
  periods: SchoolPeriod[];
  users: AppUser[];
  docentes: Docente[];
  defaultStudentId?: string;
  refreshTrigger?: number;
}

export default function PendingSubjectsManager({
  students,
  subjects,
  periods,
  users,
  docentes,
  defaultStudentId,
  refreshTrigger,
}: PendingSubjectsManagerProps) {
  const [pendingList, setPendingList] = useState<MateriaPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Cursando' | 'Aprobada' | 'Aplazada'>('All');

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const [enrollStudentId, setEnrollStudentId] = useState<string>(defaultStudentId || '');
  const [enrollSubjectId, setEnrollSubjectId] = useState<string>('');
  const [enrollPeriodId, setEnrollPeriodId] = useState<string>('');
  const [enrollEvaluatorId, setEnrollEvaluatorId] = useState<string>('');
  const [enrollError, setEnrollError] = useState('');
  const [enrollSaving, setEnrollSaving] = useState(false);

  const [reprobadas, setReprobadas] = useState<Reprobada[]>([]);
  const [reprobadasLoading, setReprobadasLoading] = useState(false);

  const [selectedPending, setSelectedPending] = useState<MateriaPendiente | null>(null);
  const [gradeValue, setGradeValue] = useState<string>('');
  const [gradeError, setGradeError] = useState('');
  const [gradeSaving, setGradeSaving] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPendingSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.materiasPendientes.getAll();
      setPendingList(Array.isArray(resp) ? resp : (resp as any)?.data || []);
    } catch (e) {
      console.error('Error fetching pending subjects:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingSubjects();
  }, [fetchPendingSubjects, refreshTrigger]);

  useEffect(() => {
    if (defaultStudentId) {
      const st = students.find(s => s.id === defaultStudentId);
      if (st) setSearchQuery(st.cedula);
    }
  }, [defaultStudentId, students]);

  const fetchReprobadas = useCallback(async (studentId: string) => {
    if (!studentId) {
      setReprobadas([]);
      return;
    }
    setReprobadasLoading(true);
    try {
      const resp = await api.materiasPendientes.getReprobadas(studentId);
      setReprobadas(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error('Error fetching reprobadas:', e);
      setReprobadas([]);
    } finally {
      setReprobadasLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEnrollModalOpen && enrollStudentId) {
      fetchReprobadas(enrollStudentId);
    }
  }, [isEnrollModalOpen, enrollStudentId, fetchReprobadas]);

  useEffect(() => {
    if (isEnrollModalOpen) {
      const activePeriod = periods.find(p => p.status === 'Activo');
      if (activePeriod && !enrollPeriodId) {
        setEnrollPeriodId(activePeriod.id);
      }
    }
  }, [isEnrollModalOpen, periods, enrollPeriodId]);

  const filteredList = useMemo(() => {
    return pendingList.filter(p => {
      const st = p.estudiante;
      const matchSearch = st ? (
        (st.nombre1 || st.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (st.apellido1 || st.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (st.cedula || '').includes(searchQuery)
      ) : true;

      const matchStatus = statusFilter === 'All' || p.estatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [pendingList, searchQuery, statusFilter]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError('');

    if (!enrollStudentId || !enrollSubjectId || !enrollPeriodId) {
      setEnrollError('Debe llenar los campos obligatorios (Estudiante, Asignatura, Período)');
      return;
    }

    setEnrollSaving(true);
    try {
      await api.materiasPendientes.create({
        id_estudiante: Number(enrollStudentId),
        id_asignatura: Number(enrollSubjectId),
        id_periodo: Number(enrollPeriodId),
        id_docente_evaluador: enrollEvaluatorId ? Number(enrollEvaluatorId) : null,
      });
      toast.success('Materia pendiente inscrita exitosamente');
      setIsEnrollModalOpen(false);
      resetEnrollForm();
      fetchPendingSubjects();
    } catch (e: any) {
      const msg = e.message || 'Error al inscribir materia pendiente';
      setEnrollError(msg);
    } finally {
      setEnrollSaving(false);
    }
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setGradeError('');
    if (!selectedPending) return;

    if (!gradeValue) {
      setGradeError('Debe ingresar una calificación');
      return;
    }

    const numGrade = Number(gradeValue);
    if (isNaN(numGrade) || numGrade < 1 || numGrade > 20) {
      setGradeError('La calificación debe ser un número entre 1 y 20');
      return;
    }

    setGradeSaving(true);
    try {
      await api.materiasPendientes.update(String(selectedPending.id_materia_pendiente), {
        nota_definitiva: numGrade,
      });
      toast.success('Calificación guardada exitosamente');
      setIsGradeModalOpen(false);
      setSelectedPending(null);
      setGradeValue('');
      fetchPendingSubjects();
    } catch (e: any) {
      setGradeError(e.message || 'Error al guardar calificación');
    } finally {
      setGradeSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      await api.materiasPendientes.delete(String(id));
      toast.success('Materia pendiente eliminada');
      setDeleteConfirmId(null);
      fetchPendingSubjects();
    } catch (e: any) {
      toast.error(e.message || 'Error al eliminar');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetEnrollForm = () => {
    setEnrollStudentId('');
    setEnrollSubjectId('');
    setEnrollPeriodId('');
    setEnrollEvaluatorId('');
    setEnrollError('');
    setReprobadas([]);
  };

  const openGradeModal = (p: MateriaPendiente) => {
    setSelectedPending(p);
    setGradeValue(p.nota_definitiva != null ? String(p.nota_definitiva) : '');
    setIsGradeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <BookOpen className="h-6 w-6 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Materias Pendientes</h2>
            <p className="text-sm text-slate-500 font-medium">Gestión de asignaturas de arrastre y revisión</p>
          </div>
        </div>

        <button
          onClick={() => { setIsEnrollModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-base font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Inscribir Materia
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs flex flex-col h-[calc(100vh-280px)]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cédula o nombre del estudiante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-base px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Todos los Estatus</option>
            <option value="Cursando">Solo Cursando</option>
            <option value="Aprobada">Solo Aprobadas</option>
            <option value="Aplazada">Solo Aplazadas</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="h-8 w-8 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-xs">
                <tr className="border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Estudiante</th>
                  <th className="px-6 py-4">Asignatura</th>
                  <th className="px-6 py-4">Período / Evaluador</th>
                  <th className="px-6 py-4 text-center">Nota Def.</th>
                  <th className="px-6 py-4 text-center">Estatus</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((p) => {
                  const st = p.estudiante;
                  const asig = p.asignatura;
                  const per = p.periodo;
                  const evaluator = p.docente_evaluador;
                  const nota = p.nota_definitiva;

                  return (
                    <tr key={p.id_materia_pendiente} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {st ? `${st.nombre1 || ''} ${st.apellido1 || ''}` : 'Desconocido'}
                        </div>
                        <div className="text-sm text-slate-500 font-mono">
                          {st?.cedula}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700">{(asig as any)?.nombre || 'Desconocida'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded mb-1">
                          {per?.nombre || 'N/A'}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {evaluator ? `${evaluator.nombre1 || ''} ${evaluator.apellido1 || ''}` : 'Sin asignar'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-base font-black font-mono ${
                          nota === null || nota === undefined
                            ? 'bg-slate-100 text-slate-400'
                            : nota >= 10
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                        }`}>
                          {nota != null ? nota : '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full border ${
                          p.estatus === 'Aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          p.estatus === 'Aplazada' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {p.estatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {p.estatus === 'Cursando' && (
                            <>
                              <button
                                onClick={() => openGradeModal(p)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                title="Evaluar (Cargar Nota)"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(p.id_materia_pendiente)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => generateActaMateriaPendiente(p as any)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Generar Acta PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-500">No hay materias pendientes registradas</p>
                      <p className="text-sm mt-1">Verifique los filtros o inscriba una nueva materia.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Inscribir Materia Pendiente
              </h3>
              <button onClick={() => { setIsEnrollModalOpen(false); resetEnrollForm(); }} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleEnroll} className="p-6 space-y-4">
              {enrollError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-lg flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{enrollError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 uppercase">Estudiante <span className="text-rose-500">*</span></label>
                <SearchableSelect
                  options={students.map(s => ({ value: s.id, label: `${s.lastName}, ${s.firstName} - ${s.cedula}` }))}
                  value={enrollStudentId}
                  onChange={(val) => {
                    setEnrollStudentId(String(val));
                    setEnrollSubjectId('');
                  }}
                  placeholder="Seleccione un estudiante"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 uppercase">Asignatura Reprobada <span className="text-rose-500">*</span></label>
                {reprobadasLoading ? (
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                    Cargando materias reprobadas...
                  </div>
                ) : enrollStudentId ? (
                  reprobadas.length > 0 ? (
                    <SearchableSelect
                      options={reprobadas.map(r => ({ value: String(r.id_asignatura), label: `${r.nombre} (Nota: ${r.nota_final})` }))}
                      value={enrollSubjectId}
                      onChange={(val) => setEnrollSubjectId(String(val))}
                      placeholder="Seleccione materia reprobada"
                    />
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 font-medium">
                      Este estudiante no tiene materias reprobadas pendientes de inscribir.
                    </div>
                  )
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400">
                    Seleccione un estudiante primero
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 uppercase">Período Escolar <span className="text-rose-500">*</span></label>
                <select
                  value={enrollPeriodId}
                  onChange={(e) => setEnrollPeriodId(e.target.value)}
                  className="w-full text-base p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="">Seleccione el período</option>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.status})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 uppercase">Docente Evaluador</label>
                <SearchableSelect
                  options={docentes.filter(d => d.status === 'Activo').map(d => ({
                    value: d.id,
                    label: `${d.lastName}, ${d.firstName}`
                  }))}
                  value={enrollEvaluatorId}
                  onChange={(val) => setEnrollEvaluatorId(String(val))}
                  placeholder="Sin asignar (Opcional)"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsEnrollModalOpen(false); resetEnrollForm(); }} className="px-4 py-2 text-base font-semibold text-slate-500 hover:text-slate-700">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enrollSaving || !enrollStudentId || !enrollSubjectId || !enrollPeriodId}
                  aria-busy={enrollSaving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-base font-bold rounded-lg shadow-sm"
                >
                  {enrollSaving ? 'Inscribiendo...' : 'Inscribir Materia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGradeModalOpen && selectedPending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                Evaluar Materia
              </h3>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              {gradeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-lg flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{gradeError}</span>
                </div>
              )}

              <div className="text-center bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <p className="text-sm text-slate-500 font-bold uppercase">Materia Pendiente</p>
                <p className="font-bold text-indigo-700">
                  {(selectedPending.asignatura as any)?.nombre || 'Asignatura'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 uppercase">Nota Definitiva (1-20) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="Ej: 14"
                  className="w-full text-center text-lg p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono font-bold text-slate-800"
                />
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={gradeSaving}
                  aria-busy={gradeSaving}
                  className="w-full px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-base font-bold rounded-lg shadow-sm transition-colors"
                >
                  {gradeSaving ? 'Guardando...' : 'Guardar Calificación'}
                </button>
                <button type="button" onClick={() => setIsGradeModalOpen(false)} className="w-full px-4 py-2 text-base font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-100 p-2.5 rounded-full">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-800">Eliminar Materia Pendiente</h3>
            </div>
            <p className="text-slate-600 mb-6">
              ¿Está seguro de eliminar esta materia pendiente? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteLoading}
                aria-busy={deleteLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg"
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
