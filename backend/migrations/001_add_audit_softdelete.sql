-- Migration 001: Agregar columnas de auditoría y soft-delete
-- Ejecutar con: npx ts-node scripts/run-migrations.ts

-- ============================================================
-- 1. asistencia_estudiante: columnas de auditoría
-- ============================================================
ALTER TABLE asistencia_estudiante
  ADD COLUMN IF NOT EXISTS id_usuario_crea INTEGER REFERENCES usuarios(id_usuario),
  ADD COLUMN IF NOT EXISTS id_usuario_modifica INTEGER REFERENCES usuarios(id_usuario);

-- ============================================================
-- 2. asistencia_docente: columnas de auditoría + soft-delete
-- ============================================================
ALTER TABLE asistencia_docente
  ADD COLUMN IF NOT EXISTS id_usuario_crea INTEGER REFERENCES usuarios(id_usuario),
  ADD COLUMN IF NOT EXISTS id_usuario_modifica INTEGER REFERENCES usuarios(id_usuario),
  ADD COLUMN IF NOT EXISTS fecha_anulacion TIMESTAMP;

-- ============================================================
-- 3. Actualizar el estatus de la DBML: de 'Asistió' a 'Puntual'
--    (cambio semántico documentado, no altera datos existentes)
-- ============================================================

COMMENT ON COLUMN asistencia_estudiante.id_usuario_crea IS 'Usuario que registró la asistencia';
COMMENT ON COLUMN asistencia_estudiante.id_usuario_modifica IS 'Usuario que modificó la asistencia';
COMMENT ON COLUMN asistencia_docente.id_usuario_crea IS 'Usuario que registró la entrada/salida';
COMMENT ON COLUMN asistencia_docente.id_usuario_modifica IS 'Usuario que modificó el registro';
COMMENT ON COLUMN asistencia_docente.fecha_anulacion IS 'Soft-delete: fecha en que se anuló el registro';
