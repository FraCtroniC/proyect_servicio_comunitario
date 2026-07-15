import { Grade, EvaluationPlan, EvaluationItem } from '../types';

// Conversión de nota numérica a letra según escala MPPE (escala_calificaciones.ponderacion_letra)
export const gradeToLiteral = (grade: number): string => {
  if (grade >= 18) return 'A';
  if (grade >= 14) return 'B';
  if (grade >= 10) return 'C';
  return 'D';
};

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

export const calculateSubjectFinalGrade = (grades: Grade[], evaluationPlans: EvaluationPlan[], studentId: string, subjectId: string, year?: number, section?: string) => {
  const lapsos: (1|2|3)[] = [1, 2, 3];

  const sumaLapsos = lapsos.reduce((sum, lap) => {
    const plan = evaluationPlans.find(p =>
      p.subjectId === subjectId && p.lapso === lap &&
      (year === undefined || p.year === year) &&
      (section === undefined || p.section === section)
    );
    if (plan) {
      const { raw, rounded } = calculateEvaluationAverage(grades, plan.evaluations, studentId, subjectId, lap);
      return sum + (raw > 0 ? rounded : 1);
    }
    return sum + 1;
  }, 0);

  const rawFinal = sumaLapsos / 3;
  const roundedFinal = Math.round(rawFinal);

  return {
    raw: Number(rawFinal.toFixed(2)),
    rounded: roundedFinal
  };
};
