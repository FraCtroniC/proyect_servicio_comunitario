/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { ClipboardCheck, Fingerprint, Calendar, Users, Clock, CheckCircle, ShieldAlert, FileText, Trash2, BookOpen, Pencil, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, Attendance, User, Docente, TeacherScheduleLog, AcademicYear, UserRole, Section, SchoolPeriod, Subject, SubjectSchedule, ScheduleEvent, DirtyAttendanceRecord } from '../types';
import { getErrorMessage } from '../utils/errorHandler';
import { generateReporteAsistencia } from '../utils/pdfGenerator';
import { Modal } from './Modal';
import { SearchableSelect } from './SearchableSelect';
import StudentAttendanceCalendar from './StudentAttendanceCalendar';

interface AttendanceTrackerProps {
  students: Student[];
  gradeStudents?: Student[];
  users: User[];
  docentes: Docente[];
  subjects: Subject[];
  sections: Section[];
  periods: SchoolPeriod[];
  attendance: Attendance[];
  teacherLogs: TeacherScheduleLog[];
  horariosDisponibles: SubjectSchedule[];
  bloques: any[];
  miHorario: SubjectSchedule[];
  scheduleEvents: ScheduleEvent[];
  currentUser: User | null;
  currentUserRole: UserRole;
  onModifyAttendance: (studentId: string, date: string, year: AcademicYear, section: string, status: 'P' | 'A' | 'J', horarioId?: string) => void;
  onAddTeacherLog: (log: TeacherScheduleLog) => void;
  onUpdateTeacherLog: (logId: string, clockOut: string) => void;
  onSyncInasistencias?: (ids_matricula: string[]) => void;
  onJustifyTeacherAbsence?: (logId: string, motivo: string, soporteDigital?: string) => Promise<boolean>;
  onJustifyStudentAbsence?: (attendanceId: string | null, motivo: string, soporteDigital?: string, studentId?: string, fecha?: string, horarioId?: string) => Promise<boolean>;
  onSaveObservacion?: (attendanceId: string, texto: string, gravedad?: string) => Promise<boolean>;
  onDeleteAttendance?: (attendanceId: string) => void;
  onSaveAllAttendance?: (dirtyRecords: DirtyAttendanceRecord[], date: string, year: AcademicYear, section: string, subjectId: string) => Promise<boolean>;
  onRefreshData?: () => Promise<void>;
  onFetchMiHorario?: (fecha?: string) => Promise<void>;
  onFetchHorarios?: (params?: { id_docente?: string; fecha?: string }) => void;
}

