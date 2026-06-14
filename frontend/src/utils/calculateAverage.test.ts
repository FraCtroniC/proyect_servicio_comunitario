import { describe, expect, it } from 'vitest';
import { calculateAverage } from './calculateAverage';

describe('calculateAverage', () => {
  it('returns 0 for an empty list', () => {
    expect(calculateAverage([])).toBe(0);
  });

  it('calculates the arithmetic mean', () => {
    expect(calculateAverage([80, 90, 100])).toBe(90);
  });
});