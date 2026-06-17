/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Student, Subject, Classroom, ScheduleEvent, EvaluationPlan, Grade, Attendance, TeacherScheduleLog, AcademicYear, EvaluationItem } from './types';

// Standard subjects in Venezuelan High School (Educación Media General)
export const initialSubjects: Subject[] = [
  { id: 'mat', name: 'Matemática', shortName: 'Mat', years: [1, 2, 3, 4, 5] },
  { id: 'cast', name: 'Castellano y Literatura', shortName: 'Cast', years: [1, 2, 3, 4, 5] },
  { id: 'ing', name: 'Idioma Extranjero (Inglés)', shortName: 'Ing', years: [1, 2, 3, 4, 5] },
  { id: 'bio', name: 'Biología', shortName: 'Bio', years: [1, 2, 3, 4, 5] },
  { id: 'fis', name: 'Fisica', shortName: 'Fís', years: [3, 4, 5] },
  { id: 'qui', name: 'Química', shortName: 'Quí', years: [3, 4, 5] },
  { id: 'ghc', name: 'Geografía, Historia y Ciudadanía (GHC)', shortName: 'GHC', years: [1, 2, 3, 4, 5] },
  { id: 'edf', name: 'Educación Física', shortName: 'Ed.Fis', years: [1, 2, 3, 4, 5] },
  { id: 'fsn', name: 'Formación para la Soberanía Nacional (FSN)', shortName: 'FSN', years: [4, 5] },
  { id: 'oyc', name: 'Orientación y Convivencia', shortName: 'O.Y.C', years: [1, 2, 3, 4, 5] }
];

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. Francisco Linares',
    email: 'director@liceo-mppe.edu.ve',
    role: 'super_admin',
    cedula: 'V-10.456.812',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    phone: '0414-1234567'
  },
  {
    id: 'usr-2',
    name: 'Lic. Teresa Carreño',
    email: 'control.estudios@liceo-mppe.edu.ve',
    role: 'control_estudios',
    cedula: 'V-14.890.312',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    phone: '0416-9876543'
  },
  {
    id: 't-1',
    name: 'Prof. Carlos Mendoza',
    email: 'carlos.mendoza@liceo-mppe.edu.ve',
    role: 'docente',
    cedula: 'V-15.342.112',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    phone: '0412-3214567'
  },
  {
    id: 't-2',
    name: 'Profa. María Rodríguez',
    email: 'maria.rodriguez@liceo-mppe.edu.ve',
    role: 'docente',
    cedula: 'V-16.123.890',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    phone: '0424-4567890'
  },
  {
    id: 't-3',
    name: 'Prof. José Antonio Abreu',
    email: 'jose.abreu@liceo-mppe.edu.ve',
    role: 'docente',
    cedula: 'V-12.788.543',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    phone: '0414-7654321'
  },
  {
    id: 't-4',
    name: 'Profa. Jacinto Convit',
    email: 'jacinto.convit@liceo-mppe.edu.ve',
    role: 'docente',
    cedula: 'V-9.845.231',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    phone: '0416-1112233'
  },
  {
    id: 't-5',
    name: 'Prof. Yulimar Rojas',
    email: 'yulimar.rojas@liceo-mppe.edu.ve',
    role: 'docente',
    cedula: 'V-18.995.122',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150',
    phone: '0412-1237890'
  }
];

