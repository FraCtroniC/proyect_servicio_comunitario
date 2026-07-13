/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ShieldAlert, Users, BookOpen, ChevronRight, X, GraduationCap, MapPin, UserCheck } from 'lucide-react';
import { Student, AcademicYear, UserRole, Section, SchoolPeriod, User, Classroom, Docente } from '../types';
import { Modal } from './Modal';
import { SearchableSelect } from './SearchableSelect';

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
  classrooms: Classroom[];
}

export default function AcademicManager({
  students, sections, periods, users, docentes, classrooms, currentUserRole,
  onAddStudent, onUpdateStudentStatus, onCreateSection
}: AcademicManagerProps) {
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  const [secPeriodo, setSecPeriodo] = useState<string>('');
  const [secGrado, setSecGrado] = useState<number>(1);
  const [secLetra, setSecLetra] = useState<string>('A');
  const [secDocente, setSecDocente] = useState<string>('');
  const [secAula, setSecAula] = useState<string>('');
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
    const exists = sections.some(
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

  const handleCreateSection = async (e: React.FormEvent) => {
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
      await onCreateSection(secPeriodo, secGrado, secLetra, secDocente, secAula);
      setSecSuccess(`Sección ${secGrado}° "${secLetra}" creada exitosamente.`);
      setTimeout(() => { setIsSectionModalOpen(false); setSecSuccess(''); }, 2000);
    } catch (e: any) {
      setSecError(e.message || 'Error al crear sección');
    } finally {
      setSecLoading(false);
    }
  };

  const openCreateModal = () => {
    setSecPeriodo('');
    setSecGrado(1);
    setSecLetra('A');
    setSecDocente('');
    setSecAula('');
    setSecError('');
    setSecSuccess('');
    setSecGradoError('');
    setSecLetraError('');
    setIsSectionModalOpen(true);
  };

  const inputBase = "w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden transition-colors";
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
          <p className="text-xs text-slate-500 mt-1">Administración de Secciones Activas por Grado y Periodo Escolar.</p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded mt-2 md:mt-0">
          Total: {filteredSections.length} secciones
        </span>
      </div>

      <div id="academic-grid" className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Secciones Aperturadas</h3>
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
                className="text-[10px] p-1.5 bg-slate-50 border border-slate-200 rounded font-bold"
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
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
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
                  <h4 className="text-xs font-bold text-slate-700 mb-2">{grade}° Año</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {secs.map(s => {
                      const aula = getClassroom(s.homeClassroomId);
                      const cupos = aula ? aula.capacity : 0;
                      const ocupados = getStudentCount(s.id);
                      const isFull = cupos > 0 && ocupados >= cupos;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSection(s)}
                          className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                          <div>
                            <span className="text-sm font-black text-indigo-700">Sección "{s.letter}"</span>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                              <Users className="h-3 w-3" />
                              <span>{ocupados} / {cupos || '?'} cupos</span>
                              <ChevronRight className="h-3 w-3" />
                              <span>{getTeacherName(s.teacherGuideId)}</span>
                            </div>
                            {aula && (
                               <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-slate-400">Aula Base: <span className="text-slate-700">{aula.name}</span></span>
                                  {isFull && <span className="text-[9px] text-rose-600 bg-rose-50 px-1 rounded font-bold">LLENO</span>}
                               </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              {viewGrade === 0 && viewPeriod === 'all'
                ? 'No hay secciones aperturadas. Use el botón "Aperturar Sección" para crear una nueva.'
                : `No hay secciones para los filtros seleccionados.`}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Aperturar Nueva Sección">
        <form onSubmit={handleCreateSection} className="space-y-4">
          {secError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-[11px]">{secError}</div>
          )}
          {secSuccess && (
            <div className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-[11px]">{secSuccess}</div>
          )}

          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Periodo Académico</label>
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
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Grado / Año</label>
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
              {secGradoError && <p className="text-rose-500 text-xs mt-1 font-semibold">{secGradoError}</p>}
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Letra</label>
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
              {secLetraError && <p className="text-rose-500 text-xs mt-1 font-semibold">{secLetraError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Docente Guía</label>
              <SearchableSelect
                options={docentes.map(d => ({ value: d.id, label: `${d.firstName} ${d.lastName} ${d.cedula ? `(${d.cedula})` : ''}` }))}
                value={secDocente}
                onChange={(val) => setSecDocente(String(val))}
                placeholder="Seleccione un docente"
              />
            </div>
            
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Aula Base</label>
              <SearchableSelect
                options={(classrooms || []).filter(c => c.type === 'Teórica').map(c => {
                  const isTaken = sections.some(s => s.homeClassroomId === c.id);
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

          <button
            type="submit"
            disabled={secLoading}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
          >
            {secLoading ? 'Creando...' : 'Aperturar Sección'}
          </button>
        </form>
      </Modal>

      {selectedSection && (
        <Modal isOpen={!!selectedSection} onClose={() => setSelectedSection(null)} title="Detalle de Sección">
          {(() => {
            const aula = getClassroom(selectedSection.homeClassroomId);
            const teacher = getTeacher(selectedSection.teacherGuideId);
            const period = getPeriod(selectedSection.periodId);
            const ocupados = getStudentCount(selectedSection.id);
            const cupos = aula ? aula.capacity : 0;
            const isFull = cupos > 0 && ocupados >= cupos;

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="text-sm font-black text-indigo-800">{selectedSection.grade}° Año - Sección "{selectedSection.letter}"</p>
                    <p className="text-[10px] text-indigo-500 font-medium">ID: {selectedSection.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Layers className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Periodo</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{period?.name || 'No definido'}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                      period?.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {period?.status || 'N/A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserCheck className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Docente Guía</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : `Docente #${selectedSection.teacherGuideId}`}
                    </p>
                    {teacher?.cedula && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{teacher.cedula}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Aula Base</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{aula?.name || 'No asignada'}</p>
                    {aula && (
                      <p className="text-[10px] text-slate-500 mt-0.5">Capacidad: {aula.capacity}</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Estudiantes</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{ocupados} / {cupos || '?'} cupos</p>
                    {isFull && (
                      <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">LLENO</span>
                    )}
                    {cupos > 0 && !isFull && (
                      <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${ocupados / cupos > 0.8 ? 'bg-amber-400' : 'bg-indigo-400'}`}
                          style={{ width: `${Math.min((ocupados / cupos) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            );
          })()}
        </Modal>
      )}

    </div>
  );
}
