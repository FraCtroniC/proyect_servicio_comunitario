type AttemptRecord = {
  count: number;
  lockedUntil: number | null;
};

function readRecord(storageKey: string): AttemptRecord {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as AttemptRecord;
    if (typeof parsed.count !== 'number') return { count: 0, lockedUntil: null };
    return parsed;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function writeRecord(storageKey: string, record: AttemptRecord) {
  localStorage.setItem(storageKey, JSON.stringify(record));
}

export function isRateLimited(
  scope: string,
  maxAttempts: number,
): { limited: boolean; retryAfterMinutes?: number } {
  const key = `liceo-rate-${scope}`;
  const record = readRecord(key);
  const now = Date.now();

  if (record.lockedUntil && record.lockedUntil > now) {
    const minutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { limited: true, retryAfterMinutes: minutes };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    writeRecord(key, { count: 0, lockedUntil: null });
  }

  if (record.count >= maxAttempts) {
    return { limited: true, retryAfterMinutes: 1 };
  }

  return { limited: false };
}

export function registerFailedAttempt(
  scope: string,
  maxAttempts: number,
  lockoutMs: number,
): { limited: boolean; retryAfterMinutes?: number } {
  const key = `liceo-rate-${scope}`;
  const record = readRecord(key);
  const nextCount = record.count + 1;

  if (nextCount >= maxAttempts) {
    const lockedUntil = Date.now() + lockoutMs;
    writeRecord(key, { count: nextCount, lockedUntil });
    return { limited: true, retryAfterMinutes: Math.ceil(lockoutMs / 60000) };
  }

  writeRecord(key, { count: nextCount, lockedUntil: null });
  return { limited: false };
}

export function clearAttempts(scope: string) {
  writeRecord(`liceo-rate-${scope}`, { count: 0, lockedUntil: null });
}
