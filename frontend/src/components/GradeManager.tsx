/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Eye, Edit3, Award, FileText, CheckCircle, AlertTriangle, Printer, PlusCircle, Trash } from 'lucide-react';
import { Student, Subject, EvaluationPlan, Grade, AcademicYear, UserRole } from '../types';
import { calculateEvaluationAverage, calculateSubjectFinalGrade } from '../utils/gradeCalculations';
import { generateBoletinPDF } from '../utils/pdfGenerator';
import { exportGradesToExcel } from '../utils/excelGenerator';

interface GradeManagerProps {
  students: Student[];
  subjects: Subject[];
  evaluationPlans: EvaluationPlan[];
  grades: Grade[];
  auditLogs: any[];
  currentUserRole: UserRole;
  onUpdateGrade: (stdId: string, subId: string, lap: 1|2|3, evId: string, score: number) => void;
  onSaveGrades: (gradesToSave: Grade[], subjectName: string, year: number, section: string, lapso: number, detalles?: any[], planEvaluaciones?: any[]) => Promise<void>;
  onUpdateEvaluationPlan: (subId: string, year: AcademicYear, section: string, lap: 1|2|3, evaluations: any[]) => void;
}

export default function GradeManager({
  students,
  subjects,
  evaluationPlans,
  grades,
  auditLogs,
  currentUserRole,
  onUpdateGrade,
  onSaveGrades,
  onUpdateEvaluationPlan
}: GradeManagerProps) {
  // Navigation inside Grade Module
  const [activeSubTab, setActiveSubTab] = useState<'carga' | 'sabana' | 'boletin'>('carga');

  // Filters for Carga / Sábana
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(5);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(1);

  // Audit log modal state
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSavedPayload, setLastSavedPayload] = useState<string>('');

  // Audit logs pagination
  const [visibleAuditLogsCount, setVisibleAuditLogsCount] = useState(3);

  // Sync selectedSubjectId with loaded subjects
  useEffect(() => {
    if (subjects.length > 0 && (!selectedSubjectId || !subjects.find(s => s.id === selectedSubjectId))) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Boletín states
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  // Manual input control
  const [editingGradeCell, setEditingGradeCell] = useState<{ studentId: string; evaluationId: string } | null>(null);
  const [tempGradeValue, setTempGradeValue] = useState<string>('');

  // Evaluation Plan modify states
  const [isModifyingPlan, setIsModifyingPlan] = useState(false);
  const [planEvaluations, setPlanEvaluations] = useState<any[]>([]);

  const activePlan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && p.year === selectedYear && p.section === selectedSection && p.lapso === selectedLapso);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  const activeSectionStudents = students.filter(s => s.academicYear === selectedYear && s.section === selectedSection && s.status === 'Activo');

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

  const handleSavePlan = () => {
    const sum = planEvaluations.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);
    if (sum !== 100) {
      alert(`Error: La sumatoria de las ponderaciones debe ser exactamente el 100%. Actualmente suma ${sum}%.`);
      return;
    }
    if (planEvaluations.some(ev => !ev.percentage || ev.percentage <= 0)) {
      alert('Error: Todas las actividades deben tener un porcentaje mayor a 0%.');
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
    const scoreNum = Math.floor(Number(tempGradeValue));
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 20) {
      alert("Calificación inválida. El formato de notas reglamentario venezolano del MPPE exige un rango estricto de 1 a 20 puntos.");
      setEditingGradeCell(null);
      return;
    }
    
    onUpdateGrade(stdId, selectedSubjectId, selectedLapso, evId, scoreNum);
    
    if (moveToNext) {
      const currentIndex = activeSectionStudents.findIndex(s => s.id === stdId);
      if (currentIndex >= 0 && currentIndex < activeSectionStudents.length - 1) {
        const nextStudent = activeSectionStudents[currentIndex + 1];
        const nextScoreRecord = grades.find(g => g.studentId === nextStudent.id && g.subjectId === selectedSubjectId && g.lapso === selectedLapso && g.evaluationId === evId);
        
        setEditingGradeCell({ studentId: nextStudent.id, evaluationId: evId });
        setTempGradeValue(nextScoreRecord ? nextScoreRecord.score.toString() : '');
      } else {
        setEditingGradeCell(null); // Reached the end of the list
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
      alert("No hay calificaciones cargadas para guardar en este periodo.");
      return;
    }

    const currentPayload = JSON.stringify(gradesToSave);
    if (currentPayload === lastSavedPayload) {
      alert("No se detectaron cambios. Las calificaciones actuales ya se encuentran guardadas.");
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
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
      }, 2000); // Muestra el check por 2 segundos antes de cerrar
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al guardar las calificaciones.");
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
                <p className="text-sm text-slate-500 text-center mt-2">
                  Calificaciones guardadas exitosamente en la base de datos.
                </p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Guardando Calificaciones</h3>
                <p className="text-sm text-slate-500 text-center mt-2">
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
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
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
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
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
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            activeSubTab === 'boletin' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Boletín Informativo</span>
        </button>
      </div>

      {/**************** TAB 1: CARGA DE NOTAS ****************/}
      {activeSubTab === 'carga' && (
        <div id="tab-carga-container" className="space-y-6">
          
          {/* Filters Bar */}
          <div id="carga-filters-bar" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            
            <div id="filter-year-group" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Año de Educación Media</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value) as AcademicYear)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>

            <div id="filter-section-group" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Sección</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value="A">Sección "A"</option>
                <option value="B">Sección "B"</option>
              </select>
            </div>

            <div id="filter-subject-group" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Asignatura</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {subjects.filter(s => s.years.includes(selectedYear)).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div id="filter-lapso-group" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Período ("Lapso")</span>
              <select
                value={selectedLapso}
                onChange={(e) => setSelectedLapso(Number(e.target.value) as 1|2|3)}
                className="text-xs p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-bold"
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
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 text-xs rounded-lg flex items-center gap-1.5 pointer-events-auto cursor-pointer"
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
                <span className="text-xs font-bold text-amber-900">
                  🔧 Estructurando actividades para: {getSubjectName(selectedSubjectId)} ({selectedYear}° Año "{selectedSection}" - Lapso {selectedLapso})
                </span>
                <span className="text-[11px] font-semibold text-amber-700">Debe sumar exactamente 100%</span>
              </div>
              
              <div className="space-y-2.5 max-w-xl">
                {planEvaluations.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={ev.name} 
                      onChange={(e) => handleUpdatePlanName(idx, e.target.value)}
                      placeholder="Nombre de la actividad" 
                      className="text-xs p-2 bg-white border border-slate-200 rounded-lg flex-1 focus:outline-hidden"
                    />
                    <div className="flex items-center gap-1 shrink-0 w-28">
                      <input 
                        type="number" 
                        value={ev.percentage || ''} 
                        onChange={(e) => handleUpdatePlanWeight(idx, e.target.value)}
                        className="text-xs p-2 bg-white border border-slate-200 rounded-lg w-16 text-center focus:outline-hidden"
                      />
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    {planEvaluations.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePlanEvaluation(idx)} 
                        className="p-2 text-rose-500 hover:text-rose-700 pointer-events-auto cursor-pointer"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 justify-between items-center border-t border-amber-200/50 pt-3">
                  <div className="text-xs font-bold text-amber-800">
                    Total: <span className={planEvaluations.reduce((a, b) => a + b.percentage, 0) === 100 ? 'text-green-700' : 'text-rose-600'}>
                      {planEvaluations.reduce((a, b) => a + b.percentage, 0)}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {planEvaluations.length < 6 && (
                      <button 
                        type="button" 
                        onClick={handleAddPlanEvaluation}
                        className="text-xs py-1.5 px-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg pointer-events-auto cursor-pointer"
                      >
                        + Actividad
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => setIsModifyingPlan(false)}
                      className="text-xs py-1.5 px-3 bg-slate-200 text-slate-700 font-semibold rounded-lg pointer-events-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSavePlan}
                      className="text-xs py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg pointer-events-auto cursor-pointer"
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
                <h3 className="text-sm font-bold text-slate-800">Ingreso Manual de Calificaciones</h3>
                <p className="text-[11px] text-slate-400 font-medium">Haga clic sobre cualquier celda para cargar o editar la nota del 1 al 20.</p>
                {!activePlan && (
                  <div className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 p-2 border border-rose-200 rounded">
                    ⚠️ Esta asignatura no está asignada al plan de estudios de este año o no tiene evaluaciones configuradas. Ve a "Plan de Estudio" o usa "Configurar Plan de Evaluación".
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span> Insuficiente (1-9)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Mínima (10-14)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span> Sobresaliente (15-20)</span>
                </div>
                {['super_admin', 'control_estudios', 'docente'].includes(currentUserRole) && (
                  <button
                    onClick={handleGlobalSave}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 pointer-events-auto cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Guardar Calificaciones
                  </button>
                )}
              </div>
            </div>

            {/* Matrix Scroll wrapper */}
            <div id="grading-matrix-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold text-[9px]">
                    <th className="py-2.5">Estudiante</th>
                    {activePlan?.evaluations.map((ev, index) => (
                      <th key={ev.id} className="py-2.5 text-center px-4 max-w-[120px]">
                        <span className="block font-semibold text-slate-600 text-center truncate" title={ev.name}>{ev.name}</span>
                        <span className="block text-[10px] text-slate-400 font-bold font-mono text-center">{ev.percentage}%</span>
                      </th>
                    ))}
                    <th className="py-2.5 text-center font-bold text-slate-700">LAPSO RAW</th>
                    <th className="py-2.5 text-center font-bold text-slate-800">LAPSO REDONDEADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150/45 font-medium text-slate-700">
                  {activeSectionStudents.length > 0 ? (
                    activeSectionStudents.map(student => {
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
                            <span className="font-bold text-slate-800 text-[11px] block">{student.lastName}, {student.firstName}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold leading-none">{student.cedula}</span>
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
                                      className="w-12 text-center text-xs p-1 bg-white border-2 border-blue-500 rounded focus:outline-hidden font-bold"
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => handleSaveGrade(student.id, ev.id, true)}
                                      className="text-[11px] text-white bg-blue-600 px-1.5 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    id={`cell-btn-${student.id}-${ev.id}`}
                                    onClick={() => handleStartEditGrade(student.id, ev.id, scoreRecord?.score)}
                                    className={`px-3 py-1.5 rounded-md min-w-[44px] font-mono font-bold text-xs border text-center transition-all ${
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
                          <td className="py-3 text-center px-4 font-mono text-slate-500 text-xs font-bold">
                            {avgObj.raw > 0 ? avgObj.raw : '--'}
                          </td>
                          <td className="py-3 text-center px-4">
                            {avgObj.raw > 0 ? (
                              <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-black ${
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
          </div>

          {/* Historial de Modificaciones Card */}
          <div id="grades-history-box" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 mt-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-indigo-500" />
                Historial de Modificaciones (Auditoría)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
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
                            <span className="text-[11px] font-bold text-slate-800">Carga de Calificaciones Exitosa</span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {new Date(log.fecha_hora).toLocaleString('es-VE')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Se registraron y guardaron las notas para <strong>{log.valores_nuevos?.asignatura}</strong>, 
                            pertenecientes a {log.valores_nuevos?.year}° Año "{log.valores_nuevos?.section}" 
                            (Lapso {log.valores_nuevos?.lapso}).
                          </p>
                          {log.valores_nuevos?.detalles && (
                            <button
                              onClick={() => setSelectedAuditLog(log)}
                              className="mt-2 text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
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
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Ver más
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-lg">
                    <p className="text-xs font-semibold text-slate-400">Aún no hay registros de carga de calificaciones en base de datos.</p>
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
          
          {/* Selectors specifically for Saba */}
          <div id="sabana-controls" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            
            <div id="sabana-ctrl-year" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Año Académico</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value) as AcademicYear)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>

            <div id="sabana-ctrl-section" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Sección</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value="A">Sección "A"</option>
                <option value="B">Sección "B"</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 italic max-w-sm mt-3">
              Muestra el consolidado oficial de Lapsos 1, 2 y 3 para la asignatura de <strong>{getSubjectName(selectedSubjectId)}</strong>.
            </p>

            <button
              id="btn-print-sabana"
              onClick={() => window.print()}
              className="ml-auto py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Imprimir Formato MPPE</span>
            </button>
            <button
              onClick={() => exportGradesToExcel(students, subjects, grades, evaluationPlans, selectedYear, selectedSection)}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Excel (Sábana)
            </button>
          </div>

          {/* Sábana layout (Sheet style) */}
          <div id="printable-sabana" className="bg-white p-8 border border-slate-250 shadow-md rounded-xl space-y-8 select-text selection:bg-slate-100">
            
            {/* Header matching venezuelan public layouts */}
            <div id="sabana-gov-header" className="flex justify-between items-start text-[10px] text-slate-600 font-medium">
              <div id="gov-dep" className="space-y-0.5">
                <span className="block font-bold text-slate-800 uppercase text-[11px]">República Bolivariana de Venezuela</span>
                <span className="block">Ministerio del Poder Popular para la Educación</span>
                <span className="block">Liceo Bolivariano "José Antonio Anzoátegui"</span>
                <span className="block font-mono">Código MPPE: #EM-77218320</span>
              </div>
              <div id="rep-stamp-box" className="border-2 border-slate-800 rounded p-1 text-center font-bold px-3">
                REGISTRO DE CONTROL DE ESTUDIOS
              </div>
            </div>

            {/* Title description of sheet */}
            <div id="sabana-sheet-title" className="text-center font-black text-xs space-y-1 text-slate-900 uppercase">
              <h4>ACTA INTEGRAL DE EVALUACIONES CONTINUAS ("SÁBANA DE NOTAS")</h4>
              <p className="text-[11px] font-semibold text-slate-500 font-mono">
                Año Escolar: 2025-2026 | {selectedYear}° Año EMG - Sección "{selectedSection}" | Asignatura: {getSubjectName(selectedSubjectId)?.toUpperCase() || ''}
              </p>
            </div>

            {/* Sheet Matrix */}
            <div id="sabana-matrix-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 font-bold text-slate-800 text-[10px]">
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
                  {activeSectionStudents.length > 0 ? (
                    activeSectionStudents.map((student, idx) => {
                      // Get L1 Average
                      const l1Plan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && p.year === selectedYear && p.section === selectedSection && p.lapso === 1);
                      const l1Avg = l1Plan ? calculateEvaluationAverage(grades, l1Plan.evaluations, student.id, selectedSubjectId, 1) : { rounded: 0, raw: 0 };

                      // Get L2 Average
                      const l2Plan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && p.year === selectedYear && p.section === selectedSection && p.lapso === 2);
                      const l2Avg = l2Plan ? calculateEvaluationAverage(grades, l2Plan.evaluations, student.id, selectedSubjectId, 2) : { rounded: 0, raw: 0 };

                      // Get L3 Average
                      const l3Plan = evaluationPlans.find(p => p.subjectId === selectedSubjectId && p.year === selectedYear && p.section === selectedSection && p.lapso === 3);
                      const l3Avg = l3Plan ? calculateEvaluationAverage(grades, l3Plan.evaluations, student.id, selectedSubjectId, 3) : { rounded: 0, raw: 0 };

                      // Calculate final rounded score
                      const finalGrade = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, selectedSubjectId);

                      return (
                        <tr id={`sab-row-${student.id}`} key={student.id} className="hover:bg-slate-50/20 text-[11px]">
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono">{idx + 1}</td>
                          <td className="p-2 border border-slate-300 font-mono font-bold text-slate-900">{student.cedula}</td>
                          <td className="p-2 border border-slate-300">
                            <span className="font-extrabold uppercase text-slate-800">{student.lastName}</span>, {student.firstName}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {l1Avg.raw > 0 ? String(l1Avg.rounded).padStart(2, '0') : '--'}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {l2Avg.raw > 0 ? String(l2Avg.rounded).padStart(2, '0') : '--'}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold font-mono bg-blue-50/10">
                            {l3Avg.raw > 0 ? String(l3Avg.rounded).padStart(2, '0') : '--'}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-extrabold font-mono bg-blue-50/50 text-[12px] text-blue-900">
                            {finalGrade.raw > 0 ? String(finalGrade.rounded).padStart(2, '0') : '--'}
                          </td>
                          <td className="p-2 border border-slate-300 text-center">
                            {finalGrade.raw > 0 ? (
                              finalGrade.rounded >= 10 ? (
                                <span className="text-green-700 font-bold uppercase text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Aprobado</span>
                              ) : (
                                <span className="text-rose-700 font-bold uppercase text-[9px] bg-rose-50 px-1.5 py-0.5 rounded">A Aplazar / Reprobado</span>
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
            <div id="regulatory-signatures" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-[10px] text-slate-600 font-medium">
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
              <span className="text-[9px] font-bold text-slate-400 uppercase">Seleccione Alumno Matriculado</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.academicYear}° Año "{s.section}"] - {s.lastName}, {s.firstName} ({s.cedula})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[11px] text-slate-400 italic max-w-xs mt-3">
              Genera la boleta acumulativa del período corriente. Las calificaciones en actas ya se entregan debidamente redondeadas.
            </p>

            <button
              id="btn-print-boletin"
              onClick={() => window.print()}
              className="ml-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
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
                  <div className="text-[10px] text-slate-600 space-y-0.5 leading-normal">
                    <span className="block font-bold text-slate-800 uppercase text-[11px]">Liceo Bolivariano "José Antonio Anzoátegui"</span>
                    <span className="block">Ministerio del Poder Popular para la Educación</span>
                    <span className="block italic">Estado Anzoátegui, Venezuela</span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    <span className="block">Boleta de Notas Acumulada</span>
                    <span className="block">Año Escolar: <strong>2025 - 2026</strong></span>
                  </div>
                </div>

                {/* Participant Ficha detail cards */}
                <div id="boletin-student-ficha" className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Estudiante</span>
                      <span className="text-[12px] font-bold text-indigo-900 uppercase">{student.lastName}, {student.firstName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Cédula de Identidad</span>
                        <span className="font-mono font-bold text-slate-805">{student.cedula}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Año / Sección Matrícula</span>
                        <span className="text-slate-805">{student.academicYear}° Año de Educación Media - "{student.section}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Propietario / Representante Legal (LOPNA)</span>
                      <span className="text-slate-900 font-bold">{student.representativeName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Cédula Rep.</span>
                        <span className="font-mono">{student.representativeCedula}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Teléfono de Enlace</span>
                        <span className="font-mono">{student.representativePhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects evaluation transcript table */}
                <div id="boletin-grades-box" className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-50 font-bold text-slate-800 border-b border-slate-300 text-[9px] uppercase tracking-wider">
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

                        const finalScore = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id);

                        return (
                          <tr id={`bol-sub-${sub.id}`} key={sub.id} className="hover:bg-slate-50/20 text-[11px]">
                            <td className="p-2.5 border border-slate-300 font-bold text-slate-800">{sub.name}</td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {l1Avg.raw > 0 ? String(l1Avg.rounded).padStart(2, '0') : '--'}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {l2Avg.raw > 0 ? String(l2Avg.rounded).padStart(2, '0') : '--'}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-mono">
                              {l3Avg.raw > 0 ? String(l3Avg.rounded).padStart(2, '0') : '--'}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center font-extrabold font-mono bg-blue-50/50 text-[11px] text-blue-950">
                              {finalScore.raw > 0 ? String(finalScore.rounded).padStart(2, '0') : '--'}
                            </td>
                            <td className="p-2.5 border border-slate-300 text-center">
                              {finalScore.raw > 0 ? (
                                finalScore.rounded >= 10 ? (
                                  <span className="text-green-700 font-bold uppercase text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Aprobado (AP)</span>
                                ) : (
                                  <span className="text-rose-700 font-bold uppercase text-[9px] bg-rose-50 px-1.5 py-0.5 rounded">Materia Pendiente</span>
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
                <div id="boletin-legal-footer" className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 text-[10px] text-slate-500 leading-relaxed text-justify space-y-1">
                  <strong>Marco Legal Normativo:</strong>
                  <p>
                    De acuerdo con el Artículo 108 del Reglamento General de la Ley Orgánica de Educación (RLOE), las notas de lapso definitivas se expresan en números enteros con redondeo favorable al estudiante a partir de las fracciones iguales o mayores de 0.50. 
                    En concordancia con los principios de la LOPNA, esta información es estrictamente confidencial para uso exclusivo del alumno y su representante legal.
                  </p>
                </div>

                {/* Sign and stamp blocks */}
                <div id="boletin-signatures" className="grid grid-cols-3 gap-6 pt-10 text-[9px] text-slate-600 font-semibold text-center uppercase tracking-wide">
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

      {/* Modal for Audit Log Details */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
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
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                <div>
                  <span className="text-slate-500 text-xs font-semibold block">Asignatura</span>
                  <span className="font-bold text-slate-800">{selectedAuditLog.valores_nuevos?.asignatura}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold block">Sección</span>
                  <span className="font-bold text-slate-800">{selectedAuditLog.valores_nuevos?.year}° Año "{selectedAuditLog.valores_nuevos?.section}"</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold block">Período</span>
                  <span className="font-bold text-slate-800">Lapso {selectedAuditLog.valores_nuevos?.lapso}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold block">Fecha de Registro</span>
                  <span className="font-bold text-slate-800">{new Date(selectedAuditLog.fecha_hora).toLocaleString('es-VE')}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
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
                            {ev.name} <span className="text-[9px] text-slate-400 block mt-0.5">({ev.percentage}%)</span>
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
                                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-mono ${
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
                className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors"
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
