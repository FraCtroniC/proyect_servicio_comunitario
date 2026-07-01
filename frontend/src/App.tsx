/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';
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
  ClipboardCheck,
  Book,
  CalendarDays,
  Briefcase
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
  UserRole,
  StudyPlanItem,
  SchoolPeriod,
  Section,
  Docente
} from './types';

import { api } from './services/api';
import { mapUsuarioToUser, mapEstudianteToStudent, mapAulaToClassroom, mapAsignaturaToSubject, mapPlanToStudyPlanItem, mapHorarioToScheduleEvent, mapCalificacionToGrade, mapPeriodoToSchoolPeriod, mapEvaluacionesDbToPlans, mapNotaParcialToGrade, mapSeccionToSection, mapRepresentanteToRepresentative, mapDocenteToDocenteType } from './services/mappers';

// Component imports
import Dashboard from './components/Dashboard';
import UserManager from './components/UserManager';
import AcademicManager from './components/AcademicManager';
import StudentManager from './components/StudentManager';
import StaffManager from './components/StaffManager';
import DocenteManager from './components/DocenteManager';
import GradeManager from './components/GradeManager';
import AttendanceTracker from './components/AttendanceTracker';
import ScheduleCoordinator from './components/ScheduleCoordinator';
import FacilitiesManager from './components/FacilitiesManager';
import DocumentationView from './components/DocumentationView';
import LoginScreen from './components/loginScreen';
import SubjectManager from './components/SubjectManager';
import PeriodManager from './components/PeriodManager';
import PendingSubjectsManager from './components/PendingSubjectsManager';
import ChatbotAsistente from './components/ChatbotAsistente';
import UserProfileModal from './components/UserProfileModal';

