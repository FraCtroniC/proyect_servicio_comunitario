/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ClipboardCheck, Fingerprint, Calendar, Users, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { Student, Attendance, User, TeacherScheduleLog, AcademicYear, UserRole } from '../types';

interface AttendanceTrackerProps {
  students: Student[];
  users: User[];
  attendance: Attendance[];
  teacherLogs: TeacherScheduleLog[];
  currentUserRole: UserRole;
  onModifyAttendance: (studentId: string, date: string, year: AcademicYear, section: string, status: 'P' | 'A' | 'J') => void;
  onAddTeacherLog: (log: TeacherScheduleLog) => void;
  onUpdateTeacherLog: (logId: string, clockOut: string) => void;
}

export default function AttendanceTracker({
  students,
  users,
  attendance,
  teacherLogs,
  currentUserRole,
  onModifyAttendance,
  onAddTeacherLog,
  onUpdateTeacherLog
}: AttendanceTrackerProps) {
  // Navigation
  const [trackerTab, setTrackerTab] = useState<'students' | 'teachers'>('students');

  // Student Attendance Filters
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(5);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-17'); // Today simulated

  // Teacher clock-in Emulator
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-1');
  const [clockSuccessMsg, setClockSuccessMsg] = useState('');

  // Filtering students and their attendance records for the selected date
  const sectionStudents = students.filter(s => s.academicYear === selectedYear && s.section === selectedSection && s.status === 'Activo');

  // Teacher actions
  const activeTeachers = users.filter(u => u.role === 'docente');

  const handleTeacherClockIn = () => {
    // Check if already checked in today
    const exists = teacherLogs.find(l => l.teacherId === selectedTeacherId && l.date === selectedDate);
    if (exists) {
      alert("El docente elegido ya posee un registro de entrada cargado para la fecha simulada asignada.");
      return;
    }

    // Capture hours (simulation current hour is ~07:00 or late)
    const nowHour = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5); // "07:15"
    const parsedHour = parseInt(nowHour.split(':')[0]);
    const parsedMin = parseInt(nowHour.split(':')[1]);
    
    // In Venezuela high schools, teachers usually sign in before 07:00 AM. Anything after 07:05 is Late.
    const status = (parsedHour < 7 || (parsedHour === 7 && parsedMin <= 5)) ? 'OnTime' : 'Late';

    const newLog: TeacherScheduleLog = {
      id: 'log-' + Date.now(),
      teacherId: selectedTeacherId,
      date: selectedDate,
      clockInTime: nowHour || '07:00',
      status
    };

    onAddTeacherLog(newLog);
    const teacherName = users.find(u => u.id === selectedTeacherId)?.name || "Docente";
    setClockSuccessMsg(`Entrada registrada para ${teacherName} a las ${newLog.clockInTime} (${newLog.status === 'OnTime' ? 'A Tiempo' : 'Con Retardo'}).`);
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
    <div id="attendance-tracker-root" className="space-y-6 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Tab select slider */}
      <div id="attendance-tabs" className="flex border-b border-slate-200">
        <button
          id="btn-att-students"
          onClick={() => setTrackerTab('students')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
            trackerTab === 'students' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>Asistencia Estudiantil</span>
        </button>
        <button
          id="btn-att-teachers"
          onClick={() => setTrackerTab('teachers')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
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

          {/* Filters Bar */}
          <div id="stud-att-filters" className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-center">
            
            <div id="filter-att-year" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Año Escolar</span>
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

            <div id="filter-att-section" className="flex flex-col gap-1">
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

            <div id="filter-att-date" className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Fecha de Diario</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium font-mono"
              />
            </div>

            <p className="text-[11px] text-slate-400 italic max-w-sm mt-3 ml-2">
              Lleve el control diario de permanencia escolar. Marcaje estándar venezolano: 
              <strong> P</strong> (Presente), <strong> A</strong> (Ausente) y <strong> J</strong> (Justificado).
            </p>
          </div>

          {/* Table list */}
          <div id="stud-att-list" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <div id="stud-att-header" className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Planilla de Control Asistencia Diaria</h3>
              <span className="text-[10px] text-slate-500 font-mono">Simulado para: <strong>{selectedDate}</strong></span>
            </div>

            <div id="stud-att-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase font-bold text-[9px] tracking-wider">
                    <th className="py-2.5">Estudiante</th>
                    <th className="py-2.5">Cédula</th>
                    <th className="py-2.5 text-center">Estado de Asistencia</th>
                    <th className="py-2.5 text-right">Porcentaje Mes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-705">
                  {sectionStudents.length > 0 ? (
                    sectionStudents.map(student => {
                      const todayAtt = attendance.find(a => a.studentId === student.id && a.date === selectedDate);
                      const currentStatus = todayAtt ? todayAtt.status : null;

                      // Student monthly attendance rates calculation
                      const studentHistory = attendance.filter(a => a.studentId === student.id);
                      const presents = studentHistory.filter(a => a.status === 'P' || a.status === 'J').length;
                      const rate = studentHistory.length > 0 ? Math.round((presents / studentHistory.length) * 100) : 100;

                      return (
                        <tr id={`att-std-row-${student.id}`} key={student.id} className="hover:bg-slate-50/40">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-slate-800 text-[11px] block">{student.lastName}, {student.firstName}</span>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-500 text-[11px]">{student.cedula}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5 max-w-[170px] mx-auto">
                              {(['P', 'A', 'J'] as const).map(flag => {
                                const isSelected = currentStatus === flag;
                                
                                const getFlagTheme = (f: 'P' | 'A' | 'J') => {
                                  if (f === 'P') return isSelected ? 'bg-green-600 text-white' : 'bg-slate-50 hover:bg-green-50 text-slate-500';
                                  if (f === 'A') return isSelected ? 'bg-rose-600 text-white' : 'bg-slate-50 hover:bg-rose-50 text-slate-500';
                                  return isSelected ? 'bg-amber-600 text-white' : 'bg-slate-50 hover:bg-amber-50 text-slate-500';
                                };

                                return (
                                  <button
                                    id={`att-flag-${student.id}-${flag}`}
                                    key={flag}
                                    onClick={() => {
                                      if (!['super_admin', 'control_estudios', 'docente'].includes(currentUserRole)) {
                                        alert("Error: Solo los docentes o el cuerpo de Control de Estudios pueden pasar asistencia.");
                                        return;
                                      }
                                      onModifyAttendance(student.id, selectedDate, selectedYear, selectedSection, flag);
                                    }}
                                    className={`w-10 py-1.5 rounded-lg border border-slate-200 text-xs font-bold transition-all p-0 focus:outline-hidden pointer-events-auto cursor-pointer ${getFlagTheme(flag)}`}
                                    title={flag === 'P' ? 'Presente' : flag === 'A' ? 'Ausente' : 'Justificado'}
                                  >
                                    {flag}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getAttendanceRateColor(rate)}`}>
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-bold">
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

      {/*************** TEACHERS CLOCK-IN CARD ***************/}
      {trackerTab === 'teachers' && (
        <div id="teach-att-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Punch Clock Simulator Card */}
          <div id="teach-clock-panel" className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-indigo-600 animate-pulse" />
              Reloj Biométrico de Entrada / Salida
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Simulador del dispositivo de firma digital ubicado en la entrada administrativa del Liceo. Permite comprobar la puntualidad del personal docente de guardia.
            </p>

            <div id="punch-controls" className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Seleccionar Docente de Guardia</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  {activeTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.cedula})</option>
                  ))}
                </select>
              </div>

              <div id="punch-btn-group" className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-clock-in"
                  onClick={handleTeacherClockIn}
                  className="py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Clock className="h-4.5 w-4.5" />
                  <span>Marcar Entrada</span>
                </button>
                
                <button
                  id="btn-clock-out"
                  onClick={() => {
                    const activeLog = teacherLogs.find(l => l.teacherId === selectedTeacherId && l.date === selectedDate && !l.clockOutTime);
                    if (!activeLog) {
                      alert("No existe una entrada activa sin salida para el profesor seleccionado en el día simulado de hoy.");
                      return;
                    }
                    handleTeacherClockOut(activeLog.id);
                  }}
                  className="py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Clock className="h-4.5 w-4.5" />
                  <span>Marcar Salida</span>
                </button>
              </div>
            </div>

            {clockSuccessMsg && (
              <div id="punch-notification" className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-900 text-xs rounded-lg flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{clockSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Right: Punch Logs and lists (col span 2) */}
          <div id="punch-history-panel" className="bg-white p-5 rounded-xl border border-slate-200/80 lg:col-span-2 space-y-4">
            <div id="punch-history-header" className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-850">Registro del Reloj de Control</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-black rounded px-2 py-0.5">Fecha: {selectedDate}</span>
            </div>

            <div id="punch-table-scroller" className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 uppercase font-black text-[9px] tracking-wider">
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
                      const teacher = users.find(u => u.id === log.teacherId);
                      
                      return (
                        <tr id={`punch-row-${log.id}`} key={log.id} className="hover:bg-slate-50/40">
                          <td className="py-3">
                            <span className="font-bold text-slate-800 text-[11px] block">{teacher?.name}</span>
                          </td>
                          <td className="py-3 font-mono text-[10px] text-slate-500">{teacher?.cedula}</td>
                          <td className="py-3 text-center text-slate-800 font-mono font-bold">{log.clockInTime}</td>
                          <td className="py-3 text-center text-slate-800 font-mono font-bold">{log.clockOutTime || '--:--'}</td>
                          <td className="py-3 text-center">
                            {log.status === 'OnTime' ? (
                              <span className="text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full text-[9px]">Puntual</span>
                            ) : (
                              <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full text-[9px]">Retardo</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {!log.clockOutTime ? (
                              <button
                                id={`row-clockout-${log.id}`}
                                onClick={() => handleTeacherClockOut(log.id)}
                                className="text-[10px] text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded font-bold pointer-events-auto cursor-pointer"
                              >
                                Marcar Salida
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300 font-bold">Completado</span>
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

    </div>
  );
}
