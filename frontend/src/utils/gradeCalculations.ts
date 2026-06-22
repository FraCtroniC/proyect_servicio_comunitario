import { Grade, EvaluationPlan, EvaluationItem } from '../types';

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
