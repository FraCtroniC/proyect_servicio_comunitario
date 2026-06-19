/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  GraduationCap,
  Calendar,
  Award,
  Home,
  Shield,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Lock,
  ClipboardCheck
} from 'lucide-react';

import {
  User,
  Student,
  Subject,
  Classroom,
  ScheduleEvent,
  EvaluationPlan,
  Grade,
  Attendance,
  TeacherScheduleLog,
  UserRole
} from './types';

import {
  initialSubjects,
  initialStudents,
  initialClassrooms,
  initialScheduleEvents,
  seedEvaluationPlans,
  generateSeedGrades,
  initialAttendance,
  initialTeacherLogs
} from './mockData';

import { api } from './services/api';
import {
  mapUsuarioToUser,
  mapEstudianteToStudent,
  mapAulaToClassroom,
  mapAsignaturaToSubject,
  mapHorarioToScheduleEvent,
  mapPlanToEvaluationPlan,
  mapCalificacionToGrade
} from './services/mappers';

// Component imports
import Dashboard from './components/Dashboard';
import UserManager from './components/UserManager';
import AcademicManager from './components/AcademicManager';
import StudentManager from './components/StudentManager';
import StaffManager from './components/StaffManager';
import GradeManager from './components/GradeManager';
import AttendanceTracker from './components/AttendanceTracker';
import ScheduleCoordinator from './components/ScheduleCoordinator';
import FacilitiesManager from './components/FacilitiesManager';
import DocumentationView from './components/DocumentationView';
import LoginScreen from './components/loginScreen';