export default function AttendanceTracker({
  students,
  gradeStudents,
  users,
  docentes,
  subjects,
  sections,
  periods,
  attendance,
  teacherLogs,
  horariosDisponibles,
  bloques,
  miHorario,
  scheduleEvents,
  currentUser,
  currentUserRole,
  onModifyAttendance,
  onAddTeacherLog,
  onUpdateTeacherLog,
  onSyncInasistencias,
  onJustifyTeacherAbsence,
  onJustifyStudentAbsence,
  onSaveObservacion,
  onDeleteAttendance,
  onSaveAllAttendance,
  onRefreshData,
  onFetchMiHorario,
  onFetchHorarios
}: AttendanceTrackerProps) {
  // Navigation
  const [trackerTab, setTrackerTab] = useState<'students' | 'teachers' | 'miclase' | 'bitacora'>(
    currentUserRole === 'docente' ? 'miclase' : 'students'
  );

  // Bitácora state
  const [bitacoraTab, setBitacoraTab] = useState<'observaciones' | 'justificaciones'>('observaciones');
  const [selectedBitacoraStudent, setSelectedBitacoraStudent] = useState<string>('');
  const [bitacoraEditObs, setBitacoraEditObs] = useState<Attendance | null>(null);
  const [bitacoraEditObsText, setBitacoraEditObsText] = useState('');
  const [bitacoraEditObsGravedad, setBitacoraEditObsGravedad] = useState<string>('');
  const [bitacoraEditObsLoading, setBitacoraEditObsLoading] = useState(false);
  const [bitacoraEditJust, setBitacoraEditJust] = useState<Attendance | null>(null);
  const [bitacoraEditJustMotivo, setBitacoraEditJustMotivo] = useState('');
  const [bitacoraEditJustSoporte, setBitacoraEditJustSoporte] = useState('');
  const [bitacoraEditJustLoading, setBitacoraEditJustLoading] = useState(false);

  // Student Attendance Calendar
  const [showStudentCalendar, setShowStudentCalendar] = useState(false);
  const [calendarStudentId, setCalendarStudentId] = useState('');
  const [calendarStudentName, setCalendarStudentName] = useState('');

  // Filter attendance for calendar: docente only sees their own records, admin sees all
  const calendarAttendance = useMemo(() => {
    if (currentUserRole === 'docente') {
      const myScheduleIds = new Set(
        scheduleEvents
          .filter(e => String(e.teacherId) === String(currentUser?.id))
          .map(e => e.id)
      );
      return attendance.filter(a => a.horarioId && myScheduleIds.has(a.horarioId));
    }
    return attendance;
  }, [attendance, scheduleEvents, currentUser, currentUserRole]);

  // Student Attendance Filters
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(5);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [miClaseDate] = useState<string>(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Caracas' }).format(new Date()));

  // New filters for subject-aware attendance
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('');

  // Mi Clase state
  const [selectedHorario, setSelectedHorario] = useState<SubjectSchedule | null>(null);

  // Observación state per student
  const [observaciones, setObservaciones] = useState<Record<string, string>>({});

  // Loading state for attendance marking
  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);

  // Dirty state for batch save
  const [dirtyRecords, setDirtyRecords] = useState<Map<string, DirtyAttendanceRecord>>(new Map());
  const [isSaveAllLoading, setIsSaveAllLoading] = useState(false);

  // Teacher clock-in Emulator
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [clockSuccessMsg, setClockSuccessMsg] = useState('');

  // Justification Modal state
  const [teacherJustifyLog, setTeacherJustifyLog] = useState<TeacherScheduleLog | null>(null);
  const [justifyMotivo, setJustifyMotivo] = useState('');

  // Student Justification Modal state
  const [studentJustifyAtt, setStudentJustifyAtt] = useState<Attendance | null>(null);
  const [studentJustifyStudentId, setStudentJustifyStudentId] = useState<string | null>(null);
  const [studentJustifyMotivo, setStudentJustifyMotivo] = useState('');
  const [studentJustifySoporte, setStudentJustifySoporte] = useState('');
  const [studentJustifyLoading, setStudentJustifyLoading] = useState(false);

  // Observation Modal state
  const [obsModalAtt, setObsModalAtt] = useState<Attendance | null>(null);
  const [obsModalText, setObsModalText] = useState('');
  const [obsModalGravedad, setObsModalGravedad] = useState<string>('');
  const [obsModalLoading, setObsModalLoading] = useState(false);

  // Delete confirmation modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Representative modal state
  const [showRepModal, setShowRepModal] = useState(false);

  
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [justifySoporte, setJustifySoporte] = useState('');

  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, []);

  // Warn about unsaved changes when leaving
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRecords.size > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyRecords.size]);

  // Auto-save dirty records when switching tabs or changing date
  const prevTabRef = useRef(trackerTab);
  const prevDateRef = useRef(selectedDate);
  useEffect(() => {
    if (!onSaveAllAttendance || dirtyRecords.size === 0) {
      prevTabRef.current = trackerTab;
      prevDateRef.current = selectedDate;
      return;
    }
    const tabChanged = prevTabRef.current !== trackerTab;
    const dateChanged = prevDateRef.current !== selectedDate;
    if (tabChanged || dateChanged) {
      const records = Array.from(dirtyRecords.values());
      onSaveAllAttendance(records, selectedDate, selectedYear, selectedSection, selectedSubject)
        .then(success => {
          if (success) {
            setDirtyRecords(new Map());
            toast.success(`Asistencia guardada automáticamente (${records.length} registro${records.length !== 1 ? 's' : ''})`);
          }
        })
        .catch(() => {});
    }
    prevTabRef.current = trackerTab;
    prevDateRef.current = selectedDate;
  }, [trackerTab, selectedDate]);

  const activePeriod = periods.find(p => p.status === 'Activo');
  const schoolYearStart = (() => {
    if (!activePeriod) return '2025-01-01';
    const match = activePeriod.name.match(/^(\d{4})/);
    if (match) return `${match[1]}-01-01`;
    return '2025-01-01';
  })();
  const schoolYearEnd = (() => {
    if (!activePeriod) return '2026-12-31';
    const match = activePeriod.name.match(/(\d{4})$/);
    if (match) return `${match[1]}-12-31`;
    return '2026-12-31';
  })();
  const todayString = new Date().toISOString().split('T')[0];
  const maxDate = todayString < schoolYearEnd ? todayString : schoolYearEnd;

  const attendanceSummary = (() => {
    const todayServerRecords = attendance.filter(a =>
      a.date === selectedDate &&
      (selectedSubject ? a.horarioId === selectedSubject : !a.horarioId)
    );
    const overrides = new Map<string, 'P' | 'A' | 'J'>();
    for (const d of Array.from(dirtyRecords.values())) {
      overrides.set(d.studentId, d.status);
    }
    const effectiveStatuses = todayServerRecords.map(a => overrides.get(a.studentId) || a.status);
    for (const [stId, status] of overrides) {
      if (!todayServerRecords.some(a => a.studentId === stId)) {
        effectiveStatuses.push(status);
      }
    }
    return {
      presentes: effectiveStatuses.filter(s => s === 'P').length,
      ausentes: effectiveStatuses.filter(s => s === 'A').length,
      justificados: effectiveStatuses.filter(s => s === 'J').length,
    };
  })();

  // Filtering students and their attendance records for the selected date
  const sectionStudents = students.filter(s => s.academicYear === selectedYear && s.section === selectedSection && s.status === 'Activo');

  // Teacher Access Control Logic
  const isDocente = currentUserRole === 'docente';
  const currentDocente = docentes.find(d => 
    (currentUser?.teacherId && d.id === currentUser.teacherId) ||
    (currentUser?.cedula && d.cedula === currentUser.cedula) ||
    (currentUser?.name && d.firstName && d.lastName && `${d.firstName} ${d.lastName}`.toLowerCase().includes(currentUser.name.toLowerCase())) ||
    (currentUser?.name && d.firstName && currentUser.name.toLowerCase().includes(d.firstName.toLowerCase()))
  );
  
  const myTeacherId = currentUser?.teacherId || currentDocente?.id;
  
  const myFullSchedule = isDocente && myTeacherId 
    ? scheduleEvents.filter(e => String(e.teacherId) === String(myTeacherId))
    : [];
  
  const docenteYears = isDocente 
    ? Array.from(new Set(myFullSchedule.map(h => h.year))).filter(Boolean) as number[] 
    : null;

  const docenteSections = isDocente
    ? Array.from(new Set(myFullSchedule.filter(h => h.year === selectedYear).map(h => h.section))).filter(Boolean) as string[]
    : null;

  const docenteSubjects = isDocente
    ? Array.from(new Set(myFullSchedule.filter(h => h.year === selectedYear && h.section === selectedSection).map(h => String(h.subjectId)))).filter(Boolean) as string[]
    : null;

  useEffect(() => {
    if (isDocente && docenteYears && docenteYears.length > 0 && !docenteYears.includes(selectedYear)) {
      setSelectedYear(docenteYears[0] as AcademicYear);
    }
  }, [isDocente, selectedYear, docenteYears]);

  useEffect(() => {
    if (isDocente && docenteSections && docenteSections.length > 0 && !docenteSections.includes(selectedSection)) {
      setSelectedSection(docenteSections[0]);
    }
  }, [isDocente, selectedYear, selectedSection, docenteSections]);

  const availableHorarios = scheduleEvents
    .filter(e => e.year === selectedYear && e.section === selectedSection)
    .filter(e => !isDocente || (docenteSubjects && docenteSubjects.includes(String(e.subjectId))));

  useEffect(() => {
    if (availableHorarios.length > 0) {
      if (!selectedSubject || !availableHorarios.find(e => e.id === selectedSubject)) {
        setSelectedSubject(availableHorarios[0].id);
      }
    } else if (availableHorarios.length === 0 && selectedSubject !== '') {
      setSelectedSubject('');
    }
  }, [selectedYear, selectedSection, isDocente, docenteSubjects]);

  const selectedSubjectId = selectedSubject
    ? scheduleEvents.find(e => e.id === selectedSubject)?.subjectId || null
    : null;

  const activeHorario = selectedSubject
    ? scheduleEvents.find(e => e.id === selectedSubject) || null
    : null;

  const allowedBlocksForClass = activeHorario
    ? [activeHorario.blockId, activeHorario.timeBlock].filter(Boolean) as string[]
    : Array.from(new Set(
        scheduleEvents
          .filter(e => e.year === selectedYear && e.section === selectedSection)
          .flatMap(e => [e.blockId, e.timeBlock])
          .filter(Boolean)
      )) as string[];

  const validDaysForClass = activeHorario
    ? [activeHorario.day]
    : Array.from(new Set(
        scheduleEvents
          .filter(e => e.year === selectedYear && e.section === selectedSection)
          .map(e => e.day)
      ));

  const getMostRecentValidDate = (validDays: string[], fromDate: string): string => {
    if (validDays.length === 0) return fromDate;
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const d = new Date(fromDate + 'T12:00:00');
    for (let i = 0; i < 7; i++) {
      const dayName = dayNames[d.getDay()];
      if (validDays.includes(dayName as any)) {
        return d.toISOString().split('T')[0];
      }
      d.setDate(d.getDate() - 1);
    }
    return fromDate;
  };

  useEffect(() => {
    if (validDaysForClass.length > 0) {
      const recalculated = getMostRecentValidDate(validDaysForClass, maxDate);
      setSelectedDate(prev => {
        if (prev !== recalculated) return recalculated;
        return prev;
      });
    }
  }, [validDaysForClass.join(','), maxDate]);

  useEffect(() => {
    if (allowedBlocksForClass.length > 0 && (!selectedBlock || !allowedBlocksForClass.includes(selectedBlock))) {
      setSelectedBlock(allowedBlocksForClass[0]);
    } else if (allowedBlocksForClass.length === 0 && selectedBlock) {
      setSelectedBlock('');
    }
  }, [selectedYear, selectedSection, selectedSubject, scheduleEvents]); // don't depend directly on allowedBlocksForClass to avoid loop

  useEffect(() => {
    if (selectedSubject) {
      const horario = scheduleEvents.find(e => e.id === selectedSubject);
      if (horario) {
        setSelectedTeacher(String(horario.teacherId));
      }
    } else {
      setSelectedTeacher('');
    }
  }, [selectedSubject, scheduleEvents]);

  // Teacher actions
  const activeTeachers = docentes.filter(d => d.status === 'Activo');

  useEffect(() => {
    if (!selectedTeacherId && activeTeachers.length > 0) {
      setSelectedTeacherId(activeTeachers[0].id);
    }
  }, [selectedTeacherId, activeTeachers]);

  const handleTeacherClockIn = () => {
    const exists = teacherLogs.find(l => l.teacherId === selectedTeacherId && l.date === selectedDate);
    if (exists) {
      toast.error("El docente elegido ya posee un registro de entrada cargado para la fecha simulada asignada.");
      return;
    }

    const nowHour = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);

    const newLog: TeacherScheduleLog = {
      id: 'log-' + Date.now(),
      teacherId: selectedTeacherId,
      date: selectedDate,
      clockInTime: nowHour || '07:00',
      status: 'OnTime'
    };

    onAddTeacherLog(newLog);
    const teacherName = docentes.find(d => d.id === selectedTeacherId)?.firstName || "Docente";
    setClockSuccessMsg(`Entrada registrada para ${teacherName} a las ${newLog.clockInTime}.`);
    setTimeout(() => setClockSuccessMsg(''), 5000);
  };

  const handleTeacherClockOut = (logId: string) => {
    const nowHour = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5); // "12:30"
    onUpdateTeacherLog(logId, nowHour || '12:30');
    setClockSuccessMsg(`Salida registrada a las ${nowHour || '12:30'}. Asistencia cumplidora.`);
    setTimeout(() => setClockSuccessMsg(''), 5000);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600 bg-emerald-50';
    if (rate >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div id="attendance-tracker-root" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Tab select slider */}
      <div id="attendance-tabs" className="flex border-b border-slate-200">
        {currentUserRole !== 'docente' && (
          <button
            id="btn-att-students"
            onClick={() => setTrackerTab('students')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
              trackerTab === 'students' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Asistencia Estudiantil</span>
          </button>
        )}
        <button
          id="btn-att-miclase"
          onClick={() => {
            setTrackerTab('miclase');
            onFetchMiHorario?.(miClaseDate);
          }}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            trackerTab === 'miclase' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Mi Clase</span>
        </button>
        <button
          id="btn-att-bitacora"
          onClick={() => setTrackerTab('bitacora')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            trackerTab === 'bitacora' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Bitácora Estudiantil</span>
        </button>
        <button
          id="btn-att-teachers"
          onClick={() => setTrackerTab('teachers')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            trackerTab === 'teachers' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Fingerprint className="h-4 w-4" />
          <span>Firma de Reloj (Docentes)</span>
        </button>
      </div>

      {/*************** STUDENTS ATTENDANCE ***************/}
      {trackerTab === 'students' && (
        <div id="stud-att-container" className="space-y-6">

          {/* Action buttons */}
          <div className="flex justify-end gap-2 items-center">

            {dirtyRecords.size > 0 && (
              <button
                disabled={isSaveAllLoading} aria-busy={isSaveAllLoading}
                onClick={async () => {
                  if (!onSaveAllAttendance) return;
                  setIsSaveAllLoading(true);
                  try {
                    const records = Array.from(dirtyRecords.values());
                    const success = await onSaveAllAttendance(records, selectedDate, selectedYear, selectedSection, selectedSubject);
                    if (success) {
                      setDirtyRecords(new Map());
                      toast.success(`Asistencia guardada (${records.length} registro${records.length !== 1 ? 's' : ''})`);
                    }
                  } catch (e: any) {
                    toast.error('Error al guardar: ' + getErrorMessage(e));
                  } finally {
                    setIsSaveAllLoading(false);
                  }
                }}
                className={`text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
                  isSaveAllLoading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSaveAllLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                  </svg>
                )}
                Guardar todo ({dirtyRecords.size})
              </button>
            )}

            <button
              onClick={() => {
                const desde = new Date();
                desde.setDate(desde.getDate() - 30);
                const hasta = new Date();
                const subjectName = selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : undefined;
                const blockName = selectedBlock ? bloques.find((b: any) => String(b.id_bloque) === selectedBlock) : undefined;
                generateReporteAsistencia(
                  sectionStudents,
                  attendance,
                  selectedYear,
                  selectedSection,
                  desde.toISOString().split('T')[0],
                  hasta.toISOString().split('T')[0],
                  subjectName,
                  blockName ? `${blockName.numero_bloque || ''}° ${blockName.hora_inicio?.substring(0,5)}-${blockName.hora_fin?.substring(0,5)}` : undefined
                );
              }}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold pointer-events-auto cursor-pointer flex items-center gap-1"
            >
              <FileText className="h-3.5 w-3.5" />
              Reporte PDF
            </button>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg font-bold pointer-events-auto cursor-pointer"
            >
              Sincronizar Inasistencias con Calificaciones
            </button>
          </div>

          {/* Filters Bar */}
          <div id="stud-att-filters" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-end">
            
            <div id="filter-att-year" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Año Escolar</span>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value) as AcademicYear);
                  setSelectedSubject('');
                }}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {[
                  { val: 1, label: '1er Año' },
                  { val: 2, label: '2do Año' },
                  { val: 3, label: '3er Año' },
                  { val: 4, label: '4to Año' },
                  { val: 5, label: '5to Año' }
                ]
                  .filter(y => !isDocente || (docenteYears && docenteYears.includes(y.val)))
                  .map(y => (
                    <option key={y.val} value={y.val}>{y.label}</option>
                  ))}
              </select>
            </div>

            <div id="filter-att-section" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Sección</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {sections
                  .filter(s => s.grade === selectedYear)
                  .filter(s => !isDocente || (docenteSections && docenteSections.includes(s.letter)))
                  .sort((a, b) => a.letter.localeCompare(b.letter))
                  .map(s => (
                    <option key={`${s.grade}-${s.letter}`} value={s.letter}>
                      Sección "{s.letter}"
                    </option>
                  ))}
              </select>
            </div>

            <div id="filter-att-subject" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Materia</span>
              <SearchableSelect
                options={scheduleEvents
                  .filter(e => e.year === selectedYear && e.section === selectedSection)
                  .filter(e => !isDocente || (docenteSubjects && docenteSubjects.includes(String(e.subjectId))))
                  .map(e => {
                    const subject = subjects.find(s => String(s.id) === e.subjectId);
                    const dayNames: Record<string, string> = { L: 'Lunes', M: 'Martes', MI: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado' };
                    const dayLabel = dayNames[e.day as string] || e.day;
                    return { value: e.id, label: `${subject?.name || e.subjectId} - ${dayLabel}` };
                  })}
                value={selectedSubject}
                onChange={(val) => setSelectedSubject(String(val))}
                placeholder="Seleccionar materia..."
              />
            </div>

            {!isDocente && (
              <div id="filter-att-teacher" className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-400 uppercase">Docente</span>
                {selectedSubject ? (
                  <select
                    value={selectedTeacher}
                    disabled
                    className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
                  >
                    {selectedTeacher && (() => {
                      const d = docentes.find(doc => doc.id === selectedTeacher);
                      return d ? <option value={d.id}>{d.lastName}, {d.firstName}</option> : null;
                    })()}
                  </select>
                ) : (
                  <SearchableSelect
                    options={[
                      { value: '', label: 'Todos los docentes' },
                      ...docentes
                        .filter(d => {
                          if (d.status !== 'Activo') return false;
                          return scheduleEvents.some(e => e.year === selectedYear && e.section === selectedSection && String(e.teacherId) === d.id);
                        })
                        .sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''))
                        .map(d => ({ value: d.id, label: `${d.lastName || ''}, ${d.firstName || ''}` }))
                    ]}
                    value={selectedTeacher}
                    onChange={(val) => setSelectedTeacher(String(val))}
                    placeholder="Seleccionar docente..."
                  />
                )}
              </div>
            )}

            <div id="filter-att-block" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Bloque Horario</span>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {bloques
                  .filter((b: any) => {
                    const timeStr = `${b.hora_inicio?.substring(0,5)} - ${b.hora_fin?.substring(0,5)}`;
                    return allowedBlocksForClass.includes(String(b.id_bloque)) || allowedBlocksForClass.includes(timeStr);
                  })
                  .sort((a: any, b: any) => (a.numero_bloque || 0) - (b.numero_bloque || 0))
                  .map((b: any) => (
                    <option key={b.id_bloque || b.numero_bloque || `${b.hora_inicio}-${b.hora_fin}`} value={b.id_bloque}>
                      {b.numero_bloque ? `${b.numero_bloque}°` : ''} {b.hora_inicio?.substring(0,5)} - {b.hora_fin?.substring(0,5)}
                    </option>
                  ))}
              </select>
            </div>

            <div id="filter-att-date" className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-400 uppercase">Fecha de Diario</span>
              <input
                type="date"
                value={selectedDate}
                min={schoolYearStart}
                max={maxDate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val > maxDate) {
                    toast.error(`La fecha no puede ser posterior al ${maxDate}.`);
                    return;
                  }
                  if (val < schoolYearStart) {
                    toast.error(`La fecha no puede ser anterior al ${schoolYearStart}.`);
                    return;
                  }
                  
                  if (validDaysForClass.length > 0) {
                    const dateObj = new Date(val + "T12:00:00");
                    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    const dayName = days[dateObj.getDay()];
                    if (!validDaysForClass.includes(dayName as any)) {
                      toast.error(`Materia no asignada para los ${dayName}s. Días válidos: ${validDaysForClass.join(', ')}.`);
                      return;
                    }
                  }

                  setSelectedDate(val);
                }}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium font-mono"
              />
            </div>

          </div>

          {/* Table list */}
          <div id="stud-att-list" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <div id="stud-att-header" className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Planilla de Control Asistencia Diaria
                {selectedSubject && (
                  <span className="text-sm font-medium text-indigo-600 ml-2">
                    · {subjects.find(s => s.id === selectedSubject)?.name || ''}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Presentes: {attendanceSummary.presentes}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Ausentes: {attendanceSummary.ausentes}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Justificados: {attendanceSummary.justificados}
                </span>
                <span className="text-xs text-slate-500 font-mono">Asistencia para: <strong>{selectedDate}</strong></span>
              </div>
            </div>

            <div id="stud-att-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold text-sm tracking-wider">
                    <th className="py-2.5">Estudiante</th>
                    <th className="py-2.5">Cédula</th>
                    <th className="py-2.5 text-center">Estado de Asistencia</th>
                    <th className="py-2.5">Observación</th>
                    <th className="py-2.5 text-right">Porcentaje Mes</th>
                    <th className="py-2.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-705">
                  {sectionStudents.length > 0 ? (
                    sectionStudents.map(student => {
                      const todayAtt = selectedSubject
                        ? attendance.find(a => a.studentId === student.id && a.date === selectedDate && a.horarioId === selectedSubject)
                        : attendance.find(a => a.studentId === student.id && a.date === selectedDate && !a.horarioId);
                      const dirtyRec = dirtyRecords.get(student.id);
                      const currentStatus = dirtyRec?.status || todayAtt?.status || null;

                      // Student monthly attendance rates calculation
                      const studentHistory = attendance.filter(a => a.studentId === student.id);
                      const presents = studentHistory.filter(a => a.status === 'P' || a.status === 'J').length;
                      const rate = studentHistory.length > 0 ? Math.round((presents / studentHistory.length) * 100) : 100;

                      return (
                        <tr id={`att-std-row-${student.id}`} key={student.id} className={`transition-colors ${dirtyRecords.has(student.id) ? 'bg-amber-50/60 border-l-4 border-l-amber-400' : 'hover:bg-slate-50/40'} ${loadingStudentId === student.id ? 'bg-indigo-50/50' : ''}`}>
                          <td className="py-3 pr-2">
                            <button
                              onClick={() => { setCalendarStudentId(student.id); setCalendarStudentName(`${student.lastName}, ${student.firstName}`); setShowStudentCalendar(true); }}
                              className="font-bold text-slate-800 text-sm flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                            >
                              {loadingStudentId === student.id && (
                                <svg className="animate-spin h-3 w-3 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              )}
                              {student.lastName}, {student.firstName}
                            </button>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-500 text-sm">{student.cedula}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5 max-w-[170px] mx-auto">
                              {(['P', 'A', 'J'] as const).map(flag => {
                                const isSelected = currentStatus === flag;
                                const isLoading = loadingStudentId === student.id;
                                
                                const getFlagTheme = (f: 'P' | 'A' | 'J') => {
                                  if (isLoading || !selectedSubject) return 'bg-slate-100 text-slate-400 cursor-not-allowed';
                                  if (f === 'P') return isSelected ? 'bg-green-600 text-white' : 'bg-slate-50 hover:bg-green-50 text-slate-500';
                                  if (f === 'A') return isSelected ? 'bg-rose-600 text-white' : 'bg-slate-50 hover:bg-rose-50 text-slate-500';
                                  return isSelected ? 'bg-amber-600 text-white' : 'bg-slate-50 hover:bg-amber-50 text-slate-500';
                                };

                                return (
                                  <button
                                    id={`att-flag-${student.id}-${flag}`}
                                    key={flag}
                                    disabled={isLoading || !selectedSubject} aria-busy={isLoading}
                                    onClick={async () => {
                                      if (!selectedSubject) {
                                        toast.error("Debe seleccionar una materia para registrar asistencia.");
                                        return;
                                      }
                                      if (isLoading) return;
                                      if (flag === 'J') {
                                        if (currentStatus === 'J' && todayAtt) {
                                          const existingJust = todayAtt.justificaciones?.[0];
                                          setStudentJustifyAtt(todayAtt);
                                          setStudentJustifyStudentId(null);
                                          setStudentJustifyMotivo(existingJust?.motivo || '');
                                          setStudentJustifySoporte(existingJust?.soporte_digital || '');
                                        } else {
                                          setStudentJustifyAtt(todayAtt || null);
                                          setStudentJustifyStudentId(todayAtt ? null : student.id);
                                          setStudentJustifyMotivo('');
                                          setStudentJustifySoporte('');
                                        }
                                        return;
                                      }
                                      setDirtyRecords(prev => {
                                        const next = new Map(prev);
                                        const existing = next.get(student.id);
                                        next.set(student.id, {
                                          studentId: student.id,
                                          status: flag,
                                          observacion: existing?.observacion,
                                          justificacion: existing?.justificacion,
                                        });
                                        return next;
                                      });
                                    }}
                                    className={`w-10 py-1.5 rounded-lg border border-slate-200 text-sm font-bold transition-all p-0 focus:outline-hidden ${isLoading ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'} ${getFlagTheme(flag)}`}
                                    title={flag === 'P' ? 'Presente' : flag === 'A' ? 'Ausente' : 'Justificado'}
                                  >
                                    {flag}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3">
                            {todayAtt ? (
                              <button
                                onClick={() => {
                                  setObsModalAtt(todayAtt);
                                  setObsModalText(todayAtt.observacion?.texto || observaciones[student.id] || '');
                                  setObsModalGravedad(todayAtt.observacion?.gravedad || '');
                                }}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  (todayAtt.observacion?.texto || observaciones[student.id])
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}
                                title={todayAtt.observacion?.texto ? 'Ver/editar observación' : 'Agregar observación'}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getAttendanceRateColor(rate)}`}>
                              {rate}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {currentUserRole === 'super_admin' && todayAtt && (
                                <button
                                  onClick={() => setConfirmDeleteId(todayAtt.id)}
                                  className="text-sm text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-1.5 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                                  title="Eliminar registro"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-bold">
                        No hay estudiantes matriculados activos en {selectedYear}° Año "{selectedSection}" para tomar asistencia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/*************** MI CLASE (Docente View) ***************/}
      {trackerTab === 'miclase' && (
        <div id="miclase-container" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Mi Horario del Día
            </h2>
            <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-mono">
              {miClaseDate}
            </span>
          </div>

          {miHorario.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">
                No tienes clases programadas para hoy o el docente no está vinculado a tu usuario.
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Ve a "Asistencia Estudiantil" para usar la vista general con filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {miHorario.map((h) => (
                <div
                  key={h.id_horario}
                  className={`bg-white rounded-xl border-2 p-4 transition-all cursor-pointer ${
                    selectedHorario?.id_horario === h.id_horario
                      ? 'border-indigo-500 shadow-md'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                  onClick={() => {
                    setSelectedHorario(selectedHorario?.id_horario === h.id_horario ? null : h);
                    if (selectedHorario?.id_horario !== h.id_horario) {
                      setSelectedSection(h.seccion?.letter || 'A');
                      setSelectedYear((h.seccion?.grade || (h.seccion as any)?.id_grado || 5) as AcademicYear);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {h.bloque?.numero_bloque ? `${h.bloque.numero_bloque}° Bloque` : ''}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {h.bloque?.hora_inicio?.substring(0,5)} - {h.bloque?.hora_fin?.substring(0,5)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {h.asignatura?.name || 'Materia'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {(h.seccion as any)?.grade || (h.seccion as any)?.id_grado}° "{h.seccion?.letter}" 
                    {h.aula?.name ? ` · ${h.aula.name}` : ''}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {h.estudiantes?.length || 0} estudiante(s)
                  </p>
                </div>
              ))}
            </div>
          )}

          {selectedHorario && selectedHorario.estudiantes && selectedHorario.estudiantes.length > 0 && (
            <div id="miclase-attendance-grid" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Asistencia: {selectedHorario.asignatura?.name} - {selectedHorario.seccion?.grade || ''}° "{selectedHorario.seccion?.letter}" 
                </h3>
                <div className="flex items-center gap-2">
                  {dirtyRecords.size > 0 && (
                    <button
                      disabled={isSaveAllLoading} aria-busy={isSaveAllLoading}
                      onClick={async () => {
                        if (!onSaveAllAttendance) return;
                        setIsSaveAllLoading(true);
                        try {
                          const records = Array.from(dirtyRecords.values());
                          const success = await onSaveAllAttendance(
                            records, selectedDate,
                            ((selectedHorario.seccion as any)?.grade || (selectedHorario.seccion as any)?.id_grado || 5) as AcademicYear,
                            selectedHorario.seccion?.letter || 'A',
                            String(selectedHorario.id_horario)
                          );
                          if (success) {
                            setDirtyRecords(new Map());
                            toast.success(`Asistencia guardada (${records.length} registro${records.length !== 1 ? 's' : ''})`);
                          }
                        } catch (e: any) {
                          toast.error('Error al guardar: ' + getErrorMessage(e));
                        } finally {
                          setIsSaveAllLoading(false);
                        }
                      }}
                      className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 pointer-events-auto cursor-pointer ${
                        isSaveAllLoading
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isSaveAllLoading ? (
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                        </svg>
                      )}
                      Guardar ({dirtyRecords.size})
                    </button>
                  )}
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono">
                    {selectedHorario.bloque?.hora_inicio?.substring(0,5)} - {selectedHorario.bloque?.hora_fin?.substring(0,5)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold text-sm tracking-wider">
                      <th className="py-2.5">Estudiante</th>
                      <th className="py-2.5">Cédula</th>
                      <th className="py-2.5 text-center">Estado</th>
                      <th className="py-2.5">Observación</th>
                      <th className="py-2.5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-700">
                    {selectedHorario.estudiantes.map((est: any) => {
                      const attRecord = attendance.find(
                        a => a.studentId === String(est.id_estudiante) && a.date === selectedDate && a.horarioId === String(selectedHorario.id_horario)
                      );
                      const dirtyRec = dirtyRecords.get(String(est.id_estudiante));
                      const currentStatus = dirtyRec?.status || attRecord?.status || null;
                      const isLoading = loadingStudentId === String(est.id_estudiante);

                      return (
                        <tr key={est.id_matricula} className={`transition-colors ${dirtyRecords.has(String(est.id_estudiante)) ? 'bg-amber-50/60 border-l-4 border-l-amber-400' : 'hover:bg-slate-50/40'} ${isLoading ? 'bg-indigo-50/50' : ''}`}>
                          <td className="py-3 pr-2">
                            <button
                              onClick={() => { setCalendarStudentId(String(est.id_estudiante)); setCalendarStudentName(est.nombre); setShowStudentCalendar(true); }}
                              className="font-bold text-slate-800 text-sm flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                            >
                              {isLoading && (
                                <svg className="animate-spin h-3 w-3 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              )}
                              {est.nombre}
                            </button>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-500 text-sm">{est.cedula}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5 max-w-[170px] mx-auto">
                              {(['P', 'A', 'J'] as const).map(flag => {
                                const isSelected = currentStatus === flag;
                                const getFlagTheme = (f: 'P' | 'A' | 'J') => {
                                  if (isLoading) return 'bg-slate-100 text-slate-400 cursor-not-allowed';
                                  if (f === 'P') return isSelected ? 'bg-green-600 text-white' : 'bg-slate-50 hover:bg-green-50 text-slate-500';
                                  if (f === 'A') return isSelected ? 'bg-rose-600 text-white' : 'bg-slate-50 hover:bg-rose-50 text-slate-500';
                                  return isSelected ? 'bg-amber-600 text-white' : 'bg-slate-50 hover:bg-amber-50 text-slate-500';
                                };

                                return (
                                  <button
                                    key={flag}
                                    disabled={isLoading}
                                    onClick={async () => {
                                      if (isLoading) return;
                                      if (flag === 'J') {
                                        if (currentStatus === 'J' && attRecord) {
                                          const existingJust = attRecord.justificaciones?.[0];
                                          setStudentJustifyAtt(attRecord);
                                          setStudentJustifyStudentId(null);
                                          setStudentJustifyMotivo(existingJust?.motivo || '');
                                          setStudentJustifySoporte(existingJust?.soporte_digital || '');
                                        } else {
                                          setStudentJustifyAtt(attRecord || null);
                                          setStudentJustifyStudentId(attRecord ? null : String(est.id_estudiante));
                                          setStudentJustifyMotivo('');
                                          setStudentJustifySoporte('');
                                        }
                                        return;
                                      }
                                      setDirtyRecords(prev => {
                                        const next = new Map(prev);
                                        const studentId = String(est.id_estudiante);
                                        const existing = next.get(studentId);
                                        next.set(studentId, {
                                          studentId,
                                          status: flag,
                                          observacion: existing?.observacion,
                                          justificacion: existing?.justificacion,
                                        });
                                        return next;
                                      });
                                    }}
                                    className={`w-10 py-1.5 rounded-lg border border-slate-200 text-sm font-bold transition-all p-0 focus:outline-hidden ${isLoading ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'} ${getFlagTheme(flag)}`}
                                    title={flag === 'P' ? 'Presente' : flag === 'A' ? 'Ausente' : 'Justificado'}
                                  >
                                    {flag}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3">
                            {attRecord ? (
                              <button
                                onClick={() => {
                                  setObsModalAtt(attRecord);
                                  setObsModalText(attRecord.observacion?.texto || observaciones[String(est.id_estudiante)] || '');
                                  setObsModalGravedad(attRecord.observacion?.gravedad || '');
                                }}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  (attRecord.observacion?.texto || observaciones[String(est.id_estudiante)])
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}
                                title={attRecord.observacion?.texto ? 'Ver/editar observación' : 'Agregar observación'}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {currentUserRole === 'super_admin' && attRecord && (
                                <button
                                  onClick={() => setConfirmDeleteId(attRecord.id)}
                                  className="text-sm text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-1.5 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                                  title="Eliminar registro"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/*************** BITÁCORA ESTUDIANTIL ***************/}
      {trackerTab === 'bitacora' && (
        <div id="bitacora-container" className="space-y-6">
          {/* Header + Student Picker */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-1 w-96">
              <span className="text-sm font-bold text-slate-400 uppercase">Seleccione Estudiante</span>
              <SearchableSelect
                options={(gradeStudents || students).filter(s => s.status === 'Activo').map(s => ({
                  value: s.id,
                  label: `[${s.academicYear}° Año "${s.section}"] - ${s.lastName}, ${s.firstName} (${s.cedula})`
                }))}
                value={selectedBitacoraStudent}
                onChange={(val) => setSelectedBitacoraStudent(String(val))}
                placeholder="Buscar estudiante por nombre o cédula..."
              />
            </div>
            {selectedBitacoraStudent && (() => {
              const selStudent = students.find(s => s.id === selectedBitacoraStudent);
              return selStudent ? (
                <button
                  onClick={() => setShowRepModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer self-end"
                  title="Ver representante legal"
                >
                  <UserIcon className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Representante</span>
                </button>
              ) : null;
            })()}
          </div>

          {selectedBitacoraStudent && (() => {
            const studentAtts = attendance.filter(a => a.studentId === selectedBitacoraStudent);
            const obsAtts = studentAtts.filter(a => a.observacion?.texto && a.observacion.texto.trim());
            const justAtts = studentAtts.filter(a => a.status === 'J' && a.justificaciones && a.justificaciones.length > 0);

            return (
              <>
                {/* Sub-filters pills */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tipo:</span>
                  {[
                    { value: 'observaciones' as const, label: 'Observaciones', count: obsAtts.length, bg: 'bg-blue-50', activeBg: 'bg-blue-600', activeText: 'text-white' },
                    { value: 'justificaciones' as const, label: 'Justificaciones', count: justAtts.length, bg: 'bg-amber-50', activeBg: 'bg-amber-600', activeText: 'text-white' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBitacoraTab(opt.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        bitacoraTab === opt.value
                          ? `${opt.activeBg} ${opt.activeText} border-transparent shadow-sm`
                          : `${opt.bg} text-slate-600 border-slate-200 hover:border-slate-300`
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  ))}
                </div>

                {/* Observaciones Table */}
                {bitacoraTab === 'observaciones' && (
                  <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                    {obsAtts.length > 0 ? (
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-xs tracking-wider">
                            <th className="py-3 px-4">Fecha</th>
                            <th className="py-3 px-4">Materia</th>
                            <th className="py-3 px-4">Año / Sección</th>
                            <th className="py-3 px-4">Estado</th>
                            <th className="py-3 px-4">Observación</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-700">
                          {obsAtts.sort((a, b) => b.date.localeCompare(a.date)).map(att => {
                            const schedEvent = scheduleEvents.find(e => e.id === att.horarioId);
                            const subj = schedEvent ? subjects.find(s => String(s.id) === schedEvent.subjectId) : null;
                            const dayMap: Record<string, string> = { L: 'Lunes', M: 'Martes', MI: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado' };
                            const matLabel = schedEvent ? `${subj?.name || ''} - ${dayMap[schedEvent.day] || schedEvent.day} ${schedEvent.timeBlock}` : '—';
                            return (
                            <tr key={att.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3 px-4 font-mono text-sm">{att.date}</td>
                              <td className="py-3 px-4 text-sm">{matLabel}</td>
                              <td className="py-3 px-4">{att.academicYear}° Año "{att.section}"</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  att.status === 'P' ? 'bg-green-100 text-green-700' :
                                  att.status === 'A' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {att.status === 'P' ? 'Presente' : att.status === 'A' ? 'Ausente' : 'Justificado'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm max-w-xs">
                                <div className="flex items-center gap-2">
                                  {att.observacion?.gravedad && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                                       att.observacion.gravedad === 'Bajo' ? 'bg-green-100 text-green-700' :
                                      att.observacion.gravedad === 'Moderado' ? 'bg-yellow-100 text-yellow-700' :
                                      att.observacion.gravedad === 'Alto' ? 'bg-orange-100 text-orange-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {att.observacion.gravedad}
                                    </span>
                                  )}
                                   <span>{att.observacion?.texto}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => {
                                    setBitacoraEditObs(att);
                                    setBitacoraEditObsText(att.observacion?.texto || '');
                                    setBitacoraEditObsGravedad(att.observacion?.gravedad || '');
                                  }}
                                  className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                                  title="Editar observación"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="py-12 text-center text-slate-400 font-medium">No hay observaciones registradas para este estudiante.</p>
                    )}
                  </div>
                )}

                {/* Justificaciones Table */}
                {bitacoraTab === 'justificaciones' && (
                  <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                    {justAtts.length > 0 ? (
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-xs tracking-wider">
                            <th className="py-3 px-4">Fecha</th>
                            <th className="py-3 px-4">Materia</th>
                            <th className="py-3 px-4">Año / Sección</th>
                            <th className="py-3 px-4">Motivo</th>
                            <th className="py-3 px-4">Soporte</th>
                            <th className="py-3 px-4">Registrada</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-700">
                          {justAtts.sort((a, b) => b.date.localeCompare(a.date)).map(att => {
                            const just = att.justificaciones?.[0];
                            const schedEvent = scheduleEvents.find(e => e.id === att.horarioId);
                            const subj = schedEvent ? subjects.find(s => String(s.id) === schedEvent.subjectId) : null;
                            const dayMap: Record<string, string> = { L: 'Lunes', M: 'Martes', MI: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado' };
                            const matLabel = schedEvent ? `${subj?.name || ''} - ${dayMap[schedEvent.day] || schedEvent.day} ${schedEvent.timeBlock}` : '—';
                            return (
                              <tr key={att.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-3 px-4 font-mono text-sm">{att.date}</td>
                                <td className="py-3 px-4 text-sm">{matLabel}</td>
                                <td className="py-3 px-4">{att.academicYear}° Año "{att.section}"</td>
                                <td className="py-3 px-4 text-sm max-w-xs">{just?.motivo}</td>
                                <td className="py-3 px-4 text-sm text-slate-500">{just?.soporte_digital || '—'}</td>
                                <td className="py-3 px-4 text-xs text-slate-400 font-mono">{just?.created_at ? new Date(just.created_at).toLocaleDateString() : '—'}</td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => {
                                      setBitacoraEditJust(att);
                                      setBitacoraEditJustMotivo(just?.motivo || '');
                                      setBitacoraEditJustSoporte(just?.soporte_digital || '');
                                    }}
                                    className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                                    title="Editar justificación"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="py-12 text-center text-slate-400 font-medium">No hay justificaciones registradas para este estudiante.</p>
                    )}
                  </div>
                )}
              </>
            );
          })()}

          {!selectedBitacoraStudent && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Seleccione un estudiante para ver su bitácora de observaciones y justificaciones.</p>
            </div>
          )}
        </div>
      )}

      {/*************** TEACHERS CLOCK-IN CARD ***************/}
      {trackerTab === 'teachers' && (
        <div id="teach-att-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Punch Clock Simulator Card */}
          <div id="teach-clock-panel" className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-indigo-600 animate-pulse" />
              Reloj Biométrico de Entrada / Salida
            </h3>
            <p className="text-sm text-slate-400 leading-normal">
              Simulador del dispositivo de firma digital ubicado en la entrada administrativa del Liceo. Permite comprobar la puntualidad del personal docente de guardia.
            </p>

            <div id="punch-controls" className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase block">Seleccionar Docente de Guardia</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  {activeTeachers.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.cedula})</option>
                  ))}
                </select>
              </div>

              <div id="punch-btn-group" className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-clock-in"
                  onClick={handleTeacherClockIn}
                  className="py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Clock className="h-4.5 w-4.5" />
                  <span>Marcar Entrada</span>
                </button>
                
                <button
                  id="btn-clock-out"
                  onClick={() => {
                    const activeLog = teacherLogs.find(l => l.teacherId === selectedTeacherId && l.date === selectedDate && !l.clockOutTime);
                    if (!activeLog) {
                      toast.error("No existe una entrada activa sin salida para el profesor seleccionado en el día simulado de hoy.");
                      return;
                    }
                    handleTeacherClockOut(activeLog.id);
                  }}
                  className="py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-xs transition-colors pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Clock className="h-4.5 w-4.5" />
                  <span>Marcar Salida</span>
                </button>
              </div>
            </div>

            {clockSuccessMsg && (
              <div id="punch-notification" className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-900 text-sm rounded-lg flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{clockSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Right: Punch Logs and lists (col span 2) */}
          <div id="punch-history-panel" className="bg-white p-5 rounded-xl border border-slate-200/80 lg:col-span-2 space-y-4">
            <div id="punch-history-header" className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-850">Registro del Reloj de Control</h3>
              <span className="text-xs bg-slate-100 text-slate-500 font-mono font-black rounded px-2 py-0.5">Fecha: {selectedDate}</span>
            </div>

            <div id="punch-table-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase font-black text-sm tracking-wider">
                    <th className="py-2.5">Profesor</th>
                    <th className="py-2.5">Cédula</th>
                    <th className="py-2.5 text-center">Entrada</th>
                    <th className="py-2.5 text-center">Salida</th>
                    <th className="py-2.5 text-center">Estado</th>
                    <th className="py-2.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-705">
                  {teacherLogs.filter(l => l.date === selectedDate).length > 0 ? (
                    teacherLogs.filter(l => l.date === selectedDate).map(log => {
                      const teacher = docentes.find(d => d.id === log.teacherId);
                      
                      return (
                        <tr id={`punch-row-${log.id}`} key={log.id} className="hover:bg-slate-50/40">
                          <td className="py-3">
                            <span className="font-bold text-slate-800 text-sm block">{teacher?.firstName}</span>
                          </td>
                          <td className="py-3 font-mono text-xs text-slate-500">{teacher?.cedula?.replace(/^[A-Z]-/, '')}</td>
                          <td className="py-3 text-center text-slate-800 font-mono font-bold">{log.clockInTime}</td>
                          <td className="py-3 text-center text-slate-800 font-mono font-bold">{log.clockOutTime || '--:--'}</td>
                          <td className="py-3 text-center">
                            {log.status === 'OnTime' ? (
                              <span className="text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full text-sm">Puntual</span>
                            ) : log.status === 'Late' ? (
                              <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full text-sm">Retardo</span>
                            ) : log.status === 'Absent' ? (
                              <span className="text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full text-sm">Ausente</span>
                            ) : (
                              <span className="text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full text-sm cursor-help" title={log.justificaciones?.[0]?.motivo || 'Falta justificada'}>Justificado</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {!log.clockOutTime && log.status !== 'Absent' && log.status !== 'Justified' ? (
                              <button
                                id={`row-clockout-${log.id}`}
                                onClick={() => handleTeacherClockOut(log.id)}
                                className="text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                              >
                                Marcar Salida
                              </button>
                            ) : log.status === 'Absent' ? (
                              <button
                                onClick={() => {
                                  setTeacherJustifyLog(log);
                                }}
                                className="text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                              >
                                Justificar
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300 font-bold">Completado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        No se han registrado firmas o marcajes de reloj para esta fecha simulada. Elige docentes de la izquierda y haz un "Marcaje de Entrada".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} title="Confirmar Sincronización">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de sincronizar las inasistencias de todos los estudiantes visibles con sus calificaciones? Esta acción podría afectar los promedios finales según el reglamento.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setIsSyncModalOpen(false)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={() => {
                const ids_matricula = sectionStudents
                  .map(s => {
                    const att = attendance.find(a => a.studentId === s.id);
                    return att?.matriculaId;
                  })
                  .filter((id): id is string => !!id);
                const hasAbsences = ids_matricula.length > 0;
                if (hasAbsences) {
                  onSyncInasistencias?.(ids_matricula);
                } else {
                  toast.error('No hay registros de asistencia para sincronizar. Marque asistencia primero.');
                }
                setIsSyncModalOpen(false);
              }}
              className="px-4 py-2 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Sincronizar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!teacherJustifyLog} onClose={() => {
        setTeacherJustifyLog(null);
        setJustifyMotivo('');
        setJustifySoporte('');
      }} title="Justificar Inasistencia Docente">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Motivo de la Inasistencia *</label>
            <textarea
              value={justifyMotivo}
              onChange={e => setJustifyMotivo(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[80px]"
              placeholder="Ej. Reposo médico por 3 días..."
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Soporte Digital (Opcional)</label>
            <input
              type="text"
              value={justifySoporte}
              onChange={e => setJustifySoporte(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Referencia al documento físico o link"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setTeacherJustifyLog(null);
                setJustifyMotivo('');
                setJustifySoporte('');
              }}
              className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (!teacherJustifyLog) return;
                if (!justifyMotivo.trim()) {
                  toast.error("El motivo es obligatorio.");
                  return;
                }
                if (onJustifyTeacherAbsence) {
                  const success = await onJustifyTeacherAbsence(teacherJustifyLog.id, justifyMotivo, justifySoporte);
                  if (success) {
                    toast.success("Inasistencia justificada.");
                    setTeacherJustifyLog(null);
                    setJustifyMotivo('');
                    setJustifySoporte('');
                  } else {
                    toast.error("No se pudo justificar.");
                  }
                }
              }}
              className="px-4 py-2 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Guardar Justificación
            </button>
          </div>
        </div>
      </Modal>

      {/* Student Justification Modal */}
      <Modal isOpen={!!studentJustifyAtt || !!studentJustifyStudentId} onClose={() => {
        setStudentJustifyAtt(null);
        setStudentJustifyStudentId(null);
        setStudentJustifyMotivo('');
        setStudentJustifySoporte('');
      }} title={studentJustifyAtt?.justificaciones?.length ? "Editar Justificación Estudiante" : "Justificar Inasistencia Estudiante"}>
        <div className="space-y-4">
          {(studentJustifyAtt || studentJustifyStudentId) && (() => {
            const horarioId = studentJustifyAtt?.horarioId || selectedSubject;
            const scheduleEvent = scheduleEvents.find(e => e.id === horarioId);
            const subject = scheduleEvent ? subjects.find(s => String(s.id) === scheduleEvent.subjectId) : null;
            const dayNames: Record<string, string> = { L: 'Lunes', M: 'Martes', MI: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado' };
            const materiaLabel = scheduleEvent
              ? `${subject?.name || ''} - ${dayNames[scheduleEvent.day] || scheduleEvent.day} ${scheduleEvent.timeBlock}`
              : '';
            return (
              <p className="text-sm text-slate-500">
                Estudiante: <strong>{students.find(s => s.id === (studentJustifyAtt?.studentId || studentJustifyStudentId))?.firstName} {students.find(s => s.id === (studentJustifyAtt?.studentId || studentJustifyStudentId))?.lastName}</strong>
                {' — '}{studentJustifyAtt?.date || selectedDate}
                {materiaLabel && <><br/>Materia: <strong>{materiaLabel}</strong></>}
              </p>
            );
          })()}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Motivo de la Justificación *</label>
            <textarea
              value={studentJustifyMotivo}
              onChange={e => setStudentJustifyMotivo(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[80px]"
              placeholder="Ej. Cita médica, reposo, etc..."
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Soporte Digital (Opcional)</label>
            <input
              type="text"
              value={studentJustifySoporte}
              onChange={e => setStudentJustifySoporte(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Referencia al documento físico o link"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setStudentJustifyAtt(null);
                setStudentJustifyStudentId(null);
                setStudentJustifyMotivo('');
                setStudentJustifySoporte('');
              }}
              className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              disabled={studentJustifyLoading}
              onClick={async () => {
                const stId = studentJustifyStudentId || studentJustifyAtt?.studentId;
                if (!stId) {
                  toast.error("No se pudo identificar al estudiante.");
                  return;
                }
                if (!studentJustifyMotivo.trim()) {
                  toast.error("El motivo es obligatorio.");
                  return;
                }
                setStudentJustifyLoading(true);
                try {
                  setDirtyRecords(prev => {
                    const next = new Map(prev);
                    const existing = next.get(stId);
                    next.set(stId, {
                      studentId: stId,
                      status: 'J',
                      observacion: existing?.observacion,
                      justificacion: {
                        motivo: studentJustifyMotivo.trim(),
                        soporte_digital: studentJustifySoporte || undefined,
                      },
                    });
                    return next;
                  });
                  setStudentJustifyAtt(null);
                  setStudentJustifyStudentId(null);
                  setStudentJustifyMotivo('');
                  setStudentJustifySoporte('');
                  toast.success('Justificación agregada. No olvide guardar los cambios.');
                } finally {
                  setStudentJustifyLoading(false);
                }
              }}
              className={`px-4 py-2 text-base font-bold text-white rounded-lg transition-colors cursor-pointer ${studentJustifyLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {studentJustifyLoading ? 'Guardando...' : 'Justificar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Student Observation Modal */}
      <Modal isOpen={!!obsModalAtt} onClose={() => {
        setObsModalAtt(null);
        setObsModalText('');
        setObsModalGravedad('');
      }} title="Observación del Estudiante">
        <div className="space-y-4">
          {obsModalAtt && (() => {
            const scheduleEvent = scheduleEvents.find(e => e.id === obsModalAtt.horarioId);
            const subject = scheduleEvent ? subjects.find(s => String(s.id) === scheduleEvent.subjectId) : null;
            const dayNames: Record<string, string> = { L: 'Lunes', M: 'Martes', MI: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado' };
            const materiaLabel = scheduleEvent
              ? `${subject?.name || ''} - ${dayNames[scheduleEvent.day] || scheduleEvent.day} ${scheduleEvent.timeBlock}`
              : '';
            return (
              <p className="text-sm text-slate-500">
                Estudiante: <strong>{students.find(s => s.id === obsModalAtt.studentId)?.firstName} {students.find(s => s.id === obsModalAtt.studentId)?.lastName}</strong>
                {' — '}{obsModalAtt.date}
                {materiaLabel && <><br/>Materia: <strong>{materiaLabel}</strong></>}
              </p>
            );
          })()}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Gravedad</label>
            <select
              value={obsModalGravedad}
              onChange={e => setObsModalGravedad(e.target.value)}
              className="text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="">Sin clasificar</option>
              <option value="Bajo" className="bg-green-50 text-green-700">Bajo</option>
              <option value="Moderado" className="bg-yellow-50 text-yellow-700">Moderado</option>
              <option value="Alto" className="bg-orange-50 text-orange-700">Alto</option>
              <option value="Critico" className="bg-red-50 text-red-700">Crítico</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Observación</label>
            <textarea
              value={obsModalText}
              onChange={e => setObsModalText(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[100px]"
              placeholder="Escriba la observación del día para este estudiante..."
              maxLength={255}
            />
            <p className="text-[10px] text-slate-400 text-right">{obsModalText.length}/255</p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setObsModalAtt(null);
                setObsModalText('');
                setObsModalGravedad('');
              }}
              className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              disabled={obsModalLoading}
              onClick={async () => {
                if (!obsModalAtt) return;
                setObsModalLoading(true);
                try {
                  const stId = obsModalAtt.studentId;
                  setDirtyRecords(prev => {
                    const next = new Map(prev);
                    const existing = next.get(stId);
                    next.set(stId, {
                      studentId: stId,
                      status: existing?.status || obsModalAtt.status,
                      observacion: {
                        texto: obsModalText,
                        gravedad: obsModalGravedad || undefined,
                      },
                      justificacion: existing?.justificacion,
                    });
                    return next;
                  });
                  setObsModalAtt(null);
                  setObsModalText('');
                  setObsModalGravedad('');
                  toast.success('Observación agregada. No olvide guardar los cambios.');
                } finally {
                  setObsModalLoading(false);
                }
              }}
              className={`px-4 py-2 text-base font-bold text-white rounded-lg transition-colors cursor-pointer ${obsModalLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {obsModalLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Bitácora - Edit Observation Modal */}
      <Modal isOpen={!!bitacoraEditObs} onClose={() => { setBitacoraEditObs(null); setBitacoraEditObsText(''); setBitacoraEditObsGravedad(''); }} title="Editar Observación">
        <div className="space-y-4">
          {bitacoraEditObs && (
            <p className="text-sm text-slate-500">
              <strong>{students.find(s => s.id === bitacoraEditObs.studentId)?.firstName} {students.find(s => s.id === bitacoraEditObs.studentId)?.lastName}</strong>
              {' '}&mdash; {bitacoraEditObs.date}
            </p>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Gravedad</label>
            <select
              value={bitacoraEditObsGravedad}
              onChange={e => setBitacoraEditObsGravedad(e.target.value)}
              className="text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="">Sin clasificar</option>
              <option value="Bajo">Bajo</option>
              <option value="Moderado">Moderado</option>
              <option value="Alto">Alto</option>
              <option value="Critico">Crítico</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Observación</label>
            <textarea
              value={bitacoraEditObsText}
              onChange={e => setBitacoraEditObsText(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[100px]"
              placeholder="Escriba la observación..."
              maxLength={255}
            />
            <p className="text-[10px] text-slate-400 text-right">{bitacoraEditObsText.length}/255</p>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => { setBitacoraEditObs(null); setBitacoraEditObsText(''); setBitacoraEditObsGravedad(''); }} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button
              disabled={bitacoraEditObsLoading}
              onClick={async () => {
                if (!bitacoraEditObs) return;
                setBitacoraEditObsLoading(true);
                try {
                  if (onSaveObservacion) {
                    const success = await onSaveObservacion(bitacoraEditObs.id, bitacoraEditObsText, bitacoraEditObsGravedad || undefined);
                    if (success) { setBitacoraEditObs(null); setBitacoraEditObsText(''); setBitacoraEditObsGravedad(''); }
                  }
                } finally { setBitacoraEditObsLoading(false); }
              }}
              className={`px-4 py-2 text-base font-bold text-white rounded-lg transition-colors cursor-pointer ${bitacoraEditObsLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {bitacoraEditObsLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Bitácora - Edit Justification Modal */}
      <Modal isOpen={!!bitacoraEditJust} onClose={() => { setBitacoraEditJust(null); setBitacoraEditJustMotivo(''); setBitacoraEditJustSoporte(''); }} title="Editar Justificación">
        <div className="space-y-4">
          {bitacoraEditJust && (
            <p className="text-sm text-slate-500">
              <strong>{students.find(s => s.id === bitacoraEditJust.studentId)?.firstName} {students.find(s => s.id === bitacoraEditJust.studentId)?.lastName}</strong>
              {' '}&mdash; {bitacoraEditJust.date}
            </p>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Motivo *</label>
            <textarea
              value={bitacoraEditJustMotivo}
              onChange={e => setBitacoraEditJustMotivo(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[80px]"
              placeholder="Motivo de la justificación..."
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Soporte Digital (Opcional)</label>
            <input
              type="text"
              value={bitacoraEditJustSoporte}
              onChange={e => setBitacoraEditJustSoporte(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Referencia al documento o link"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => { setBitacoraEditJust(null); setBitacoraEditJustMotivo(''); setBitacoraEditJustSoporte(''); }} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button
              disabled={bitacoraEditJustLoading}
              onClick={async () => {
                if (!bitacoraEditJust) return;
                if (!bitacoraEditJustMotivo.trim()) { toast.error("El motivo es obligatorio."); return; }
                setBitacoraEditJustLoading(true);
                try {
                  if (onJustifyStudentAbsence) {
                    const success = await onJustifyStudentAbsence(bitacoraEditJust.id, bitacoraEditJustMotivo, bitacoraEditJustSoporte || undefined, undefined, undefined, undefined);
                    if (success) { setBitacoraEditJust(null); setBitacoraEditJustMotivo(''); setBitacoraEditJustSoporte(''); if (onRefreshData) await onRefreshData(); }
                  }
                } finally { setBitacoraEditJustLoading(false); }
              }}
              className={`px-4 py-2 text-base font-bold text-white rounded-lg transition-colors cursor-pointer ${bitacoraEditJustLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {bitacoraEditJustLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar eliminación" maxWidth="max-w-md">
        <p className="text-sm text-slate-600 mb-6">¿Estás seguro de que deseas eliminar este registro de asistencia? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
          <button
            onClick={() => {
              if (confirmDeleteId) onDeleteAttendance?.(confirmDeleteId);
              setConfirmDeleteId(null);
            }}
            className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      {/* Representative Modal */}
      <Modal isOpen={showRepModal} onClose={() => setShowRepModal(false)} title="Representante Legal">
        {(() => {
          const sel = students.find(s => s.id === selectedBitacoraStudent);
          if (!sel) return <p className="text-slate-400">No hay estudiante seleccionado</p>;
          return (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{sel.representativeName}</p>
                    <p className="text-xs text-slate-400">Representante de {sel.firstName} {sel.lastName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Cédula</span>
                    <p className="text-slate-700">{sel.representativeCedula || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Teléfono</span>
                    <p className="text-slate-700">{sel.representativePhone || '—'}</p>
                  </div>
                  {sel.representativeEmail && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Correo</span>
                      <p className="text-slate-700">{sel.representativeEmail}</p>
                    </div>
                  )}
                  {sel.representativeAddress && (
                    <div className="sm:col-span-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Dirección</span>
                      <p className="text-slate-700">{sel.representativeAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Student Attendance Calendar Modal */}
      <StudentAttendanceCalendar
        studentId={calendarStudentId}
        studentName={calendarStudentName}
        calendarAttendance={calendarAttendance}
        isOpen={showStudentCalendar}
        onClose={() => setShowStudentCalendar(false)}
      />

    </div>
  );
}