// Seed 15 realistic student records (representing different years 1st to 5th)
export const initialStudents: Student[] = [
  // 5to Año
  {
    id: 'std-1',
    firstName: 'Alejandro',
    lastName: 'Gómez Rivas',
    cedula: 'V-29.412.332',
    academicYear: 5,
    section: 'A',
    status: 'Activo',
    representativeName: 'Manuel Gómez',
    representativeCedula: 'V-11.455.900',
    representativePhone: '0414-9012233',
    dateOfBirth: '2008-05-12'
  },
  {
    id: 'std-2',
    firstName: 'Gabriela Sofía',
    lastName: 'Marquez Rondón',
    cedula: 'V-29.801.442',
    academicYear: 5,
    section: 'A',
    status: 'Activo',
    representativeName: 'Karina Rondón',
    representativeCedula: 'V-13.111.456',
    representativePhone: '0416-5621122',
    dateOfBirth: '2008-09-22'
  },
  {
    id: 'std-3',
    firstName: 'Juan Diego',
    lastName: 'Cabrera Ortiz',
    cedula: 'V-30.123.456',
    academicYear: 5,
    section: 'A',
    status: 'Activo',
    representativeName: 'Diego Cabrera',
    representativeCedula: 'V-12.001.341',
    representativePhone: '0424-9008877',
    dateOfBirth: '2009-02-14'
  },
  {
    id: 'std-4',
    firstName: 'María Antonieta',
    lastName: 'López Infante',
    cedula: 'V-30.432.887',
    academicYear: 5,
    section: 'A',
    status: 'Activo',
    representativeName: 'Isabel Infante',
    representativeCedula: 'V-15.654.123',
    representativePhone: '0412-8877665',
    dateOfBirth: '2009-07-04'
  },
  {
    id: 'std-5',
    firstName: 'Sandro Eliézer',
    lastName: 'Bolívar Blanco',
    cedula: 'V-29.112.556',
    academicYear: 5,
    section: 'A',
    status: 'Activo',
    representativeName: 'Eliézer Bolívar',
    representativeCedula: 'V-10.898.341',
    representativePhone: '0414-3450987',
    dateOfBirth: '2008-01-30'
  },
  // 3er Año
  {
    id: 'std-6',
    firstName: 'Camila Victoria',
    lastName: 'Urdaneta Pérez',
    cedula: 'V-31.554.212',
    academicYear: 3,
    section: 'A',
    status: 'Activo',
    representativeName: 'Victoria Pérez',
    representativeCedula: 'V-14.505.340',
    representativePhone: '0412-4445566',
    dateOfBirth: '2010-11-20'
  },
  {
    id: 'std-7',
    firstName: 'Héctor Manuel',
    lastName: 'Chacón Guerrero',
    cedula: 'V-31.902.110',
    academicYear: 3,
    section: 'A',
    status: 'Activo',
    representativeName: 'Manuel Chacón',
    representativeCedula: 'V-13.890.111',
    representativePhone: '0424-5556677',
    dateOfBirth: '2010-06-15'
  },
  {
    id: 'std-8',
    firstName: 'Oriana Belén',
    lastName: 'Falcón Sánchez',
    cedula: 'V-31.222.100',
    academicYear: 3,
    section: 'B',
    status: 'Activo',
    representativeName: 'Luis Falcón',
    representativeCedula: 'V-11.233.567',
    representativePhone: '0416-3334455',
    dateOfBirth: '2010-03-08'
  },
  {
    id: 'std-9',
    firstName: 'Santiago José',
    lastName: 'Montilla Castro',
    cedula: 'V-32.001.998',
    academicYear: 3,
    section: 'A',
    status: 'Activo',
    representativeName: 'José Montilla',
    representativeCedula: 'V-15.112.564',
    representativePhone: '0414-5553311',
    dateOfBirth: '2011-01-25'
  },
  {
    id: 'std-10',
    firstName: 'Luis David',
    lastName: 'Barrios Fuentes',
    cedula: 'V-31.676.541',
    academicYear: 3,
    section: 'A',
    status: 'Retirado',
    representativeName: 'David Barrios',
    representativeCedula: 'V-12.890.312',
    representativePhone: '0412-1110022',
    dateOfBirth: '2010-12-05'
  },
  // 1er Año
  {
    id: 'std-11',
    firstName: 'Samuel Elías',
    lastName: 'Ortega Vera',
    cedula: 'V-33.111.444',
    academicYear: 1,
    section: 'A',
    status: 'Activo',
    representativeName: 'Yolimar Vera',
    representativeCedula: 'V-16.123.444',
    representativePhone: '0414-9998877',
    dateOfBirth: '2012-08-11'
  },
  {
    id: 'std-12',
    firstName: 'Valeria Patricia',
    lastName: 'Silva Quintero',
    cedula: 'V-33.902.831',
    academicYear: 1,
    section: 'A',
    status: 'Activo',
    representativeName: 'Patricia Quintero',
    representativeCedula: 'V-15.932.122',
    representativePhone: '0416-8889900',
    dateOfBirth: '2012-10-31'
  },
  {
    id: 'std-13',
    firstName: 'Jesús Eduardo',
    lastName: 'Medina Flores',
    cedula: 'V-32.890.002',
    academicYear: 1,
    section: 'B',
    status: 'Activo',
    representativeName: 'Eduardo Medina',
    representativeCedula: 'V-12.332.112',
    representativePhone: '0424-6663322',
    dateOfBirth: '2012-02-14'
  },
  {
    id: 'std-14',
    firstName: 'Anabella',
    lastName: 'Pérez Arismendi',
    cedula: 'V-33.456.901',
    academicYear: 1,
    section: 'A',
    status: 'Activo',
    representativeName: 'César Pérez',
    representativeCedula: 'V-14.112.567',
    representativePhone: '0412-3334445',
    dateOfBirth: '2012-05-19'
  },
  {
    id: 'std-15',
    firstName: 'José Tomás',
    lastName: 'Rangel Briceño',
    cedula: 'V-33.654.120',
    academicYear: 1,
    section: 'A',
    status: 'Inactivo',
    representativeName: 'Tomás Rangel',
    representativeCedula: 'V-11.234.567',
    representativePhone: '0414-1112223',
    dateOfBirth: '2012-04-03'
  }
];

