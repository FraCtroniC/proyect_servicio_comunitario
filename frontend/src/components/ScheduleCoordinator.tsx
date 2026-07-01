/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Trash, AlertTriangle, CheckCircle, PlusCircle, ShieldAlert, Filter, Edit2, XCircle, User as UserIcon, MapPin, BookOpen, Trash2 } from 'lucide-react';
import { ScheduleEvent, AcademicYear, Subject, User, Classroom, UserRole, Section, Docente } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { Modal } from './Modal';

interface ScheduleCoordinatorProps {
  scheduleEvents: ScheduleEvent[];
  subjects: Subject[];
  users: User[];
  docentes: Docente[];
  classrooms: Classroom[];
  sections: Section[];
  referenceData: { dias: any[]; bloques: any[] };
  currentUserRole: UserRole;
  onAddScheduleEvent: (evt: ScheduleEvent) => void;
  onUpdateScheduleEvent?: (evtId: string, evt: Partial<ScheduleEvent>) => void;
  onRemoveScheduleEvent: (evtId: string) => void;
}

export default function ScheduleCoordinator({
  scheduleEvents,
  subjects,
  users,
  docentes,
  classrooms,
  sections,
  referenceData,
  currentUserRole,
  onAddScheduleEvent,
  onUpdateScheduleEvent,
  onRemoveScheduleEvent
}: ScheduleCoordinatorProps) {
  // Filters to display current schedules
  const [filterType, setFilterType] = useState<'section' | 'teacher' | 'classroom'>('section');
  const [filterYear, setFilterYear] = useState<AcademicYear>(5);
  const [filterSection, setFilterSection] = useState<string>('A');
  const [filterTeacherId, setFilterTeacherId] = useState<string>('t-1');
  const [filterClassroomId, setFilterClassroomId] = useState<string>('rm-201');

  // Input states for assigning a block
  const [formDay, setFormDay] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes'>('Lunes');
  const [formBlock, setFormBlock] = useState<string>('');
  const [formYear, setFormYear] = useState<AcademicYear>(1);
  const [formSection, setFormSection] = useState<string>('');
  const [formSubjectId, setFormSubjectId] = useState<string>('');
  const [formTeacherId, setFormTeacherId] = useState<string>('');
  const [formClassroomId, setFormClassroomId] = useState<string>('');

  // Warning/Conflict reporting
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState('');

  // Editing state
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  // Static timeblocks structured for the grid rendering
  const timeBlocks = [
    { label: 'Bloque 1', time: '07:00 - 07:45', isRecess: false },
    { label: 'Bloque 2', time: '07:45 - 08:30', isRecess: false },
    { label: 'Receso Corto', time: '08:30 - 08:45', isRecess: true },
    { label: 'Bloque 3', time: '08:45 - 09:30', isRecess: false },
    { label: 'Bloque 4', time: '09:30 - 10:15', isRecess: false },
    { label: 'Receso Largo', time: '10:15 - 10:30', isRecess: true },
    { label: 'Bloque 5', time: '10:30 - 11:15', isRecess: false },
    { label: 'Bloque 6', time: '11:15 - 12:00', isRecess: false }
  ];

  const days: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes')[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ScheduleEvent | null>(null);

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
  const getTeacherName = (id: string) => {
    const doc = docentes.find(d => d.id === id);
    return doc ? `${doc.firstName} ${doc.lastName}` : id;
  };
  const getClassroomName = (id: string) => classrooms.find(c => c.id === id)?.name || id;

  const handleEditClick = (evt: ScheduleEvent) => {
    setFormDay(evt.day);
    setFormBlock(evt.timeBlock);
    setFormYear(evt.year);
    setFormSection(evt.section);
    setFormSubjectId(evt.subjectId);
    setFormTeacherId(evt.teacherId);
    setFormClassroomId(evt.classroomId);
    setEditingEvent(evt.id);
    setScheduleError('');
    setScheduleSuccess('');
    
    // Scroll to top where the form is (mobile friendly)
    document.getElementById('schedule-coordinator-root')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setFormBlock('');
    setFormSubjectId('');
    setFormTeacherId('');
    setFormClassroomId('');
    setScheduleError('');
    setScheduleSuccess('');
  };

  const handleAssignBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError('');
    setScheduleSuccess('');

    if (!formBlock || !formSection || !formSubjectId || !formTeacherId || !formClassroomId) {
      setScheduleError('Debes completar todos los campos antes de asignar un bloque horario.');
      return;
    }

    // --- CONFLICT RESOLUTION ALGORITHM (Strict overlap validation) ---
    // Ignore the event currently being edited
    const otherEvents = scheduleEvents.filter(e => e.id !== editingEvent);

    // 1. Teacher Double-Booking conflict
    const teacherConflict = otherEvents.find(
      e => e.day === formDay && 
           e.timeBlock === formBlock && 
           e.teacherId === formTeacherId
    );
    if (teacherConflict) {
      setScheduleError(
        `Conflicto Docente: El docente ${getTeacherName(formTeacherId)} ya se encuentra asignado a ${teacherConflict.year}° Año "${teacherConflict.section}" en este mismo bloque (${formDay} ${formBlock}).`
      );
      return;
    }

    // 2. Classroom Double-Booking conflict
    const classroomConflict = otherEvents.find(
      e => e.day === formDay && 
           e.timeBlock === formBlock && 
           e.classroomId === formClassroomId
    );
    if (classroomConflict) {
      setScheduleError(
        `Conflicto Aula: El Aula/Espacio "${getClassroomName(formClassroomId)}" ya ha sido reservado para ${classroomConflict.year}° Año "${classroomConflict.section}" en este mismo bloque (${formDay} ${formBlock}).`
      );
      return;
    }

    // 3. Students Double-Booking conflict
    const sectionConflict = otherEvents.find(
      e => e.day === formDay && 
           e.timeBlock === formBlock && 
           e.year === formYear && 
           e.section === formSection
    );
    if (sectionConflict) {
      setScheduleError(
        `Conflicto Planificación: Los estudiantes de ${formYear}° Año "${formSection}" ya tienen asignada la clase de [${getSubjectName(sectionConflict.subjectId)}] durante este periodo.`
      );
      return;
    }

    // Capture capacity limits check of classrooms
    const classroomObj = classrooms.find(c => c.id === formClassroomId);
    if (classroomObj && classroomObj.capacity < 25 && formYear === 5) {
      // Just a smart visual alert (warning only, but let write pass or reject if lab is really small)
      console.log("Capacity Warning. Classroom capacity is low.");
    }

    // Create Schedule item
    const newEvent: ScheduleEvent = {
      id: editingEvent || ('ev-' + Date.now()),
      day: formDay,
      timeBlock: formBlock,
      year: formYear,
      section: formSection,
      subjectId: formSubjectId,
      teacherId: formTeacherId,
      classroomId: formClassroomId
    };

    if (editingEvent && onUpdateScheduleEvent) {
      onUpdateScheduleEvent(editingEvent, newEvent);
      setScheduleSuccess(`Bloque actualizado con éxito: ${getSubjectName(formSubjectId)} planificado el día ${formDay} (${formBlock}).`);
      setEditingEvent(null);
    } else {
      onAddScheduleEvent(newEvent);
      setScheduleSuccess(`Bloque asignado con éxito: ${getSubjectName(formSubjectId)} planificado el día ${formDay} (${formBlock}).`);
    }
  };

  // Filter events based on active visual mode selection
  const visibleEvents = scheduleEvents.filter(evt => {
    if (filterType === 'section') {
      return evt.year === filterYear && evt.section === filterSection;
    } else if (filterType === 'teacher') {
      return evt.teacherId === filterTeacherId;
    } else {
      return evt.classroomId === filterClassroomId;
    }
  });

  return (
    <div id="schedule-coordinator-root" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title */}
      <div id="schedule-header" className="border-b border-slate-100 pb-4">
        <h1 id="schedule-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-600" />
          Planificación y Distribución Horaria Escolar
        </h1>
        <p className="text-xs text-slate-500 mt-1">Definición de asignaturas, auditorías de solapamientos para docentes, y designación de planta física.</p>
      </div>

      {/* Main interactive area: Grid + Side assign form */}
      <div id="schedule-grid-layout" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Drag & Drop emulator entry form */}
        <div id="assignment-form-card" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <div id="form-header" className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {editingEvent ? (
                <>
                  <Edit2 className="h-4.5 w-4.5 text-indigo-600" />
                  Editar Bloque Académico
                </>
              ) : (
                <>
                  <PlusCircle className="h-4.5 w-4.5 text-indigo-600" />
                  Asignar Bloque Académico
                </>
              )}
            </h3>
            {editingEvent && (
              <button onClick={handleCancelEdit} type="button" className="text-slate-400 hover:text-slate-600 cursor-pointer pointer-events-auto" title="Cancelar Edición">
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
            <div id="schedule-form-locked" className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <p className="font-bold">Acceso Académico Restringido</p>
              <p className="leading-relaxed">
                Su rol simulado no posee potestad para alterar la planificación de planta física o designar profesores. 
                Utilice la pestaña "Usuarios" arriba para asumir el rol de <strong>Director</strong> o <strong>Control de Estudios</strong>.
              </p>
            </div>
          ) : (
            <form id="schedule-block-form" onSubmit={handleAssignBlock} className="space-y-3">
              {scheduleError && (
                <div id="schedule-error" className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-[11px] leading-relaxed flex items-start gap-1">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{scheduleError}</span>
                </div>
              )}
              {scheduleSuccess && (
                <div id="schedule-success" className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-[11px] leading-relaxed flex items-start gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{scheduleSuccess}</span>
                </div>
              )}

              {/* Day / Time Select */}
              <div id="block-form-day-time" className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Día</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded font-medium"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bloque Horario</label>
                  <select
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    {timeBlocks.filter(b => !b.isRecess).map(b => (
                      <option key={b.time} value={b.time}>{b.time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* School Year Section Select */}
              <div id="block-form-cohort" className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Año EMG</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value) as AcademicYear)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded font-medium"
                  >
                    <option value={1}>1er Año</option>
                    <option value={2}>2do Año</option>
                    <option value={3}>3er Año</option>
                    <option value={4}>4to Año</option>
                    <option value={5}>5to Año</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sección</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    {sections
                      .filter(s => s.grade === formYear)
                      .sort((a, b) => a.letter.localeCompare(b.letter))
                      .map(s => (
                        <option key={`${s.grade}-${s.letter}`} value={s.letter}>
                          Sección "{s.letter}"
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div id="block-form-sub" className="space-y-0.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Asignatura</label>
                <SearchableSelect
                  options={subjects.filter(s => s.years.includes(formYear)).map(s => ({ value: s.id, label: s.name }))}
                  value={formSubjectId}
                  onChange={(val) => setFormSubjectId(String(val))}
                  placeholder="Seleccionar..."
                />
              </div>

              {/* Teacher */}
              <div id="block-form-teach" className="space-y-0.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Docente Responsable</label>
                <SearchableSelect
                  options={docentes.filter(d => d.status === 'Activo').map(d => ({ value: d.id, label: `${d.firstName} ${d.lastName}` }))}
                  value={formTeacherId}
                  onChange={(val) => setFormTeacherId(String(val))}
                  placeholder="Seleccionar..."
                />
              </div>

              {/* Classroom */}
              <div id="block-form-room" className="space-y-0.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Salón / Aula Física</label>
                <SearchableSelect
                  options={classrooms.map(c => ({ value: c.id, label: `${c.name} (Cap. ${c.capacity})` }))}
                  value={formClassroomId}
                  onChange={(val) => setFormClassroomId(String(val))}
                  placeholder="Seleccionar..."
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 ${editingEvent ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-700 hover:bg-indigo-800'} text-white font-bold text-xs rounded-lg transition-colors pointer-events-auto cursor-pointer flex items-center justify-center gap-1`}
              >
                <span>{editingEvent ? 'Guardar Cambios y Verificar Overlaps' : 'Asignar y Verificar Overlaps'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Right Side: Main Schedule Calendar Matrix Grid (col-span-3) */}
        <div id="schedule-calendar-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 lg:col-span-3 space-y-4">
          
          {/* Calendar Display filter selectors */}
          <div id="calendar-header-filter" className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                Filtrar Vista del Calendario
              </h3>
            </div>
            
            <div id="view-type-select-group" className="flex flex-wrap gap-2">
              <button
                id="view-flt-sec"
                onClick={() => setFilterType('section')}
                className={`text-[11px] font-bold leading-none py-1.5 px-3 rounded-full transition-all pointer-events-auto cursor-pointer ${
                  filterType === 'section' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Por Año & Sección
              </button>
              <button
                id="view-flt-teach"
                onClick={() => setFilterType('teacher')}
                className={`text-[11px] font-bold leading-none py-1.5 px-3 rounded-full transition-all pointer-events-auto cursor-pointer ${
                  filterType === 'teacher' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Por Profesor
              </button>
              <button
                id="view-flt-room"
                onClick={() => setFilterType('classroom')}
                className={`text-[11px] font-bold leading-none py-1.5 px-3 rounded-full transition-all pointer-events-auto cursor-pointer ${
                  filterType === 'classroom' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Por Salón
              </button>
            </div>
          </div>

          {/* Sub filter based on choice */}
          <div id="calendar-subfilters" className="flex gap-2 bg-slate-50 p-2.5 rounded-lg text-xs font-semibold">
            {filterType === 'section' && (
              <div id="subflt-box-sec" className="flex items-center gap-2">
                <span className="text-slate-400">Ver Calendario de:</span>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(Number(e.target.value) as AcademicYear)}
                  className="bg-white border rounded p-1 font-bold focus:outline-hidden"
                >
                  <option value={1}>1er Año</option>
                  <option value={2}>2do Año</option>
                  <option value={3}>3er Año</option>
                  <option value={4}>4to Año</option>
                  <option value={5}>5to Año</option>
                </select>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="bg-white border rounded p-1 font-bold focus:outline-hidden"
                >
                  {sections
                    .filter(s => s.grade === filterYear)
                    .sort((a, b) => a.letter.localeCompare(b.letter))
                    .map(s => (
                      <option key={`${s.grade}-${s.letter}`} value={s.letter}>
                        Sección "{s.letter}"
                      </option>
                    ))}
                </select>
              </div>
            )}

            {filterType === 'teacher' && (
              <div id="subflt-box-teach" className="flex items-center gap-2">
                <span className="text-slate-400">Ver Carga del Profesor:</span>
                <SearchableSelect
                  options={docentes.filter(d => d.status === 'Activo').map(d => ({ value: d.id, label: `${d.firstName} ${d.lastName}` }))}
                  value={filterTeacherId}
                  onChange={(val) => setFilterTeacherId(String(val))}
                />
              </div>
            )}

            {filterType === 'classroom' && (
              <div id="subflt-box-room" className="flex items-center gap-2">
                <span className="text-slate-400">Ver Ocupación del Espacio:</span>
                <SearchableSelect
                  options={classrooms.map(c => ({ value: c.id, label: c.name }))}
                  value={filterClassroomId}
                  onChange={(val) => setFilterClassroomId(String(val))}
                />
              </div>
            )}
          </div>

          {/* Timetable Grid View */}
          <div id="calendar-grid-wrapper" className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-50 font-bold border-b border-slate-200 text-slate-800 text-[10px] uppercase">
                  <th className="p-3 border text-left min-w-[120px]">Periodo / Hora</th>
                  {days.map(d => (
                    <th key={d} className="p-3 border text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeBlocks.map((block, idx) => {
                  if (block.isRecess) {
                    return (
                      <tr id={`cal-recess-row-${idx}`} key={idx} className="bg-slate-50/50 text-[10px] text-slate-450 italic">
                        <td className="p-1 border text-left font-bold pl-3">{block.time}</td>
                        <td colSpan={5} className="p-1 border text-center font-bold uppercase tracking-widest bg-slate-100/40 text-slate-400 text-[9px]">
                          {block.label} (Receso de Guardia)
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr id={`cal-block-row-${idx}`} key={idx} className="hover:bg-slate-50/20">
                      {/* Left time heading */}
                      <td className="p-2 border font-extrabold text-left text-[11px] text-slate-800 bg-slate-50/25">
                        <span className="block">{block.label}</span>
                        <span className="block text-[10px] text-slate-400 font-mono leading-none">{block.time}</span>
                      </td>

                      {/* Render days columns cells */}
                      {days.map(day => {
                        // Find event booked for the visible filter perspective
                        const activeEvent = visibleEvents.find(
                          e => e.day === day && e.timeBlock === block.time
                        );

                        return (
                          <td id={`cal-cell-${day}-${idx}`} key={day} className="p-2 border align-middle min-w-[140px] max-w-[180px] h-20 text-center">
                            {activeEvent ? (
                              <div className="relative group h-full flex flex-col justify-center">
                                
                                <span className="block text-[11px] font-bold text-slate-800 leading-snug mb-0.5" title={getSubjectName(activeEvent.subjectId)}>
                                  {getSubjectName(activeEvent.subjectId)}
                                </span>
                                
                                <span className="block text-[10px] text-slate-500 truncate font-medium mb-0.5" title={getTeacherName(activeEvent.teacherId)}>
                                  {getTeacherName(activeEvent.teacherId)}
                                </span>

                                <span className="block text-[10px] font-bold text-slate-600 truncate">
                                  {getClassroomName(activeEvent.classroomId)}
                                </span>

                                {/* Section Tag */}
                                {filterType !== 'section' && (
                                  <span className="block text-[10px] font-bold text-indigo-600 mt-0.5">
                                    {activeEvent.year}° "{activeEvent.section}"
                                  </span>
                                )}

                                {/* Hover actions overlay */}
                                {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                                  <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-200 z-20 shadow-sm">
                                    <button
                                      id={`edit-evt-${activeEvent.id}`}
                                      onClick={() => handleEditClick(activeEvent)}
                                      className="p-1 rounded-md text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all"
                                      title="Editar Asignación"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      id={`del-evt-${activeEvent.id}`}
                                      onClick={() => setEventToDelete(activeEvent)}
                                      className="p-1 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                      title="Quitar Asignación"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 italic text-[10px]">Libre</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Modal de Eliminación */}
      <Modal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            ¿Está seguro de que desea eliminar la asignación de <strong>{eventToDelete ? getSubjectName(eventToDelete.subjectId) : ''}</strong> correspondiente al bloque <strong>{eventToDelete?.day} {eventToDelete?.timeBlock}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setEventToDelete(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={() => {
                if (eventToDelete) {
                  onRemoveScheduleEvent(eventToDelete.id);
                  setEventToDelete(null);
                }
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Eliminar Asignación
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
