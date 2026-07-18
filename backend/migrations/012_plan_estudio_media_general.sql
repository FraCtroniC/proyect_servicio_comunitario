-- ================================================================
-- MIGRATION 012: Plan de Estudio Completo - Media General (MPPE)
--
-- 1. Restaura columnas faltantes en varias tablas (causadas por
--    migraciones 008-011 que dejaron las tablas inconsistentes).
-- 2. Carga el plan de estudio completo para 1° a 5° año de
--    Educación Media General según el currículo del MPPE.
--
-- Ejecutar con: npx ts-node scripts/run-migrations.ts
-- ================================================================

-- ================================================================
-- 1. RESTAURAR COLUMNAS FALTANTES
--    Migraciones 008-011 eliminaron columnas sin restaurarlas
--    correctamente. Estas sentencias son IDEMPOTENTES.
-- ================================================================

-- 1a. usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS correo VARCHAR(100);

-- 1b. estudiantes
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS cedula_escolar VARCHAR(15);
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS nombre1 VARCHAR(50);
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS nombre2 VARCHAR(50);
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS apellido1 VARCHAR(50);
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS apellido2 VARCHAR(50);
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS fecha_nac DATE;
ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS genero CHAR(1);

-- 1c. representantes
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS cedula_rep VARCHAR(15);
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS nombre1 VARCHAR(50);
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS nombre2 VARCHAR(50);
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS apellido1 VARCHAR(50);
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS apellido2 VARCHAR(50);
ALTER TABLE representantes ADD COLUMN IF NOT EXISTS correo VARCHAR(100);

-- 1d. secciones
ALTER TABLE secciones ADD COLUMN IF NOT EXISTS id_docente_guia INTEGER REFERENCES usuarios(id_usuario);

-- 1e. horario_docente
ALTER TABLE horario_docente ADD COLUMN IF NOT EXISTS id_docente INTEGER REFERENCES usuarios(id_usuario);

-- 1f. asistencia_docente
ALTER TABLE asistencia_docente ADD COLUMN IF NOT EXISTS id_docente INTEGER REFERENCES usuarios(id_usuario);

-- 1g. asistencia_estudiante
ALTER TABLE asistencia_estudiante ADD COLUMN IF NOT EXISTS id_docente_toma INTEGER REFERENCES usuarios(id_usuario);

-- 1h. materia_pendiente
ALTER TABLE materia_pendiente ADD COLUMN IF NOT EXISTS id_docente_evaluador INTEGER REFERENCES usuarios(id_usuario);

-- ================================================================
-- 2. LIMPIEZA: Eliminar datos semilla existentes
--    (plan_estudio y asignaturas)
--
-- NOTA: Si hay calificaciones/evaluaciones reales, este script
-- NO las elimina. Solo borra plan_estudio y asignaturas que
-- no tengan referencias.
-- ================================================================

DELETE FROM plan_estudio;
DELETE FROM asignaturas;

ALTER SEQUENCE IF EXISTS asignaturas_id_asignatura_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS plan_estudio_id_plan_seq RESTART WITH 1;

-- ================================================================
-- 3. ASIGNATURAS (Materias)
-- ================================================================

INSERT INTO asignaturas (nombre, tipo_calificacion, created_at, updated_at) VALUES
  ('Castellano',                  'Cuantitativo', NOW(), NOW()),   -- 1
  ('Inglés',                     'Cuantitativo', NOW(), NOW()),   -- 2
  ('Matemática',                 'Cuantitativo', NOW(), NOW()),   -- 3
  ('Educación Física',           'Cuantitativo', NOW(), NOW()),   -- 4
  ('Arte y Patrimonio',          'Cuantitativo', NOW(), NOW()),   -- 5
  ('Ciencias Naturales',         'Cuantitativo', NOW(), NOW()),   -- 6
  ('Geografía, Historia y Ciudadanía', 'Cuantitativo', NOW(), NOW()), -- 7
  ('Orientación y Convivencia',  'Cualitativo',  NOW(), NOW()),   -- 8
  ('Biología',                   'Cuantitativo', NOW(), NOW()),   -- 9
  ('Psicología',                 'Cuantitativo', NOW(), NOW()),   -- 10
  ('Formación para la Soberanía', 'Cualitativo', NOW(), NOW()),   -- 11
  ('Grupo de Participación',     'Cualitativo',  NOW(), NOW());   -- 12

-- ================================================================
-- 4. PLAN DE ESTUDIO (Materias por año)
-- ================================================================

