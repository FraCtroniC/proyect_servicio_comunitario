import { User, UserRole, Student, Classroom, Subject, EvaluationPlan, ScheduleEvent, Grade } from '../types';

export function mapRole(idRol: number): UserRole {
  if (idRol === 1) return 'super_admin';
  if (idRol === 2) return 'control_estudios';
  if (idRol === 3) return 'docente';
  return 'representante';
}

export function mapUsuarioToUser(dbUser: any): User {
  return {
    id: String(dbUser.id || dbUser.id_usuario),
    name: dbUser.username || `Usuario ${dbUser.id}`,
    email: dbUser.correo || `${dbUser.username}@local.liceo`,
    role: mapRole(dbUser.idRol || dbUser.id_rol),
    active: dbUser.estatus === 'Activo',
    cedula: dbUser.cedula || undefined,
  };
}

export function mapEstudianteToStudent(dbStudent: any): Student {
  return {
    id: String(dbStudent.id_estudiante),
    firstName: dbStudent.nombre1 + (dbStudent.nombre2 ? ` ${dbStudent.nombre2}` : ''),
    lastName: dbStudent.apellido1 + (dbStudent.apellido2 ? ` ${dbStudent.apellido2}` : ''),
    cedula: dbStudent.cedula_escolar,
    academicYear: 1, 
    section: 'A', 
    status: dbStudent.estatus_estudiante === 'Activo' ? 'Activo' : 
            dbStudent.estatus_estudiante === 'Retirado' ? 'Retirado' : 'Inactivo',
    representativeName: 'No asignado', 
    representativeCedula: '',
    representativePhone: '',
    dateOfBirth: dbStudent.fecha_nac,
  };
}

export function mapAulaToClassroom(dbAula: any): Classroom {
  return {
    id: String(dbAula.id_aula),
    name: dbAula.nombre_codigo,
    capacity: dbAula.capacidad || 30,
    type: dbAula.tipo_espacio as any,
    resources: []
  };
}

export function mapAsignaturaToSubject(dbAsignatura: any): Subject {
  return {
    id: String(dbAsignatura.id_asignatura),
    name: dbAsignatura.nombre,
    shortName: dbAsignatura.nombre.substring(0, 3).toUpperCase(),
    years: [1, 2, 3, 4, 5] // mock for now
  };
}

export function mapHorarioToScheduleEvent(dbHorario: any): ScheduleEvent {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dayName = dbHorario.dia?.nombre || days[(dbHorario.id_dia - 1) % 5] || 'Lunes';
  const timeBlock = dbHorario.bloque ? `${dbHorario.bloque.hora_inicio} - ${dbHorario.bloque.hora_fin}` : '00:00 - 00:00';
  
  return {
    id: String(dbHorario.id_horario),
    day: dayName as any,
    timeBlock: timeBlock,
    year: dbHorario.seccion?.grado?.numero || 1,
    section: dbHorario.seccion?.letra || 'A',
    subjectId: String(dbHorario.id_asignatura),
    teacherId: String(dbHorario.id_docente),
    classroomId: String(dbHorario.id_aula),
  };
}

export function mapPlanToEvaluationPlan(dbPlan: any): EvaluationPlan {
  return {
    subjectId: String(dbPlan.id_asignatura),
    year: dbPlan.grado?.numero || 1,
    section: 'A', // TODO: Backend plan does not have section
    lapso: 1, // Will be generated per lapso in UI if needed
    evaluations: [
      { id: `ev1-${dbPlan.id_plan}`, name: 'Evaluación Única', percentage: 100 }
    ]
  };
}

export function mapCalificacionToGrade(dbCalif: any, studentId: string): Grade {
  return {
    studentId: studentId,
    subjectId: String(dbCalif.id_plan), // simplified
    lapso: dbCalif.id_momento as any,
    evaluationId: `ev1-${dbCalif.id_plan}`, // simplified matching
    score: dbCalif.escala?.nota_calculo || dbCalif.id_escala || 0
  };
}
