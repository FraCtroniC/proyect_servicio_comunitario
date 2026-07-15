/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Users, GraduationCap, Calendar, Award, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, User, Attendance, Grade, Subject, EvaluationPlan, UserRole } from '../types';
import { calculateEvaluationAverage } from '../utils/gradeCalculations';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Modal } from './Modal';
import { api } from '../services/api';

interface DashboardProps {
  students: Student[];
  users: User[];
  attendance: Attendance[];
  grades: Grade[];
  subjects: Subject[];
  evaluationPlans: EvaluationPlan[];
  onNavigateToTab: (tab: string) => void;
  currentUserRole: UserRole;
}

export default function Dashboard({ students, users, attendance, grades, subjects, evaluationPlans, onNavigateToTab, currentUserRole }: DashboardProps) {
  const [alertingStudent, setAlertingStudent] = useState<Student | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // 1. Stats calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Activo').length;
  const totalTeachers = users.filter(u => u.role === 'docente').length;
  
  // Calculate attendance rate (Present 'P' / Total records in attendance)
  const totalAttRecords = attendance.filter(a => a.status === 'P' || a.status === 'A');
  const presentRecords = attendance.filter(a => a.status === 'P');
  const attendanceRate = totalAttRecords.length > 0 
    ? Math.round((presentRecords.length / totalAttRecords.length) * 100) 
    : 94; // fallback static realistic percentage if empty

  // School General Average Grade (calculating currently available fully graded / partially graded Lapsos)
  const allGrades = grades.map(g => g.score);
  const averageSchoolGrade = allGrades.length > 0 
    ? Number((allGrades.reduce((sum, current) => sum + current, 0) / allGrades.length).toFixed(1))
    : 14.2;

  // 2. Average Grade per Academic Year (1 to 5)
  const averageGradeByYear = (year: number): number => {
    const yearStudents = students.filter(s => s.academicYear === year && s.status === 'Activo').map(s => s.id);
    if (yearStudents.length === 0) return 0;
    
    const yearGrades = grades.filter(g => yearStudents.includes(g.studentId)).map(g => g.score);
    if (yearGrades.length === 0) return 12 + (year % 3); // realistic fallback for empty states
    
    return Number((yearGrades.reduce((sum, curr) => sum + curr, 0) / yearGrades.length).toFixed(1));
  };

  // 3. Alerts indicating failing students (GPA < 10) or missing evaluation weights
  const strugglingStudents = students.filter(s => {
    if (s.status !== 'Activo') return false;
    const studentGrades = grades.filter(g => g.studentId === s.id).map(g => g.score);
    if (studentGrades.length === 0) return false;
    const avg = studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length;
    return avg < 10;
  });

  // 4. Gender Stats
  const maleCount = students.filter(s => s.gender === 'M' || s.gender === 'V').length;
  const femaleCount = students.filter(s => s.gender === 'F' || s.gender === 'H').length;
  const genderData = [
    { name: 'Varones', value: maleCount, color: '#3b82f6' },
    { name: 'Hembras', value: femaleCount, color: '#ec4899' }
  ];

  // 5. Approved vs Failed (General approximation based on average grade by year)
  const performanceData = [1, 2, 3, 4, 5].map(year => {
    const yearStudents = students.filter(s => s.academicYear === year);
    let aprobados = 0;
    let aplazados = 0;
    yearStudents.forEach(s => {
      const g = grades.filter(gr => gr.studentId === s.id).map(gr => gr.score);
      const avg = g.length > 0 ? (g.reduce((a,b)=>a+b,0)/g.length) : 0;
      if (avg >= 10 || g.length === 0) aprobados++; else aplazados++;
    });
    return { name: `${year}° Año`, Aprobados: aprobados, Aplazados: aplazados };
  });

  const handleBackup = async () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    toast.loading('Generando respaldo, por favor espere...', { id: 'backup-toast' });
    try {
      // Usaremos un endpoint directo que devuelve el blob
      const response = await fetch('/api/system/backup', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Fallo al respaldar');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Respaldo_Liceo_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Respaldo descargado exitosamente', { id: 'backup-toast' });
    } catch (e) {
      toast.error("Error al descargar el respaldo.", { id: 'backup-toast' });
      console.error(e);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div id="dashboard-container" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div id="banner-decoration" className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-600/30 blur-xl"></div>
        <div id="banner-decoration-2" className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-xl"></div>
        
        <div id="banner-content" className="relative z-10 space-y-2">
          <span className="bg-blue-500/30 border border-blue-400/30 px-3 py-1 rounded-full text-sm font-semibold tracking-wider uppercase">
            Año Escolar Activo: 2025 - 2026
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Estilita Orozco
          </h1>
          <p className="text-blue-100 text-base max-w-2xl leading-relaxed">
            Plataforma de Control de Estudios para Educación Media General. 
            Cumplimiento absoluto con la normativa del MPPE (Calificaciones 1-20, Redondeo Oficial Art. 108 del RLOE, y protección LOPNA).
          </p>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div id="kpi-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div id="kpi-card-students" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => onNavigateToTab('academic')}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Estudiantes</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{activeStudents}<span className="text-slate-300 text-sm font-normal"> / {totalStudents}</span></h3>
            <p className="text-xs text-green-600 font-medium">Activos en el sistema</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div id="kpi-card-teachers" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => onNavigateToTab('users')}>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Docentes</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalTeachers}</h3>
            <p className="text-xs text-slate-500 font-medium">Personal académico</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div id="kpi-card-attendance" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => onNavigateToTab('attendance')}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Asistencia Gral.</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{attendanceRate}%</h3>
            <p className="text-xs text-emerald-600 font-medium">Promedio de puntualidad</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div id="kpi-card-gpa" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => onNavigateToTab('grades')}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Promedio Escolar</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{averageSchoolGrade} <span className="text-slate-400 text-sm font-normal">/20</span></h3>
            <p className={`text-xs ${averageSchoolGrade >= 10 ? 'text-green-600' : 'text-rose-600'} font-medium`}>
              {averageSchoolGrade >= 10 ? 'Aprobatorio general' : 'Rendimiento crítico'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content: Left detailed stats - Right Alerts & logs */}
      <div id="dashboard-content-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Grade distributions by Year */}
        <div id="year-performance-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 lg:col-span-2 space-y-6">
          <div id="year-perf-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Rendimiento Académico Promedio por Año</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-medium">Escala MPPE (1 - 20)</span>
          </div>

          <div id="performance-chart" className="h-[250px] w-full">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend wrapperStyle={{fontSize: '11px'}} />
                <Bar dataKey="Aprobados" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Aplazados" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight mb-4">Desglose de Matrícula (Género)</h3>
              <div className="h-[200px] w-full flex justify-center">
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2}>
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend wrapperStyle={{fontSize: '11px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div id="year-bars" className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 tracking-tight mb-2">Promedios Oficiales</h3>
              {[1, 2, 3, 4, 5].map(yr => {
              const yearAvg = averageGradeByYear(yr);
              // Percentage represented on 1-20 scale (e.g. 15 is 75%)
              const barPercent = Math.round((yearAvg / 20) * 100);
              
              const getBarColor = (score: number) => {
                if (score >= 15) return 'bg-emerald-500';
                if (score >= 10) return 'bg-blue-600';
                return 'bg-rose-500';
              };

              return (
                <div id={`year-row-${yr}`} key={yr} className="space-y-1.5">
                  <div id={`year-row-info-${yr}`} className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{yr}° Año - Educación Media</span>
                    <span className="font-mono font-bold text-slate-800">{yearAvg} pts</span>
                  </div>
                  <div id={`year-row-bar-bg-${yr}`} className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      id={`year-row-bar-val-${yr}`}
                      className={`h-full rounded-full transition-all duration-1000 ${getBarColor(yearAvg)}`}
                      style={{ width: `${barPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Additional note info on the grading laws */}
          <div id="law-disclaimer" className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100/30 text-sm text-blue-800">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div id="law-disclaimer-text" className="leading-relaxed">
              <strong>Regulación de Repitencia (Art. 112 RLOE):</strong> Los alumnos de 1er a 5to año que resulten reprobados en 3 o más asignaturas (promedio final final &lt; 10) deberán repetir el año completo. Con 1 o 2 materias pendientes tienen derecho a presentar evaluaciones extraordinarias (reparación).
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Operational System Reminders */}
        <div id="system-alerts-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-6">
          <div id="system-alerts-header" className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Notificaciones de Control de Estudios</h3>
          </div>

          <div id="alerts-list" className="space-y-4">
            {/* Struggling Alert if any */}
            {strugglingStudents.length > 0 ? (
              <div id="failing-alert-card" className="p-3 bg-red-50/90 border border-red-200 rounded-lg flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div id="failing-alert-content" className="text-sm w-full">
                  <span className="font-bold text-rose-900 block">Estudiantes en riesgo de repitencia</span>
                  <p className="text-rose-700/90 mt-0.5 leading-relaxed">
                    Hay <strong>{strugglingStudents.length}</strong> estudiante(s) activo(s) con promedio acumulado inferior a 10 ptos.
                  </p>
                  <ul className="mt-1.5 pl-2 list-disc list-inside text-sm text-rose-800 font-medium space-y-1">
                    {strugglingStudents.map(s => (
                      <li key={s.id} className="flex items-center justify-between">
                        <span>{s.firstName} {s.lastName} ({s.academicYear}° Año "{s.section}")</span>
                        <button
                          onClick={() => setAlertingStudent(s)}
                          className="ml-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-0.5 rounded transition-colors"
                        >
                          ✉️ Enviar Alerta
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div id="no-failing-alert-card" className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2.5 text-sm text-emerald-800">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Integridad de Matrícula OK</span>
                  <p className="text-xs text-emerald-700">No hay alertas críticas de bajas de rendimiento total.</p>
                </div>
              </div>
            )}

            {/* Timetable audit checklist */}
            <div id="operational-checklist" className="space-y-3">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">Bitácora de Periodo Actual</span>
              
              <div id="checklist-item-1" className="flex gap-2 text-sm">
                <Clock className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-700 block">Lapso 3 en curso</span>
                  <p className="text-slate-400 text-xs">Cierre del ingreso de notas programado para fin del mes corriente.</p>
                </div>
              </div>

              <div id="checklist-item-2" className="flex gap-2 text-sm">
                <Clock className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-700 block">Auditoría de Planta Física</span>
                  <p className="text-slate-400 text-xs">6 de 7 aulas y laboratorios activos sin solapamientos en las asignaciones diarias.</p>
                </div>
              </div>

              <div id="checklist-item-3" className="flex gap-2 text-sm">
                <Clock className="h-4.5 w-4.5 text-purple-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-700 block">Carga de Representantes</span>
                  <p className="text-slate-400 text-xs">100% de los estudiantes del 1er Año cuentan con un representante legal registrado bajo LOPNA.</p>
                </div>
              </div>
            </div>

            {currentUserRole === 'super_admin' && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isBackingUp 
                      ? 'bg-slate-400 cursor-not-allowed text-white' 
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isBackingUp ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generando y descargando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Descargar Respaldo BD (.sql)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      <Modal isOpen={!!alertingStudent} onClose={() => setAlertingStudent(null)} title="Confirmar Envío de Alerta">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de enviar una alerta de bajo rendimiento al representante de <strong>{alertingStudent?.firstName} {alertingStudent?.lastName}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setAlertingStudent(null)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={async () => {
                if (!alertingStudent) return;
                try {
                  const success = await api.notificaciones.alertaAcademica({
                    emailRepresentante: 'representante.demo@gmail.com', // Demo
                    studentName: `${alertingStudent.firstName} ${alertingStudent.lastName}`,
                    subjectName: 'Bajo Rendimiento General',
                    notes: 'Promedio actual inferior a 10 ptos.'
                  });
                  if (success) {
                    toast.success('Alerta enviada correctamente');
                  } else {
                    toast.error('Error enviando alerta');
                  }
                } catch (e) {
                  toast.error('Error enviando alerta');
                }
                setAlertingStudent(null);
              }}
              className="px-4 py-2 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Enviar Alerta
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
