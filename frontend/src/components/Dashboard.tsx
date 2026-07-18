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
  const [showAbsencesModal, setShowAbsencesModal] = useState(false);

  // 1. Stats calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Activo').length;
  const totalTeachers = users.filter(u => u.role === 'docente').length;

  // Calculate attendance rate (Present 'P' / Total records in attendance)
  const totalAttRecords = attendance.filter(a => a.status === 'P' || a.status === 'A');
  const presentRecords = attendance.filter(a => a.status === 'P');
  const attendanceRate = totalAttRecords.length > 0
    ? Math.round((presentRecords.length / totalAttRecords.length) * 100)
    : 0;

  // School General Average Grade (calculating currently available fully graded / partially graded Lapsos)
  const allGrades = grades.map(g => g.score);
  const averageSchoolGrade = allGrades.length > 0
    ? Number((allGrades.reduce((sum, current) => sum + current, 0) / allGrades.length).toFixed(1))
    : 0;

  // 2. Average Grade per Academic Year (1 to 5)
  const averageGradeByYear = (year: number): number => {
    const yearStudents = students.filter(s => s.academicYear === year && s.status === 'Activo').map(s => s.id);
    if (yearStudents.length === 0) return 0;

    const yearGrades = grades.filter(g => yearStudents.includes(g.studentId)).map(g => g.score);
    if (yearGrades.length === 0) return 0;

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

  // Dynamic Bitácora calcs:
  // 1. Lapso Activo (inferred from evaluation plans)
  const lapsos = evaluationPlans.map(ep => ep.lapso);
  const currentLapso = lapsos.length > 0 ? Math.max(...lapsos) : 1;
  const plansInCurrentLapso = evaluationPlans.filter(ep => ep.lapso === currentLapso).length;

  // 2. Carga de Notas (Solo del Lapso Actual del Periodo Activo)
  // Obtenemos todos los IDs de las evaluaciones individuales que pertenecen a los planes del lapso actual
  const currentLapsoEvaluationIds = evaluationPlans
    .filter(ep => ep.lapso === currentLapso)
    .flatMap(ep => ep.evaluations?.map(ev => String(ev.id)) || []);
    
  const totalGradesRecorded = grades.filter(g => 
    g.lapso === currentLapso && currentLapsoEvaluationIds.includes(String(g.evaluationId))
  ).length;

  // 3. Carga de Representantes
  const firstYearStudents = students.filter(s => s.academicYear === 1 && s.status === 'Activo');
  const withRep = firstYearStudents.filter(s => s.representativeCedula && s.representativeCedula.trim() !== '');
  const repPercentage = firstYearStudents.length > 0 ? Math.round((withRep.length / firstYearStudents.length) * 100) : 0;

  // --- NUEVOS INDICADORES DINÁMICOS ---
  // 1. Progreso de Carga Docente
  let expectedGrades = 0;
  evaluationPlans.filter(ep => ep.lapso === currentLapso).forEach(ep => {
    const sectionStudents = students.filter(s => s.academicYear === ep.year && s.section === ep.section && s.status === 'Activo').length;
    const numEvaluations = ep.evaluations?.length || 0;
    expectedGrades += sectionStudents * numEvaluations;
  });
  const cargaDocentePercent = expectedGrades > 0 ? Math.min(100, Math.round((totalGradesRecorded / expectedGrades) * 100)) : 0;

  // 2. Materias Críticas (Promedio más bajo)
  const currentLapsoGrades = grades.filter(g => 
    g.lapso === currentLapso && currentLapsoEvaluationIds.includes(String(g.evaluationId))
  );
  const subjectAverages: Record<string, { total: number, count: number, name: string }> = {};
  currentLapsoGrades.forEach(g => {
      if (!subjectAverages[g.subjectId]) {
          const subj = subjects.find(s => String(s.id) === String(g.subjectId));
          subjectAverages[g.subjectId] = { total: 0, count: 0, name: subj ? subj.name : 'Desconocida' };
      }
      subjectAverages[g.subjectId].total += g.score;
      subjectAverages[g.subjectId].count += 1;
  });
  const criticalSubjects = Object.values(subjectAverages)
      .map(s => ({ name: s.name, avg: s.total / s.count }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 1); // Solo la más crítica

  // 3. Índice de Ausentismo (Inasistencias Críticas > 3)
  const absencesByStudent: Record<string, number> = {};
  attendance.filter(a => a.status === 'A').forEach(a => {
    absencesByStudent[a.studentId] = (absencesByStudent[a.studentId] || 0) + 1;
  });
  const studentsWithCriticalAbsences = Object.entries(absencesByStudent)
    .filter(([_, count]) => count >= 3)
    .map(([studentId, count]) => {
      const student = students.find(s => String(s.id) === String(studentId));
      return { student, count };
    })
    .filter(item => item.student && item.student.status === 'Activo');
  
  const criticalAbsencesCount = studentsWithCriticalAbsences.length;

  // 4. Matrícula por Ciclo
  const cycle1Count = students.filter(s => (s.academicYear === 1 || s.academicYear === 2 || s.academicYear === 3) && s.status === 'Activo').length;
  const cycle1Percent = activeStudents > 0 ? Math.round((cycle1Count / activeStudents) * 100) : 0;

  // Chart Data for New Layout
  const atRiskCount = strugglingStudents.length;
  const regularCount = activeStudents - atRiskCount;
  const riskData = [
    { name: 'En Riesgo', value: atRiskCount, color: '#f43f5e' },
    { name: 'Regulares', value: regularCount, color: '#10b981' }
  ];

  const cargaData = [
    { name: 'Cargado', value: totalGradesRecorded, color: '#3b82f6' },
    { name: 'Pendiente', value: Math.max(0, expectedGrades - totalGradesRecorded), color: '#e2e8f0' }
  ];

  // 5. Approved vs Failed (General approximation based on average grade by year)
  const performanceData = [1, 2, 3, 4, 5].map(year => {
    const yearStudents = students.filter(s => s.academicYear === year);
    let aprobados = 0;
    let aplazados = 0;
    yearStudents.forEach(s => {
      const g = grades.filter(gr => gr.studentId === s.id).map(gr => gr.score);
      const avg = g.length > 0 ? (g.reduce((a, b) => a + b, 0) / g.length) : 0;
      if (g.length > 0 && avg >= 10) aprobados++; else if (g.length > 0) aplazados++;
    });
    return { name: `${year}° Año`, Aprobados: aprobados, Aplazados: aplazados };
  });

  return (
    <div id="dashboard-container" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-blue-100 selection:text-blue-900">

      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden border border-white/10 group">

        {/* Animated & Glassmorphism Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[160%] bg-gradient-to-b from-blue-400/20 to-transparent rotate-12 transform-gpu blur-3xl rounded-full transition-transform duration-1000 group-hover:scale-105"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[80%] bg-indigo-500/20 rotate-45 transform-gpu blur-3xl rounded-full transition-transform duration-700 group-hover:-translate-y-4"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>

          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }}></div>
        </div>

        <div id="banner-content" className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-5 flex-1 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="text-xs font-bold text-blue-100 tracking-widest uppercase">Sistema Operativo</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-4">
              Liceo Nacional Estilita Orozco
            </h1>

            <p className="text-blue-100 text-base md:text-lg lg:text-xl leading-relaxed font-medium max-w-3xl drop-shadow-sm">
              Sistema web para los procesos de gestión académica, control de notas y asistencia del personal.
            </p>
          </div>

          {/* Decorative Right Side Element (Optional but adds a premium feel) */}
          <div className="hidden lg:flex shrink-0 relative w-32 h-32 items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative h-24 w-24 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center transform rotate-12 transition-transform duration-500 hover:rotate-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-200 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div id="kpi-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div id="kpi-card-students" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => onNavigateToTab('students')}>
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
        <div id="kpi-card-teachers" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 hover:shadow-xs transition-all pointer-events-auto cursor-pointer" onClick={() => { sessionStorage.setItem('initialUserFilter', 'docente'); onNavigateToTab('users'); }}>
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

      {/* Main Grid Content: Top detailed stats - Bottom Alerts & logs */}
      <div id="dashboard-content-grid" className="flex flex-col gap-6">

        {/* Top Panel: Grade distributions by Year */}
        <div id="year-performance-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-6">
          <div id="year-perf-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Rendimiento Académico Promedio por Año</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-medium">Escala MPPE (1 - 20)</span>
          </div>

          <div id="performance-chart" className="h-[250px] w-full">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
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
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
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

        {/* Bottom Panel: Alerts & Operational System Reminders */}
        <div id="system-alerts-panel" className="bg-white rounded-xl border border-slate-200/80 p-5">
          <div id="system-alerts-header" className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Notificaciones de Control de Estudios</h3>
          </div>

          <div id="alerts-list" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Col 1: Alertas Críticas */}
            <div className="flex flex-col space-y-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Estado de la Matrícula</span>
              <div className={`flex-1 rounded-2xl border p-6 flex flex-col justify-center relative overflow-hidden ${atRiskCount > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
                {/* Chart Background */}
                <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                  <PieChart width={200} height={200}>
                    <Pie data={riskData} dataKey="value" innerRadius={60} outerRadius={90} startAngle={90} endAngle={-270} stroke="none">
                      {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </div>

                <div className="relative z-10">
                  {atRiskCount > 0 ? (
                    <>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 bg-rose-100 rounded-2xl shadow-sm">
                          <AlertTriangle className="h-8 w-8 text-rose-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-rose-900 tracking-tight">Alerta de Repitencia</h4>
                          <p className="text-sm font-bold text-rose-700">{atRiskCount} estudiante(s) en riesgo</p>
                        </div>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {strugglingStudents.map(s => (
                          <div key={s.id} className="flex items-center justify-between bg-white/70 p-3.5 rounded-xl border border-rose-100 shadow-sm">
                            <div>
                              <span className="block font-bold text-slate-800 text-sm">{s.firstName} {s.lastName}</span>
                              <span className="block text-xs font-semibold text-slate-500 mt-0.5">{s.academicYear}° Año "{s.section}"</span>
                            </div>
                            <button onClick={() => setAlertingStudent(s)} className="text-rose-600 hover:bg-rose-500 hover:text-white bg-rose-100 p-2.5 rounded-lg transition-colors shadow-sm" title="Enviar Alerta">
                              ✉️
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="p-5 bg-emerald-100 rounded-full mb-5 shadow-inner">
                        <CheckCircle className="h-14 w-14 text-emerald-600" />
                      </div>
                      <h4 className="text-2xl font-black text-emerald-900 mb-2">Integridad OK</h4>
                      <p className="text-emerald-700 font-medium text-sm max-w-[250px]">No hay alertas críticas por bajas de rendimiento general.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Col 2: Timetable audit checklist */}
            <div className="flex flex-col space-y-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Bitácora Operativa</span>
              <div className="flex-1 flex flex-col space-y-4">
                
                {/* Item 1 */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Lapso {currentLapso} en Curso</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">{plansInCurrentLapso} planes de evaluación formalmente activos.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Actividad de Notas</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">{totalGradesRecorded} calificaciones auditadas en el sistema.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="w-full">
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Registro LOPNA</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${repPercentage}%` }}></div>
                      </div>
                      <span className="text-sm font-black text-purple-700">{repPercentage}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Col 3: NUEVOS INDICADORES DINÁMICOS */}
            <div className="flex flex-col space-y-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Métricas Estratégicas</span>
              <div className="flex-1 flex flex-col space-y-4">
                
                {/* 1. Progreso de Carga Docente con PieChart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cumplimiento Docente</h4>
                    <span className="text-3xl font-black text-slate-800">{cargaDocentePercent}%</span>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1">Carga de calificaciones esperadas.</p>
                  </div>
                  <div className="h-[90px] w-[90px] shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={cargaData} dataKey="value" innerRadius={30} outerRadius={42} startAngle={90} endAngle={-270} stroke="none">
                          {cargaData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* 2. Materia Crítica */}
                <div className="flex-1 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl p-5 shadow-sm text-white relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute right-[-10px] bottom-[-20px] opacity-15 pointer-events-none">
                    <AlertTriangle className="h-32 w-32" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider mb-2">Asignatura Crítica</h4>
                    <span className="text-2xl font-black block truncate mb-3" title={criticalSubjects.length > 0 ? criticalSubjects[0].name : 'N/A'}>
                      {criticalSubjects.length > 0 ? criticalSubjects[0].name : 'Sin datos'}
                    </span>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/20">
                      <span className="text-sm font-bold">Promedio: {criticalSubjects.length > 0 ? criticalSubjects[0].avg.toFixed(1) : '-'} / 20</span>
                    </div>
                  </div>
                </div>

                {/* 3 & 4. Grid de 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowAbsencesModal(true)}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer transform hover:scale-[1.02]"
                  >
                    <span className="text-3xl font-black text-amber-600 mb-1">{criticalAbsencesCount}</span>
                    <span className="text-[10px] font-bold text-amber-900 uppercase">Alumnos con<br/>3 o más Faltas</span>
                  </button>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm">
                    <span className="text-3xl font-black text-indigo-600 mb-1">{cycle1Percent}%</span>
                    <span className="text-[10px] font-bold text-indigo-900 uppercase">Matrícula<br/>Ciclo Básico</span>
                  </div>
                </div>

              </div>
            </div>
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

      <Modal isOpen={showAbsencesModal} onClose={() => setShowAbsencesModal(false)} title="Alumnos con Faltas Críticas (3 o más)">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-2">
            Estos estudiantes activos tienen 3 o más inasistencias registradas.
          </p>
          {studentsWithCriticalAbsences.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {studentsWithCriticalAbsences.map(item => (
                <div key={item.student!.id} className="flex items-center justify-between bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">{item.student!.firstName} {item.student!.lastName}</span>
                    <span className="block text-xs text-slate-500">{item.student!.academicYear}° Año "{item.student!.section}"</span>
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 bg-amber-100 text-amber-700 font-bold rounded-full text-sm shrink-0" title={`${item.count} Faltas`}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 rounded-lg text-slate-500">
              No hay estudiantes con faltas críticas en este momento.
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setShowAbsencesModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
