/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Eye, Edit3, Award, FileText, CheckCircle, AlertTriangle, Printer, PlusCircle, Trash, ScrollText, Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, Subject, EvaluationPlan, Grade, AcademicYear, UserRole, StudyPlanItem, SchoolPeriod, Section } from '../types';
import { calculateEvaluationAverage, calculateSubjectFinalGrade, gradeToLiteral } from '../utils/gradeCalculations';
import { generateBoletinPDF } from '../utils/pdfGenerator';
import { exportGradesToExcel } from '../utils/excelGenerator';
import { api } from '../services/api';
import { SearchableSelect } from './SearchableSelect';
import { PaginationBar } from './PaginationBar';

interface GradeManagerProps {
  students: Student[];
  subjects: Subject[];
  evaluationPlans: EvaluationPlan[];
  grades: Grade[];
  auditLogs: any[];
  currentUserRole: UserRole;
  studyPlans: StudyPlanItem[];
  periods: SchoolPeriod[];
  sections: Section[];
  onUpdateGrade: (stdId: string, subId: string, lap: 1|2|3, evId: string, score: number) => void;
  onSaveGrades: (gradesToSave: Grade[], subjectName: string, year: number, section: string, lapso: number, detalles?: any[], planEvaluaciones?: any[]) => Promise<void>;
  onUpdateEvaluationPlan: (subId: string, year: AcademicYear, section: string, lap: 1|2|3, evaluations: any[]) => void;
  onRefreshData?: () => Promise<void>;
}