export default function App() {
  // Global States loaded with seed data representing a Venezuelan Liceo
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  
  // Phase 2 Seed arrays from Backend
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [evaluationPlans, setEvaluationPlans] = useState<EvaluationPlan[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlanItem[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [periods, setPeriods] = useState<SchoolPeriod[]>([]);

  const [sections, setSections] = useState<Section[]>([]);
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [referenceData, setReferenceData] = useState<{ dias: any[]; bloques: any[] }>({ dias: [], bloques: [] });

  // Persistence arrays from Backend
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [teacherLogs, setTeacherLogs] = useState<TeacherScheduleLog[]>([]);
  const [matriculasCache, setMatriculasCache] = useState<any[]>([]);

  // Simulated login/role permission state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin'); // SuperAdmin by default so everything is unlocked
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewPendingStudentId, setViewPendingStudentId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const daysAgo = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
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
            calificacionesData,
            auditoriaData,
            periodosData,
            evaluacionesPlanesResp,
            evaluacionesNotasResp,
            seccionesData,
            representantesData,
            diasData,
            bloquesData,
            asistenciasData,
            asistenciasEstudiantesData,
            matriculasData,
            docentesData
          ] = await Promise.all([
            api.get<any[]>('/api/usuarios'),
            api.get<any[]>('/api/estudiantes'),
            api.get<any[]>('/api/aulas'),
            api.get<any[]>('/api/asignaturas'),
            api.get<any[]>('/api/plan-estudio'),
            api.get<any[]>('/api/horarios'),
            api.get<any[]>('/api/calificaciones'),
            api.get<any[]>('/api/auditorias').catch(() => []),
            api.get<any[]>('/api/periodos').catch(() => ({ data: [] })),
            api.get<any[]>('/api/evaluaciones/planes').catch(() => ({ data: [] })),
            api.get<any[]>('/api/evaluaciones/notas').catch(() => ({ data: [] })),
            api.get<any[]>('/api/secciones').catch(() => []),
            api.get<any[]>('/api/representantes').catch(() => []),
            api.get<any[]>('/api/dias').catch(() => []),
            api.get<any[]>('/api/bloques').catch(() => []),
            api.get<any[]>('/api/asistencias?limit=200&fecha_desde=' + daysAgo(60)).catch(() => []),
            api.get<any[]>('/api/asistencias-estudiantes?limit=500&fecha_desde=' + daysAgo(60)).catch(() => []),
            api.get<any[]>('/api/matriculas').catch(() => ({ data: [] })),
            api.get<any[]>('/api/docentes').catch(() => ({ data: [] }))
          ]);
          
          const seccionesMap = aulasData.reduce((acc, a) => {
            if (a.secciones) a.secciones.forEach((s: any) => acc[s.id_seccion] = s);
            return acc;
          }, {});

          setUsers(usuariosData.map(mapUsuarioToUser));
          const parsedDocentes = (Array.isArray(docentesData) ? docentesData : (docentesData as any)?.data || []).map(mapDocenteToDocenteType);
          setDocentes(parsedDocentes);
          setStudents(estudiantesData.map((s: any) => mapEstudianteToStudent(s, Array.isArray(matriculasData) ? matriculasData : (matriculasData as any)?.data || [], Array.isArray(seccionesData) ? seccionesData : [])));
          setClassrooms(aulasData.map(mapAulaToClassroom));
          setSubjects(asignaturasData.map((a: any) => mapAsignaturaToSubject(a, planesData)));
          
          const studyPlansList = planesData.map(mapPlanToStudyPlanItem);
          setStudyPlans(studyPlansList);
          
          const dbEvaluationsList = (Array.isArray((evaluacionesPlanesResp as any)?.data) ? (evaluacionesPlanesResp as any).data : (Array.isArray(evaluacionesPlanesResp) ? evaluacionesPlanesResp : [])) || [];
          const dbPlans = mapEvaluacionesDbToPlans(dbEvaluationsList, planesData, seccionesMap);
          
          setEvaluationPlans(dbPlans);

          setScheduleEvents(horariosData.map(mapHorarioToScheduleEvent));

          // Use Partial Grades if they exist, fallback to Calificaciones
          const dbNotasParciales = (Array.isArray((evaluacionesNotasResp as any)?.data) ? (evaluacionesNotasResp as any).data : (Array.isArray(evaluacionesNotasResp) ? evaluacionesNotasResp : [])) || [];
          if (dbNotasParciales.length > 0) {
            setGrades(dbNotasParciales.map((n: any) => mapNotaParcialToGrade(n, String(n.id_matricula))));
          } else {
            setGrades(calificacionesData.map((c: any) => mapCalificacionToGrade(c, String(c.id_matricula))));
          }
          
          setAuditLogs(auditoriaData.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()));
          const periodosList = Array.isArray(periodosData) ? periodosData : (periodosData as any)?.data || [];
          setPeriods(periodosList.map(mapPeriodoToSchoolPeriod));
          setSections((Array.isArray(seccionesData) ? seccionesData : []).map(mapSeccionToSection));
          setRepresentatives(Array.isArray(representantesData) ? representantesData : []);
          setReferenceData({
            dias: Array.isArray(diasData) ? diasData : [],
            bloques: Array.isArray(bloquesData) ? bloquesData : []
          });

          // Cache matrículas
          const matriculasList = Array.isArray(matriculasData) ? matriculasData : (matriculasData as any)?.data || [];
          setMatriculasCache(matriculasList);

          // Set Asistencias
          if (Array.isArray(asistenciasData)) {
            setTeacherLogs(asistenciasData.map((a: any) => ({
              id: String(a.id_asistencia),
              teacherId: String(a.id_docente),
              date: a.fecha,
              clockInTime: a.hora_entrada,
              clockOutTime: a.hora_salida,
              status: a.estatus === 'Puntual' ? 'OnTime' : a.estatus === 'Retardo' ? 'Late' : a.estatus === 'Justificado' ? 'Justified' : 'Absent',
              justificaciones: a.justificaciones || []
            })));
          }

          if (Array.isArray(asistenciasEstudiantesData)) {
            setAttendance(asistenciasEstudiantesData.map((a: any) => ({
              id: String(a.id_asistencia_est),
              studentId: String(a.matricula?.id_estudiante || ''),
              matriculaId: String(a.id_matricula),
              date: a.fecha,
              academicYear: a.matricula?.seccion?.id_grado || 1,
              section: a.matricula?.seccion?.letra || 'A',
              status: a.estatus === 'Ausente' ? 'A' : (a.estatus === 'Justificado' ? 'J' : 'P')
            })));
          }
        } catch (error: any) {
          console.error("Error al cargar datos desde el backend:", error);
          toast.error("Error al cargar datos desde el backend: " + error.message);
        }
      };
      loadInitialData();
    }
  }, [isLoggedIn]);

  // --- PERSISTENCE ACTIONS PASSED DOWN ---
  const handleAddDocente = async (newDocente: Omit<Docente, 'id'>) => {
    try {
      const payload = {
        cedula_docente: newDocente.cedula.replace('V-', '').replace('E-', ''), // backend handles raw
        nombre1: newDocente.firstName,
        nombre2: newDocente.secondName,
        apellido1: newDocente.lastName,
        apellido2: newDocente.secondLastName,
        id_especialidad: newDocente.id_especialidad,
        fecha_nac: newDocente.dateOfBirth,
        telefono: newDocente.phone,
        correo: newDocente.email
      };
      const createdDocente = await api.post<any>('/api/docentes', payload);
      
      const parsedDocente = mapDocenteToDocenteType(createdDocente);
      setDocentes(p => [parsedDocente, ...p]);

      // Automatically create user for login
      if (newDocente.email) {
        const tempPassword = 'Temp' + Math.random().toString(36).slice(2, 8) + '1!';
        const userDto = {
          username: newDocente.email.split('@')[0],
          password: tempPassword,
          idRol: 2, // Docente
          idDocente: createdDocente.id_docente || createdDocente.id,
          correo: newDocente.email
        };
        const createdUser = await api.post<any>('/api/usuarios', userDto).catch(e => console.warn('Error creating user for docente:', e.message));
        if (createdUser) {
          setUsers(p => [mapUsuarioToUser(createdUser), ...p]);
        }
      }
    } catch (e: any) {
      console.error(e);
      throw new Error(e.response?.data?.error?.message || 'Error al crear docente en BD');
    }
  };

  const handleToggleDocenteActive = async (docenteId: string) => {
    try {
      const docente = docentes.find(d => d.id === docenteId);
      if (docente) {
        const newStatus = docente.status === 'Activo' ? 'Inactivo' : 'Activo';
        await api.patch(`/api/docentes/${stripId(docenteId)}`, { estatus: newStatus });
        setDocentes(p => p.map(d => d.id === docenteId ? { ...d, status: newStatus } : d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async (newUser: User) => {
    try {
      const tempPassword = 'Temp' + Math.random().toString(36).slice(2, 8) + '1!';
      const dto = {
        username: newUser.email.split('@')[0],
        password: tempPassword,
        idRol: newUser.role === 'super_admin' ? 1 : (newUser.role === 'docente' ? 2 : 3)
      };
      const created = await api.post<any>('/api/usuarios', dto);
      setUsers(p => [mapUsuarioToUser(created), ...p]);
    } catch (e) {
      console.error(e);
      toast.error('Error al crear usuario en BD');
    }
  };

  const stripId = (id: string) => id.replace(/^[a-zA-Z]+-/, '');

  const handleToggleUserActive = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await api.patch(`/api/usuarios/${stripId(userId)}`, { estatus: user.active ? 'Inactivo' : 'Activo' });
        setUsers(p => p.map(u => u.id === userId ? { ...u, active: !u.active } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      const repPayload: any = {
        cedula_rep: newStudent.representativeCedula,
        nombre1: newStudent.repFirstName || newStudent.representativeName.split(' ')[0] || '',
        apellido1: newStudent.repLastName || newStudent.representativeName.split(' ').slice(1).join(' ') || '',
        telefono: newStudent.representativePhone
      };
      if (newStudent.repSecondName) repPayload.nombre2 = newStudent.repSecondName;
      if (newStudent.repSecondLastName) repPayload.apellido2 = newStudent.repSecondLastName;
      if (newStudent.representativeEmail) repPayload.correo = newStudent.representativeEmail;
      if (newStudent.representativeAddress) repPayload.direccion = newStudent.representativeAddress;

      const createdRep = await api.post<any>('/api/representantes', repPayload);
      const repId = createdRep.id_representante || createdRep.id;

      const stuNameParts = newStudent.firstName.trim().split(' ');
      const stuLastParts = newStudent.lastName.trim().split(' ');
      const estPayload: any = {
        cedula_escolar: newStudent.cedula,
        nombre1: stuNameParts[0] || '',
        apellido1: stuLastParts[0] || '',
        fecha_nac: newStudent.dateOfBirth,
        id_representante: Number(repId),
        estatus_estudiante: 'Activo'
      };
      if (stuNameParts.length > 1) estPayload.nombre2 = stuNameParts.slice(1).join(' ');
      if (stuLastParts.length > 1) estPayload.apellido2 = stuLastParts.slice(1).join(' ');
      if (newStudent.gender) estPayload.genero = newStudent.gender;
      if (newStudent.birthPlace) estPayload.lugar_nac = newStudent.birthPlace;
      if (newStudent.municipality) estPayload.municipio = newStudent.municipality;
      if (newStudent.state) estPayload.estado = newStudent.state;

      const created = await api.post<any>('/api/estudiantes', estPayload);
      const studentId = created.id_estudiante || created.id;

      const activePeriod = periods.find(p => p.status === 'Activo');
      const matchingSection = sections.find(s => s.grade === newStudent.academicYear && s.letter === newStudent.section);
      if (activePeriod && matchingSection) {
        await api.post('/api/matriculas', {
          id_estudiante: Number(studentId),
          id_seccion: Number(matchingSection.id),
          id_periodo: Number(activePeriod.id),
          estatus_matricula: 'Activo'
        }).catch((e: any) => console.warn('Matrícula no creada:', e.message));
      }

      setStudents(p => [{ ...newStudent, id: String(studentId) }, ...p]);
    } catch (e) {
      console.error(e);
      toast.error('Error al crear estudiante en BD');
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => {
    try {
      await api.patch(`/api/estudiantes/${stripId(studentId)}`, { estatus_estudiante: status });
      setStudents(p => p.map(s => s.id === studentId ? { ...s, status } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStudentProfile = async (studentId: string, updatedData: Student) => {
    try {
      const realId = stripId(studentId);
      
      const stuNameParts = updatedData.firstName.trim().split(' ');
      const stuLastParts = updatedData.lastName.trim().split(' ');
      const estPayload: any = {
        cedula_escolar: updatedData.cedula,
        nombre1: stuNameParts[0] || '',
        nombre2: stuNameParts.slice(1).join(' ') || undefined,
        apellido1: stuLastParts[0] || '',
        apellido2: stuLastParts.slice(1).join(' ') || undefined,
        fecha_nac: updatedData.dateOfBirth,
        genero: updatedData.gender,
        lugar_nac: updatedData.birthPlace,
        municipio: updatedData.municipality,
        estado: updatedData.state,
        estatus_estudiante: updatedData.status
      };
      
      const stuResp = await api.get<any>(`/api/estudiantes/${realId}`);
      const repId = stuResp.data?.id_representante;
      
      await api.patch(`/api/estudiantes/${realId}`, estPayload);
      
      if (repId) {
        const repPayload: any = {
          cedula_rep: updatedData.representativeCedula,
          nombre1: updatedData.repFirstName || updatedData.representativeName.split(' ')[0],
          nombre2: updatedData.repSecondName || undefined,
          apellido1: updatedData.repLastName || updatedData.representativeName.split(' ').slice(1).join(' ') || 'N/A',
          apellido2: updatedData.repSecondLastName || undefined,
          telefono: updatedData.representativePhone,
          correo: updatedData.representativeEmail,
          direccion: updatedData.representativeAddress
        };
        await api.patch(`/api/representantes/${repId}`, repPayload);
      }
      
      setStudents(p => p.map(s => s.id === studentId ? { ...s, ...updatedData } : s));
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleAddStudyPlanItem = async (name: string, year: number, codigo: string, posicion: number) => {
    try {
      // 1. Check if subject exists or create it
      let subjectId = subjects.find(s => s.name.toLowerCase() === name.toLowerCase())?.id;
      
      if (!subjectId) {
        const subResp = await api.post<any>('/api/asignaturas', {
          nombre: name,
          tipo_calificacion: 'Cuantitativa'
        });
        const newSub = mapAsignaturaToSubject(subResp);
        setSubjects(p => [...p, newSub]);
        subjectId = newSub.id;
      }

      // 2. Create the plan_estudio record
      const planResp = await api.post<any>('/api/plan-estudio', {
        id_asignatura: Number(subjectId),
        id_grado: year,
        codigo_asignatura: codigo,
        posicion: posicion
      });
      
      const newItem = mapPlanToStudyPlanItem(planResp);
      // Mapeador fallback si backend no devuelve el join
      newItem.subjectName = name;
      newItem.year = year as any;
      
      setStudyPlans(p => [...p, newItem]);
    } catch (e) {
      console.error(e);
      toast.error('Error al añadir la materia al plan de estudio en la BD');
    }
  };

  const handleUpdateSubject = async (id: string, name: string) => {
    try {
      await api.patch(`/api/asignaturas/${stripId(id)}`, { nombre: name });
      setSubjects(p => p.map(s => s.id === id ? { ...s, name, shortName: name.substring(0, 3).toUpperCase() } : s));
    } catch (e) {
      console.error(e);
      toast.error('Error al actualizar la asignatura en la base de datos');
    }
  };

  const handleAddPeriod = async (name: string, status: 'Activo' | 'Planificación') => {
    try {
      const resp = await api.post<any>('/api/periodos', {
        nombre: name,
        estatus: status
      });
      setPeriods(p => [...p, mapPeriodoToSchoolPeriod(resp)]);
    } catch (e) {
      console.error(e);
      toast.error('Error al crear periodo escolar');
    }
  };

  const handleUpdatePeriodStatus = async (id: string, newStatus: 'Activo' | 'Cerrado' | 'Planificación') => {
    try {
      await api.patch(`/api/periodos/${stripId(id)}`, { estatus: newStatus });
      setPeriods(p => p.map(per => per.id === id ? { ...per, status: newStatus } : per));
    } catch (e) {
      console.error(e);
      toast.error('Error al actualizar periodo escolar');
    }
  };

  const handleCreateSection = async (periodId: string, grade: number, letter: string, teacherGuideId: string, homeClassroomId: string) => {
    try {
      const payload = {
        id_periodo: Number(periodId),
        id_grado: grade,
        letra: letter,
        id_docente_guia: Number(teacherGuideId.replace(/\D/g, '')) || 1,
        id_aula: Number(homeClassroomId.replace(/\D/g, '')) || undefined
      };
      const created = await api.post<any>('/api/secciones', payload);
      const newSection = mapSeccionToSection(created);
      if (homeClassroomId && !newSection.homeClassroomId) {
         newSection.homeClassroomId = homeClassroomId; // inject locally if backend drops it
      }
      setSections(p => [...p, newSection]);
      return newSection;
    } catch (e: any) {
      console.error('Error al crear sección:', e);
      const msg = e.response?.data?.error?.message || e.message || 'Error desconocido';
      throw new Error(msg);
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

  const handleSaveGrades = async (gradesToSave: Grade[], subjectName: string, year: number, section: string, lapso: number, detalles?: any[], planEvaluaciones?: any[]) => {
    try {
      const payload = gradesToSave.map(g => {
        const evId = Number(g.evaluationId);
        if (isNaN(evId)) {
          throw new Error("MOCK_PLAN");
        }
        return {
          id_estudiante: Number(g.studentId.replace('std-', '')),
          id_evaluacion: evId,
          id_escala: g.score,
        };
      });

      await api.post('/api/evaluaciones/notas/bulk', { notas_parciales: payload });

      const auditPayload = {
        id_usuario: currentUser ? Number(currentUser.id.replace(/\D/g, '')) || 1 : 1,
        accion: 'GUARDAR_NOTAS',
        tabla_afectada: 'notas_parciales',
        valores_nuevos: { asignatura: subjectName, year: year, section: section, lapso, detalles, planEvaluaciones }
      };
      const createdAudit = await api.post<any>('/api/auditorias', auditPayload);
      setAuditLogs(p => [createdAudit, ...p]);

    } catch (e: any) {
      console.error("Error al guardar calificaciones:", e);
      if (e.message === "MOCK_PLAN") {
        toast.error("⚠️ ATENCIÓN: Debes 'Configurar Plan de Evaluación' para esta asignatura y lapso antes de guardar calificaciones.", { duration: 6000 });
        return;
      }
      const msg = e.response?.data?.error?.message || e.message || "Error desconocido";
      toast.error(`Error al guardar las calificaciones en la base de datos: ${msg}`);
      throw e;
    }
  };

  const handleUpdateEvaluationPlan = async (subId: string, year: number, section: string, lap: 1 | 2 | 3, evaluations: any[]) => {
    try {
      const plan = studyPlans.find(p => p.subjectId === subId && Number(p.year) === year);
      if (!plan) throw new Error("Plan de estudio no encontrado para esta materia y año");
      
      const realPlanId = Number(plan.id);
      
      const seccion = sections.find(s => s.grade === year && s.letter === section);
      const realSectionId = seccion ? Number(seccion.id) : 1;
      
      const payload = {
        id_plan: realPlanId,
        id_seccion: realSectionId,
        id_momento: lap,
        evaluaciones: evaluations.map(e => ({
          id_evaluacion: e.id && !String(e.id).includes('-') ? Number(e.id) : null,
          descripcion: e.name,
          ponderacion: e.percentage
        }))
      };

      const result = await api.post<any[]>('/api/evaluaciones/planes', payload);
      
      // Update local state with real IDs from DB
      setEvaluationPlans(p => {
        const copy = [...p];
        const idx = copy.findIndex(pl => pl.subjectId === subId && pl.year === year && pl.section === section && pl.lapso === lap);
        
        const mappedEvs = result.map((r: any) => ({
          id: String(r.id_evaluacion),
          name: r.descripcion,
          percentage: r.ponderacion
        }));
        
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], evaluations: mappedEvs };
        } else {
          copy.push({ subjectId: subId, year: year as any, section, lapso: lap, evaluations: mappedEvs });
        }
        return copy;
      });

      toast.success("Plan de Evaluación guardado permanentemente en la base de datos.");
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.error?.message || e.message || "Error de conexión";
      toast.error(`Error al guardar el plan de evaluación: ${msg}`);
    }
  };

  const resolveMatriculaId = (studentId: string, year: number, section: string): number | null => {
    const activePeriod = periods.find(p => p.status === 'Activo');
    const matchingSection = sections.find(s => s.grade === year && s.letter === section);
    if (!activePeriod || !matchingSection) return null;

    const numStudentId = Number(studentId.replace(/\D/g, '')) || Number(studentId);
    const matricula = matriculasCache.find(
      m => m.id_estudiante === numStudentId
        && m.id_periodo === Number(activePeriod.id)
        && m.id_seccion === Number(matchingSection.id)
    );
    return matricula ? matricula.id_matricula : null;
  };

  const handleModifyAttendance = async (studentId: string, date: string, year: number, section: string, status: 'P' | 'A' | 'J', observacion?: string) => {
    try {
      const dbStatus = status === 'P' ? 'Presente' : (status === 'A' ? 'Ausente' : 'Justificado');

      // Try to get matriculaId from existing record first, then resolve from cache
      const existingAtt = attendance.find(a => a.studentId === studentId && a.date === date);
      let matriculaId: number | null = existingAtt?.matriculaId ? Number(existingAtt.matriculaId) : null;
      if (!matriculaId) {
        matriculaId = resolveMatriculaId(studentId, year, section);
      }

      if (!matriculaId) {
        console.error('No se encontró matrícula para el estudiante', studentId);
        toast.error('Error: No se encontró la matrícula del estudiante. Verifique que esté matriculado en el período activo.');
        return;
      }

      const payload: any = {
        id_matricula: matriculaId,
        fecha: date,
        estatus: dbStatus,
      };
      if (observacion) {
        payload.observacion = observacion;
      }

      if (existingAtt && existingAtt.id.startsWith('att-')) {
        const created = await api.post<any>('/api/asistencias-estudiantes', payload);
        setAttendance(p => {
          const idx = p.findIndex(a => a.studentId === studentId && a.date === date);
          if (idx >= 0) {
            const copy = [...p];
            copy[idx] = { ...copy[idx], status, id: String(created.id_asistencia_est || created.id) };
            return copy;
          }
          return [...p, { id: String(created.id_asistencia_est || created.id), studentId, matriculaId: String(matriculaId), date, academicYear: year as any, section, status }];
        });
      } else if (existingAtt) {
        await api.patch(`/api/asistencias-estudiantes/${existingAtt.id}`, { estatus: dbStatus, ...(observacion ? { observacion } : {}) });
        setAttendance(p => p.map(a => a.id === existingAtt.id ? { ...a, status, matriculaId: String(matriculaId) } : a));
      } else {
        const created = await api.post<any>('/api/asistencias-estudiantes', payload);
        setAttendance(p => [...p, { id: String(created.id_asistencia_est || created.id), studentId, matriculaId: String(matriculaId), date, academicYear: year as any, section, status }]);
      }
    } catch (e: any) {
      console.error('Error al guardar asistencia estudiantil', e);
      toast.error('Error al guardar asistencia: ' + (e?.response?.data?.error?.message || e.message));
    }
  };

  const handleAddTeacherLog = async (log: TeacherScheduleLog) => {
    try {
      const user = users.find(u => u.id === log.teacherId);
      const idDocente = user?.teacherId ? Number(user.teacherId) : Number(log.teacherId.replace(/\D/g, '')) || 1;
      const payload = {
        id_docente: idDocente,
        fecha: log.date,
        hora_entrada: log.clockInTime,
      };
      const created = await api.post<any>('/api/asistencias', payload);
      const serverStatus = created?.estatus === 'Puntual' ? 'OnTime' : created?.estatus === 'Retardo' ? 'Late' : 'Absent';
      setTeacherLogs(p => [{ ...log, id: String(created.id_asistencia || created.id), status: serverStatus }, ...p]);
    } catch (e: any) {
      console.error('Error al registrar entrada:', e);
      toast.error('Error al registrar entrada: ' + (e?.response?.data?.error?.message || e.message));
    }
  };

  const handleSyncInasistencias = async (ids_matricula: string[]) => {
    if (ids_matricula.length === 0) return;
    try {
      const result = await api.post<any>(`/api/asistencias-estudiantes/sync-inasistencias-batch`, { ids_matricula });
      console.log('Inasistencias sincronizadas:', result);
      toast.success(`Inasistencias sincronizadas correctamente para ${ids_matricula.length} estudiante(s).`);
    } catch (e: any) {
      console.error('Error al sincronizar inasistencias', e);
      toast.error('Error al sincronizar inasistencias: ' + (e?.response?.data?.error?.message || e.message));
    }
  };

  const handleUpdateTeacherLog = async (logId: string, clockOut: string) => {
    try {
      const id = Number(logId.replace(/\D/g, ''));
      if (id) {
        await api.patch(`/api/asistencias/${id}`, { hora_salida: clockOut });
      }
    } catch (e: any) {
      console.error('Error al registrar salida:', e);
      toast.error('Error al registrar salida: ' + (e?.response?.data?.error?.message || e.message));
      return;
    }
    setTeacherLogs(p => p.map(l => l.id === logId ? { ...l, clockOutTime: clockOut } : l));
  };

  const handleJustifyTeacherAbsence = async (logId: string, motivo: string, soporteDigital?: string) => {
    try {
      const idAsistencia = Number(logId.replace(/\D/g, ''));
      if (idAsistencia) {
        const payload: any = { id_asistencia: idAsistencia, motivo };
        if (soporteDigital) payload.soporte_digital = soporteDigital;
        
        const resp = await api.post<any>('/api/justificaciones', payload);
        const newJustificacion = resp.data;
        
        setTeacherLogs(p => p.map(l => {
          if (l.id === logId) {
            const currentJusts = l.justificaciones || [];
            return { 
              ...l, 
              status: 'Justified', 
              justificaciones: [...currentJusts, newJustificacion] 
            };
          }
          return l;
        }));
        
        return true;
      }
      return false;
    } catch (e: any) {
      console.error('Error al registrar justificación:', e);
      toast.error('Error al registrar justificación: ' + (e?.response?.data?.error?.message || e.message));
      return false;
    }
  };

  const handleAddScheduleEvent = async (evt: ScheduleEvent) => {
    try {
      const dayMap: Record<string, number> = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5 };
      const idDia = dayMap[evt.day] || 1;
      const bloque = referenceData.bloques.find((b: any) =>
        `${b.hora_inicio} - ${b.hora_fin}` === evt.timeBlock ||
        `${b.hora_inicio.substring(0, 5)} - ${b.hora_fin.substring(0, 5)}` === evt.timeBlock
      );
      const idBloque = bloque?.id_bloque || Number(evt.timeBlock.split(':')[0]) || 1;
      const seccion = sections.find(s => s.grade === evt.year && s.letter === evt.section);
      const user = users.find(u => u.id === evt.teacherId);
      const idDocente = user?.teacherId ? Number(user.teacherId) : Number(evt.teacherId.replace(/\D/g, '')) || 1;

      const payload = {
        id_docente: idDocente,
        id_asignatura: Number(evt.subjectId.replace(/\D/g, '')) || Number(evt.subjectId),
        id_seccion: seccion ? Number(seccion.id) : 1,
        id_dia: idDia,
        id_bloque: idBloque,
        id_aula: Number(evt.classroomId.replace(/\D/g, '')) || Number(evt.classroomId)
      };

      const created = await api.post<any>('/api/horarios', payload);
      setScheduleEvents(p => [...p, { ...evt, id: String(created.id_horario || created.id) }]);
    } catch (e: any) {
      console.error('Error al crear horario:', e);
      toast.error('Error al guardar horario en BD: ' + (e.message || 'Error desconocido'));
    }
  };

  const handleRemoveScheduleEvent = async (evtId: string) => {
    try {
      const id = Number(evtId.replace(/\D/g, ''));
      if (id) {
        await api.delete(`/api/horarios/${id}`);
      }
      setScheduleEvents(p => p.filter(evt => evt.id !== evtId));
    } catch (e) {
      console.error('Error al eliminar horario:', e);
      setScheduleEvents(p => p.filter(evt => evt.id !== evtId));
    }
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
      toast.error('Error al crear el aula en la base de datos');
    }
  };

  const handleRemoveClassroom = async (roomId: string) => {
    try {
      const id = Number(roomId.replace(/\D/g, ''));
      if (id) {
        await api.delete(`/api/aulas/${id}`);
      }
      setClassrooms(p => p.filter(c => c.id !== roomId));
    } catch (e) {
      console.error('Error al eliminar aula:', e);
      setClassrooms(p => p.filter(c => c.id !== roomId));
    }
  };

  // Tabs structure definitions grouped hierarchically
  const tabGroups = [
    {
      group: 'Principal',
      items: [
        { id: 'dashboard', label: 'Indicadores', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Académico',
      items: [
        { id: 'students', label: 'Estudiantes', icon: Users },
        { id: 'academic', label: 'Gestión de Secciones', icon: GraduationCap },
        { id: 'docentes', label: 'Gestión de Docentes', icon: Briefcase },
        { id: 'grades', label: 'Calificaciones', icon: Award },
        { id: 'pendientes', label: 'Materias Pendientes', icon: BookOpen },
        { id: 'attendance', label: 'Control Asistencia', icon: Calendar }
      ]
    },
    {
      group: 'Planificación',
      items: [
        { id: 'periods', label: 'Periodos Escolares', icon: CalendarDays },
        { id: 'subjects', label: 'Plan de Estudio', icon: Book },
        { id: 'schedule', label: 'Estructura Horaria', icon: ClipboardCheck }
      ]
    },
    {
      group: 'Administración',
      items: [
        { id: 'facilities', label: 'Salones & Aulas', icon: Home },
        { id: 'users', label: 'Roles de Acceso', icon: Shield }
      ]
    },
    {
      group: 'Sistema',
      items: [
        { id: 'documentation', label: 'Documentación', icon: BookOpen }
      ]
    }
  ];

  // Flattened for easy lookup if needed
  const tabs = tabGroups.flatMap(g => g.items);

  // Helper definitions for side-roles indicators
  const getRoleLabelAndColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Director Principal', color: 'bg-red-600 text-white border-red-500' };
      case 'control_estudios':
        return { label: 'Ctrl de Estudios', color: 'bg-indigo-600 text-white border-indigo-500' };
      case 'docente':
        return { label: 'Profesor / Docencia', color: 'bg-emerald-600 text-white border-emerald-500' };
    }
  };

  const { label: currentRoleLabel, color: currentRoleColor } = getRoleLabelAndColor(currentUserRole);

  if (!isLoggedIn) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  const CHATBOT_ROLE_MAP: Record<UserRole, number> = {
    super_admin: 1,
    control_estudios: 2,
    docente: 3,
  };

  return (
    <div id="mppe-app-root" className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col">
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 4000, 
          style: { fontSize: '13px', fontWeight: 'bold', borderRadius: '12px' },
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }, duration: 6000 }
        }} 
      />

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
        <aside id="mppe-sidebar" className="hidden md:flex w-64 bg-slate-900 text-slate-300 shrink-0 flex-col justify-between border-r border-slate-800 z-20 select-none relative">
          <div id="sidebar-top" className="flex-1 flex flex-col min-h-0 pt-6">

            {/* Brand Logo Banner */}
            <div id="mppe-logo-banner" className="px-5 mb-8 flex items-center gap-3 shrink-0 relative mt-2">
              <div className="absolute left-3 top-0 w-10 h-10 bg-blue-500/30 blur-xl rounded-full"></div>
              <div className="h-11 w-11 bg-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center border border-white/10 relative z-10 overflow-hidden">
                <img src="/logo_leo.jpg" alt="Logo LEO" className="h-full w-full object-cover" />
              </div>
              <div className="relative z-10">
                <span className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 text-sm tracking-widest uppercase leading-none mb-1">
                  Estilita Orozco
                </span>
                <span className="block text-[8.5px] text-indigo-300/80 font-bold uppercase tracking-widest leading-tight">
                  Liceo de Formación<br/>Cultural para las Artes
                </span>
              </div>
            </div>

            {/* Navigation options */}
            <nav id="sidebar-nav" className="px-3 pb-6 flex-1 overflow-y-auto">
              {tabGroups.map((group, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h3 className="px-3 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {group.group}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map(tab => {
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
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Quick Resets and Logout simulation */}
          <div id="sidebar-footer" className="p-4 border-t border-slate-800/60 space-y-3">
            {/* Simulated Active Account */}
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2.5 overflow-hidden w-full text-left pointer-events-auto cursor-pointer hover:bg-slate-700/30 rounded-lg p-1.5 -m-1.5 transition-colors"
              >
                <div className="h-9 w-9 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/30 uppercase overflow-hidden">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    currentUserRole.substring(0, 2)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-white font-bold text-xs leading-none truncate mb-1">
                    {currentUser?.name || 'Usuario'}
                  </span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate">{currentRoleLabel}</span>
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-rose-500/50 transition-all pointer-events-auto cursor-pointer flex justify-center items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" /> Cerrar Sesión
              </button>
            </div>
            
            <div className="text-[9px] text-slate-600 text-center font-mono leading-relaxed px-2">
              Homologación MPPE Venezuela © 2026. LOPNA compilado.
            </div>
          </div>
        </aside>

        {/* MOBILE MENU NAV HEADER */}
        <header id="mobile-nav-header" className="md:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white shadow-md shadow-blue-500/20 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
              <img src="/logo_leo.jpg" alt="Logo LEO" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="block text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 uppercase tracking-widest leading-none mb-0.5">Estilita Orozco</span>
              <span className="block text-[8px] text-indigo-300/80 font-bold uppercase tracking-widest">{currentRoleLabel}</span>
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
              className="md:hidden bg-slate-900 border-b border-slate-800 text-slate-300 absolute w-full top-[61px] left-0 z-40 px-4 py-6 space-y-4 select-none shadow-2xl"
            >
              <nav className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                {tabGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="px-3 mb-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {group.group}
                    </h3>
                    {group.items.map(tab => {
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
                  </div>
                ))}
              </nav>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center text-xs text-white font-black uppercase bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm border border-rose-500 transition-all pointer-events-auto cursor-pointer flex justify-center items-center gap-2"
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
                  currentUserRole={currentUserRole}
                />
              )}

              {activeTab === 'students' && (
                <StudentManager
                  students={students}
                  sections={sections}
                  classrooms={classrooms}
                  currentUserRole={currentUserRole}
                  onAddStudent={handleAddStudent}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onUpdateStudentProfile={handleUpdateStudentProfile}
                  onNavigateToPending={(id) => {
                    setViewPendingStudentId(id);
                    setActiveTab('pendientes');
                  }}
                />
              )}

              {activeTab === 'academic' && (
                <AcademicManager
                  students={students}
                  sections={sections}
                  periods={periods}
                  users={users}
                  classrooms={classrooms}
                  currentUserRole={currentUserRole}
                  onAddStudent={handleAddStudent}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onCreateSection={handleCreateSection}
                />
              )}

              {activeTab === 'subjects' && (
                <SubjectManager
                  studyPlans={studyPlans}
                  currentUserRole={currentUserRole}
                  onAddStudyPlanItem={handleAddStudyPlanItem}
                />
              )}

              {activeTab === 'periods' && (
                <PeriodManager
                  periods={periods}
                  currentUserRole={currentUserRole}
                  onAddPeriod={handleAddPeriod}
                  onUpdatePeriodStatus={handleUpdatePeriodStatus}
                />
              )}

              {activeTab === 'grades' && (
                <GradeManager
                  students={students}
                  subjects={subjects}
                  evaluationPlans={evaluationPlans}
                  grades={grades}
                  auditLogs={auditLogs}
                  currentUserRole={currentUserRole}
                  studyPlans={studyPlans}
                  periods={periods}
                  sections={sections}
                  onUpdateGrade={handleUpdateGrade}
                  onSaveGrades={handleSaveGrades}
                  onUpdateEvaluationPlan={handleUpdateEvaluationPlan}
                />
              )}

              {activeTab === 'pendientes' && (
                <PendingSubjectsManager
                  students={students}
                  subjects={subjects}
                  periods={periods}
                  users={users}
                  defaultStudentId={viewPendingStudentId}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceTracker
                  students={students}
                  users={users}
                  sections={sections}
                  attendance={attendance}
                  teacherLogs={teacherLogs}
                  currentUserRole={currentUserRole}
                  onModifyAttendance={handleModifyAttendance}
                  onAddTeacherLog={handleAddTeacherLog}
                  onUpdateTeacherLog={handleUpdateTeacherLog}
                  onSyncInasistencias={handleSyncInasistencias}
                  onJustifyTeacherAbsence={handleJustifyTeacherAbsence}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleCoordinator
                  scheduleEvents={scheduleEvents}
                  subjects={subjects}
                  users={users}
                  docentes={docentes}
                  classrooms={classrooms}
                  sections={sections}
                  referenceData={referenceData}
                  currentUserRole={currentUserRole}
                  onAddScheduleEvent={handleAddScheduleEvent}
                  onRemoveScheduleEvent={handleRemoveScheduleEvent}
                />
              )}

              {activeTab === 'facilities' && (
                <FacilitiesManager
                  classrooms={classrooms}
                  scheduleEvents={scheduleEvents}
                  sections={sections}
                  students={students}
                  currentUserRole={currentUserRole}
                  onAddClassroom={handleAddClassroom}
                  onRemoveClassroom={handleRemoveClassroom}
                />
              )}

              {activeTab === 'docentes' && (
                <DocenteManager
                  docentes={docentes}
                  currentUserRole={currentUserRole}
                  onAddDocente={handleAddDocente}
                  onToggleDocenteActive={handleToggleDocenteActive}
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

        <ChatbotAsistente roleId={CHATBOT_ROLE_MAP[currentUserRole]} userName={currentUser?.name} />

        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

      </div>
    </div>
  );
}
