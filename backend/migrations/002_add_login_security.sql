-- Migration 002: Login security - failed attempts persistent + audit log
-- Ejecutar con: npm run migrate
;

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS failed_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL
;

CREATE TABLE IF NOT EXISTS login_audit (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_username_created
  ON login_audit (username, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_audit_ip_created
  ON login_audit (ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_audit_created
  ON login_audit (created_at DESC);