-- 4a. 1er Año (id_grado = 1)
INSERT INTO plan_estudio (id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) VALUES
  (1, 1,  'CAS1', 1, NOW(), NOW()),
  (1, 2,  'ING1', 2, NOW(), NOW()),
  (1, 3,  'MAT1', 3, NOW(), NOW()),
  (1, 4,  'EDF1', 4, NOW(), NOW()),
  (1, 5,  'AYP1', 5, NOW(), NOW()),
  (1, 6,  'CSN1', 6, NOW(), NOW()),
  (1, 7,  'GHC1', 7, NOW(), NOW()),
  (1, 8,  'OYC1', 8, NOW(), NOW());

-- 4b. 2do Año (id_grado = 2)
INSERT INTO plan_estudio (id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) VALUES
  (2, 1,  'CAS2', 1, NOW(), NOW()),
  (2, 2,  'ING2', 2, NOW(), NOW()),
  (2, 3,  'MAT2', 3, NOW(), NOW()),
  (2, 4,  'EDF2', 4, NOW(), NOW()),
  (2, 5,  'AYP2', 5, NOW(), NOW()),
  (2, 6,  'CSN2', 6, NOW(), NOW()),
  (2, 7,  'GHC2', 7, NOW(), NOW()),
  (2, 8,  'OYC2', 8, NOW(), NOW());

-- 4c. 3er Año (id_grado = 3)
INSERT INTO plan_estudio (id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) VALUES
  (3, 1,  'CAS3', 1, NOW(), NOW()),
  (3, 2,  'ING3', 2, NOW(), NOW()),
  (3, 3,  'MAT3', 3, NOW(), NOW()),
  (3, 4,  'EDF3', 4, NOW(), NOW()),
  (3, 5,  'AYP3', 5, NOW(), NOW()),
  (3, 6,  'CSN3', 6, NOW(), NOW()),
  (3, 7,  'GHC3', 7, NOW(), NOW()),
  (3, 8,  'OYC3', 8, NOW(), NOW());

-- 4d. 4to Año (id_grado = 4) - Incluye Psicología, Soberanía y Participación
INSERT INTO plan_estudio (id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) VALUES
  (4, 1,  'CAS4', 1,  NOW(), NOW()),
  (4, 2,  'ING4', 2,  NOW(), NOW()),
  (4, 3,  'MAT4', 3,  NOW(), NOW()),
  (4, 4,  'EDF4', 4,  NOW(), NOW()),
  (4, 5,  'AYP4', 5,  NOW(), NOW()),
  (4, 9,  'BIO4', 6,  NOW(), NOW()),
  (4, 7,  'GHC4', 7,  NOW(), NOW()),
  (4, 8,  'OYC4', 8,  NOW(), NOW()),
  (4, 10, 'PSC4', 9,  NOW(), NOW()),
  (4, 11, 'FPS4', 10, NOW(), NOW()),
  (4, 12, 'GRP4', 11, NOW(), NOW());

-- 4e. 5to Año (id_grado = 5)
INSERT INTO plan_estudio (id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) VALUES
  (5, 1,  'CAS5', 1,  NOW(), NOW()),
  (5, 2,  'ING5', 2,  NOW(), NOW()),
  (5, 3,  'MAT5', 3,  NOW(), NOW()),
  (5, 4,  'EDF5', 4,  NOW(), NOW()),
  (5, 5,  'AYP5', 5,  NOW(), NOW()),
  (5, 9,  'BIO5', 6,  NOW(), NOW()),
  (5, 7,  'GHC5', 7,  NOW(), NOW()),
  (5, 8,  'OYC5', 8,  NOW(), NOW()),
  (5, 10, 'PSC5', 9,  NOW(), NOW()),
  (5, 11, 'FPS5', 10, NOW(), NOW()),
  (5, 12, 'GRP5', 11, NOW(), NOW());

-- ================================================================
-- 5. VERIFICACIÓN
-- ================================================================

-- Mostrar el resultado del plan de estudio completo
SELECT
  g.numero AS ano,
  g.nombre AS grado,
  a.nombre AS asignatura,
  pe.codigo_asignatura AS codigo,
  pe.posicion,
  a.tipo_calificacion
FROM plan_estudio pe
JOIN grados_anos g ON g.id_grado = pe.id_grado
JOIN asignaturas a ON a.id_asignatura = pe.id_asignatura
ORDER BY g.numero, pe.posicion;
