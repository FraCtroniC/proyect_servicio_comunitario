import { User, UserRole, Student, Classroom, Subject, EvaluationPlan, ScheduleEvent, Grade, StudyPlanItem, SchoolPeriod, Section, Representative, AcademicYear, Docente } from '../types';

export function mapRole(idRol: number): UserRole {
  if (idRol === 4) return 'super_admin';
  if (idRol === 5) return 'docente';
  if (idRol === 7) return 'coordinador';
  if (idRol === 8) return 'control_estudios';
  return 'docente';
}

export function mapUsuarioToUser(dbUser: any): User {
  const p = dbUser.persona;
  return {
    id: String(dbUser.id || dbUser.id_usuario),
    name: p
      ? `${p.nombre1} ${p.apellido1}`
      : (dbUser.username || `Usuario ${dbUser.id}`),
    email: p?.correo || `${dbUser.username}@local.liceo`,
    role: mapRole(dbUser.idRol || dbUser.id_rol),
    active: dbUser.estatus === 'Activo',
    cedula: p?.cedula || undefined,
    phone: p?.telefono || undefined,
    username: dbUser.username || undefined,
    teacherId: dbUser.id_docente ? String(dbUser.id_docente) : undefined,
    firstName: p?.nombre1 || undefined,
    secondName: p?.nombre2 || undefined,
    lastName: p?.apellido1 || undefined,
    secondLastName: p?.apellido2 || undefined,
  };
}

export function mapDocenteToDocenteType(dbDocente: any): Docente {
  const p = dbDocente.persona;
  return {
    id: String(dbDocente.id_docente || dbDocente.idDocente || dbDocente.id),
    cedula: p?.cedula || dbDocente.cedula_docente || dbDocente.cedulaDocente,
    firstName: p?.nombre1 || dbDocente.nombre1,
    secondName: p?.nombre2 || dbDocente.nombre2 || undefined,
    lastName: p?.apellido1 || dbDocente.apellido1,
    secondLastName: p?.apellido2 || dbDocente.apellido2 || undefined,
    id_especialidad: dbDocente.id_especialidad || dbDocente.idEspecialidad || undefined,
    dateOfBirth: p?.fecha_nac || p?.fechaNac || dbDocente.fecha_nac || dbDocente.fechaNac || undefined,
    phone: p?.telefono || dbDocente.telefono || undefined,
    email: p?.correo || dbDocente.correo || undefined,
    status: dbDocente.estatus || 'Activo',
  };
}

export function mapPeriodoToSchoolPeriod(dbPeriodo: any): SchoolPeriod {
  return {
    id: String(dbPeriodo.id_periodo),
    name: dbPeriodo.nombre,
    status: dbPeriodo.estatus as any
  };
}

export function mapEstudianteToStudent(dbStudent: any, matriculas?: any[], secciones?: any[], activePeriodId?: number): Student {
  let academicYear: number = 1;
  let section: string = 'A';

  if (matriculas && secciones) {
    let studentMatriculas = matriculas.filter((m: any) => m.id_estudiante === dbStudent.id_estudiante);
    if (activePeriodId) {
      studentMatriculas = studentMatriculas.filter((m: any) => m.id_periodo === activePeriodId);
    }
    const activeMatricula = studentMatriculas.find((m: any) => m.estatus_matricula === 'Activo') || studentMatriculas[0];
    if (activeMatricula) {
      const seccion = secciones.find((s: any) => String(s.id_seccion || s.id) === String(activeMatricula.id_seccion));
      if (seccion) {
        academicYear = seccion.grado?.numero || seccion.id_grado || seccion.grade || 1;
        section = seccion.letra || seccion.letter || 'A';
      }
    }
  }

  const p = dbStudent.persona;
  const repP = dbStudent.representante?.persona;

  return {
    id: String(dbStudent.id_estudiante),
    firstName: p ? (p.nombre1 + (p.nombre2 ? ` ${p.nombre2}` : '')) : (dbStudent.nombre1 + (dbStudent.nombre2 ? ` ${dbStudent.nombre2}` : '')),
    lastName: p ? (p.apellido1 + (p.apellido2 ? ` ${p.apellido2}` : '')) : (dbStudent.apellido1 + (dbStudent.apellido2 ? ` ${dbStudent.apellido2}` : '')),
    cedula: p?.cedula || dbStudent.cedula_escolar,
    academicYear: academicYear as AcademicYear,
    section,
    status: dbStudent.estatus_estudiante === 'Inactivo' ? 'Inactivo' : 
            dbStudent.estatus_estudiante === 'Retirado' ? 'Retirado' : 'Activo',
    representativeName: repP 
      ? `${repP.nombre1} ${repP.apellido1}` 
      : (dbStudent.representante 
        ? `${dbStudent.representante.nombre1} ${dbStudent.representante.apellido1}` 
        : 'No asignado'),
    representativeCedula: repP?.cedula || dbStudent.representante?.cedula_rep || '',
    representativePhone: dbStudent.representante?.telefono || '',
    dateOfBirth: p?.fecha_nac || dbStudent.fecha_nac,
    gender: p?.genero || dbStudent.genero || 'M',
    birthPlace: dbStudent.lugar_nac || undefined,
    municipality: dbStudent.municipio || undefined,
    state: dbStudent.estado || undefined,
    representativeEmail: repP?.correo || dbStudent.representante?.correo || undefined,
    representativeAddress: dbStudent.representante?.direccion || undefined,
    repFirstName: repP?.nombre1 || dbStudent.representante?.nombre1 || undefined,
    repSecondName: repP?.nombre2 || dbStudent.representante?.nombre2 || undefined,
    repLastName: repP?.apellido1 || dbStudent.representante?.apellido1 || undefined,
    repSecondLastName: repP?.apellido2 || dbStudent.representante?.apellido2 || undefined,
  };
}

