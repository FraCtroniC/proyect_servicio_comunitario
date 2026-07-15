;
ALTER TABLE asistencia_estudiante
  ADD COLUMN IF NOT EXISTS id_horario INTEGER REFERENCES horario_docente(id_horario),
  ADD COLUMN IF NOT EXISTS id_docente_toma INTEGER REFERENCES docentes(id_docente);

COMMENT ON COLUMN asistencia_estudiante.id_horario IS 'Horario/clase especifica a la que pertenece esta asistencia';
COMMENT ON COLUMN asistencia_estudiante.id_docente_toma IS 'Docente que tomo/registro la asistencia';
DROP INDEX IF EXISTS asistencia_estudiante_id_matricula_fecha_key;
DROP INDEX IF EXISTS "asistencia_estudiante_id_matricula_fecha";
CREATE UNIQUE INDEX IF NOT EXISTS asistencia_estudiante_id_matricula_fecha_id_horario_key
  ON asistencia_estudiante (id_matricula, fecha, COALESCE(id_horario, 0));

ALTER TABLE asistencia_docente
  ADD COLUMN IF NOT EXISTS id_horario INTEGER REFERENCES horario_docente(id_horario),
  ADD COLUMN IF NOT EXISTS id_asignatura INTEGER REFERENCES asignaturas(id_asignatura);

COMMENT ON COLUMN asistencia_docente.id_horario IS 'Horario/clase especifica asociada al registro';
COMMENT ON COLUMN asistencia_docente.id_asignatura IS 'Materia asociada al registro de asistencia docente';
DROP INDEX IF EXISTS asistencia_docente_id_docente_fecha_key;
DROP INDEX IF EXISTS "asistencia_docente_id_docente_fecha";
CREATE UNIQUE INDEX IF NOT EXISTS asistencia_docente_id_docente_fecha_id_horario_key
  ON asistencia_docente (id_docente, fecha, COALESCE(id_horario, 0));
