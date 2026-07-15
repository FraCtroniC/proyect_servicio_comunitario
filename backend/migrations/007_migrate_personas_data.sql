INSERT INTO personas (cedula, nombre1, nombre2, apellido1, apellido2, fecha_nac, correo, telefono, created_at, updated_at)
SELECT
  d.cedula_docente,
  d.nombre1,
  d.nombre2,
  d.apellido1,
  d.apellido2,
  d.fecha_nac,
  d.correo,
  d.telefono,
  d.created_at,
  d.updated_at
FROM docentes d
WHERE d.id_persona IS NULL;

UPDATE docentes d
SET id_persona = p.id_persona
FROM personas p
WHERE p.cedula = d.cedula_docente AND d.id_persona IS NULL;

INSERT INTO personas (cedula, nombre1, nombre2, apellido1, apellido2, fecha_nac, genero, created_at, updated_at)
SELECT
  e.cedula_escolar,
  e.nombre1,
  e.nombre2,
  e.apellido1,
  e.apellido2,
  e.fecha_nac,
  e.genero,
  e.created_at,
  e.updated_at
FROM estudiantes e
WHERE e.id_persona IS NULL;

UPDATE estudiantes e
SET id_persona = p.id_persona
FROM personas p
WHERE p.cedula = e.cedula_escolar AND e.id_persona IS NULL;

INSERT INTO personas (cedula, nombre1, nombre2, apellido1, apellido2, correo, created_at, updated_at)
SELECT
  r.cedula_rep,
  r.nombre1,
  r.nombre2,
  r.apellido1,
  r.apellido2,
  r.correo,
  r.created_at,
  r.updated_at
FROM representantes r
WHERE r.id_persona IS NULL
ON CONFLICT (cedula) DO NOTHING;

UPDATE representantes r
SET id_persona = p.id_persona
FROM personas p
WHERE p.cedula = r.cedula_rep AND r.id_persona IS NULL;

UPDATE usuarios u
SET id_persona = d.id_persona
FROM docentes d
WHERE d.id_docente = u.id_docente AND u.id_persona IS NULL;
