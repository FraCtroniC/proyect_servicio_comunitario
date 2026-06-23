/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'control_estudios' | 'docente';

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
}

export type AcademicYear = 1 | 2 | 3 | 4 | 5; // 1er a 5to Año de Educación Media General

export interface SchoolPeriod {
  id: string;
  name: string;
  status: 'Activo' | 'Cerrado' | 'Planificación';
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
}

export interface StudyPlanItem {
  id: string;
  subjectId: string;
  subjectName: string;
  year: AcademicYear;
  codigo: string;
  posicion: number;
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
  date: string;         // YYYY-MM-DD
  academicYear: AcademicYear;
  section: string;
  status: 'P' | 'A' | 'J'; // Presente, Ausente, Justificado
  subjectId?: string;    // If class-by-class, or general daily
}

export interface TeacherScheduleLog {
  id: string;
  teacherId: string;     // User ID of the teacher
  date: string;          // YYYY-MM-DD
  clockInTime: string;   // HH:MM
  clockOutTime?: string; // HH:MM
  status: 'OnTime' | 'Late' | 'Absent';
}

export interface Classroom {
  id: string;
  name: string;         // e.g., "Aula 1-A", "Laboratorio de Química", "Cancha"
  capacity: number;
  type: 'Teórica' | 'Laboratorio' | 'Deportiva' | 'Comunitaria';
  resources: string[];  // e.g., "Pizarra Acrílica", "Proyector", "Microscopios"
}

export interface Section {
  id: string;
  grade: number;
  letter: string;
  periodId: string;
  teacherGuideId: string;
  homeClassroomId: string;
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
}
