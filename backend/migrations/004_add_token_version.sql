-- Migration 004: Add token_version for instant token invalidation on logout
;
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
