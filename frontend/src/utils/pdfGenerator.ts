import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Grade, Subject, EvaluationPlan } from '../types';
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
    const { rounded } = calculateSubjectFinalGrade(grades, evaluationPlans, student.id, sub.id);
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

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });
  doc.text('LICEO ESTILITA OROZCO', doc.internal.pageSize.getWidth() / 2, 100, { align: 'center' });

  doc.setFontSize(16);
  doc.text('CONSTANCIA DE ESTUDIO', doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });

  // Body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const text = `Quien suscribe, Director(a) del Liceo Estilita Orozco, hace constar por medio de la presente que el (la) estudiante ${student.firstName} ${student.lastName}, portador(a) de la Cédula de Identidad / Cédula Escolar Nro. ${student.cedula}, cursa en esta institución el ${student.academicYear}° Año de Educación Media General, Sección "${student.section}", durante el presente periodo escolar.`;

  const splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 100);
  doc.text(splitText, 50, 220, { align: 'justify', lineHeightFactor: 1.5 });

  const date = new Date();
  const dateText = `Constancia que se expide a petición de la parte interesada, en la ciudad respectiva, a los ${date.getDate()} días del mes de ${date.toLocaleString('es-ES', { month: 'long' })} del año ${date.getFullYear()}.`;
  
  const splitDateText = doc.splitTextToSize(dateText, doc.internal.pageSize.getWidth() - 100);
  doc.text(splitDateText, 50, 320, { align: 'justify', lineHeightFactor: 1.5 });

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.text('________________________________', doc.internal.pageSize.getWidth() / 2, 500, { align: 'center' });
  doc.text('Director(a) de la Institución', doc.internal.pageSize.getWidth() / 2, 520, { align: 'center' });

  doc.save(`Constancia_${student.cedula}.pdf`);
};
