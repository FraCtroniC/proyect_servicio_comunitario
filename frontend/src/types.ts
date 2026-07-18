/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'control_estudios' | 'coordinador' | 'docente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cedula?: string;
  active: boolean;
  avatarUrl?: string;
  phone?: string;
  teacherId?: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  secondLastName?: string;
  rol?: string;
  username?: string;
  dateOfBirth?: string;
  id_especialidad?: number;
}

export interface Docente {
  id: string;
  cedula: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  id_especialidad?: number;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  status: 'Activo' | 'Inactivo';
}

export interface MateriaPendiente {
  id_materia_pendiente: number;
  id_estudiante: number;
  id_asignatura: number;
  id_periodo: number;
  id_docente_evaluador: number | null;
  nota_definitiva: number | null;
  estatus: 'Cursando' | 'Aprobada' | 'Aplazada';
  asignatura?: Subject;
  estudiante?: any;
  periodo?: any;
  docente_evaluador?: any;
}

export type AcademicYear = 1 | 2 | 3 | 4 | 5; // 1er a 5to Año de Educación Media General

export interface SchoolPeriod {
  id: string;
  name: string;
  status: 'Activo' | 'Cerrado' | 'Planificación';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
}

export interface Especialidad {
  id_especialidad: number;
  nombre: string;
  estatus: 'Activa' | 'Inactiva';
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string;
  academicYear: AcademicYear;
  section: string;
  status: 'Activo' | 'Inactivo' | 'Retirado';
  representativeName: string;
  representativeCedula: string;
  representativePhone: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | string;
  birthPlace?: string;
  municipality?: string;
  state?: string;
  representativeEmail?: string;
  representativeAddress?: string;
  repFirstName?: string;
  repSecondName?: string;
  repLastName?: string;
  repSecondLastName?: string;
}

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  years: AcademicYear[]; // Which years have this subject
  tipoCalificacion?: 'Cuantitativa' | 'Cualitativo';
}

export interface StudyPlanItem {
  id: string;
  subjectId: string;
  subjectName: string;
  year: AcademicYear;
  codigo: string;
  posicion: number;
  tipoCalificacion: 'Cuantitativa' | 'Cualitativo';
}

export interface EvaluationItem {
  id: string;
  name: string;      // e.g., "Prueba Escrita", "Trabajo Práctico", "Exposición"
  percentage: number; // e.g., 20%
}

export interface EvaluationPlan {
  subjectId: string;
  year: AcademicYear;
  section: string;
  lapso: 1 | 2 | 3;
  evaluations: EvaluationItem[];
}

export interface Grade {
  studentId: string;
  subjectId: string;
  lapso: 1 | 2 | 3;
  evaluationId: string; // Refs EvaluationItem.id
  score: number;        // Scale: 1 to 20
}

export interface Attendance {
  id: string;
  studentId: string;
  matriculaId?: string;
  date: string;         // YYYY-MM-DD
  academicYear: AcademicYear;
  section: string;
  status: 'P' | 'A' | 'J'; // Presente, Ausente, Justificado
  subjectId?: string;
  horarioId?: string;    // id_horario from HorarioDocente
  observacion?: ObservacionEstudiante;
  justificaciones?: JustificacionEstudiante[];
}

export interface SubjectSchedule {
  id_horario: number;
  id_docente: number;
  id_asignatura: number;
  id_seccion: number;
  id_dia: number;
  id_bloque: number;
  id_aula: number;
  id_periodo: number;
  asignatura: Subject;
  seccion: Section & { grado?: { id_grado: number; nombre: string } };
  bloque: { id_bloque: number; hora_inicio: string; hora_fin: string; numero_bloque: number };
  aula: Classroom;
  docente: Docente;
  estudiantes?: Array<{ id_matricula: number; id_estudiante: number; nombre: string; cedula: string }>;
}

export interface TeacherScheduleLog {
  id: string;
  teacherId: string;     // User ID of the teacher
  date: string;          // YYYY-MM-DD
  clockInTime: string;   // HH:MM
  clockOutTime?: string; // HH:MM
  status: 'OnTime' | 'Late' | 'Absent' | 'Justified';
  justificaciones?: JustificacionDocente[];
}

export interface JustificacionDocente {
  id: number;
  id_asistencia: number;
  motivo: string;
  soporte_digital: string | null;
  created_at: string;
}

export interface JustificacionEstudiante {
  id: number;
  id_asistencia_est: number;
  motivo: string;
  soporte_digital: string | null;
  created_at: string;
}

export interface ObservacionEstudiante {
  id_observacion: number;
  texto: string;
  gravedad: 'Bajo' | 'Moderado' | 'Alto' | 'Critico' | null;
  id_usuario_crea: number | null;
  created_at: string;
}

export interface Classroom {
  id: string;
  name: string;         // e.g., "Aula 1-A", "Laboratorio de Química", "Cancha"
  capacity: number;
  type: 'Teórica' | 'Laboratorio' | 'Deportiva';
  location: string;     // e.g., "Piso 1", "Planta Baja"
}

export interface Section {
  id: string;
  grade: number;
  letter: string;
  periodId: string;
  teacherGuideId: string;
  homeClassroomId: string;
  capacityMax?: number;
}

export interface Representative {
  id: string;
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ScheduleEvent {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  timeBlock: string;    // e.g., "07:00 - 07:45", "07:45 - 08:30"
  year: AcademicYear;
  section: string;
  subjectId: string;
  teacherId: string;    // Docente
  classroomId: string;  // Classroom
  blockId?: string;
}
