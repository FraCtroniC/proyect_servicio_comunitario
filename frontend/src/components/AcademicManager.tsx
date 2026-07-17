/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ShieldAlert, Users, BookOpen, ChevronRight, X, GraduationCap, MapPin, UserCheck, FileText, FileSpreadsheet, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, AcademicYear, UserRole, Section, SchoolPeriod, User, Classroom, Docente } from '../types';
import { Modal } from './Modal';
import { SearchableSelect } from './SearchableSelect';
import { generateSectionsPDF } from '../utils/pdfGenerator';
import { exportSectionsToExcel } from '../utils/excelGenerator';

interface AcademicManagerProps {
  students: Student[];
  sections: Section[];
  periods: SchoolPeriod[];
  users: User[];
  docentes: Docente[];
  currentUserRole: UserRole;
  onAddStudent: (std: Student) => void;
  onUpdateStudentStatus: (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => void;
  onCreateSection: (periodId: string, grade: number, letter: string, teacherGuideId: string, homeClassroomId: string) => Promise<Section>;
  onUpdateSection?: (sectionId: string, data: { periodId?: string; grade?: number; letter?: string; teacherGuideId?: string; homeClassroomId?: string; capacityMax?: number }) => Promise<void>;
  onDeleteSection?: (sectionId: string) => Promise<void>;
  classrooms: Classroom[];
}

export default function AcademicManager({
  students, sections, periods, users, docentes, classrooms, currentUserRole,
  onAddStudent, onUpdateStudentStatus, onCreateSection, onUpdateSection, onDeleteSection
}: AcademicManagerProps) {
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const [secPeriodo, setSecPeriodo] = useState<string>('');
  const [secGrado, setSecGrado] = useState<number>(1);
  const [secLetra, setSecLetra] = useState<string>('A');
  const [secDocente, setSecDocente] = useState<string>('');
  const [secAula, setSecAula] = useState<string>('');
  const [secCapacidad, setSecCapacidad] = useState<number>(30);
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');
  const [secLoading, setSecLoading] = useState(false);
  const [secGradoError, setSecGradoError] = useState('');
  const [secLetraError, setSecLetraError] = useState('');

  const [viewGrade, setViewGrade] = useState<number>(0);
  const [viewPeriod, setViewPeriod] = useState<string>('active');
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const activePeriods = periods.filter(p => p.status === 'Activo' || p.status === 'Planificación');
  const activePeriod = periods.find(p => p.status === 'Activo');

  const filteredSections = sections.filter(s => {
    if (viewPeriod === 'active') {
      if (!activePeriod || s.periodId !== activePeriod.id) return false;
    } else if (viewPeriod !== 'all') {
      if (s.periodId !== viewPeriod) return false;
    }
    if (viewGrade !== 0 && s.grade !== viewGrade) return false;
    return true;
  });

  const groupedSections = filteredSections.reduce((acc, s) => {
    const key = s.grade;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<number, Section[]>);

  const getStudentCount = (sectionId: string) =>
    students.filter(s => s.academicYear === sections.find(sec => sec.id === sectionId)?.grade && s.section === sections.find(sec => sec.id === sectionId)?.letter).length;

  const getTeacherName = (teacherGuideId: string) => {
    const d = docentes.find(d => d.id === teacherGuideId);
    return d ? `${d.firstName} ${d.lastName}` : `Docente #${teacherGuideId}`;
  };

  const getTeacher = (teacherGuideId: string) =>
    docentes.find(d => d.id === teacherGuideId);

  const getClassroom = (roomId: string) =>
    classrooms?.find(c => c.id === roomId);

  const getPeriod = (periodId: string) =>
    periods.find(p => p.id === periodId);

  const checkDuplicate = (grado: number, letra: string, periodo: string) => {
    if (!periodo) { setSecGradoError(''); setSecLetraError(''); return; }
    const otherSections = editingSection ? sections.filter(s => s.id !== editingSection.id) : sections;
    const exists = otherSections.some(
      s => s.grade === grado && s.letter === letra && s.periodId === periodo
    );
    if (exists) {
      setSecGradoError('Ya existe una sección para este grado en el periodo seleccionado');
      setSecLetraError('Ya existe una sección con esta letra para este grado en el periodo seleccionado');
    } else {
      setSecGradoError('');
      setSecLetraError('');
    }
  };

  const resetForm = () => {
    setSecPeriodo('');
    setSecGrado(1);
    setSecLetra('A');
    setSecDocente('');
    setSecAula('');
    setSecCapacidad(30);
    setSecError('');
    setSecSuccess('');
    setSecGradoError('');
    setSecLetraError('');
  };

  const openCreateModal = () => {
    setEditingSection(null);
    resetForm();
    setIsSectionModalOpen(true);
  };

  const openEditModal = (section: Section) => {
    setEditingSection(section);
    setSecPeriodo(section.periodId);
    setSecGrado(section.grade);
    setSecLetra(section.letter);
    setSecDocente(section.teacherGuideId);
    setSecAula(section.homeClassroomId);
    setSecCapacidad(section.capacityMax || 30);
    setSecError('');
    setSecSuccess('');
    setSecGradoError('');
    setSecLetraError('');
    setIsSectionModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');
    setSecLoading(true);

    if (!secPeriodo) { setSecError('Seleccione un periodo académico.'); setSecLoading(false); return; }
    if (!secDocente) { setSecError('Seleccione un docente guía.'); setSecLoading(false); return; }
    if (!secAula) { setSecError('Seleccione un Aula Base.'); setSecLoading(false); return; }

    checkDuplicate(secGrado, secLetra, secPeriodo);
    if (secGradoError || secLetraError) { setSecLoading(false); return; }

    try {
      if (editingSection && onUpdateSection) {
        await onUpdateSection(editingSection.id, {
          periodId: secPeriodo,
          grade: secGrado,
          letter: secLetra,
          teacherGuideId: secDocente,
          homeClassroomId: secAula,
          capacityMax: secCapacidad,
        });
        setSecSuccess(`Sección ${secGrado}° "${secLetra}" actualizada exitosamente.`);
        toast.success('Sección actualizada correctamente');
      } else {
        await onCreateSection(secPeriodo, secGrado, secLetra, secDocente, secAula);
        setSecSuccess(`Sección ${secGrado}° "${secLetra}" creada exitosamente.`);
      }
      setTimeout(() => { setIsSectionModalOpen(false); setSecSuccess(''); setEditingSection(null); }, 2000);
    } catch (e: any) {
      setSecError(e.message || 'Error al guardar sección');
    } finally {
      setSecLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!sectionToDelete || !onDeleteSection) return;
    try {
      await onDeleteSection(sectionToDelete.id);
      toast.success(`Sección ${sectionToDelete.grade}° "${sectionToDelete.letter}" eliminada correctamente`);
      setIsDeleteModalOpen(false);
      setSectionToDelete(null);
    } catch (e: any) {
      toast.error(e.message || 'Error al eliminar sección');
    }
  };

  const handleGeneratePDF = () => {
    generateSectionsPDF(filteredSections, students, periods, docentes, classrooms);
    toast.success('PDF generado correctamente');
  };

  const handleGenerateExcel = async () => {
    await exportSectionsToExcel(filteredSections, students, periods, docentes, classrooms);
    toast.success('Excel generado correctamente');
  };

  const inputBase = "w-full text-sm p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden transition-colors";
  const inputNormal = `${inputBase} border-slate-200 focus:border-indigo-500`;
  const inputError = `${inputBase} border-rose-400 focus:border-rose-500`;

  return (
    <div id="academic-manager-container" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      <div id="academic-header" className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 id="academic-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            Gestión de Secciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">Administración de Secciones Activas por Grado y Periodo Escolar.</p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
          <span className="text-xs bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded">
            Total: {filteredSections.length} secciones
          </span>
          <button
            onClick={handleGeneratePDF}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border border-rose-200"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
          <button
            onClick={handleGenerateExcel}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border border-emerald-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel
          </button>
        </div>
      </div>

      <div id="academic-grid" className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">Secciones Aperturadas</h3>
              <div className="w-56">
                <SearchableSelect
                  value={viewPeriod}
                  onChange={(val) => setViewPeriod(val as string)}
                  options={[
                    { value: 'active', label: 'Periodo Actual' },
                    { value: 'all', label: 'Todos los Períodos' },
                    ...periods.map(p => ({
                      value: p.id,
                      label: `${p.name} (${p.status})`
                    }))
                  ]}
                />
              </div>
              <select
                value={viewGrade}
                onChange={(e) => setViewGrade(Number(e.target.value))}
                className="text-base p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value={0}>Todos los Años</option>
                {[1,2,3,4,5].map(g => (
                  <option key={g} value={g}>{g}° Año</option>
                ))}
              </select>
            </div>
            {['super_admin', 'control_estudios'].includes(currentUserRole) && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <Layers className="w-4 h-4" />
                Aperturar Sección
              </button>
            )}
          </div>
          
          {Object.keys(groupedSections).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(groupedSections).sort(([a], [b]) => Number(a) - Number(b)).map(([grade, secs]) => (
                <div key={grade} className="bg-slate-50/50 rounded-lg p-3">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">{grade}° Año</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {secs.sort((a, b) => a.letter.localeCompare(b.letter)).map(s => {
                      const aula = getClassroom(s.homeClassroomId);
                      const maxCupos = s.capacityMax || (aula ? aula.capacity : 0);
                      const ocupados = getStudentCount(s.id);
                      const isFull = maxCupos > 0 && ocupados >= maxCupos;
                      const canEdit = ['super_admin', 'control_estudios'].includes(currentUserRole);
                      return (
                        <div
                          key={s.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                          <div
                            onClick={() => setSelectedSection(s)}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-base font-black text-indigo-700">Sección "{s.letter}"</span>
                              {viewPeriod === 'all' && (
                                <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {periods.find(p => String(p.id) === String(s.periodId))?.name || 'Desconocido'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <Users className="h-3 w-3" />
                              <span>{ocupados} / {maxCupos || '?'} cupos</span>
                              <ChevronRight className="h-3 w-3" />
                              <span>{getTeacherName(s.teacherGuideId)}</span>
                            </div>
                            {aula && (
                               <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-sm font-bold text-slate-400">Aula Base: <span className="text-slate-700">{aula.name}</span></span>
                                  {isFull && <span className="text-sm text-rose-600 bg-rose-50 px-1 rounded font-bold">LLENO</span>}
                               </div>
                            )}
                          </div>
                          {canEdit && (
                            <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditModal(s); }}
                                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                title="Editar sección"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSectionToDelete(s); setIsDeleteModalOpen(true); }}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Eliminar sección"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              {viewGrade === 0 && viewPeriod === 'all'
                ? 'No hay secciones aperturadas. Use el botón "Aperturar Sección" para crear una nueva.'
                : `No hay secciones para los filtros seleccionados.`}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isSectionModalOpen} onClose={() => { setIsSectionModalOpen(false); setEditingSection(null); }} title={editingSection ? "Editar Sección" : "Aperturar Nueva Sección"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {secError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-sm">{secError}</div>
          )}
          {secSuccess && (
            <div className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-sm">{secSuccess}</div>
          )}

          <div className="space-y-0.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Periodo Académico</label>
            <select
              value={secPeriodo}
              onChange={(e) => {
                setSecPeriodo(e.target.value);
                checkDuplicate(secGrado, secLetra, e.target.value);
              }}
              className={inputNormal}
            >
              <option value="">Seleccione un periodo</option>
              {activePeriods.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.status})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Grado / Año</label>
              <select
                value={secGrado}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSecGrado(val);
                  checkDuplicate(val, secLetra, secPeriodo);
                }}
                onBlur={() => checkDuplicate(secGrado, secLetra, secPeriodo)}
                className={secGradoError ? inputError : inputNormal}
              >
                {[1,2,3,4,5].map(g => (
                  <option key={g} value={g}>{g}° Año</option>
                ))}
              </select>
              {secGradoError && <p className="text-rose-500 text-sm mt-1 font-semibold">{secGradoError}</p>}
            </div>
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Letra</label>
              <select
                value={secLetra}
                onChange={(e) => {
                  setSecLetra(e.target.value);
                  checkDuplicate(secGrado, e.target.value, secPeriodo);
                }}
                onBlur={() => checkDuplicate(secGrado, secLetra, secPeriodo)}
                className={secLetraError ? inputError : inputNormal}
              >
                {['A','B','C','D','E','F'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {secLetraError && <p className="text-rose-500 text-sm mt-1 font-semibold">{secLetraError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Docente Guía</label>
              <SearchableSelect
                options={docentes.map(d => ({ value: d.id, label: `${d.firstName} ${d.lastName} ${d.cedula ? `(${d.cedula})` : ''}` }))}
                value={secDocente}
                onChange={(val) => setSecDocente(String(val))}
                placeholder="Seleccione un docente"
              />
            </div>
            
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Aula Base</label>
              <SearchableSelect
                options={(classrooms || []).filter(c => c.type === 'Teórica').map(c => {
                  const isTaken = sections.some(s => s.homeClassroomId === c.id && s.id !== editingSection?.id);
                  return {
                    value: c.id,
                    label: `${c.name} (${c.capacity} cap.) ${isTaken ? '- Ya asignada' : ''}`,
                    disabled: isTaken
                  };
                })}
                value={secAula}
                onChange={(val) => setSecAula(String(val))}
                placeholder="Seleccione un aula"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Capacidad Máxima de Estudiantes</label>
            <input
              type="number"
              min={1}
              max={100}
              value={secCapacidad}
              onChange={(e) => setSecCapacidad(Number(e.target.value))}
              className={inputNormal}
              placeholder="Ej: 30"
            />
            <p className="text-xs text-slate-400 mt-0.5">Número máximo de estudiantes permitidos en esta sección.</p>
          </div>

          <button
            type="submit"
            disabled={secLoading}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-400 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
          >
            {secLoading ? (editingSection ? 'Guardando...' : 'Creando...') : (editingSection ? 'Guardar Cambios' : 'Aperturar Sección')}
          </button>
        </form>
      </Modal>

      {selectedSection && (
        <Modal isOpen={!!selectedSection} onClose={() => setSelectedSection(null)} title="Detalle de Sección">
          {(() => {
            const aula = getClassroom(selectedSection.homeClassroomId);
            const teacher = getTeacher(selectedSection.teacherGuideId);
            const period = getPeriod(selectedSection.periodId);
            const maxCupos = selectedSection.capacityMax || (aula ? aula.capacity : 0);
            const ocupados = getStudentCount(selectedSection.id);
            const isFull = maxCupos > 0 && ocupados >= maxCupos;

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="text-base font-black text-indigo-800">{selectedSection.grade}° Año - Sección "{selectedSection.letter}"</p>
                    <p className="text-xs text-indigo-500 font-medium">ID: {selectedSection.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Layers className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Periodo</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{period?.name || 'No definido'}</p>
                    <span className={`text-sm font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                      period?.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {period?.status || 'N/A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserCheck className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Docente Guía</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : `Docente #${selectedSection.teacherGuideId}`}
                    </p>
                    {teacher?.cedula && (
                      <p className="text-xs text-slate-500 mt-0.5">{teacher.cedula}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Aula Base</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{aula?.name || 'No asignada'}</p>
                    {aula && (
                      <p className="text-xs text-slate-500 mt-0.5">Capacidad del aula: {aula.capacity}</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">Estudiantes</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{ocupados} / {maxCupos || '?'} cupos</p>
                    {selectedSection.capacityMax && (
                      <p className="text-xs text-slate-500 mt-0.5">Cap. máxima definida: {selectedSection.capacityMax}</p>
                    )}
                    {isFull && (
                      <span className="text-sm text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">LLENO</span>
                    )}
                    {maxCupos > 0 && !isFull && (
                      <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${ocupados / maxCupos > 0.8 ? 'bg-amber-400' : 'bg-indigo-400'}`}
                          style={{ width: `${Math.min((ocupados / maxCupos) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            );
          })()}
        </Modal>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de eliminar la sección <span className="font-bold text-slate-800">{sectionToDelete?.grade}° Año "{sectionToDelete?.letter}"</span>?
          </p>
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
            Esta acción no se puede deshacer. Los estudiantes matriculados en esta sección no serán eliminados.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-base font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
