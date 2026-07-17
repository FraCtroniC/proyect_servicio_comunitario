import * as ExcelJS from 'exceljs';
import { Student, Grade, Subject, EvaluationPlan, Section, SchoolPeriod, Docente, Classroom } from '../types';
import { calculateSubjectFinalGrade, gradeToLiteral } from './gradeCalculations';

const downloadExcel = async (workbook: ExcelJS.Workbook, filename: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportStudentsToExcel = async (students: Student[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Estudiantes');

  worksheet.columns = [
    { header: 'Cédula', key: 'cedula', width: 15 },
    { header: 'Apellidos', key: 'apellidos', width: 25 },
    { header: 'Nombres', key: 'nombres', width: 25 },
    { header: 'Año', key: 'ano', width: 10 },
    { header: 'Sección', key: 'seccion', width: 10 },
    { header: 'Estatus', key: 'estatus', width: 15 },
    { header: 'Fecha Nacimiento', key: 'fechaNacimiento', width: 20 },
    { header: 'Representante', key: 'representante', width: 35 },
    { header: 'Cédula Rep.', key: 'cedulaRep', width: 15 },
    { header: 'Teléfono Rep.', key: 'telefonoRep', width: 15 }
  ];

  students.forEach(s => {
    worksheet.addRow({
      cedula: s.cedula,
      apellidos: s.lastName,
      nombres: s.firstName,
      ano: s.academicYear,
      seccion: s.section,
      estatus: s.status,
      fechaNacimiento: s.dateOfBirth,
      representante: s.representativeName,
      cedulaRep: s.representativeCedula,
      telefonoRep: s.representativePhone
    });
  });

  // Hacer la fila de encabezado en negrita
  worksheet.getRow(1).font = { bold: true };

  await downloadExcel(workbook, 'Nomina_Estudiantes.xlsx');
};

export const exportGradesToExcel = async (
  students: Student[],
  subjects: Subject[],
  grades: Grade[],
  evaluationPlans: EvaluationPlan[],
  year: number,
  section: string
) => {
  // Solo alumnos de la seccion específica
  const filteredStudents = students.filter(s => s.academicYear === year && s.section === section);
  const yearSubjects = subjects.filter(sub => sub.years.includes(year as any));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Notas_${year}Ano_${section}`);

  const columns: Partial<ExcelJS.Column>[] = [
    { header: 'Cédula', key: 'cedula', width: 15 },
    { header: 'Nombres y Apellidos', key: 'nombresApellidos', width: 40 }
  ];

  yearSubjects.forEach(sub => {
    columns.push({ header: sub.shortName, key: `sub_${sub.id}`, width: 15 });
  });

  columns.push({ header: 'Aprobadas', key: 'aprobadas', width: 12 });
  columns.push({ header: 'Aplazadas', key: 'aplazadas', width: 12 });
  columns.push({ header: 'Estatus Académico', key: 'estatusAcademico', width: 25 });

  worksheet.columns = columns;

  filteredStudents.forEach(student => {
    const rowData: any = {
      cedula: student.cedula,
      nombresApellidos: `${student.lastName}, ${student.firstName}`
    };

    let aprobadas = 0;
    let aplazadas = 0;

    yearSubjects.forEach(sub => {
      const { rounded } = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id, year, section);
      const isCualitativa = sub.tipoCalificacion === 'Cualitativo';
      rowData[`sub_${sub.id}`] = isCualitativa ? gradeToLiteral(rounded) : (rounded || 0);
      
      if (rounded >= 10) aprobadas++;
      else if (rounded > 0) aplazadas++;
    });

    rowData.aprobadas = aprobadas;
    rowData.aplazadas = aplazadas;
    rowData.estatusAcademico = aplazadas > 0 ? 'Con Materias Pendientes' : 'Promovido';

    worksheet.addRow(rowData);
  });

  // Hacer la fila de encabezado en negrita
  worksheet.getRow(1).font = { bold: true };

  await downloadExcel(workbook, `Sabana_Notas_${year}_${section}.xlsx`);
};

export const exportSectionsToExcel = async (
  sections: Section[],
  students: Student[],
  periods: SchoolPeriod[],
  docentes: Docente[],
  classrooms: Classroom[]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Secciones');

  worksheet.columns = [
    { header: 'Sección', key: 'seccion', width: 12 },
    { header: 'Grado', key: 'grado', width: 10 },
    { header: 'Letra', key: 'letra', width: 8 },
    { header: 'Periodo', key: 'periodo', width: 20 },
    { header: 'Docente Guía', key: 'docente', width: 30 },
    { header: 'Aula Base', key: 'aula', width: 18 },
    { header: 'Cap. Máxima', key: 'capMax', width: 14 },
    { header: 'Est. Matriculados', key: 'ocupados', width: 18 },
    { header: '% Ocupación', key: 'ocupacion', width: 14 },
    { header: 'Estado', key: 'estado', width: 12 }
  ];

  sections.forEach(s => {
    const periodo = periods.find(p => String(p.id) === String(s.periodId));
    const docente = docentes.find(d => d.id === s.teacherGuideId);
    const aula = classrooms.find(c => c.id === s.homeClassroomId);
    const maxCupos = s.capacityMax || (aula ? aula.capacity : 0);
    const ocupados = students.filter(st => st.academicYear === s.grade && st.section === s.letter).length;
    const porcentaje = maxCupos > 0 ? Math.round((ocupados / maxCupos) * 100) : 0;
    const estado = maxCupos > 0 && ocupados >= maxCupos ? 'LLENO' : 'Disponible';

    worksheet.addRow({
      seccion: `${s.grade}° ${s.letter}`,
      grado: s.grade,
      letra: s.letter,
      periodo: periodo?.name || 'N/A',
      docente: docente ? `${docente.firstName} ${docente.lastName}` : 'N/A',
      aula: aula?.name || 'N/A',
      capMax: s.capacityMax || aula?.capacity || 0,
      ocupados,
      ocupacion: `${porcentaje}%`,
      estado,
    });
  });

  worksheet.getRow(1).font = { bold: true };

  await downloadExcel(workbook, `Reporte_Secciones_${new Date().toISOString().split('T')[0]}.xlsx`);
};
