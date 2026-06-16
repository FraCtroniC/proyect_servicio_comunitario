-- =======================================================================
-- Archivo SQL para PostgreSQL - Liceo (Media General) MPPE Venezuela
-- Incluye: Tablas base, foráneas, tipos de datos nativos (JSONB, SERIAL)
-- =======================================================================

-- -----------------------------------------------------------------------
-- FASE 1: CREACIÓN DE TABLAS MAESTRAS (Sin llaves foráneas dependientes)
-- -----------------------------------------------------------------------

CREATE TABLE periodos_escolares (
    id_periodo SERIAL PRIMARY KEY,
    nombre VARCHAR(9) NOT NULL, -- Formato: 2025-2026
    estatus VARCHAR(10) NOT NULL, -- Activo, Inactivo, Planificacion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE grados_anos (
    id_grado SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL, -- 1 al 5 para Media General
    nombre VARCHAR(30) NOT NULL, -- Ej: Primer Año, Quinto Año
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE asignaturas (
    id_asignatura SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- Ej: Castellano
    tipo_calificacion VARCHAR(15) NOT NULL, -- Cuantitativa o Cualitativa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE aulas (
    id_aula SERIAL PRIMARY KEY,
    nombre_codigo VARCHAR(30) NOT NULL, -- Ej: Aula 5, Lab Biología
    capacidad INTEGER,
    tipo_espacio VARCHAR(30),
    ubicacion VARCHAR(100),
    estatus VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE dias_semana (
    id_dia SERIAL PRIMARY KEY,
    nombre VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE bloques_horarios (
    id_bloque SERIAL PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo_bloque VARCHAR(20),
    numero_bloque INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE escala_calificaciones (
    id_escala SERIAL PRIMARY KEY,
    nota_impresa VARCHAR(3) NOT NULL, -- Ej: 01, 15, NC, **
    nota_literal VARCHAR(20) NOT NULL,
    nota_calculo INTEGER, -- Null para NC/PE
    ponderacion_letra CHAR(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- -----------------------------------------------------------------------
-- FASE 2: TABLAS DE PERSONAS
-- -----------------------------------------------------------------------

CREATE TABLE docentes (
    id_docente SERIAL PRIMARY KEY,
    cedula_docente VARCHAR(15) UNIQUE NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20),
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20),
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(50),
    token_qr VARCHAR(255) UNIQUE,
    estatus VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE representantes (
    id_representante SERIAL PRIMARY KEY,
    cedula_rep VARCHAR(15) UNIQUE NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20),
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20),
    telefono VARCHAR(20),
    direccion TEXT,
    correo VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE estudiantes (
    id_estudiante SERIAL PRIMARY KEY,
    cedula_escolar VARCHAR(15) UNIQUE NOT NULL,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    fecha_nac DATE NOT NULL,
    lugar_nac VARCHAR(100),
    municipio VARCHAR(50),
    estado VARCHAR(50),
    genero CHAR(1),
    id_representante INTEGER REFERENCES representantes(id_representante),
    estatus_estudiante VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- -----------------------------------------------------------------------
-- FASE 3: TABLAS RELACIONALES INTERMEDIAS Y ACADÉMICAS
-- -----------------------------------------------------------------------

CREATE TABLE secciones (
    id_seccion SERIAL PRIMARY KEY,
    id_grado INTEGER REFERENCES grados_anos(id_grado),
    letra CHAR(1) NOT NULL,
    id_docente_guia INTEGER REFERENCES docentes(id_docente),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE plan_estudio (
    id_plan SERIAL PRIMARY KEY,
    id_grado INTEGER REFERENCES grados_anos(id_grado),
    id_asignatura INTEGER REFERENCES asignaturas(id_asignatura),
    codigo_asignatura VARCHAR(15),
    posicion INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id_estudiante),
    id_seccion INTEGER REFERENCES secciones(id_seccion),
    id_periodo INTEGER REFERENCES periodos_escolares(id_periodo),
    numero_lista INTEGER,
    estatus_matricula VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE momentos (
    id_momento SERIAL PRIMARY KEY,
    id_periodo INTEGER REFERENCES periodos_escolares(id_periodo),
    descripcion VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- -----------------------------------------------------------------------
-- FASE 4: TRANSACCIONALES (Calificaciones, Asistencia, Horarios)
-- -----------------------------------------------------------------------

CREATE TABLE calificaciones (
    id_calificacion SERIAL PRIMARY KEY,
    id_matricula INTEGER REFERENCES matricula(id_matricula),
    id_plan INTEGER REFERENCES plan_estudio(id_plan),
    id_momento INTEGER REFERENCES momentos(id_momento),
    id_escala INTEGER REFERENCES escala_calificaciones(id_escala),
    inasistencias_asignatura INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE historico_notas_certificadas (
    id_historico SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id_estudiante),
    id_grado INTEGER REFERENCES grados_anos(id_grado),
    id_asignatura INTEGER REFERENCES asignaturas(id_asignatura),
    id_periodo INTEGER REFERENCES periodos_escolares(id_periodo),
    id_escala INTEGER REFERENCES escala_calificaciones(id_escala),
    institucion_origen VARCHAR(150) DEFAULT 'L.N. Estilita Orozco',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE horario_docente (
    id_horario SERIAL PRIMARY KEY,
    id_docente INTEGER REFERENCES docentes(id_docente),
    id_asignatura INTEGER REFERENCES asignaturas(id_asignatura),
    id_seccion INTEGER REFERENCES secciones(id_seccion),
    id_dia INTEGER REFERENCES dias_semana(id_dia),
    id_bloque INTEGER REFERENCES bloques_horarios(id_bloque),
    id_aula INTEGER REFERENCES aulas(id_aula),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE asistencia_docente (
    id_asistencia SERIAL PRIMARY KEY,
    id_docente INTEGER REFERENCES docentes(id_docente),
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    estatus VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE justificaciones (
    id_justificacion SERIAL PRIMARY KEY,
    id_asistencia INTEGER REFERENCES asistencia_docente(id_asistencia),
    motivo TEXT,
    soporte_digital VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- -----------------------------------------------------------------------
-- FASE 5: SISTEMA DE SEGURIDAD Y AUDITORÍA
-- -----------------------------------------------------------------------

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER REFERENCES roles(id_rol),
    id_docente INTEGER REFERENCES docentes(id_docente),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    estatus VARCHAR(15),
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE auditoria (
    id_auditoria SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    accion VARCHAR(20) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INTEGER,
    valores_antiguos JSONB, -- Formato nativo de PostgreSQL para objetos
    valores_nuevos JSONB,   -- Formato nativo de PostgreSQL para objetos
    ip_direccion VARCHAR(45),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
