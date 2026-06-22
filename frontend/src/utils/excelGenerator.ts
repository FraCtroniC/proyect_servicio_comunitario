import * as XLSX from 'xlsx';
import { Student, Grade, Subject, EvaluationPlan } from '../types';
import { calculateSubjectFinalGrade } from './gradeCalculations';

export const exportStudentsToExcel = (students: Student[]) => {
  const data = students.map(s => ({
    'Cédula': s.cedula,
    'Apellidos': s.lastName,
    'Nombres': s.firstName,
    'Año': s.academicYear,
    'Sección': s.section,
    'Estatus': s.status,
    'Fecha Nacimiento': s.dateOfBirth,
    'Representante': s.representativeName,
    'Cédula Rep.': s.representativeCedula,
    'Teléfono Rep.': s.representativePhone
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

  // Ajustar anchos de columna
  worksheet['!cols'] = [
    { wch: 15 }, // Cedula
    { wch: 25 }, // Apellidos
    { wch: 25 }, // Nombres
    { wch: 5 },  // Año
    { wch: 8 },  // Seccion
    { wch: 12 }, // Estatus
    { wch: 15 }, // Fecha
    { wch: 30 }, // Rep Name
    { wch: 15 }, // Rep Cedula
    { wch: 15 }  // Rep Phone
  ];

  XLSX.writeFile(workbook, 'Nomina_Estudiantes.xlsx');
};

export const exportGradesToExcel = (
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

  const data = filteredStudents.map(student => {
    const row: any = {
      'Cédula': student.cedula,
      'Nombres y Apellidos': `${student.lastName}, ${student.firstName}`
    };

    let aprobadas = 0;
    let aplazadas = 0;

    yearSubjects.forEach(sub => {
      const { rounded } = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id);
      row[sub.shortName] = rounded || 0;
      
      if (rounded >= 10) aprobadas++;
      else if (rounded > 0) aplazadas++;
    });

    row['Aprobadas'] = aprobadas;
    row['Aplazadas'] = aplazadas;
    row['Estatus Académico'] = aplazadas > 0 ? 'Con Materias Pendientes' : 'Promovido';

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Notas_${year}Ano_${section}`);

  XLSX.writeFile(workbook, `Sabana_Notas_${year}_${section}.xlsx`);
};
