CREATE TABLE IF NOT EXISTS personas (
  id_persona SERIAL PRIMARY KEY,
  cedula VARCHAR(15) NOT NULL,
  nombre1 VARCHAR(50) NOT NULL,
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50) NOT NULL,
  apellido2 VARCHAR(50),
  fecha_nac DATE,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  genero CHAR(1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS personas_cedula_key ON personas (cedula);

ALTER TABLE docentes
  ADD COLUMN IF NOT EXISTS id_persona INTEGER REFERENCES personas(id_persona) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS docentes_id_persona_key ON docentes (id_persona) WHERE id_persona IS NOT NULL;

ALTER TABLE estudiantes
  ADD COLUMN IF NOT EXISTS id_persona INTEGER REFERENCES personas(id_persona) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS estudiantes_id_persona_key ON estudiantes (id_persona) WHERE id_persona IS NOT NULL;

ALTER TABLE representantes
  ADD COLUMN IF NOT EXISTS id_persona INTEGER REFERENCES personas(id_persona) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS representantes_id_persona_key ON representantes (id_persona) WHERE id_persona IS NOT NULL;

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS id_persona INTEGER REFERENCES personas(id_persona) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_id_persona_key ON usuarios (id_persona) WHERE id_persona IS NOT NULL;

COMMENT ON TABLE personas IS 'Almacena datos personales compartidos (supertipo). Cada registro es una persona fisica que puede tener multiples roles (docente, estudiante, representante, usuario).';
COMMENT ON COLUMN docentes.id_persona IS 'FK a la persona asociada a este docente';
COMMENT ON COLUMN estudiantes.id_persona IS 'FK a la persona asociada a este estudiante';
COMMENT ON COLUMN representantes.id_persona IS 'FK a la persona asociada a este representante';
COMMENT ON COLUMN usuarios.id_persona IS 'FK a la persona asociada a este usuario';