export default function App() {
  // Global States loaded with seed data representing a Venezuelan Liceo
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Phase 2 Seed arrays from Backend
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [evaluationPlans, setEvaluationPlans] = useState<EvaluationPlan[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Persistence seed arrays
  const [attendance, setAttendance] = useState<Attendance[]>(() =>
    initialAttendance()
  );
  const [teacherLogs, setTeacherLogs] = useState<TeacherScheduleLog[]>(() =>
    initialTeacherLogs
  );

  // Simulated login/role permission state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin'); // SuperAdmin by default so everything is unlocked
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('frontend_new_user');
      const sessionData = sessionStorage.getItem('liceo-auth-session');
      if (storedUser && sessionData) {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession.expiresAt && parsedSession.expiresAt > Date.now()) {
          const user = JSON.parse(storedUser) as User;
          setCurrentUser(user);
          setCurrentUserRole(user.role);
          setIsLoggedIn(true);
        } else {
          sessionStorage.removeItem('liceo-auth-session');
          sessionStorage.removeItem('frontend_new_user');
        }
      }
    } catch (e) {
      console.error('Error al restaurar sesión:', e);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserRole(user.role);
    setIsLoggedIn(true);
    sessionStorage.setItem('frontend_new_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentUserRole('super_admin');
    setActiveTab('dashboard');
    sessionStorage.removeItem('liceo-auth-session');
    sessionStorage.removeItem('frontend_new_user');
  };

  useEffect(() => {
    if (isLoggedIn) {
      const loadInitialData = async () => {
        try {
          const [
            usuariosData, 
            estudiantesData,
            aulasData,
            asignaturasData,
            planesData,
            horariosData,
            calificacionesData
          ] = await Promise.all([
            api.get<any[]>('/api/usuarios'),
            api.get<any[]>('/api/estudiantes'),
            api.get<any[]>('/api/aulas'),
            api.get<any[]>('/api/asignaturas'),
            api.get<any[]>('/api/plan-estudio'),
            api.get<any[]>('/api/horarios'),
            api.get<any[]>('/api/calificaciones')
          ]);
          setUsers(usuariosData.map(mapUsuarioToUser));
          setStudents(estudiantesData.map(mapEstudianteToStudent));
          setClassrooms(aulasData.map(mapAulaToClassroom));
          setSubjects(asignaturasData.map(mapAsignaturaToSubject));
          setEvaluationPlans(planesData.map(mapPlanToEvaluationPlan));
          setScheduleEvents(horariosData.map(mapHorarioToScheduleEvent));
          setGrades(calificacionesData.map((c: any) => mapCalificacionToGrade(c, String(c.id_matricula))));
        } catch (error: any) {
          console.error("Error al cargar datos desde el backend:", error);
          alert("Error al cargar datos desde el backend: " + error.message);
        }
      };
      loadInitialData();
    }
  }, [isLoggedIn]);

  // --- PERSISTENCE ACTIONS PASSED DOWN ---
  const handleAddUser = async (newUser: User) => {
    try {
      const dto = {
        username: newUser.email.split('@')[0], // Aproximación
        password: 'Password123', // Default
        idRol: newUser.role === 'super_admin' ? 1 : (newUser.role === 'control_estudios' ? 2 : 3)
      };
      const created = await api.post<any>('/api/usuarios', dto);
      setUsers(p => [mapUsuarioToUser(created), ...p]);
    } catch (e) {
      console.error(e);
      alert('Error al crear usuario en BD');
    }
  };

  const handleToggleUserActive = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await api.patch(`/api/usuarios/${userId}`, { estatus: user.active ? 'Inactivo' : 'Activo' });
        setUsers(p => p.map(u => u.id === userId ? { ...u, active: !u.active } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      const dto = {
        cedula_escolar: newStudent.cedula,
        nombre1: newStudent.firstName.split(' ')[0],
        apellido1: newStudent.lastName.split(' ')[0],
        fecha_nac: newStudent.dateOfBirth,
        id_representante: 1 // TODO: Necesita implementarse selector de representante
      };
      const created = await api.post<any>('/api/estudiantes', dto);
      setStudents(p => [mapEstudianteToStudent(created), ...p]);
    } catch (e) {
      console.error(e);
      alert('Error al crear estudiante en BD');
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => {
    try {
      await api.patch(`/api/estudiantes/${studentId}`, { estatus_estudiante: status });
      setStudents(p => p.map(s => s.id === studentId ? { ...s, status } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGrade = (stdId: string, subId: string, lap: 1 | 2 | 3, evId: string, score: number) => {
    setGrades(p => {
      // Check if record exists
      const existsIdx = p.findIndex(g => g.studentId === stdId && g.subjectId === subId && g.lapso === lap && g.evaluationId === evId);
      if (existsIdx >= 0) {
        const copy = [...p];
        copy[existsIdx] = { ...copy[existsIdx], score };
        return copy;
      } else {
        return [...p, { studentId: stdId, subjectId: subId, lapso: lap, evaluationId: evId, score }];
      }
    });
  };

  const handleUpdateEvaluationPlan = (subId: string, year: number, section: string, lap: 1 | 2 | 3, evaluations: any[]) => {
    setEvaluationPlans(p => {
      const idx = p.findIndex(plan => plan.subjectId === subId && plan.year === year && plan.section === section && plan.lapso === lap);
      if (idx >= 0) {
        const copy = [...p];
        copy[idx] = { ...copy[idx], evaluations };
        return copy;
      } else {
        return [...p, { subjectId: subId, year: year as any, section, lapso: lap, evaluations }];
      }
    });
  };

  const handleModifyAttendance = (studentId: string, date: string, year: number, section: string, status: 'P' | 'A' | 'J') => {
    setAttendance(p => {
      const idx = p.findIndex(a => a.studentId === studentId && a.date === date);
      if (idx >= 0) {
        const copy = [...p];
        copy[idx] = { ...copy[idx], status };
        return copy;
      } else {
        return [...p, { id: `att-${studentId}-${date}`, studentId, date, academicYear: year as any, section, status }];
      }
    });
  };

  const handleAddTeacherLog = (log: TeacherScheduleLog) => {
    setTeacherLogs(p => [log, ...p]);
  };

  const handleUpdateTeacherLog = (logId: string, clockOut: string) => {
    setTeacherLogs(p => p.map(l => l.id === logId ? { ...l, clockOutTime: clockOut } : l));
  };

  const handleAddScheduleEvent = (evt: ScheduleEvent) => {
    setScheduleEvents(p => [...p, evt]);
  };

  const handleRemoveScheduleEvent = (evtId: string) => {
    setScheduleEvents(p => p.filter(evt => evt.id !== evtId));
  };

  const handleAddClassroom = async (room: Classroom) => {
    try {
      const resp = await api.post<any>('/api/aulas', {
        nombre_codigo: room.name,
        capacidad: room.capacity,
        tipo_espacio: room.type,
        estatus: 'Activo'
      });
      const savedRoom = mapAulaToClassroom(resp);
      setClassrooms(prev => [...prev, savedRoom]);
    } catch (e) {
      console.error(e);
      alert('Error al crear el aula en la base de datos');
    }
  };

  const handleRemoveClassroom = (roomId: string) => {
    setClassrooms(p => p.filter(c => c.id !== roomId));
  };

  // Tabs structure definitions
  const tabs = [
    { id: 'dashboard', label: 'Indicadores', icon: LayoutDashboard },
    { id: 'students', label: 'Matrícula Estudiantes', icon: Users },
    { id: 'academic', label: 'Gestión de Secciones', icon: GraduationCap },
    { id: 'grades', label: 'Notas Calificación', icon: Award },
    { id: 'attendance', label: 'Control Asistencia', icon: Calendar },
    { id: 'schedule', label: 'Estructura Horaria', icon: ClipboardCheck },
    { id: 'facilities', label: 'Salones & Aulas', icon: Home },
    { id: 'staff', label: 'Directorio Personal', icon: BookOpen },
    { id: 'users', label: 'Roles Acceso', icon: Shield },
    { id: 'documentation', label: 'Tesis Arquitectura', icon: BookOpen }
  ];

  // Helper definitions for side-roles indicators
  const getRoleLabelAndColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Director Principal', color: 'bg-red-600 text-white border-red-500' };
      case 'control_estudios':
        return { label: 'Ctrl de Estudios', color: 'bg-indigo-600 text-white border-indigo-500' };
      case 'docente':
        return { label: 'Profesor / Docencia', color: 'bg-emerald-600 text-white border-emerald-500' };
      case 'representante':
        return { label: 'Representante LOPNA', color: 'bg-amber-600 text-white border-amber-500' };
    }
  };

  const { label: currentRoleLabel, color: currentRoleColor } = getRoleLabelAndColor(currentUserRole);

  if (!isLoggedIn) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div id="mppe-app-root" className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col">

      {/* Top Banner Warning context (Simulated) */}
      <div id="simulated-header-badge" className="bg-slate-900 text-slate-300 text-[10px] py-1.5 px-4 text-center font-mono tracking-wider flex items-center justify-between border-b border-slate-800">
        <span className="hidden md:inline">● CONTEXTO SOU-MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN (VENEZUELA)</span>
        <span className="flex items-center gap-1.5 mx-auto md:mx-0">
          🔑 Vista activa para: <strong className="text-white font-black uppercase text-[11px]">{currentRoleLabel}</strong>
          <span className="text-slate-500">|</span>
          Cambiar perspecivas en pestaña <button id="btn-quick-goto-roles" onClick={() => setActiveTab('users')} className="underline hover:text-white pointer-events-auto cursor-pointer">Roles Acceso</button>
        </span>
      </div>

      {/* Main Container Layout */}
      <div id="mppe-main-layout" className="flex-1 flex flex-col md:flex-row">

        {/* SIDEBAR FOR DESKTOP */}
        <aside id="mppe-sidebar" className="hidden md:flex w-64 bg-slate-900 text-slate-300 shrink-0 flex-col justify-between border-r border-slate-800 z-15 select-none">
          <div id="sidebar-top" className="space-y-6 pt-6">

            {/* Brand Logo Banner */}
            <div id="mppe-logo-banner" className="px-6 flex items-center gap-2.5">
              <div className="h-9 w-9 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-lg tracking-wider border border-blue-500">
                EO
              </div>
              <div>
                <span className="block font-black text-white text-xs tracking-wider uppercase leading-none">Estilita Orozco</span>
                <span className="block text-[9px] text-slate-500 font-bold uppercase mt-1">Liceo de Formación Cultural para las Artes</span>
              </div>
            </div>

            {/* Simulated Active Account */}
            <div id="sidebar-account" className="mx-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20 uppercase overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  currentUserRole.substring(0, 2)
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-white font-bold leading-none truncate mb-1">
                  {currentUser?.name || 'Usuario'}
                </span>
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-tight">{currentRoleLabel}</span>
              </div>
            </div>

            {/* Navigation options */}
            <nav id="sidebar-nav" className="px-3 space-y-1">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    id={`sidebar-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-between pointer-events-auto cursor-pointer ${isActive
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{tab.label}</span>
                    </span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Resets and Logout simulation */}
          <div id="sidebar-footer" className="p-4 border-t border-slate-800/60 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full py-2 text-center text-[10px] text-slate-300 hover:text-white font-bold tracking-wide uppercase bg-slate-800/40 hover:bg-slate-700/60 rounded-lg border border-slate-700 hover:border-slate-500 transition-all pointer-events-auto cursor-pointer flex justify-center items-center gap-2"
            >
              <LogOut className="h-3 w-3" /> Cerrar Sesión
            </button>
            <div className="text-[9px] text-slate-600 text-center font-mono leading-relaxed px-2">
              Homologación MPPE Venezuela © 2026. LOPNA compilado.
            </div>
          </div>
        </aside>

        {/* MOBILE MENU NAV HEADER */}
        <header id="mobile-nav-header" className="md:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-600 text-white text-xs font-black rounded flex items-center justify-center">
              LB
            </div>
            <div>
              <span className="block text-xs font-bold text-white uppercase tracking-wider">LB José A. Anzoátegui</span>
              <span className="block text-[8px] text-slate-500 font-bold uppercase">{currentRoleLabel}</span>
            </div>
          </div>

          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded pointer-events-auto cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* MOBILE DRAWER IF OPEN */}
        <AnimatePresence id="mobile-presence">
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu-drawer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 text-slate-300 absolute w-full top-[61px] left-0 z-10 px-4 py-6 space-y-4 select-none"
            >
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      id={`mobile-tab-${tab.id}`}
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 pointer-events-auto cursor-pointer ${isActive
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                        }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs text-slate-300 font-bold uppercase bg-slate-800 rounded-xl border border-slate-700 pointer-events-auto cursor-pointer flex justify-center items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Cerrar Sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN MODULE STAGE */}
        <main id="app-stage-container" className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto block">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full block"
            >

              {/* Tab render switches */}
              {activeTab === 'dashboard' && (
                <Dashboard
                  students={students}
                  users={users}
                  attendance={attendance}
                  grades={grades}
                  subjects={subjects}
                  evaluationPlans={evaluationPlans}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'students' && (
                <StudentManager
                  students={students}
                  currentUserRole={currentUserRole}
                  onAddStudent={handleAddStudent}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                />
              )}

              {activeTab === 'academic' && (
                <AcademicManager
                  students={students}
                  currentUserRole={currentUserRole}
                  onAddStudent={handleAddStudent}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                />
              )}

              {activeTab === 'grades' && (
                <GradeManager
                  students={students}
                  subjects={subjects}
                  evaluationPlans={evaluationPlans}
                  grades={grades}
                  currentUserRole={currentUserRole}
                  onUpdateGrade={handleUpdateGrade}
                  onUpdateEvaluationPlan={handleUpdateEvaluationPlan}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceTracker
                  students={students}
                  users={users}
                  attendance={attendance}
                  teacherLogs={teacherLogs}
                  currentUserRole={currentUserRole}
                  onModifyAttendance={handleModifyAttendance}
                  onAddTeacherLog={handleAddTeacherLog}
                  onUpdateTeacherLog={handleUpdateTeacherLog}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleCoordinator
                  scheduleEvents={scheduleEvents}
                  subjects={subjects}
                  users={users}
                  classrooms={classrooms}
                  currentUserRole={currentUserRole}
                  onAddScheduleEvent={handleAddScheduleEvent}
                  onRemoveScheduleEvent={handleRemoveScheduleEvent}
                />
              )}

              {activeTab === 'facilities' && (
                <FacilitiesManager
                  classrooms={classrooms}
                  scheduleEvents={scheduleEvents}
                  currentUserRole={currentUserRole}
                  onAddClassroom={handleAddClassroom}
                  onRemoveClassroom={handleRemoveClassroom}
                />
              )}

              {activeTab === 'staff' && (
                <StaffManager
                  users={users}
                  currentUserRole={currentUserRole}
                  onSetUserRole={setCurrentUserRole}
                  onAddUser={handleAddUser}
                  onToggleUserActive={handleToggleUserActive}
                />
              )}

              {activeTab === 'users' && (
                <UserManager
                  users={users}
                  currentUserRole={currentUserRole}
                  onSetUserRole={setCurrentUserRole}
                  onAddUser={handleAddUser}
                  onToggleUserActive={handleToggleUserActive}
                />
              )}

              {activeTab === 'documentation' && (
                <DocumentationView />
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>
    </div>
  );
}