export const initialClassrooms: Classroom[] = [
  { id: 'rm-101', name: 'Aula 101 - Planta Baja', capacity: 35, type: 'Teórica', resources: ['Pizarra Acrílica', 'Ventiladores', 'Pupitres de Madera'] },
  { id: 'rm-102', name: 'Aula 102 - Planta Baja', capacity: 35, type: 'Teórica', resources: ['Pizarra Acrílica', 'Iluminación LED'] },
  { id: 'rm-201', name: 'Aula 201 - Primer Piso', capacity: 30, type: 'Teórica', resources: ['Pizarra Acrílica', 'Proyector de Techo'] },
  { id: 'rm-202', name: 'Aula 202 - Primer Piso', capacity: 30, type: 'Teórica', resources: ['Pizarra Acrílica'] },
  { id: 'rm-lab1', name: 'Laboratorio de Química', capacity: 25, type: 'Laboratorio', resources: ['Mesones de Cerámica', 'Grifos de Agua', 'Microscopios', 'Hornos de Calentamiento'] },
  { id: 'rm-lab2', name: 'Laboratorio de Informática', capacity: 20, type: 'Laboratorio', resources: ['15 Computadoras de Escritorio', 'Acondicionador de Aire', 'Pizarra Blanca'] },
  { id: 'rm-cancha', name: 'Cancha de Usos Múltiples', capacity: 80, type: 'Deportiva', resources: ['Tableros de Baloncesto', 'Arquerías de Fútbol Sala', 'Gradas'] }
];

export const initialScheduleEvents: ScheduleEvent[] = [
  // 5to Año Sección A Schedule
  { id: 'ev-1', day: 'Lunes', timeBlock: '07:00 - 07:45', year: 5, section: 'A', subjectId: 'mat', teacherId: 't-1', classroomId: 'rm-201' },
  { id: 'ev-2', day: 'Lunes', timeBlock: '07:45 - 08:30', year: 5, section: 'A', subjectId: 'mat', teacherId: 't-1', classroomId: 'rm-201' },
  { id: 'ev-3', day: 'Lunes', timeBlock: '08:45 - 09:30', year: 5, section: 'A', subjectId: 'cast', teacherId: 't-2', classroomId: 'rm-201' },
  { id: 'ev-4', day: 'Martes', timeBlock: '07:00 - 07:45', year: 5, section: 'A', subjectId: 'qui', teacherId: 't-4', classroomId: 'rm-lab1' },
  { id: 'ev-5', day: 'Martes', timeBlock: '07:45 - 08:30', year: 5, section: 'A', subjectId: 'qui', teacherId: 't-4', classroomId: 'rm-lab1' },
  { id: 'ev-6', day: 'Miércoles', timeBlock: '09:30 - 10:15', year: 5, section: 'A', subjectId: 'fsn', teacherId: 't-3', classroomId: 'rm-201' },
  { id: 'ev-7', day: 'Jueves', timeBlock: '10:30 - 11:15', year: 5, section: 'A', subjectId: 'edf', teacherId: 't-5', classroomId: 'rm-cancha' },
  { id: 'ev-8', day: 'Viernes', timeBlock: '08:45 - 09:30', year: 5, section: 'A', subjectId: 'ing', teacherId: 't-2', classroomId: 'rm-201' },
  
  // 3er Año Sección A Schedule
  { id: 'ev-9', day: 'Lunes', timeBlock: '08:45 - 09:30', year: 3, section: 'A', subjectId: 'mat', teacherId: 't-1', classroomId: 'rm-101' },
  { id: 'ev-10', day: 'Martes', timeBlock: '09:30 - 10:15', year: 3, section: 'A', subjectId: 'bio', teacherId: 't-4', classroomId: 'rm-101' },
  { id: 'ev-11', day: 'Miércoles', timeBlock: '07:00 - 07:45', year: 3, section: 'A', subjectId: 'ghc', teacherId: 't-3', classroomId: 'rm-101' }
];

