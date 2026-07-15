import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Grade, Subject, EvaluationPlan, Attendance, AcademicYear } from '../types';
import { calculateSubjectFinalGrade } from './gradeCalculations';

export const generateBoletinPDF = (
  student: Student,
  subjects: Subject[],
  grades: Grade[],
  evaluationPlans: EvaluationPlan[]
) => {
  const doc = new jsPDF('p', 'pt', 'letter');
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  doc.text('LICEO ESTILITA OROZCO', doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

  doc.setFontSize(14);
  doc.text('BOLETÍN INFORMATIVO DE CALIFICACIONES', doc.internal.pageSize.getWidth() / 2, 120, { align: 'center' });

  // Student Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombres y Apellidos: ${student.firstName} ${student.lastName}`, 40, 160);
  doc.text(`Cédula Escolar / Identidad: ${student.cedula}`, 40, 180);
  doc.text(`Año y Sección: ${student.academicYear}° Año "${student.section}"`, 40, 200);

  // Filter subjects for this year
  const yearSubjects = subjects.filter(sub => sub.years.includes(student.academicYear));

  // Prepare table data
  const tableData = yearSubjects.map(sub => {
    // We only need the final grade rounded according to MPPE
    const { rounded } = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id, student.academicYear, student.section);
    const literal = rounded >= 18 ? 'A' : (rounded >= 14 ? 'B' : (rounded >= 10 ? 'C' : 'D'));
    const status = rounded >= 10 ? 'Aprobado' : 'Aplazado';

    return [
      sub.name,
      rounded.toString(),
      literal,
      status
    ];
  });

  // Render Table
  autoTable(doc, {
    startY: 230,
    head: [['Asignatura', 'Calificación Final (Definitiva)', 'Literal', 'Estatus']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' }
    }
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 40;
  doc.text('________________________________', doc.internal.pageSize.getWidth() / 2, finalY + 40, { align: 'center' });
  doc.text('Firma y Sello de la Dirección', doc.internal.pageSize.getWidth() / 2, finalY + 55, { align: 'center' });

  doc.save(`Boletin_${student.cedula}_${student.lastName}.pdf`);
};

export const generateConstanciaEstudio = (student: Student) => {
  const doc = new jsPDF('p', 'pt', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 70;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', pageWidth / 2, 60, { align: 'center' });
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', pageWidth / 2, 80, { align: 'center' });
  doc.text('LICEO ESTILITA OROZCO', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(16);
  doc.text('CONSTANCIA DE ESTUDIO', pageWidth / 2, 150, { align: 'center' });

  // Body
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const text = `Quien suscribe, Director(a) del Liceo Estilita Orozco, hace constar por medio de la presente que el (la) estudiante ${student.firstName} ${student.lastName}, portador(a) de la Cédula de Identidad / Cédula Escolar Nro. ${student.cedula}, cursa en esta institución el ${student.academicYear}° Año de Educación Media General, Sección "${student.section}", durante el presente periodo escolar.`;

  const splitText = doc.splitTextToSize(text, maxWidth);
  const lineHeight = 11 * 1.5;

  let y = 200;
  doc.text(splitText, margin, y, { align: 'left', lineHeightFactor: 1.5 });
  y += splitText.length * lineHeight + 30;

  const date = new Date();
  const dateText = `Constancia que se expide a petición de la parte interesada, en la ciudad respectiva, a los ${date.getDate()} días del mes de ${date.toLocaleString('es-ES', { month: 'long' })} del año ${date.getFullYear()}.`;

  const splitDateText = doc.splitTextToSize(dateText, maxWidth);
  doc.text(splitDateText, margin, y, { align: 'left', lineHeightFactor: 1.5 });
  y += splitDateText.length * lineHeight + 40;

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.text('________________________________', pageWidth / 2, y, { align: 'center' });
  doc.text('Director(a) de la Institución', pageWidth / 2, y + 20, { align: 'center' });

  doc.save(`Constancia_Estudio_${student.cedula}.pdf`);
};

export const generateActaMateriaPendiente = (
  materiaPendiente: any,
  institucion = 'Liceo Estilita Orozco'
) => {
  const doc = new jsPDF('p', 'pt', 'letter');
  
  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  doc.text(institucion.toUpperCase(), doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

  doc.setFontSize(16);
  doc.text('ACTA DE EVALUACIÓN DE MATERIA PENDIENTE', doc.internal.pageSize.getWidth() / 2, 130, { align: 'center' });

  // Body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const student = materiaPendiente.estudiante || materiaPendiente.student;
  const asig = materiaPendiente.asignatura || materiaPendiente.subject;
  const periodo = materiaPendiente.periodo || materiaPendiente.period;
  const docente = materiaPendiente.docente || materiaPendiente.evaluator;

  doc.text(`Por medio de la presente se hace constar que el (la) estudiante:`, 40, 180);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student?.nombres || student?.firstName} ${student?.apellidos || student?.lastName}`, 40, 205);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cédula de Identidad o Escolar: ${student?.cedula}`, 40, 225);
  
  doc.text(`Cursó y fue evaluado(a) en la asignatura pendiente:`, 40, 260);
  doc.setFont('helvetica', 'bold');
  doc.text(`${asig?.nombre || 'Desconocida'}`, 40, 285);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`En el Período Escolar: ${periodo?.nombre || 'N/A'}`, 40, 320);
  
  const calificacion = materiaPendiente.nota_definitiva !== null && materiaPendiente.nota_definitiva !== undefined 
    ? materiaPendiente.nota_definitiva 
    : materiaPendiente.finalGrade !== null && materiaPendiente.finalGrade !== undefined
      ? materiaPendiente.finalGrade 
      : 'SIN EVALUAR';

  doc.text(`Obteniendo la calificación definitiva de:`, 40, 360);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calificacion} Pts.  -  Condición: ${materiaPendiente.estatus?.toUpperCase() || materiaPendiente.status?.toUpperCase()}`, 40, 385);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bajo la evaluación del docente: ${docente?.nombres || ''} ${docente?.apellidos || ''}`, 40, 420);

  // Signatures
  doc.text('__________________________________', 100, 550, { align: 'center' });
  doc.text('DOCENTE EVALUADOR', 100, 570, { align: 'center' });

  doc.text('__________________________________', doc.internal.pageSize.getWidth() - 100, 550, { align: 'center' });
  doc.text('DIRECTOR(A)', doc.internal.pageSize.getWidth() - 100, 570, { align: 'center' });
  doc.text('SELLO', doc.internal.pageSize.getWidth() / 2, 570, { align: 'center' });

  // Footer date
  const dateStr = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Expedido el ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 700, { align: 'center' });

  doc.save(`Acta_MateriaPendiente_${student?.cedula}_${asig?.nombre?.replace(/\s/g, '_')}.pdf`);
};