export function mapAulaToClassroom(dbAula: any): Classroom {
  return {
    id: String(dbAula.id_aula),
    name: dbAula.nombre_codigo,
    capacity: dbAula.capacidad || 30,
    type: dbAula.tipo_espacio as any,
    location: dbAula.ubicacion || ''
  };
}

export function mapAsignaturaToSubject(dbAsignatura: any, studyPlans?: any[]): Subject {
  let years: AcademicYear[] = [1, 2, 3, 4, 5];

  if (studyPlans) {
    const subjectPlans = studyPlans.filter((p: any) => String(p.id_asignatura) === String(dbAsignatura.id_asignatura));
    const uniqueYears = [...new Set(subjectPlans.map((p: any) => Number(p.grado?.numero || p.id_grado)).filter(Boolean))] as AcademicYear[];
    years = uniqueYears.sort((a, b) => a - b);
  }

  return {
    id: String(dbAsignatura.id_asignatura),
    name: dbAsignatura.nombre,
    shortName: dbAsignatura.nombre.substring(0, 3).toUpperCase(),
    years,
    tipoCalificacion: dbAsignatura.tipo_calificacion || 'Cuantitativa'
  };
}

export function mapHorarioToScheduleEvent(dbHorario: any): ScheduleEvent {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dayName = dbHorario.dia?.nombre || days[(dbHorario.id_dia - 1) % 5] || 'Lunes';
  const timeBlock = dbHorario.bloque ? `${dbHorario.bloque.hora_inicio.substring(0, 5)} - ${dbHorario.bloque.hora_fin.substring(0, 5)}` : '00:00 - 00:00';
  
  return {
    id: String(dbHorario.id_horario),
    day: dayName as any,
    timeBlock: timeBlock,
    year: dbHorario.seccion?.grado?.numero || dbHorario.id_grado || 1,
    section: dbHorario.seccion?.letra || 'A',
    subjectId: String(dbHorario.id_asignatura),
    teacherId: String(dbHorario.id_docente),
    classroomId: String(dbHorario.id_aula),
    blockId: String(dbHorario.id_bloque || dbHorario.bloque?.id_bloque || ''),
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
    posicion: dbPlan.posicion || 0,
    tipoCalificacion: dbPlan.asignatura?.tipo_calificacion || 'Cuantitativa'
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
    let lapso = ev.id_momento as 1|2|3;
    if (ev.momento) {
      if (ev.momento.descripcion === 'Primer Lapso') lapso = 1;
      else if (ev.momento.descripcion === 'Segundo Lapso') lapso = 2;
      else if (ev.momento.descripcion === 'Tercer Lapso') lapso = 3;
    }
    
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
    grade: dbSeccion.grado?.numero || dbSeccion.id_grado || 1,
    letter: dbSeccion.letra,
    periodId: String(dbSeccion.periodo?.id_periodo || dbSeccion.id_periodo),
    teacherGuideId: String(dbSeccion.docenteGuia?.id_docente || dbSeccion.id_docente_guia),
    homeClassroomId: String(dbSeccion.aula?.id_aula || dbSeccion.id_aula || ''),
  };
}

export function mapRepresentanteToRepresentative(dbRep: any): Representative {
  const p = dbRep.persona;
  return {
    id: String(dbRep.id_representante),
    cedula: p?.cedula || dbRep.cedula_rep,
    firstName: p ? (p.nombre1 + (p.nombre2 ? ` ${p.nombre2}` : '')) : (dbRep.nombre1 + (dbRep.nombre2 ? ` ${dbRep.nombre2}` : '')),
    lastName: p ? (p.apellido1 + (p.apellido2 ? ` ${p.apellido2}` : '')) : (dbRep.apellido1 + (dbRep.apellido2 ? ` ${dbRep.apellido2}` : '')),
    phone: dbRep.telefono || '',
  };
}

export function mapNotaParcialToGrade(dbNota: any, studentId: string): Grade {
  let lapso = (dbNota.evaluacion?.id_momento || dbNota.id_momento || 1) as 1|2|3;
  const momentoDesc = dbNota.evaluacion?.momento?.descripcion || dbNota.momento?.descripcion;
  if (momentoDesc) {
    if (momentoDesc === 'Primer Lapso') lapso = 1;
    else if (momentoDesc === 'Segundo Lapso') lapso = 2;
    else if (momentoDesc === 'Tercer Lapso') lapso = 3;
  }

  return {
    studentId: String(dbNota.matricula?.id_estudiante || dbNota.id_estudiante || studentId),
    subjectId: String(dbNota.evaluacion?.plan?.id_asignatura || dbNota.id_asignatura || ''),
    lapso: lapso,
    evaluationId: String(dbNota.id_evaluacion),
    score: dbNota.escala?.nota_calculo || dbNota.id_escala || 0
  };
}