// Seed basic Evaluation Plan for the default Lapsos of 5to Año - Section A
// We have 4 evaluations per Lapso, worth 25% each
export const seedEvaluationPlans = (subjects: Subject[]): EvaluationPlan[] => {
  const plans: EvaluationPlan[] = [];
  const years: AcademicYear[] = [1, 3, 5];
  const sections = ['A', 'B'];
  const lapsos: (1 | 2 | 3)[] = [1, 2, 3];

  years.forEach(yr => {
    sections.forEach(sec => {
      subjects.forEach(sub => {
        if (sub.years.includes(yr)) {
          lapsos.forEach(lap => {
            plans.push({
              subjectId: sub.id,
              year: yr,
              section: sec,
              lapso: lap,
              evaluations: [
                { id: `${sub.id}-${yr}${sec}-l${lap}-e1`, name: 'Prueba Escrita u Objetiva', percentage: 25 },
                { id: `${sub.id}-${yr}${sec}-l${lap}-e2`, name: 'Trabajo Escrito / Investigación', percentage: 25 },
                { id: `${sub.id}-${yr}${sec}-l${lap}-e3`, name: 'Exposición / Taller Práctico', percentage: 25 },
                { id: `${sub.id}-${yr}${sec}-l${lap}-e4`, name: 'Apreciación / Rasgos Personales', percentage: 25 }
              ]
            });
          });
        }
      });
    });
  });

  return plans;
};