export const generateReporteAsistencia = (
  students: Student[],
  attendance: Attendance[],
  year: AcademicYear,
  section: string,
  fechaDesde: string,
  fechaHasta: string,
  subjectName?: string,
  blockName?: string,
) => {
  const doc = new jsPDF('l', 'pt', 'letter');

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', doc.internal.pageSize.getWidth() / 2, 58, { align: 'center' });
  doc.text('LICEO ESTILITA OROZCO', doc.internal.pageSize.getWidth() / 2, 76, { align: 'center' });

  doc.setFontSize(13);
  doc.text('REPORTE DE ASISTENCIA', doc.internal.pageSize.getWidth() / 2, 110, { align: 'center' });

  // Filters info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let infoLine = `Año: ${year}°  Sección: "${section}"  Desde: ${fechaDesde}  Hasta: ${fechaHasta}`;
  if (subjectName) infoLine += `  Materia: ${subjectName}`;
  if (blockName) infoLine += `  Bloque: ${blockName}`;
  doc.text(infoLine, doc.internal.pageSize.getWidth() / 2, 130, { align: 'center' });

  // Student attendance summary table
  const tableData = students
    .filter(s => s.status === 'Activo')
    .map(student => {
      const studentRecords = attendance.filter(a => a.studentId === student.id);
      const presentes = studentRecords.filter(a => a.status === 'P').length;
      const ausentes = studentRecords.filter(a => a.status === 'A').length;
      const justificados = studentRecords.filter(a => a.status === 'J').length;
      const total = studentRecords.length;
      const porcentaje = total > 0 ? Math.round(((presentes + justificados) / total) * 100) : 100;

      return [
        `${student.lastName}, ${student.firstName}`,
        student.cedula,
        presentes.toString(),
        ausentes.toString(),
        justificados.toString(),
        total.toString(),
        `${porcentaje}%`
      ];
    });

  autoTable(doc, {
    startY: 150,
    head: [['Estudiante', 'Cédula', 'Presentes', 'Ausentes', 'Justificados', 'Total', '% Asistencia']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { cellWidth: 80 },
      2: { halign: 'center', cellWidth: 60 },
      3: { halign: 'center', cellWidth: 60 },
      4: { halign: 'center', cellWidth: 70 },
      5: { halign: 'center', cellWidth: 50 },
      6: { halign: 'center', cellWidth: 65 }
    }
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('P: Presente | A: Ausente | J: Justificado', 40, finalY, { align: 'left' });

  const date = new Date();
  doc.text(`Generado: ${date.toLocaleDateString('es-ES')}`, doc.internal.pageSize.getWidth() - 40, finalY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('________________________________', doc.internal.pageSize.getWidth() / 2, finalY + 60, { align: 'center' });
  doc.text('Director(a) de la Institución', doc.internal.pageSize.getWidth() / 2, finalY + 75, { align: 'center' });

  doc.save(`Reporte_Asistencia_${year}°_${section}_${fechaDesde}.pdf`);
};
