-- ================================================================
-- MIGRATION 011: Revert supertipo/subtipo (personas + docentes)
--
-- Vuelve a poner los datos personales en sus tablas originales:
--   usuarios, estudiantes, representantes
-- y elimina las tablas personas y docentes.
--
-- Las FK de tablas que apuntaban a docentes.id_docente ahora
-- apuntan a usuarios.id_usuario (cada docente = 1 usuario).
-- ================================================================

-- 1. Agregar columnas personales a usuarios
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS cedula VARCHAR(15),
  ADD COLUMN IF NOT EXISTS nombre1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS nombre2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS fecha_nac DATE,
  ADD COLUMN IF NOT EXISTS correo VARCHAR(100),
  ADD COLUMN IF NOT EXISTS telefono VARCHAR(20),
  ADD COLUMN IF NOT EXISTS id_especialidad INTEGER REFERENCES especialidades(id_especialidad) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS token_qr VARCHAR(255),
  ADD COLUMN IF NOT EXISTS estatus_docente VARCHAR(15);

-- Copiar datos de personas + docentes a usuarios (solo si personas existe aun)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personas') THEN
    UPDATE usuarios u
    SET
      cedula        = p.cedula,
      nombre1       = p.nombre1,
      nombre2       = p.nombre2,
      apellido1     = p.apellido1,
      apellido2     = p.apellido2,
      fecha_nac     = p.fecha_nac,
      correo        = p.correo,
      telefono      = p.telefono,
      id_especialidad = d.id_especialidad,
      token_qr      = d.token_qr,
      estatus_docente = d.estatus
    FROM personas p
    LEFT JOIN docentes d ON d.id_persona = p.id_persona
    WHERE u.id_persona = p.id_persona;
  END IF;
END $$;

-- Unique index en cedula de usuarios
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_cedula ON usuarios(cedula) WHERE cedula IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_token_qr ON usuarios(token_qr) WHERE token_qr IS NOT NULL;

-- 2. Agregar columnas personales a estudiantes
ALTER TABLE estudiantes
  ADD COLUMN IF NOT EXISTS cedula_escolar VARCHAR(15),
  ADD COLUMN IF NOT EXISTS nombre1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS nombre2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS fecha_nac DATE,
  ADD COLUMN IF NOT EXISTS genero CHAR(1);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personas') THEN
    UPDATE estudiantes e
    SET
      cedula_escolar = p.cedula,
      nombre1        = p.nombre1,
      nombre2        = p.nombre2,
      apellido1      = p.apellido1,
      apellido2      = p.apellido2,
      fecha_nac      = p.fecha_nac,
      genero         = p.genero
    FROM personas p
    WHERE e.id_persona = p.id_persona;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_estudiantes_cedula_escolar ON estudiantes(cedula_escolar) WHERE cedula_escolar IS NOT NULL;

-- 3. Agregar columnas personales a representantes
ALTER TABLE representantes
  ADD COLUMN IF NOT EXISTS cedula_rep VARCHAR(15),
  ADD COLUMN IF NOT EXISTS nombre1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS nombre2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido1 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS apellido2 VARCHAR(50),
  ADD COLUMN IF NOT EXISTS correo VARCHAR(100);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personas') THEN
    UPDATE representantes r
    SET
      cedula_rep = p.cedula,
      nombre1    = p.nombre1,
      nombre2    = p.nombre2,
      apellido1  = p.apellido1,
      apellido2  = p.apellido2,
      correo     = p.correo
    FROM personas p
    WHERE r.id_persona = p.id_persona;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_representantes_cedula_rep ON representantes(cedula_rep) WHERE cedula_rep IS NOT NULL;

-- 4. Migrar FK de docentes.id_docente → usuarios.id_usuario
--    Cada docente se corresponde 1a1 con un usuario via usuarios.id_docente = docentes.id_docente.

-- 4a. horario_docente.id_docente → usuarios.id_usuario
ALTER TABLE horario_docente ADD COLUMN IF NOT EXISTS id_usuario_tmp INTEGER;
UPDATE horario_docente hd
SET id_usuario_tmp = u.id_usuario
FROM usuarios u
WHERE u.id_docente = hd.id_docente;
ALTER TABLE horario_docente DROP CONSTRAINT IF EXISTS horario_docente_id_docente_fkey;
ALTER TABLE horario_docente DROP COLUMN IF EXISTS id_docente;
ALTER TABLE horario_docente RENAME COLUMN id_usuario_tmp TO id_docente;
ALTER TABLE horario_docente ALTER COLUMN id_docente SET NOT NULL;
ALTER TABLE horario_docente ADD FOREIGN KEY (id_docente) REFERENCES usuarios(id_usuario);