// Seed Grades on 1-20 Scale for our default students across some subjects
// We can pre-fill Lapso 1, Lapso 2 completely, and some Lapso 3 items so the average has interesting results.
export const generateSeedGrades = (students: Student[]): Grade[] => {
  const grades: Grade[] = [];
  
  // Let's seed complete grades for student Alejandro Gómez Rivas (std-1) in 5to Año A
  // Subjects: Matemática ('mat'), Castellano ('cast'), Química ('qui'), Inglés ('ing')
  // We will seed realistic grades to demo top achievements and standard grading
  const subjectsToGrade = ['mat', 'cast', 'qui', 'ing'];
  const evaluationsOfAlejandro = [
    // Lapso 1 - Matemática
    { sId: 'std-1', subId: 'mat', l: 1, evId: 'mat-5A-l1-e1', sc: 15 },
    { sId: 'std-1', subId: 'mat', l: 1, evId: 'mat-5A-l1-e2', sc: 16 },
    { sId: 'std-1', subId: 'mat', l: 1, evId: 'mat-5A-l1-e3', sc: 14 },
    { sId: 'std-1', subId: 'mat', l: 1, evId: 'mat-5A-l1-e4', sc: 18 }, // Avg: 15.75 -> Round to 16
    
    // Lapso 2 - Matemática
    { sId: 'std-1', subId: 'mat', l: 2, evId: 'mat-5A-l2-e1', sc: 17 },
    { sId: 'std-1', subId: 'mat', l: 2, evId: 'mat-5A-l2-e2', sc: 18 },
    { sId: 'std-1', subId: 'mat', l: 2, evId: 'mat-5A-l2-e3', sc: 19 },
    { sId: 'std-1', subId: 'mat', l: 2, evId: 'mat-5A-l2-e4', sc: 20 }, // Avg: 18.5 -> Round to 19
    
    // Lapso 3 - Matemática
    { sId: 'std-1', subId: 'mat', l: 3, evId: 'mat-5A-l3-e1', sc: 16 },
    { sId: 'std-1', subId: 'mat', l: 3, evId: 'mat-5A-l3-e2', sc: 15 },
    { sId: 'std-1', subId: 'mat', l: 3, evId: 'mat-5A-l3-e3', sc: 17 },
    { sId: 'std-1', subId: 'mat', l: 3, evId: 'mat-5A-l3-e4', sc: 18 }, // Avg: 16.5 -> Round to 17. Final: (16+19+17)/3 = 17.33 -> Round to 17

    // Lapso 1 - Castellano
    { sId: 'std-1', subId: 'cast', l: 1, evId: 'cast-5A-l1-e1', sc: 14 },
    { sId: 'std-1', subId: 'cast', l: 1, evId: 'cast-5A-l1-e2', sc: 15 },
    { sId: 'std-1', subId: 'cast', l: 1, evId: 'cast-5A-l1-e3', sc: 16 },
    { sId: 'std-1', subId: 'cast', l: 1, evId: 'cast-5A-l1-e4', sc: 17 }, // Avg: 15.5 -> Round to 16
    
    // Lapso 2 - Castellano
    { sId: 'std-1', subId: 'cast', l: 2, evId: 'cast-5A-l2-e1', sc: 18 },
    { sId: 'std-1', subId: 'cast', l: 2, evId: 'cast-5A-l2-e2', sc: 19 },
    { sId: 'std-1', subId: 'cast', l: 2, evId: 'cast-5A-l2-e3', sc: 18 },
    { sId: 'std-1', subId: 'cast', l: 2, evId: 'cast-5A-l2-e4', sc: 19 }, // Avg: 18.5 -> Round to 19
    
    // Lapso 3 - Castellano
    { sId: 'std-1', subId: 'cast', l: 3, evId: 'cast-5A-l3-e1', sc: 17 },
    { sId: 'std-1', subId: 'cast', l: 3, evId: 'cast-5A-l3-e2', sc: 20 },
    { sId: 'std-1', subId: 'cast', l: 3, evId: 'cast-5A-l3-e3', sc: 19 },
    { sId: 'std-1', subId: 'cast', l: 3, evId: 'cast-5A-l3-e4', sc: 18 }, // Avg: 18.5 -> Round to 19

    // Lapso 1 - Química
    { sId: 'std-1', subId: 'qui', l: 1, evId: 'qui-5A-l1-e1', sc: 12 },
    { sId: 'std-1', subId: 'qui', l: 1, evId: 'qui-5A-l1-e2', sc: 11 },
    { sId: 'std-1', subId: 'qui', l: 1, evId: 'qui-5A-l1-e3', sc: 13 },
    { sId: 'std-1', subId: 'qui', l: 1, evId: 'qui-5A-l1-e4', sc: 14 }, // Avg: 12.5 -> Round to 13
    
    // Lapso 2 - Química
    { sId: 'std-1', subId: 'qui', l: 2, evId: 'qui-5A-l2-e1', sc: 15 },
    { sId: 'std-1', subId: 'qui', l: 2, evId: 'qui-5A-l2-e2', sc: 14 },
    { sId: 'std-1', subId: 'qui', l: 2, evId: 'qui-5A-l2-e3', sc: 16 },
    { sId: 'std-1', subId: 'qui', l: 2, evId: 'qui-5A-l2-e4', sc: 15 }, // Avg: 14.75 -> Round to 15
    
    // Lapso 3 - Química
    { sId: 'std-1', subId: 'qui', l: 3, evId: 'qui-5A-l3-e1', sc: 16 },
    { sId: 'std-1', subId: 'qui', l: 3, evId: 'qui-5A-l3-e2', sc: 17 },
    { sId: 'std-1', subId: 'qui', l: 3, evId: 'qui-5A-l3-e3', sc: 16 },
    { sId: 'std-1', subId: 'qui', l: 3, evId: 'qui-5A-l3-e4', sc: 17 }, // Avg: 16.5 -> Round to 17
    
    // Lapso 1 - Inglés
    { sId: 'std-1', subId: 'ing', l: 1, evId: 'ing-5A-l1-e1', sc: 16 },
    { sId: 'std-1', subId: 'ing', l: 1, evId: 'ing-5A-l1-e2', sc: 17 },
    { sId: 'std-1', subId: 'ing', l: 1, evId: 'ing-5A-l1-e3', sc: 18 },
    { sId: 'std-1', subId: 'ing', l: 1, evId: 'ing-5A-l1-e4', sc: 19 }, // Avg: 17.5 -> 18
    
    // Lapso 2 - Inglés
    { sId: 'std-1', subId: 'ing', l: 2, evId: 'ing-5A-l2-e1', sc: 19 },
    { sId: 'std-1', subId: 'ing', l: 2, evId: 'ing-5A-l2-e2', sc: 19 },
    { sId: 'std-1', subId: 'ing', l: 2, evId: 'ing-5A-l2-e3', sc: 20 },
    { sId: 'std-1', subId: 'ing', l: 2, evId: 'ing-5A-l2-e4', sc: 20 }, // Avg: 19.5 -> 20
    
    // Lapso 3 - Inglés
    { sId: 'std-1', subId: 'ing', l: 3, evId: 'ing-5A-l3-e1', sc: 18 },
    { sId: 'std-1', subId: 'ing', l: 3, evId: 'ing-5A-l3-e2', sc: 19 },
    { sId: 'std-1', subId: 'ing', l: 3, evId: 'ing-5A-l3-e3', sc: 18 },
    { sId: 'std-1', subId: 'ing', l: 3, evId: 'ing-5A-l3-e4', sc: 19 }, // Avg: 18.5 -> 19
  ];

  evaluationsOfAlejandro.forEach(ev => {
    grades.push({
      studentId: ev.sId,
      subjectId: ev.subId,
      lapso: ev.l as (1|2|3),
      evaluationId: ev.evId,
      score: ev.sc
    });
  });

  // Seed grades for Gabriela (std-2) - High performer (18-20 scores)
  const evaluationsOfGabriela = [
    { sId: 'std-2', subId: 'mat', l: 1, sc: 19 },
    { sId: 'std-2', subId: 'mat', l: 2, sc: 20 },
    { sId: 'std-2', subId: 'mat', l: 3, sc: 19 },
    { sId: 'std-2', subId: 'cast', l: 1, sc: 18 },
    { sId: 'std-2', subId: 'cast', l: 2, sc: 19 },
    { sId: 'std-2', subId: 'cast', l: 3, sc: 20 },
    { sId: 'std-2', subId: 'qui', l: 1, sc: 17 },
    { sId: 'std-2', subId: 'qui', l: 2, sc: 18 },
    { sId: 'std-2', subId: 'qui', l: 3, sc: 19 }
  ];
  evaluationsOfGabriela.forEach((item) => {
    for (let eNum = 1; eNum <= 4; eNum++) {
      grades.push({
        studentId: item.sId,
        subjectId: item.subId,
        lapso: item.l as (1|2|3),
        evaluationId: `${item.subId}-5A-l${item.l}-e${eNum}`,
        score: Math.max(1, Math.min(20, item.sc + (eNum % 2 === 0 ? 1 : -1)))
      });
    }
  });

  // Seed grades for Juan Diego (std-3) - Average student (11-14 scores)
  const evaluationsOfJuan = [
    { sId: 'std-3', subId: 'mat', l: 1, sc: 11 },
    { sId: 'std-3', subId: 'mat', l: 2, sc: 13 },
    { sId: 'std-3', subId: 'mat', l: 3, sc: 12 },
    { sId: 'std-3', subId: 'cast', l: 1, sc: 14 },
    { sId: 'std-3', subId: 'qui', l: 1, sc: 10 }
  ];
  evaluationsOfJuan.forEach((item) => {
    for (let eNum = 1; eNum <= 4; eNum++) {
      grades.push({
        studentId: item.sId,
        subjectId: item.subId,
        lapso: item.l as (1|2|3),
        evaluationId: `${item.subId}-5A-l${item.l}-e${eNum}`,
        score: Math.max(1, Math.min(20, item.sc + (eNum % 2 === 0 ? 0 : -1)))
      });
    }
  });

  // Seed grades for María Antonieta (std-4) - Struggling math but good in languages (9-11 scores in math, 15+ in castellano)
  const evaluationsOfMaria = [
    { sId: 'std-4', subId: 'mat', l: 1, sc: 9 }, // 9.5 raw average to show passing rounding
    { sId: 'std-4', subId: 'mat', l: 2, sc: 10 },
    { sId: 'std-4', subId: 'mat', l: 3, sc: 10 },
    { sId: 'std-4', subId: 'cast', l: 1, sc: 16 },
    { sId: 'std-4', subId: 'qui', l: 1, sc: 8 } // failing
  ];
  evaluationsOfMaria.forEach((item) => {
    for (let eNum = 1; eNum <= 4; eNum++) {
      let variance = 0;
      if (item.subId === 'mat' && item.sc === 9) {
        // e1=9, e2=10, e3=9, e4=10. Avg = 9.5 -> Rounds to 10! Perfect rounding test.
        variance = eNum % 2 === 0 ? 1 : 0;
      } else {
        variance = eNum % 2 === 0 ? 1 : -1;
      }
      grades.push({
        studentId: item.sId,
        subjectId: item.subId,
        lapso: item.l as (1|2|3),
        evaluationId: `${item.subId}-5A-l${item.l}-e${eNum}`,
        score: Math.max(1, Math.min(20, item.sc + variance))
      });
    }
  });

  // Seed grades for Sandro Eliézer (std-5) - Underperforming student (6-9 scores)
  const evaluationsOfSandro = [
    { sId: 'std-5', subId: 'mat', l: 1, sc: 7 }, // failing average
    { sId: 'std-5', subId: 'mat', l: 2, sc: 8 },
    { sId: 'std-5', subId: 'mat', l: 3, sc: 9 },
    { sId: 'std-5', subId: 'cast', l: 1, sc: 12 },
    { sId: 'std-5', subId: 'qui', l: 1, sc: 6 } // failing
  ];
  evaluationsOfSandro.forEach((item) => {
    for (let eNum = 1; eNum <= 4; eNum++) {
      grades.push({
        studentId: item.sId,
        subjectId: item.subId,
        lapso: item.l as (1|2|3),
        evaluationId: `${item.subId}-5A-l${item.l}-e${eNum}`,
        score: Math.max(1, Math.min(20, item.sc + (eNum % 2 === 0 ? 1 : -1)))
      });
    }
  });

  // 1er Año student grades (std-11 Samuel, std-12 Valeria in Castellano and Matemáticas)
  const evaluationsOfSamuelValeria = [
    { sId: 'std-11', subId: 'mat', l: 1, sc: 14 },
    { sId: 'std-11', subId: 'cast', l: 1, sc: 15 },
    { sId: 'std-12', subId: 'mat', l: 1, sc: 17 },
    { sId: 'std-12', subId: 'cast', l: 1, sc: 16 }
  ];
  evaluationsOfSamuelValeria.forEach((item) => {
    for (let eNum = 1; eNum <= 4; eNum++) {
      grades.push({
        studentId: item.sId,
        subjectId: item.subId,
        lapso: 1,
        evaluationId: `${item.subId}-1A-l1-e${eNum}`,
        score: Math.max(1, Math.min(20, item.sc + (eNum % 2 === 0 ? 1 : 0)))
      });
    }
  });

  return grades;
};

