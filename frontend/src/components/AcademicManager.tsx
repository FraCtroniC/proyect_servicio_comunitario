/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ShieldAlert, Users, BookOpen, ChevronRight } from 'lucide-react';
import { Student, AcademicYear, UserRole, Section, SchoolPeriod, User, Classroom } from '../types';
import { Modal } from './Modal';

interface AcademicManagerProps {
  students: Student[];
  sections: Section[];
  periods: SchoolPeriod[];
  users: User[];
  currentUserRole: UserRole;
  onAddStudent: (std: Student) => void;
  onUpdateStudentStatus: (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => void;
  onCreateSection: (periodId: string, grade: number, letter: string, teacherGuideId: string, homeClassroomId: string) => Promise<Section>;
  classrooms: Classroom[];
}

export default function AcademicManager({
  students, sections, periods, users, classrooms, currentUserRole,
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

  const [viewGrade, setViewGrade] = useState<number>(0);

  const activePeriods = periods.filter(p => p.status === 'Activo' || p.status === 'Planificación');
  const docentes = users.filter(u => u.role === 'docente');

  const filteredSections = viewGrade === 0
    ? sections
    : sections.filter(s => s.grade === viewGrade);

  const groupedSections = filteredSections.reduce((acc, s) => {
    const key = s.grade;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<number, Section[]>);

  const getStudentCount = (sectionId: string) =>
    students.filter(s => s.academicYear === sections.find(sec => sec.id === sectionId)?.grade && s.section === sections.find(sec => sec.id === sectionId)?.letter).length;

  const getTeacherName = (teacherGuideId: string) =>
    users.find(u => u.teacherId === teacherGuideId || u.id === teacherGuideId)?.name || `Docente #${teacherGuideId}`;

  const getClassroom = (roomId: string) =>
    classrooms?.find(c => c.id === roomId);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');
    setSecLoading(true);

    if (!secPeriodo) { setSecError('Seleccione un periodo académico.'); setSecLoading(false); return; }
    if (!secDocente) { setSecError('Seleccione un docente guía.'); setSecLoading(false); return; }
    if (!secAula) { setSecError('Seleccione un Aula Base.'); setSecLoading(false); return; }

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
          Total: {sections.length} secciones
        </span>
      </div>

      <div id="academic-grid" className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Secciones Aperturadas</h3>
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
                onClick={() => setIsSectionModalOpen(true)}
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
                        <div key={s.id} className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
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
              {viewGrade === 0
                ? 'No hay secciones aperturadas. Use el botón "Aperturar Sección" para crear una nueva.'
                : `No hay secciones para ${viewGrade}° Año.`}
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

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Periodo Académico</label>
            <select
              value={secPeriodo}
              onChange={(e) => setSecPeriodo(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="">Seleccione un periodo</option>
              {activePeriods.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.status})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Grado / Año</label>
              <select
                value={secGrado}
                onChange={(e) => setSecGrado(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                {[1,2,3,4,5].map(g => (
                  <option key={g} value={g}>{g}° Año</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Letra</label>
              <select
                value={secLetra}
                onChange={(e) => setSecLetra(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                {['A','B','C','D','E','F'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Docente Guía</label>
              <select
                value={secDocente}
                onChange={(e) => setSecDocente(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value="">Seleccione un docente</option>
                {docentes.map(d => (
                  <option key={d.id} value={d.teacherId || d.id}>{d.name} {d.cedula ? `(${d.cedula})` : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Aula Base</label>
              <select
                value={secAula}
                onChange={(e) => setSecAula(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value="">Seleccione un aula</option>
                {classrooms?.filter(c => c.type === 'Teórica').map(c => {
                  const isTaken = sections.some(s => s.homeClassroomId === c.id);
                  return (
                    <option key={c.id} value={c.id} disabled={isTaken}>
                      {c.name} ({c.capacity} cap.) {isTaken ? '- Ya asignada' : ''}
                    </option>
                  );
                })}
              </select>
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

    </div>
  );
}