-- 4b. asistencia_docente.id_docente → usuarios.id_usuario
ALTER TABLE asistencia_docente ADD COLUMN IF NOT EXISTS id_usuario_tmp INTEGER;
UPDATE asistencia_docente ad
SET id_usuario_tmp = u.id_usuario
FROM usuarios u
WHERE u.id_docente = ad.id_docente;
ALTER TABLE asistencia_docente DROP CONSTRAINT IF EXISTS asistencia_docente_id_docente_fkey;
ALTER TABLE asistencia_docente DROP COLUMN IF EXISTS id_docente;
ALTER TABLE asistencia_docente RENAME COLUMN id_usuario_tmp TO id_docente;
ALTER TABLE asistencia_docente ALTER COLUMN id_docente SET NOT NULL;
ALTER TABLE asistencia_docente ADD FOREIGN KEY (id_docente) REFERENCES usuarios(id_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS uq_asistencia_docente_docente_fecha_horario
  ON asistencia_docente(id_docente, fecha, id_horario) WHERE id_docente IS NOT NULL;

-- 4c. asistencia_estudiante.id_docente_toma → usuarios.id_usuario
ALTER TABLE asistencia_estudiante ADD COLUMN IF NOT EXISTS id_usuario_tmp INTEGER;
UPDATE asistencia_estudiante ae
SET id_usuario_tmp = u.id_usuario
FROM usuarios u
WHERE u.id_docente = ae.id_docente_toma;
ALTER TABLE asistencia_estudiante DROP CONSTRAINT IF EXISTS asistencia_estudiante_id_docente_toma_fkey;
ALTER TABLE asistencia_estudiante DROP COLUMN IF EXISTS id_docente_toma;
ALTER TABLE asistencia_estudiante RENAME COLUMN id_usuario_tmp TO id_docente_toma;
ALTER TABLE asistencia_estudiante ADD FOREIGN KEY (id_docente_toma) REFERENCES usuarios(id_usuario);

-- 4d. materia_pendiente.id_docente_evaluador → usuarios.id_usuario
ALTER TABLE materia_pendiente ADD COLUMN IF NOT EXISTS id_usuario_tmp INTEGER;
UPDATE materia_pendiente mp
SET id_usuario_tmp = u.id_usuario
FROM usuarios u
WHERE u.id_docente = mp.id_docente_evaluador;
ALTER TABLE materia_pendiente DROP CONSTRAINT IF EXISTS materia_pendiente_id_docente_evaluador_fkey;
ALTER TABLE materia_pendiente DROP COLUMN IF EXISTS id_docente_evaluador;
ALTER TABLE materia_pendiente RENAME COLUMN id_usuario_tmp TO id_docente_evaluador;
ALTER TABLE materia_pendiente ADD FOREIGN KEY (id_docente_evaluador) REFERENCES usuarios(id_usuario);

-- 4e. secciones.id_docente_guia → usuarios.id_usuario
ALTER TABLE secciones ADD COLUMN IF NOT EXISTS id_usuario_tmp INTEGER;
UPDATE secciones s
SET id_usuario_tmp = u.id_usuario
FROM usuarios u
WHERE u.id_docente = s.id_docente_guia;
ALTER TABLE secciones DROP CONSTRAINT IF EXISTS secciones_id_docente_guia_fkey;
ALTER TABLE secciones DROP COLUMN IF EXISTS id_docente_guia;
ALTER TABLE secciones RENAME COLUMN id_usuario_tmp TO id_docente_guia;
ALTER TABLE secciones ALTER COLUMN id_docente_guia SET NOT NULL;
ALTER TABLE secciones ADD FOREIGN KEY (id_docente_guia) REFERENCES usuarios(id_usuario);

-- 5. Limpiar columnas FK obsoletas en usuarios
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_persona_fkey;
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_docente_fkey;
ALTER TABLE usuarios DROP COLUMN IF EXISTS id_persona;
ALTER TABLE usuarios DROP COLUMN IF EXISTS id_docente;

-- 6. Eliminar dependencias hacia docentes y personas
ALTER TABLE docentes DROP CONSTRAINT IF EXISTS docentes_id_persona_fkey;
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS estudiantes_id_persona_fkey;
ALTER TABLE representantes DROP CONSTRAINT IF EXISTS representantes_id_persona_fkey;

DROP INDEX IF EXISTS docentes_id_persona_key;
DROP INDEX IF EXISTS estudiantes_id_persona_key;
DROP INDEX IF EXISTS representantes_id_persona_key;
DROP INDEX IF EXISTS usuarios_id_persona_key;
DROP INDEX IF EXISTS personas_cedula_key;

ALTER TABLE estudiantes DROP COLUMN IF EXISTS id_persona;
ALTER TABLE representantes DROP COLUMN IF EXISTS id_persona;

DROP TABLE IF EXISTS docentes;
DROP TABLE IF EXISTS personas;
