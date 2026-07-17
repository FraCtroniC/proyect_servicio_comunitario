import * as ExcelJS from 'exceljs';
import { Student, Grade, Subject, EvaluationPlan } from '../types';
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
