import { describe, it, expect } from 'vitest';

describe('Environment configuration', () => {
  it('loads environment variables with defaults', async () => {
    const { environment } = await import('../../config/environment');
    expect(environment).toBeDefined();
    expect(environment.port).toBeTypeOf('number');
    expect(environment.jwtSecret).toBeTypeOf('string');
    expect(environment.frontendUrl).toBeTypeOf('string');
  });
});