export default function GradeManager({
  students,
  subjects,
  evaluationPlans,
  grades,
  auditLogs,
  currentUserRole,
  studyPlans,
  periods,
  sections,
  onUpdateGrade,
  onSaveGrades,
  onUpdateEvaluationPlan,
  onRefreshData
}: GradeManagerProps) {
  // Navigation inside Grade Module
  const [activeSubTab, setActiveSubTab] = useState<'carga' | 'sabana' | 'boletin' | 'certificadas'>('carga');

  // Filters for Carga
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(5);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(1);

  // Filters for Sábana (independent)
  const [sabanaYear, setSabanaYear] = useState<AcademicYear>(5);
  const [sabanaSection, setSabanaSection] = useState<string>('A');
  const [sabanaSubjectId, setSabanaSubjectId] = useState<string>('');

  // Audit log modal state
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSavedPayload, setLastSavedPayload] = useState<string>('');
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});

  // Audit logs pagination
  const [visibleAuditLogsCount, setVisibleAuditLogsCount] = useState(3);

  // Grading table pagination
  const [gradePage, setGradePage] = useState(1);
  const GRADE_PAGE_LIMIT = 10;

  // Sync selectedSubjectId with loaded subjects
  useEffect(() => {
    if (subjects.length > 0 && (!selectedSubjectId || !subjects.find(s => s.id === selectedSubjectId))) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Reset grade page when filters change
  useEffect(() => {
    setGradePage(1);
  }, [selectedYear, selectedSection, selectedSubjectId, selectedLapso]);

  // Sections available for the selected year (from active period)
  const availableSections = useMemo(() => {
    const filtered = sections.filter(s => s.grade === selectedYear);
    const unique = [...new Map(filtered.map(s => [s.letter, s])).values()];
    return unique.sort((a, b) => a.letter.localeCompare(b.letter));
  }, [sections, selectedYear]);

  // Reset selectedSection when year changes and current section is not available
  useEffect(() => {
    if (availableSections.length > 0 && !availableSections.find(s => s.letter === selectedSection)) {
      setSelectedSection(availableSections[0].letter);
    }
  }, [availableSections, selectedSection]);

  // Sections available for Sábana (independent from Carga)
  const availableSectionsSabana = useMemo(() => {
    const filtered = sections.filter(s => s.grade === sabanaYear);
    const unique = [...new Map(filtered.map(s => [s.letter, s])).values()];
    return unique.sort((a, b) => a.letter.localeCompare(b.letter));
  }, [sections, sabanaYear]);

  // Reset sabanaSection when year changes and current section is not available
  useEffect(() => {
    if (availableSectionsSabana.length > 0 && !availableSectionsSabana.find(s => s.letter === sabanaSection)) {
      setSabanaSection(availableSectionsSabana[0].letter);
    }
  }, [availableSectionsSabana, sabanaSection]);

  // Sync sabanaSubjectId with loaded subjects
  useEffect(() => {
    if (subjects.length > 0 && (!sabanaSubjectId || !subjects.find(s => s.id === sabanaSubjectId))) {
      setSabanaSubjectId(subjects[0].id);
    }
  }, [subjects, sabanaSubjectId]);

  // Students for Sábana (independent filter)
  const sabanaStudents = useMemo(() => {
    return students.filter(s => s.academicYear === sabanaYear && s.section === sabanaSection && s.status === 'Activo');
  }, [students, sabanaYear, sabanaSection]);

  // Refresh data from server when switching subtabs
  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, [activeSubTab, onRefreshData]);

  // Boletín states
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  // Manual input control
  const [editingGradeCell, setEditingGradeCell] = useState<{ studentId: string; evaluationId: string } | null>(null);
  const [tempGradeValue, setTempGradeValue] = useState<string>('');

  // Evaluation Plan modify states
  const [isModifyingPlan, setIsModifyingPlan] = useState(false);
  const [planEvaluations, setPlanEvaluations] = useState<any[]>([]);

  // === Notas Certificadas State ===
  const [certSelectedStudentId, setCertSelectedStudentId] = useState<string>('');
  const [certPlanCode, setCertPlanCode] = useState<string>('31059');
  const [certHistorico, setCertHistorico] = useState<any[]>([]);
  const [certLoading, setCertLoading] = useState(false);
  const [certExcelLoading, setCertExcelLoading] = useState(false);
  const [certSearchQuery, setCertSearchQuery] = useState('');
  // Carga modal
  const [isCertLoadModalOpen, setIsCertLoadModalOpen] = useState(false);
  const [certLoadStudentId, setCertLoadStudentId] = useState<string>('');
  const [certLoadGrado, setCertLoadGrado] = useState<number>(1);
  const [certLoadPeriodId, setCertLoadPeriodId] = useState<string>('');
  const [certLoadInstitucion, setCertLoadInstitucion] = useState('L.N. Estilita Orozco');
  const [certLoadNotas, setCertLoadNotas] = useState<Record<string, { id_escala: number; value: string }>>({});
  const [certLoadSaving, setCertLoadSaving] = useState(false);
  const [certLoadError, setCertLoadError] = useState('');
  const [certLoadSuccess, setCertLoadSuccess] = useState('');

  // Fetch certified grades history when student changes
  useEffect(() => {
    if (certSelectedStudentId && activeSubTab === 'certificadas') {
      setCertLoading(true);
      api.historicoNotas.getByStudent(certSelectedStudentId)
        .then((resp: any) => {
          setCertHistorico(Array.isArray(resp) ? resp : (resp?.data || []));
        })
        .catch((e: any) => {
          console.error('Error al cargar histórico:', e);
          setCertHistorico([]);
        })
        .finally(() => setCertLoading(false));
    }
  }, [certSelectedStudentId, activeSubTab]);

  // Filtered students for cert search
  const certFilteredStudents = useMemo(() => {
    if (!certSearchQuery.trim()) return students;
    const q = certSearchQuery.toLowerCase();
    return students.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.cedula.toLowerCase().includes(q)
    );
  }, [students, certSearchQuery]);

  // Group certified grades by grado
  const certHistoricoByGrado = useMemo(() => {
    const map: Record<number, any[]> = {};
    for (const nota of certHistorico) {
      const gradoNum = nota.grado?.numero || nota.id_grado || 0;
      if (!map[gradoNum]) map[gradoNum] = [];
      map[gradoNum].push(nota);
    }
    return map;
  }, [certHistorico]);

  // Get study plan subjects for a specific grade
  const getSubjectsForGrade = (grado: number) => {
    return studyPlans
      .filter(p => Number(p.year) === grado)
      .map(p => {
        const sub = subjects.find(s => s.id === p.subjectId);
        return {
          ...p,
          subjectName: sub?.name || p.subjectName,
          tipoCalificacion: p.tipoCalificacion || sub?.tipoCalificacion || 'Cuantitativa'
        };
      });
  };

  // Handle loading notas for cert modal
  const handleOpenCertLoadModal = () => {
    const studentId = certSelectedStudentId || (students[0]?.id || '');
    const student = students.find(s => s.id === studentId);
    const activePeriod = periods.find(p => p.status === 'Activo');
    const grado = student?.academicYear || 1;
    const section = student?.section || '';

    setCertLoadStudentId(studentId);
    setCertLoadGrado(grado);
    setCertLoadPeriodId(activePeriod?.id || '');
    setCertLoadInstitucion('L.N. Estilita Orozco');
    setCertLoadError('');
    setCertLoadSuccess('');

    // Pre-fill: first try certified history, then compute from regular grades
    const existingNotas: Record<string, { id_escala: number; value: string }> = {};

    // 1) Try from certified history
    certHistorico
      .filter((n: any) => (n.grado?.numero || n.id_grado) === grado)
      .forEach((n: any) => {
        const subId = String(n.id_asignatura);
        const escala = n.escala;
        const asig = n.asignatura;
        const isCualitativa = asig?.tipo_calificacion === 'Cualitativo';
        existingNotas[subId] = {
          id_escala: escala?.id_escala || n.id_escala || 0,
          value: isCualitativa
            ? (escala?.ponderacion_letra || '')
            : (escala?.nota_impresa || String(escala?.nota_calculo || ''))
        };
      });

    // 2) For subjects without certified grades, compute final grade from regular system
    const gradeSubs = getSubjectsForGrade(grado);
    gradeSubs.forEach(planItem => {
      if (!existingNotas[planItem.subjectId]) {
        const finalGrade = calculateSubjectFinalGrade(grades, evaluationPlans, studentId, planItem.subjectId, grado, section);
        if (finalGrade.raw > 0) {
          const isCualitativa = planItem.tipoCalificacion === 'Cualitativo';
          existingNotas[planItem.subjectId] = {
            id_escala: isCualitativa ? mapLiteralToEscalaId(gradeToLiteral(finalGrade.rounded)) : mapScoreToEscalaId(finalGrade.rounded),
            value: isCualitativa ? gradeToLiteral(finalGrade.rounded) : String(finalGrade.rounded)
          };
        }
      }
    });

    setCertLoadNotas(existingNotas);
    setIsCertLoadModalOpen(true);
  };

  // Map numeric score (1-20) to escala id
  const mapScoreToEscalaId = (score: number): number => {
    // Direct mapping: id_escala typically equals the numeric score
    return Math.max(1, Math.min(20, Math.round(score)));
  };

  // Map literal (A/B/C) to escala id
  const mapLiteralToEscalaId = (literal: string): number => {
    // escala_calificaciones: A=15, B=10, C=1
    const literalMap: Record<string, number> = { 'A': 15, 'B': 10, 'C': 1 };
    return literalMap[literal.toUpperCase()] || 1;
  };

  const handleSaveCertifiedGrades = async () => {
    setCertLoadError('');
    setCertLoadSuccess('');
    setCertLoadSaving(true);

    try {
      const notasArray = Object.entries(certLoadNotas)
        .filter(([_, val]: [string, any]) => val.value.trim() !== '')
        .map(([subjectId, val]: [string, any]) => ({
          id_estudiante: Number(certLoadStudentId),
          id_grado: certLoadGrado,
          id_asignatura: Number(subjectId),
          id_periodo: Number(certLoadPeriodId),
          id_escala: val.id_escala,
          institucion_origen: certLoadInstitucion,
        }));

      if (notasArray.length === 0) {
        setCertLoadError('Debe ingresar al menos una calificación.');
        setCertLoadSaving(false);
        return;
      }

      await api.historicoNotas.createBulk({ notas: notasArray });
      setCertLoadSuccess(`${notasArray.length} nota(s) certificada(s) guardadas exitosamente.`);

      // Refresh history if viewing same student
      if (certSelectedStudentId === certLoadStudentId) {
        const resp: any = await api.historicoNotas.getByStudent(certSelectedStudentId);
        setCertHistorico(Array.isArray(resp) ? resp : (resp?.data || []));
      }

      setTimeout(() => {
        setIsCertLoadModalOpen(false);
        setCertLoadSuccess('');
      }, 2000);
    } catch (e: any) {
      setCertLoadError(e.message || 'Error al guardar notas certificadas');
    } finally {
      setCertLoadSaving(false);
    }
  };

  const handleDownloadCertExcel = async () => {
    if (!certSelectedStudentId) return;
    setCertExcelLoading(true);
    try {
      await api.historicoNotas.downloadExcel(certSelectedStudentId, certPlanCode);
    } catch (e: any) {
      console.error(e);
      toast.error('Error al descargar Excel: ' + (e.message || 'Error desconocido'));
    } finally {
      setCertExcelLoading(false);
    }
  };

  const activePlan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && p.year === selectedYear && p.section === selectedSection && p.lapso === selectedLapso);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  const activeSectionStudents = students.filter(s => s.academicYear === selectedYear && s.section === selectedSection && s.status === 'Activo');

  const gradeTotalPages = Math.ceil(activeSectionStudents.length / GRADE_PAGE_LIMIT);
  const gradeOffset = (gradePage - 1) * GRADE_PAGE_LIMIT;
  const paginatedGradeStudents = activeSectionStudents.slice(gradeOffset, gradeOffset + GRADE_PAGE_LIMIT);

  const gradeMeta = {
    total: activeSectionStudents.length,
    page: gradePage,
    limit: GRADE_PAGE_LIMIT,
    pages: gradeTotalPages,
  };

  // Load plan evaluations for editing
  const handleStartModifyPlan = () => {
    if (activePlan) {
      setPlanEvaluations([...activePlan.evaluations]);
    } else {
      setPlanEvaluations([{ id: `${selectedSubjectId}-${selectedYear}${selectedSection}-l${selectedLapso}-e1`, name: 'Evaluación Única', percentage: 100 }]);
    }
    setIsModifyingPlan(true);
  };

  const handleUpdatePlanWeight = (index: number, val: string) => {
    const updated = [...planEvaluations];
    updated[index].percentage = val === '' ? 0 : Math.max(0, Math.min(100, Number(val)));
    setPlanEvaluations(updated);
  };

  const handleUpdatePlanName = (index: number, name: string) => {
    const updated = [...planEvaluations];
    updated[index].name = name;
    setPlanEvaluations(updated);
  };

  const handleAddPlanEvaluation = () => {
    if (planEvaluations.length >= 6) return;
    setPlanEvaluations([
      ...planEvaluations,
      { id: `${selectedSubjectId}-${selectedYear}${selectedSection}-l${selectedLapso}-e${Date.now()}`, name: 'Nueva Actividad', percentage: 10 }
    ]);
  };

  const handleRemovePlanEvaluation = (index: number) => {
    const updated = [...planEvaluations];
    updated.splice(index, 1);
    setPlanEvaluations(updated);
  };

  const evaluationHasGrades = (evalId: string): boolean => {
    return grades.some(g => g.evaluationId === evalId);
  };

  const handleSavePlan = () => {
    const sum = planEvaluations.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
    const hasZero = planEvaluations.some(ev => !ev.percentage || ev.percentage <= 0);
    
    if (sum !== 100) {
      toast.error(`Error: La sumatoria de las ponderaciones debe ser exactamente el 100%. Actualmente suma ${sum}%.`);
      return;
    }
    if (hasZero) {
      toast.error('Error: Todas las actividades deben tener un porcentaje mayor a 0%.');
      return;
    }
    onUpdateEvaluationPlan(selectedSubjectId, selectedYear, selectedSection, selectedLapso, planEvaluations);
    setIsModifyingPlan(false);
  };

  // Grade edit triggers
  const handleStartEditGrade = (stdId: string, evId: string, currentScore?: number) => {
    if (!['super_admin', 'control_estudios', 'docente'].includes(currentUserRole)) return;
    setEditingGradeCell({ studentId: stdId, evaluationId: evId });
    setTempGradeValue(currentScore !== undefined ? currentScore.toString() : '');
  };

  const handleSaveGrade = (stdId: string, evId: string, moveToNext: boolean = false) => {
    const numValue = Number(tempGradeValue);
    if (isNaN(numValue) || numValue < 1 || numValue > 20) {
      toast.error("Calificación inválida. El formato de notas reglamentario venezolano del MPPE exige un rango estricto de 1 a 20 puntos.");
      setEditingGradeCell(null);
      return;
    }
    
    onUpdateGrade(stdId, selectedSubjectId, selectedLapso, evId, numValue);
    setUnsavedChanges(prev => ({ ...prev, [`${stdId}-${evId}`]: true }));
    
    if (moveToNext) {
      const currentIndex = paginatedGradeStudents.findIndex(s => s.id === stdId);
      if (currentIndex >= 0 && currentIndex < paginatedGradeStudents.length - 1) {
        const nextStudent = paginatedGradeStudents[currentIndex + 1];
        const nextScoreRecord = grades.find(g => g.studentId === nextStudent.id && g.subjectId === selectedSubjectId && g.lapso === selectedLapso && g.evaluationId === evId);
        
        setEditingGradeCell({ studentId: nextStudent.id, evaluationId: evId });
        setTempGradeValue(nextScoreRecord ? nextScoreRecord.score.toString() : '');
      } else {
        setEditingGradeCell(null);
      }
    } else {
      setEditingGradeCell(null);
    }
  };

  const handleGlobalSave = async () => {
    // Filtrar las calificaciones actuales para el año, sección, lapso y asignatura seleccionados
    const subjectName = getSubjectName(selectedSubjectId);
    
    // Obtener las notas que corresponden a los estudiantes activos de la sección y asignatura
    const currentSectionStudentIds = activeSectionStudents.map(s => s.id);
    const gradesToSave = grades.filter(g => 
      currentSectionStudentIds.includes(g.studentId) &&
      g.subjectId === selectedSubjectId &&
      g.lapso === selectedLapso
    );

    if (gradesToSave.length === 0) {
      toast.error("No hay calificaciones cargadas para guardar en este periodo.");
      return;
    }

    const currentPayload = JSON.stringify(gradesToSave);
    const hasChanges = Object.keys(unsavedChanges).length > 0;
    
    if (!hasChanges) {
      toast.error("No se detectaron cambios. Las calificaciones actuales ya se encuentran guardadas.");
      return;
    }

    const activePlan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && Number(p.year) === selectedYear && p.lapso === selectedLapso && p.section === selectedSection);
    const detalles = gradesToSave.map(g => {
      const student = activeSectionStudents.find(s => s.id === g.studentId);
      const evalObj = activePlan?.evaluations.find(ev => ev.id === g.evaluationId);
      return {
        studentName: student ? `${student.lastName}, ${student.firstName}` : 'Estudiante Desconocido',
        evaluationId: g.evaluationId,
        evaluationName: evalObj?.name || 'Evaluación',
        percentage: evalObj?.percentage || 0,
        score: g.score
      };
    });

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveGrades(gradesToSave, subjectName, selectedYear, selectedSection, selectedLapso, detalles, activePlan?.evaluations || []);
      setLastSavedPayload(currentPayload);
      setSaveSuccess(true);
      setUnsavedChanges({});
      toast.success("Calificaciones guardadas exitosamente en la base de datos.");
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
      }, 2000); // Muestra el check por 2 segundos antes de cerrar
    } catch (e) {
      console.error(e);
      toast.error("Ocurrió un error al guardar las calificaciones.");
      setIsSaving(false);
    }
  };

  const getSubjectName = (subId: string) => {
    return subjects.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div id="grade-manager-root" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Saving / Success Modal Overlay */}
      {(isSaving || saveSuccess) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            {saveSuccess ? (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 text-center">¡Guardado Exitoso!</h3>
                <p className="text-base text-slate-500 text-center mt-2">
                  Calificaciones guardadas exitosamente en la base de datos.
                </p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Guardando Calificaciones</h3>
                <p className="text-base text-slate-500 text-center mt-2">
                  Por favor espera mientras sincronizamos los datos con la base de datos...
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sub tabs navigation */}
      <div id="grade-tabs-bar" className="flex border-b border-slate-200">
        <button
          id="btn-subtab-carga"
          onClick={() => setActiveSubTab('carga')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            activeSubTab === 'carga' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>Carga de Notas</span>
        </button>
        <button
          id="btn-subtab-sabana"
          onClick={() => setActiveSubTab('sabana')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            activeSubTab === 'sabana' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Sábana de Notas</span>
        </button>
        <button
          id="btn-subtab-boletin"
          onClick={() => setActiveSubTab('boletin')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            activeSubTab === 'boletin' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Boletín Informativo</span>
        </button>
        <button
          id="btn-subtab-certificadas"
          onClick={() => setActiveSubTab('certificadas')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            activeSubTab === 'certificadas' 
              ? 'border-amber-600 text-amber-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ScrollText className="h-4 w-4" />
          <span>Notas Certificadas</span>
        </button>
      </div>

      {/**************** TAB 1: CARGA DE NOTAS ****************/}
      {activeSubTab === 'carga' && (
        <div id="tab-carga-container" className="space-y-6">
          
          {/* Filters Bar */}
          <div id="carga-filters-bar" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            
            <div id="filter-year-group" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Año de Educación Media</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value) as AcademicYear)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>

            <div id="filter-section-group" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Sección</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {availableSections.map(s => (
                  <option key={s.id} value={s.letter}>Sección "{s.letter}"</option>
                ))}
              </select>
            </div>

            <div id="filter-subject-group" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Asignatura</span>
              <SearchableSelect
                options={subjects.filter(s => s.years.includes(selectedYear)).map(s => ({ value: s.id, label: s.name }))}
                value={selectedSubjectId}
                onChange={(val) => setSelectedSubjectId(String(val))}
              />
            </div>

            <div id="filter-lapso-group" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Período ("Lapso")</span>
              <select
                value={selectedLapso}
                onChange={(e) => setSelectedLapso(Number(e.target.value) as 1|2|3)}
                className="text-sm p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-bold"
              >
                <option value={1}>Primer Lapso (L1)</option>
                <option value={2}>Segundo Lapso (L2)</option>
                <option value={3}>Tercer Lapso (L3)</option>
              </select>
            </div>

            <div id="eval-plan-actions" className="ml-auto pt-2">
              <button
                id="btn-modify-eval-plan"
                onClick={handleStartModifyPlan}
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 text-sm rounded-lg flex items-center gap-1.5 pointer-events-auto cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                Configurar Plan de Evaluación
              </button>
            </div>

          </div>

          {/* Conditional Plan Builder Modal or layout if active */}
          {isModifyingPlan && (
            <div id="modal-plan-builder" className="bg-amber-50/75 border border-amber-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="text-sm font-bold text-amber-900">
                  🔧 Estructurando actividades para: {getSubjectName(selectedSubjectId)} ({selectedYear}° Año "{selectedSection}" - Lapso {selectedLapso})
                </span>
                <span className="text-sm font-semibold text-amber-700">Debe sumar exactamente 100%</span>
              </div>
              
              <div className="space-y-2.5 max-w-xl">
                {planEvaluations.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={ev.name} 
                      onChange={(e) => handleUpdatePlanName(idx, e.target.value)}
                      placeholder="Nombre de la actividad" 
                      className="text-sm p-2 bg-white border border-slate-200 rounded-lg flex-1 focus:outline-hidden"
                    />
                    <div className="flex items-center gap-1 shrink-0 w-28">
                      <input 
                        type="number" 
                        value={ev.percentage || ''} 
                        onChange={(e) => handleUpdatePlanWeight(idx, e.target.value)}
                        className="text-sm p-2 bg-white border border-slate-200 rounded-lg w-16 text-center focus:outline-hidden"
                      />
                      <span className="text-sm font-bold text-slate-500">%</span>
                    </div>
                    {planEvaluations.length > 1 && !evaluationHasGrades(ev.id) && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePlanEvaluation(idx)} 
                        className="p-2 text-rose-500 hover:text-rose-700 pointer-events-auto cursor-pointer"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    )}
                    {evaluationHasGrades(ev.id) && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0 whitespace-nowrap">
                        Tiene notas
                      </span>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 justify-between items-center border-t border-amber-200/50 pt-3">
                  <div className="text-sm font-bold text-amber-800">
                    Total: <span className={planEvaluations.reduce((a, b) => a + b.percentage, 0) === 100 ? 'text-green-700' : 'text-rose-600'}>
                      {planEvaluations.reduce((a, b) => a + b.percentage, 0)}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {planEvaluations.length < 6 && (
                      <button 
                        type="button" 
                        onClick={handleAddPlanEvaluation}
                        className="text-sm py-1.5 px-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg pointer-events-auto cursor-pointer"
                      >
                        + Actividad
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => setIsModifyingPlan(false)}
                      className="text-sm py-1.5 px-3 bg-slate-200 text-slate-700 font-semibold rounded-lg pointer-events-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSavePlan}
                      className="text-sm py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg pointer-events-auto cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grading Matrix Box */}
          <div id="grading-matrix-box" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <div id="grading-matrix-header" className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Ingreso Manual de Calificaciones</h3>
                <p className="text-sm text-slate-400 font-medium">Haga clic sobre cualquier celda para cargar o editar la nota del 1 al 20.</p>
                {!activePlan && (
                  <div className="mt-2 text-sm font-bold text-rose-600 bg-rose-50 p-2 border border-rose-200 rounded">
                    ⚠️ Esta asignatura no está asignada al plan de estudios de este año o no tiene evaluaciones configuradas. Ve a "Plan de Estudio" o usa "Configurar Plan de Evaluación".
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span> Insuficiente (1-9)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Mínima (10-14)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Sobresaliente (15-20)</span>
                </div>
                {['super_admin', 'control_estudios', 'docente'].includes(currentUserRole) && (
                  <button
                    onClick={handleGlobalSave}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 pointer-events-auto cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Guardar Calificaciones
                  </button>
                )}
              </div>
            </div>

            {/* Matrix Scroll wrapper */}
            <div id="grading-matrix-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold text-sm">
                    <th className="py-2.5">Estudiante</th>
                    {activePlan?.evaluations.map((ev, index) => (
                      <th key={ev.id} className="py-2.5 text-center px-4 max-w-[120px]">
                        <span className="block font-semibold text-slate-600 text-center truncate" title={ev.name}>{ev.name}</span>
                        <span className="block text-xs text-slate-400 font-bold font-mono text-center">{ev.percentage}%</span>
                      </th>
                    ))}
                    <th className="py-2.5 text-center font-bold text-slate-700">LAPSO RAW</th>
                    <th className="py-2.5 text-center font-bold text-slate-800">LAPSO REDONDEADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150/45 font-medium text-slate-700">
                  {paginatedGradeStudents.length > 0 ? (
                    paginatedGradeStudents.map(student => {
                      const avgObj = activePlan 
                        ? calculateEvaluationAverage(grades, activePlan.evaluations, student.id, selectedSubjectId, selectedLapso)
                        : { raw: 0, rounded: 0 };

                      const getFailingClass = (score: number) => {
                        if (score < 10) return 'text-rose-600 bg-rose-50 border-rose-200/50 hover:bg-rose-100';
                        if (score >= 15) return 'text-emerald-700 bg-emerald-50 border-emerald-200/50 hover:bg-emerald-100';
                        return 'text-blue-700 bg-blue-50 border-blue-200/50 hover:bg-blue-100';
                      };

                      return (
                        <tr id={`grad-row-${student.id}`} key={student.id} className="hover:bg-slate-50/50">
                          <td className="py-3 pr-4">
                            <span className="font-bold text-slate-800 text-sm block">{student.lastName}, {student.firstName}</span>
                            <span className="text-xs text-slate-400 font-mono font-bold leading-none">{student.cedula}</span>
                          </td>
                          
                          {/* Render cells */}
                          {activePlan?.evaluations.map(ev => {
                            const scoreRecord = grades.find(g => g.studentId === student.id && g.subjectId === selectedSubjectId && g.lapso === selectedLapso && g.evaluationId === ev.id);
                            const isEditing = editingGradeCell?.studentId === student.id && editingGradeCell?.evaluationId === ev.id;

                            return (
                              <td id={`cell-td-${student.id}-${ev.id}`} key={ev.id} className="py-3 px-2 text-center">
                                {isEditing ? (
                                  <div className="flex items-center justify-center gap-1 max-w-[80px] mx-auto">
                                    <input
                                      type="text"
                                      value={tempGradeValue}
                                      onChange={(e) => setTempGradeValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleSaveGrade(student.id, ev.id, true);
                                        }
                                        if (e.key === 'Escape') setEditingGradeCell(null);
                                      }}
                                      autoFocus
                                      className="w-12 text-center text-sm p-1 bg-white border-2 border-blue-500 rounded focus:outline-hidden font-bold"
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => handleSaveGrade(student.id, ev.id, true)}
                                      className="text-sm text-white bg-blue-600 px-1.5 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    id={`cell-btn-${student.id}-${ev.id}`}
                                    onClick={() => handleStartEditGrade(student.id, ev.id, scoreRecord?.score)}
                                    className={`px-3 py-1.5 rounded-md min-w-[44px] font-mono font-bold text-sm border text-center transition-all ${
                                      scoreRecord 
                                        ? getFailingClass(scoreRecord.score) 
                                        : 'bg-slate-50/50 border-slate-200 text-slate-300 hover:bg-slate-100 hover:border-slate-300 pointer-events-auto cursor-pointer'
                                    }`}
                                    disabled={!['super_admin', 'control_estudios', 'docente'].includes(currentUserRole)}
                                    title={!['super_admin', 'control_estudios', 'docente'].includes(currentUserRole) ? "Solo lectura para este rol simulado" : "Editar Nota"}
                                  >
                                    {scoreRecord ? String(scoreRecord.score).padStart(2, '0') : '--'}
                                  </button>
                                )}
                              </td>
                            );
                          })}

                          {/* Computed averages */}
                          <td className="py-3 text-center px-4 font-mono text-slate-500 text-sm font-bold">
                            {avgObj.raw > 0 ? avgObj.raw : '--'}
                          </td>
                          <td className="py-3 text-center px-4">
                            {avgObj.raw > 0 ? (
                              <span className={`px-2.5 py-1 rounded-md font-mono text-sm font-black ${
                                avgObj.rounded >= 10 
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                  : 'bg-rose-100 text-rose-900 border border-rose-200'
                              }`}>
                                {String(avgObj.rounded).padStart(2, '0')}
                              </span>
                            ) : (
                              <span className="text-slate-300">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                        Debe matricular o activar estudiantes en {selectedYear}° Año "{selectedSection}" para cargar calificaciones.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {activeSectionStudents.length > GRADE_PAGE_LIMIT && (
              <PaginationBar
                page={gradeMeta.page}
                limit={gradeMeta.limit}
                total={gradeMeta.total}
                pages={gradeMeta.pages}
                showLimitSelector={false}
                onPageChange={setGradePage}
                onLimitChange={() => {}}
              />
            )}
          </div>

          {/* Historial de Modificaciones Card */}
          <div id="grades-history-box" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 mt-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-indigo-500" />
                Historial de Modificaciones (Auditoría)
              </h3>
              <p className="text-sm text-slate-400 font-medium mt-1">
                Registro permanente de las calificaciones guardadas en el sistema.
              </p>
            </div>
            
            <div className="pr-2 space-y-3">
              {(() => {
                const gradeAuditLogs = auditLogs.filter(log => log.accion === 'GUARDAR_NOTAS_PARCIALES' || log.accion === 'GUARDAR_NOTAS');
                const visibleLogs = gradeAuditLogs.slice(0, visibleAuditLogsCount);
                const hasMoreLogs = visibleAuditLogsCount < gradeAuditLogs.length;

                return gradeAuditLogs.length > 0 ? (
                  <>
                    {visibleLogs.map((log, index) => (
                      <div key={index} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <div className="bg-indigo-100 p-1.5 rounded-full mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">Carga de Calificaciones Exitosa</span>
                            <span className="text-sm font-mono text-slate-400">
                              {new Date(log.fecha_hora).toLocaleString('es-VE')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Se registraron y guardaron las notas para <strong>{log.valores_nuevos?.asignatura}</strong>, 
                            pertenecientes a {log.valores_nuevos?.year}° Año "{log.valores_nuevos?.section}" 
                            (Lapso {log.valores_nuevos?.lapso}).
                          </p>
                          {log.valores_nuevos?.detalles && (
                            <button
                              onClick={() => setSelectedAuditLog(log)}
                              className="mt-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              Ver Archivo de Notas
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {hasMoreLogs && (
                      <div className="flex justify-center pt-2 pb-1">
                        <button
                          onClick={() => setVisibleAuditLogsCount(prev => prev + 3)}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Ver más
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-lg">
                    <p className="text-sm font-semibold text-slate-400">Aún no hay registros de carga de calificaciones en base de datos.</p>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      )}


      {/**************** TAB 2: SÁBANA DE NOTAS (Tabular matrix) ********/}
      {activeSubTab === 'sabana' && (
        <div id="tab-sabana-container" className="space-y-6">
          
          {/* Selectors specifically for Sábana */}
          <div id="sabana-controls" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            
            <div id="sabana-ctrl-year" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Año Académico</span>
              <select
                value={sabanaYear}
                onChange={(e) => setSabanaYear(Number(e.target.value) as AcademicYear)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>

            <div id="sabana-ctrl-section" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Sección</span>
              <select
                value={sabanaSection}
                onChange={(e) => setSabanaSection(e.target.value)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {availableSectionsSabana.map(s => (
                  <option key={s.id} value={s.letter}>Sección "{s.letter}"</option>
                ))}
              </select>
            </div>

            <div id="sabana-ctrl-subject" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Asignatura</span>
              <SearchableSelect
                options={subjects.filter(s => s.years.includes(sabanaYear)).map(s => ({ value: s.id, label: s.name }))}
                value={sabanaSubjectId}
                onChange={(val) => setSabanaSubjectId(String(val))}
              />
            </div>

            <p className="text-sm text-slate-500 italic max-w-sm mt-3">
              Muestra el consolidado oficial de Lapsos 1, 2 y 3 para la asignatura de <strong>{getSubjectName(sabanaSubjectId)}</strong>.
            </p>

            <button
              id="btn-print-sabana"
              onClick={() => window.print()}
              className="ml-auto py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Imprimir Formato MPPE</span>
            </button>
            <button
              onClick={() => exportGradesToExcel(students, subjects, grades, evaluationPlans, sabanaYear, sabanaSection)}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Excel (Sábana)
            </button>
          </div>

          {/* Sábana layout (Sheet style) */}
          <div id="printable-sabana" className="bg-white p-8 border border-slate-250 shadow-md rounded-xl space-y-8 select-text selection:bg-slate-100">
            
            {/* Header matching venezuelan public layouts */}
            <div id="sabana-gov-header" className="flex justify-between items-start text-xs text-slate-600 font-medium">
              <div id="gov-dep" className="space-y-0.5">
                <span className="block font-bold text-slate-800 uppercase text-sm">República Bolivariana de Venezuela</span>
                <span className="block">Ministerio del Poder Popular para la Educación</span>
                <span className="block">Liceo Bolivariano "José Antonio Anzoátegui"</span>
                <span className="block font-mono">Código MPPE: #EM-77218320</span>
              </div>
              <div id="rep-stamp-box" className="border-2 border-slate-800 rounded p-1 text-center font-bold px-3">
                REGISTRO DE CONTROL DE ESTUDIOS
              </div>
            </div>

            {/* Title description of sheet */}
            <div id="sabana-sheet-title" className="text-center font-black text-sm space-y-1 text-slate-900 uppercase">
              <h4>ACTA INTEGRAL DE EVALUACIONES CONTINUAS ("SÁBANA DE NOTAS")</h4>
              <p className="text-sm font-semibold text-slate-500 font-mono">
                Año Escolar: 2025-2026 | {sabanaYear}° Año EMG - Sección "{sabanaSection}" | Asignatura: {getSubjectName(sabanaSubjectId)?.toUpperCase() || ''}
              </p>
            </div>

            {/* Sheet Matrix */}
            <div id="sabana-matrix-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-sm border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 font-bold text-slate-800 text-xs">
                    <th className="p-2 border border-slate-300 w-16 text-center font-bold">N°</th>
                    <th className="p-2 border border-slate-300 w-32 font-bold font-mono">Cédula</th>
                    <th className="p-2 border border-slate-300">Nombres y Apellidos del Estudiante</th>
                    <th className="p-2 border border-slate-300 text-center font-bold w-20 bg-blue-50/50">LAPSO 1 (L1)</th>
                    <th className="p-2 border border-slate-300 text-center font-bold w-20 bg-blue-50/50">LAPSO 2 (L2)</th>
                    <th className="p-2 border border-slate-300 text-center font-bold w-20 bg-blue-50/50">LAPSO 3 (L3)</th>
                    <th className="p-2 border border-slate-300 text-center font-bold w-24 bg-blue-100/50">NOTA FINAL</th>
                    <th className="p-2 border border-slate-300 text-center font-bold w-28">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium text-slate-705">
                  {sabanaStudents.length > 0 ? (
                    sabanaStudents.map((student, idx) => {
                      // Get L1 Average
                      const l1Plan = evaluationPlans.find(p => p.subjectId === sabanaSubjectId && p.year === sabanaYear && p.section === sabanaSection && p.lapso === 1);
                      const l1Avg = l1Plan ? calculateEvaluationAverage(grades, l1Plan.evaluations, student.id, sabanaSubjectId, 1) : { rounded: 0, raw: 0 };

                      // Get L2 Average
                      const l2Plan = evaluationPlans.find(p => p.subjectId === sabanaSubjectId && p.year === sabanaYear && p.section === sabanaSection && p.lapso === 2);
                      const l2Avg = l2Plan ? calculateEvaluationAverage(grades, l2Plan.evaluations, student.id, sabanaSubjectId, 2) : { rounded: 0, raw: 0 };

                      // Get L3 Average
                      const l3Plan = evaluationPlans.find(p => p.subjectId === sabanaSubjectId && p.year === sabanaYear && p.section === sabanaSection && p.lapso === 3);
                      const l3Avg = l3Plan ? calculateEvaluationAverage(grades, l3Plan.evaluations, student.id, sabanaSubjectId, 3) : { rounded: 0, raw: 0 };

                      // Calculate final rounded score
                      const finalGrade = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sabanaSubjectId, sabanaYear, sabanaSection);

                      // Check if subject is Cualitativa
                      const isCualitativa = subjects.find(s => s.id === sabanaSubjectId)?.tipoCalificacion === 'Cualitativo';

                      const renderGrade = (avg: { raw: number; rounded: number }) => {
                        if (avg.raw === 0) return '--';
                        return isCualitativa ? gradeToLiteral(avg.rounded) : String(avg.rounded).padStart(2, '0');
                      };

                      const renderFinal = (fg: { raw: number; rounded: number }) => {
                        if (fg.raw === 0) return '--';
                        return isCualitativa ? gradeToLiteral(fg.rounded) : String(fg.rounded).padStart(2, '0');
                      };

                      return (
                        <tr id={`sab-row-${student.id}`} key={student.id} className="hover:bg-slate-50/20 text-sm">
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono">{idx + 1}</td>
                          <td className="p-2 border border-slate-300 font-mono font-bold text-slate-900">{student.cedula}</td>
                          <td className="p-2 border border-slate-300">
                            <span className="font-extrabold uppercase text-slate-800">{student.lastName}</span>, {student.firstName}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {renderGrade(l1Avg)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {renderGrade(l2Avg)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {renderGrade(l3Avg)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-extrabold font-mono bg-blue-50/50 text-base text-blue-900">
                            {renderFinal(finalGrade)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center">
                            {finalGrade.raw > 0 ? (
                              finalGrade.rounded >= 10 ? (
                                <span className="text-green-700 font-bold uppercase text-sm bg-green-50 px-1.5 py-0.5 rounded">Aprobado</span>
                              ) : (
                                <span className="text-rose-700 font-bold uppercase text-sm bg-rose-50 px-1.5 py-0.5 rounded">A Aplazar / Reprobado</span>
                              )
                            ) : (
                              <span className="text-slate-400">Cursando</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-slate-400 font-bold">
                        No hay alumnos matriculados para emitir actas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Regulatory Signatures block matching actual templates */}
            <div id="regulatory-signatures" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-xs text-slate-600 font-medium">
              <div id="sig-director" className="text-center space-y-12">
                <div className="h-0.5 bg-slate-300 w-32 mx-auto"></div>
                <div>
                  <span className="block font-bold">Dr. Francisco Linares</span>
                  <span className="block">Director Principal (Sello)</span>
                </div>
              </div>

              <div id="sig-control" className="text-center space-y-12">
                <div className="h-0.5 bg-slate-300 w-32 mx-auto"></div>
                <div>
                  <span className="block font-bold">Lic. Teresa Carreño</span>
                  <span className="block">Control de Estudios</span>
                </div>
              </div>

              <div id="sig-teacher" className="text-center space-y-12">
                <div className="h-0.5 bg-slate-300 w-32 mx-auto"></div>
                <div>
                  <span className="block font-bold">Prof. de Cátedra</span>
                  <span className="block">Carga Digital Registrada y Conforme</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}


      {/**************** TAB 3: BOLETÍN INDIVIDUAL ***************/}
      {activeSubTab === 'boletin' && (
        <div id="tab-boletin-container" className="space-y-6">
          
          {/* Student picker */}
          <div id="boletin-student-controls" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            <div id="boletin-student-group" className="flex flex-col gap-1 w-72">
              <span className="text-sm font-bold text-slate-400 uppercase">Seleccione Alumno Matriculado</span>
              <SearchableSelect
                options={students.map(s => ({ value: s.id, label: `[${s.academicYear}° Año "${s.section}"] - ${s.lastName}, ${s.firstName} (${s.cedula})` }))}
                value={selectedStudentId}
                onChange={(val) => setSelectedStudentId(String(val))}
              />
            </div>

            <p className="text-sm text-slate-400 italic max-w-xs mt-3">
              Genera la boleta acumulativa del período corriente. Las calificaciones en actas ya se entregan debidamente redondeadas.
            </p>

            <button
              id="btn-print-boletin"
              onClick={() => window.print()}
              className="ml-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Imprimir Boleta de Notas</span>
            </button>
          </div>

          {/* Actual boletín print preview sheet */}
          {(() => {
            const student = students.find(s => s.id === selectedStudentId);
            if (!student) return <p className="text-center text-slate-400">Seleccione un estudiante válido.</p>;

            // Subjects applicable to this student's year level
            const applicableSubjects = subjects.filter(sub => sub.years.includes(student.academicYear));

            return (
              <div id="printable-boletin" className="bg-white p-8 border border-slate-250 shadow-md rounded-xl space-y-6 select-text selection:bg-slate-100 max-w-4xl mx-auto">
                
                {/* Header elements unified design */}
                <div id="boletin-header" className="flex justify-between items-start border-b pb-4 border-slate-200">
                  <div className="text-xs text-slate-600 space-y-0.5 leading-normal">
                    <span className="block font-bold text-slate-800 uppercase text-sm">Liceo Bolivariano "José Antonio Anzoátegui"</span>
                    <span className="block">Ministerio del Poder Popular para la Educación</span>
                    <span className="block italic">Estado Anzoátegui, Venezuela</span>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <span className="block">Boleta de Notas Acumulada</span>
                    <span className="block">Año Escolar: <strong>2025 - 2026</strong></span>
                  </div>
                </div>

                {/* Participant Ficha detail cards */}
                <div id="boletin-student-ficha" className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-slate-700">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-bold text-slate-400 uppercase block">Estudiante</span>
                      <span className="text-base font-bold text-indigo-900 uppercase">{student.lastName}, {student.firstName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-bold text-slate-400 uppercase block">Cédula de Identidad</span>
                        <span className="font-mono font-bold text-slate-805">{student.cedula}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-400 uppercase block">Año / Sección Matrícula</span>
                        <span className="text-slate-805">{student.academicYear}° Año de Educación Media - "{student.section}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-bold text-slate-400 uppercase block">Propietario / Representante Legal (LOPNA)</span>
                      <span className="text-slate-900 font-bold">{student.representativeName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-bold text-slate-400 uppercase block">Cédula Rep.</span>
                        <span className="font-mono">{student.representativeCedula}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-400 uppercase block">Teléfono de Enlace</span>
                        <span className="font-mono">{student.representativePhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects evaluation transcript table */}
                <div id="boletin-grades-box" className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-sm border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-50 font-bold text-slate-800 border-b border-slate-300 text-sm uppercase tracking-wider">
                        <th className="p-2 border border-slate-300">Asignatura / Plan de Estudio</th>
                        <th className="p-2 border border-slate-300 text-center w-20">Lapso 1</th>
                        <th className="p-2 border border-slate-300 text-center w-20">Lapso 2</th>
                        <th className="p-2 border border-slate-300 text-center w-20">Lapso 3</th>
                        <th className="p-2 border border-slate-300 text-center w-24 bg-blue-50">FINAL PROM.</th>
                        <th className="p-2 border border-slate-300 text-center w-28">ESTATUS ASIGNATURA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium text-slate-705">
                      {applicableSubjects.map(sub => {
                        // L1 Avg rounded
                        const l1Plan = evaluationPlans.find(p => p.subjectId === sub.id && p.year === student.academicYear && p.section === student.section && p.lapso === 1);
                        const l1Avg = l1Plan ? calculateEvaluationAverage(grades, l1Plan.evaluations, student.id, sub.id, 1) : { rounded: 0, raw: 0 };
                        
                        // L2 Avg rounded
                        const l2Plan = evaluationPlans.find(p => p.subjectId === sub.id && p.year === student.academicYear && p.section === student.section && p.lapso === 2);
                        const l2Avg = l2Plan ? calculateEvaluationAverage(grades, l2Plan.evaluations, student.id, sub.id, 2) : { rounded: 0, raw: 0 };

                        // L3 Avg rounded
                        const l3Plan = evaluationPlans.find(p => p.subjectId === sub.id && p.year === student.academicYear && p.section === student.section && p.lapso === 3);
                        const l3Avg = l3Plan ? calculateEvaluationAverage(grades, l3Plan.evaluations, student.id, sub.id, 3) : { rounded: 0, raw: 0 };

                        const finalScore = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id, student.academicYear, student.section);

                        const isCualitativa = sub.tipoCalificacion === 'Cualitativo';

                        const renderGrade = (avg: { raw: number; rounded: number }) => {
                          if (avg.raw === 0) return '--';
                          return isCualitativa ? gradeToLiteral(avg.rounded) : String(avg.rounded).padStart(2, '0');
                        };

                        const renderFinal = (fg: { raw: number; rounded: number }) => {
                          if (fg.raw === 0) return '--';
                          return isCualitativa ? gradeToLiteral(fg.rounded) : String(fg.rounded).padStart(2, '0');
                        };

                        return (
                          <tr id={`bol-sub-${sub.id}`} key={sub.id} className="hover:bg-slate-50/20 text-sm">
                            <td className="p-2.5 border border-slate-300 font-bold text-slate-800">{sub.name}</td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {renderGrade(l1Avg)}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {renderGrade(l2Avg)}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {renderGrade(l3Avg)}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-extrabold font-mono bg-blue-50/50 text-sm text-blue-950">
                              {renderFinal(finalScore)}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center">
                              {finalScore.raw > 0 ? (
                                finalScore.rounded >= 10 ? (
                                  <span className="text-green-700 font-bold uppercase text-sm bg-green-50 px-1.5 py-0.5 rounded">Aprobado (AP)</span>
                                ) : (
                                  <span className="text-rose-700 font-bold uppercase text-sm bg-rose-50 px-1.5 py-0.5 rounded">Materia Pendiente</span>
                                )
                              ) : (
                                <span className="text-slate-400">Cursando</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer notes under LOPNA and MPPE layout */}
                <div id="boletin-legal-footer" className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed text-justify space-y-1">
                  <strong>Marco Legal Normativo:</strong>
                  <p>
                    De acuerdo con el Artículo 108 del Reglamento General de la Ley Orgánica de Educación (RLOE), las notas de lapso definitivas se expresan en números enteros con redondeo favorable al estudiante a partir de las fracciones iguales o mayores de 0.50. 
                    En concordancia con los principios de la LOPNA, esta información es estrictamente confidencial para uso exclusivo del alumno y su representante legal.
                  </p>
                </div>

                {/* Sign and stamp blocks */}
                <div id="boletin-signatures" className="grid grid-cols-3 gap-6 pt-10 text-sm text-slate-600 font-semibold text-center uppercase tracking-wide">
                  <div className="space-y-12">
                    <div className="h-0.5 bg-slate-300 w-28 mx-auto"></div>
                    <div>
                      <span>Firma del Director</span>
                      <span className="block text-[8px] text-slate-400 lowercase italic font-medium">Sello de Dirección Principal</span>
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    <div className="h-0.5 bg-slate-300 w-28 mx-auto"></div>
                    <div>
                      <span>Sello Control de Estudios</span>
                      <span className="block text-[8px] text-slate-400 lowercase italic font-medium">Liceo José Antonio Anzoátegui</span>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="h-0.5 bg-slate-300 w-28 mx-auto"></div>
                    <div>
                      <span>Firma del Representante</span>
                      <span className="block text-[8px] text-slate-400 lowercase italic font-medium font-mono">C.I.: {student.representativeCedula}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/**************** TAB 4: NOTAS CERTIFICADAS ***************/}
      {activeSubTab === 'certificadas' && (
        <div id="tab-certificadas-container" className="space-y-6">

          {/* Controls Bar */}
          <div id="cert-controls" className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-800">Histórico de Notas Certificadas</h3>
              </div>
              {['super_admin', 'control_estudios', 'docente'].includes(currentUserRole) && (
                <button
                  onClick={handleOpenCertLoadModal}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Registrar Notas Certificadas
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              {/* Student search + selector */}
              <div className="flex flex-col gap-1 flex-1 min-w-[280px]">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Seleccionar Estudiante</span>
                <SearchableSelect
                  options={students.map(s => ({ value: s.id, label: `[${s.academicYear}° "${s.section}"] ${s.lastName}, ${s.firstName} — ${s.cedula}` }))}
                  value={certSelectedStudentId}
                  onChange={(val) => setCertSelectedStudentId(String(val))}
                  placeholder="Seleccione un estudiante"
                />
              </div>

              {/* Plan selector */}
              <div className="flex flex-col gap-1 min-w-[260px]">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Plan de Estudio</span>
                <select
                  value={certPlanCode}
                  onChange={(e) => setCertPlanCode(e.target.value)}
                  className="text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  <option value="31059">Plan 31059 — EMG Vigente (2017+)</option>
                  <option value="32011">Plan 32011/31018 — Antiguo (pre-2017)</option>
                </select>
              </div>

              {/* Download Excel */}
              <button
                onClick={handleDownloadCertExcel}
                disabled={!certSelectedStudentId || certExcelLoading}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {certExcelLoading ? 'Generando...' : 'Generar Excel Certificado'}
              </button>
            </div>
          </div>

          {/* History Table */}
          {certSelectedStudentId ? (
            certLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Student header card */}
                {(() => {
                  const student = students.find(s => s.id === certSelectedStudentId);
                  if (!student) return null;
                  return (
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-base">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-base block">{student.lastName}, {student.firstName}</span>
                        <span className="text-xs text-slate-500 font-mono">C.I.: {student.cedula} | {student.academicYear}° Año "{student.section}"</span>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">
                          {certHistorico.length} nota(s) certificada(s)
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Grades grouped by year */}
                {Object.keys(certHistoricoByGrado).length > 0 ? (
                  Object.entries(certHistoricoByGrado)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([grado, notas]: [string, any[]]) => (
                      <div key={grado} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                          <h4 className="text-sm font-bold text-slate-700">
                            {grado}° Año de Educación Media
                            <span className="ml-2 text-xs font-normal text-slate-400">
                              ({notas.length} asignatura{notas.length !== 1 ? 's' : ''})
                            </span>
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-bold">
                                <th className="px-5 py-3">Asignatura</th>
                                <th className="px-4 py-3 text-center w-24">Nota</th>
                                <th className="px-4 py-3 text-center w-24">Tipo</th>
                                <th className="px-4 py-3 w-40">Período</th>
                                <th className="px-4 py-3 w-48">Institución Origen</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {notas.map((nota: any, idx: number) => {
                                const asig = nota.asignatura;
                                const escala = nota.escala;
                                const isCualitativa = asig?.tipo_calificacion === 'Cualitativo';
                                const notaDisplay = isCualitativa
                                  ? (escala?.ponderacion_letra || escala?.nota_impresa || '--')
                                  : (escala?.nota_impresa || escala?.nota_calculo || '--');
                                const notaNum = escala?.nota_calculo;
                                const isAprobada = isCualitativa ? true : (notaNum !== null && notaNum >= 10);

                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3 font-semibold text-slate-800">
                                      {asig?.nombre || `Asignatura #${nota.id_asignatura}`}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`inline-block px-2.5 py-1 rounded-md text-sm font-black font-mono ${
                                        isCualitativa
                                          ? 'bg-violet-100 text-violet-800 border border-violet-200'
                                          : isAprobada
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}>
                                        {notaDisplay}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`text-sm font-bold uppercase px-1.5 py-0.5 rounded ${
                                        isCualitativa
                                          ? 'bg-violet-50 text-violet-600'
                                          : 'bg-blue-50 text-blue-600'
                                      }`}>
                                        {isCualitativa ? 'Cualitativo' : 'Cuantitativo'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 text-sm">
                                      {nota.periodo?.nombre || `Período #${nota.id_periodo}`}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-sm italic">
                                      {nota.institucion_origen}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
                    <ScrollText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-semibold text-slate-400">No hay notas certificadas registradas para este estudiante.</p>
                    <p className="text-sm text-slate-400 mt-1">Use el botón "Registrar Notas Certificadas" para cargar el histórico académico.</p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
              <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-400">Seleccione un estudiante para consultar su historial de notas certificadas.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Carga de Notas Certificadas */}
      {isCertLoadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-slate-800">Registrar Notas Certificadas</h3>
              </div>
              <button
                onClick={() => setIsCertLoadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold pointer-events-auto cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {certLoadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm font-medium">
                  {certLoadError}
                </div>
              )}
              {certLoadSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {certLoadSuccess}
                </div>
              )}

              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Estudiante</label>
                  <select
                    value={certLoadStudentId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertLoadStudentId(val);
                      const st = students.find(s => s.id === val);
                      if (st) {
                        const newGrado = st.academicYear;
                        const newSection = st.section;
                        setCertLoadGrado(newGrado);
                        // Pre-fill: first try certified history, then compute from regular grades
                        const existingNotas: Record<string, { id_escala: number; value: string }> = {};
                        certHistorico
                          .filter((n: any) => (n.grado?.numero || n.id_grado) === newGrado)
                          .forEach((n: any) => {
                            const subId = String(n.id_asignatura);
                            const escala = n.escala;
                            const asig = n.asignatura;
                            const isCualitativa = asig?.tipo_calificacion === 'Cualitativo';
                            existingNotas[subId] = {
                              id_escala: escala?.id_escala || n.id_escala || 0,
                              value: isCualitativa
                                ? (escala?.ponderacion_letra || '')
                                : (escala?.nota_impresa || String(escala?.nota_calculo || ''))
                            };
                          });
                        // For subjects without certified grades, compute from regular system
                        const gradeSubs = getSubjectsForGrade(newGrado);
                        gradeSubs.forEach(planItem => {
                          if (!existingNotas[planItem.subjectId]) {
                            const finalGrade = calculateSubjectFinalGrade(grades, evaluationPlans, val, planItem.subjectId, newGrado, newSection);
                            if (finalGrade.raw > 0) {
                              const isCualitativa = planItem.tipoCalificacion === 'Cualitativo';
                              existingNotas[planItem.subjectId] = {
                                id_escala: isCualitativa ? mapLiteralToEscalaId(gradeToLiteral(finalGrade.rounded)) : mapScoreToEscalaId(finalGrade.rounded),
                                value: isCualitativa ? gradeToLiteral(finalGrade.rounded) : String(finalGrade.rounded)
                              };
                            }
                          }
                        });
                        setCertLoadNotas(existingNotas);
                      }
                    }}
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.lastName}, {s.firstName} — {s.cedula}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Institución de Origen</label>
                  <input
                    type="text"
                    value={certLoadInstitucion}
                    onChange={(e) => setCertLoadInstitucion(e.target.value)}
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subjects table for selected grade */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700">
                    Asignaturas del Plan de Estudio — {certLoadGrado}° Año
                  </h4>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-bold">
                      <th className="px-4 py-2.5">Asignatura</th>
                      <th className="px-4 py-2.5 text-center w-32">Tipo</th>
                      <th className="px-4 py-2.5 text-center w-40">Calificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(() => {
                      const gradeSubs = getSubjectsForGrade(certLoadGrado);
                      if (gradeSubs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={3} className="px-4 py-6 text-center text-slate-400 font-medium">
                              No hay asignaturas en el plan de estudio para {certLoadGrado}° Año.
                            </td>
                          </tr>
                        );
                      }
                      return gradeSubs.map(planItem => {
                        const isCualitativa = planItem.tipoCalificacion === 'Cualitativo';
                        const currentVal = certLoadNotas[planItem.subjectId]?.value || '';

                        return (
                          <tr key={planItem.subjectId} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {planItem.subjectName}
                              {planItem.codigo && (
                                <span className="ml-1.5 text-sm text-slate-400 font-mono">({planItem.codigo})</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-sm font-bold uppercase px-1.5 py-0.5 rounded ${
                                isCualitativa ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {isCualitativa ? 'Cualitativo' : 'Cuantitativo'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isCualitativa ? (
                                <select
                                  value={currentVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCertLoadNotas(prev => ({
                                      ...prev,
                                      [planItem.subjectId]: {
                                        id_escala: val ? mapLiteralToEscalaId(val) : 0,
                                        value: val,
                                      }
                                    }));
                                  }}
                                  className="text-sm p-2 bg-violet-50 border border-violet-200 rounded font-bold text-center w-20 focus:outline-hidden focus:border-violet-500"
                                >
                                  <option value="">--</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                </select>
                              ) : (
                                <input
                                  type="number"
                                  min={1}
                                  max={20}
                                  value={currentVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const num = Number(val);
                                    setCertLoadNotas(prev => ({
                                      ...prev,
                                      [planItem.subjectId]: {
                                        id_escala: val && !isNaN(num) ? mapScoreToEscalaId(num) : 0,
                                        value: val,
                                      }
                                    }));
                                  }}
                                  placeholder="1-20"
                                  className="text-sm p-2 bg-slate-50 border border-slate-200 rounded font-bold text-center w-20 font-mono focus:outline-hidden focus:border-amber-500"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setIsCertLoadModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors pointer-events-auto cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCertifiedGrades}
                disabled={certLoadSaving || !certLoadPeriodId}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
              >
                {certLoadSaving ? 'Guardando...' : 'Guardar Notas Certificadas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Audit Log Details */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Archivo de Calificaciones</h3>
              </div>
              <button 
                onClick={() => setSelectedAuditLog(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-4 grid grid-cols-2 gap-4 text-base bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                <div>
                  <span className="text-slate-500 text-sm font-semibold block">Asignatura</span>
                  <span className="font-bold text-slate-800">{selectedAuditLog.valores_nuevos?.asignatura}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-semibold block">Sección</span>
                  <span className="font-bold text-slate-800">{selectedAuditLog.valores_nuevos?.year}° Año "{selectedAuditLog.valores_nuevos?.section}"</span>
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-semibold block">Período</span>
                  <span className="font-bold text-slate-800">Lapso {selectedAuditLog.valores_nuevos?.lapso}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-sm font-semibold block">Fecha de Registro</span>
                  <span className="font-bold text-slate-800">{new Date(selectedAuditLog.fecha_hora).toLocaleString('es-VE')}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-base whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Estudiante</th>
                      {(() => {
                        const { evaluations } = (() => {
                          const planEvals = selectedAuditLog.valores_nuevos?.planEvaluaciones;
                          if (planEvals && planEvals.length > 0) {
                            return { evaluations: planEvals.map((e: any) => ({ id: e.id || e.name, name: e.name, percentage: e.percentage })) };
                          }
                          const det = selectedAuditLog.valores_nuevos?.detalles || [];
                          const evalsMap = new Map();
                          det.forEach((d: any) => {
                            const evKey = d.evaluationId || d.evaluationName;
                            if (!evalsMap.has(evKey)) {
                              evalsMap.set(evKey, { id: evKey, name: d.evaluationName, percentage: d.percentage });
                            }
                          });
                          return { evaluations: Array.from(evalsMap.values()) };
                        })();
                        return evaluations.map((ev: any, i: number) => (
                          <th key={i} className="py-3 px-4 text-center">
                            {ev.name} <span className="text-sm text-slate-400 block mt-0.5">({ev.percentage}%)</span>
                          </th>
                        ));
                      })()}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const det = selectedAuditLog.valores_nuevos?.detalles || [];
                      const planEvals = selectedAuditLog.valores_nuevos?.planEvaluaciones;
                      
                      const studentsMap = new Map();
                      det.forEach((d: any) => {
                        if (!studentsMap.has(d.studentName)) studentsMap.set(d.studentName, { name: d.studentName, grades: {} });
                        const evKey = d.evaluationId || d.evaluationName;
                        studentsMap.get(d.studentName).grades[evKey] = d.score;
                      });
                      
                      const evaluations = planEvals && planEvals.length > 0 
                        ? planEvals.map((e: any) => ({ id: e.id || e.name, name: e.name, percentage: e.percentage }))
                        : (() => {
                            const evalsMap = new Map();
                            det.forEach((d: any) => {
                               const evKey = d.evaluationId || d.evaluationName;
                               if (!evalsMap.has(evKey)) evalsMap.set(evKey, { id: evKey, name: d.evaluationName, percentage: d.percentage });
                            });
                            return Array.from(evalsMap.values());
                        })();

                      const students = Array.from(studentsMap.values());
                      
                      return students.map((std: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-slate-700">{std.name}</td>
                          {evaluations.map((ev: any, i: number) => {
                            const score = std.grades[ev.id];
                            return (
                              <td key={i} className="py-2.5 px-4 text-center">
                                {score !== undefined ? (
                                  <span className={`inline-block px-2 py-0.5 rounded text-sm font-bold font-mono ${
                                    score >= 10 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                    {String(score).padStart(2, '0')}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">--</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 bg-slate-800 text-white text-base font-semibold rounded-lg hover:bg-slate-900 transition-colors"
              >
                Cerrar Archivo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