// Seed Student Attendance (Past 5 school days representatively)
export const initialAttendance = (): Attendance[] => {
  const records: Attendance[] = [];
  const activeStudentsIn5A = ['std-1', 'std-2', 'std-3', 'std-4', 'std-5'];
  const dates = ['2026-06-11', '2026-06-12', '2026-06-15', '2026-06-16', '2026-06-17'];

  dates.forEach(dt => {
    activeStudentsIn5A.forEach((sid, index) => {
      // General daily attendance simulation
      let status: 'P' | 'A' | 'J' = 'P';
      // Introduce an occasional absence
      if (dt === '2026-06-12' && index === 2) status = 'A';
      if (dt === '2026-06-15' && index === 4) status = 'P';
      if (dt === '2026-06-16' && index === 3) status = 'J';

      records.push({
        id: `att-${sid}-${dt}`,
        studentId: sid,
        date: dt,
        academicYear: 5,
        section: 'A',
        status
      });
    });

    // 1st Year student attendance
    ['std-11', 'std-12', 'std-14'].forEach((sid, idx) => {
      records.push({
        id: `att-${sid}-${dt}`,
        studentId: sid,
        date: dt,
        academicYear: 1,
        section: 'A',
        status: (dt === '2026-06-15' && idx === 1) ? 'A' : 'P'
      });
    });
  });

  return records;
};

