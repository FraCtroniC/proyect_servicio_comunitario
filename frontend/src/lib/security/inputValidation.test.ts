import { describe, expect, it } from 'vitest';
import { containsMaliciousPattern, validatePasswordInput, validateUserNameInput } from './inputValidation';

describe('inputValidation', () => {
  it('accepts valid usernames', () => {
    const result = validateUserNameInput('arturo');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('arturo');
  });

  it('rejects script injection', () => {
    const result = validateUserNameInput('<script>alert(1)</script>');
    expect(result.ok).toBe(false);
  });

  it('allows login password without common-password block', () => {
    const result = validatePasswordInput('1234', { forLogin: true });
    expect(result.ok).toBe(true);
  });

  it('blocks common passwords on reset', () => {
    const result = validatePasswordInput('password');
    expect(result.ok).toBe(false);
  });

  it('detects sql patterns', () => {
    expect(containsMaliciousPattern("' OR 1=1 --")).toBe(true);
  });
});
