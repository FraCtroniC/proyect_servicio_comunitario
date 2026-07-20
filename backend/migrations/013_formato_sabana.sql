-- ================================================================
-- MIGRATION 013: Esquema Completo de la Base de Datos
--
-- Este archivo contiene TODAS las tablas del sistema, extraídas
-- de los modelos Sequelize. Úsese como referencia o para crear
-- una base de datos desde cero.
--
-- NOTA: Ejecutar solo si la base de datos está vacía.
-- ================================================================

-- ================================================================
-- 1. TABLAS BASE (sin dependencias)
-- ================================================================

-- 1a. roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1b. especialidades
CREATE TABLE IF NOT EXISTS especialidades (
  id_especialidad SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  estatus VARCHAR(15) DEFAULT 'Activa',
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1c. dias_semana
CREATE TABLE IF NOT EXISTS dias_semana (
  id_dia SERIAL PRIMARY KEY,
  nombre VARCHAR(15) NOT NULL,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1d. bloques_horarios
CREATE TABLE IF NOT EXISTS bloques_horarios (
  id_bloque SERIAL PRIMARY KEY,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tipo_bloque VARCHAR(20),
  numero_bloque INTEGER,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1e. aulas
CREATE TABLE IF NOT EXISTS aulas (
  id_aula SERIAL PRIMARY KEY,
  nombre_codigo VARCHAR(30) NOT NULL,
  capacidad INTEGER,
  tipo_espacio VARCHAR(30),
  ubicacion VARCHAR(100),
  estatus VARCHAR(20),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1f. grados_anos
CREATE TABLE IF NOT EXISTS grados_anos (
  id_grado SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL,
  nombre VARCHAR(30) NOT NULL,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1g. escala_calificaciones
CREATE TABLE IF NOT EXISTS escala_calificaciones (
  id_escala SERIAL PRIMARY KEY,
  nota_impresa VARCHAR(3) NOT NULL,
  nota_literal VARCHAR(20) NOT NULL,
  nota_calculo INTEGER,
  ponderacion_letra CHAR(1),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1h. asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id_asignatura SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  tipo_calificacion VARCHAR(15) NOT NULL,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1i. periodos_escolares
CREATE TABLE IF NOT EXISTS periodos_escolares (
  id_periodo SERIAL PRIMARY KEY,
  nombre VARCHAR(9) NOT NULL,
  estatus VARCHAR(20) NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 1j. tipo_plan_estudio
CREATE TABLE IF NOT EXISTS tipo_plan_estudio (
  id_tipo_plan SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  resolucion VARCHAR(100),
  estatus VARCHAR(10) NOT NULL DEFAULT 'Activo',
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- ================================================================
-- 2. TABLAS CON DEPENDENCIAS NIVEL 1
-- ================================================================

-- 2a. usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  estatus VARCHAR(15) DEFAULT 'Activo',
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until DATE,
  token_version INTEGER NOT NULL DEFAULT 0,
  ultimo_acceso DATE,
  cedula VARCHAR(15),
  nombre1 VARCHAR(50),
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50),
  apellido2 VARCHAR(50),
  fecha_nac DATE,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  id_especialidad INTEGER REFERENCES especialidades(id_especialidad),
  token_qr VARCHAR(255) UNIQUE,
  estatus_docente VARCHAR(15),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 2b. refresh_tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  token_hash VARCHAR(64) NOT NULL,
  expires_at DATE NOT NULL,
  created_at DATE NOT NULL DEFAULT NOW(),
  revoked_at DATE
);

-- 2c. login_audit
CREATE TABLE IF NOT EXISTS login_audit (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at DATE NOT NULL DEFAULT NOW()
);

-- 2d. auditoria
CREATE TABLE IF NOT EXISTS auditoria (
  id_auditoria SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario),
  accion VARCHAR(20) NOT NULL,
  tabla_afectada VARCHAR(50) NOT NULL,
  registro_id INTEGER,
  valores_antiguos JSONB,
  valores_nuevos JSONB,
  ip_direccion VARCHAR(45),
  fecha_hora DATE NOT NULL DEFAULT NOW()
);

-- 2e. representantes
CREATE TABLE IF NOT EXISTS representantes (
  id_representante SERIAL PRIMARY KEY,
  cedula_rep VARCHAR(15),
  nombre1 VARCHAR(50),
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50),
  apellido2 VARCHAR(50),
  correo VARCHAR(100),
  telefono VARCHAR(20),
  direccion TEXT,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- ================================================================
-- 3. TABLAS CON DEPENDENCIAS NIVEL 2
-- ================================================================

-- 3a. estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id_estudiante SERIAL PRIMARY KEY,
  cedula_escolar VARCHAR(15),
  nombre1 VARCHAR(50),
  nombre2 VARCHAR(50),
  apellido1 VARCHAR(50),
  apellido2 VARCHAR(50),
  fecha_nac DATE,
  genero CHAR(1),
  lugar_nac VARCHAR(100),
  municipio VARCHAR(50),
  estado VARCHAR(50),
  id_representante INTEGER NOT NULL REFERENCES representantes(id_representante),
  estatus_estudiante VARCHAR(20),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 3b. observaciones_estudiante
CREATE TABLE IF NOT EXISTS observaciones_estudiante (
  id_observacion SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  gravedad VARCHAR(20),
  id_usuario_crea INTEGER REFERENCES usuarios(id_usuario),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- ================================================================
-- 4. TABLAS CON DEPENDENCIAS NIVEL 3
-- ================================================================

-- 4a. secciones
CREATE TABLE IF NOT EXISTS secciones (
  id_seccion SERIAL PRIMARY KEY,
  id_periodo INTEGER NOT NULL REFERENCES periodos_escolares(id_periodo),
  id_grado INTEGER NOT NULL REFERENCES grados_anos(id_grado),
  letra CHAR(1) NOT NULL,
  id_docente_guia INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_aula INTEGER REFERENCES aulas(id_aula),
  capacidad_maxima INTEGER DEFAULT 30,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 4b. plan_estudio
CREATE TABLE IF NOT EXISTS plan_estudio (
  id_plan SERIAL PRIMARY KEY,
  id_grado INTEGER NOT NULL REFERENCES grados_anos(id_grado),
  id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id_asignatura),
  id_tipo_plan INTEGER NOT NULL REFERENCES tipo_plan_estudio(id_tipo_plan),
  codigo_asignatura VARCHAR(15),
  posicion INTEGER,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 4c. momentos
CREATE TABLE IF NOT EXISTS momentos (
  id_momento SERIAL PRIMARY KEY,
  id_periodo INTEGER NOT NULL REFERENCES periodos_escolares(id_periodo),
  estatus VARCHAR(20) NOT NULL DEFAULT 'Abierto',
  descripcion VARCHAR(20),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 4d. formatos_sabana
CREATE TABLE IF NOT EXISTS formatos_sabana (
  id_formato SERIAL PRIMARY KEY,
  nombre_formato VARCHAR(100) NOT NULL,
  configuracion JSONB NOT NULL DEFAULT '{
    "margenes": { "top": 20, "bottom": 20, "left": 15, "right": 15 },
    "orientacion": "portrait",
    "secciones": {
      "header": { "altura": 120, "elementos": [] },
      "body": { "altura": "auto", "elementos": [] },
      "footer": { "altura": 80, "elementos": [] }
    }
  }',
  imagen_referencia TEXT,
  es_activo BOOLEAN DEFAULT true,
  creado_por INTEGER REFERENCES usuarios(id_usuario),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_modificacion TIMESTAMP DEFAULT NOW()
);

-- ================================================================
-- 5. TABLAS CON DEPENDENCIAS NIVEL 4
-- ================================================================

-- 5a. evaluaciones
CREATE TABLE IF NOT EXISTS evaluaciones (
  id_evaluacion SERIAL PRIMARY KEY,
  id_plan INTEGER NOT NULL REFERENCES plan_estudio(id_plan),
  id_seccion INTEGER NOT NULL REFERENCES secciones(id_seccion),
  id_momento INTEGER NOT NULL REFERENCES momentos(id_momento),
  descripcion VARCHAR(100) NOT NULL,
  ponderacion INTEGER NOT NULL CHECK (ponderacion >= 1 AND ponderacion <= 100),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 5b. matricula
CREATE TABLE IF NOT EXISTS matricula (
  id_matricula SERIAL PRIMARY KEY,
  id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
  id_seccion INTEGER NOT NULL REFERENCES secciones(id_seccion),
  id_periodo INTEGER NOT NULL REFERENCES periodos_escolares(id_periodo),
  numero_lista INTEGER,
  estatus_matricula VARCHAR(20),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 5c. materia_pendiente
CREATE TABLE IF NOT EXISTS materia_pendiente (
  id_materia_pendiente SERIAL PRIMARY KEY,
  id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
  id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id_asignatura),
  id_periodo INTEGER NOT NULL REFERENCES periodos_escolares(id_periodo),
  id_docente_evaluador INTEGER REFERENCES usuarios(id_usuario),
  nota_definitiva INTEGER,
  estatus VARCHAR(20) DEFAULT 'Cursando',
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 5d. historico_notas_certificadas
CREATE TABLE IF NOT EXISTS historico_notas_certificadas (
  id_historico SERIAL PRIMARY KEY,
  id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
  id_grado INTEGER NOT NULL REFERENCES grados_anos(id_grado),
  id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id_asignatura),
  id_periodo INTEGER NOT NULL REFERENCES periodos_escolares(id_periodo),
  id_escala INTEGER NOT NULL REFERENCES escala_calificaciones(id_escala),
  institucion_origen VARCHAR(150) NOT NULL DEFAULT 'L.N. Estilita Orozco',
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 5e. horario_docente
CREATE TABLE IF NOT EXISTS horario_docente (
  id_horario SERIAL PRIMARY KEY,
  id_docente INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id_asignatura),
  id_seccion INTEGER NOT NULL REFERENCES secciones(id_seccion),
  id_dia INTEGER NOT NULL REFERENCES dias_semana(id_dia),
  id_bloque INTEGER NOT NULL REFERENCES bloques_horarios(id_bloque),
  id_aula INTEGER NOT NULL REFERENCES aulas(id_aula),
  id_periodo INTEGER REFERENCES periodos_escolares(id_periodo),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- ================================================================
-- 6. TABLAS CON DEPENDENCIAS NIVEL 5
-- ================================================================

-- 6a. calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
  id_calificacion SERIAL PRIMARY KEY,
  id_matricula INTEGER NOT NULL REFERENCES matricula(id_matricula),
  id_plan INTEGER NOT NULL REFERENCES plan_estudio(id_plan),
  id_momento INTEGER NOT NULL REFERENCES momentos(id_momento),
  id_escala INTEGER NOT NULL REFERENCES escala_calificaciones(id_escala),
  inasistencias_asignatura INTEGER NOT NULL DEFAULT 0,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 6b. notas_parciales
CREATE TABLE IF NOT EXISTS notas_parciales (
  id_nota SERIAL PRIMARY KEY,
  id_matricula INTEGER NOT NULL REFERENCES matricula(id_matricula),
  id_evaluacion INTEGER NOT NULL REFERENCES evaluaciones(id_evaluacion),
  id_escala INTEGER NOT NULL REFERENCES escala_calificaciones(id_escala),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 6c. asistencia_estudiante
CREATE TABLE IF NOT EXISTS asistencia_estudiante (
  id_asistencia_est SERIAL PRIMARY KEY,
  id_matricula INTEGER NOT NULL REFERENCES matricula(id_matricula),
  fecha DATE NOT NULL,
  id_horario INTEGER REFERENCES horario_docente(id_horario),
  id_docente_toma INTEGER REFERENCES usuarios(id_usuario),
  estatus VARCHAR(20),
  id_observacion INTEGER REFERENCES observaciones_estudiante(id_observacion),
  id_usuario_crea INTEGER REFERENCES usuarios(id_usuario),
  id_usuario_modifica INTEGER REFERENCES usuarios(id_usuario),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE,
  UNIQUE(id_matricula, fecha, id_horario)
);

-- 6d. asistencia_docente
CREATE TABLE IF NOT EXISTS asistencia_docente (
  id_asistencia SERIAL PRIMARY KEY,
  id_docente INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  fecha DATE NOT NULL,
  hora_entrada TIME,
  hora_salida TIME,
  estatus VARCHAR(20),
  id_horario INTEGER REFERENCES horario_docente(id_horario),
  id_asignatura INTEGER REFERENCES asignaturas(id_asignatura),
  id_usuario_crea INTEGER REFERENCES usuarios(id_usuario),
  id_usuario_modifica INTEGER REFERENCES usuarios(id_usuario),
  fecha_anulacion DATE,
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE,
  UNIQUE(id_docente, fecha, id_horario)
);

-- ================================================================
-- 7. TABLAS CON DEPENDENCIAS NIVEL 6
-- ================================================================

-- 7a. justificaciones
CREATE TABLE IF NOT EXISTS justificaciones (
  id_justificacion SERIAL PRIMARY KEY,
  id_asistencia INTEGER NOT NULL REFERENCES asistencia_docente(id_asistencia),
  motivo TEXT,
  soporte_digital VARCHAR(255),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- 7b. justificaciones_estudiante
CREATE TABLE IF NOT EXISTS justificaciones_estudiante (
  id_justificacion_est SERIAL PRIMARY KEY,
  id_asistencia_est INTEGER NOT NULL REFERENCES asistencia_estudiante(id_asistencia_est) ON DELETE CASCADE,
  motivo TEXT,
  soporte_digital VARCHAR(255),
  created_at DATE NOT NULL DEFAULT NOW(),
  updated_at DATE
);

-- ================================================================
-- 8. ÍNDICES ADICIONALES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_formatos_sabana_activo ON formatos_sabana(es_activo);
CREATE INDEX IF NOT EXISTS idx_formatos_sabana_creado_por ON formatos_sabana(creado_por);

-- ================================================================
-- 9. TRIGGER: Mantener solo un formato activo
-- ================================================================

CREATE OR REPLACE FUNCTION desactivar_formatos_anteriores()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.es_activo = true THEN
    UPDATE formatos_sabana
    SET es_activo = false
    WHERE id_formato != NEW.id_formato AND es_activo = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_desactivar_formatos_anteriores ON formatos_sabana;
CREATE TRIGGER trg_desactivar_formatos_anteriores
  BEFORE INSERT OR UPDATE OF es_activo
  ON formatos_sabana
  FOR EACH ROW
  EXECUTE FUNCTION desactivar_formatos_anteriores();

-- ================================================================
-- 10. VERIFICACIÓN
-- ================================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
