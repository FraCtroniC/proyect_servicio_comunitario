import { User, UserRole, Student, Classroom, Subject, EvaluationPlan, ScheduleEvent, Grade, StudyPlanItem, SchoolPeriod, Section, Representative } from '../types';

export function mapRole(idRol: number): UserRole {
  if (idRol === 1) return 'super_admin';
  if (idRol === 2) return 'docente';
  if (idRol === 3 || idRol === 4) return 'control_estudios';
  return 'docente';
}

export function mapUsuarioToUser(dbUser: any): User {
  return {
    id: String(dbUser.id || dbUser.id_usuario),
    name: dbUser.username || `Usuario ${dbUser.id}`,
    email: dbUser.correo || `${dbUser.username}@local.liceo`,
    role: mapRole(dbUser.idRol || dbUser.id_rol),
    active: dbUser.estatus === 'Activo',
    cedula: dbUser.cedula || dbUser.docente?.cedula_docente || undefined,
    teacherId: dbUser.id_docente ? String(dbUser.id_docente) : undefined,
  };
}

export function mapPeriodoToSchoolPeriod(dbPeriodo: any): SchoolPeriod {
  return {
    id: String(dbPeriodo.id_periodo),
    name: dbPeriodo.nombre,
    status: dbPeriodo.estatus as any
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

export function mapPlanToStudyPlanItem(dbPlan: any): StudyPlanItem {
  return {
    id: String(dbPlan.id_plan),
    subjectId: String(dbPlan.id_asignatura),
    subjectName: dbPlan.asignatura?.nombre || `Materia #${dbPlan.id_asignatura}`,
    year: (dbPlan.grado?.numero || dbPlan.id_grado || 1) as any,
    codigo: dbPlan.codigo_asignatura || '',
    posicion: dbPlan.posicion || 0
  };
}

export function mapCalificacionToGrade(dbCalificacion: any, studentId: string): Grade {
  return {
    studentId: String(dbCalificacion.matricula?.id_estudiante || studentId),
    subjectId: String(dbCalificacion.plan?.id_asignatura || dbCalificacion.id_asignatura),
    lapso: (dbCalificacion.id_momento || 1) as 1|2|3,
    evaluationId: `ev1-${dbCalificacion.id_plan}`, // simplified matching
    score: dbCalificacion.escala?.nota_calculo || dbCalificacion.id_escala || 0
  };
}

export function mapEvaluacionesDbToPlans(evaluacionesDb: any[], studyPlans: any[], sectionsMap: any): EvaluationPlan[] {
  // Agrupar evaluaciones por plan-seccion-momento
  const map = new Map<string, EvaluationPlan>();
  
  for (const ev of evaluacionesDb) {
    const planObj = studyPlans.find(p => String(p.id_plan || p.id) === String(ev.id_plan));
    if (!planObj) continue;
    
    const subjectId = String(planObj.id_asignatura || planObj.subjectId);
    const year = Number(planObj.year || planObj.grado?.numero || 1) as any;
    const sectionObj = sectionsMap[ev.id_seccion];
    const section = sectionObj ? sectionObj.letra : 'A';
    const lapso = ev.id_momento as 1|2|3;
    
    const key = `${subjectId}-${year}-${section}-${lapso}`;
    
    if (!map.has(key)) {
      map.set(key, { subjectId, year, section, lapso, evaluations: [] });
    }
    
    map.get(key)!.evaluations.push({
      id: String(ev.id_evaluacion),
      name: ev.descripcion,
      percentage: ev.ponderacion
    });
  }
  
  return Array.from(map.values());
}

export function mapSeccionToSection(dbSeccion: any): Section {
  return {
    id: String(dbSeccion.id_seccion),
    grade: dbSeccion.id_grado || dbSeccion.grado?.numero || 1,
    letter: dbSeccion.letra,
    periodId: String(dbSeccion.id_periodo),
    teacherGuideId: String(dbSeccion.id_docente_guia),
  };
}

export function mapRepresentanteToRepresentative(dbRep: any): Representative {
  return {
    id: String(dbRep.id_representante),
    cedula: dbRep.cedula_rep,
    firstName: dbRep.nombre1 + (dbRep.nombre2 ? ` ${dbRep.nombre2}` : ''),
    lastName: dbRep.apellido1 + (dbRep.apellido2 ? ` ${dbRep.apellido2}` : ''),
    phone: dbRep.telefono || '',
  };
}

export function mapNotaParcialToGrade(dbNota: any, studentId: string): Grade {
  return {
    studentId: String(dbNota.matricula?.id_estudiante || dbNota.id_estudiante || studentId),
    subjectId: String(dbNota.evaluacion?.plan?.id_asignatura || dbNota.id_asignatura || ''),
    lapso: (dbNota.evaluacion?.id_momento || dbNota.id_momento || 1) as 1|2|3,
    evaluationId: String(dbNota.id_evaluacion),
    score: dbNota.escala?.nota_calculo || dbNota.id_escala || 0
  };
}