// Seed Teacher Scheduling and Punch Card Logs (Last 5 days)
export const initialTeacherLogs: TeacherScheduleLog[] = [
  { id: 'log-1', teacherId: 't-1', date: '2026-06-11', clockInTime: '06:52', clockOutTime: '12:15', status: 'OnTime' },
  { id: 'log-2', teacherId: 't-1', date: '2026-06-12', clockInTime: '06:55', clockOutTime: '12:00', status: 'OnTime' },
  { id: 'log-3', teacherId: 't-1', date: '2026-06-15', clockInTime: '07:12', clockOutTime: '12:30', status: 'Late' }, // Late because classes start at 07:00
  { id: 'log-4', teacherId: 't-1', date: '2026-06-16', clockInTime: '06:48', clockOutTime: '12:05', status: 'OnTime' },
  { id: 'log-5', teacherId: 't-1', date: '2026-06-17', clockInTime: '06:50', clockOutTime: undefined, status: 'OnTime' }, // Checked in today

  { id: 'log-6', teacherId: 't-2', date: '2026-06-15', clockInTime: '08:35', clockOutTime: '11:45', status: 'OnTime' },
  { id: 'log-7', teacherId: 't-2', date: '2026-06-16', clockInTime: '08:40', clockOutTime: '11:50', status: 'OnTime' },
  { id: 'log-8', teacherId: 't-2', date: '2026-06-17', clockInTime: '08:38', clockOutTime: undefined, status: 'OnTime' }
];

