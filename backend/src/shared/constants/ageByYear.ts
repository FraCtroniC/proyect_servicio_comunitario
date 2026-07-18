export const AGE_RANGE_BY_YEAR: Record<number, { min: number; max: number }> = {
  1: { min: 12, max: 13 },
  2: { min: 13, max: 14 },
  3: { min: 14, max: 15 },
  4: { min: 15, max: 16 },
  5: { min: 16, max: 17 },
};

export function calculateAgeFromBirth(fechaNac: string): number {
  const birth = new Date(fechaNac);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function validateAgeForYear(age: number, academicYear: number): string | null {
  const range = AGE_RANGE_BY_YEAR[academicYear];
  if (!range) return 'Año escolar inválido.';
  if (age < range.min || age > range.max) {
    return `Para ${academicYear}° Año, la edad debe ser entre ${range.min} y ${range.max} años (edad actual: ${age}).`;
  }
  return null;
}