// Helper functions for MPPE Rounded Grades logic
export const calculateEvaluationAverage = (grades: Grade[], evaluations: EvaluationItem[], studentId: string, subjectId: string, lapso: 1|2|3) => {
  let totalWeightedScore = 0;
  let totalRegisteredWeight = 0;
  let gradedCount = 0;

  evaluations.forEach(ev => {
    const grade = grades.find(g => g.studentId === studentId && g.subjectId === subjectId && g.lapso === lapso && g.evaluationId === ev.id);
    if (grade) {
      // Standard Venezuelan calculation: each evaluation is graded out of 20, then weighted.
      totalWeightedScore += grade.score * (ev.percentage / 100);
      totalRegisteredWeight += ev.percentage;
      gradedCount++;
    }
  });

  if (gradedCount === 0) return { raw: 0, rounded: 0, fullyGraded: false };

  // If active evaluations exist but don't sum to 100% yet, re-scale to currently graded weight for partial score tracking
  const rawScore = totalRegisteredWeight > 0 ? (totalWeightedScore / (totalRegisteredWeight / 100)) : 0;
  
  // Round to nearest integer as mandated for lapso transcript outputs: MPPE states 0.5 rules (e.g. 9.5 -> 10)
  // standard Math.round does this: 9.5 becomes 10, 9.49 becomes 9.
  const roundedScore = Math.round(rawScore);

  return {
    raw: Number(rawScore.toFixed(2)),
    rounded: roundedScore,
    fullyGraded: totalRegisteredWeight === 100 && gradedCount === evaluations.length
  };
};

export const calculateSubjectFinalGrade = (grades: Grade[], evaluationPlans: EvaluationPlan[], studentId: string, subjectId: string) => {
  // Let's get the average of the three Lapsos
  let lapsosSum = 0;
  let lapsosSubmittals = 0;
  const lapsos: (1|2|3)[] = [1, 2, 3];

  lapsos.forEach(lap => {
    const plan = evaluationPlans.find(p => p.subjectId === subjectId && p.lapso === lap);
    if (plan) {
      const { raw, rounded } = calculateEvaluationAverage(grades, plan.evaluations, studentId, subjectId, lap);
      if (raw > 0) {
        // Standard Venezuelan instruction: Lapso grades are represented as rounded integers in official records.
        // The final grade is the arithmetic average of the THREE rounded lapso scores.
        lapsosSum += rounded;
        lapsosSubmittals++;
      }
    }
  });

  if (lapsosSubmittals === 0) return { raw: 0, rounded: 0 };

  const rawFinal = lapsosSum / 3; // divided by 3 according to total periods
  const roundedFinal = Math.round(rawFinal);

  return {
    raw: Number(rawFinal.toFixed(2)),
    rounded: roundedFinal
  };
};
