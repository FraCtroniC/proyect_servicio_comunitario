--
-- PostgreSQL database dump
--

\restrict ZjzowbRsGErGnCpWZx5opbcdRakNAkjcLF9ieysvVN7fp5rztt1sMWgeoHCuSpS

-- Dumped from database version 18.4 (2773af8)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asignaturas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.asignaturas (
    id_asignatura integer NOT NULL,
    nombre character varying(50) NOT NULL,
    tipo_calificacion character varying(15) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.asignaturas OWNER TO neondb_owner;

--
-- Name: asignaturas_id_asignatura_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.asignaturas_id_asignatura_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignaturas_id_asignatura_seq OWNER TO neondb_owner;

--
-- Name: asignaturas_id_asignatura_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.asignaturas_id_asignatura_seq OWNED BY public.asignaturas.id_asignatura;


--
-- Name: asistencia_docente; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.asistencia_docente (
    id_asistencia integer NOT NULL,
    fecha date NOT NULL,
    hora_entrada time without time zone,
    hora_salida time without time zone,
    estatus character varying(20),
    id_horario integer,
    id_asignatura integer,
    id_usuario_crea integer,
    id_usuario_modifica integer,
    fecha_anulacion timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_docente integer
);


ALTER TABLE public.asistencia_docente OWNER TO neondb_owner;

--
-- Name: COLUMN asistencia_docente.id_horario; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_horario IS 'Horario/clase especifica asociada al registro';


--
-- Name: COLUMN asistencia_docente.id_asignatura; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_asignatura IS 'Materia asociada al registro de asistencia docente';


--
-- Name: COLUMN asistencia_docente.id_usuario_crea; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_usuario_crea IS 'Usuario que registró la entrada/salida';


--
-- Name: COLUMN asistencia_docente.id_usuario_modifica; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_usuario_modifica IS 'Usuario que modificó el registro';


--
-- Name: COLUMN asistencia_docente.fecha_anulacion; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.fecha_anulacion IS 'Soft-delete: fecha en que se anuló el registro';


--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.asistencia_docente_id_asistencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_docente_id_asistencia_seq OWNER TO neondb_owner;

--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.asistencia_docente_id_asistencia_seq OWNED BY public.asistencia_docente.id_asistencia;


--
-- Name: asistencia_estudiante; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.asistencia_estudiante (
    id_asistencia_est integer NOT NULL,
    id_matricula integer NOT NULL,
    fecha date NOT NULL,
    id_horario integer,
    estatus character varying(20),
    id_usuario_crea integer,
    id_usuario_modifica integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_docente_toma integer,
    id_observacion integer
);


ALTER TABLE public.asistencia_estudiante OWNER TO neondb_owner;

--
-- Name: COLUMN asistencia_estudiante.id_horario; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.id_horario IS 'Horario/clase especifica a la que pertenece esta asistencia';


--
-- Name: COLUMN asistencia_estudiante.estatus; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.estatus IS 'Presente, Ausente, Justificado';


--
-- Name: COLUMN asistencia_estudiante.id_usuario_modifica; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.id_usuario_modifica IS 'Usuario que modificó la asistencia';


--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.asistencia_estudiante_id_asistencia_est_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_estudiante_id_asistencia_est_seq OWNER TO neondb_owner;

--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.asistencia_estudiante_id_asistencia_est_seq OWNED BY public.asistencia_estudiante.id_asistencia_est;


--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.auditoria (
    id_auditoria integer NOT NULL,
    id_usuario integer,
    accion character varying(20) NOT NULL,
    tabla_afectada character varying(50) NOT NULL,
    registro_id integer,
    valores_antiguos jsonb,
    valores_nuevos jsonb,
    ip_direccion character varying(45),
    fecha_hora timestamp with time zone NOT NULL
);


ALTER TABLE public.auditoria OWNER TO neondb_owner;

--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.auditoria_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_id_auditoria_seq OWNER TO neondb_owner;

--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.auditoria_id_auditoria_seq OWNED BY public.auditoria.id_auditoria;


--
-- Name: aulas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.aulas (
    id_aula integer NOT NULL,
    nombre_codigo character varying(30) NOT NULL,
    capacidad integer,
    tipo_espacio character varying(30),
    ubicacion character varying(100),
    estatus character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.aulas OWNER TO neondb_owner;

--
-- Name: aulas_id_aula_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.aulas_id_aula_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aulas_id_aula_seq OWNER TO neondb_owner;

--
-- Name: aulas_id_aula_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.aulas_id_aula_seq OWNED BY public.aulas.id_aula;


--
-- Name: bloques_horarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bloques_horarios (
    id_bloque integer NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    tipo_bloque character varying(20),
    numero_bloque integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.bloques_horarios OWNER TO neondb_owner;

--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bloques_horarios_id_bloque_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bloques_horarios_id_bloque_seq OWNER TO neondb_owner;

--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bloques_horarios_id_bloque_seq OWNED BY public.bloques_horarios.id_bloque;


--
-- Name: calificaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.calificaciones (
    id_calificacion integer NOT NULL,
    id_matricula integer NOT NULL,
    id_plan integer NOT NULL,
    id_momento integer NOT NULL,
    id_escala integer NOT NULL,
    inasistencias_asignatura integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.calificaciones OWNER TO neondb_owner;

--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.calificaciones_id_calificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calificaciones_id_calificacion_seq OWNER TO neondb_owner;

--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.calificaciones_id_calificacion_seq OWNED BY public.calificaciones.id_calificacion;


--
-- Name: dias_semana; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dias_semana (
    id_dia integer NOT NULL,
    nombre character varying(15) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dias_semana OWNER TO neondb_owner;

--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dias_semana_id_dia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dias_semana_id_dia_seq OWNER TO neondb_owner;

--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dias_semana_id_dia_seq OWNED BY public.dias_semana.id_dia;


--
-- Name: escala_calificaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.escala_calificaciones (
    id_escala integer NOT NULL,
    nota_impresa character varying(3) NOT NULL,
    nota_literal character varying(20) NOT NULL,
    nota_calculo integer,
    ponderacion_letra character(1),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.escala_calificaciones OWNER TO neondb_owner;

--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.escala_calificaciones_id_escala_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.escala_calificaciones_id_escala_seq OWNER TO neondb_owner;

--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.escala_calificaciones_id_escala_seq OWNED BY public.escala_calificaciones.id_escala;


--
-- Name: especialidades; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.especialidades (
    id_especialidad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    estatus character varying(15) DEFAULT 'Activa'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.especialidades OWNER TO neondb_owner;

--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.especialidades_id_especialidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.especialidades_id_especialidad_seq OWNER TO neondb_owner;

--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.especialidades_id_especialidad_seq OWNED BY public.especialidades.id_especialidad;


--
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.estudiantes (
    id_estudiante integer NOT NULL,
    lugar_nac character varying(100),
    municipio character varying(50),
    estado character varying(50),
    id_representante integer NOT NULL,
    estatus_estudiante character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    cedula_escolar character varying(15),
    nombre1 character varying(50),
    nombre2 character varying(50),
    apellido1 character varying(50),
    apellido2 character varying(50),
    fecha_nac date,
    genero character(1)
);


ALTER TABLE public.estudiantes OWNER TO neondb_owner;

--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.estudiantes_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNER TO neondb_owner;

--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNED BY public.estudiantes.id_estudiante;


--
-- Name: evaluaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.evaluaciones (
    id_evaluacion integer NOT NULL,
    id_plan integer NOT NULL,
    id_seccion integer NOT NULL,
    id_momento integer NOT NULL,
    descripcion character varying(100) NOT NULL,
    ponderacion integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.evaluaciones OWNER TO neondb_owner;

--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.evaluaciones_id_evaluacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNER TO neondb_owner;

--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNED BY public.evaluaciones.id_evaluacion;


--
-- Name: formatos_sabana; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.formatos_sabana (
    id_formato integer NOT NULL,
    nombre_formato character varying(100) NOT NULL,
    configuracion jsonb DEFAULT '{}'::jsonb NOT NULL,
    imagen_referencia text,
    es_activo boolean DEFAULT true NOT NULL,
    creado_por integer,
    fecha_creacion timestamp with time zone DEFAULT now(),
    fecha_modificacion timestamp with time zone DEFAULT now()
);


ALTER TABLE public.formatos_sabana OWNER TO neondb_owner;

--
-- Name: formatos_sabana_id_formato_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.formatos_sabana_id_formato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formatos_sabana_id_formato_seq OWNER TO neondb_owner;

--
-- Name: formatos_sabana_id_formato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.formatos_sabana_id_formato_seq OWNED BY public.formatos_sabana.id_formato;


--
-- Name: grados_anos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.grados_anos (
    id_grado integer NOT NULL,
    numero integer NOT NULL,
    nombre character varying(30) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.grados_anos OWNER TO neondb_owner;

--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.grados_anos_id_grado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grados_anos_id_grado_seq OWNER TO neondb_owner;

--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.grados_anos_id_grado_seq OWNED BY public.grados_anos.id_grado;


--
-- Name: historico_notas_certificadas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.historico_notas_certificadas (
    id_historico integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_grado integer NOT NULL,
    id_asignatura integer NOT NULL,
    id_periodo integer NOT NULL,
    id_escala integer NOT NULL,
    institucion_origen character varying(150) DEFAULT 'L.N. Estilita Orozco'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.historico_notas_certificadas OWNER TO neondb_owner;

--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.historico_notas_certificadas_id_historico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historico_notas_certificadas_id_historico_seq OWNER TO neondb_owner;

--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.historico_notas_certificadas_id_historico_seq OWNED BY public.historico_notas_certificadas.id_historico;


--
-- Name: horario_docente; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.horario_docente (
    id_horario integer NOT NULL,
    id_asignatura integer NOT NULL,
    id_seccion integer NOT NULL,
    id_dia integer NOT NULL,
    id_bloque integer NOT NULL,
    id_aula integer NOT NULL,
    id_periodo integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_docente integer NOT NULL
);


ALTER TABLE public.horario_docente OWNER TO neondb_owner;

--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.horario_docente_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horario_docente_id_horario_seq OWNER TO neondb_owner;

--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.horario_docente_id_horario_seq OWNED BY public.horario_docente.id_horario;


--
-- Name: justificaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.justificaciones (
    id_justificacion integer NOT NULL,
    id_asistencia integer NOT NULL,
    motivo text,
    soporte_digital character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.justificaciones OWNER TO neondb_owner;

--
-- Name: justificaciones_estudiante; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.justificaciones_estudiante (
    id_justificacion_est integer NOT NULL,
    id_asistencia_est integer NOT NULL,
    motivo text,
    soporte_digital character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.justificaciones_estudiante OWNER TO neondb_owner;

--
-- Name: justificaciones_estudiante_id_justificacion_est_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.justificaciones_estudiante_id_justificacion_est_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.justificaciones_estudiante_id_justificacion_est_seq OWNER TO neondb_owner;

--
-- Name: justificaciones_estudiante_id_justificacion_est_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.justificaciones_estudiante_id_justificacion_est_seq OWNED BY public.justificaciones_estudiante.id_justificacion_est;


--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.justificaciones_id_justificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.justificaciones_id_justificacion_seq OWNER TO neondb_owner;

--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.justificaciones_id_justificacion_seq OWNED BY public.justificaciones.id_justificacion;


--
-- Name: login_audit; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.login_audit (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    ip_address character varying(45) NOT NULL,
    user_agent text,
    success boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.login_audit OWNER TO neondb_owner;

--
-- Name: login_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.login_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_audit_id_seq OWNER TO neondb_owner;

--
-- Name: login_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.login_audit_id_seq OWNED BY public.login_audit.id;


--
-- Name: materia_pendiente; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.materia_pendiente (
    id_materia_pendiente integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_asignatura integer NOT NULL,
    id_periodo integer NOT NULL,
    nota_definitiva integer,
    estatus character varying(20) DEFAULT 'Cursando'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_docente_evaluador integer
);


ALTER TABLE public.materia_pendiente OWNER TO neondb_owner;

--
-- Name: COLUMN materia_pendiente.estatus; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.materia_pendiente.estatus IS 'Cursando, Aprobada, Aplazada';


--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.materia_pendiente_id_materia_pendiente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materia_pendiente_id_materia_pendiente_seq OWNER TO neondb_owner;

--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.materia_pendiente_id_materia_pendiente_seq OWNED BY public.materia_pendiente.id_materia_pendiente;


--
-- Name: matricula; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.matricula (
    id_matricula integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_seccion integer NOT NULL,
    id_periodo integer NOT NULL,
    numero_lista integer,
    estatus_matricula character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.matricula OWNER TO neondb_owner;

--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.matricula_id_matricula_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matricula_id_matricula_seq OWNER TO neondb_owner;

--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.matricula_id_matricula_seq OWNED BY public.matricula.id_matricula;


--
-- Name: momentos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.momentos (
    id_momento integer NOT NULL,
    id_periodo integer NOT NULL,
    descripcion character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    estatus character varying(20) DEFAULT 'Abierto'::character varying
);


ALTER TABLE public.momentos OWNER TO neondb_owner;

--
-- Name: momentos_id_momento_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.momentos_id_momento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.momentos_id_momento_seq OWNER TO neondb_owner;

--
-- Name: momentos_id_momento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.momentos_id_momento_seq OWNED BY public.momentos.id_momento;


--
-- Name: notas_parciales; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notas_parciales (
    id_nota integer NOT NULL,
    id_matricula integer NOT NULL,
    id_evaluacion integer NOT NULL,
    id_escala integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.notas_parciales OWNER TO neondb_owner;

--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notas_parciales_id_nota_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notas_parciales_id_nota_seq OWNER TO neondb_owner;

--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notas_parciales_id_nota_seq OWNED BY public.notas_parciales.id_nota;


--
-- Name: observaciones_estudiante; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.observaciones_estudiante (
    id_observacion integer NOT NULL,
    texto text NOT NULL,
    gravedad character varying(20),
    id_usuario_crea integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    CONSTRAINT observaciones_estudiante_gravedad_check CHECK (((gravedad)::text = ANY ((ARRAY['Bajo'::character varying, 'Moderado'::character varying, 'Alto'::character varying, 'Critico'::character varying])::text[])))
);


ALTER TABLE public.observaciones_estudiante OWNER TO neondb_owner;

--
-- Name: observaciones_estudiante_id_observacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.observaciones_estudiante_id_observacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observaciones_estudiante_id_observacion_seq OWNER TO neondb_owner;

--
-- Name: observaciones_estudiante_id_observacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.observaciones_estudiante_id_observacion_seq OWNED BY public.observaciones_estudiante.id_observacion;


--
-- Name: periodos_escolares; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.periodos_escolares (
    id_periodo integer NOT NULL,
    nombre character varying(9) NOT NULL,
    estatus character varying(20) NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.periodos_escolares OWNER TO neondb_owner;

--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.periodos_escolares_id_periodo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.periodos_escolares_id_periodo_seq OWNER TO neondb_owner;

--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.periodos_escolares_id_periodo_seq OWNED BY public.periodos_escolares.id_periodo;


--
-- Name: plan_estudio; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plan_estudio (
    id_plan integer NOT NULL,
    id_grado integer NOT NULL,
    id_asignatura integer NOT NULL,
    codigo_asignatura character varying(15),
    posicion integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_tipo_plan integer NOT NULL
);


ALTER TABLE public.plan_estudio OWNER TO neondb_owner;

--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plan_estudio_id_plan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plan_estudio_id_plan_seq OWNER TO neondb_owner;

--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plan_estudio_id_plan_seq OWNED BY public.plan_estudio.id_plan;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone
);


ALTER TABLE public.refresh_tokens OWNER TO neondb_owner;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: representantes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.representantes (
    id_representante integer NOT NULL,
    telefono character varying(20),
    direccion text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    cedula_rep character varying(15),
    nombre1 character varying(50),
    nombre2 character varying(50),
    apellido1 character varying(50),
    apellido2 character varying(50),
    correo character varying(100)
);


ALTER TABLE public.representantes OWNER TO neondb_owner;

--
-- Name: representantes_id_representante_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.representantes_id_representante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.representantes_id_representante_seq OWNER TO neondb_owner;

--
-- Name: representantes_id_representante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.representantes_id_representante_seq OWNED BY public.representantes.id_representante;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id_rol integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_rol_seq OWNER TO neondb_owner;

--
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.roles_id_rol_seq OWNED BY public.roles.id_rol;


--
-- Name: secciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.secciones (
    id_seccion integer NOT NULL,
    id_periodo integer NOT NULL,
    id_grado integer NOT NULL,
    letra character(1) NOT NULL,
    id_aula integer,
    capacidad_maxima integer DEFAULT 30,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_docente_guia integer
);


ALTER TABLE public.secciones OWNER TO neondb_owner;

--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.secciones_id_seccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.secciones_id_seccion_seq OWNER TO neondb_owner;

--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.secciones_id_seccion_seq OWNED BY public.secciones.id_seccion;


--
-- Name: tipo_plan_estudio; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tipo_plan_estudio (
    id_tipo_plan integer NOT NULL,
    nombre character varying(100) NOT NULL,
    resolucion character varying(100),
    estatus character varying(20) DEFAULT 'Activo'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tipo_plan_estudio OWNER TO neondb_owner;

--
-- Name: tipo_plan_estudio_id_tipo_plan_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tipo_plan_estudio_id_tipo_plan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_plan_estudio_id_tipo_plan_seq OWNER TO neondb_owner;

--
-- Name: tipo_plan_estudio_id_tipo_plan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tipo_plan_estudio_id_tipo_plan_seq OWNED BY public.tipo_plan_estudio.id_tipo_plan;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    estatus character varying(15) DEFAULT 'Activo'::character varying,
    failed_attempts integer DEFAULT 0 NOT NULL,
    locked_until timestamp with time zone,
    token_version integer DEFAULT 0 NOT NULL,
    ultimo_acceso timestamp with time zone,
    cedula character varying(15),
    nombre1 character varying(50),
    nombre2 character varying(50),
    apellido1 character varying(50),
    apellido2 character varying(50),
    fecha_nac date,
    telefono character varying(20),
    id_especialidad integer,
    token_qr character varying(255),
    estatus_docente character varying(15),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    correo character varying(100)
);


ALTER TABLE public.usuarios OWNER TO neondb_owner;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO neondb_owner;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: v_count; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.v_count (
    count bigint
);


ALTER TABLE public.v_count OWNER TO neondb_owner;

--
-- Name: asignaturas id_asignatura; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas ALTER COLUMN id_asignatura SET DEFAULT nextval('public.asignaturas_id_asignatura_seq'::regclass);


--
-- Name: asistencia_docente id_asistencia; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente ALTER COLUMN id_asistencia SET DEFAULT nextval('public.asistencia_docente_id_asistencia_seq'::regclass);


--
-- Name: asistencia_estudiante id_asistencia_est; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante ALTER COLUMN id_asistencia_est SET DEFAULT nextval('public.asistencia_estudiante_id_asistencia_est_seq'::regclass);


--
-- Name: auditoria id_auditoria; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.auditoria ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditoria_id_auditoria_seq'::regclass);


--
-- Name: aulas id_aula; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aulas ALTER COLUMN id_aula SET DEFAULT nextval('public.aulas_id_aula_seq'::regclass);


--
-- Name: bloques_horarios id_bloque; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bloques_horarios ALTER COLUMN id_bloque SET DEFAULT nextval('public.bloques_horarios_id_bloque_seq'::regclass);


--
-- Name: calificaciones id_calificacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones ALTER COLUMN id_calificacion SET DEFAULT nextval('public.calificaciones_id_calificacion_seq'::regclass);


--
-- Name: dias_semana id_dia; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dias_semana ALTER COLUMN id_dia SET DEFAULT nextval('public.dias_semana_id_dia_seq'::regclass);


--
-- Name: escala_calificaciones id_escala; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.escala_calificaciones ALTER COLUMN id_escala SET DEFAULT nextval('public.escala_calificaciones_id_escala_seq'::regclass);


--
-- Name: especialidades id_especialidad; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidades ALTER COLUMN id_especialidad SET DEFAULT nextval('public.especialidades_id_especialidad_seq'::regclass);


--
-- Name: estudiantes id_estudiante; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes ALTER COLUMN id_estudiante SET DEFAULT nextval('public.estudiantes_id_estudiante_seq'::regclass);


--
-- Name: evaluaciones id_evaluacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones ALTER COLUMN id_evaluacion SET DEFAULT nextval('public.evaluaciones_id_evaluacion_seq'::regclass);


--
-- Name: formatos_sabana id_formato; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.formatos_sabana ALTER COLUMN id_formato SET DEFAULT nextval('public.formatos_sabana_id_formato_seq'::regclass);


--
-- Name: grados_anos id_grado; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grados_anos ALTER COLUMN id_grado SET DEFAULT nextval('public.grados_anos_id_grado_seq'::regclass);


--
-- Name: historico_notas_certificadas id_historico; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas ALTER COLUMN id_historico SET DEFAULT nextval('public.historico_notas_certificadas_id_historico_seq'::regclass);


--
-- Name: horario_docente id_horario; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente ALTER COLUMN id_horario SET DEFAULT nextval('public.horario_docente_id_horario_seq'::regclass);


--
-- Name: justificaciones id_justificacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones ALTER COLUMN id_justificacion SET DEFAULT nextval('public.justificaciones_id_justificacion_seq'::regclass);


--
-- Name: justificaciones_estudiante id_justificacion_est; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones_estudiante ALTER COLUMN id_justificacion_est SET DEFAULT nextval('public.justificaciones_estudiante_id_justificacion_est_seq'::regclass);


--
-- Name: login_audit id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.login_audit ALTER COLUMN id SET DEFAULT nextval('public.login_audit_id_seq'::regclass);


--
-- Name: materia_pendiente id_materia_pendiente; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente ALTER COLUMN id_materia_pendiente SET DEFAULT nextval('public.materia_pendiente_id_materia_pendiente_seq'::regclass);


--
-- Name: matricula id_matricula; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matricula ALTER COLUMN id_matricula SET DEFAULT nextval('public.matricula_id_matricula_seq'::regclass);


--
-- Name: momentos id_momento; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.momentos ALTER COLUMN id_momento SET DEFAULT nextval('public.momentos_id_momento_seq'::regclass);


--
-- Name: notas_parciales id_nota; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notas_parciales ALTER COLUMN id_nota SET DEFAULT nextval('public.notas_parciales_id_nota_seq'::regclass);


--
-- Name: observaciones_estudiante id_observacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.observaciones_estudiante ALTER COLUMN id_observacion SET DEFAULT nextval('public.observaciones_estudiante_id_observacion_seq'::regclass);


--
-- Name: periodos_escolares id_periodo; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.periodos_escolares ALTER COLUMN id_periodo SET DEFAULT nextval('public.periodos_escolares_id_periodo_seq'::regclass);


--
-- Name: plan_estudio id_plan; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plan_estudio ALTER COLUMN id_plan SET DEFAULT nextval('public.plan_estudio_id_plan_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: representantes id_representante; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes ALTER COLUMN id_representante SET DEFAULT nextval('public.representantes_id_representante_seq'::regclass);


--
-- Name: roles id_rol; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_rol SET DEFAULT nextval('public.roles_id_rol_seq'::regclass);


--
-- Name: secciones id_seccion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones ALTER COLUMN id_seccion SET DEFAULT nextval('public.secciones_id_seccion_seq'::regclass);


--
-- Name: tipo_plan_estudio id_tipo_plan; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tipo_plan_estudio ALTER COLUMN id_tipo_plan SET DEFAULT nextval('public.tipo_plan_estudio_id_tipo_plan_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: asignaturas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asignaturas (id_asignatura, nombre, tipo_calificacion, created_at, updated_at) FROM stdin;
1	Castellano	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
2	Inglés	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
3	Matemática	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
4	Educación Física	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
5	Arte y Patrimonio	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
6	Ciencias Naturales	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
7	Geografía, Historia y Ciudadanía	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
8	Orientación y Convivencia	Cualitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
9	Biología	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
10	Psicología	Cuantitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
11	Formación para la Soberanía	Cualitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
12	Grupo de Participación	Cualitativo	2026-07-18 05:30:46.574918+00	2026-07-18 05:30:46.574918+00
13	Grupos de Creación, Recreación y Producción	Cualitativo	2026-07-18 22:12:32.841+00	2026-07-18 22:12:32.841+00
14	Física	Cuantitativo	2026-07-18 22:12:33.703+00	2026-07-18 22:12:33.703+00
15	Química	Cuantitativo	2026-07-18 22:12:33.945+00	2026-07-18 22:12:33.945+00
16	Formación para la Soberanía Nacional	Cuantitativo	2026-07-18 22:12:34.164+00	2026-07-18 22:12:34.164+00
17	Ciencias de la Tierra	Cuantitativo	2026-07-18 22:12:34.368+00	2026-07-18 22:12:34.368+00
18	Castellano y Literatura	Cuantitativo	2026-07-18 22:21:29.581+00	2026-07-18 22:21:29.581+00
19	Educación Física y Deportes	Cuantitativo	2026-07-18 22:21:30.161+00	2026-07-18 22:21:30.161+00
20	Educación Artística	Cuantitativo	2026-07-18 22:21:30.403+00	2026-07-18 22:21:30.403+00
21	Estudios de la Naturaleza	Cuantitativo	2026-07-18 22:21:30.624+00	2026-07-18 22:21:30.624+00
22	Historia de Venezuela	Cuantitativo	2026-07-18 22:21:30.845+00	2026-07-18 22:21:30.845+00
23	Geografía General	Cuantitativo	2026-07-18 22:21:31.062+00	2026-07-18 22:21:31.062+00
24	Formación Familiar y Ciudadana	Cuantitativo	2026-07-18 22:21:31.283+00	2026-07-18 22:21:31.283+00
25	Educación para la Salud	Cuantitativo	2026-07-18 22:21:31.498+00	2026-07-18 22:21:31.498+00
26	Geografía de Venezuela	Cuantitativo	2026-07-18 22:21:31.714+00	2026-07-18 22:21:31.714+00
27	Ciencias Biológicas	Cuantitativo	2026-07-18 22:21:31.933+00	2026-07-18 22:21:31.933+00
28	Cátedra Bolivariana	Cuantitativo	2026-07-18 22:21:32.377+00	2026-07-18 22:21:32.377+00
29	Historia Contemporánea de Venezuela	Cuantitativo	2026-07-18 22:21:32.608+00	2026-07-18 22:21:32.608+00
30	Instrucción Premilitar	Cuantitativo	2026-07-18 22:21:32.823+00	2026-07-18 22:21:32.823+00
31	Geografía Económica de Venezuela	Cuantitativo	2026-07-18 22:21:33.161+00	2026-07-18 22:21:33.161+00
\.


--
-- Data for Name: asistencia_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_docente (id_asistencia, fecha, hora_entrada, hora_salida, estatus, id_horario, id_asignatura, id_usuario_crea, id_usuario_modifica, fecha_anulacion, created_at, updated_at, id_docente) FROM stdin;
2	2026-07-20	11:40:00	13:27:00	Retardo	\N	\N	5	5	\N	2026-07-20 15:40:37.297+00	2026-07-20 17:27:33.753+00	5
1	2026-07-20	11:40:00	13:27:00	Retardo	\N	\N	5	5	\N	2026-07-20 15:40:31.516+00	2026-07-20 17:27:37.001+00	4
3	2026-07-20	13:27:00	15:03:00	Retardo	\N	\N	5	5	\N	2026-07-20 17:27:55.19+00	2026-07-20 19:03:09.797+00	8
\.


--
-- Data for Name: asistencia_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_estudiante (id_asistencia_est, id_matricula, fecha, id_horario, estatus, id_usuario_crea, id_usuario_modifica, created_at, updated_at, id_docente_toma, id_observacion) FROM stdin;
54	2	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:34.565+00	2026-07-21 13:36:34.565+00	\N	\N
55	12	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:35.256+00	2026-07-21 13:36:35.256+00	\N	\N
86	18	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:09.177+00	2026-07-21 14:48:09.177+00	\N	\N
4	1	2026-07-18	204	Ausente	17	17	2026-07-18 06:29:30.575+00	2026-07-18 07:06:24.247+00	\N	\N
6	11	2026-07-18	206	Presente	17	\N	2026-07-18 07:06:41.351+00	2026-07-18 07:06:41.351+00	\N	\N
7	1	2026-07-18	206	Presente	17	\N	2026-07-18 07:06:43.183+00	2026-07-18 07:06:43.183+00	\N	\N
8	11	2026-07-18	205	Ausente	17	\N	2026-07-18 07:07:17.884+00	2026-07-18 07:07:17.884+00	\N	\N
10	1	2026-07-13	204	Ausente	17	\N	2026-07-18 08:01:00.84+00	2026-07-18 08:01:00.84+00	\N	\N
11	1	2026-07-13	205	Presente	17	\N	2026-07-18 08:01:05.972+00	2026-07-18 08:01:05.972+00	\N	\N
12	11	2026-07-13	205	Justificado	17	\N	2026-07-18 08:15:10.139+00	2026-07-18 08:15:25.937+00	\N	\N
13	11	2026-07-13	206	Justificado	17	\N	2026-07-18 08:16:10.069+00	2026-07-18 08:16:19.75+00	\N	\N
14	1	2026-07-13	206	Ausente	17	17	2026-07-18 08:16:12.129+00	2026-07-18 08:47:22.058+00	\N	\N
15	11	2026-07-14	207	Justificado	17	\N	2026-07-18 08:47:43.234+00	2026-07-18 08:47:43.234+00	\N	\N
17	11	2026-07-07	207	Justificado	17	\N	2026-07-18 08:49:22.48+00	2026-07-18 08:49:22.48+00	\N	\N
18	1	2026-07-07	207	Presente	17	\N	2026-07-18 08:49:36.976+00	2026-07-18 08:49:36.976+00	\N	\N
19	1	2026-07-18	205	Justificado	17	\N	2026-07-18 09:00:50.798+00	2026-07-18 09:00:50.798+00	\N	\N
20	1	2026-07-06	204	Justificado	17	\N	2026-07-18 09:01:44.344+00	2026-07-18 09:01:44.344+00	\N	\N
21	11	2026-07-06	204	Justificado	17	\N	2026-07-18 09:08:36.827+00	2026-07-18 09:08:36.827+00	\N	\N
22	11	2026-06-29	204	Justificado	17	\N	2026-07-18 09:09:28.532+00	2026-07-18 09:09:28.532+00	\N	\N
23	11	2026-06-30	207	Justificado	17	\N	2026-07-18 09:23:57.021+00	2026-07-18 09:23:57.021+00	\N	\N
3	11	2026-07-18	204	Presente	17	17	2026-07-18 06:29:25.466+00	2026-07-18 09:32:32.309+00	\N	1
9	11	2026-07-13	204	Presente	17	17	2026-07-18 08:00:58.81+00	2026-07-18 09:44:35.176+00	\N	2
56	48	2026-07-21	209	Presente	5	5	2026-07-21 13:36:36.023+00	2026-07-21 13:36:38.292+00	\N	\N
16	1	2026-07-14	207	Justificado	17	17	2026-07-18 08:47:47.704+00	2026-07-18 10:09:59.836+00	\N	3
57	43	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:41.84+00	2026-07-21 13:36:41.84+00	\N	\N
58	63	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:42.363+00	2026-07-21 13:36:42.363+00	\N	\N
59	54	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:43.198+00	2026-07-21 13:36:43.198+00	\N	\N
28	20	2026-07-20	205	Presente	5	\N	2026-07-20 16:19:28.315+00	2026-07-20 16:19:28.315+00	\N	\N
29	21	2026-07-20	205	Ausente	5	\N	2026-07-20 16:19:28.901+00	2026-07-20 16:19:28.901+00	\N	\N
34	39	2026-07-20	205	Justificado	5	\N	2026-07-20 16:19:52.355+00	2026-07-20 16:19:52.355+00	\N	\N
60	45	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:43.677+00	2026-07-21 13:36:43.677+00	\N	\N
61	46	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:44.181+00	2026-07-21 13:36:44.181+00	\N	\N
62	49	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:46.15+00	2026-07-21 13:36:46.15+00	\N	\N
63	47	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:46.724+00	2026-07-21 13:36:46.724+00	\N	\N
64	59	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:47.917+00	2026-07-21 13:36:47.917+00	\N	\N
25	1	2026-07-20	205	Presente	5	14	2026-07-20 15:59:24.902+00	2026-07-20 16:21:12.348+00	\N	\N
26	34	2026-07-20	205	Presente	5	14	2026-07-20 15:59:46.409+00	2026-07-20 16:21:13.287+00	\N	\N
30	17	2026-07-20	205	Presente	5	14	2026-07-20 16:19:31.95+00	2026-07-20 16:21:14.303+00	\N	\N
31	18	2026-07-20	205	Presente	5	14	2026-07-20 16:19:32.293+00	2026-07-20 16:21:14.847+00	\N	\N
32	37	2026-07-20	205	Presente	5	14	2026-07-20 16:19:33.501+00	2026-07-20 16:21:15.397+00	\N	\N
52	29	2026-07-20	205	Ausente	5	13	2026-07-20 21:37:12.62+00	2026-07-21 18:30:15.099+00	\N	\N
35	23	2026-07-20	205	Presente	17	\N	2026-07-20 16:38:01.706+00	2026-07-20 16:38:01.706+00	\N	\N
36	35	2026-07-20	205	Presente	17	\N	2026-07-20 16:38:02.002+00	2026-07-20 16:38:02.002+00	\N	\N
38	30	2026-07-20	205	Ausente	17	\N	2026-07-20 16:38:03.169+00	2026-07-20 16:38:03.169+00	\N	\N
37	36	2026-07-20	205	Presente	17	17	2026-07-20 16:38:02.49+00	2026-07-20 16:38:04.699+00	\N	\N
39	16	2026-07-20	205	Presente	17	\N	2026-07-20 16:38:04.911+00	2026-07-20 16:38:04.911+00	\N	\N
40	26	2026-07-20	205	Presente	17	\N	2026-07-20 16:38:05.167+00	2026-07-20 16:38:05.167+00	\N	\N
41	32	2026-07-20	205	Ausente	17	\N	2026-07-20 16:38:06.44+00	2026-07-20 16:38:06.44+00	\N	\N
42	33	2026-07-20	205	Ausente	17	\N	2026-07-20 16:38:07.812+00	2026-07-20 16:38:07.812+00	\N	\N
43	11	2026-07-20	204	Presente	14	\N	2026-07-20 17:06:25.666+00	2026-07-20 17:06:25.666+00	\N	\N
44	1	2026-07-20	204	Ausente	14	\N	2026-07-20 17:06:25.952+00	2026-07-20 17:06:25.952+00	\N	\N
45	34	2026-07-20	204	Presente	14	\N	2026-07-20 17:06:27.022+00	2026-07-20 17:06:27.022+00	\N	\N
47	19	2026-07-20	205	Presente	5	\N	2026-07-20 21:37:06.88+00	2026-07-20 21:37:06.88+00	\N	\N
48	25	2026-07-20	205	Presente	5	\N	2026-07-20 21:37:07.387+00	2026-07-20 21:37:07.387+00	\N	\N
49	28	2026-07-20	205	Presente	5	\N	2026-07-20 21:37:07.824+00	2026-07-20 21:37:07.824+00	\N	\N
50	24	2026-07-20	205	Presente	5	\N	2026-07-20 21:37:09.919+00	2026-07-20 21:37:09.919+00	\N	\N
51	27	2026-07-20	205	Ausente	5	\N	2026-07-20 21:37:10.203+00	2026-07-20 21:37:10.203+00	\N	\N
65	50	2026-07-21	209	Ausente	5	5	2026-07-21 13:36:48.601+00	2026-07-21 13:36:49.82+00	\N	\N
66	41	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:51.439+00	2026-07-21 13:36:51.439+00	\N	\N
46	22	2026-07-20	205	Presente	5	13	2026-07-20 21:37:06.163+00	2026-07-21 18:30:33.063+00	\N	\N
53	38	2026-07-20	205	Justificado	5	\N	2026-07-20 21:37:28.233+00	2026-07-20 21:37:28.233+00	\N	\N
27	31	2026-07-20	205	Ausente	5	5	2026-07-20 16:19:27.316+00	2026-07-20 21:55:22.748+00	\N	4
67	58	2026-07-21	209	Ausente	5	\N	2026-07-21 13:36:52.249+00	2026-07-21 13:36:52.249+00	\N	\N
68	51	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:53.74+00	2026-07-21 13:36:53.74+00	\N	\N
69	62	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:54.086+00	2026-07-21 13:36:54.086+00	\N	\N
70	44	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:54.842+00	2026-07-21 13:36:54.842+00	\N	\N
71	56	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:55.356+00	2026-07-21 13:36:55.356+00	\N	\N
72	53	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:56.837+00	2026-07-21 13:36:56.837+00	\N	\N
73	55	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:57.082+00	2026-07-21 13:36:57.082+00	\N	\N
74	61	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:57.436+00	2026-07-21 13:36:57.436+00	\N	\N
75	60	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:58.185+00	2026-07-21 13:36:58.185+00	\N	\N
76	57	2026-07-21	209	Presente	5	\N	2026-07-21 13:36:58.719+00	2026-07-21 13:36:58.719+00	\N	\N
77	42	2026-07-21	209	Justificado	5	\N	2026-07-21 13:37:10.89+00	2026-07-21 13:37:10.89+00	\N	\N
78	52	2026-07-21	209	Justificado	5	\N	2026-07-21 13:37:32.466+00	2026-07-21 13:37:32.466+00	\N	\N
79	11	2026-07-21	208	Presente	13	\N	2026-07-21 14:47:58.261+00	2026-07-21 14:47:58.261+00	\N	\N
80	1	2026-07-21	208	Presente	13	\N	2026-07-21 14:47:59.855+00	2026-07-21 14:47:59.855+00	\N	\N
81	34	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:01.338+00	2026-07-21 14:48:01.338+00	\N	\N
82	31	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:02.712+00	2026-07-21 14:48:02.712+00	\N	\N
83	20	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:04.342+00	2026-07-21 14:48:04.342+00	\N	\N
84	21	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:05.619+00	2026-07-21 14:48:05.619+00	\N	\N
85	17	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:07.433+00	2026-07-21 14:48:07.433+00	\N	\N
87	37	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:10.633+00	2026-07-21 14:48:10.633+00	\N	\N
88	40	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:12.256+00	2026-07-21 14:48:12.256+00	\N	\N
89	39	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:13.907+00	2026-07-21 14:48:13.907+00	\N	\N
90	33	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:15.477+00	2026-07-21 14:48:15.477+00	\N	\N
91	23	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:17.052+00	2026-07-21 14:48:17.052+00	\N	\N
92	36	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:18.531+00	2026-07-21 14:48:18.531+00	\N	\N
93	35	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:19.932+00	2026-07-21 14:48:19.932+00	\N	\N
94	30	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:21.586+00	2026-07-21 14:48:21.586+00	\N	\N
95	16	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:23.032+00	2026-07-21 14:48:23.032+00	\N	\N
96	26	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:26.039+00	2026-07-21 14:48:26.039+00	\N	\N
97	32	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:30.444+00	2026-07-21 14:48:30.444+00	\N	\N
24	11	2026-07-20	205	Ausente	5	14	2026-07-20 15:59:21.002+00	2026-07-21 19:46:36.526+00	\N	\N
98	22	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:34.047+00	2026-07-21 14:48:34.047+00	\N	\N
99	19	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:36.55+00	2026-07-21 14:48:36.55+00	\N	\N
100	25	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:37.989+00	2026-07-21 14:48:37.989+00	\N	\N
101	28	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:39.724+00	2026-07-21 14:48:39.724+00	\N	\N
102	27	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:41.374+00	2026-07-21 14:48:41.374+00	\N	\N
103	24	2026-07-21	208	Ausente	13	\N	2026-07-21 14:48:42.691+00	2026-07-21 14:48:42.691+00	\N	\N
104	29	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:45.273+00	2026-07-21 14:48:45.273+00	\N	\N
105	38	2026-07-21	208	Presente	13	\N	2026-07-21 14:48:48.831+00	2026-07-21 14:48:48.831+00	\N	\N
33	40	2026-07-20	205	Ausente	5	13	2026-07-20 16:19:34.042+00	2026-07-21 18:25:51.583+00	\N	\N
106	31	2026-07-20	204	Presente	13	\N	2026-07-21 18:31:15.148+00	2026-07-21 18:31:15.148+00	\N	\N
107	20	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:13.425+00	2026-07-21 19:14:13.425+00	\N	\N
108	21	2026-07-20	204	Ausente	13	\N	2026-07-21 19:14:13.714+00	2026-07-21 19:14:13.714+00	\N	\N
109	17	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:13.904+00	2026-07-21 19:14:13.904+00	\N	\N
110	18	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:14.095+00	2026-07-21 19:14:14.095+00	\N	\N
111	37	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:14.285+00	2026-07-21 19:14:14.285+00	\N	\N
112	40	2026-07-20	204	Ausente	13	\N	2026-07-21 19:14:14.478+00	2026-07-21 19:14:14.478+00	\N	\N
113	39	2026-07-20	204	Ausente	13	\N	2026-07-21 19:14:14.667+00	2026-07-21 19:14:14.667+00	\N	\N
114	33	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:14.857+00	2026-07-21 19:14:14.857+00	\N	\N
115	23	2026-07-20	204	Justificado	13	\N	2026-07-21 19:14:15.135+00	2026-07-21 19:14:15.135+00	\N	\N
116	36	2026-07-20	204	Presente	13	\N	2026-07-21 19:14:46.552+00	2026-07-21 19:14:46.552+00	\N	\N
117	35	2026-07-20	204	Ausente	13	\N	2026-07-21 19:14:46.775+00	2026-07-21 19:14:46.775+00	\N	\N
118	30	2026-07-20	204	Presente	13	\N	2026-07-21 19:19:56.958+00	2026-07-21 19:19:56.958+00	\N	\N
119	16	2026-07-20	204	Presente	13	\N	2026-07-21 19:19:57.204+00	2026-07-21 19:19:57.204+00	\N	\N
120	26	2026-07-20	204	Ausente	13	\N	2026-07-21 19:19:57.446+00	2026-07-21 19:19:57.446+00	\N	\N
121	32	2026-07-20	204	Ausente	13	\N	2026-07-21 19:19:57.686+00	2026-07-21 19:19:57.686+00	\N	\N
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.auditoria (id_auditoria, id_usuario, accion, tabla_afectada, registro_id, valores_antiguos, valores_nuevos, ip_direccion, fecha_hora) FROM stdin;
1	17	Configuración	evaluaciones	\N	\N	{"id_plan": 1, "id_momento": 1, "id_seccion": 1, "evaluaciones": [{"descripcion": "Examen diagnostico", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Examen 1", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "Examen 2", "ponderacion": 25, "id_evaluacion": null}]}	::1	2026-07-18 17:54:36.431+00
2	17	Configuración	evaluaciones	\N	\N	{"id_plan": 1, "id_momento": 1, "id_seccion": 1, "evaluaciones": [{"descripcion": "Examen diagnostico", "ponderacion": 25, "id_evaluacion": 1}, {"descripcion": "Examen 1", "ponderacion": 50, "id_evaluacion": 2}, {"descripcion": "Examen 2", "ponderacion": 25, "id_evaluacion": 3}]}	::1	2026-07-18 18:15:08.979+00
3	17	Configuración	evaluaciones	\N	\N	{"id_plan": 1, "id_momento": 2, "id_seccion": 1, "evaluaciones": [{"descripcion": "Evaluación maestra", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "Taller didactico", "ponderacion": 50, "id_evaluacion": null}]}	::1	2026-07-18 18:15:43.342+00
4	17	Configuración	evaluaciones	\N	\N	{"id_plan": 1, "id_momento": 3, "id_seccion": 1, "evaluaciones": [{"descripcion": "Exposicion", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "Taller", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Mapa mental", "ponderacion": 25, "id_evaluacion": null}]}	::1	2026-07-18 18:16:22.875+00
5	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 6, "id_evaluacion": 1}, {"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 1}]}	::1	2026-07-18 18:18:23.06+00
6	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 1, "lapso": 1, "section": "A", "detalles": [{"score": 20, "percentage": 25, "studentName": "Fernández Torres, Ana Sofía", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 10, "percentage": 25, "studentName": "López Fernández, Pedro José", "evaluationId": "1", "evaluationName": "Examen diagnostico"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "1", "name": "Examen diagnostico", "percentage": 25}, {"id": "2", "name": "Examen 1", "percentage": 50}, {"id": "3", "name": "Examen 2", "percentage": 25}]}	\N	2026-07-18 18:18:23.213+00
7	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 6, "id_evaluacion": 1}, {"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 20, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 23, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 31, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 38, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 41, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 48, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 55, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 60, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 65, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 67, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 75, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 80, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 82, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 86, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 93, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 98, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 102, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 107, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 111, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 118, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 121, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 125, "id_evaluacion": 1}, {"id_escala": 11, "id_estudiante": 131, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 134, "id_evaluacion": 1}]}	::1	2026-07-19 02:40:39.684+00
8	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 1, "lapso": 1, "section": "A", "detalles": [{"score": 20, "percentage": 25, "studentName": "Fernández Torres, Ana Sofía", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 10, "percentage": 25, "studentName": "López Fernández, Pedro José", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "RAMIREZ MORA, MOISES NOEL", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "PEREZ CORDOVA, SOFIA NAYARITH", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "CUELLAR CASIQUE, YARELIS NOHEMY", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "DELGADO DORIA, AUDRIS ANTHONELA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "CHACON CORREA, KLEINY DEIYULIE", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "CHACON CORREA, KLEIVER YUNEIKER", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "ROZO LEON, JOSUE ANDRES", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "VARGAS SALAMANCA, WILKAR YUTSEL", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "SANCHEZ CANCHICA, NIKOL CAMILA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "RAMIREZ BECERRA, SALOME ANTONELLA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "GAMEZ CHACON, MARIA DE LOS ANGELES", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "ROJAS PE�A, ERIKA VALERIA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "RODRIGUEZ CARDENAS, DAIKARY GABRIELA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "MONSALBE MARQUEZ, YULIHANNY JOSELIN", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "CASANOVA ESPINEL, DAYMAR YULIETH", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "GUERRERO TORRES, ABEL ISACAR", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "PINEDA PEREZ, BRIANNA TAIHRY", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "FLORES ZAMBRANO, EMILY ASYELIN", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "CORTEZ JIMENEZ, SEBASTIAN ALEJANDRO", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "GONZALEZ SANGUINO, KEYNER ALEJANDRO", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "MENDEZ LEAL, ADANYELITH YUSED", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "MARQUEZ VIVAS, KEINER SANTIAGO", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "GOMEZ LOPEZ, MEGHAN KENAY", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 11, "percentage": 25, "studentName": "MENDOZA DELGADO, DEIVIANY ALEXANDRA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}, {"score": 1, "percentage": 25, "studentName": "RUIZ RAMIREZ, KEMBERLY ALEXANDRA", "evaluationId": "1", "evaluationName": "Examen diagnostico"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "1", "name": "Examen diagnostico", "percentage": 25}, {"id": "2", "name": "Examen 1", "percentage": 50}, {"id": "3", "name": "Examen 2", "percentage": 25}]}	\N	2026-07-19 02:40:40.36+00
9	5	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 6, "id_evaluacion": 1}, {"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 20, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 23, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 31, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 38, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 41, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 48, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 55, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 60, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 65, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 67, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 75, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 80, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 82, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 86, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 93, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 98, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 102, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 107, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 111, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 118, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 121, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 125, "id_evaluacion": 1}, {"id_escala": 11, "id_estudiante": 131, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 134, "id_evaluacion": 1}, {"id_escala": 15, "id_estudiante": 6, "id_evaluacion": 2}, {"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 2}, {"id_escala": 13, "id_estudiante": 20, "id_evaluacion": 2}, {"id_escala": 10, "id_estudiante": 23, "id_evaluacion": 2}, {"id_escala": 15, "id_estudiante": 28, "id_evaluacion": 2}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 2}, {"id_escala": 8, "id_estudiante": 38, "id_evaluacion": 2}, {"id_escala": 5, "id_estudiante": 41, "id_evaluacion": 2}, {"id_escala": 4, "id_estudiante": 48, "id_evaluacion": 2}, {"id_escala": 15, "id_estudiante": 55, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 6, "id_evaluacion": 3}, {"id_escala": 14, "id_estudiante": 15, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 20, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 23, "id_evaluacion": 3}, {"id_escala": 18, "id_estudiante": 28, "id_evaluacion": 3}, {"id_escala": 16, "id_estudiante": 31, "id_evaluacion": 3}, {"id_escala": 19, "id_estudiante": 38, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 41, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 48, "id_evaluacion": 3}, {"id_escala": 14, "id_estudiante": 55, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 60, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 65, "id_evaluacion": 2}, {"id_escala": 14, "id_estudiante": 67, "id_evaluacion": 2}, {"id_escala": 16, "id_estudiante": 75, "id_evaluacion": 2}, {"id_escala": 18, "id_estudiante": 80, "id_evaluacion": 2}, {"id_escala": 14, "id_estudiante": 82, "id_evaluacion": 2}, {"id_escala": 16, "id_estudiante": 86, "id_evaluacion": 2}, {"id_escala": 15, "id_estudiante": 93, "id_evaluacion": 2}, {"id_escala": 18, "id_estudiante": 98, "id_evaluacion": 2}, {"id_escala": 17, "id_estudiante": 102, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 60, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 65, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 67, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 75, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 80, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 82, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 86, "id_evaluacion": 3}, {"id_escala": 14, "id_estudiante": 93, "id_evaluacion": 3}, {"id_escala": 16, "id_estudiante": 98, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 102, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 107, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 111, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 118, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 121, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 125, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 131, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 134, "id_evaluacion": 2}, {"id_escala": 14, "id_estudiante": 107, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 111, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 118, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 121, "id_evaluacion": 3}, {"id_escala": 14, "id_estudiante": 125, "id_evaluacion": 3}, {"id_escala": 13, "id_estudiante": 131, "id_evaluacion": 3}, {"id_escala": 10, "id_estudiante": 134, "id_evaluacion": 3}]}	::1	2026-07-19 15:13:12.634+00
10	15	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 2}, {"id_escala": 10, "id_estudiante": 15, "id_evaluacion": 1}, {"id_escala": 14, "id_estudiante": 15, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 6, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 6, "id_evaluacion": 1}, {"id_escala": 16, "id_estudiante": 6, "id_evaluacion": 3}, {"id_escala": 16, "id_estudiante": 86, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 86, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 86, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 38, "id_evaluacion": 1}, {"id_escala": 19, "id_estudiante": 38, "id_evaluacion": 3}, {"id_escala": 8, "id_estudiante": 38, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 41, "id_evaluacion": 3}, {"id_escala": 5, "id_estudiante": 41, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 41, "id_evaluacion": 1}, {"id_escala": 14, "id_estudiante": 107, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 107, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 107, "id_evaluacion": 1}, {"id_escala": 15, "id_estudiante": 28, "id_evaluacion": 2}, {"id_escala": 18, "id_estudiante": 28, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 31, "id_evaluacion": 1}, {"id_escala": 16, "id_estudiante": 31, "id_evaluacion": 3}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 102, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 102, "id_evaluacion": 3}, {"id_escala": 17, "id_estudiante": 102, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 67, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 67, "id_evaluacion": 3}, {"id_escala": 14, "id_estudiante": 67, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 125, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 125, "id_evaluacion": 2}, {"id_escala": 14, "id_estudiante": 125, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 111, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 111, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 111, "id_evaluacion": 2}, {"id_escala": 15, "id_estudiante": 93, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 93, "id_evaluacion": 1}, {"id_escala": 14, "id_estudiante": 93, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 121, "id_evaluacion": 1}, {"id_escala": 15, "id_estudiante": 121, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 121, "id_evaluacion": 2}, {"id_escala": 15, "id_estudiante": 118, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 118, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 118, "id_evaluacion": 2}, {"id_escala": 11, "id_estudiante": 131, "id_evaluacion": 1}, {"id_escala": 13, "id_estudiante": 131, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 131, "id_evaluacion": 2}, {"id_escala": 14, "id_estudiante": 82, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 82, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 82, "id_evaluacion": 1}, {"id_escala": 10, "id_estudiante": 23, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 23, "id_evaluacion": 1}, {"id_escala": 15, "id_estudiante": 23, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 98, "id_evaluacion": 1}, {"id_escala": 18, "id_estudiante": 98, "id_evaluacion": 2}, {"id_escala": 16, "id_estudiante": 98, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 65, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 65, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 65, "id_evaluacion": 2}, {"id_escala": 13, "id_estudiante": 20, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 20, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 20, "id_evaluacion": 1}, {"id_escala": 1, "id_estudiante": 80, "id_evaluacion": 1}, {"id_escala": 18, "id_estudiante": 80, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 80, "id_evaluacion": 3}, {"id_escala": 20, "id_estudiante": 75, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 75, "id_evaluacion": 1}, {"id_escala": 16, "id_estudiante": 75, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 48, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 48, "id_evaluacion": 1}, {"id_escala": 4, "id_estudiante": 48, "id_evaluacion": 2}, {"id_escala": 10, "id_estudiante": 134, "id_evaluacion": 3}, {"id_escala": 1, "id_estudiante": 134, "id_evaluacion": 1}, {"id_escala": 20, "id_estudiante": 134, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 60, "id_evaluacion": 1}, {"id_escala": 15, "id_estudiante": 60, "id_evaluacion": 2}, {"id_escala": 20, "id_estudiante": 60, "id_evaluacion": 3}, {"id_escala": 15, "id_estudiante": 55, "id_evaluacion": 2}, {"id_escala": 1, "id_estudiante": 55, "id_evaluacion": 1}, {"id_escala": 14, "id_estudiante": 55, "id_evaluacion": 3}]}	10.194.128.129	2026-07-20 01:42:01.952+00
11	5	Configuración	evaluaciones	\N	\N	{"id_plan": 52, "id_momento": 1, "id_seccion": 2, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 90, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 10, "id_evaluacion": null}]}	10.194.128.129	2026-07-20 19:39:46.106+00
\.


--
-- Data for Name: aulas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aulas (id_aula, nombre_codigo, capacidad, tipo_espacio, ubicacion, estatus, created_at, updated_at) FROM stdin;
8	Lab. Ciencias	25	Laboratorio	Planta Baja	Disponible	2026-07-18 03:02:24.022+00	2026-07-18 03:02:24.022+00
9	Lab. Computación	20	Laboratorio	Planta Baja	Disponible	2026-07-18 03:02:24.326+00	2026-07-18 03:02:24.326+00
2	A-2	35	Teórica	Planta Baja	Disponible	2026-07-18 03:02:22.179+00	2026-07-18 03:02:22.179+00
3	A-3	35	Teórica	Planta Baja	Disponible	2026-07-18 03:02:22.491+00	2026-07-18 03:02:22.491+00
6	B-1	40	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.412+00	2026-07-18 03:02:23.412+00
7	B-2	40	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.717+00	2026-07-18 03:02:23.717+00
10	CANCHA	34	Deportiva	Planta Baja	Disponible	2026-07-18 03:02:24.641+00	2026-07-18 04:39:27.838+00
4	A-4	30	Teórica	Edificio Admin	Disponible	2026-07-18 03:02:22.798+00	2026-07-18 16:11:46.256+00
1	A-1	30	Teórica	Planta Baja	Disponible	2026-07-18 03:02:21.859+00	2026-07-18 21:14:53.939+00
12	C-1	34	Teórica	Planta Alta	Activo	2026-07-18 21:59:26.959+00	2026-07-18 21:59:26.959+00
13	C-2	30	Teórica	Planta Alta	Activo	2026-07-18 22:02:58.779+00	2026-07-18 22:02:58.779+00
15	C-5	30	Teórica	Planta Alta	Activo	2026-07-18 22:08:04.775+00	2026-07-18 22:08:04.775+00
14	C-4	30	Teórica	Planta Alta	Activo	2026-07-18 22:07:16.179+00	2026-07-18 22:09:44.189+00
16	B-4	30	Teórica	Planta Baja	Activo	2026-07-18 22:39:47.657+00	2026-07-18 22:39:47.657+00
17	D-1	30	Teórica	Planta Baja	Activo	2026-07-18 22:42:37.462+00	2026-07-18 22:42:37.462+00
18	D-2	30	Teórica	Planta Alta	Activo	2026-07-18 22:42:44.557+00	2026-07-18 22:42:44.557+00
5	A-5	34	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.106+00	2026-07-18 23:47:16.25+00
\.


--
-- Data for Name: bloques_horarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bloques_horarios (id_bloque, hora_inicio, hora_fin, tipo_bloque, numero_bloque, created_at, updated_at) FROM stdin;
1	07:00:00	07:45:00	Regular	1	2026-07-18 03:02:25.026+00	2026-07-18 03:02:25.026+00
2	07:45:00	08:30:00	Regular	2	2026-07-18 03:02:25.331+00	2026-07-18 03:02:25.331+00
3	08:30:00	09:15:00	Regular	3	2026-07-18 03:02:25.644+00	2026-07-18 03:02:25.644+00
5	09:45:00	10:30:00	Regular	5	2026-07-18 03:02:26.267+00	2026-07-18 03:02:26.267+00
7	11:15:00	12:00:00	Regular	7	2026-07-18 03:02:26.883+00	2026-07-18 03:02:26.883+00
6	10:30:00	11:15:00	Regular	6	2026-07-18 03:02:26.572+00	2026-07-18 03:02:26.572+00
4	09:15:00	09:45:00	Receso	4	2026-07-18 03:02:25.954+00	2026-07-18 03:27:32.976+00
\.


--
-- Data for Name: calificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.calificaciones (id_calificacion, id_matricula, id_plan, id_momento, id_escala, inasistencias_asignatura, created_at, updated_at) FROM stdin;
28	1	1	1	11	0	2026-07-20 01:41:40.604+00	2026-07-20 01:41:40.604+00
29	11	1	1	17	0	2026-07-20 01:41:41.456+00	2026-07-20 01:41:41.456+00
30	16	1	1	13	0	2026-07-20 01:41:42.268+00	2026-07-20 01:41:42.268+00
31	17	1	1	9	0	2026-07-20 01:41:43.077+00	2026-07-20 01:41:43.077+00
32	18	1	1	8	0	2026-07-20 01:41:43.887+00	2026-07-20 01:41:43.887+00
33	19	1	1	14	0	2026-07-20 01:41:44.698+00	2026-07-20 01:41:44.698+00
34	20	1	1	12	0	2026-07-20 01:41:45.547+00	2026-07-20 01:41:45.547+00
35	21	1	1	9	0	2026-07-20 01:41:46.359+00	2026-07-20 01:41:46.359+00
36	22	1	1	14	0	2026-07-20 01:41:47.169+00	2026-07-20 01:41:47.169+00
37	23	1	1	12	0	2026-07-20 01:41:47.98+00	2026-07-20 01:41:47.98+00
38	24	1	1	14	0	2026-07-20 01:41:48.791+00	2026-07-20 01:41:48.791+00
39	25	1	1	14	0	2026-07-20 01:41:49.602+00	2026-07-20 01:41:49.602+00
40	26	1	1	11	0	2026-07-20 01:41:50.413+00	2026-07-20 01:41:50.413+00
41	27	1	1	14	0	2026-07-20 01:41:51.224+00	2026-07-20 01:41:51.224+00
42	28	1	1	14	0	2026-07-20 01:41:52.035+00	2026-07-20 01:41:52.035+00
43	29	1	1	16	0	2026-07-20 01:41:52.846+00	2026-07-20 01:41:52.846+00
44	30	1	1	12	0	2026-07-20 01:41:53.658+00	2026-07-20 01:41:53.658+00
45	31	1	1	9	0	2026-07-20 01:41:54.468+00	2026-07-20 01:41:54.468+00
46	32	1	1	13	0	2026-07-20 01:41:55.278+00	2026-07-20 01:41:55.278+00
47	33	1	1	15	0	2026-07-20 01:41:56.087+00	2026-07-20 01:41:56.087+00
48	34	1	1	12	0	2026-07-20 01:41:56.898+00	2026-07-20 01:41:56.898+00
49	35	1	1	14	0	2026-07-20 01:41:57.748+00	2026-07-20 01:41:57.748+00
50	36	1	1	13	0	2026-07-20 01:41:58.568+00	2026-07-20 01:41:58.568+00
51	37	1	1	7	0	2026-07-20 01:41:59.378+00	2026-07-20 01:41:59.378+00
52	38	1	1	13	0	2026-07-20 01:42:00.202+00	2026-07-20 01:42:00.202+00
53	39	1	1	13	0	2026-07-20 01:42:01.013+00	2026-07-20 01:42:01.013+00
54	40	1	1	11	0	2026-07-20 01:42:01.823+00	2026-07-20 01:42:01.823+00
\.


--
-- Data for Name: dias_semana; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dias_semana (id_dia, nombre, created_at, updated_at) FROM stdin;
1	Lunes	2026-07-18 03:02:27.268+00	2026-07-18 03:02:27.268+00
2	Martes	2026-07-18 03:02:27.579+00	2026-07-18 03:02:27.579+00
3	Miércoles	2026-07-18 03:02:27.885+00	2026-07-18 03:02:27.885+00
4	Jueves	2026-07-18 03:02:28.194+00	2026-07-18 03:02:28.194+00
5	Viernes	2026-07-18 03:02:28.5+00	2026-07-18 03:02:28.5+00
\.


--
-- Data for Name: escala_calificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.escala_calificaciones (id_escala, nota_impresa, nota_literal, nota_calculo, ponderacion_letra, created_at, updated_at) FROM stdin;
1	01	Insuficiente	1	C	2026-07-17 22:00:20.138+00	2026-07-17 22:00:20.138+00
2	02	Insuficiente	2	C	2026-07-17 22:00:20.464+00	2026-07-17 22:00:20.464+00
3	03	Insuficiente	3	C	2026-07-17 22:00:20.802+00	2026-07-17 22:00:20.802+00
4	04	Insuficiente	4	C	2026-07-17 22:00:21.124+00	2026-07-17 22:00:21.124+00
5	05	Insuficiente	5	C	2026-07-17 22:00:21.442+00	2026-07-17 22:00:21.442+00
6	06	Insuficiente	6	C	2026-07-17 22:00:21.76+00	2026-07-17 22:00:21.76+00
7	07	Insuficiente	7	C	2026-07-17 22:00:22.083+00	2026-07-17 22:00:22.083+00
8	08	Insuficiente	8	C	2026-07-17 22:00:22.4+00	2026-07-17 22:00:22.4+00
9	09	Insuficiente	9	C	2026-07-17 22:00:22.718+00	2026-07-17 22:00:22.718+00
10	10	Minima	10	B	2026-07-17 22:00:23.058+00	2026-07-17 22:00:23.058+00
11	11	Minima	11	B	2026-07-17 22:00:23.377+00	2026-07-17 22:00:23.377+00
12	12	Minima	12	B	2026-07-17 22:00:23.699+00	2026-07-17 22:00:23.699+00
13	13	Minima	13	B	2026-07-17 22:00:24.021+00	2026-07-17 22:00:24.021+00
14	14	Minima	14	B	2026-07-17 22:00:24.338+00	2026-07-17 22:00:24.338+00
15	15	Sobresaliente	15	A	2026-07-17 22:00:24.653+00	2026-07-17 22:00:24.653+00
16	16	Sobresaliente	16	A	2026-07-17 22:00:24.969+00	2026-07-17 22:00:24.969+00
17	17	Sobresaliente	17	A	2026-07-17 22:00:25.289+00	2026-07-17 22:00:25.289+00
18	18	Sobresaliente	18	A	2026-07-17 22:00:25.607+00	2026-07-17 22:00:25.607+00
19	19	Sobresaliente	19	A	2026-07-17 22:00:25.922+00	2026-07-17 22:00:25.922+00
20	20	Sobresaliente	20	A	2026-07-17 22:00:26.243+00	2026-07-17 22:00:26.243+00
\.


--
-- Data for Name: especialidades; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.especialidades (id_especialidad, nombre, estatus, created_at, updated_at) FROM stdin;
1	Matemática	Activa	2026-07-18 03:01:10.742+00	2026-07-18 03:01:10.742+00
2	Castellano	Activa	2026-07-18 03:01:11.054+00	2026-07-18 03:01:11.054+00
3	Ciencias	Activa	2026-07-18 03:01:11.361+00	2026-07-18 03:01:11.361+00
4	Sociales	Activa	2026-07-18 03:01:11.665+00	2026-07-18 03:01:11.665+00
5	Idiomas	Activa	2026-07-18 03:01:11.973+00	2026-07-18 03:01:11.973+00
6	Deporte	Activa	2026-07-18 03:01:12.278+00	2026-07-18 03:01:12.278+00
7	Arte	Activa	2026-07-18 03:01:12.582+00	2026-07-18 03:01:12.582+00
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.estudiantes (id_estudiante, lugar_nac, municipio, estado, id_representante, estatus_estudiante, created_at, updated_at, cedula_escolar, nombre1, nombre2, apellido1, apellido2, fecha_nac, genero) FROM stdin;
5	Hospital Central	San cristobal	Tachira	5	Activo	2026-07-17 22:00:29.23+00	2026-07-17 22:00:29.23+00	CE-005	Pedro	Alberto	López	García	2008-07-19	M
6	Clinica El Carmen	San cristobal	Tachira	6	Activo	2026-07-17 22:00:29.318+00	2026-07-17 22:00:29.318+00	CE-006	Ana	Sofía	Fernández	Torres	2009-04-10	F
7	Hospital Central	San cristobal	Tachira	7	Activo	2026-07-17 22:00:29.399+00	2026-07-17 22:00:29.399+00	CE-007	Diego	Antonio	Ramírez	Vargas	2008-09-30	M
8	Hospital Central	San cristobal	Tachira	8	Activo	2026-07-17 22:00:29.48+00	2026-07-17 22:00:29.48+00	CE-008	Sofía	Isabel	Castillo	Rivas	2009-01-15	F
9	Ambulatorio	San cristobal	Tachira	9	Activo	2026-07-17 22:00:29.561+00	2026-07-17 22:00:29.561+00	CE-009	Andrés	Felipe	Morales	Castro	2008-06-22	M
10	Hospital Central	San cristobal	Tachira	10	Activo	2026-07-17 22:00:29.642+00	2026-07-17 22:00:29.642+00	CE-010	Valentina	María	Ortiz	Mendoza	2009-03-08	F
11	Clinica San Jose	San cristobal	Tachira	1	Activo	2026-07-17 22:00:29.725+00	2026-07-17 22:00:29.725+00	CE-011	Luis	David	Martínez	González	2009-10-05	M
12	Hospital Central	San cristobal	Tachira	2	Activo	2026-07-17 22:00:29.807+00	2026-07-17 22:00:29.807+00	CE-012	Carmen	Victoria	González	Rodríguez	2008-12-18	F
13	Clinica Sucre	San cristobal	Tachira	3	Activo	2026-07-17 22:00:29.887+00	2026-07-17 22:00:29.887+00	CE-013	Juan	Pablo	Rodríguez	Sánchez	2009-07-25	M
14	Hospital Central	San cristobal	Tachira	4	Activo	2026-07-17 22:00:29.968+00	2026-07-17 22:00:29.968+00	CE-014	María	Gabriela	Sánchez	López	2008-04-14	F
15	Hospital Central	San cristobal	Tachira	5	Activo	2026-07-17 22:00:30.049+00	2026-07-17 22:00:30.049+00	CE-015	Pedro	José	López	Fernández	2009-09-01	M
16	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	13	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33298205	HELEN	ALEXANDRA	BUSTAMANTE	OROZCO	2010-10-15	F
17	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	14	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33299583	BREINER	ARGENIS	CASTRO	SUAREZ	2011-06-28	M
18	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	15	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33283250	NAHIM	\N	CEDE�O	SALAZAR	2010-05-14	M
19	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	16	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32901874	ANYELI	NIKOOL	RAMIREZ	MONSALVE	2009-07-07	F
20	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	17	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34716263	MOISES	NOEL	RAMIREZ	MORA	2013-02-07	M
21	TARIBA	CARDENAS	TACHIRA	18	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988655	DAINELLY	ANTONELA	BARONA	CONTRERAS	2011-03-27	F
22	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	19	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33214429	EFRENNY	LILIBETH	MONTOYA	MANTILLA	2009-02-22	F
23	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	20	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34775253	SOFIA	NAYARITH	PEREZ	CORDOVA	2013-04-05	F
24	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	21	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33299588	ANTHONY	JOSUE	PRATO	REYES	2011-01-17	M
25	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	22	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33368057	NOEL	ILDEMARO	ROJAS	MANRIQUE	2010-04-28	M
26	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	23	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33215013	SCARLETH	HILDELMAR	ABRANTES	VARELA	2009-10-12	F
27	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	24	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845040	ADRIAMNY	YISELL	CALDERON	DELGADO	2011-12-01	F
28	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	25	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34839736	YARELIS	NOHEMY	CUELLAR	CASIQUE	2013-04-11	F
29	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	26	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33368276	ANDRES	SANTIAGO	PINTO	CARRERO	2010-02-06	M
30	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	27	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34096882	MARIA	JOSE	VIVAS	MORENO	2010-10-21	F
31	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	28	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911728	AUDRIS	ANTHONELA	DELGADO	DORIA	2013-07-09	F
32	BARCELONA	JUAN ANTONIO SOTILLO	ANZOATEGUI	29	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845283	RITZABETH	ALEXANDRA	DOMINGUEZ	QUI�ONEZ	2011-07-10	F
33	MARACAY	GIRARDOT	ARAGUA	30	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33410976	ALEXANDER	\N	MEDINA	MENDEZ	2008-06-14	M
34	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	31	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34199945	ALMARY	GEORGETTE	SALINAS	SANCHEZ	2012-01-11	F
1	Hospital Central	San cristobal	Tachira	1	Activo	2026-07-17 22:00:28.889+00	2026-07-17 22:00:28.889+00	CE-001	Luis	Manuel	Martínez	López	2008-05-12	M
2	Hospital Central	San cristobal	Tachira	2	Activo	2026-07-17 22:00:28.978+00	2026-07-17 22:00:28.978+00	CE-002	Carmen	Elena	González	Pérez	2009-08-23	F
3	Clinica Sucre	San cristobal	Tachira	3	Activo	2026-07-17 22:00:29.061+00	2026-07-17 22:00:29.061+00	CE-003	Juan	Carlos	Rodríguez	Hernández	2008-11-15	M
4	Ambulatorio	San cristobal	Tachira	4	Activo	2026-07-17 22:00:29.146+00	2026-07-17 22:00:29.146+00	CE-004	María	José	Sánchez	Díaz	2009-02-28	F
35	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	32	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33216846	ANA	MARIA	YA�ES	OJEDA	2008-02-28	F
36	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	33	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33217420	ROBERT	OMAR	AGUILAR	TREJO	2009-08-19	M
37	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	34	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845614	EDISSON	JOSE	CASANOVA	CONTRERAS	2011-03-03	M
38	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	35	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34996168	KLEINY	DEIYULIE	CHACON	CORREA	2013-08-13	F
39	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	36	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34386129	KEVIN	ALEJANDRO	GUERRERO	RAMIREZ	2012-04-03	M
40	CARACAS	LIBERTADOR	DISTRITO CAPITAL	37	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33439455	JULIO	CESAR	SALAZAR	GOMEZ	2009-04-23	M
41	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	38	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34996169	KLEIVER	YUNEIKER	CHACON	CORREA	2013-08-13	M
42	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	39	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33909933	VICTORIA	VALENTINA	CONTRERAS	TIBADUIZA	2011-09-14	F
43	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	40	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606392	EDY	SANTIAGO	CORDERO	CARDENAS	2009-01-22	M
44	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	41	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33217516	CRISTIAN	OMAR	NOCUA	DURAN	2009-11-10	M
45	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	42	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34716688	REINA	EMPERATRIZ	SALGADO	RODRIGUEZ	2012-11-22	F
46	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	43	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975567	JHAINELY	SOPHIA	CASAS	RICO	2011-11-29	F
47	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	44	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33254206	ELIAXKA	NEISIRET	MENDOZA	IBA�EZ	2009-12-22	F
48	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	45	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35067018	JOSUE	ANDRES	ROZO	LEON	2013-09-02	M
49	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	46	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606985	KAREN	LISETH	RUIZ	ACEVEDO	2010-10-09	F
50	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	47	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34835081	ANLLY	KATHERIN	RUIZ	ACEVEDO	2012-12-15	F
51	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	48	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272089	DEIVICK	DANIEL	CASTRO	DURAN	2008-12-20	M
52	TARIBA	CARDENAS	TACHIRA	49	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35066779	SANTIAGO	JOSE	JAIMEZ	MORENO	2011-05-02	M
53	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	50	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975592	ZAJIRA	SHAWUAMALY	MONSALVE	BORRERO	2011-03-16	F
54	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	51	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33775197	GABRIELA	ALEJANDRA	PE�A	COLMENARES	2010-01-09	F
55	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	52	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35067309	WILKAR	YUTSEL	VARGAS	SALAMANCA	2013-07-07	M
56	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	53	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975750	SEBASTIAN	JOSUE	AMADO	PULIDO	2010-11-12	M
57	TARIBA	CARDENAS	TACHIRA	54	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845103	SEBASTHYAN	MANUEL	CHACON	VELEZ	2010-07-19	M
58	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	55	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272219	KARLY	WILMAR	DELGADO	DUQUE	2009-02-11	F
59	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	56	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36043775	KAMILA	ALEJANDRA	MORENO	BLANCO	2012-10-20	F
60	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	57	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35119799	NIKOL	CAMILA	SANCHEZ	CANCHICA	2013-08-27	F
61	RUBIO	JUNIN	TACHIRA	58	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845249	SANTIAGO	JOSUETH	ALVARADO	CONTRERAS	2010-06-04	M
62	SAN JUAN	LIBERTADOR	DISTRITO CAPITAL	59	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36265334	ARANZA	ANGINELLY	HERNANDEZ	SUAREZ	2011-09-16	F
63	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	60	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33302476	JESUS	ANTONIO	MOLINA	JAIMES	2009-10-19	M
64	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	61	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975997	YOEL	STHIVEN	PE�A	MONSALVE	2011-04-18	M
65	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	62	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36013320	SALOME	ANTONELLA	RAMIREZ	BECERRA	2013-04-08	F
66	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	63	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988226	JESITBELL	SAMANTHA	GALVIS	QUI�ONEZ	2011-11-03	F
67	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	64	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36033224	MARIA	DE LOS ANGELES	GAMEZ	CHACON	2013-06-18	F
68	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	65	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367702	ANDY	XAVIER	RAMIREZ	CHACON	2009-06-20	M
69	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	66	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845429	HENDERLY	CAMILA	VARELA	MOLINA	2010-09-21	F
70	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	67	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36273760	SAUL	EDUARDO	VEGA	OMA�A	2012-05-21	M
71	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	68	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975599	DEHYBER	ALEXANDER	ANGULO	MATERANO	2010-09-11	M
72	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	69	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36285065	YISELI	ANDREINA	MORA	PABON	2012-01-31	F
73	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	70	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367704	ASTRID	SOYRETH	NIETO	CALDERON	2009-01-17	F
74	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	71	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34096210	CHAILYN	YULIETH	PATI�O	CHACON	2011-04-05	F
75	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	72	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36184100	ERIKA	VALERIA	ROJAS	PE�A	2013-01-21	F
76	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	73	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367959	SINDY	NATHALY	BELLO	RAMIREZ	2009-04-05	F
77	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	74	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36525023	ANA	LIAH	CHACON	YA�EZ	2012-07-19	F
78	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	75	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098642	ASLEYTH	SOFIA	GONZALEZ	PARRA	2011-09-21	F
79	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	76	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33987629	RANCES	ANTONIO	PABON	GAMBOA	2010-03-10	M
80	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	77	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36236899	DAIKARY	GABRIELA	RODRIGUEZ	CARDENAS	2013-07-15	F
81	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	78	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33987840	VICTORIA	ALEJANDRA	CUEVAS	CHACON	2010-10-20	F
82	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	79	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36334706	YULIHANNY	JOSELIN	MONSALBE	MARQUEZ	2013-05-20	F
83	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	80	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36536931	DUYEISI	CAROLAY	OMA�A	JAIMES	2012-09-22	F
84	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	81	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33368012	CHRISTOPHER	MANUEL	RAMIREZ	GARCIA	2009-09-03	M
85	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	82	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098856	VALERIA	SOFIA	VERA	FLORES	2011-07-24	F
86	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	83	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36504051	DAYMAR	YULIETH	CASANOVA	ESPINEL	2011-07-21	F
87	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	84	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098961	JOSNEILY	ANGELLY	CRUZ	GUETE	2011-10-24	F
88	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	85	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33410623	YHAIMAR	LUSBEY	MANTILLA	ZAMBRANO	2009-02-13	F
89	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	86	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988711	LEONEL	ANDREY	QUINTERO	MONSALVE	2010-06-29	M
90	TARIBA	CARDENAS	TACHIRA	87	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36578540	KEILYN	ORIADNY	RIOS	CHACON	2012-12-17	F
91	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	88	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34099288	SIMONEY	JULIANA	ASENCIO	CORTES	2011-02-07	F
92	MARACAY	GIRARDOT	ARAGUA	89	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36587426	SANTIAGO	JOSE	CARDENAS	CARRILLO	2012-03-21	M
93	PUNTA CARDON	CARIRUBANA	FALCON	90	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36565724	ABEL	ISACAR	GUERRERO	TORRES	2013-04-16	M
94	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	91	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33456069	TEYLOR	KALET	GUEVARA	RANGEL	2009-01-21	M
95	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	92	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34092861	MARYANGEL	\N	QUINTANA	CASTILLO	2009-08-18	F
96	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	93	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36664116	ANGELICA	SOFIA	CARRILLO	SALGADO	2012-08-05	F
97	TARIBA	CARDENAS	TACHIRA	94	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33456627	NIKOL	JULIEHT	LOPEZ	GUERRERO	2009-12-11	F
98	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	95	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36608924	BRIANNA	TAIHRY	PINEDA	PEREZ	2013-08-10	F
99	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	96	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34330104	KERVIN	JORDANO	RANGEL	HERNANDEZ	2011-12-14	M
100	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	97	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125221	MAIKEL	JOSE	ROZO	LEON	2010-07-23	M
101	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	98	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33498708	ANGEL	GRABIEL	CHACON	DUQUE	2009-11-23	M
102	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	99	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36706332	EMILY	ASYELIN	FLORES	ZAMBRANO	2013-12-16	F
103	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	100	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34330539	ELIANA	VALENTINA	ORTIZ	SIERRA	2011-12-22	F
104	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	101	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125655	JEREMY	JOUSEPH	RODRIGUEZ	DELGADO	2010-10-27	M
105	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	102	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36695336	PEDRO	LUIS	ZAMBRANO	RAMIREZ	2012-11-13	M
106	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	103	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36791651	ROXANDRI	CAMILA	CACERES	CALDERON	2011-03-24	F
107	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	104	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36730688	SEBASTIAN	ALEJANDRO	CORTEZ	JIMENEZ	2013-07-05	M
108	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	105	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34469781	ANGEL	GABRIEL	GALVIS	GONZALEZ	2011-02-09	M
109	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	106	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557322	DARLY	ALEJANDRA	PINZON	MARTINEZ	2010-05-03	F
110	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	107	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33535723	CRISBEILIS	ORIANA	VALDERRAMA	BARRERA	2009-06-23	F
111	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	108	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36928157	KEYNER	ALEJANDRO	GONZALEZ	SANGUINO	2014-01-23	M
112	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	109	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36129771	VIVIANA	CAROLINA	LEDEZMA	FERNANDEZ	2012-11-13	F
113	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	110	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557448	BRITANY	ANTONELA	PABON	CARDENAS	2011-07-01	F
114	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	111	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606686	YESNEY	KRISBEL	RODRIGUEZ	PABON	2009-04-27	F
115	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	112	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34661406	JUAN	JOSE ANGEL	ZAMBRANO	CRISALES	2010-06-06	M
116	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	113	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33695717	ARIANNY	GABRIELA	CORDERO	SAVEDRA	2009-07-06	F
117	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	114	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34575468	BRIANNY	JULIETH	CUELLAR	CASIQUE	2011-12-09	F
118	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	115	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36997545	ADANYELITH	YUSED	MENDEZ	LEAL	2012-11-19	F
119	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	116	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34716685	HEILI	NOELIA	SALGADO	RODRIGUEZ	2009-04-04	F
120	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	117	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34875367	ANGEL	GABRIEL	GOMEZ	SANCHEZ	2010-02-11	M
121	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	118	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37034725	KEINER	SANTIAGO	MARQUEZ	VIVAS	2013-09-27	M
122	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	119	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988693	JOSEMITH	CAROLINA	MARTINEZ	SOTO	2009-08-20	F
123	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	120	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619410	ERICK	ABRAHANT	MIRANDA	CHACON	2011-10-24	M
124	TARIBA	CARDENAS	TACHIRA	121	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36506066	ABIGAIL	YASLIETH	CASANOVA	ESPINEL	2008-12-12	F
125	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	122	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37094303	MEGHAN	KENAY	GOMEZ	LOPEZ	2013-12-11	F
126	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	123	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619461	NIURBETH	ALNAIR	MARQUEZ	IBARRA	2011-09-29	F
127	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	124	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125667	ADRIAN	JESUS	RODRIGUEZ	PARRA	2009-10-27	M
128	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	125	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37003688	CHRISTOPHER	ALEXIS	CRUZ	VARELA	2009-05-08	M
129	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	126	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125887	NEYLITH	JULIETH	LOPEZ	BETANCUR	2009-10-16	F
130	TUCUPITA	TUCUPITA	DELTA AMACURO	127	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34875100	DYLAN	SAMUEL D'ALESSANDRO	MEJIAS	BERBESI	2010-06-16	M
131	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	128	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37210230	DEIVIANY	ALEXANDRA	MENDOZA	DELGADO	2013-04-22	F
132	TARIBA	CARDENAS	TACHIRA	129	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37550339	HEBERT	JOSUE	COLMENARES	CASTELLANOS	2009-09-03	M
133	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	130	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911139	YELSIANI	CHIQUINKIRA	MENDOZA	DELGADO	2011-08-31	F
135	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	132	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34661464	KEYBI	ALESSANDRA	TORRES	PERNIA	2009-05-27	F
136	BOLIVAR	CARONI	BOLIVAR	133	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34973860	STIVEN	ALFONZO	LEZAMA	ORTEGA	2010-03-26	M
137	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	134	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911790	AIRAM	DEL VALLE	ROSALES	QUINTERO	2009-09-05	F
138	BARQUISIMETO	IRIBARREN	LARA	135	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35170549	STHEFANI	YUSNEIDY	CARRASCO	CORDERO	2010-08-20	F
139	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	136	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36453275	HARRINSON	ALEJANDRO	MOYA	VALDUZ	2009-07-20	M
140	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	137	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36040740	AIDAN	JETLI	SUESCUN	MENDEZ	2010-11-01	M
141	BARINAS	BARINAS	BARINAS	138	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36770598	DANIEL	DAMIAN	USECHE	FLORES	2009-03-20	M
142	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	139	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37004074	GABRIEL	SNEIDER	CRUZ	VARELA	2010-08-24	M
143	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	140	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367763	ESTIBEN	ARMANDO	BELLO	RAMIREZ	2010-02-14	M
144	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	141	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32594942	CRISTIAN	ANDREY	CACERES	TRASPALACIO	2008-08-20	M
145	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	142	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34835140	EFREN	JOSUE	DELGADO	VELANDRIA	2013-08-27	M
146	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	143	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32372212	MOISES	AARON	MARTINEZ	MENDOZA	2007-12-08	M
147	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	144	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098997	MAURICIO	ALEJANDRO	MEDINA	SANCHEZ	2012-03-01	M
148	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	145	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35159873	SARAY	FRANCHESKA YURBEY	COLMENARES	VIVAS	2010-11-23	F
149	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	146	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845205	CHRISTIAN	GABRIEL ISAAC	DOMINGUEZ	MARTINEZ	2011-05-16	M
150	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	147	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619020	RICHARDH	CLEIDERMAN	GONZALEZ	CARVAJAL	2012-01-21	M
151	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	148	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33254861	LUIS	ALEJANDRO	RUIZ	ROMERO	2009-10-18	M
152	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	149	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32889240	ADRIAN	ALEXIS	VADILLO	LOPEZ	2009-03-16	M
153	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	150	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619255	DULCE	MARIA	COLMENARES	ARAQUE	2012-11-23	F
154	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	151	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32932490	NAOMI	ALEXANDRA	MEDINA	SALAS	2009-05-08	F
155	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	152	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272362	PAULO	JOHENDRY	SUAREZ	VACA	2010-01-19	M
156	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	153	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36032291	EMMANUEL	\N	VIVAS	LOPEZ	2013-09-14	M
157	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	154	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975238	SHAIRA	DARIANA	VIVAS	VALDERRAMA	2011-01-22	F
158	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	155	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32999074	JOSNEY	OMAR	CRUZ	GUETE	2009-09-08	M
159	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	156	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33282776	JESUS	DAVID	JAIMES	SANCHEZ	2009-12-25	M
160	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	157	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36056870	SANTIAGO	DAVID	LIZARAZO	BARRIO	2013-12-24	M
161	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	158	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619353	JESSYMAR	SOFIA	MANRIQUE	DUQUE	2012-04-21	F
162	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	159	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988100	EMMANUEL	SALVATORE	REYES	SANTANDER	2011-07-08	M
163	SAN JUAN DE COLON	AYACUCHO	TACHIRA	160	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36192724	SHARLYN	NAKARY	CONTRERAS	PEREZ	2013-06-27	F
164	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	161	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988268	ENDERLY	SARAY	DIAZ	RAMIREZ	2011-12-22	F
165	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	162	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367891	DIOSMARY	NAZARET	GALLO	TOLOSA	2009-11-09	F
166	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	163	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33216966	YEREMI	JOSE	NOVOA	LEDEZMA	2009-09-12	M
167	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	164	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834223	DIEGO	ALEJANDRO	TRUJILLO	OCARIZ	2011-02-17	M
168	SAN JUAN DE COLON	AYACUCHO	TACHIRA	165	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36192749	SHARYTH	NATALY	CONTRERAS	PEREZ	2013-06-27	F
169	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	166	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33239171	GIORGINA	CAMILA	ESPINOZA	PE�A	2009-07-26	F
170	TARIBA	CARDENAS	TACHIRA	167	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988305	LINDA	YUNAI	GUEVARA	RANGEL	2011-03-28	F
171	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	168	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834224	FIORELLA	OCARIZ	TRUJILLO	OCARIZ	2011-02-17	F
172	TARIBA	CARDENAS	TACHIRA	169	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33456576	YECSIBELL	GABRIELA	VARON	SANDOVAL	2010-05-22	F
173	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	170	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33239220	YOSMAR	ALFREDO	ANGULO	GARCIA	2009-05-19	M
174	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	171	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834292	STHIVEN	ITHIEL	DIAZ	NIETO	2012-05-18	M
175	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	172	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36192944	CHRISTOPHER	SANTIAGO ISAI	DOMINGUEZ	MARTINEZ	2013-06-29	M
176	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	173	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988397	IVY	KAROLY	LAGUADO	CAMACHO	2011-02-09	F
177	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	174	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606358	BRITANNY	JOHANNA	PORRAS	ZAPATA	2010-07-30	F
178	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	175	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834580	ERICK	DAVID	CHACON	VARELA	2013-03-03	M
179	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	176	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36196351	ARANTZA	GABRIELA	DELGADO	CARRILLO	2013-11-22	F
180	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	177	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988673	DILAN	STNEIDER	RAVELO	JAIMES	2011-09-04	M
181	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	178	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33271529	ANYELLA	MARIANNI	VELAZCO	TOSCANO	2009-12-14	F
182	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	179	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34096666	SOFI	ANGELINA	CONTRERAS	COLMENARES	2010-04-30	F
183	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	180	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834860	CRISBELL	VALENTINA	QUINTERO	RAMIREZ	2012-11-01	F
184	TARIBA	CARDENAS	TACHIRA	181	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36215398	VALERY	ANYELY	RAMIREZ	VEGA	2013-06-19	F
185	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	182	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33271733	MARTHA	PAULA	RODRIGUEZ	ARAQUE	2009-07-22	F
186	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	183	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845046	YORDAN	DAVID	FRANCO	COTE	2010-04-17	M
187	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	184	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098511	JEREMY	REINALDO	MANCILLA	SANCHEZ	2011-09-29	M
188	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	185	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272314	MARIANA	GEORGINA	SANTANA	TOSCANO	2009-07-08	F
189	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	186	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34875166	MARIANGEL	DANIELA	VARGAS	ROA	2012-11-19	F
190	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	187	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845363	LEIDY	GABRIELA	ALCEDO	GARCIA	2010-02-03	F
191	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	188	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098755	MICHELL	ALEJANDRA	CHACON	MALLORCA	2011-02-15	F
192	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	189	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272400	DARIANGELY	\N	GOMEZ	FLOREZ	2009-07-11	F
193	BARINAS	BARINAS	BARINAS	190	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911363	STHEFANIA	DEL VALLE	PEREZ	MORENO	2013-03-25	F
194	TARIBA	CARDENAS	TACHIRA	191	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911712	CARLA	JEANYMAR	CAMARGO	GUERRERO	2013-05-01	F
195	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	192	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33283177	JACSON	ROMARIO	CHINCHILLA	DELGADO	2010-03-14	M
196	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	193	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36430043	ADRIANYI	WHITNEY	GOMEZ	BASTOS	2013-10-18	F
197	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	194	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845541	LESLY	LAINETH	PAREDES	IBARRA	2010-10-09	F
198	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	195	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125487	ORIANA	VALENTINA	RAMIREZ	MALLORCA	2011-03-09	F
199	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	196	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36453277	DAYERLY	GRECIMAR	BASTOS	MOYA	2013-05-27	F
200	PETARE	SUCRE	MIRANDA	197	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33283233	MARELYS	ALEXANDRA	ESTRADA	NAVEDA	2009-11-21	F
201	TARIBA	CARDENAS	TACHIRA	198	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988635	JESUS	GABRIEL	LUGO	AGUILAR	2010-04-06	M
202	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	199	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125653	JEREMY	ALEXANDER	MARTINEZ	MARTINEZ	2011-12-21	M
203	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	200	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36049612	KEVIN	JOHAN	MORENO	CUBEROS	2012-08-03	M
204	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	201	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36077180	FRANK	DEIVER	CHACON	ARENA	2012-10-15	M
205	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	202	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125781	JOSUE	ANTONIO	DELGADO	DUQUE	2011-06-28	M
206	TARIBA	CARDENAS	TACHIRA	203	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33283305	VALENTINA	NAYALY	MORALES	YANES	2009-07-02	F
207	TARIBA	CARDENAS	TACHIRA	204	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36495066	SHEILA	NOHEMI	PARADA	VALERO	2013-04-02	F
208	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	205	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33988755	KERLYMAR	SHARAY	PARRA	ZAMBRANO	2010-09-06	F
209	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	206	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34093177	ISABELLA	MARIA	DURAN	ALMEIRA	2010-09-07	F
210	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	207	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36626432	CRISTHERLIN	GREIRETH	GUERRERO	RIVAS	2013-02-21	F
211	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	208	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34125805	KRISEL	JHEISARE	PALENCIA	CHAPARRO	2011-01-22	F
212	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	209	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36350069	DUBRAZCA	GISSEL	PARRA	MANTILLA	2012-07-07	F
213	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	210	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33302709	ENDER	JOSUE	VARELA	MOLINA	2009-09-13	M
214	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	211	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34874833	ELEIXER	GABRIEL	GARCIA	CARRERO	2010-05-02	M
215	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	212	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36394510	ENMANUEL	MAXIMILIANO	NAVARRO	PRATO	2013-03-02	M
216	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	213	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367860	MARIA	GABRIELA	RAMIREZ	OSORIO	2009-05-06	F
217	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	214	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34098929	CARLYMAR	UBALDINA	RODRIGUEZ	CAICEDO	2010-02-14	F
219	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	216	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33439035	GLADYS	CELINA LUZ DEL MAR	CARDENAS	LUNA	2009-10-17	F
220	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	217	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36744061	JOSUE	ISAAC	CONDE	DUARTE	2013-07-28	M
221	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	218	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34099088	RACHEL	NOHEMI	MEJIAS	ORTIZ	2010-11-18	F
222	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	219	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34875104	NICOLE	ANAIS	MORENO	GUEVARA	2011-09-28	F
223	TARIBA	CARDENAS	TACHIRA	220	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36450093	KAMMILA	DE LOS ANGELES	PARADA	VALERO	2012-02-10	F
224	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	221	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33535970	ANDREA	CAROLINA	ARBOLEDA	LUNA	2008-11-11	F
225	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	222	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911326	JOSE	GREGORIO	GARCIA	SUAREZ	2011-11-03	M
226	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	223	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34159580	EDGLENNY	ALEXANDRA NATANAYLIN	MARQUEZ	GARCIA	2010-08-31	F
227	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	224	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36809435	ZAIMAR	NAIRETH	MOLINA	DELGADO	2014-06-11	F
228	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	225	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36524720	SILKEINER	JOSE	VELAZCO	GAMBOA	2012-04-27	M
229	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	226	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911421	ENYARI	LIZETH	HERNANDEZ	RICO	2011-01-12	F
230	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	227	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36816590	ANGELICA	NICOLLE	HERRERA	ALARCON	2013-04-24	F
231	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	228	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36548462	SMAYLIN	ALEXANDRA	OCHOA	LEAL	2012-11-16	F
232	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	229	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33536465	JEREMY	LIONEL	PEREZ	ANAVITARTE	2010-05-04	M
233	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	230	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34199553	JOSE	GREGORIO	VERA	CARRERO	2010-10-03	M
234	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	231	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34199912	KRISTHIAN	DAVID	CONTRERAS	PARRA	2010-08-08	M
235	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	232	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33695641	JEFFERSON	IBRAHIMOVIC	FLOREZ	MEDINA	2009-11-11	M
236	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	233	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	10913708373	SANTIAGO	JOSE	GRIMALDO	TRUJILLO	2009-07-01	M
237	SAN BERNARDINO (CARACAS)	LIBERTADOR	DISTRITO CAPITAL	234	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37052650	CAMILA	LIANALEHT	MIRANDA	RAMIREZ	2013-09-24	F
238	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	235	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35118998	YOHANDRY	ISAACC	ANGULO	GARCIA	2011-08-30	M
239	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	236	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34199914	RHONNA	SOFIA	OLIVEROS	RODRIGUEZ	2010-07-01	F
240	CAICARA	CEDE�O	MONAGAS	237	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	11227341697	MITFANNY	YORDEYLIS	QUIROZ	\N	2012-05-22	F
241	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	238	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33737039	LYBEHIKA	NICOLE	RONDON	RINCON	2009-02-14	F
242	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	239	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37120326	DYLAN	ALEJANDRO	SANCHEZ	JUSTACARA	2013-06-15	M
243	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	240	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34200016	YOFREI	ALEJANDRO	MARTINEZ	CONTRERAS	2010-08-08	M
244	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	241	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35159278	FRANCK	ANDRES	QUINTANA	CARDENAS	2011-02-28	M
245	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	242	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33975710	ERENNY	ANABELLA	ROSALES	PERNIA	2009-10-22	F
247	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	244	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	35159628	GREISMAR	ALEXA	GUTIERREZ	SUESCUN	2011-03-04	F
248	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	245	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37383878	JASLEHIDY	VALENTINA	MONSALVE	ROZO	2013-12-31	F
249	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	246	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33410326	NERI	YULIANA	RAMIREZ	PULIDO	2009-10-02	F
250	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	247	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34243751	YIBRAHIN	JOSUEE	SANCHEZ	VASQUEZ	2010-12-06	M
251	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	248	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	11217207124	STIVEN	JOSUE	CASIQUE	HERNANDEZ	2012-12-12	M
252	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	249	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557534	WILMARY	SAMIRA	CASTILLO	RONDON	2010-08-14	F
253	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	250	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36025159	LOREANY	ANYELY	MEDINA	ZAMBRANO	2011-10-19	F
254	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	251	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34716862	HILLARY	JISEL	OROZCO	TRILLOS	2009-11-24	F
255	FLORIDA BLANCA	SANTANDER	COLOMBIA	252	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	11363352421	JUAN	DAVID	HERNANDEZ	SANCHEZ	2013-09-10	M
256	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	253	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36039861	VERONICA	ANTHONELA	MAJANO	MALDONADO	2011-10-04	F
257	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	254	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34329950	YUSDARI	KARLEY	MU�OZ	ORTIZ	2010-02-10	F
258	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	255	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36806992	MARIA	MARGARITA	RINCON	VERA	2009-01-30	F
259	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	256	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36248002	SEBASTIAN	ISAAC	SOSA	SOSA	2011-07-10	M
260	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	257	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36271907	MARIANGEL	\N	COVILLA	ACEVEDO	2010-09-26	F
261	VALENCIA	VALENCIA	CARABOBO	258	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36331698	SANTIAGO	JOSUE	GARCIA	MOLINA	2011-02-25	M
262	COLON	AYACUCHO	TACHIRA	259	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36156250	MARIA	JOSE	COLMENARES	RAMIREZ	2011-06-17	F
263	TARIBA	CARDENAS	TACHIRA	260	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33987807	JUAN	DIEGO	OLIVEROS	ARIAS	2012-01-27	M
264	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	261	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32758412	JOSE	ANGEL	PE�ALOZA	RUEDA	2009-02-25	M
265	CORO	MIRANDA	FALCON	262	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33253903	HECTOR	ALEXANDER	SALERO	TROMPIZ	2009-02-11	M
266	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	263	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33989357	WILFER	ARMANDO	VIVAS	LOPEZ	2011-06-08	M
267	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	264	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34092972	DUBRASKA	GABRIELA	COLMENARES	COLMENARES	2012-01-12	F
268	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	265	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34504661	WILDERSON	JOSUE	LOPEZ	LOPEZ	2012-09-14	M
269	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	266	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272214	KEISHLY	YINETH	RANGEL	HERNANDEZ	2010-01-03	F
270	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	267	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32785964	ANGEL	SANTIAGO	SANCHEZ	ROSALES	2008-05-14	M
271	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	268	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32888558	ORIANA	CAROLINA	ESCALANTE	FUENTES	2008-08-26	F
272	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	269	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33296393	MARIA	FERNANDA	OSORIO	BARRERA	2010-02-02	F
273	TRUJILLO	VALERA	TRUJILLO	270	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34834722	ROSANGELA	VICTORIA	ROJAS	PAREDES	2011-06-13	F
274	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	271	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34386465	VALERY	GRABIELA	TOSCANO	BAUTISTA	2012-06-26	F
275	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	272	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34469954	VICTORIA	NOHEMI	BELLO	ANTELIZ	2012-06-08	F
276	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	273	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33296633	BRENDA	SOFIA	OTERO	MENDEZ	2010-06-20	F
277	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	274	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32932762	DARELIS	YEIMAR	PASTRAN	TRUJILLO	2009-05-14	F
279	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	276	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36125937	JEANN	CARLOS	CAMPOS	PACHECO	2014-03-15	M
280	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	277	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32999169	ALEXANDRA	DEL CARMEN	CASANOVA	CONTRERAS	2009-04-24	F
281	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	278	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33296646	ANGELES	AMELIA	OTERO	MENDEZ	2010-06-20	F
282	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	279	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34504544	CAMILO	ALEXANDER	RUIZ	MEJIA	2012-10-10	M
283	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	280	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33302228	WENDY	ALEXANDRA	MENESES	DELGADO	2010-04-24	F
284	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	281	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36125982	CARLOS	ELIAS	PE�A	MONSALVE	2013-08-20	M
285	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	282	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557304	LEIDY	ALEXANDRA	PINZON	MARTINEZ	2012-04-21	F
286	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	283	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	32999262	ADRIAN	ALEXIS	SANGUINO	ROMERO	2009-01-02	M
287	CARACAS	LIBERTADOR	DISTRITO CAPITAL	284	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33160450	DARIAINY	ESTEFANIA	BELANDRIA	SILVA	2009-01-26	F
288	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	285	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557636	DILAN	YAIR	HERNANDEZ	BALTAZAR	2012-08-19	M
289	SAN GABRIEL	MIRANDA	FALCON	286	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36137980	SEBASTIAN	ANDRES	MEDINA	ROUVIER	2014-02-07	M
290	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	287	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33302520	DANIELA	SARAY	SIERRA	CASIQUE	2010-05-27	F
291	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	288	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33368197	LURIS	MARBEL	BARRIOS	COBOS	2010-07-08	F
292	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	289	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34619169	JOSVAN	ZHADIEL	CASTRO	HERNANDEZ	2012-11-09	M
293	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	290	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36183507	NOHEMID	ALEXANDRA	HERNANDEZ	CALDERON	2013-01-24	F
294	BARINAS	BARINAS	BARINAS	291	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33189019	EDUARDO	JOSE	RINCON	PACHECO	2009-10-06	M
295	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	292	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36242429	JOSE	ANDRES	ACERO	VEGA	2014-02-08	M
246	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	243	Activo	2026-07-18 23:11:01.700528+00	2026-07-21 23:14:28.233+00	V-37269970	ANYELITH	KATHERIN	SANCHEZ	FERREIRA	2013-11-20	F
296	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	293	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33455930	SALVADOR	ABIMELEC	AREVALO	CHACON	2009-04-09	M
297	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	294	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33214290	ELEHANDER	GABRIEL	CONTRERAS	MENDOZA	2009-06-02	M
298	TARIBA	CARDENAS	TACHIRA	295	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34774967	KHRISLAYA	NAHOMI	DURAN	GIRALDO	2012-10-11	F
299	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	296	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33214558	DAHYLET	VALENTINA	CANDELARIO	VIVAS	2009-09-19	F
300	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	297	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36249013	ALBERTH	MATHIAS	SALINAS	SANCHEZ	2013-04-01	M
301	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	298	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33536475	JOSE	DAVID	SANCHEZ	LOZANO	2010-09-23	M
302	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	299	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34775615	KAREN	MAYERLIN	VELAZCO	TOSCANO	2012-05-10	F
303	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	300	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36307638	AMY	ANTONELLA	ALVARADO	RUIZ	2012-08-19	F
304	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	301	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33253952	CARLOS	LUIS	CASTRO	SANCHEZ	2009-09-24	M
305	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	302	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606168	WENDY	ESTEFANI	MORA	PABON	2010-04-09	F
306	TARIBA	CARDENAS	TACHIRA	303	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911772	DENIS	ALEXANDER	RUIZ	CONTRERAS	2012-09-20	M
307	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	304	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606212	GEOVANNY	GABRIEL	BASTOS	MARTINEZ	2010-01-26	M
308	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	305	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36340506	SEBASTIAN	ALEJANDRO	CARRERO	MARQUEZ	2013-04-25	M
309	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	306	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33254472	ANGEL	DANIEL	GARCIA	CARRILLO	2009-07-07	M
310	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	307	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34996197	ANA	VERONICA	VERA	CARRERO	2012-03-19	F
311	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	308	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606878	VICTOR	DAVID	CARRILLO	VARELA	2010-07-28	M
312	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	309	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34996370	SHARICK	FABIANA	MENDEZ	CASTRO	2012-11-01	F
313	PUERTO CABELLO	PUERTO CABELLO	CARABOBO	310	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36376030	JOSE	ABRAHAM	PEREIRA	SERRANO	2013-07-17	M
314	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	311	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33272126	GENESIS	ALEXANDRA	RINCON	MOLINA	2009-05-21	F
315	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	312	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845120	LUZ	KRISTAL	ALVAREZ	PE�ALOZA	2010-03-21	F
316	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	313	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33283187	FREIBER	ALEJANDRO	CAICEDO	PINEDA	2009-10-30	M
317	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	314	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36397375	BRIMYERLYZ	YARIANGEL	CASTILLO	MONCADA	2013-06-02	F
318	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	315	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34996371	SHARON	MARIA	MENDEZ	CASTRO	2012-11-01	F
319	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	316	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33367953	KENDRA	MILDREY	CONTRERAS	PARRA	2009-03-25	F
320	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	317	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36203792	JOSE	ABRAHAM	ONTIVEROS	MARQUEZ	2012-12-26	M
321	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	318	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36666209	MARIANA	VALENTINA	PE�A	CELIS	2013-07-16	F
322	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	319	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33845736	NISSI	YIREH	RAMIREZ	CARVAJAL	2010-07-07	F
323	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	320	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33987803	ANAHY	SHIRLEY	CACERES	PEREZ	2010-05-19	F
324	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	321	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36264428	DULCE	VIOLETA	CHACON	VELEZ	2012-10-17	F
325	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	322	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33410476	DIANNY	FABIANA	ZAPATA	LIENDO	2009-07-07	F
326	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	323	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33410720	DAINELYS	JULLIHANA	CARRERO	AGELVIS	2009-03-16	F
327	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	324	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37118673	WENDY	DE JESUS	DELGADO	GAMBOA	2013-11-11	F
328	LOS TEQUES	GUAICAIPURO	MIRANDA	325	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33989315	SEBASTIAN	JOSE	MIRANDA	RAMIREZ	2010-07-25	M
329	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	326	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36528200	FRANEYLY	KLEYMAR	PARRA	VELAZCO	2012-11-30	F
330	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	327	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34159249	LEONEL	SEBASTIAN	COLMENARES	CACERES	2010-07-27	M
331	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	328	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37128935	KLEIDYMAR	NOHEMY	PARRA	ZAMBRANO	2013-09-23	F
332	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	329	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37100469	MANUEL	ADRIAN	SANCHEZ	VALDERRAMA	2012-09-05	M
333	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	330	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33439497	DARQUI	YORGEILI	SANTAFE	CONTRERAS	2009-01-18	F
334	TARIBA	CARDENAS	TACHIRA	331	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37134603	HENRI	OVIDIO	CACERES	PEREZ	2013-02-07	M
335	TARIBA	CARDENAS	TACHIRA	332	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33439771	SAMUEL	CUSTODIO	GARCIA	ORTEGA	2009-06-20	M
336	TARIBA	CARDENAS	TACHIRA	333	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	11214504957	NAHOMY	VALENTINA	GUERRERO	MONTILVA	2012-11-11	F
337	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	334	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34469157	JOSE	ALEJANDRO	SANTOS	CARRERO	2009-06-18	M
338	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	335	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34911471	JESUS	ENMANUEL	BRI�EZ	RUBIO	2012-06-17	M
339	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	336	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37167497	EILEEN	DANIELA	MORENO	HERNANDEZ	2013-02-25	F
340	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	337	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33456593	JESUS	EDUARDO	OLIVEROS	ARIAS	2009-10-04	M
341	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	338	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34469738	ORIANA	VALENTINA	RAMIREZ	VIVAS	2010-12-23	F
342	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	339	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557370	KRISBEL	AYMAR	CARVAJAL	PARADA	2010-06-24	F
343	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	340	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606631	EMILY	NICOLD	GARCIA	USECHE	2009-09-28	F
344	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	341	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37174423	ANDREA	CAMILA	MELO	DIAZ	2014-02-13	F
345	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	342	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33606723	VERONICA	ALEJANDRA	CARRILLO	VARELA	2009-07-08	F
346	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	343	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34716678	CAMILO	ALONZO	MENDEZ	PARRA	2011-01-29	M
347	BARINAS	BARINAS	BARINAS	344	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	37302186	DANYELO	ISMAEL	USECHE	FLORES	2012-04-08	M
348	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	345	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33844890	JOSE	HABRAHAN	CONDE	DUARTE	2009-09-19	M
349	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	346	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	11321001153	DIANNGELIS	ALEXANDRA	GALVIZ	ACEVEDO	2013-10-05	F
350	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	347	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36177007	NEYRIS	KAMILA	LOPEZ	BLANCO	2010-06-20	F
351	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	348	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33976094	JUAN	SANTIAGO	NI�O	RODRIGUEZ	2009-04-16	M
352	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	349	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36459500	JAVIER	ALBERTO	NOVOA	MALDONADO	2010-01-21	M
353	GUASDUALITO	PAEZ	APURE	350	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34557359	ORIANNY	KATHERINE	PE�A	MALDONADO	2013-01-10	F
354	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	351	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34159468	DANIEL	ALEXANDER	CORTEZ	JIMENEZ	2009-05-16	M
355	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	352	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	36747648	CAMILA	ANDREA	PERNIA	CHACON	2010-07-26	F
356	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	353	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	33737566	JOHASBET	SARAY	CARDENAS	TORRES	2009-09-18	F
357	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	354	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34199560	JAELYN	NIKOLT	JURGENSEN	CASTELLANOS	2009-06-20	F
358	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	355	Activo	2026-07-18 23:11:01.700528+00	2026-07-18 23:11:01.700528+00	34330376	ANGELLA	STEPHANIA	DUQUE	RAMIREZ	2009-11-06	F
278	SAN PEDRO	LIBERTADOR	DISTRITO CAPITAL	275	Activo	2026-07-18 23:11:01.700528+00	2026-07-21 23:00:14.552+00	V-34875492	AURELIO	ABRAHAM	SANCHEZ	BECERRA	2013-09-08	M
134	SAN CRISTOBAL	SAN CRISTOBAL	TACHIRA	131	Activo	2026-07-18 23:11:01.700528+00	2026-07-21 23:13:53.035+00	V-37424372	KEMBERLY	ALEXANDRA	RUIZ	RAMIREZ	2014-03-12	F
218	JUDIBANA	LOS TAQUES	FALCON	215	Activo	2026-07-18 23:11:01.700528+00	2026-07-21 23:14:39.922+00	V-36682055	YUFRANNYS	DE LOS ANGELES	SANCHEZ	MENDEZ	2013-04-05	F
\.


--
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluaciones (id_evaluacion, id_plan, id_seccion, id_momento, descripcion, ponderacion, created_at, updated_at) FROM stdin;
1	1	1	1	Examen diagnostico	25	2026-07-18 17:54:36.112+00	2026-07-18 17:54:36.112+00
2	1	1	1	Examen 1	50	2026-07-18 17:54:36.199+00	2026-07-18 17:54:36.199+00
3	1	1	1	Examen 2	25	2026-07-18 17:54:36.276+00	2026-07-18 17:54:36.276+00
4	1	1	2	Evaluación maestra	50	2026-07-18 18:15:43.091+00	2026-07-18 18:15:43.091+00
5	1	1	2	Taller didactico	50	2026-07-18 18:15:43.182+00	2026-07-18 18:15:43.182+00
6	1	1	3	Exposicion	50	2026-07-18 18:16:22.567+00	2026-07-18 18:16:22.567+00
7	1	1	3	Taller	25	2026-07-18 18:16:22.645+00	2026-07-18 18:16:22.645+00
8	1	1	3	Mapa mental	25	2026-07-18 18:16:22.722+00	2026-07-18 18:16:22.722+00
9	52	2	1	Evaluación Única	90	2026-07-20 19:39:45.611+00	2026-07-20 19:39:45.611+00
10	52	2	1	Nueva Actividad	10	2026-07-20 19:39:45.777+00	2026-07-20 19:39:45.777+00
\.


--
-- Data for Name: formatos_sabana; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.formatos_sabana (id_formato, nombre_formato, configuracion, imagen_referencia, es_activo, creado_por, fecha_creacion, fecha_modificacion) FROM stdin;
2	Formato MPPE Estándar	{"margenes": {"top": 20, "left": 15, "right": 15, "bottom": 20}, "secciones": {"body": {"altura": "auto", "elementos": [{"x": 0, "y": 0, "id": "tbl_main", "tipo": "grades_table", "ancho": "100%", "bordes": true, "columnas": [{"id": "num", "ancho": 40, "nombre": "N°", "campo_dato": "student.list_number"}, {"id": "cedula", "ancho": 90, "nombre": "Cédula", "campo_dato": "student.cedula"}, {"id": "nombre", "ancho": 220, "nombre": "Nombres y Apellidos del Estudiante", "campo_dato": "student.full_name"}, {"id": "l1", "ancho": 70, "nombre": "LAPSO 1 (L1)", "campo_dato": "grades.lapso1"}, {"id": "l2", "ancho": 70, "nombre": "LAPSO 2 (L2)", "campo_dato": "grades.lapso2"}, {"id": "l3", "ancho": 70, "nombre": "LAPSO 3 (L3)", "campo_dato": "grades.lapso3"}, {"id": "final", "ancho": 80, "nombre": "NOTA FINAL", "campo_dato": "grades.final"}, {"id": "estado", "ancho": 100, "nombre": "ESTADO", "campo_dato": "grades.status"}], "estilo_cuerpo": {"fuente": "Arial", "tamano": 9, "fondo_par": "#ffffff", "alineacion": "center", "fondo_impar": "#f8fafc"}, "alternar_colores": true, "estilo_encabezado": {"fondo": "#f8fafc", "fuente": "Arial", "tamano": 8, "negrita": true, "color_texto": "#1e293b"}}]}, "footer": {"altura": 100, "elementos": [{"x": 20, "y": 40, "id": "sig1", "tipo": "signature", "ancho": 180, "fuente": "Arial", "tamano": 9, "titulo": "Dr. Francisco Linares\\nDirector Principal (Sello)"}, {"x": 220, "y": 40, "id": "sig2", "tipo": "signature", "ancho": 180, "fuente": "Arial", "tamano": 9, "titulo": "Lic. Teresa Carreño\\nControl de Estudios"}, {"x": 420, "y": 40, "id": "sig3", "tipo": "signature", "ancho": 180, "fuente": "Arial", "tamano": 9, "titulo": "Prof. de Cátedra\\nCarga Digital Registrada y Conforme"}]}, "header": {"altura": 140, "elementos": [{"x": 15, "y": 0, "id": "hdr1", "tipo": "text", "ancho": "100%", "estilo": {"color": "#1e293b", "fuente": "Arial", "tamano": 12, "cursiva": false, "negrita": true, "alineacion": "left"}, "contenido": "República Bolivariana de Venezuela"}, {"x": 15, "y": 18, "id": "hdr2", "tipo": "text", "ancho": "100%", "estilo": {"color": "#475569", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": false, "alineacion": "left"}, "contenido": "Ministerio del Poder Popular para la Educación"}, {"x": 15, "y": 33, "id": "hdr3", "tipo": "text", "ancho": "100%", "estilo": {"color": "#475569", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": false, "alineacion": "left"}, "contenido": "Liceo Bolivariano \\"José Antonio Anzoátegui\\""}, {"x": 15, "y": 48, "id": "hdr4", "tipo": "text", "ancho": "100%", "estilo": {"color": "#64748b", "fuente": "Courier New", "tamano": 9, "cursiva": false, "negrita": false, "alineacion": "left"}, "contenido": "Código MPPE: #EM-77218320"}, {"x": 420, "y": 0, "id": "hdr5", "tipo": "field", "ancho": 160, "campo": "current_date", "label": "Fecha", "estilo": {"color": "#1e293b", "fuente": "Arial", "tamano": 9, "cursiva": false, "negrita": false, "alineacion": "center"}}, {"x": 420, "y": 18, "id": "hdr6", "tipo": "text", "ancho": 160, "estilo": {"color": "#1e293b", "fuente": "Arial", "tamano": 7, "cursiva": false, "negrita": true, "alineacion": "center"}, "contenido": "REGISTRO DE CONTROL DE ESTUDIOS"}, {"x": 80, "y": 75, "id": "hdr7", "tipo": "text", "ancho": 450, "estilo": {"color": "#0f172a", "fuente": "Arial", "tamano": 12, "cursiva": false, "negrita": true, "alineacion": "center"}, "contenido": "ACTA INTEGRAL DE EVALUACIONES CONTINUAS (\\"SÁBANA DE NOTAS\\")"}, {"x": 80, "y": 98, "id": "hdr8", "tipo": "field", "ancho": 450, "campo": "section.grade", "label": "Grado", "estilo": {"color": "#64748b", "fuente": "Arial", "tamano": 9, "cursiva": false, "negrita": false, "alineacion": "center"}}, {"x": 80, "y": 113, "id": "hdr9", "tipo": "field", "ancho": 450, "campo": "subject.name", "label": "Asignatura", "estilo": {"color": "#64748b", "fuente": "Arial", "tamano": 9, "cursiva": false, "negrita": false, "alineacion": "center"}}]}}, "orientacion": "portrait"}	\N	t	\N	2026-07-20 09:33:48.777646+00	2026-07-20 19:16:56.113+00
1	prueba-1	{"margenes": {"top": 20, "left": 15, "right": 15, "bottom": 20}, "secciones": {"body": {"altura": "auto", "elementos": [{"x": 0, "y": 0, "id": "el_1784539283772_luy0j68", "tipo": "grades_table", "ancho": "100%", "bordes": true, "columnas": [{"id": "num", "ancho": 30, "nombre": "N", "campo_dato": null}, {"id": "cedula", "ancho": 70, "nombre": "CÉDULA", "campo_dato": "student.cedula"}, {"id": "nombre", "ancho": 180, "nombre": "NOMBRE Y APELLIDO", "campo_dato": "student.full_name"}, {"id": "l1", "ancho": 60, "nombre": "LAPSO 1", "campo_dato": "grades.lapso1"}, {"id": "l2", "ancho": 60, "nombre": "LAPSO 2", "campo_dato": "grades.lapso2"}, {"id": "l3", "ancho": 60, "nombre": "LAPSO 3", "campo_dato": "grades.lapso3"}, {"id": "final", "ancho": 60, "nombre": "NOTA FINAL", "campo_dato": "grades.final"}, {"id": "estado", "ancho": 60, "nombre": "ESTADO", "campo_dato": "grades.status"}], "estilo_cuerpo": {"fuente": "Arial", "tamano": 9, "fondo_par": "#F3F4F6", "alineacion": "center", "fondo_impar": "#FFFFFF"}, "alternar_colores": true, "estilo_encabezado": {"fondo": "#1E3A8A", "fuente": "Arial", "tamano": 9, "negrita": true, "color_texto": "#FFFFFF"}}]}, "footer": {"altura": 20, "elementos": [{"x": 244, "y": 10, "id": "el_1784539297230_hm4ea4k", "tipo": "signature", "ancho": 150, "fuente": "Arial", "tamano": 10, "titulo": "FIRMA"}]}, "header": {"altura": 40, "elementos": [{"x": 100, "y": 0, "id": "el_1784539268669_jt0xk7w", "tipo": "text", "ancho": 200, "estilo": {"color": "#000000", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": true, "alineacion": "center"}, "contenido": "Nuevo texto prueba"}, {"x": -3, "y": 30, "id": "el_1784547657018_t8zwk0x", "tipo": "text", "ancho": 200, "estilo": {"color": "#000000", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": false, "alineacion": "center"}, "contenido": "otro texto de prueba mas"}, {"x": 203, "y": 30, "id": "el_1784547680797_4x10o3k", "tipo": "text", "ancho": 200, "estilo": {"color": "#000000", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": false, "alineacion": "center"}, "contenido": "mas texto de prueba"}, {"x": 23, "y": 26, "id": "el_1784552757913_ux5rfns", "alto": 20, "tipo": "cuadricula", "ancho": 150, "fondo": "transparent", "estilo": {"color": "#000000", "fuente": "Arial", "tamano": 10, "cursiva": false, "negrita": false, "alineacion": "center"}, "contenido": "", "borde_color": "#000000", "borde_estilo": "solid", "borde_grosor": 1}]}}, "orientacion": "portrait"}	\N	f	\N	2026-07-20 09:22:27.959+00	2026-07-20 19:16:55.867+00
\.


--
-- Data for Name: grados_anos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.grados_anos (id_grado, numero, nombre, created_at, updated_at) FROM stdin;
1	1	1er Año	2026-07-18 03:01:09.091+00	2026-07-18 03:01:09.091+00
2	2	2do Año	2026-07-18 03:01:09.444+00	2026-07-18 03:01:09.444+00
3	3	3er Año	2026-07-18 03:01:09.75+00	2026-07-18 03:01:09.75+00
4	4	4to Año	2026-07-18 03:01:10.057+00	2026-07-18 03:01:10.057+00
5	5	5to Año	2026-07-18 03:01:10.362+00	2026-07-18 03:01:10.362+00
\.


--
-- Data for Name: historico_notas_certificadas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.historico_notas_certificadas (id_historico, id_estudiante, id_grado, id_asignatura, id_periodo, id_escala, institucion_origen, created_at, updated_at) FROM stdin;
1	5	3	1	1	1	L.N. Estilita Orozco	2026-07-20 19:20:04.137+00	2026-07-20 19:20:04.137+00
2	5	3	2	1	1	L.N. Estilita Orozco	2026-07-20 19:20:04.627+00	2026-07-20 19:20:04.627+00
3	5	3	3	1	1	L.N. Estilita Orozco	2026-07-20 19:20:05.067+00	2026-07-20 19:20:05.067+00
4	5	3	4	1	1	L.N. Estilita Orozco	2026-07-20 19:20:05.517+00	2026-07-20 19:20:05.517+00
5	5	3	7	1	1	L.N. Estilita Orozco	2026-07-20 19:20:05.969+00	2026-07-20 19:20:05.969+00
6	5	3	8	1	15	L.N. Estilita Orozco	2026-07-20 19:20:07.034+00	2026-07-20 19:20:07.034+00
8	5	3	13	1	15	L.N. Estilita Orozco	2026-07-20 19:20:08.241+00	2026-07-20 19:20:08.241+00
9	5	3	14	1	1	L.N. Estilita Orozco	2026-07-20 19:20:08.702+00	2026-07-20 19:20:08.702+00
10	5	3	15	1	1	L.N. Estilita Orozco	2026-07-20 19:20:09.162+00	2026-07-20 19:20:09.162+00
11	5	3	18	1	1	L.N. Estilita Orozco	2026-07-20 19:20:10.067+00	2026-07-20 19:20:10.067+00
12	5	3	19	1	1	L.N. Estilita Orozco	2026-07-20 19:20:10.527+00	2026-07-20 19:20:10.527+00
13	5	3	26	1	1	L.N. Estilita Orozco	2026-07-20 19:20:11.052+00	2026-07-20 19:20:11.052+00
14	5	3	27	1	1	L.N. Estilita Orozco	2026-07-20 19:20:11.561+00	2026-07-20 19:20:11.561+00
15	5	3	28	1	1	L.N. Estilita Orozco	2026-07-20 19:20:12.141+00	2026-07-20 19:20:12.141+00
7	5	3	9	1	1	L.N. Estilita Orozco	2026-07-20 19:20:07.742+00	2026-07-20 19:20:38.649+00
\.


--
-- Data for Name: horario_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.horario_docente (id_horario, id_asignatura, id_seccion, id_dia, id_bloque, id_aula, id_periodo, created_at, updated_at, id_docente) FROM stdin;
205	2	1	1	2	1	1	2026-07-18 06:11:32.04+00	2026-07-18 06:11:32.04+00	5
208	21	1	2	1	8	1	2026-07-20 14:10:59.487+00	2026-07-20 14:10:59.487+00	4
209	18	2	2	3	7	1	2026-07-20 17:20:35.834+00	2026-07-20 17:20:35.834+00	5
204	18	1	1	1	1	1	2026-07-18 06:11:11.747+00	2026-07-20 17:35:02.419+00	6
207	18	1	2	2	1	1	2026-07-18 06:40:58.626+00	2026-07-20 17:35:12.806+00	6
206	3	1	1	3	1	1	2026-07-18 06:11:42.629+00	2026-07-20 17:35:21.489+00	4
210	22	1	1	5	1	1	2026-07-20 17:36:52.502+00	2026-07-20 17:36:52.502+00	6
211	23	1	1	6	1	1	2026-07-20 17:38:19.384+00	2026-07-20 17:38:19.384+00	5
212	24	1	1	7	1	1	2026-07-20 17:40:30.071+00	2026-07-20 17:40:30.071+00	7
213	3	1	1	1	7	3	2026-07-21 22:57:15.864+00	2026-07-21 22:57:15.864+00	5
214	18	2	2	1	6	3	2026-07-21 22:58:12.762+00	2026-07-21 22:58:12.762+00	4
\.


--
-- Data for Name: justificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.justificaciones (id_justificacion, id_asistencia, motivo, soporte_digital, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: justificaciones_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.justificaciones_estudiante (id_justificacion_est, id_asistencia_est, motivo, soporte_digital, created_at, updated_at) FROM stdin;
1	12	le dolia el estomago y se tuvo que ir	\N	2026-07-18 08:15:25.855+00	2026-07-18 08:15:25.855+00
2	13	algo de texto extra	\N	2026-07-18 08:16:19.675+00	2026-07-18 08:16:19.675+00
3	15	nada pa, no se puede con todo al mismo tiempo :v	\N	2026-07-18 08:47:43.4+00	2026-07-18 08:47:43.4+00
4	17	tampoco se pudo compa	\N	2026-07-18 08:49:22.631+00	2026-07-18 08:49:22.631+00
5	19	ay carnal	\N	2026-07-18 09:00:50.958+00	2026-07-18 09:00:50.958+00
6	20	prueba justificacion	\N	2026-07-18 09:01:44.492+00	2026-07-18 09:01:44.492+00
7	21	aaaaaaaaaaaaaaaaaaa	\N	2026-07-18 09:08:36.98+00	2026-07-18 09:08:36.98+00
8	22	prueba anterior	\N	2026-07-18 09:09:28.684+00	2026-07-18 09:09:28.684+00
9	23	espero que sea la ultima pruba que realice al respecto	\N	2026-07-18 09:23:57.178+00	2026-07-18 09:23:57.178+00
10	16	se callo de la bicicleta y no puede asistir	\N	2026-07-18 10:09:17.41+00	2026-07-18 10:09:17.41+00
11	26	Tiene gripe	\N	2026-07-20 15:59:46.878+00	2026-07-20 15:59:46.878+00
12	34	Cita medica	\N	2026-07-20 16:19:52.813+00	2026-07-20 16:19:52.813+00
13	53	comprobante medico entregado	\N	2026-07-20 21:54:56.33+00	2026-07-20 21:54:56.33+00
14	77	Recipe medico	\N	2026-07-21 13:37:11.185+00	2026-07-21 13:37:11.185+00
15	78	No llego por fuertes lluvias	\N	2026-07-21 13:37:32.76+00	2026-07-21 13:37:32.76+00
16	115	Cita medica	\N	2026-07-21 19:14:15.206+00	2026-07-21 19:14:15.206+00
\.


--
-- Data for Name: login_audit; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.login_audit (id, username, ip_address, user_agent, success, created_at) FROM stdin;
1	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-17 22:02:59.334+00
2	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:03:06.544+00
3	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:04:32.345+00
4	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:10:17.339+00
5	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:28:29.418+00
6	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:28:57.99+00
7	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:29:45.776+00
8	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-17 22:30:12.857+00
9	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:31:00.103+00
10	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:40:48.035+00
11	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:42:43.744+00
12	v-10234567	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:43:31.665+00
13	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:48:14.194+00
14	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 22:57:18.318+00
15	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:05:36.94+00
16	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:06:04.083+00
17	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:12:01.29+00
18	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:16:14.836+00
19	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-17 23:16:42.928+00
20	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:16:47.574+00
21	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:22:37.413+00
22	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:50:37.91+00
23	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:51:28.15+00
24	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-17 23:51:43.844+00
25	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 01:42:21.643+00
26	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 01:43:18.013+00
27	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:11:15.432+00
28	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:25:11.035+00
29	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:25:32.73+00
30	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:25:47.394+00
31	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:28:21.566+00
32	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:29:00.615+00
33	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 02:33:17.537+00
34	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 03:17:07.159+00
35	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 03:55:35.175+00
36	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:06:18.166+00
37	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:06:46.969+00
38	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:07:50.571+00
39	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:08:41.05+00
40	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:29:12.306+00
41	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 04:54:57.786+00
42	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 05:01:11.214+00
43	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 05:39:22.525+00
44	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 05:47:08.083+00
45	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 06:02:14.598+00
46	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 06:36:30.624+00
47	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 06:48:27.299+00
48	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-18 06:53:20.519+00
49	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 06:53:26.71+00
50	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 06:58:18.287+00
51	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 07:32:32.203+00
52	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 08:00:02.982+00
53	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 08:48:47.274+00
54	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 09:00:07.633+00
55	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 09:08:19.906+00
56	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 09:23:08.449+00
57	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 09:29:27.379+00
58	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 09:38:21.363+00
59	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 10:06:48.234+00
60	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 14:09:20.801+00
61	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 15:17:58.064+00
62	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 15:45:02.977+00
63	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 15:51:09.737+00
64	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 15:54:43.385+00
65	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:05:17.333+00
66	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:06:38.674+00
67	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:07:50.592+00
68	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:09:51.103+00
69	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:11:55.887+00
70	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:30:22.455+00
71	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.129.1 Chrome/148.0.7778.280 Electron/42.6.0 Safari/537.36	t	2026-07-18 16:39:50.509+00
72	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:42:18.039+00
73	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:45:03.586+00
74	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:46:51.083+00
75	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 16:49:59.76+00
76	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 19:02:40.606+00
77	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 19:24:19.592+00
78	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 19:48:21+00
79	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 20:11:00.336+00
80	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 20:23:23.052+00
81	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 20:29:50.482+00
82	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 20:52:41.297+00
83	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 20:59:41.02+00
84	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:14:18.501+00
85	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:22:18.017+00
86	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:23:52.091+00
87	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:34:47.975+00
88	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:34:51.988+00
89	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:38:35.187+00
90	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:42:08.576+00
91	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:43:15.931+00
92	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:43:23.313+00
93	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:50:02.848+00
94	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:52:52.837+00
95	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 21:55:33.961+00
96	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 22:33:19.128+00
97	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 22:54:36.913+00
98	admin	::1	Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-18 23:43:08.347+00
99	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 23:43:23.025+00
100	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 23:50:08.535+00
101	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-18 23:52:47.051+00
102	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-18 23:52:52.82+00
103	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 00:39:46.978+00
104	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:04:13.237+00
105	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:15:21.706+00
106	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:16:20.605+00
107	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:19:34.862+00
108	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:24:40.17+00
109	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:26:02.704+00
110	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:30:52.735+00
111	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:31:28.987+00
112	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:50:44.821+00
113	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 01:55:58.486+00
114	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 02:19:39.083+00
115	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 02:37:13.492+00
116	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 02:42:10.572+00
117	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 03:51:49.879+00
118	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 14:59:47.876+00
119	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-19 15:08:36.154+00
120	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 15:09:05.606+00
121	admin	10.196.47.130	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-19 15:30:53.975+00
122	admin	10.196.26.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-19 15:33:11.26+00
123	admin	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 15:38:38.939+00
124	gregory	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 15:39:28.783+00
125	admin	10.196.47.130	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	t	2026-07-19 15:39:40.35+00
126	gregory	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 15:40:59.965+00
127	admin	10.196.26.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-19 15:41:07.136+00
128	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 15:49:43.166+00
129	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 16:04:10.716+00
130	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 16:43:15.603+00
131	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 16:57:39.504+00
132	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:21:28.302+00
133	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:23:38.752+00
134	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:35:19.801+00
135	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:35:43.867+00
136	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:39:25.733+00
137	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-19 17:51:24.163+00
138	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-19 17:51:33.282+00
139	coordinador	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:33:52.428+00
140	docente	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:39:58.556+00
141	control	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:44:48.621+00
142	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:47:30.265+00
143	control	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:47:48.926+00
144	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 01:54:59.846+00
145	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 04:55:25.348+00
146	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 05:41:05.998+00
147	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 05:42:13.994+00
148	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 05:55:40.84+00
149	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 05:56:46.381+00
150	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 06:01:45.633+00
151	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 06:15:40.729+00
152	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 08:50:26.466+00
153	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 09:11:45.161+00
154	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 09:20:54.531+00
155	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 09:53:59.311+00
156	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 12:53:40.104+00
157	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 13:24:02.102+00
158	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-20 13:27:51.113+00
159	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 13:27:55.174+00
160	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:03:25.949+00
161	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:03:54.358+00
162	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:07:51.348+00
163	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:12:10.479+00
164	coordinador	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:12:55.947+00
165	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:21:02.062+00
166	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:21:18.062+00
167	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:21:30.581+00
168	docente	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:22:22.66+00
169	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:24:09.246+00
170	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:26:30.113+00
171	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:32:10.185+00
172	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:34:56.928+00
173	docente	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:37:02.477+00
174	ana.lopez	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:41:30.641+00
175	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:42:46.261+00
176	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:47:47.233+00
177	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:48:00.251+00
178	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:48:10.161+00
179	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 14:48:19.878+00
180	ana.lopez	10.196.47.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 15:38:08.176+00
181	admin	10.196.26.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 15:42:58.895+00
182	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 15:59:03.092+00
183	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:02:57.096+00
184	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:18:33.735+00
185	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:20:42.508+00
186	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:37:38.496+00
187	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:40:20.605+00
188	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 16:50:12.666+00
189	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:06:59.256+00
190	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:09:46.915+00
191	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:11:11.818+00
192	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:12:08.342+00
193	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:12:20.09+00
194	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:12:47.955+00
195	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:14:47.65+00
196	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:19:36.721+00
197	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:20:56.329+00
198	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:29:17.891+00
199	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:30:18.998+00
200	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:33:03.037+00
201	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:36:20.429+00
202	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:36:40.057+00
203	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:37:51.64+00
204	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-20 17:37:57.488+00
205	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-20 17:38:10.103+00
206	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 17:38:16.054+00
207	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 18:24:58.94+00
208	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 18:43:50.847+00
209	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-20 19:02:05.92+00
210	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:02:21.98+00
211	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:06:31.516+00
212	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:10:22.337+00
213	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:16:26.471+00
214	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:18:31.328+00
215	admin	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:29:05.718+00
216	ana.lopez	10.194.128.129	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 19:29:18.862+00
217	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 21:08:35.185+00
218	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 21:12:02.911+00
219	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 21:13:03.182+00
220	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 21:27:53.81+00
221	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 21:36:22.958+00
222	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 10:31:49.157+00
223	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:07:01.878+00
224	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:11:07.037+00
225	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:13:40.398+00
226	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:31:04.33+00
227	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:34:01.03+00
228	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:41:45.661+00
229	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-20 11:48:05.583+00
230	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 11:49:04.791+00
231	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 12:03:57.574+00
232	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 12:04:40.306+00
233	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 12:10:17.452+00
234	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 12:15:50.148+00
235	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 12:23:17.601+00
236	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 13:03:15.918+00
237	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 13:27:01.205+00
238	admin	10.196.47.130	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	t	2026-07-21 14:46:06.962+00
239	admin	10.199.230.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 18:25:29.928+00
240	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 18:29:52.551+00
241	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:01:03.473+00
242	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:02:42.615+00
243	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:05:52.863+00
244	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-21 19:06:30.615+00
245	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:06:36.439+00
246	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:07:44.623+00
247	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:08:35.258+00
248	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:31:19.27+00
249	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 19:45:55.848+00
250	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 20:05:13.06+00
251	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 20:29:25.537+00
252	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 21:25:13.215+00
253	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 21:26:14.102+00
254	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 21:26:38.968+00
255	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 22:47:51.453+00
256	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 22:56:30.465+00
257	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 22:56:47.999+00
258	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 22:59:01.68+00
259	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 23:01:52.012+00
260	ana.lopez	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 23:04:23.467+00
261	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-21 23:04:35.81+00
262	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-22 03:45:27.669+00
\.


--
-- Data for Name: materia_pendiente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.materia_pendiente (id_materia_pendiente, id_estudiante, id_asignatura, id_periodo, nota_definitiva, estatus, created_at, updated_at, id_docente_evaluador) FROM stdin;
\.


--
-- Data for Name: matricula; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.matricula (id_matricula, id_estudiante, id_seccion, id_periodo, numero_lista, estatus_matricula, created_at, updated_at) FROM stdin;
1	15	1	1	\N	\N	2026-07-18 03:02:43.889+00	2026-07-18 03:02:43.889+00
2	13	2	1	\N	\N	2026-07-18 03:02:43.97+00	2026-07-18 03:02:43.97+00
3	14	3	1	\N	\N	2026-07-18 03:02:44.047+00	2026-07-18 03:02:44.047+00
4	1	4	1	\N	\N	2026-07-18 03:02:44.124+00	2026-07-18 03:02:44.124+00
5	5	5	1	\N	\N	2026-07-18 03:02:44.202+00	2026-07-18 03:02:44.202+00
6	4	6	1	\N	\N	2026-07-18 03:02:44.279+00	2026-07-18 03:02:44.279+00
7	9	7	1	\N	\N	2026-07-18 03:02:44.357+00	2026-07-18 03:02:44.357+00
8	12	8	1	\N	\N	2026-07-18 03:02:44.436+00	2026-07-18 03:02:44.436+00
9	8	9	1	\N	\N	2026-07-18 03:02:44.522+00	2026-07-18 03:02:44.522+00
10	10	10	1	\N	\N	2026-07-18 03:02:44.6+00	2026-07-18 03:02:44.6+00
11	6	1	1	\N	\N	2026-07-18 03:02:44.681+00	2026-07-18 03:02:44.681+00
12	3	2	1	\N	\N	2026-07-18 03:02:44.768+00	2026-07-18 03:02:44.768+00
13	11	3	1	\N	\N	2026-07-18 03:02:44.846+00	2026-07-18 03:02:44.846+00
14	7	4	1	\N	\N	2026-07-18 03:02:44.923+00	2026-07-18 03:02:44.923+00
15	2	5	1	\N	\N	2026-07-18 03:02:45.002+00	2026-07-18 03:02:45.002+00
16	86	1	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
17	38	1	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
18	41	1	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
19	107	1	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
20	28	1	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
21	31	1	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
22	102	1	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
23	67	1	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
24	125	1	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
25	111	1	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
26	93	1	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
27	121	1	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
28	118	1	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
29	131	1	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
30	82	1	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
31	23	1	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
32	98	1	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
33	65	1	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
34	20	1	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
35	80	1	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
36	75	1	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
37	48	1	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
38	134	1	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
39	60	1	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
40	55	1	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
41	199	2	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
42	251	2	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
43	148	2	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
44	220	2	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
45	163	2	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
46	168	2	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
47	179	2	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
48	145	2	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
49	175	2	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
50	196	2	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
51	210	2	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
52	255	2	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
53	230	2	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
54	160	2	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
55	237	2	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
56	227	2	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
57	248	2	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
58	207	2	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
59	184	2	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
60	246	2	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
61	242	2	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
62	218	2	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
63	156	2	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
64	21	3	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
65	106	3	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
66	92	3	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
67	96	3	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
68	18	3	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
69	77	3	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
70	39	3	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
71	62	3	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
72	52	3	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
73	112	3	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
74	72	3	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
75	59	3	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
76	83	3	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
77	90	3	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
78	50	3	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
79	45	3	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
80	34	3	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
81	70	3	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
82	30	3	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
83	105	3	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
84	194	4	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
85	204	4	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
86	178	4	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
87	153	4	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
88	174	4	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
89	150	4	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
90	236	4	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
91	161	4	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
92	147	4	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
93	203	4	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
94	215	4	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
95	231	4	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
96	223	4	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
97	212	4	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
98	193	4	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
99	183	4	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
100	240	4	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
101	167	4	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
102	171	4	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
103	189	4	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
104	228	4	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
105	56	5	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
106	91	5	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
107	27	5	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
108	138	5	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
109	37	5	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
110	46	5	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
111	17	5	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
112	42	5	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
113	87	5	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
114	142	5	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
115	117	5	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
116	32	5	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
117	108	5	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
118	66	5	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
119	78	5	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
120	136	5	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
121	126	5	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
122	130	5	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
123	133	5	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
124	123	5	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
125	53	5	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
126	103	5	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
127	113	5	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
128	74	5	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
129	64	5	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
130	24	5	1	26	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
131	99	5	1	27	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
132	140	5	1	28	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
133	85	5	1	29	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
134	238	6	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
135	143	6	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
136	191	6	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
137	262	6	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
138	182	6	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
139	260	6	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
140	205	6	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
141	164	6	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
142	149	6	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
143	214	6	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
144	261	6	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
145	225	6	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
146	170	6	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
147	247	6	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
148	229	6	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
149	176	6	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
150	256	6	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
151	187	6	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
152	202	6	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
153	253	6	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
154	222	6	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
155	211	6	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
156	244	6	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
157	198	6	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
158	180	6	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
159	162	6	1	26	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
160	259	6	1	27	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
161	157	6	1	28	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
162	61	7	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
163	71	7	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
164	16	7	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
165	124	7	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
166	57	7	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
167	132	7	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
168	43	7	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
169	128	7	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
170	81	7	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
171	120	7	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
172	33	7	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
173	79	7	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
174	54	7	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
175	29	7	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
176	109	7	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
177	95	7	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
178	89	7	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
179	104	7	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
180	25	7	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
181	100	7	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
182	49	7	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
183	40	7	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
184	119	7	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
185	69	7	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
186	115	7	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
187	190	8	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
188	144	8	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
189	252	8	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
190	234	8	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
191	209	8	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
192	186	8	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
193	165	8	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
194	159	8	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
195	201	8	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
196	226	8	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
197	243	8	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
198	221	8	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
199	257	8	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
200	239	8	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
201	197	8	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
202	208	8	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
203	177	8	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
204	217	8	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
205	151	8	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
206	250	8	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
207	155	8	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
208	172	8	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
209	233	8	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
210	26	9	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
211	36	9	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
212	76	9	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
213	51	9	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
214	101	9	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
215	116	9	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
216	58	9	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
217	94	9	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
218	129	9	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
219	97	9	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
220	88	9	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
221	122	9	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
222	47	9	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
223	63	9	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
224	22	9	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
225	139	9	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
226	73	9	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
227	44	9	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
228	68	9	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
229	84	9	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
230	19	9	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
231	114	9	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
232	127	9	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
233	137	9	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
234	135	9	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
235	141	9	1	26	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
236	110	9	1	27	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
237	35	9	1	28	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
238	173	10	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
239	224	10	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
240	219	10	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
241	195	10	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
242	158	10	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
243	169	10	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
244	200	10	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
245	235	10	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
246	192	10	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
247	146	10	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
248	154	10	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
249	206	10	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
250	166	10	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
251	254	10	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
252	232	10	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
253	216	10	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
254	249	10	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
255	258	10	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
256	185	10	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
257	241	10	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
258	245	10	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
259	188	10	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
260	152	10	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
261	213	10	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
262	181	10	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
263	295	11	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
264	303	11	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
265	334	11	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
266	279	11	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
267	308	11	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
268	317	11	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
269	327	11	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
270	349	11	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
271	293	11	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
272	268	11	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
273	289	11	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
274	344	11	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
275	339	11	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
276	331	11	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
277	313	11	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
278	321	11	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
279	353	11	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
280	284	11	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
281	273	11	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
282	300	11	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
283	278	11	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
284	347	11	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
285	266	11	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
286	275	12	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
287	338	12	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
288	292	12	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
289	324	12	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
290	267	12	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
291	298	12	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
292	336	12	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
293	288	12	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
294	312	12	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
295	318	12	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
296	263	12	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
297	320	12	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
298	329	12	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
299	285	12	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
300	306	12	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
301	282	12	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
302	332	12	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
303	274	12	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
304	302	12	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
305	310	12	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
306	315	13	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
307	296	13	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
308	291	13	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
309	307	13	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
310	323	13	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
311	356	13	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
312	311	13	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
313	342	13	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
314	330	13	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
315	350	13	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
316	346	13	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
317	283	13	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
318	328	13	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
319	305	13	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
320	352	13	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
321	272	13	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
322	281	13	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
323	276	13	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
324	355	13	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
325	322	13	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
326	341	13	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
327	269	13	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
328	265	13	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
329	301	13	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
330	337	13	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
331	290	13	1	26	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
332	287	14	1	1	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
333	316	14	1	2	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
334	299	14	1	3	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
335	326	14	1	4	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
336	345	14	1	5	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
337	280	14	1	6	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
338	304	14	1	7	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
339	348	14	1	8	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
340	297	14	1	9	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
341	319	14	1	10	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
342	354	14	1	11	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
343	358	14	1	12	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
344	271	14	1	13	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
345	309	14	1	14	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
346	335	14	1	15	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
347	343	14	1	16	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
348	357	14	1	17	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
349	351	14	1	18	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
350	340	14	1	19	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
351	277	14	1	20	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
352	264	14	1	21	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
353	314	14	1	22	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
354	294	14	1	23	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
355	270	14	1	24	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
356	286	14	1	25	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
357	333	14	1	26	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
358	325	14	1	27	Regular	2026-07-18 23:11:56.036426+00	2026-07-18 23:11:56.036426+00
\.


--
-- Data for Name: momentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.momentos (id_momento, id_periodo, descripcion, created_at, updated_at, estatus) FROM stdin;
2	1	Segundo Lapso	2026-07-18 18:15:42.905+00	2026-07-18 18:15:42.905+00	Abierto
3	1	Tercer Lapso	2026-07-18 18:16:22.415+00	2026-07-18 18:16:22.415+00	Abierto
4	3	Lapso 1	2026-07-20 14:03:40.802+00	2026-07-20 14:03:40.802+00	Abierto
5	3	Lapso 2	2026-07-20 14:03:40.802+00	2026-07-20 14:03:40.802+00	Abierto
6	3	Lapso 3	2026-07-20 14:03:40.802+00	2026-07-20 14:03:40.802+00	Abierto
1	1	Primer Lapso	2026-07-18 17:54:35.91+00	2026-07-21 20:30:04.09+00	Abierto
7	4	Lapso 1	2026-07-21 22:47:18.209+00	2026-07-21 22:47:18.209+00	Abierto
8	4	Lapso 2	2026-07-21 22:47:18.209+00	2026-07-21 22:47:18.209+00	Abierto
9	4	Lapso 3	2026-07-21 22:47:18.209+00	2026-07-21 22:47:18.209+00	Abierto
\.


--
-- Data for Name: notas_parciales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notas_parciales (id_nota, id_matricula, id_evaluacion, id_escala, created_at, updated_at) FROM stdin;
1	11	1	20	2026-07-18 18:18:21.178+00	2026-07-18 18:18:21.178+00
2	1	1	10	2026-07-18 18:18:21.63+00	2026-07-18 18:18:21.63+00
3	34	1	1	2026-07-19 02:39:57.405+00	2026-07-19 02:39:57.405+00
4	31	1	1	2026-07-19 02:39:58.124+00	2026-07-19 02:39:58.124+00
5	20	1	1	2026-07-19 02:39:58.791+00	2026-07-19 02:39:58.791+00
6	21	1	1	2026-07-19 02:39:59.46+00	2026-07-19 02:39:59.46+00
7	17	1	1	2026-07-19 02:40:00.139+00	2026-07-19 02:40:00.139+00
8	18	1	1	2026-07-19 02:40:00.809+00	2026-07-19 02:40:00.809+00
9	37	1	1	2026-07-19 02:40:01.476+00	2026-07-19 02:40:01.476+00
10	40	1	1	2026-07-19 02:40:02.153+00	2026-07-19 02:40:02.153+00
11	39	1	1	2026-07-19 02:40:02.819+00	2026-07-19 02:40:02.819+00
12	33	1	1	2026-07-19 02:40:03.481+00	2026-07-19 02:40:03.481+00
13	23	1	1	2026-07-19 02:40:04.15+00	2026-07-19 02:40:04.15+00
14	36	1	1	2026-07-19 02:40:04.822+00	2026-07-19 02:40:04.822+00
15	35	1	1	2026-07-19 02:40:05.484+00	2026-07-19 02:40:05.484+00
16	30	1	1	2026-07-19 02:40:06.148+00	2026-07-19 02:40:06.148+00
17	16	1	1	2026-07-19 02:40:06.812+00	2026-07-19 02:40:06.812+00
18	26	1	1	2026-07-19 02:40:07.484+00	2026-07-19 02:40:07.484+00
19	32	1	1	2026-07-19 02:40:08.146+00	2026-07-19 02:40:08.146+00
20	22	1	1	2026-07-19 02:40:08.813+00	2026-07-19 02:40:08.813+00
21	19	1	1	2026-07-19 02:40:09.486+00	2026-07-19 02:40:09.486+00
22	25	1	1	2026-07-19 02:40:10.147+00	2026-07-19 02:40:10.147+00
23	28	1	1	2026-07-19 02:40:10.818+00	2026-07-19 02:40:10.818+00
24	27	1	1	2026-07-19 02:40:11.484+00	2026-07-19 02:40:11.484+00
25	24	1	1	2026-07-19 02:40:12.173+00	2026-07-19 02:40:12.173+00
26	29	1	11	2026-07-19 02:40:12.854+00	2026-07-19 02:40:12.854+00
27	38	1	1	2026-07-19 02:40:13.518+00	2026-07-19 02:40:13.518+00
28	11	2	15	2026-07-19 15:12:06.734+00	2026-07-19 15:12:06.734+00
29	1	2	10	2026-07-19 15:12:07.451+00	2026-07-19 15:12:07.451+00
30	34	2	13	2026-07-19 15:12:08.134+00	2026-07-19 15:12:08.134+00
31	31	2	10	2026-07-19 15:12:08.813+00	2026-07-19 15:12:08.813+00
32	20	2	15	2026-07-19 15:12:09.49+00	2026-07-19 15:12:09.49+00
33	21	2	10	2026-07-19 15:12:10.186+00	2026-07-19 15:12:10.186+00
34	17	2	8	2026-07-19 15:12:10.89+00	2026-07-19 15:12:10.89+00
35	18	2	5	2026-07-19 15:12:11.583+00	2026-07-19 15:12:11.583+00
36	37	2	4	2026-07-19 15:12:12.259+00	2026-07-19 15:12:12.259+00
37	40	2	15	2026-07-19 15:12:12.946+00	2026-07-19 15:12:12.946+00
39	1	3	14	2026-07-19 15:12:14.304+00	2026-07-19 15:12:14.304+00
40	34	3	20	2026-07-19 15:12:14.985+00	2026-07-19 15:12:14.985+00
41	31	3	15	2026-07-19 15:12:15.664+00	2026-07-19 15:12:15.664+00
42	20	3	18	2026-07-19 15:12:16.344+00	2026-07-19 15:12:16.344+00
43	21	3	16	2026-07-19 15:12:17.031+00	2026-07-19 15:12:17.031+00
44	17	3	19	2026-07-19 15:12:17.722+00	2026-07-19 15:12:17.722+00
45	18	3	20	2026-07-19 15:12:18.406+00	2026-07-19 15:12:18.406+00
46	37	3	20	2026-07-19 15:12:19.078+00	2026-07-19 15:12:19.078+00
47	40	3	14	2026-07-19 15:12:19.755+00	2026-07-19 15:12:19.755+00
48	39	2	15	2026-07-19 15:12:20.433+00	2026-07-19 15:12:20.433+00
49	33	2	20	2026-07-19 15:12:21.122+00	2026-07-19 15:12:21.122+00
50	23	2	14	2026-07-19 15:12:21.813+00	2026-07-19 15:12:21.813+00
51	36	2	16	2026-07-19 15:12:22.518+00	2026-07-19 15:12:22.518+00
52	35	2	18	2026-07-19 15:12:23.205+00	2026-07-19 15:12:23.205+00
53	30	2	14	2026-07-19 15:12:23.883+00	2026-07-19 15:12:23.883+00
54	16	2	16	2026-07-19 15:12:24.562+00	2026-07-19 15:12:24.562+00
55	26	2	15	2026-07-19 15:12:25.234+00	2026-07-19 15:12:25.234+00
56	32	2	18	2026-07-19 15:12:25.916+00	2026-07-19 15:12:25.916+00
57	22	2	17	2026-07-19 15:12:26.595+00	2026-07-19 15:12:26.595+00
58	39	3	20	2026-07-19 15:12:27.267+00	2026-07-19 15:12:27.267+00
59	33	3	20	2026-07-19 15:12:27.943+00	2026-07-19 15:12:27.943+00
60	23	3	20	2026-07-19 15:12:28.635+00	2026-07-19 15:12:28.635+00
61	36	3	20	2026-07-19 15:12:29.307+00	2026-07-19 15:12:29.307+00
62	35	3	20	2026-07-19 15:12:29.972+00	2026-07-19 15:12:29.972+00
63	30	3	20	2026-07-19 15:12:30.648+00	2026-07-19 15:12:30.648+00
64	16	3	20	2026-07-19 15:12:31.325+00	2026-07-19 15:12:31.325+00
65	26	3	14	2026-07-19 15:12:32.015+00	2026-07-19 15:12:32.015+00
66	32	3	16	2026-07-19 15:12:32.703+00	2026-07-19 15:12:32.703+00
67	22	3	20	2026-07-19 15:12:33.378+00	2026-07-19 15:12:33.378+00
68	19	2	20	2026-07-19 15:12:34.063+00	2026-07-19 15:12:34.063+00
69	25	2	20	2026-07-19 15:12:34.839+00	2026-07-19 15:12:34.839+00
70	28	2	20	2026-07-19 15:12:35.514+00	2026-07-19 15:12:35.514+00
71	27	2	20	2026-07-19 15:12:36.216+00	2026-07-19 15:12:36.216+00
72	24	2	20	2026-07-19 15:12:36.893+00	2026-07-19 15:12:36.893+00
73	29	2	20	2026-07-19 15:12:37.581+00	2026-07-19 15:12:37.581+00
74	38	2	20	2026-07-19 15:12:38.26+00	2026-07-19 15:12:38.26+00
75	19	3	14	2026-07-19 15:12:38.934+00	2026-07-19 15:12:38.934+00
76	25	3	15	2026-07-19 15:12:39.612+00	2026-07-19 15:12:39.612+00
77	28	3	15	2026-07-19 15:12:40.293+00	2026-07-19 15:12:40.293+00
78	27	3	15	2026-07-19 15:12:40.986+00	2026-07-19 15:12:40.986+00
79	24	3	14	2026-07-19 15:12:41.661+00	2026-07-19 15:12:41.661+00
80	29	3	13	2026-07-19 15:12:42.338+00	2026-07-19 15:12:42.338+00
81	38	3	10	2026-07-19 15:12:43.031+00	2026-07-19 15:12:43.031+00
38	11	3	16	2026-07-19 15:12:13.628+00	2026-07-20 01:41:02.274+00
\.


--
-- Data for Name: observaciones_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.observaciones_estudiante (id_observacion, texto, gravedad, id_usuario_crea, created_at, updated_at) FROM stdin;
1	toce mucho	Bajo	17	2026-07-18 09:32:31.973+00	2026-07-18 09:32:31.973+00
2	se durmio al final de la clase	Bajo	17	2026-07-18 09:44:34.85+00	2026-07-18 09:44:34.85+00
3	tiene diarrea	Bajo	17	2026-07-18 10:09:59.181+00	2026-07-18 10:09:59.181+00
4	Se la paso la clase en la cancha jugando.	Moderado	5	2026-07-20 21:55:21.848+00	2026-07-20 21:55:21.848+00
\.


--
-- Data for Name: periodos_escolares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.periodos_escolares (id_periodo, nombre, estatus, fecha_inicio, fecha_fin, created_at, updated_at) FROM stdin;
2	2025-2026	Cerrado	2025-09-01	2026-08-31	2026-07-18 04:37:45.566+00	2026-07-20 14:08:08.612+00
4	2028-2029	Planificación	2028-09-01	2029-08-31	2026-07-21 22:47:18.054+00	2026-07-21 22:47:18.054+00
1	2026-2027	Cerrado	2026-07-01	2027-08-31	2026-07-18 02:40:06.362+00	2026-07-21 22:54:56.628+00
3	2027-2028	Activo	2027-09-01	2028-08-31	2026-07-20 14:03:40.639+00	2026-07-21 22:55:08.859+00
\.


--
-- Data for Name: plan_estudio; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.plan_estudio (id_plan, id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at, id_tipo_plan) FROM stdin;
47	1	13	CRP1	9	2026-07-18 22:12:34.517+00	2026-07-18 22:12:34.517+00	1
48	2	13	CRP2	9	2026-07-18 22:12:34.653+00	2026-07-18 22:12:34.653+00	1
21	3	9	BIO3	5	2026-07-18 05:31:47.007176+00	2026-07-18 22:12:34.771+00	1
22	3	14	FIS3	6	2026-07-18 05:31:47.007176+00	2026-07-18 22:12:34.9+00	1
23	3	15	QUI3	7	2026-07-18 05:31:47.007176+00	2026-07-18 22:12:35.014+00	1
24	3	7	GHC3	8	2026-07-18 05:31:47.007176+00	2026-07-18 22:12:35.126+00	1
49	3	8	OYC3	9	2026-07-18 22:12:35.234+00	2026-07-18 22:12:35.234+00	1
50	3	13	CRP3	10	2026-07-18 22:12:35.355+00	2026-07-18 22:12:35.355+00	1
51	5	13	CRP5	12	2026-07-18 22:12:37.118+00	2026-07-18 22:12:37.118+00	1
52	1	18	CSL1	1	2026-07-18 22:21:33.279+00	2026-07-18 22:21:33.279+00	2
53	1	2	ING1	2	2026-07-18 22:21:33.397+00	2026-07-18 22:21:33.397+00	2
54	1	3	MAT1	3	2026-07-18 22:21:33.509+00	2026-07-18 22:21:33.509+00	2
55	1	21	EDN1	4	2026-07-18 22:21:33.624+00	2026-07-18 22:21:33.624+00	2
56	1	22	HDV1	5	2026-07-18 22:21:33.739+00	2026-07-18 22:21:33.739+00	2
57	1	23	GEG1	6	2026-07-18 22:21:33.852+00	2026-07-18 22:21:33.852+00	2
58	1	24	FFC1	7	2026-07-18 22:21:33.967+00	2026-07-18 22:21:33.967+00	2
59	1	19	EFD1	8	2026-07-18 22:21:34.077+00	2026-07-18 22:21:34.077+00	2
60	1	20	EDA1	9	2026-07-18 22:21:34.191+00	2026-07-18 22:21:34.191+00	2
61	2	18	CSL2	1	2026-07-18 22:21:34.315+00	2026-07-18 22:21:34.315+00	2
62	2	2	ING2	2	2026-07-18 22:21:34.427+00	2026-07-18 22:21:34.427+00	2
63	2	3	MAT2	3	2026-07-18 22:21:34.541+00	2026-07-18 22:21:34.541+00	2
64	2	25	EPS2	4	2026-07-18 22:21:34.654+00	2026-07-18 22:21:34.654+00	2
65	2	22	HDV2	5	2026-07-18 22:21:34.785+00	2026-07-18 22:21:34.785+00	2
66	2	26	GDV2	6	2026-07-18 22:21:34.91+00	2026-07-18 22:21:34.91+00	2
67	2	24	FFC2	7	2026-07-18 22:21:35.042+00	2026-07-18 22:21:35.042+00	2
68	2	19	EFD2	8	2026-07-18 22:21:35.162+00	2026-07-18 22:21:35.162+00	2
69	2	20	EDA2	9	2026-07-18 22:21:35.276+00	2026-07-18 22:21:35.276+00	2
70	3	18	CSL3	1	2026-07-18 22:21:35.383+00	2026-07-18 22:21:35.383+00	2
71	3	2	ING3	2	2026-07-18 22:21:35.495+00	2026-07-18 22:21:35.495+00	2
72	3	3	MAT3	3	2026-07-18 22:21:35.61+00	2026-07-18 22:21:35.61+00	2
73	3	27	CBI3	4	2026-07-18 22:21:35.717+00	2026-07-18 22:21:35.717+00	2
74	3	14	FIS3	5	2026-07-18 22:21:35.829+00	2026-07-18 22:21:35.829+00	2
75	3	15	QUI3	6	2026-07-18 22:21:35.937+00	2026-07-18 22:21:35.937+00	2
76	3	28	CAB3	7	2026-07-18 22:21:36.055+00	2026-07-18 22:21:36.055+00	2
77	3	26	GDV3	8	2026-07-18 22:21:36.177+00	2026-07-18 22:21:36.177+00	2
78	3	19	EFD3	9	2026-07-18 22:21:36.284+00	2026-07-18 22:21:36.284+00	2
79	4	18	CSL4	1	2026-07-18 22:21:36.39+00	2026-07-18 22:21:36.39+00	2
80	4	2	ING4	2	2026-07-18 22:21:36.5+00	2026-07-18 22:21:36.5+00	2
81	4	3	MAT4	3	2026-07-18 22:21:36.609+00	2026-07-18 22:21:36.609+00	2
82	4	27	CBI4	4	2026-07-18 22:21:36.719+00	2026-07-18 22:21:36.719+00	2
83	4	14	FIS4	5	2026-07-18 22:21:36.827+00	2026-07-18 22:21:36.827+00	2
84	4	15	QUI4	6	2026-07-18 22:21:36.938+00	2026-07-18 22:21:36.938+00	2
85	4	29	HCV4	7	2026-07-18 22:21:37.046+00	2026-07-18 22:21:37.046+00	2
86	4	30	IPM4	8	2026-07-18 22:21:37.161+00	2026-07-18 22:21:37.161+00	2
87	4	19	EFD4	9	2026-07-18 22:21:37.293+00	2026-07-18 22:21:37.293+00	2
1	1	1	CAS1	1	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
2	1	2	ING1	2	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
3	1	3	MAT1	3	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
4	1	4	EDF1	4	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
5	1	5	AYP1	5	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
6	1	6	CSN1	6	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
7	1	7	GHC1	7	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
8	1	8	OYC1	8	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00	1
9	2	1	CAS2	1	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
10	2	2	ING2	2	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
11	2	3	MAT2	3	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
12	2	4	EDF2	4	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
13	2	5	AYP2	5	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
14	2	6	CSN2	6	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
15	2	7	GHC2	7	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
16	2	8	OYC2	8	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00	1
17	3	1	CAS3	1	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00	1
18	3	2	ING3	2	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00	1
19	3	3	MAT3	3	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00	1
20	3	4	EDF3	4	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00	1
25	4	1	CAS4	1	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00	1
26	4	2	ING4	2	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00	1
27	4	3	MAT4	3	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00	1
28	4	4	EDF4	4	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00	1
36	5	1	CAS5	1	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00	1
37	5	2	ING5	2	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00	1
38	5	3	MAT5	3	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00	1
39	5	4	EDF5	4	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00	1
29	4	9	BIO4	5	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:35.475+00	1
30	4	14	FIS4	6	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:35.601+00	1
31	4	15	QUI4	7	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:35.713+00	1
32	4	7	GHC4	8	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:35.823+00	1
33	4	16	FSN4	9	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:36.004+00	1
34	4	8	OYC4	10	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:36.113+00	1
35	4	13	CRP4	11	2026-07-18 05:31:47.083204+00	2026-07-18 22:12:36.223+00	1
40	5	9	BIO5	5	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.34+00	1
41	5	14	FIS5	6	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.445+00	1
42	5	15	QUI5	7	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.57+00	1
43	5	17	CDT5	8	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.674+00	1
44	5	7	GHC5	9	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.792+00	1
45	5	16	FSN5	10	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:36.904+00	1
46	5	8	OYC5	11	2026-07-18 05:31:47.161343+00	2026-07-18 22:12:37.009+00	1
88	5	18	CSL5	1	2026-07-18 22:21:37.401+00	2026-07-18 22:21:37.401+00	2
89	5	2	ING5	2	2026-07-18 22:21:37.51+00	2026-07-18 22:21:37.51+00	2
90	5	3	MAT5	3	2026-07-18 22:21:37.62+00	2026-07-18 22:21:37.62+00	2
91	5	27	CBI5	4	2026-07-18 22:21:37.731+00	2026-07-18 22:21:37.731+00	2
92	5	14	FIS5	5	2026-07-18 22:21:37.843+00	2026-07-18 22:21:37.843+00	2
93	5	15	QUI5	6	2026-07-18 22:21:37.959+00	2026-07-18 22:21:37.959+00	2
94	5	17	CDT5	7	2026-07-18 22:21:38.07+00	2026-07-18 22:21:38.07+00	2
95	5	31	GEV5	8	2026-07-18 22:21:38.177+00	2026-07-18 22:21:38.177+00	2
96	5	30	IPM5	9	2026-07-18 22:21:38.29+00	2026-07-18 22:21:38.29+00	2
97	5	19	EFD5	10	2026-07-18 22:21:38.409+00	2026-07-18 22:21:38.409+00	2
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.refresh_tokens (id, id_usuario, token_hash, expires_at, created_at, revoked_at) FROM stdin;
1	13	db84b7e5bae2d0654182575418ef47c789a277d197f1a83b8a6c2de47e27963f	2026-07-18 06:03:06.698+00	2026-07-17 22:03:06.698+00	2026-07-17 22:03:24.735+00
2	13	5b6d848aad001693cc14379cf0b055852737835c6c0d8a5ddab84690219d7285	2026-07-18 06:04:32.5+00	2026-07-17 22:04:32.5+00	\N
3	13	7b472ec60d0c7e18376de5d333acd2b21f3d2e2ade58dbb8f3520bd5a97abed4	2026-07-18 06:10:17.5+00	2026-07-17 22:10:17.5+00	2026-07-17 22:25:22.323+00
4	13	1ae946a5d4a082092de2c12f1d10727284bdf5c8218e0f6f713c4e76366c25ee	2026-07-18 06:25:22.553+00	2026-07-17 22:25:22.554+00	\N
5	15	53e587de410643d19166165b7a0c7ba79ad01bf3bbb3bc7a5400525d2b223ae0	2026-07-18 06:28:29.57+00	2026-07-17 22:28:29.57+00	2026-07-17 22:28:39.748+00
6	17	ff5d37a52639ec9e06ab1f86acb563abaf9e585a8c9124a3d03378f9073a1f77	2026-07-18 06:28:58.144+00	2026-07-17 22:28:58.144+00	2026-07-17 22:29:00.63+00
7	17	db92ebb6a01de8b8e13bfac2fd66d19116c41db31c78bd37dd7bf0fcede7ae25	2026-07-18 06:29:45.928+00	2026-07-17 22:29:45.928+00	2026-07-17 22:30:09.278+00
8	17	a71758ed973500558ffb8c871b95ca23d1b845dae199e1b6655650a83ef52bbe	2026-07-18 06:31:00.258+00	2026-07-17 22:31:00.258+00	\N
9	13	a5f4ff6e07c1ce2ffb8507c5e2a22bcfebd220a7570b484c8306b88a30382261	2026-07-18 06:40:48.186+00	2026-07-17 22:40:48.186+00	2026-07-17 22:42:32.657+00
10	17	7946ab00c987e10aea50e47e19b9ed13cae3b319a7c1a31af35fc08aa2953bef	2026-07-18 06:42:43.907+00	2026-07-17 22:42:43.908+00	\N
11	1	ecc9d93a937f12a1230737ad37444446c16816adcc5c6e4a209443a989907a27	2026-07-18 06:43:31.817+00	2026-07-17 22:43:31.817+00	2026-07-17 22:48:08.305+00
12	17	e659c01163058555f7e180e2338283df1f2f16cb83928b5fdbf1b1a488e18d1b	2026-07-18 06:48:14.358+00	2026-07-17 22:48:14.358+00	2026-07-17 22:57:12.813+00
13	17	c6b364c576d9972f6325d37f194aabdcfdcfad2644a175f72782f95b6052add3	2026-07-18 06:57:18.472+00	2026-07-17 22:57:18.472+00	2026-07-17 23:05:30.618+00
14	17	261c50d8ada89c3c83a302b41d563601a286ce3cb8908131699532238ed9665d	2026-07-18 07:05:37.101+00	2026-07-17 23:05:37.101+00	2026-07-17 23:05:50.301+00
15	17	65339e87ab67a064a13729433b0ee5f0bac1a7dbc5583a6d3a86e62a01e93b69	2026-07-18 07:06:04.233+00	2026-07-17 23:06:04.233+00	2026-07-17 23:11:55.614+00
16	17	e2abd17023f069ba539ca23b8138997366955dd3a5971173ebf26a960ebb4064	2026-07-18 07:12:01.449+00	2026-07-17 23:12:01.449+00	\N
17	17	1419a6628560e5ae01daa2c6d2459731aebdaad112645631256cbd3737f5d6f0	2026-07-18 07:16:14.995+00	2026-07-17 23:16:14.995+00	\N
18	13	56affc5de7fa85f71dfc6b040814816c98cfb75bd8ba9ed2d5b39fc8a7984917	2026-07-18 07:16:47.801+00	2026-07-17 23:16:47.803+00	\N
19	13	9a7d1f74fd441c185fa24aae41b5951a2125f49256a4e9c690071bddb8a0ff08	2026-07-18 07:22:37.625+00	2026-07-17 23:22:37.626+00	2026-07-17 23:38:48.971+00
20	13	985a611a210570ff920b19de2c87e55b4ee4d3375914f3b92bea7022e45df01b	2026-07-18 07:38:49.328+00	2026-07-17 23:38:49.328+00	\N
21	17	ce75d3035727f5a78f22e7790c8882571d525f871055f974955ec3df055b2b53	2026-07-18 07:50:38.084+00	2026-07-17 23:50:38.084+00	\N
22	17	486aee33ba9756a2ac27b61da2e2425174a5ccd455280eea739cfa0fd66a831f	2026-07-18 07:51:28.303+00	2026-07-17 23:51:28.303+00	\N
23	17	9e77083c203a93b36e9944f6413c3ffce64323a89a2eafdb2fa14b105f672429	2026-07-18 07:51:43.996+00	2026-07-17 23:51:43.996+00	\N
24	13	008efaba0ad60f23cb20345fade1ef85f57745d37ca47e892b4f0f1201735980	2026-07-18 09:42:21.828+00	2026-07-18 01:42:21.828+00	2026-07-18 01:43:14.115+00
25	13	dc4ae930c6b6593c034f12b3306b9b5c6cdbc28092294048ce5e0ce928fa7410	2026-07-18 09:43:18.181+00	2026-07-18 01:43:18.181+00	2026-07-18 01:58:54.394+00
26	13	aee9c03f9f02db339748798f5c3833bd2463800c7c0c82d2df7fd9e89ebe995d	2026-07-18 09:58:55.098+00	2026-07-18 01:58:55.099+00	\N
27	13	30cf993fcaa05d48890fe6f5506d1601fb0c43c77c58495d5a51a2be6950eebe	2026-07-18 10:11:15.567+00	2026-07-18 02:11:15.567+00	\N
28	13	832aeb453849de418c0efa5806f2bed4faedac1fc304ac04b5e01300e0faccaa	2026-07-18 10:25:11.189+00	2026-07-18 02:25:11.189+00	2026-07-18 02:25:25.093+00
29	13	391d351085fb988006be3abc9a1a881eb9c803631343d337ca706e54b74cc1a0	2026-07-18 10:25:32.866+00	2026-07-18 02:25:32.866+00	\N
30	13	cc306b72478ec221ec1d5cec1cdb7d6c0f404be7022ec570d60c26f19e9596a6	2026-07-18 10:25:47.518+00	2026-07-18 02:25:47.518+00	\N
31	13	275d5e3435206542b16d1c96511b225eed52486f617cb18fd075b61d6481198e	2026-07-18 10:28:21.738+00	2026-07-18 02:28:21.738+00	2026-07-18 02:32:16.086+00
32	13	8b35696f2d9c4e6d51760305f23bfdcb0bdd334fbbc9a249354f22387d4db785	2026-07-18 10:29:00.759+00	2026-07-18 02:29:00.759+00	2026-07-18 02:33:46.578+00
33	13	dc692ffb5d6dceaa8db7fc0db5aee200dff07414a7444d486d3991863a94339f	2026-07-18 10:33:17.699+00	2026-07-18 02:33:17.699+00	2026-07-18 03:12:09.306+00
36	13	9e832c2047abe14281fe5b4ea002cd8c046c39f9fcadea8b012e139643040eae	2026-07-18 11:17:07.331+00	2026-07-18 03:17:07.331+00	\N
35	13	42f05c70a3205a45408d121bb2cb8b2d8c0d2d8e3ce0e1ce325922bfcda7a3cb	2026-07-18 11:12:09.562+00	2026-07-18 03:12:09.562+00	2026-07-18 03:31:52.751+00
37	13	6aa4b45c4620994b3aaee089bf7931ac7e628fc339b02af65382fafdbd4ffb68	2026-07-18 11:31:53+00	2026-07-18 03:31:53+00	2026-07-18 03:41:54.352+00
38	13	a75fffbbe3e8000b2fb378e323b21f9cb09617706ba3a1a020bbb5642317b919	2026-07-18 11:55:35.339+00	2026-07-18 03:55:35.339+00	2026-07-18 03:55:44.836+00
39	17	1c37eb3409f1a2e2102700b30bcc12d494b178cb758eacd9fa6c4657401e4d72	2026-07-18 12:06:18.341+00	2026-07-18 04:06:18.341+00	\N
40	13	9fa898525c7f169c29779e8247e49777e79098755367012111d72d4fd096dcf9	2026-07-18 12:06:47.133+00	2026-07-18 04:06:47.133+00	2026-07-18 04:07:44.772+00
42	13	c21c0e4f651d102d5816e64c72a2f8df3567c880cc970ebe54dc62d3f9cd279b	2026-07-18 12:08:41.216+00	2026-07-18 04:08:41.216+00	2026-07-18 04:26:42.249+00
43	13	d670909a88cc441864e7db968f6f630f766f6a2957a9aff7686a29d94b94f1d9	2026-07-18 12:26:42.483+00	2026-07-18 04:26:42.483+00	\N
41	17	eba4ff63abb7de5426ce9cc81d4ae479306a7d4fcb59ac0a6633d04ec05282fa	2026-07-18 12:07:50.734+00	2026-07-18 04:07:50.734+00	2026-07-18 04:37:09.986+00
44	13	f9b1246ece900a4f4ad9d4e89232439a2e323550985c149030d263a41243d16c	2026-07-18 12:29:12.483+00	2026-07-18 04:29:12.483+00	2026-07-18 04:45:44.164+00
34	13	0827c8e73565d2dc59b80d0c28326d04db55b0d7f26ea6e201982a87ca3198a6	2026-07-18 10:33:46.772+00	2026-07-18 02:33:46.772+00	2026-07-18 04:47:22.811+00
45	17	109a6f4b91834fe6a089b3151d94b8b0bb66c76a4be67e9b3895408c55d0838f	2026-07-18 12:37:10.256+00	2026-07-18 04:37:10.257+00	2026-07-18 04:53:54.466+00
47	17	ed81c23a4022da7b20b9463e95a3998a5baaab1d869f8e8463fd1d50d6ffbe58	2026-07-18 12:53:54.695+00	2026-07-18 04:53:54.695+00	2026-07-18 04:54:48.571+00
48	17	b2e99211b5f697a2dae52e35a20e26293677bc234583671c63b1f152b9832ee9	2026-07-18 12:54:58.007+00	2026-07-18 04:54:58.007+00	2026-07-18 05:00:56.159+00
46	13	1b4779edc3a8870761e45ee63448decddcedcb71e8383d919071fa5704ad72eb	2026-07-18 12:45:44.394+00	2026-07-18 04:45:44.394+00	2026-07-18 05:04:15.655+00
49	17	e92a436906e758d80230387bfb26eb8a40a33909b7646917ba44c347e5c80757	2026-07-18 13:01:11.365+00	2026-07-18 05:01:11.365+00	2026-07-18 05:29:25.102+00
51	17	368ae741cf6eae535770600e505a35cf373bd9c0d02d080a44813513b8cab36d	2026-07-18 13:29:25.338+00	2026-07-18 05:29:25.338+00	\N
50	13	6f9c276ab9c23018ed0c5c1dc277066707c123680b7c7d695812d8616774ee09	2026-07-18 13:04:15.892+00	2026-07-18 05:04:15.892+00	2026-07-18 05:34:15.819+00
52	13	0cc197d2b689848ea6c0a195e936790efc50e57259a23976fec286ebca20e461	2026-07-18 13:34:16.07+00	2026-07-18 05:34:16.07+00	2026-07-18 05:34:17.299+00
55	13	90ad9a4b4b177c0660b2be12ab8b05119e9ea7e6961a2208a130a92de8a538b1	2026-07-18 13:47:08.224+00	2026-07-18 05:47:08.224+00	\N
53	13	aaf10971cb95dc65dc61da9b9f05421d0d66c2acc3401e746ed254479fe13063	2026-07-18 13:34:17.529+00	2026-07-18 05:34:17.529+00	2026-07-18 05:49:59.909+00
56	13	723a419a7c7aaa37426d520fb053517fd8a4ede266c675ae2b3675ec655cbe5e	2026-07-18 13:50:00.158+00	2026-07-18 05:50:00.159+00	2026-07-18 05:50:01.17+00
57	13	e6d67aea511ffa85e10162cdbb828d377f625766c835cc061b87edd63fcf5736	2026-07-18 13:50:01.523+00	2026-07-18 05:50:01.524+00	\N
54	17	d4915a73a1ed29ca534391a9eaadb5ef43a193fb040d861201e3e58371ba5555	2026-07-18 13:39:22.684+00	2026-07-18 05:39:22.684+00	2026-07-18 06:01:23.87+00
58	17	8bdc08e738dd995319207b49b1b50e7a5cfa7c2981799c08edcbdcbf81ff6d90	2026-07-18 14:01:24.096+00	2026-07-18 06:01:24.097+00	2026-07-18 06:01:26.889+00
59	17	e353ca99908eac1bc7f3e40053f542fd1c7a804d412f31ad6f4ea15fcdf7756e	2026-07-18 14:02:14.749+00	2026-07-18 06:02:14.749+00	2026-07-18 06:24:46.157+00
60	17	3e11cceba670684af5b488ae29e4bfca8baa69fc38b9d7b11f7811212ef4a460	2026-07-18 14:24:46.441+00	2026-07-18 06:24:46.441+00	2026-07-18 06:24:47.956+00
61	17	436a37fc08c6583f3b3310788869091ebe397ff474081294c735546efe623f8a	2026-07-18 14:24:48.189+00	2026-07-18 06:24:48.189+00	\N
62	17	476e630354ade912c4511aa9a1819951da9e9e3102fe44dbc4ae3f8afdc18712	2026-07-18 14:36:30.796+00	2026-07-18 06:36:30.796+00	\N
63	17	98c8556d2e21b7c96b73ff3e5482f5dba30340faa44cffab15bc003af39f6342	2026-07-18 14:48:27.465+00	2026-07-18 06:48:27.465+00	\N
64	17	373c4b713073e4f5c57459f82086c43eb55fe8f0cc7c0b80cdd39668860de60b	2026-07-18 14:53:26.859+00	2026-07-18 06:53:26.859+00	\N
65	17	44bef1de03f9a0d0f89d03a9971792bba9b74bbb7b58801c2e6ce2bb73502bb3	2026-07-18 14:58:18.439+00	2026-07-18 06:58:18.44+00	2026-07-18 07:32:17.336+00
66	17	75c83c77fb7f99ba682042423e1d6de76277e05a0bd9c62ffb67b96d1f8e8f53	2026-07-18 15:32:17.567+00	2026-07-18 07:32:17.567+00	\N
67	17	d5ee0cc0252ec133775cfc5b18bbb2e39a372a3a838e54324cfdc14e2eddb088	2026-07-18 15:32:32.363+00	2026-07-18 07:32:32.363+00	2026-07-18 07:47:35.972+00
68	17	258a50f1e8f72cbab2e3dff10b38aa2a2e74f3c918a12ac98b25940ac616760c	2026-07-18 15:47:36.217+00	2026-07-18 07:47:36.218+00	\N
69	17	5628a66c4bc556ecc90dcb31e258b074295ec45dfd0f4d3e5f852174b1386461	2026-07-18 16:00:03.161+00	2026-07-18 08:00:03.162+00	2026-07-18 08:15:09.559+00
70	17	7f6cc01c17fb476375ecd2149883058e03a36b525996b68aa9dd38c4c897005d	2026-07-18 16:15:09.859+00	2026-07-18 08:15:09.859+00	2026-07-18 08:47:21.5+00
71	17	8138c2b2c63ad2796f2492a2aea1aae99800eea09894ceaf43f5353b08f256f8	2026-07-18 16:47:21.785+00	2026-07-18 08:47:21.786+00	2026-07-18 08:48:05.632+00
72	17	878c9bd8d1bb8ab1a84f819cfce8131ab81bb66b66ecafeb41e83fde09dcb554	2026-07-18 16:48:47.446+00	2026-07-18 08:48:47.446+00	\N
73	17	d638a4e1fb03da704a3a2d9261fa7ffa598f599bafa42499351c5516fc1c4d38	2026-07-18 17:00:07.808+00	2026-07-18 09:00:07.808+00	\N
74	17	f4371e145f9a142de87d66c38e87617b6b42eee22209fa2d27c63934cb931be0	2026-07-18 17:08:20.071+00	2026-07-18 09:08:20.071+00	\N
75	17	e52c987adec2bd955da17f75fb788e9951020f5b5538406f5c5973a9b93c8977	2026-07-18 17:23:08.633+00	2026-07-18 09:23:08.634+00	\N
76	17	7a44ce0977d7b6ce75c303a83033f2303953e9c3db204365f41912fe83ccb72c	2026-07-18 17:29:27.554+00	2026-07-18 09:29:27.554+00	\N
77	17	1787b071fb25050538bcd52206fa899c62a549ad3f8364479bac71c74bc8c713	2026-07-18 17:38:21.518+00	2026-07-18 09:38:21.518+00	2026-07-18 10:04:03.047+00
78	17	98f685896b2c0b6a9a609e196a1767a8607b9f921c4a31977dd9ee6fe0dfae15	2026-07-18 18:04:03.314+00	2026-07-18 10:04:03.314+00	\N
79	17	ebc2da765b690d1d682bc825475d16e9dd45cb63336023dc8731994ba427511f	2026-07-18 18:06:48.428+00	2026-07-18 10:06:48.428+00	\N
80	13	2d2f0cfe23c2e34f50822cc6debe935414c7010f9264ed7976a47e03cc0f59dd	2026-07-18 22:09:21.05+00	2026-07-18 14:09:21.051+00	2026-07-18 14:26:13.645+00
81	13	2d7a58589c5f0b1e15cb7ff8ff40d555aa5d8a937a0a9fa4ad72a0117d3e9ba5	2026-07-18 22:26:13.959+00	2026-07-18 14:26:13.959+00	2026-07-18 15:08:43.634+00
83	13	543ed536409071f62c15c1cf384d78aef21a0b4894a61803bed1b5cc97c81c89	2026-07-18 23:17:58.225+00	2026-07-18 15:17:58.225+00	2026-07-18 15:44:36.597+00
82	13	6727141329b0826183ac71b684e599da47410dc2a486bf3c23141c751e2e206c	2026-07-18 23:08:44.004+00	2026-07-18 15:08:44.005+00	2026-07-18 15:44:58.797+00
85	13	bb650feafec3afb8503a0a15641d53774956bf71ed24dc04598bb7465b6c15a9	2026-07-18 23:45:03.112+00	2026-07-18 15:45:03.112+00	\N
86	17	baf202676754dfd01112ff6b814b30fcda7a6cabc0d7c336ca73ee808e064cfc	2026-07-18 23:51:09.895+00	2026-07-18 15:51:09.896+00	\N
87	13	28fc478894a1cdb51ff51347514b89ab123fa7122eefc1354534944fb9955b9e	2026-07-18 23:54:43.505+00	2026-07-18 15:54:43.505+00	\N
84	13	48ae45887ba89e619f39498e2332e04f2cdab3250bb85e34a77d3628a9691fdf	2026-07-18 23:44:59.14+00	2026-07-18 15:44:59.14+00	2026-07-18 16:01:54.638+00
89	17	5b897f4eb1486849033cb3c125e036c13d902e4cc8f3d403cca33b77f529a6c3	2026-07-19 00:05:17.501+00	2026-07-18 16:05:17.501+00	\N
90	13	96f1a1a19c60a09cb85eadb95b1a0c99afd1b446c5433029f3f862a25bbdf788	2026-07-19 00:06:38.793+00	2026-07-18 16:06:38.793+00	\N
91	17	9799caf6fabd11491583c0c2226de03866bda7de26c42eb61fbcca07f31d7085	2026-07-19 00:07:50.753+00	2026-07-18 16:07:50.753+00	\N
92	13	670d592ee7d7e5c02ab3e5e9d6963670a8891d44612a29849943098d33720a92	2026-07-19 00:09:51.299+00	2026-07-18 16:09:51.299+00	\N
93	13	bbcbad2fcce8d7b92eca3105ffbc8c8cc521bd4ca8dd7bcfa7a2dc1b402c8082	2026-07-19 00:11:56.056+00	2026-07-18 16:11:56.056+00	\N
88	13	02c7e44387330d47d584f91952abca7c6e1b0e2cc450624033ab3f06f6c31612	2026-07-19 00:01:54.925+00	2026-07-18 16:01:54.925+00	2026-07-18 16:28:37.47+00
94	13	58aa07e8c56af2af94976e82f6fe99cc6cb3ba8794c6c115ef5c0fa5be3ee6b8	2026-07-19 00:28:37.897+00	2026-07-18 16:28:37.898+00	\N
95	13	3f1f24b3cd7739f867cccb9178292a6e3ab329927a95ce73c00a2b9e44f3f63c	2026-07-19 00:30:22.639+00	2026-07-18 16:30:22.639+00	\N
96	13	9d4c5bde77c12ddc19c01a866ed5b550020fca49c1278cb3892500d23483d444	2026-07-19 00:39:50.843+00	2026-07-18 16:39:50.843+00	\N
97	13	a104aaeac2174e614299a59cc8fae29e2c12ebe86e119af05f8a9e885086bcd4	2026-07-19 00:42:18.2+00	2026-07-18 16:42:18.2+00	\N
98	17	6a9ef6451b88ec52a125bd7fa915c5815825882bb672823902cd42eaea9c6c01	2026-07-19 00:45:03.747+00	2026-07-18 16:45:03.747+00	\N
99	13	5906f540c23cc78dd18ac3121bc862f04b3dbabf838cbd5686b999b7495448c9	2026-07-19 00:46:51.335+00	2026-07-18 16:46:51.336+00	2026-07-18 17:04:26.827+00
100	17	508f6e6ce80568b43310eaf7062da14441ec9d67d322e06906fb032fd1ea30a3	2026-07-19 00:49:59.928+00	2026-07-18 16:49:59.929+00	2026-07-18 17:49:46.392+00
102	17	619b2b9374abd58279e86bc0cb7bb3fd74366b066afe427739fc741911233eea	2026-07-19 01:49:46.674+00	2026-07-18 17:49:46.675+00	2026-07-18 18:15:07.86+00
104	13	27e20874e122f803fabc7d62efc0fb925ae4f415883cd4b07d91645edeafb384	2026-07-19 03:02:40.845+00	2026-07-18 19:02:40.845+00	2026-07-18 19:24:14.188+00
105	13	51a47a7f128e6a104d3a08fc2fcd4e7134c25dfc6d46ed4fd13423a801a4530e	2026-07-19 03:24:19.737+00	2026-07-18 19:24:19.737+00	2026-07-18 19:24:36.663+00
101	13	79a0123b7168b828a1d3ce2730fbe9c72971309761014dcdc7f3b5d203fdb516	2026-07-19 01:04:27.18+00	2026-07-18 17:04:27.18+00	2026-07-18 19:52:32.974+00
107	13	10d12a72be26b1d14d9f896828646c8212769f190497dc1ac898a91569d378a3	2026-07-19 03:52:33.288+00	2026-07-18 19:52:33.289+00	\N
108	13	09f9cfe5266d736d14b783f7527316bf43ff6d14e679c31c2c474bebc5dff7fb	2026-07-19 04:11:00.596+00	2026-07-18 20:11:00.597+00	2026-07-18 20:23:17.521+00
103	17	ba2f5d91d1f9705ba02cf2afa64eeb30a34d7bdff885edc9fc9582aa33ffc5ed	2026-07-19 02:15:08.13+00	2026-07-18 18:15:08.13+00	2026-07-18 20:28:52.554+00
110	17	31cdd43cef96d0bf7564c99dacb01bce865a588cbae06b2174d7ea80c38adc83	2026-07-19 04:28:52.82+00	2026-07-18 20:28:52.821+00	2026-07-18 20:29:44.7+00
111	17	eb7b8a28ecd06e921ecde2523c76bd909141236cf48bfdc943e3a79131672551	2026-07-19 04:29:50.643+00	2026-07-18 20:29:50.643+00	\N
109	13	4972cc437b42fb53a323ddc0fd085ca09c8da9914c2a09b0d4df02bb6f5e3aa3	2026-07-19 04:23:23.271+00	2026-07-18 20:23:23.271+00	2026-07-18 20:48:35.614+00
112	13	da1f9c4193237c7222c9116b9e4d25f98194cb5d08d1f04da50b42b6f2ce1939	2026-07-19 04:48:35.971+00	2026-07-18 20:48:35.971+00	\N
106	13	452ff8b96b522e8b6b38f64d36c3e4684c0a383669c0d0c11ce0598b068a78b6	2026-07-19 03:48:21.15+00	2026-07-18 19:48:21.15+00	2026-07-18 20:52:10.133+00
113	13	9d9ce4ccfaa23e1711089362d678f6092e0deb50526209615c2c002feb411fe7	2026-07-19 04:52:10.367+00	2026-07-18 20:52:10.367+00	\N
114	13	9fe86746747f37ff7005fef30e047895f692d708cf7e955e39cc73b2ebe4a3f5	2026-07-19 04:52:41.441+00	2026-07-18 20:52:41.441+00	\N
116	13	519ade04f4363b9fe68db9bdf34362536076a5b41b3373b5d34056dc647f4dbc	2026-07-19 05:14:18.651+00	2026-07-18 21:14:18.651+00	\N
115	17	944af989c654e76dfa1abf58dbd90028dda0eb429c84052450cfe26e3eaba140	2026-07-19 04:59:41.327+00	2026-07-18 20:59:41.327+00	2026-07-18 21:15:05.337+00
117	17	96f91a1b9f21404986caad2de245acf4ff6f3a2cf1aa9d514ebd79130decae94	2026-07-19 05:15:05.786+00	2026-07-18 21:15:05.786+00	\N
118	15	c68bbbd22c75a4e27d6b949ee038844cab5cd4ba3ea44a30d9ac5a80f48e0379	2026-07-19 05:22:18.321+00	2026-07-18 21:22:18.321+00	\N
120	17	072a2934ba2176e6c9aa129ea00575c8524ef8847294abf351d443c9919a1793	2026-07-19 05:34:48.283+00	2026-07-18 21:34:48.284+00	\N
121	15	47450f8a49c29037ac43a013ec4c68618013a8018dbce17b5abe5ba2f1257414	2026-07-19 05:34:52.287+00	2026-07-18 21:34:52.287+00	2026-07-18 21:38:24.998+00
122	15	eb4e73ec120d6503a29c71b1e97b0e9ab2c59be3848f8ff9cf6436c1aa0f81fe	2026-07-19 05:38:35.491+00	2026-07-18 21:38:35.491+00	2026-07-18 21:38:38.202+00
123	15	5ef2c05adf405f789e7cdd73df47119fb7bdece98db895f6603ab53f85ba1c86	2026-07-19 05:38:38.655+00	2026-07-18 21:38:38.655+00	2026-07-18 21:39:17.777+00
119	13	f76e3be1b56303d1f938f46b211101cfd1f1e092cc2f757d5b6ed20cd6e23d2b	2026-07-19 05:23:52.218+00	2026-07-18 21:23:52.218+00	2026-07-18 21:47:40.992+00
124	15	93b4a774230b6d17a11f954385895f782e0560533f66e0ee673200201e4263a4	2026-07-19 05:39:18.228+00	2026-07-18 21:39:18.228+00	\N
126	17	248128f259ff9e8e8fe8fca9f270e235f789f8ac46c7590bea4292368045e8f3	2026-07-19 05:43:16.231+00	2026-07-18 21:43:16.231+00	\N
127	15	290b0696274efbe573954eaaa885321d1915d9485944346d44af121703a8f549	2026-07-19 05:43:23.614+00	2026-07-18 21:43:23.614+00	\N
128	13	36ffcc02307ed7730d711d158de8a40001b7cca19f619dff71cd5f3d5332f53d	2026-07-19 05:47:41.268+00	2026-07-18 21:47:41.268+00	\N
129	13	0879784c39674e8de8c44ed5468287ad0196d9b947e4df497c940d0c2e148d13	2026-07-19 05:50:02.97+00	2026-07-18 21:50:02.97+00	2026-07-18 21:55:26.883+00
125	13	5834fcb253afe8903c018918e7353ff4f2c00943c55401b7f27bafcf6a75b6f0	2026-07-19 05:42:08.885+00	2026-07-18 21:42:08.886+00	2026-07-18 21:55:43.44+00
132	13	1fd3bee950586880906a0312f4fb89fb733374ceef6a63c2abf5848b5ee4b3c8	2026-07-19 05:55:43.822+00	2026-07-18 21:55:43.824+00	2026-07-18 22:13:30.871+00
133	13	03d332261154c5f71ea7212e3f434ecf4d503558ad5d37dd81da2d1fe8cd8502	2026-07-19 06:13:31.304+00	2026-07-18 22:13:31.304+00	2026-07-18 22:13:33.216+00
130	17	1a53ee433d54f60cff27421f7dc440ef9e958cf4ba7faa351f6d45cbb502fb80	2026-07-19 05:52:53.14+00	2026-07-18 21:52:53.14+00	2026-07-18 22:22:37.965+00
134	13	061c309f6c386717c94d108940bde926dec558b75650677554f7e84af8c75e49	2026-07-19 06:13:34.331+00	2026-07-18 22:13:34.333+00	2026-07-18 22:30:37.228+00
136	13	d1f573e35c088b9b74eb2835fd9ace143ad104b33c67f619d0fcde5a6a94d580	2026-07-19 06:30:37.693+00	2026-07-18 22:30:37.693+00	2026-07-18 22:30:41.936+00
131	13	b8ffdef3cf84de1d80f5969dd6ff1ae159a59e90263c7b52ea3764f3755d9a28	2026-07-19 05:55:34.094+00	2026-07-18 21:55:34.094+00	2026-07-18 22:33:11.933+00
137	13	2063ed911413b7c253745f5dc6c301dc9715372f10713379547b09469d7ef996	2026-07-19 06:30:44.193+00	2026-07-18 22:30:44.195+00	2026-07-18 22:47:23.481+00
139	13	eb942da323d58b65941851ffc8155d2e0cd48e3e5ed4241791d2bdca5eca635b	2026-07-19 06:47:24.559+00	2026-07-18 22:47:24.56+00	\N
135	17	0b2c965bf589271742e05360acec7318e49c3dd646064fe17b2858a103273c86	2026-07-19 06:22:38.469+00	2026-07-18 22:22:38.469+00	2026-07-18 22:54:20.842+00
140	17	e5a3b6c038c32a2ed884d59483e599b98bc9e626303b5c5fd4429d96caf0459e	2026-07-19 06:54:21.331+00	2026-07-18 22:54:21.331+00	2026-07-18 22:54:30.639+00
141	17	f2a344cb63c63ff0af1631accdaaa42319126092d4543ad9cc36b9b9dc08bda4	2026-07-19 06:54:37.221+00	2026-07-18 22:54:37.222+00	\N
138	13	0c74e3517379ab3565697507206ec4db3cc7b5d03897002f5c131d1f784d35f7	2026-07-19 06:33:19.367+00	2026-07-18 22:33:19.367+00	2026-07-18 22:56:54.495+00
142	13	a1955196ced5c7e28345376ba74894d0bb2363409ea2fa253e7d7bd26f4c70fd	2026-07-19 06:56:54.853+00	2026-07-18 22:56:54.853+00	\N
143	13	1ea69e041aa196d024c309093dcfecfeca59a187b9f87611450e91bff6527e32	2026-07-19 07:43:09.298+00	2026-07-18 23:43:09.299+00	\N
144	13	f42fc21929babd0d72ddf6e406d664dac151088bdc686b1f43ce57b23e7840b4	2026-07-19 07:43:23.267+00	2026-07-18 23:43:23.267+00	2026-07-19 00:01:24.594+00
145	13	af7aa0b88914ce51200a7c80edc9281f8ff7bf49c6cd7f965bfa1e367594e4e2	2026-07-19 07:50:09.118+00	2026-07-18 23:50:09.119+00	2026-07-19 00:09:49.324+00
146	17	fdceef3586b222298b5abc931e7e51ff18f464d98542a29a58910422b47d19f3	2026-07-19 07:52:53.125+00	2026-07-18 23:52:53.125+00	2026-07-19 00:15:44.434+00
148	17	a254a71aaef46d1d513775068893405fd733bed171a892f3721eada478d17b9c	2026-07-19 08:15:44.89+00	2026-07-19 00:15:44.89+00	2026-07-19 00:38:43.502+00
149	17	999b1e52f961769b468fbf956a8a077749eb93950b5e2214bc947f389f20b5cf	2026-07-19 08:38:44.01+00	2026-07-19 00:38:44.01+00	\N
147	13	1ed88b02130ba74f3d1fced0c3ac80222c046c169e9689f9e147ce4a456843f0	2026-07-19 08:01:25.081+00	2026-07-19 00:01:25.081+00	2026-07-19 00:56:06.169+00
150	17	e4f873245ba17d14066ed10eb16ac6c6d6950e06025f5b33cfcacc544a2299a3	2026-07-19 08:39:47.295+00	2026-07-19 00:39:47.295+00	2026-07-19 01:15:15.026+00
152	17	e0198eb2312dd0358eb21604f27cbd65f13986a87b178360f4e8d064f255ff13	2026-07-19 09:15:15.492+00	2026-07-19 01:15:15.493+00	\N
153	17	18040fbd437f395a1210a8ebac32fe854f29d916feead325b49dfa84f54b3d9a	2026-07-19 09:15:22.016+00	2026-07-19 01:15:22.016+00	\N
154	17	6f1e8f2f0009cd911cd7d519fc34c8fa5957cc1d1758fee10c4582f6d1407c17	2026-07-19 09:16:20.91+00	2026-07-19 01:16:20.91+00	\N
155	17	e7c89bc545b8feb137a2ba12a891a59dff223821ed67cf3941a9c49e8459f4f7	2026-07-19 09:19:35.16+00	2026-07-19 01:19:35.16+00	\N
156	17	f9689990f9cbc8e69e282c0bfadeacf152a75c88bc90a18b739fad0144aa650b	2026-07-19 09:24:40.468+00	2026-07-19 01:24:40.468+00	\N
157	17	1cc5cdee78d5739cf525b3427309207dd8921dcfd2a7cd2188ae2f6c90c396ec	2026-07-19 09:26:03.014+00	2026-07-19 01:26:03.014+00	\N
158	17	b5feee46f2bbf09db49719ce0215e114ab09bb15184181c6f45d6983c93b2a17	2026-07-19 09:30:53.043+00	2026-07-19 01:30:53.044+00	\N
151	13	309fa3e6e254e14110acdb61e131ab7076b4b6db077377ba723cec5339807d85	2026-07-19 09:04:13.488+00	2026-07-19 01:04:13.488+00	2026-07-19 01:44:08.282+00
159	17	0e14d0a7d3995924104c69b7a8844903e3a5efab8162a05c3b33943961c1bcfe	2026-07-19 09:31:29.29+00	2026-07-19 01:31:29.29+00	2026-07-19 01:54:54.898+00
161	17	d51b3cb9d41b09b7de03c3f1ffb93dd0f6c531a6abf7c1b8bd0c7c28d75c921f	2026-07-19 09:54:55.363+00	2026-07-19 01:54:55.364+00	\N
160	13	10c5c247435240d7a2ef94973dc111f8a33112ab64c417b1f88d1bd8014ab8a4	2026-07-19 09:50:45.147+00	2026-07-19 01:50:45.147+00	2026-07-19 02:05:53.297+00
162	17	6170e74866d34dee4b65be13794ea7559668f5b3fa4c55f65ff280b4ccfb28a1	2026-07-19 09:55:58.791+00	2026-07-19 01:55:58.791+00	2026-07-19 02:12:05.714+00
165	13	86418119f8da3a53bea0d9c064cbb31a17e8829ee2a9e69543383d508f4dd468	2026-07-19 10:19:39.347+00	2026-07-19 02:19:39.348+00	\N
163	13	65b306795cf440a16274ebb25eef0d4b7033611906b39ed5766d09423510d7f1	2026-07-19 10:05:54.025+00	2026-07-19 02:05:54.025+00	2026-07-19 02:31:42.315+00
166	13	ffe33a776c4519fb890b3a3866879b064cea13f67ce8bda6eabc8e9ceb74b17e	2026-07-19 10:31:43.097+00	2026-07-19 02:31:43.098+00	2026-07-19 02:31:46.048+00
164	17	31fdbcd6bd92a1addfb87662b261c8505016b5e8078d4deb4830844024bece24	2026-07-19 10:12:06.195+00	2026-07-19 02:12:06.196+00	2026-07-19 02:36:59.295+00
168	17	44969da36e52cf6ed8c5ddb44b1ba91f22a88ec524b9d8b41eb8810c71df8384	2026-07-19 10:36:59.747+00	2026-07-19 02:36:59.747+00	\N
169	13	fee49e18a387c8b3a6c4dab9191675a9fe5545f688210bf09f93948f5519ab82	2026-07-19 10:37:13.742+00	2026-07-19 02:37:13.742+00	2026-07-19 02:38:30.032+00
167	13	5755eb296adc89aa24a33df5b2eee3a22a4ee8e81e505a87512789d2bbd9eb64	2026-07-19 10:31:46.564+00	2026-07-19 02:31:46.564+00	2026-07-19 02:38:33.36+00
170	17	17954c0bbe4c1f75385d8e3d1eac8774dcbfc7247464f58997ea95977fea8a4f	2026-07-19 10:42:10.886+00	2026-07-19 02:42:10.886+00	2026-07-19 03:01:30.816+00
171	17	ddfa8a6a86e3e0c2a8bd77429511a8b33edd8567ee0497a1a900cb28ce9743c8	2026-07-19 11:01:32.636+00	2026-07-19 03:01:32.636+00	\N
172	13	861beac596f47a8aa2ab585f011b206cc6f6a25cd13c8a270d7182da60e19716	2026-07-19 11:51:50.168+00	2026-07-19 03:51:50.168+00	2026-07-19 03:54:53.877+00
173	13	e73864d7aa1ef02d4b7be20c66e5b0a14f960f7a0655d4daf9e4d45a1a30f720	2026-07-19 22:59:48.266+00	2026-07-19 14:59:48.267+00	2026-07-19 15:00:56.29+00
174	5	221d18a36355f7b31c21d0f8de1a01862aec5666adba69a1d1e6aac9eaf9ec5d	2026-07-19 23:09:05.915+00	2026-07-19 15:09:05.915+00	2026-07-19 15:17:57.994+00
175	13	a6a7fd41003ada629f2c4e80be485f936ab8d5c1b48fa9cd2b1b5d556c668faf	2026-07-19 23:30:54.257+00	2026-07-19 15:30:54.258+00	\N
178	17	18cb95085b451f55f27d33b5c27f0225eb996c71ad9832bf055ab7f6f2c39a74	2026-07-19 23:39:29.043+00	2026-07-19 15:39:29.043+00	\N
176	13	c182e732ddb48e8469f4fa89017eceefb12b81f9f83678f21de3c137c4fd248f	2026-07-19 23:33:11.518+00	2026-07-19 15:33:11.518+00	2026-07-19 15:39:40.531+00
179	13	7e1f03af6263638180bb17aa71adffb7423a78cfaa8a9d17a79fe5be45fa05fa	2026-07-19 23:39:40.597+00	2026-07-19 15:39:40.597+00	2026-07-19 15:39:41.728+00
180	13	b33f1bd3b053c97c7f626fef69fcab46c49a2722f747819e687dcce0ef6483c4	2026-07-19 23:39:42.119+00	2026-07-19 15:39:42.119+00	\N
181	17	89387c144eb6c3710c65c114826686533d994616214052cbf74b34621dbbfd72	2026-07-19 23:41:00.225+00	2026-07-19 15:41:00.226+00	\N
182	13	c718323335645a2408b23672b4eca1c8e5e2dbf762884bdc5d86f9dbf2162f8f	2026-07-19 23:41:07.37+00	2026-07-19 15:41:07.37+00	2026-07-19 15:42:10.241+00
177	13	bef190b8934f17e05ee0245c613eb230d042b1828eeb59da9067d570a081d776	2026-07-19 23:38:39.174+00	2026-07-19 15:38:39.174+00	2026-07-19 15:57:16.635+00
184	13	9f0881df753ebaa493bdd9f3133c538585bfb7beaa934ef57bb5fa564ea3b45a	2026-07-19 23:57:16.986+00	2026-07-19 15:57:16.986+00	\N
183	13	ae10eec3e749ff67ff64b7dc93142c8c1c906979db8ef693df74b652ecac34e4	2026-07-19 23:49:43.516+00	2026-07-19 15:49:43.518+00	2026-07-19 16:12:27.017+00
186	13	9d134771d1dad68137a39fbd39f121cadf925af41feabcac255a8e7bc9e73b34	2026-07-20 00:12:27.498+00	2026-07-19 16:12:27.498+00	\N
185	13	83f9d331598d3c92fea3eaacf06b265adbb59fbca6acc3048127734be98b1145	2026-07-20 00:04:11.023+00	2026-07-19 16:04:11.023+00	2026-07-19 16:21:35.028+00
188	17	18e187b8a002576250c2199636b72a4a18fd976e1a49ca6065bedc4dcb6df51a	2026-07-20 00:43:16.018+00	2026-07-19 16:43:16.018+00	\N
189	17	be7a7823a05cd612225f9df6ae59353fb4ab2ecc037c5ea273f5239576f83979	2026-07-20 00:57:39.919+00	2026-07-19 16:57:39.919+00	\N
187	13	1ed632e1e58b10d554586e540b0046edf869d203a857b7bef3b6112c48e74436	2026-07-20 00:21:35.467+00	2026-07-19 16:21:35.467+00	2026-07-19 16:58:12.727+00
190	13	cb73a287a8af273b36e1d1f0d823d05bbb9dc5c3210e591b7c5bd5b7aed7e479	2026-07-20 01:21:28.663+00	2026-07-19 17:21:28.664+00	2026-07-19 17:23:32.04+00
191	16	72b7a26032d40ac869ebdc8a03185a10e0c10414a79868c3da390d9d12fdc937	2026-07-20 01:23:39.066+00	2026-07-19 17:23:39.067+00	2026-07-19 17:27:12.611+00
192	13	aec938fa384be73f604ea73b9a681064778abe4058a4617ff894575965cbe12a	2026-07-20 01:35:20.17+00	2026-07-19 17:35:20.178+00	\N
194	17	349f6778440db3d6324f9192d8ee706c51b5559536deeeaef0ae4302e647a3fb	2026-07-20 01:39:26.123+00	2026-07-19 17:39:26.123+00	\N
193	16	91bc4248511e031be62991edd1d0d8385481d5299f2d40686d2ca04c18f97b8f	2026-07-20 01:35:44.214+00	2026-07-19 17:35:44.216+00	2026-07-19 17:51:06.727+00
195	13	8e04beeac0d3556f68d4e771b554e4e6a963a75c4e19f936a498ed61d49818c2	2026-07-20 01:51:33.595+00	2026-07-19 17:51:33.595+00	\N
196	16	83b10b193e68581bf0f53aff1bba3ed53c469c338cbca61a6ffa77acb27574cf	2026-07-20 09:33:52.685+00	2026-07-20 01:33:52.685+00	2026-07-20 01:39:43.39+00
197	15	b999ea71181a89b8f37a45731bc65058d021eeab48b693628ee05b4b1819dd3f	2026-07-20 09:39:58.788+00	2026-07-20 01:39:58.788+00	2026-07-20 01:44:32.292+00
198	14	7dc72aa621528f5f66698bea5cb867097f777ce72aa72e37a018630d387093ed	2026-07-20 09:44:48.854+00	2026-07-20 01:44:48.854+00	2026-07-20 01:47:25.154+00
199	13	b0cbb175454dc3da875a1660b614ec906197bc9bbce1269cb234dfacf73f59e9	2026-07-20 09:47:30.534+00	2026-07-20 01:47:30.534+00	2026-07-20 01:47:43.099+00
200	14	f9dd5629a6c57d71f4e700e1efeb53f60a451975c9bb17a5e6a33bfad6dfb6bd	2026-07-20 09:47:49.157+00	2026-07-20 01:47:49.157+00	2026-07-20 01:54:51.577+00
201	13	40a8006f54d42db8f5e53772ce77e554a469262ef28171ca3406eb3fc8323b52	2026-07-20 09:55:00.101+00	2026-07-20 01:55:00.101+00	2026-07-20 01:59:48.222+00
202	17	af369e6230cf0f950a3db5fb98fd0cdeb8c0025c1a4917bec40f3482a2678712	2026-07-20 12:55:25.736+00	2026-07-20 04:55:25.736+00	2026-07-20 05:24:52.353+00
203	17	fb3069d6fd3b8ff55627939bae84115f16c8d0b64132f63df14dc7938e3dc53c	2026-07-20 13:24:52.952+00	2026-07-20 05:24:52.952+00	2026-07-20 05:24:55.957+00
204	17	2ea1e7dadba684683f457fa8706bcbb2f68f3819fc7967a61cc0208d3bff1607	2026-07-20 13:24:56.508+00	2026-07-20 05:24:56.508+00	2026-07-20 05:40:00.49+00
205	17	8355fe7b221d296206e4399c330b6af0151b7102983283bd874dfa7eda6bbe9a	2026-07-20 13:40:01.688+00	2026-07-20 05:40:01.688+00	\N
206	17	c98ff620f0adb53f13c3f8ab8432e50327ed280d51872351d6fad9fb8ddddbe0	2026-07-20 13:41:07.33+00	2026-07-20 05:41:07.33+00	\N
207	17	16a317047e1b9f304939e9d90cab8a4583885e3d076bc8bfed263fb033388a26	2026-07-20 13:42:15.218+00	2026-07-20 05:42:15.218+00	\N
208	17	301a5f6e4cc14c189f612fc55fb5c351a176fb9583fd382be5a007467f6086af	2026-07-20 13:55:41.341+00	2026-07-20 05:55:41.341+00	\N
209	13	90dba3916efe8ecf68dd5eada270c9630f0aa1cd7db17a412382914ee77d2390	2026-07-20 13:56:46.767+00	2026-07-20 05:56:46.767+00	\N
210	17	71346ae8b6dfed2a13b4ff47a0226ee50e9d92dac93da05755e5ec9c14f28600	2026-07-20 14:01:45.997+00	2026-07-20 06:01:45.998+00	\N
211	17	0344072cbdd5c2402ba5b0077ae9eff25b02b1475694afe9abe95792aa872e88	2026-07-20 14:15:41.126+00	2026-07-20 06:15:41.126+00	2026-07-20 06:33:00.722+00
212	17	d09a63e907f175a3a158ac793c1d5e89e0f0b90a4a2dae973067a9fe26e80905	2026-07-20 14:33:01.385+00	2026-07-20 06:33:01.386+00	\N
213	17	5dc3c700ecd4413065cd56e7e35391fdc6e313b3ab6c3d3f08c983c3483fd833	2026-07-20 16:50:26.859+00	2026-07-20 08:50:26.859+00	2026-07-20 09:06:52.852+00
214	17	15422fa7ade73102ae92a135bf4377e063281c6ee02f175710da316018983dfc	2026-07-20 17:06:53.425+00	2026-07-20 09:06:53.426+00	\N
215	17	ba8b3b23adddf312bedd195dd5faf70945e800ebf9c042eef240e45a57c0ef5f	2026-07-20 17:11:45.561+00	2026-07-20 09:11:45.561+00	\N
216	17	4c099f484815b797241726a6f0839516a4d81381ece97111ead9427ff7aaa111	2026-07-20 17:20:54.934+00	2026-07-20 09:20:54.934+00	2026-07-20 09:43:27.51+00
217	17	8cca95723d3afc6b2cb055456c8b4779355b9919453acb2dafe73f180badbed9	2026-07-20 17:43:28.09+00	2026-07-20 09:43:28.091+00	\N
218	17	6af1a45a5f405f41246672e8c79d89cbd9bc3af773ea4b6be5b7618c81cebfd6	2026-07-20 17:53:59.698+00	2026-07-20 09:53:59.698+00	2026-07-20 10:15:00.452+00
219	17	9280ee148ac02df6a0192bca5666e975104c01981ada001477dc1ca2b33c5072	2026-07-20 18:15:01.035+00	2026-07-20 10:15:01.035+00	2026-07-20 11:25:10.668+00
220	17	f46298c85305bae65addc56077f4c436fa0df00b1c49ed55eaac7da9c191d1e9	2026-07-20 19:25:11.255+00	2026-07-20 11:25:11.256+00	2026-07-20 11:41:51.712+00
221	17	fda3aa5def8a207c802a1c845eddd112a1f91e30e10077871e6d7c0398981a99	2026-07-20 19:41:52.346+00	2026-07-20 11:41:52.346+00	2026-07-20 11:59:47.297+00
222	17	84334130d2c50c292ad037197465ac074ac4bedde689b260d346aaa345df2323	2026-07-20 19:59:47.881+00	2026-07-20 11:59:47.881+00	\N
223	17	db178554c60cff04b476feae3147a7656d13020a024358cd040e18148e0cf28f	2026-07-20 20:53:40.502+00	2026-07-20 12:53:40.502+00	2026-07-20 13:09:26.833+00
224	17	338d1e949e7595e90324871de9d81a6005729d91e15a7deae2422564e354a064	2026-07-20 21:09:27.417+00	2026-07-20 13:09:27.418+00	\N
225	13	b61d88ee4b41941a735ee1723d4cdd3144e2a2dd9f3d1b95bb981dfc30446f07	2026-07-20 21:24:02.507+00	2026-07-20 13:24:02.509+00	2026-07-20 13:27:40.946+00
226	15	66af115592d7e8667c36bd1bd4b659674702a97c6509f492ef3c8c22d57da1b2	2026-07-20 21:27:55.507+00	2026-07-20 13:27:55.508+00	2026-07-20 13:44:02.598+00
227	15	4a10eecc3a19f556b3d82ea64df3ebc253eafa180d65abadd725ff94a2199adc	2026-07-20 21:44:03.133+00	2026-07-20 13:44:03.134+00	2026-07-20 13:44:06.051+00
228	15	475e22f64fb3bd11ee34ec6d9fe7b09b9c7ad45ddd03987bc20152f8c3863f22	2026-07-20 21:44:06.604+00	2026-07-20 13:44:06.605+00	2026-07-20 13:59:08.238+00
229	15	7442c6c51bbce440822d7dda7ffc86bfca6bb6b85706ad6862071fc5ede81178	2026-07-20 21:59:08.695+00	2026-07-20 13:59:08.695+00	2026-07-20 14:02:08.628+00
230	14	147b3b7e8d63f9abf5908b6fdf45db28d13d7ed2d8e3f8be45323fcf8b4d5405	2026-07-20 22:03:26.3+00	2026-07-20 14:03:26.3+00	2026-07-20 14:03:48.851+00
231	13	51d3aabcde40db84de80f4f2fdf76788cd1a09daf5c9510befd9dee8bd8ced05	2026-07-20 22:03:54.668+00	2026-07-20 14:03:54.668+00	2026-07-20 14:07:45.836+00
233	13	b5b6bcd55abbe8d017facbde6c7374e8545f611e4e4523d44952ff2637c9f5fc	2026-07-20 22:12:10.75+00	2026-07-20 14:12:10.75+00	2026-07-20 14:12:38.179+00
232	13	53ea71a2dfb9e7b34c336618bba924f106274244cf4adb57b22e8b0836d1e624	2026-07-20 22:07:51.682+00	2026-07-20 14:07:51.685+00	2026-07-20 14:16:07.52+00
236	13	fd013678f09b0504c4416f45e067f678bb012f449e37873fbfa6aa15978108a3	2026-07-20 22:21:02.36+00	2026-07-20 14:21:02.361+00	2026-07-20 14:21:09.774+00
235	13	4407606f7fb5b469243a23e8fc67d1ca6664f304b0f6da888ae7cb2d32e73499	2026-07-20 22:16:07.976+00	2026-07-20 14:16:07.976+00	2026-07-20 14:21:23.563+00
234	16	38c49321d31ba7df9b7571c89326ce37b56c160b72fd32e5a81e5574b920cf68	2026-07-20 22:12:56.204+00	2026-07-20 14:12:56.204+00	2026-07-20 14:21:26.173+00
239	13	ca5cd842d28dd0accd23c7f4e090dc160f1cc48e897b558a87948784648c80bd	2026-07-20 22:21:30.859+00	2026-07-20 14:21:30.859+00	2026-07-20 14:22:16.676+00
238	13	2a99d0360dc21d93f9d5415ba747ea5cdbe87f372609f270f8efbef820942d08	2026-07-20 22:21:24.033+00	2026-07-20 14:21:24.034+00	2026-07-20 14:22:17.522+00
237	16	8e927c25d5905d24b917044af4899a632212f35cff4aa7daa2351f551636bc76	2026-07-20 22:21:18.374+00	2026-07-20 14:21:18.374+00	2026-07-20 14:23:23.414+00
242	16	5de5419415b1b39ed4771978d391d9a5df711cfe2fe35996ecbcd03e429bbb05	2026-07-20 22:23:23.795+00	2026-07-20 14:23:23.795+00	2026-07-20 14:24:03.768+00
241	15	4cd4add90c0a525b884a68b1c0ec800cac0599f035b221c2fe81d1866799a29e	2026-07-20 22:22:22.917+00	2026-07-20 14:22:22.917+00	2026-07-20 14:24:17.126+00
240	13	6504199fdd9240d61c48835e6e0f001d548cb4a940f23e1ea936c1033f7585be	2026-07-20 22:22:17.982+00	2026-07-20 14:22:17.982+00	2026-07-20 14:26:22.917+00
243	15	7fea16c419cced3c28cc1cb732882702b3c268eae081f49756aee2e9a67c3a7d	2026-07-20 22:24:09.558+00	2026-07-20 14:24:09.558+00	2026-07-20 14:30:41.597+00
244	16	cde8602305ede2e59cb0371ac74d6b7ae974bc30ed3048ef28c2f9d595075d33	2026-07-20 22:26:30.447+00	2026-07-20 14:26:30.447+00	2026-07-20 14:31:43.722+00
246	15	d197a3d827f700937974d652f5a754b666fd0eec0173670b9814a3e751f874cb	2026-07-20 22:32:10.54+00	2026-07-20 14:32:10.54+00	2026-07-20 14:34:41.861+00
247	5	ecd90466116fba734c304bcf4389196ca8037f456410b9bba358769edffb106b	2026-07-20 22:34:57.395+00	2026-07-20 14:34:57.396+00	2026-07-20 14:40:54.574+00
248	15	43008ce71c5abec7791a5e0eddfcdb3f96b72d84d9c62964a22afd2cc0211a1b	2026-07-20 22:37:02.751+00	2026-07-20 14:37:02.751+00	2026-07-20 14:41:23.018+00
249	5	b65430b0d4d6fb7badfaed3a202682584ffc0dcf31aa93a0a98c5d8274a89f4c	2026-07-20 22:41:30.88+00	2026-07-20 14:41:30.881+00	\N
245	15	c1df00e0a9e46520beb9b2da765a5d002a7775342bc99f435b1d0d5cdfa7a4d6	2026-07-20 22:30:42.071+00	2026-07-20 14:30:42.071+00	2026-07-20 14:42:41.418+00
250	15	e3e3484b74d048966e851248a47ce57359bd71b3fe1a994dba3c2fde07d9966a	2026-07-20 22:42:46.517+00	2026-07-20 14:42:46.517+00	2026-07-20 14:47:39.999+00
251	5	77c640b4b918c70091253439e652a34cd8811742704063f78867d84385de5d12	2026-07-20 22:47:47.575+00	2026-07-20 14:47:47.575+00	2026-07-20 14:47:55.2+00
252	15	2d1452cfcb5741966fc1a52b37372f424fa4c0fa4761ec88c429a4fa418db63f	2026-07-20 22:48:00.592+00	2026-07-20 14:48:00.592+00	2026-07-20 14:48:04.908+00
253	13	010fe5bc00ede96ca8c2b4c219455f6e7c85510d491d89c4a0bd30f25bb70baa	2026-07-20 22:48:10.454+00	2026-07-20 14:48:10.454+00	2026-07-20 14:48:14.342+00
254	16	ee91d8ee5a60d962c79fdc513494d3ddb76d866edfbbcc1e69d6804d318e22ec	2026-07-20 22:48:20.171+00	2026-07-20 14:48:20.171+00	\N
255	5	aa768a418d3a3638e56c65a72c834d778760012e45dc8a2f1fb026be67a38c41	2026-07-20 23:38:08.459+00	2026-07-20 15:38:08.459+00	2026-07-20 15:42:46.997+00
256	13	267071b20c0546542554c9b13a67ee71afe96ba54030c3b07ddd797506d808be	2026-07-20 23:42:59.171+00	2026-07-20 15:42:59.171+00	\N
257	5	2e6d29d3f697f44fd27683c2a33c23ac98402e43a2a6df002310912eafdee753	2026-07-20 23:59:03.654+00	2026-07-20 15:59:03.654+00	2026-07-20 16:02:44.25+00
258	14	4b54a8f352bfdbb4361ee14fdafd78525081234a723f5341a12e1f3662a2a4a0	2026-07-21 00:02:57.619+00	2026-07-20 16:02:57.619+00	\N
259	5	903b8b90c4812726ed883d274194bb0b57df2eec0604e136b351513d2b4d1c2b	2026-07-21 00:18:34.207+00	2026-07-20 16:18:34.207+00	2026-07-20 16:20:31.908+00
261	17	b6d65c946e2452f6a76d4e6627ca7e0aa5be9c19b412db36c2e7ac362effb7b2	2026-07-21 00:37:39.019+00	2026-07-20 16:37:39.019+00	2026-07-20 16:40:12.119+00
262	5	2135298775d42f15f456bacb8a115f6b81afb69b5034934526e175db61165764	2026-07-21 00:40:21.03+00	2026-07-20 16:40:21.03+00	\N
263	17	f620b63e7fe383e0ebdbd48c6e911639a95c591e7757358feef101d8d530e9a8	2026-07-21 00:50:13.187+00	2026-07-20 16:50:13.187+00	\N
260	14	3bd9cea6e0f3c13f9126115242312daa82fc4e73f49202773f29de1becaa1555	2026-07-21 00:20:43.213+00	2026-07-20 16:20:43.213+00	2026-07-20 16:53:29.55+00
264	14	5ac22813903a62d9004cff779334c85f43ec0e7ee8e368babb6bfd6ac08582e5	2026-07-21 00:53:30.313+00	2026-07-20 16:53:30.313+00	2026-07-20 16:53:31.154+00
265	14	d54c6b745f3da5fa16b2fcaf69d35c38db36ba2d4e4a6e1dab237ad799d333e7	2026-07-21 00:53:32.428+00	2026-07-20 16:53:32.428+00	2026-07-20 17:06:39.04+00
267	5	3454c2a3eae12553ff943c93321a47ed3d3ad8d785420a30e801d8a0ef26cc76	2026-07-21 01:09:47.388+00	2026-07-20 17:09:47.388+00	\N
268	5	f1f856478b831215fc51ccf333db49dc446537139d7c602140005c1acc068e42	2026-07-21 01:11:12.298+00	2026-07-20 17:11:12.298+00	\N
266	5	35d6ec4fb94ec3be39568c4e4d0f38c9013eb3c7ab6c096714ccd307644a1ea6	2026-07-21 01:06:59.71+00	2026-07-20 17:06:59.71+00	2026-07-20 17:11:31.919+00
270	17	0d1fc1cbb3e0bb769fa354854c76a8bc0c665e3540b877b609d6f129662508c8	2026-07-21 01:12:20.589+00	2026-07-20 17:12:20.589+00	\N
271	5	312e8c184c601f40d3458cc0f404e09cc0ef347d1853de8a5ccbc13e7e9d25bc	2026-07-21 01:12:48.466+00	2026-07-20 17:12:48.466+00	\N
272	5	905f230449e8ef35c1ae054cbc4135918816e2dedf6b9bb4535928c1a2c1bdfd	2026-07-21 01:14:48.171+00	2026-07-20 17:14:48.171+00	\N
273	14	987a06c8ce9336a339a27b86b47a11eb4b05c044492720219d2c7030870642c6	2026-07-21 01:19:37.153+00	2026-07-20 17:19:37.154+00	2026-07-20 17:20:39.05+00
269	5	553b17c0890a0774c10e814fe87cc8d720b0c66889e4a2d4f95b10a479098770	2026-07-21 01:12:08.803+00	2026-07-20 17:12:08.803+00	2026-07-20 17:27:32.361+00
275	5	50844c9c2a75011ccd809453289088ce2933eacc14fd59ee5a91bb04dcc2d5d3	2026-07-21 01:27:33.028+00	2026-07-20 17:27:33.028+00	2026-07-20 17:28:47.654+00
274	5	025c534aba1492de925f65996483e2f52b40e45f865aea55904a271175949542	2026-07-21 01:20:56.837+00	2026-07-20 17:20:56.837+00	2026-07-20 17:30:13.898+00
277	13	794de5048edb884f6e6f16cefd82d838bdcac686590988f1fd20e605364f5844	2026-07-21 01:30:19.533+00	2026-07-20 17:30:19.533+00	2026-07-20 17:30:44.612+00
278	5	aff76424199220b5981db0e933a51d5b70c492176279602f6d8c2af679af99af	2026-07-21 01:33:03.506+00	2026-07-20 17:33:03.506+00	\N
276	13	c61f4985a4c013b5712f69edc0be4e42f7d8fd24c17ab3dac6fcd3a69c58c7d8	2026-07-21 01:29:18.381+00	2026-07-20 17:29:18.381+00	2026-07-20 17:35:00.971+00
279	13	169b6c7cdc1e2a946afae215b6602231acd2f5e5ed0836829282b7f5ab580d5b	2026-07-21 01:35:01.664+00	2026-07-20 17:35:01.664+00	\N
280	16	ed2c7b4202aa6883c1aa7e23840aeede1413aac019daf298a8ff8ba5eca1c69c	2026-07-21 01:36:20.89+00	2026-07-20 17:36:20.89+00	\N
281	13	ba7788a9e1d3779cf63eacbb1b7e73e1e79960be0e0495919e392520aee5a1dc	2026-07-21 01:36:40.548+00	2026-07-20 17:36:40.548+00	\N
282	14	6775562f25e1b173b8b97ecfe8438bd2ad757cf0a77bf1ef6f647ab5ab3f1848	2026-07-21 01:37:52.245+00	2026-07-20 17:37:52.245+00	\N
283	15	2633f57507846b3662d773048a88a15af7ad46a1462372c905c8ed720d077a26	2026-07-21 01:38:16.542+00	2026-07-20 17:38:16.542+00	2026-07-20 18:18:15.757+00
284	15	f51d6f2181ac0695e9b23cee8cb7780e4c8733eccf5a48781f7905ef4dc7e483	2026-07-21 02:18:16.536+00	2026-07-20 18:18:16.536+00	2026-07-20 18:24:48.307+00
285	5	a8178a34e0853385d663d84f4f5b2e79be6fcf860c73da5d932b5dfa2a4bcf52	2026-07-21 02:24:59.495+00	2026-07-20 18:24:59.495+00	2026-07-20 18:42:34.926+00
286	5	93644dcc215ec93de95f79757d29e0ea6b3d6fd6c1c74c3aa5fc0864f2e793dc	2026-07-21 02:42:35.617+00	2026-07-20 18:42:35.617+00	2026-07-20 18:43:39.196+00
287	5	eed52764503e333f7e9936d5c61d2f0e6b766d69f9f9cf05524a7bb697aa2f70	2026-07-21 02:43:51.308+00	2026-07-20 18:43:51.308+00	2026-07-20 19:00:27.275+00
288	5	66d3b4af108374fa59db631f84a2cb11a4ecf6ac1f88fbd2a23f218a2a212ef6	2026-07-21 03:00:27.987+00	2026-07-20 19:00:27.987+00	\N
289	5	4fa517bb6644c559be00eb0b365bf3392bcbb8d3c71cad257447d066e866c29d	2026-07-21 03:02:22.459+00	2026-07-20 19:02:22.459+00	\N
290	5	c232b9965a9bf1f6643bba629a6e5d094a0f987ec85d216158cbcdfdfcfbeaeb	2026-07-21 03:06:32.337+00	2026-07-20 19:06:32.337+00	\N
291	5	718f691e62fa0e44110f85a857257f0b56a84f3af5a376baf6f91b96c331dbbf	2026-07-21 03:10:23.448+00	2026-07-20 19:10:23.448+00	\N
292	13	dfdbfeb8d84f77171029b16de64c45be374b4781b03552436268e7c63db4172c	2026-07-21 03:16:26.896+00	2026-07-20 19:16:26.896+00	\N
293	13	1dd3e27876e5d73dee07282b9a58a0af5aebc5171c582f33e9d28e9473e92b46	2026-07-21 03:18:31.786+00	2026-07-20 19:18:31.786+00	\N
294	13	f1c51c85e4fa8338871b2ad0091cbbf626f084378fd1f1adfd15b98cf2255527	2026-07-21 03:29:05.991+00	2026-07-20 19:29:05.992+00	\N
295	5	3343b643a8b97d4e54ce3def225d5b1eb3a1f52670c8f9a4cb6a86aa64c8baf7	2026-07-21 03:29:19.099+00	2026-07-20 19:29:19.099+00	2026-07-20 19:44:21.205+00
296	5	e2124791c3c18802213c0ed0d963c2ac5715d1cd6335a7c1ced94a7c641cfaec	2026-07-21 03:44:21.601+00	2026-07-20 19:44:21.601+00	2026-07-20 20:03:45.424+00
297	5	f0ac9f79d0d8f52131bc89a8a9cc9cf7e70d528872b0bf8c5de81f7f156c083c	2026-07-21 04:03:45.829+00	2026-07-20 20:03:45.829+00	\N
298	17	b55fb85ce701fd801e7a32f1710722cdb59140e8418b94a0271d7e64e58665e5	2026-07-21 05:08:35.581+00	2026-07-20 21:08:35.581+00	\N
299	13	ca252d475290fe9e7831a033b6d82997da5bab6b8ce6be4e1daa09e5d00e7d27	2026-07-21 05:12:03.275+00	2026-07-20 21:12:03.275+00	2026-07-20 21:12:51.442+00
300	5	2d8a394327e9272f8a9212d26a00b2304c572533abc8d5c2a6ebe9501bc5d280	2026-07-21 05:13:03.578+00	2026-07-20 21:13:03.578+00	2026-07-20 21:26:49.894+00
301	5	421d43f1ebb62769971f00be92f8d8d680b3744e76f8863e4273b4fc01bd3e21	2026-07-21 05:27:54.21+00	2026-07-20 21:27:54.211+00	\N
302	5	a8d5d6822c556fe699a1120c241db12e13cc027237df5741ac7d3855a9430490	2026-07-21 05:36:23.368+00	2026-07-20 21:36:23.368+00	2026-07-20 21:54:39.003+00
303	5	1efafc223282f6ffe2714ef6e9e0e2dab32ea040fa1163924ef48f85774dad54	2026-07-21 05:54:39.633+00	2026-07-20 21:54:39.633+00	2026-07-20 21:58:28.533+00
304	5	eff1f1e12a84d343da5032847067c1e557d5c015cc84e45512da366b1d9b0bf6	2026-07-21 18:31:49.494+00	2026-07-21 10:31:49.494+00	2026-07-21 10:50:24.36+00
305	5	d3b653cd9bcb2fc2956522cba9ab68a07395ae00591b0d52c8636f47a1d8f5cd	2026-07-21 18:50:24.958+00	2026-07-21 10:50:24.958+00	2026-07-21 11:06:12.358+00
306	5	82e39cbdc8ddb64bc2942201510e90342dd02a18ca924b0132b7655d92acd70e	2026-07-21 19:07:02.204+00	2026-07-21 11:07:02.204+00	\N
307	5	9d9069c160c2b83d62b6346f2faf9496c4abccdcab9155427ba687ed96fda41f	2026-07-21 19:11:07.343+00	2026-07-21 11:11:07.343+00	\N
308	5	5ddc3f1aa8cd18de1ef51bf68660b7927924cfc28e571fe77c5d6aa88724e391	2026-07-21 19:13:40.705+00	2026-07-21 11:13:40.705+00	2026-07-21 11:30:49.612+00
309	5	21ab34fb99a4456870666bc18aab88a2835e51e90e4e149d8eb58fd0b82e5674	2026-07-21 19:30:50.084+00	2026-07-21 11:30:50.084+00	\N
310	5	d332236870f2ad386c4e941e63372fd9d803caae0c616c527349c407a33947d8	2026-07-21 19:31:04.649+00	2026-07-21 11:31:04.649+00	\N
311	5	070e2776a7914bd760b4ee1e7a4900532078083db01ca235c61437eda133b253	2026-07-21 19:34:01.339+00	2026-07-21 11:34:01.339+00	\N
312	5	487beb060c73ac48d387a4ba413d7dcf568780d93694cc8bb35c85f8d5132706	2026-07-21 19:41:45.966+00	2026-07-21 11:41:45.966+00	\N
313	5	4da1fdb6dfd866d6472c60296b99b76a1033864c349e675a815f20dc168dd03d	2026-07-20 19:48:05.893+00	2026-07-20 11:48:05.894+00	\N
314	5	59d7095ccb2926fbd4f24e7ece2d5b6f68cfa5d7ab39aef6670a4023a250c0bb	2026-07-21 19:49:05.093+00	2026-07-21 11:49:05.093+00	\N
315	5	68eedf579cf9551af266039359293434572db5e1937442d84b3640ca76cd928f	2026-07-21 20:03:57.894+00	2026-07-21 12:03:57.894+00	\N
316	5	021187cb2cb5cd387131737a949ee84e3fbfa80d2caa5be532a28bdf357646ca	2026-07-21 20:04:40.605+00	2026-07-21 12:04:40.605+00	2026-07-21 12:06:11.126+00
317	5	02ad4c8b81119920bbf5b391fb6daa0cd3b90723cd7a71f409a0f9fee148a12a	2026-07-21 20:10:17.753+00	2026-07-21 12:10:17.753+00	\N
318	5	179918fc356675a9e71f3c4814476835c35155f87c1711e33a4828178767bf25	2026-07-21 20:15:50.485+00	2026-07-21 12:15:50.486+00	2026-07-21 12:19:43.884+00
319	5	9e0df1318f4d51137d64b1b1613b338dfedccea099d080c59525b6897894a836	2026-07-21 20:23:17.9+00	2026-07-21 12:23:17.9+00	\N
320	5	3c36decbc2366db3b83d42ecd1805ccc8f872bbb8697cea9ff009ad18b742cc4	2026-07-21 21:03:16.239+00	2026-07-21 13:03:16.239+00	2026-07-21 13:23:23.207+00
321	5	26111e1d18163e09986239d1efd38a8bc5050a0310a1f2c9fb6cc2a5fc0725c8	2026-07-21 21:23:23.667+00	2026-07-21 13:23:23.667+00	\N
322	5	65c83673c0cfba8e5edd6f924900c13a9f3c4bc4953503d4f04c4660b7a8c327	2026-07-21 21:27:01.521+00	2026-07-21 13:27:01.522+00	\N
323	13	558d4fb70f052d74a8b1e4e71df167fae919f91963f2d1934e21d06ee6e6ad12	2026-07-21 22:46:07.249+00	2026-07-21 14:46:07.249+00	2026-07-21 14:50:08.181+00
324	13	1504803c9cc02d32f327c374dfae02b41bd77505b5eb6d23f084f1d61d60e417	2026-07-22 02:25:30.191+00	2026-07-21 18:25:30.191+00	2026-07-21 18:28:59.647+00
325	13	1f9c18336392c9d84b18b9ac37998d2898f8b68d0d6cf5b313dce0d7ce83db63	2026-07-22 02:29:52.869+00	2026-07-21 18:29:52.869+00	2026-07-21 18:53:55.879+00
327	5	5925f371504185a107688d9c6595abcbc9848311f8230c7979e4285b3a88b7c2	2026-07-22 03:01:03.788+00	2026-07-21 19:01:03.789+00	2026-07-21 19:02:27.971+00
328	16	c0dd34021c1efb1da1ce30ce3a2a875429ee0512253d1b9ff20465f6c7b4ec4e	2026-07-22 03:02:42.905+00	2026-07-21 19:02:42.905+00	2026-07-21 19:05:43.108+00
329	16	d249ef1b49bb00e86fb570e28eb1a4e83a146f6e2edc62682ebb1cd00281ee08	2026-07-22 03:05:53.15+00	2026-07-21 19:05:53.15+00	2026-07-21 19:06:21.66+00
330	17	9812d6bb24bd6126fdde31b0b5c8e407386f7cd4fce259fdbd1cb64dc0265073	2026-07-22 03:06:36.725+00	2026-07-21 19:06:36.725+00	2026-07-21 19:07:06.968+00
331	13	0abe2fc7997e4c274ba6662f063adad7c11453a169ba6dbf18d483f1e4910721	2026-07-22 03:07:44.907+00	2026-07-21 19:07:44.907+00	2026-07-21 19:08:28.223+00
326	13	fc1cc28af3938700cb165e96f77886eda9d1111d78e14f72c765ff92e4ee65e8	2026-07-22 02:53:56.344+00	2026-07-21 18:53:56.345+00	2026-07-21 19:12:54.143+00
333	13	a1f26eb21eb073abaaca594c6687892196f28ee9d59132d7c1bcc9841e8dca4a	2026-07-22 03:12:54.584+00	2026-07-21 19:12:54.584+00	2026-07-21 19:12:56.127+00
334	13	8f85c4f89b82050c070985aba3bc772573cd00078b4782c755e9e16bd71df417	2026-07-22 03:12:56.605+00	2026-07-21 19:12:56.605+00	2026-07-21 19:24:42.244+00
332	17	418f8c13bed0b3bcf2e124f116a3791b2d036dbde1a6787acc958ba00ec7839c	2026-07-22 03:08:35.547+00	2026-07-21 19:08:35.547+00	2026-07-21 19:30:44.833+00
335	17	e5c976c8508069c29d7adae4ae88cb4674ffcc500bf0332a55dfd76e32a9427c	2026-07-22 03:30:45.313+00	2026-07-21 19:30:45.314+00	2026-07-21 19:45:46.928+00
337	17	ae603f3c4bced5d50abcaae4c88044000ca307002f87fb9d013440c74edc21ef	2026-07-22 03:45:56.152+00	2026-07-21 19:45:56.152+00	\N
336	13	269bf7811fad4327094d2e51fe30576d6e4d4e5704888a594f8085353b3e6520	2026-07-22 03:31:19.58+00	2026-07-21 19:31:19.58+00	2026-07-21 20:05:07.643+00
338	16	8de4206517c8724c90ebfe0d6602b2a41a675c4041f0c33e568af05b86c7d996	2026-07-22 04:05:13.581+00	2026-07-21 20:05:13.581+00	2026-07-21 20:27:42.097+00
339	13	d54e24191ffb86787a7c80b3fed80b41993b279ef1ed7f2784ed9e44006e9e4a	2026-07-22 04:29:25.845+00	2026-07-21 20:29:25.845+00	2026-07-21 20:50:55.293+00
340	13	91d10161c8ddf8a8e0e25871a66ef928371bc282126fd224484a6dc1af029f78	2026-07-22 04:50:55.806+00	2026-07-21 20:50:55.807+00	2026-07-21 20:50:57.085+00
341	13	99890457daafb436aedee6e8f227e76aab4f6c4bcaaff0e9dd476ce41182a759	2026-07-22 04:50:57.808+00	2026-07-21 20:50:57.808+00	\N
342	13	fe185ab55cf9d87ad7265cf6e43ce42eb7c006003f5f50edfc3c295cb7fe74e8	2026-07-22 05:25:13.543+00	2026-07-21 21:25:13.543+00	2026-07-21 21:25:47.79+00
343	13	85ecb5ecf9660dafb8f997d28cad9b8edf7946fbdd725d364975b9ad25efec2c	2026-07-22 05:26:14.402+00	2026-07-21 21:26:14.402+00	2026-07-21 21:26:33.036+00
344	17	bda27d46624595500697c632d31e23b3f1d449ea34dac964a69f31baf6a86252	2026-07-22 05:26:39.267+00	2026-07-21 21:26:39.267+00	2026-07-21 21:51:12.311+00
345	17	8c3eb7d5e9fb7d1d83504a309ec7978c1ce73cca23c30e395edc55d7ddb2e263	2026-07-22 05:51:12.799+00	2026-07-21 21:51:12.799+00	2026-07-21 22:47:17.073+00
346	17	50cf1dae918a2fd812739a5916b176530ca71961162d7b0d83fcca0b23f52ce7	2026-07-22 06:47:17.571+00	2026-07-21 22:47:17.571+00	2026-07-21 22:47:45.122+00
347	17	43b857b60d1dc3526d8c31480bd6d11f1df99876c0ac6aba71507cfde61aa092	2026-07-22 06:47:51.768+00	2026-07-21 22:47:51.768+00	2026-07-21 22:56:22.468+00
348	5	82d34ace6738b82370da1f07251c257a4fcd607e20577717c12badd2cbb3fb30	2026-07-22 06:56:30.782+00	2026-07-21 22:56:30.782+00	2026-07-21 22:56:40.191+00
349	17	fe45502d183fe5baf8a1b76a629ea571b9b76c446ab0d900129fe61fdc614971	2026-07-22 06:56:48.298+00	2026-07-21 22:56:48.298+00	2026-07-21 22:58:47.5+00
350	17	d65a987b63c1075ce11107638a7cc32cf1eb37378c1143ac69df063eea7259ee	2026-07-22 06:59:01.982+00	2026-07-21 22:59:01.982+00	2026-07-21 23:01:44.523+00
351	17	6d5fa1c070623c742eb99b943d4f739f7e92339ac68d31352a778dad4e16630e	2026-07-22 07:01:52.309+00	2026-07-21 23:01:52.309+00	2026-07-21 23:04:15.502+00
352	5	23c2055f2c10740c2622460608e7c675cb981967e207e6b537e9a992f881f277	2026-07-22 07:04:23.766+00	2026-07-21 23:04:23.766+00	2026-07-21 23:04:29.208+00
353	17	be566f43e11f0034a89cbcf324748c41fc54a68a66053c0dd7f5125e98a9b1bb	2026-07-22 07:04:36.112+00	2026-07-21 23:04:36.112+00	\N
354	17	21f78ea1f094a08b3136db49e012d79d81548233031ace63a969449931c3faa7	2026-07-22 11:45:27.996+00	2026-07-22 03:45:27.996+00	2026-07-22 04:27:28.304+00
355	17	4d414be683996034ad22162b2012d13452e73d3db1d7f5fe866ee280c9911b80	2026-07-22 12:27:28.8+00	2026-07-22 04:27:28.8+00	2026-07-22 04:44:42.102+00
356	17	c4bfc7776b15090f804d8bdfc8446b52f36a8c2a439b9d7fe22da775d22bd5d6	2026-07-22 12:44:42.579+00	2026-07-22 04:44:42.58+00	2026-07-22 05:09:25.268+00
357	17	f0ec66d6939c79e253b57872f28e6cac0bf41ef41bd671973f9974289d8c13fe	2026-07-22 13:09:26.172+00	2026-07-22 05:09:26.173+00	2026-07-22 05:28:25.727+00
358	17	46a7e162b61daeb7e8a606141626de8ffbfca72ebdd7a54468b5bdce4c6e9f3e	2026-07-22 13:28:26.218+00	2026-07-22 05:28:26.219+00	\N
\.


--
-- Data for Name: representantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.representantes (id_representante, telefono, direccion, created_at, updated_at, cedula_rep, nombre1, nombre2, apellido1, apellido2, correo) FROM stdin;
1	0414-1112223	Sector Centro	2026-07-17 22:00:27.976+00	2026-07-17 22:00:27.976+00	V-12345678	José	Antonio	Martínez	López	jose.martinez@email.com
2	0412-2223334	Urb. Los Pinos	2026-07-17 22:00:28.069+00	2026-07-17 22:00:28.069+00	V-23456789	María	Isabel	González	Pérez	maria.gonzalez@email.com
3	0416-3334445	Barrio Sucre	2026-07-17 22:00:28.151+00	2026-07-17 22:00:28.151+00	V-34567890	Carlos	Andrés	Rodríguez	Hernández	carlos.rodriguez@email.com
4	0424-4445556	Av. Bolivar	2026-07-17 22:00:28.233+00	2026-07-17 22:00:28.233+00	V-45678901	Ana	Victoria	Sánchez	Díaz	ana.sanchez@email.com
5	0414-5556667	Sector El Carmen	2026-07-17 22:00:28.314+00	2026-07-17 22:00:28.314+00	V-56789012	Pedro	Luis	López	García	pedro.lopez@email.com
6	0412-6667778	Urb. Las Acacias	2026-07-17 22:00:28.395+00	2026-07-17 22:00:28.395+00	V-67890123	Laura	Elena	Fernández	Torres	laura.fernandez@email.com
7	0416-7778889	Sector La Paz	2026-07-17 22:00:28.477+00	2026-07-17 22:00:28.477+00	V-78901234	Diego	Alejandro	Ramírez	Vargas	diego.ramirez@email.com
8	0424-8889990	Barrio Obrero	2026-07-17 22:00:28.559+00	2026-07-17 22:00:28.559+00	V-89012345	Sofía	Beatriz	Castillo	Rivas	sofia.castillo@email.com
9	0414-9990001	Urb. San Jose	2026-07-17 22:00:28.639+00	2026-07-17 22:00:28.639+00	V-90123456	Andrés	Eduardo	Morales	Castro	andres.morales@email.com
10	0412-0001112	Sector Bella Vista	2026-07-17 22:00:28.72+00	2026-07-17 22:00:28.72+00	V-01234567	Valentina	Lucía	Ortiz	Mendoza	valentina.ortiz@email.com
13	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33298205	REPRESENTANTE	\N	BUSTAMANTE	\N	rep.33298205@example.com
14	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33299583	REPRESENTANTE	\N	CASTRO	\N	rep.33299583@example.com
15	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33283250	REPRESENTANTE	\N	CEDE�O	\N	rep.33283250@example.com
16	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32901874	REPRESENTANTE	\N	RAMIREZ	\N	rep.32901874@example.com
17	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34716263	REPRESENTANTE	\N	RAMIREZ	\N	rep.34716263@example.com
18	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988655	REPRESENTANTE	\N	BARONA	\N	rep.33988655@example.com
19	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33214429	REPRESENTANTE	\N	MONTOYA	\N	rep.33214429@example.com
20	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34775253	REPRESENTANTE	\N	PEREZ	\N	rep.34775253@example.com
21	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33299588	REPRESENTANTE	\N	PRATO	\N	rep.33299588@example.com
22	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33368057	REPRESENTANTE	\N	ROJAS	\N	rep.33368057@example.com
23	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33215013	REPRESENTANTE	\N	ABRANTES	\N	rep.33215013@example.com
24	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845040	REPRESENTANTE	\N	CALDERON	\N	rep.33845040@example.com
25	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34839736	REPRESENTANTE	\N	CUELLAR	\N	rep.34839736@example.com
26	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33368276	REPRESENTANTE	\N	PINTO	\N	rep.33368276@example.com
27	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34096882	REPRESENTANTE	\N	VIVAS	\N	rep.34096882@example.com
28	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911728	REPRESENTANTE	\N	DELGADO	\N	rep.34911728@example.com
29	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845283	REPRESENTANTE	\N	DOMINGUEZ	\N	rep.33845283@example.com
30	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33410976	REPRESENTANTE	\N	MEDINA	\N	rep.33410976@example.com
31	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34199945	REPRESENTANTE	\N	SALINAS	\N	rep.34199945@example.com
32	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33216846	REPRESENTANTE	\N	YA�ES	\N	rep.33216846@example.com
33	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33217420	REPRESENTANTE	\N	AGUILAR	\N	rep.33217420@example.com
34	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845614	REPRESENTANTE	\N	CASANOVA	\N	rep.33845614@example.com
35	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34996168	REPRESENTANTE	\N	CHACON	\N	rep.34996168@example.com
36	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34386129	REPRESENTANTE	\N	GUERRERO	\N	rep.34386129@example.com
37	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33439455	REPRESENTANTE	\N	SALAZAR	\N	rep.33439455@example.com
38	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34996169	REPRESENTANTE	\N	CHACON	\N	rep.34996169@example.com
39	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33909933	REPRESENTANTE	\N	CONTRERAS	\N	rep.33909933@example.com
40	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606392	REPRESENTANTE	\N	CORDERO	\N	rep.33606392@example.com
41	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33217516	REPRESENTANTE	\N	NOCUA	\N	rep.33217516@example.com
42	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34716688	REPRESENTANTE	\N	SALGADO	\N	rep.34716688@example.com
43	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975567	REPRESENTANTE	\N	CASAS	\N	rep.33975567@example.com
44	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33254206	REPRESENTANTE	\N	MENDOZA	\N	rep.33254206@example.com
45	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35067018	REPRESENTANTE	\N	ROZO	\N	rep.35067018@example.com
46	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606985	REPRESENTANTE	\N	RUIZ	\N	rep.33606985@example.com
47	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34835081	REPRESENTANTE	\N	RUIZ	\N	rep.34835081@example.com
48	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272089	REPRESENTANTE	\N	CASTRO	\N	rep.33272089@example.com
49	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35066779	REPRESENTANTE	\N	JAIMEZ	\N	rep.35066779@example.com
50	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975592	REPRESENTANTE	\N	MONSALVE	\N	rep.33975592@example.com
51	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33775197	REPRESENTANTE	\N	PE�A	\N	rep.33775197@example.com
52	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35067309	REPRESENTANTE	\N	VARGAS	\N	rep.35067309@example.com
53	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975750	REPRESENTANTE	\N	AMADO	\N	rep.33975750@example.com
54	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845103	REPRESENTANTE	\N	CHACON	\N	rep.33845103@example.com
55	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272219	REPRESENTANTE	\N	DELGADO	\N	rep.33272219@example.com
56	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36043775	REPRESENTANTE	\N	MORENO	\N	rep.36043775@example.com
57	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35119799	REPRESENTANTE	\N	SANCHEZ	\N	rep.35119799@example.com
58	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845249	REPRESENTANTE	\N	ALVARADO	\N	rep.33845249@example.com
59	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36265334	REPRESENTANTE	\N	HERNANDEZ	\N	rep.36265334@example.com
60	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33302476	REPRESENTANTE	\N	MOLINA	\N	rep.33302476@example.com
61	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975997	REPRESENTANTE	\N	PE�A	\N	rep.33975997@example.com
62	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36013320	REPRESENTANTE	\N	RAMIREZ	\N	rep.36013320@example.com
63	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988226	REPRESENTANTE	\N	GALVIS	\N	rep.33988226@example.com
64	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36033224	REPRESENTANTE	\N	GAMEZ	\N	rep.36033224@example.com
65	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367702	REPRESENTANTE	\N	RAMIREZ	\N	rep.33367702@example.com
66	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845429	REPRESENTANTE	\N	VARELA	\N	rep.33845429@example.com
67	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36273760	REPRESENTANTE	\N	VEGA	\N	rep.36273760@example.com
68	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975599	REPRESENTANTE	\N	ANGULO	\N	rep.33975599@example.com
69	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36285065	REPRESENTANTE	\N	MORA	\N	rep.36285065@example.com
70	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367704	REPRESENTANTE	\N	NIETO	\N	rep.33367704@example.com
71	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34096210	REPRESENTANTE	\N	PATI�O	\N	rep.34096210@example.com
72	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36184100	REPRESENTANTE	\N	ROJAS	\N	rep.36184100@example.com
73	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367959	REPRESENTANTE	\N	BELLO	\N	rep.33367959@example.com
74	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36525023	REPRESENTANTE	\N	CHACON	\N	rep.36525023@example.com
75	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098642	REPRESENTANTE	\N	GONZALEZ	\N	rep.34098642@example.com
76	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33987629	REPRESENTANTE	\N	PABON	\N	rep.33987629@example.com
77	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36236899	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.36236899@example.com
78	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33987840	REPRESENTANTE	\N	CUEVAS	\N	rep.33987840@example.com
79	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36334706	REPRESENTANTE	\N	MONSALBE	\N	rep.36334706@example.com
80	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36536931	REPRESENTANTE	\N	OMA�A	\N	rep.36536931@example.com
81	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33368012	REPRESENTANTE	\N	RAMIREZ	\N	rep.33368012@example.com
82	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098856	REPRESENTANTE	\N	VERA	\N	rep.34098856@example.com
83	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36504051	REPRESENTANTE	\N	CASANOVA	\N	rep.36504051@example.com
84	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098961	REPRESENTANTE	\N	CRUZ	\N	rep.34098961@example.com
85	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33410623	REPRESENTANTE	\N	MANTILLA	\N	rep.33410623@example.com
86	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988711	REPRESENTANTE	\N	QUINTERO	\N	rep.33988711@example.com
87	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36578540	REPRESENTANTE	\N	RIOS	\N	rep.36578540@example.com
88	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34099288	REPRESENTANTE	\N	ASENCIO	\N	rep.34099288@example.com
89	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36587426	REPRESENTANTE	\N	CARDENAS	\N	rep.36587426@example.com
90	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36565724	REPRESENTANTE	\N	GUERRERO	\N	rep.36565724@example.com
91	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33456069	REPRESENTANTE	\N	GUEVARA	\N	rep.33456069@example.com
92	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34092861	REPRESENTANTE	\N	QUINTANA	\N	rep.34092861@example.com
93	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36664116	REPRESENTANTE	\N	CARRILLO	\N	rep.36664116@example.com
94	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33456627	REPRESENTANTE	\N	LOPEZ	\N	rep.33456627@example.com
95	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36608924	REPRESENTANTE	\N	PINEDA	\N	rep.36608924@example.com
96	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34330104	REPRESENTANTE	\N	RANGEL	\N	rep.34330104@example.com
97	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125221	REPRESENTANTE	\N	ROZO	\N	rep.34125221@example.com
98	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33498708	REPRESENTANTE	\N	CHACON	\N	rep.33498708@example.com
99	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36706332	REPRESENTANTE	\N	FLORES	\N	rep.36706332@example.com
100	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34330539	REPRESENTANTE	\N	ORTIZ	\N	rep.34330539@example.com
101	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125655	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.34125655@example.com
102	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36695336	REPRESENTANTE	\N	ZAMBRANO	\N	rep.36695336@example.com
103	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36791651	REPRESENTANTE	\N	CACERES	\N	rep.36791651@example.com
104	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36730688	REPRESENTANTE	\N	CORTEZ	\N	rep.36730688@example.com
105	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34469781	REPRESENTANTE	\N	GALVIS	\N	rep.34469781@example.com
106	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557322	REPRESENTANTE	\N	PINZON	\N	rep.34557322@example.com
107	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33535723	REPRESENTANTE	\N	VALDERRAMA	\N	rep.33535723@example.com
108	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36928157	REPRESENTANTE	\N	GONZALEZ	\N	rep.36928157@example.com
109	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36129771	REPRESENTANTE	\N	LEDEZMA	\N	rep.36129771@example.com
110	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557448	REPRESENTANTE	\N	PABON	\N	rep.34557448@example.com
111	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606686	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.33606686@example.com
112	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34661406	REPRESENTANTE	\N	ZAMBRANO	\N	rep.34661406@example.com
113	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33695717	REPRESENTANTE	\N	CORDERO	\N	rep.33695717@example.com
114	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34575468	REPRESENTANTE	\N	CUELLAR	\N	rep.34575468@example.com
115	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36997545	REPRESENTANTE	\N	MENDEZ	\N	rep.36997545@example.com
116	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34716685	REPRESENTANTE	\N	SALGADO	\N	rep.34716685@example.com
117	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34875367	REPRESENTANTE	\N	GOMEZ	\N	rep.34875367@example.com
118	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37034725	REPRESENTANTE	\N	MARQUEZ	\N	rep.37034725@example.com
119	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988693	REPRESENTANTE	\N	MARTINEZ	\N	rep.33988693@example.com
120	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619410	REPRESENTANTE	\N	MIRANDA	\N	rep.34619410@example.com
121	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36506066	REPRESENTANTE	\N	CASANOVA	\N	rep.36506066@example.com
122	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37094303	REPRESENTANTE	\N	GOMEZ	\N	rep.37094303@example.com
123	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619461	REPRESENTANTE	\N	MARQUEZ	\N	rep.34619461@example.com
124	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125667	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.34125667@example.com
125	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37003688	REPRESENTANTE	\N	CRUZ	\N	rep.37003688@example.com
126	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125887	REPRESENTANTE	\N	LOPEZ	\N	rep.34125887@example.com
127	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34875100	REPRESENTANTE	\N	MEJIAS	\N	rep.34875100@example.com
128	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37210230	REPRESENTANTE	\N	MENDOZA	\N	rep.37210230@example.com
129	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37550339	REPRESENTANTE	\N	COLMENARES	\N	rep.37550339@example.com
130	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911139	REPRESENTANTE	\N	MENDOZA	\N	rep.34911139@example.com
131	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37424372	REPRESENTANTE	\N	RUIZ	\N	rep.37424372@example.com
132	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34661464	REPRESENTANTE	\N	TORRES	\N	rep.34661464@example.com
133	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34973860	REPRESENTANTE	\N	LEZAMA	\N	rep.34973860@example.com
134	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911790	REPRESENTANTE	\N	ROSALES	\N	rep.34911790@example.com
135	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35170549	REPRESENTANTE	\N	CARRASCO	\N	rep.35170549@example.com
136	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36453275	REPRESENTANTE	\N	MOYA	\N	rep.36453275@example.com
137	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36040740	REPRESENTANTE	\N	SUESCUN	\N	rep.36040740@example.com
138	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36770598	REPRESENTANTE	\N	USECHE	\N	rep.36770598@example.com
139	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37004074	REPRESENTANTE	\N	CRUZ	\N	rep.37004074@example.com
140	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367763	REPRESENTANTE	\N	BELLO	\N	rep.33367763@example.com
141	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32594942	REPRESENTANTE	\N	CACERES	\N	rep.32594942@example.com
142	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34835140	REPRESENTANTE	\N	DELGADO	\N	rep.34835140@example.com
143	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32372212	REPRESENTANTE	\N	MARTINEZ	\N	rep.32372212@example.com
144	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098997	REPRESENTANTE	\N	MEDINA	\N	rep.34098997@example.com
145	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35159873	REPRESENTANTE	\N	COLMENARES	\N	rep.35159873@example.com
146	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845205	REPRESENTANTE	\N	DOMINGUEZ	\N	rep.33845205@example.com
147	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619020	REPRESENTANTE	\N	GONZALEZ	\N	rep.34619020@example.com
148	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33254861	REPRESENTANTE	\N	RUIZ	\N	rep.33254861@example.com
149	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32889240	REPRESENTANTE	\N	VADILLO	\N	rep.32889240@example.com
150	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619255	REPRESENTANTE	\N	COLMENARES	\N	rep.34619255@example.com
151	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32932490	REPRESENTANTE	\N	MEDINA	\N	rep.32932490@example.com
152	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272362	REPRESENTANTE	\N	SUAREZ	\N	rep.33272362@example.com
153	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36032291	REPRESENTANTE	\N	VIVAS	\N	rep.36032291@example.com
154	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975238	REPRESENTANTE	\N	VIVAS	\N	rep.33975238@example.com
155	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32999074	REPRESENTANTE	\N	CRUZ	\N	rep.32999074@example.com
156	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33282776	REPRESENTANTE	\N	JAIMES	\N	rep.33282776@example.com
157	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36056870	REPRESENTANTE	\N	LIZARAZO	\N	rep.36056870@example.com
158	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619353	REPRESENTANTE	\N	MANRIQUE	\N	rep.34619353@example.com
159	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988100	REPRESENTANTE	\N	REYES	\N	rep.33988100@example.com
160	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36192724	REPRESENTANTE	\N	CONTRERAS	\N	rep.36192724@example.com
161	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988268	REPRESENTANTE	\N	DIAZ	\N	rep.33988268@example.com
162	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367891	REPRESENTANTE	\N	GALLO	\N	rep.33367891@example.com
163	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33216966	REPRESENTANTE	\N	NOVOA	\N	rep.33216966@example.com
164	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834223	REPRESENTANTE	\N	TRUJILLO	\N	rep.34834223@example.com
165	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36192749	REPRESENTANTE	\N	CONTRERAS	\N	rep.36192749@example.com
166	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33239171	REPRESENTANTE	\N	ESPINOZA	\N	rep.33239171@example.com
167	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988305	REPRESENTANTE	\N	GUEVARA	\N	rep.33988305@example.com
168	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834224	REPRESENTANTE	\N	TRUJILLO	\N	rep.34834224@example.com
169	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33456576	REPRESENTANTE	\N	VARON	\N	rep.33456576@example.com
170	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33239220	REPRESENTANTE	\N	ANGULO	\N	rep.33239220@example.com
171	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834292	REPRESENTANTE	\N	DIAZ	\N	rep.34834292@example.com
172	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36192944	REPRESENTANTE	\N	DOMINGUEZ	\N	rep.36192944@example.com
173	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988397	REPRESENTANTE	\N	LAGUADO	\N	rep.33988397@example.com
174	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606358	REPRESENTANTE	\N	PORRAS	\N	rep.33606358@example.com
175	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834580	REPRESENTANTE	\N	CHACON	\N	rep.34834580@example.com
176	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36196351	REPRESENTANTE	\N	DELGADO	\N	rep.36196351@example.com
177	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988673	REPRESENTANTE	\N	RAVELO	\N	rep.33988673@example.com
178	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33271529	REPRESENTANTE	\N	VELAZCO	\N	rep.33271529@example.com
179	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34096666	REPRESENTANTE	\N	CONTRERAS	\N	rep.34096666@example.com
180	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834860	REPRESENTANTE	\N	QUINTERO	\N	rep.34834860@example.com
181	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36215398	REPRESENTANTE	\N	RAMIREZ	\N	rep.36215398@example.com
182	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33271733	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.33271733@example.com
183	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845046	REPRESENTANTE	\N	FRANCO	\N	rep.33845046@example.com
184	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098511	REPRESENTANTE	\N	MANCILLA	\N	rep.34098511@example.com
185	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272314	REPRESENTANTE	\N	SANTANA	\N	rep.33272314@example.com
186	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34875166	REPRESENTANTE	\N	VARGAS	\N	rep.34875166@example.com
187	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845363	REPRESENTANTE	\N	ALCEDO	\N	rep.33845363@example.com
188	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098755	REPRESENTANTE	\N	CHACON	\N	rep.34098755@example.com
189	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272400	REPRESENTANTE	\N	GOMEZ	\N	rep.33272400@example.com
190	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911363	REPRESENTANTE	\N	PEREZ	\N	rep.34911363@example.com
191	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911712	REPRESENTANTE	\N	CAMARGO	\N	rep.34911712@example.com
192	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33283177	REPRESENTANTE	\N	CHINCHILLA	\N	rep.33283177@example.com
193	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36430043	REPRESENTANTE	\N	GOMEZ	\N	rep.36430043@example.com
194	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845541	REPRESENTANTE	\N	PAREDES	\N	rep.33845541@example.com
195	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125487	REPRESENTANTE	\N	RAMIREZ	\N	rep.34125487@example.com
196	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36453277	REPRESENTANTE	\N	BASTOS	\N	rep.36453277@example.com
197	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33283233	REPRESENTANTE	\N	ESTRADA	\N	rep.33283233@example.com
198	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988635	REPRESENTANTE	\N	LUGO	\N	rep.33988635@example.com
199	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125653	REPRESENTANTE	\N	MARTINEZ	\N	rep.34125653@example.com
200	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36049612	REPRESENTANTE	\N	MORENO	\N	rep.36049612@example.com
201	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36077180	REPRESENTANTE	\N	CHACON	\N	rep.36077180@example.com
202	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125781	REPRESENTANTE	\N	DELGADO	\N	rep.34125781@example.com
203	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33283305	REPRESENTANTE	\N	MORALES	\N	rep.33283305@example.com
204	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36495066	REPRESENTANTE	\N	PARADA	\N	rep.36495066@example.com
205	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33988755	REPRESENTANTE	\N	PARRA	\N	rep.33988755@example.com
206	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34093177	REPRESENTANTE	\N	DURAN	\N	rep.34093177@example.com
207	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36626432	REPRESENTANTE	\N	GUERRERO	\N	rep.36626432@example.com
208	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34125805	REPRESENTANTE	\N	PALENCIA	\N	rep.34125805@example.com
209	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36350069	REPRESENTANTE	\N	PARRA	\N	rep.36350069@example.com
210	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33302709	REPRESENTANTE	\N	VARELA	\N	rep.33302709@example.com
211	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34874833	REPRESENTANTE	\N	GARCIA	\N	rep.34874833@example.com
212	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36394510	REPRESENTANTE	\N	NAVARRO	\N	rep.36394510@example.com
213	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367860	REPRESENTANTE	\N	RAMIREZ	\N	rep.33367860@example.com
214	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34098929	REPRESENTANTE	\N	RODRIGUEZ	\N	rep.34098929@example.com
215	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36682055	REPRESENTANTE	\N	SANCHEZ	\N	rep.36682055@example.com
216	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33439035	REPRESENTANTE	\N	CARDENAS	\N	rep.33439035@example.com
217	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36744061	REPRESENTANTE	\N	CONDE	\N	rep.36744061@example.com
218	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34099088	REPRESENTANTE	\N	MEJIAS	\N	rep.34099088@example.com
219	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34875104	REPRESENTANTE	\N	MORENO	\N	rep.34875104@example.com
220	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36450093	REPRESENTANTE	\N	PARADA	\N	rep.36450093@example.com
221	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33535970	REPRESENTANTE	\N	ARBOLEDA	\N	rep.33535970@example.com
222	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911326	REPRESENTANTE	\N	GARCIA	\N	rep.34911326@example.com
223	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34159580	REPRESENTANTE	\N	MARQUEZ	\N	rep.34159580@example.com
224	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36809435	REPRESENTANTE	\N	MOLINA	\N	rep.36809435@example.com
225	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36524720	REPRESENTANTE	\N	VELAZCO	\N	rep.36524720@example.com
226	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911421	REPRESENTANTE	\N	HERNANDEZ	\N	rep.34911421@example.com
227	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36816590	REPRESENTANTE	\N	HERRERA	\N	rep.36816590@example.com
228	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36548462	REPRESENTANTE	\N	OCHOA	\N	rep.36548462@example.com
229	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33536465	REPRESENTANTE	\N	PEREZ	\N	rep.33536465@example.com
230	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34199553	REPRESENTANTE	\N	VERA	\N	rep.34199553@example.com
231	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34199912	REPRESENTANTE	\N	CONTRERAS	\N	rep.34199912@example.com
232	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33695641	REPRESENTANTE	\N	FLOREZ	\N	rep.33695641@example.com
233	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-10913708373	REPRESENTANTE	\N	GRIMALDO	\N	rep.10913708373@example.com
234	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37052650	REPRESENTANTE	\N	MIRANDA	\N	rep.37052650@example.com
235	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35118998	REPRESENTANTE	\N	ANGULO	\N	rep.35118998@example.com
236	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34199914	REPRESENTANTE	\N	OLIVEROS	\N	rep.34199914@example.com
237	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-11227341697	REPRESENTANTE	\N	QUIROZ	\N	rep.11227341697@example.com
238	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33737039	REPRESENTANTE	\N	RONDON	\N	rep.33737039@example.com
239	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37120326	REPRESENTANTE	\N	SANCHEZ	\N	rep.37120326@example.com
240	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34200016	REPRESENTANTE	\N	MARTINEZ	\N	rep.34200016@example.com
241	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35159278	REPRESENTANTE	\N	QUINTANA	\N	rep.35159278@example.com
242	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33975710	REPRESENTANTE	\N	ROSALES	\N	rep.33975710@example.com
243	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37269970	REPRESENTANTE	\N	SANCHEZ	\N	rep.37269970@example.com
244	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-35159628	REPRESENTANTE	\N	GUTIERREZ	\N	rep.35159628@example.com
245	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37383878	REPRESENTANTE	\N	MONSALVE	\N	rep.37383878@example.com
246	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33410326	REPRESENTANTE	\N	RAMIREZ	\N	rep.33410326@example.com
247	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34243751	REPRESENTANTE	\N	SANCHEZ	\N	rep.34243751@example.com
248	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-11217207124	REPRESENTANTE	\N	CASIQUE	\N	rep.11217207124@example.com
249	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557534	REPRESENTANTE	\N	CASTILLO	\N	rep.34557534@example.com
250	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36025159	REPRESENTANTE	\N	MEDINA	\N	rep.36025159@example.com
251	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34716862	REPRESENTANTE	\N	OROZCO	\N	rep.34716862@example.com
252	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-11363352421	REPRESENTANTE	\N	HERNANDEZ	\N	rep.11363352421@example.com
253	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36039861	REPRESENTANTE	\N	MAJANO	\N	rep.36039861@example.com
254	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34329950	REPRESENTANTE	\N	MU�OZ	\N	rep.34329950@example.com
255	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36806992	REPRESENTANTE	\N	RINCON	\N	rep.36806992@example.com
256	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36248002	REPRESENTANTE	\N	SOSA	\N	rep.36248002@example.com
257	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36271907	REPRESENTANTE	\N	COVILLA	\N	rep.36271907@example.com
258	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36331698	REPRESENTANTE	\N	GARCIA	\N	rep.36331698@example.com
259	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36156250	REPRESENTANTE	\N	COLMENARES	\N	rep.36156250@example.com
260	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33987807	REPRESENTANTE	\N	OLIVEROS	\N	rep.33987807@example.com
261	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32758412	REPRESENTANTE	\N	PE�ALOZA	\N	rep.32758412@example.com
262	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33253903	REPRESENTANTE	\N	SALERO	\N	rep.33253903@example.com
263	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33989357	REPRESENTANTE	\N	VIVAS	\N	rep.33989357@example.com
264	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34092972	REPRESENTANTE	\N	COLMENARES	\N	rep.34092972@example.com
265	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34504661	REPRESENTANTE	\N	LOPEZ	\N	rep.34504661@example.com
266	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272214	REPRESENTANTE	\N	RANGEL	\N	rep.33272214@example.com
267	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32785964	REPRESENTANTE	\N	SANCHEZ	\N	rep.32785964@example.com
268	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32888558	REPRESENTANTE	\N	ESCALANTE	\N	rep.32888558@example.com
269	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33296393	REPRESENTANTE	\N	OSORIO	\N	rep.33296393@example.com
270	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34834722	REPRESENTANTE	\N	ROJAS	\N	rep.34834722@example.com
271	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34386465	REPRESENTANTE	\N	TOSCANO	\N	rep.34386465@example.com
272	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34469954	REPRESENTANTE	\N	BELLO	\N	rep.34469954@example.com
273	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33296633	REPRESENTANTE	\N	OTERO	\N	rep.33296633@example.com
274	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32932762	REPRESENTANTE	\N	PASTRAN	\N	rep.32932762@example.com
275	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34875492	REPRESENTANTE	\N	SANCHEZ	\N	rep.34875492@example.com
276	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36125937	REPRESENTANTE	\N	CAMPOS	\N	rep.36125937@example.com
277	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32999169	REPRESENTANTE	\N	CASANOVA	\N	rep.32999169@example.com
278	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33296646	REPRESENTANTE	\N	OTERO	\N	rep.33296646@example.com
279	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34504544	REPRESENTANTE	\N	RUIZ	\N	rep.34504544@example.com
280	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33302228	REPRESENTANTE	\N	MENESES	\N	rep.33302228@example.com
281	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36125982	REPRESENTANTE	\N	PE�A	\N	rep.36125982@example.com
282	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557304	REPRESENTANTE	\N	PINZON	\N	rep.34557304@example.com
283	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-32999262	REPRESENTANTE	\N	SANGUINO	\N	rep.32999262@example.com
284	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33160450	REPRESENTANTE	\N	BELANDRIA	\N	rep.33160450@example.com
285	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557636	REPRESENTANTE	\N	HERNANDEZ	\N	rep.34557636@example.com
286	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36137980	REPRESENTANTE	\N	MEDINA	\N	rep.36137980@example.com
287	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33302520	REPRESENTANTE	\N	SIERRA	\N	rep.33302520@example.com
288	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33368197	REPRESENTANTE	\N	BARRIOS	\N	rep.33368197@example.com
289	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34619169	REPRESENTANTE	\N	CASTRO	\N	rep.34619169@example.com
290	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36183507	REPRESENTANTE	\N	HERNANDEZ	\N	rep.36183507@example.com
291	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33189019	REPRESENTANTE	\N	RINCON	\N	rep.33189019@example.com
292	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36242429	REPRESENTANTE	\N	ACERO	\N	rep.36242429@example.com
293	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33455930	REPRESENTANTE	\N	AREVALO	\N	rep.33455930@example.com
294	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33214290	REPRESENTANTE	\N	CONTRERAS	\N	rep.33214290@example.com
295	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34774967	REPRESENTANTE	\N	DURAN	\N	rep.34774967@example.com
296	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33214558	REPRESENTANTE	\N	CANDELARIO	\N	rep.33214558@example.com
297	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36249013	REPRESENTANTE	\N	SALINAS	\N	rep.36249013@example.com
298	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33536475	REPRESENTANTE	\N	SANCHEZ	\N	rep.33536475@example.com
299	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34775615	REPRESENTANTE	\N	VELAZCO	\N	rep.34775615@example.com
300	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36307638	REPRESENTANTE	\N	ALVARADO	\N	rep.36307638@example.com
301	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33253952	REPRESENTANTE	\N	CASTRO	\N	rep.33253952@example.com
302	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606168	REPRESENTANTE	\N	MORA	\N	rep.33606168@example.com
303	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911772	REPRESENTANTE	\N	RUIZ	\N	rep.34911772@example.com
304	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606212	REPRESENTANTE	\N	BASTOS	\N	rep.33606212@example.com
305	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36340506	REPRESENTANTE	\N	CARRERO	\N	rep.36340506@example.com
306	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33254472	REPRESENTANTE	\N	GARCIA	\N	rep.33254472@example.com
307	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34996197	REPRESENTANTE	\N	VERA	\N	rep.34996197@example.com
308	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606878	REPRESENTANTE	\N	CARRILLO	\N	rep.33606878@example.com
309	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34996370	REPRESENTANTE	\N	MENDEZ	\N	rep.34996370@example.com
310	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36376030	REPRESENTANTE	\N	PEREIRA	\N	rep.36376030@example.com
311	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33272126	REPRESENTANTE	\N	RINCON	\N	rep.33272126@example.com
312	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845120	REPRESENTANTE	\N	ALVAREZ	\N	rep.33845120@example.com
313	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33283187	REPRESENTANTE	\N	CAICEDO	\N	rep.33283187@example.com
314	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36397375	REPRESENTANTE	\N	CASTILLO	\N	rep.36397375@example.com
315	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34996371	REPRESENTANTE	\N	MENDEZ	\N	rep.34996371@example.com
316	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33367953	REPRESENTANTE	\N	CONTRERAS	\N	rep.33367953@example.com
317	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36203792	REPRESENTANTE	\N	ONTIVEROS	\N	rep.36203792@example.com
318	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36666209	REPRESENTANTE	\N	PE�A	\N	rep.36666209@example.com
319	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33845736	REPRESENTANTE	\N	RAMIREZ	\N	rep.33845736@example.com
320	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33987803	REPRESENTANTE	\N	CACERES	\N	rep.33987803@example.com
321	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36264428	REPRESENTANTE	\N	CHACON	\N	rep.36264428@example.com
322	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33410476	REPRESENTANTE	\N	ZAPATA	\N	rep.33410476@example.com
323	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33410720	REPRESENTANTE	\N	CARRERO	\N	rep.33410720@example.com
324	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37118673	REPRESENTANTE	\N	DELGADO	\N	rep.37118673@example.com
325	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33989315	REPRESENTANTE	\N	MIRANDA	\N	rep.33989315@example.com
326	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36528200	REPRESENTANTE	\N	PARRA	\N	rep.36528200@example.com
327	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34159249	REPRESENTANTE	\N	COLMENARES	\N	rep.34159249@example.com
328	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37128935	REPRESENTANTE	\N	PARRA	\N	rep.37128935@example.com
329	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37100469	REPRESENTANTE	\N	SANCHEZ	\N	rep.37100469@example.com
330	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33439497	REPRESENTANTE	\N	SANTAFE	\N	rep.33439497@example.com
331	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37134603	REPRESENTANTE	\N	CACERES	\N	rep.37134603@example.com
332	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33439771	REPRESENTANTE	\N	GARCIA	\N	rep.33439771@example.com
333	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-11214504957	REPRESENTANTE	\N	GUERRERO	\N	rep.11214504957@example.com
334	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34469157	REPRESENTANTE	\N	SANTOS	\N	rep.34469157@example.com
335	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34911471	REPRESENTANTE	\N	BRI�EZ	\N	rep.34911471@example.com
336	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37167497	REPRESENTANTE	\N	MORENO	\N	rep.37167497@example.com
337	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33456593	REPRESENTANTE	\N	OLIVEROS	\N	rep.33456593@example.com
338	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34469738	REPRESENTANTE	\N	RAMIREZ	\N	rep.34469738@example.com
339	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557370	REPRESENTANTE	\N	CARVAJAL	\N	rep.34557370@example.com
340	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606631	REPRESENTANTE	\N	GARCIA	\N	rep.33606631@example.com
341	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37174423	REPRESENTANTE	\N	MELO	\N	rep.37174423@example.com
342	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33606723	REPRESENTANTE	\N	CARRILLO	\N	rep.33606723@example.com
343	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34716678	REPRESENTANTE	\N	MENDEZ	\N	rep.34716678@example.com
344	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-37302186	REPRESENTANTE	\N	USECHE	\N	rep.37302186@example.com
345	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33844890	REPRESENTANTE	\N	CONDE	\N	rep.33844890@example.com
346	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-11321001153	REPRESENTANTE	\N	GALVIZ	\N	rep.11321001153@example.com
347	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36177007	REPRESENTANTE	\N	LOPEZ	\N	rep.36177007@example.com
348	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33976094	REPRESENTANTE	\N	NI�O	\N	rep.33976094@example.com
349	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36459500	REPRESENTANTE	\N	NOVOA	\N	rep.36459500@example.com
350	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34557359	REPRESENTANTE	\N	PE�A	\N	rep.34557359@example.com
351	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34159468	REPRESENTANTE	\N	CORTEZ	\N	rep.34159468@example.com
352	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-36747648	REPRESENTANTE	\N	PERNIA	\N	rep.36747648@example.com
353	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-33737566	REPRESENTANTE	\N	CARDENAS	\N	rep.33737566@example.com
354	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34199560	REPRESENTANTE	\N	JURGENSEN	\N	rep.34199560@example.com
355	0000-0000000	\N	2026-07-18 23:06:44.189411+00	2026-07-18 23:06:44.189411+00	REP-34330376	REPRESENTANTE	\N	DUQUE	\N	rep.34330376@example.com
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id_rol, nombre, descripcion, created_at, updated_at) FROM stdin;
4	Administrador	Administrador del sistema	2026-07-17 22:00:18.837+00	2026-07-17 22:00:18.837+00
8	Control de Estudios	Gestión academica	2026-07-17 22:00:19.177+00	2026-07-17 22:00:19.177+00
5	Docente	Profesor de asignatura	2026-07-17 22:00:19.499+00	2026-07-17 22:00:19.499+00
7	Coordinador	Supervisión académica y de personal	2026-07-17 22:00:19.818+00	2026-07-17 22:00:19.818+00
\.


--
-- Data for Name: secciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.secciones (id_seccion, id_periodo, id_grado, letra, id_aula, capacidad_maxima, created_at, updated_at, id_docente_guia) FROM stdin;
3	1	2	A	3	35	2026-07-18 03:02:32.879+00	2026-07-18 03:02:32.879+00	\N
4	1	2	B	4	30	2026-07-18 03:02:33.183+00	2026-07-18 03:02:33.183+00	\N
6	1	3	B	6	40	2026-07-18 03:02:33.795+00	2026-07-18 03:02:33.795+00	\N
7	1	4	A	7	40	2026-07-18 03:02:34.101+00	2026-07-18 03:02:34.101+00	\N
1	1	1	A	1	30	2026-07-18 03:02:32.26+00	2026-07-18 21:16:18.637+00	1
2	1	1	B	2	30	2026-07-18 03:02:32.573+00	2026-07-18 21:16:36.689+00	1
11	1	1	C	12	30	2026-07-18 22:36:53.287+00	2026-07-18 22:36:53.287+00	4
12	1	2	C	13	30	2026-07-18 22:37:28.457+00	2026-07-18 22:37:28.457+00	5
13	1	4	C	14	30	2026-07-18 22:37:52.13+00	2026-07-18 22:37:52.13+00	6
14	1	5	C	15	30	2026-07-18 22:38:47.875+00	2026-07-18 22:38:47.875+00	8
10	1	5	B	18	50	2026-07-18 03:02:35.016+00	2026-07-18 22:43:15.231+00	1
9	1	5	A	17	30	2026-07-18 03:02:34.711+00	2026-07-18 22:43:37.011+00	1
8	1	4	B	16	35	2026-07-18 03:02:34.406+00	2026-07-18 22:43:48.569+00	1
5	1	3	A	5	34	2026-07-18 03:02:33.49+00	2026-07-18 23:48:06.207+00	1
19	3	1	A	7	30	2026-07-21 22:55:57.199+00	2026-07-21 22:55:57.199+00	5
20	3	1	B	6	30	2026-07-21 22:57:43.13+00	2026-07-21 22:57:43.13+00	4
21	3	1	C	2	30	2026-07-21 23:00:57.46+00	2026-07-21 23:00:57.46+00	6
\.


--
-- Data for Name: tipo_plan_estudio; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tipo_plan_estudio (id_tipo_plan, nombre, resolucion, estatus, created_at, updated_at) FROM stdin;
1	Plan Oficial 32011	Gaceta Oficial 32011	Activo	2026-07-18 21:21:41.40606+00	2026-07-18 21:21:41.40606+00
2	Plan Oficial 31059	Gaceta Oficial 31059	Activo	2026-07-18 21:21:41.537829+00	2026-07-18 21:21:41.537829+00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.usuarios (id_usuario, id_rol, username, password_hash, estatus, failed_attempts, locked_until, token_version, ultimo_acceso, cedula, nombre1, nombre2, apellido1, apellido2, fecha_nac, telefono, id_especialidad, token_qr, estatus_docente, created_at, updated_at, correo) FROM stdin;
2	8	jose.gonzalez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-12345678	Jose	\N	Gonzalez	\N	\N	0412-2345678	\N	\N	Activo	2026-07-17 22:00:27.039+00	2026-07-17 22:00:27.039+00	\N
6	5	pedro.martinez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-16789012	Pedro	\N	Martinez	\N	\N	0412-6789012	\N	\N	Activo	2026-07-17 22:00:27.383+00	2026-07-17 22:00:27.383+00	\N
7	5	luisa.gomez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-17890123	Luisa	\N	Gomez	\N	\N	0416-7890123	\N	\N	Activo	2026-07-17 22:00:27.475+00	2026-07-17 22:00:27.475+00	\N
8	5	carlos.diaz	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-18901234	Carlos	\N	Diaz	\N	\N	0424-8901234	\N	\N	Activo	2026-07-17 22:00:27.556+00	2026-07-17 22:00:27.556+00	\N
9	5	marta.torres	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-19012345	Marta	\N	Torres	\N	\N	0414-9012345	\N	\N	Activo	2026-07-17 22:00:27.641+00	2026-07-17 22:00:27.641+00	\N
10	5	jorge.ruiz	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-20123456	Jorge	\N	Ruiz	\N	\N	0412-0123456	\N	\N	Activo	2026-07-17 22:00:27.724+00	2026-07-17 22:00:27.724+00	\N
11	5	diana.morales	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-21234567	Diana	\N	Morales	\N	\N	0414-1122334	\N	\N	Activo	2026-07-17 22:00:27.808+00	2026-07-17 22:00:27.808+00	\N
12	5	ricardo.navas	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-22345678	Ricardo	\N	Navas	\N	\N	0412-2233445	\N	\N	Activo	2026-07-17 22:00:27.892+00	2026-07-17 22:00:27.892+00	\N
13	4	admin	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	35	2026-07-21 21:26:14.569+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:41.773+00	2026-07-21 21:26:33.187+00	\N
14	8	control	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	5	2026-07-20 17:37:52.504+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:41.943+00	2026-07-20 17:37:52.504+00	\N
4	5	luis.fernandez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-14567890	Luis	\N	Fernandez	\N	\N	0424-4567890	\N	\N	Activo	2026-07-17 22:00:27.207+00	2026-07-17 22:53:33.757+00	\N
1	4	V-10234567	$2b$10$v.1/fLptLCQsILqibvr4LOOLNkSaN4zxZddxqdjBs345fEGl5Anfi	Inactivo	0	\N	1	2026-07-17 22:43:31.894+00	V-10234567	Maria	\N	Perez	\N	\N	0414-1234567	\N	\N	Activo	2026-07-17 22:00:26.949+00	2026-07-17 22:57:07.12+00	\N
5	5	ana.lopez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	17	2026-07-21 23:04:23.947+00	V-15678901	Ana	\N	Lopez	\N	\N	0414-5678901	\N	\N	Activo	2026-07-17 22:00:27.297+00	2026-07-21 23:04:29.362+00	\N
15	5	docente	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	11	2026-07-20 17:38:16.797+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:42.098+00	2026-07-20 18:24:48.581+00	\N
3	8	carmen.rodriguez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-13456789	Carmen	\N	Rodriguez	\N	\N	0416-3456789	\N	\N	Activo	2026-07-17 22:00:27.122+00	2026-07-17 22:42:10.011+00	\N
16	7	coordinador	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	7	2026-07-21 20:05:13.775+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:42.254+00	2026-07-21 20:05:13.775+00	\N
17	8	gregory	$2b$10$JR2esMYGjPPFPR7SMUPeBech748cAaXGKCe/8q.nuAdixUig5nX1S	Activo	0	\N	19	2026-07-22 03:45:28.16+00	V-30965286	Gregory	Steve	Duque	Mendoza	\N	0414-7399890	\N	\N	\N	2026-07-17 22:26:29.048+00	2026-07-22 03:45:28.16+00	gregory@local.liceo
\.


--
-- Data for Name: v_count; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.v_count (count) FROM stdin;
0
\.


--
-- Name: asignaturas_id_asignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asignaturas_id_asignatura_seq', 31, true);


--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_docente_id_asistencia_seq', 3, true);


--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_estudiante_id_asistencia_est_seq', 121, true);


--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.auditoria_id_auditoria_seq', 11, true);


--
-- Name: aulas_id_aula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aulas_id_aula_seq', 26, true);


--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bloques_horarios_id_bloque_seq', 7, true);


--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.calificaciones_id_calificacion_seq', 54, true);


--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dias_semana_id_dia_seq', 5, true);


--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.escala_calificaciones_id_escala_seq', 20, true);


--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.especialidades_id_especialidad_seq', 7, true);


--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 358, true);


--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 10, true);


--
-- Name: formatos_sabana_id_formato_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.formatos_sabana_id_formato_seq', 2, true);


--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.grados_anos_id_grado_seq', 5, true);


--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.historico_notas_certificadas_id_historico_seq', 15, true);


--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.horario_docente_id_horario_seq', 214, true);


--
-- Name: justificaciones_estudiante_id_justificacion_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_estudiante_id_justificacion_est_seq', 16, true);


--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_id_justificacion_seq', 1, false);


--
-- Name: login_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.login_audit_id_seq', 262, true);


--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.materia_pendiente_id_materia_pendiente_seq', 1, false);


--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.matricula_id_matricula_seq', 358, true);


--
-- Name: momentos_id_momento_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.momentos_id_momento_seq', 9, true);


--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notas_parciales_id_nota_seq', 81, true);


--
-- Name: observaciones_estudiante_id_observacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.observaciones_estudiante_id_observacion_seq', 4, true);


--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.periodos_escolares_id_periodo_seq', 4, true);


--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plan_estudio_id_plan_seq', 97, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 358, true);


--
-- Name: representantes_id_representante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.representantes_id_representante_seq', 355, true);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 8, true);


--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.secciones_id_seccion_seq', 21, true);


--
-- Name: tipo_plan_estudio_id_tipo_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tipo_plan_estudio_id_tipo_plan_seq', 3, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 17, true);


--
-- Name: asignaturas asignaturas_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_pkey PRIMARY KEY (id_asignatura);


--
-- Name: asistencia_docente asistencia_docente_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_pkey PRIMARY KEY (id_asistencia);


--
-- Name: asistencia_estudiante asistencia_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_pkey PRIMARY KEY (id_asistencia_est);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id_auditoria);


--
-- Name: aulas aulas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aulas
    ADD CONSTRAINT aulas_pkey PRIMARY KEY (id_aula);


--
-- Name: bloques_horarios bloques_horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bloques_horarios
    ADD CONSTRAINT bloques_horarios_pkey PRIMARY KEY (id_bloque);


--
-- Name: calificaciones calificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_pkey PRIMARY KEY (id_calificacion);


--
-- Name: dias_semana dias_semana_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dias_semana
    ADD CONSTRAINT dias_semana_pkey PRIMARY KEY (id_dia);


--
-- Name: escala_calificaciones escala_calificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.escala_calificaciones
    ADD CONSTRAINT escala_calificaciones_pkey PRIMARY KEY (id_escala);


--
-- Name: especialidades especialidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_nombre_key UNIQUE (nombre);


--
-- Name: especialidades especialidades_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidades
    ADD CONSTRAINT especialidades_pkey PRIMARY KEY (id_especialidad);


--
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id_estudiante);


--
-- Name: evaluaciones evaluaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id_evaluacion);


--
-- Name: formatos_sabana formatos_sabana_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.formatos_sabana
    ADD CONSTRAINT formatos_sabana_pkey PRIMARY KEY (id_formato);


--
-- Name: grados_anos grados_anos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.grados_anos
    ADD CONSTRAINT grados_anos_pkey PRIMARY KEY (id_grado);


--
-- Name: historico_notas_certificadas historico_notas_certificadas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_pkey PRIMARY KEY (id_historico);


--
-- Name: horario_docente horario_docente_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_pkey PRIMARY KEY (id_horario);


--
-- Name: justificaciones_estudiante justificaciones_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones_estudiante
    ADD CONSTRAINT justificaciones_estudiante_pkey PRIMARY KEY (id_justificacion_est);


--
-- Name: justificaciones justificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones
    ADD CONSTRAINT justificaciones_pkey PRIMARY KEY (id_justificacion);


--
-- Name: login_audit login_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.login_audit
    ADD CONSTRAINT login_audit_pkey PRIMARY KEY (id);


--
-- Name: materia_pendiente materia_pendiente_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_pkey PRIMARY KEY (id_materia_pendiente);


--
-- Name: matricula matricula_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matricula
    ADD CONSTRAINT matricula_pkey PRIMARY KEY (id_matricula);


--
-- Name: momentos momentos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.momentos
    ADD CONSTRAINT momentos_pkey PRIMARY KEY (id_momento);


--
-- Name: notas_parciales notas_parciales_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notas_parciales
    ADD CONSTRAINT notas_parciales_pkey PRIMARY KEY (id_nota);


--
-- Name: observaciones_estudiante observaciones_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.observaciones_estudiante
    ADD CONSTRAINT observaciones_estudiante_pkey PRIMARY KEY (id_observacion);


--
-- Name: periodos_escolares periodos_escolares_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.periodos_escolares
    ADD CONSTRAINT periodos_escolares_pkey PRIMARY KEY (id_periodo);


--
-- Name: plan_estudio plan_estudio_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_pkey PRIMARY KEY (id_plan);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: representantes representantes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_pkey PRIMARY KEY (id_representante);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- Name: secciones secciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_pkey PRIMARY KEY (id_seccion);


--
-- Name: tipo_plan_estudio tipo_plan_estudio_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tipo_plan_estudio
    ADD CONSTRAINT tipo_plan_estudio_pkey PRIMARY KEY (id_tipo_plan);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuarios usuarios_token_qr_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_token_qr_key UNIQUE (token_qr);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: asistencia_estudiante_id_matricula_fecha_id_horario; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX asistencia_estudiante_id_matricula_fecha_id_horario ON public.asistencia_estudiante USING btree (id_matricula, fecha, id_horario);


--
-- Name: asistencia_estudiante_id_matricula_fecha_id_horario_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX asistencia_estudiante_id_matricula_fecha_id_horario_key ON public.asistencia_estudiante USING btree (id_matricula, fecha, COALESCE(id_horario, 0));


--
-- Name: idx_login_audit_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_login_audit_created ON public.login_audit USING btree (created_at DESC);


--
-- Name: idx_login_audit_ip_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_login_audit_ip_created ON public.login_audit USING btree (ip_address, created_at DESC);


--
-- Name: idx_login_audit_username_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_login_audit_username_created ON public.login_audit USING btree (username, created_at DESC);


--
-- Name: idx_refresh_tokens_hash; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_refresh_tokens_hash ON public.refresh_tokens USING btree (token_hash);


--
-- Name: idx_refresh_tokens_usuario; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_refresh_tokens_usuario ON public.refresh_tokens USING btree (id_usuario);


--
-- Name: uq_usuarios_token_qr; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX uq_usuarios_token_qr ON public.usuarios USING btree (token_qr) WHERE (token_qr IS NOT NULL);


--
-- Name: asistencia_docente asistencia_docente_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_docente asistencia_docente_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.usuarios(id_usuario);


--
-- Name: asistencia_docente asistencia_docente_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario_docente(id_horario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_docente asistencia_docente_id_usuario_crea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_usuario_crea_fkey FOREIGN KEY (id_usuario_crea) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_docente asistencia_docente_id_usuario_modifica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_usuario_modifica_fkey FOREIGN KEY (id_usuario_modifica) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_estudiante asistencia_estudiante_id_docente_toma_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_docente_toma_fkey FOREIGN KEY (id_docente_toma) REFERENCES public.usuarios(id_usuario);


--
-- Name: asistencia_estudiante asistencia_estudiante_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario_docente(id_horario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_estudiante asistencia_estudiante_id_matricula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_matricula_fkey FOREIGN KEY (id_matricula) REFERENCES public.matricula(id_matricula) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asistencia_estudiante asistencia_estudiante_id_usuario_crea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_usuario_crea_fkey FOREIGN KEY (id_usuario_crea) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencia_estudiante asistencia_estudiante_id_usuario_modifica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_usuario_modifica_fkey FOREIGN KEY (id_usuario_modifica) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: auditoria auditoria_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: calificaciones calificaciones_id_escala_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_id_escala_fkey FOREIGN KEY (id_escala) REFERENCES public.escala_calificaciones(id_escala) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calificaciones calificaciones_id_matricula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_id_matricula_fkey FOREIGN KEY (id_matricula) REFERENCES public.matricula(id_matricula) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calificaciones calificaciones_id_momento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_id_momento_fkey FOREIGN KEY (id_momento) REFERENCES public.momentos(id_momento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calificaciones calificaciones_id_plan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_id_plan_fkey FOREIGN KEY (id_plan) REFERENCES public.plan_estudio(id_plan) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: estudiantes estudiantes_id_representante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_id_representante_fkey FOREIGN KEY (id_representante) REFERENCES public.representantes(id_representante) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: evaluaciones evaluaciones_id_momento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_momento_fkey FOREIGN KEY (id_momento) REFERENCES public.momentos(id_momento) ON UPDATE CASCADE;


--
-- Name: evaluaciones evaluaciones_id_plan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_plan_fkey FOREIGN KEY (id_plan) REFERENCES public.plan_estudio(id_plan) ON UPDATE CASCADE;


--
-- Name: evaluaciones evaluaciones_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.secciones(id_seccion) ON UPDATE CASCADE;


--
-- Name: asistencia_estudiante fk_asistencia_observacion; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT fk_asistencia_observacion FOREIGN KEY (id_observacion) REFERENCES public.observaciones_estudiante(id_observacion) ON DELETE SET NULL;


--
-- Name: observaciones_estudiante fk_observacion_usuario; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.observaciones_estudiante
    ADD CONSTRAINT fk_observacion_usuario FOREIGN KEY (id_usuario_crea) REFERENCES public.usuarios(id_usuario) ON DELETE SET NULL;


--
-- Name: plan_estudio fk_plan_estudio_tipo; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT fk_plan_estudio_tipo FOREIGN KEY (id_tipo_plan) REFERENCES public.tipo_plan_estudio(id_tipo_plan);


--
-- Name: formatos_sabana formatos_sabana_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.formatos_sabana
    ADD CONSTRAINT formatos_sabana_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario);


--
-- Name: historico_notas_certificadas historico_notas_certificadas_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: historico_notas_certificadas historico_notas_certificadas_id_escala_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_id_escala_fkey FOREIGN KEY (id_escala) REFERENCES public.escala_calificaciones(id_escala) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: historico_notas_certificadas historico_notas_certificadas_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: historico_notas_certificadas historico_notas_certificadas_id_grado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES public.grados_anos(id_grado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: historico_notas_certificadas historico_notas_certificadas_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.historico_notas_certificadas
    ADD CONSTRAINT historico_notas_certificadas_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_aula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_aula_fkey FOREIGN KEY (id_aula) REFERENCES public.aulas(id_aula) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_bloque_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_bloque_fkey FOREIGN KEY (id_bloque) REFERENCES public.bloques_horarios(id_bloque) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_dia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_dia_fkey FOREIGN KEY (id_dia) REFERENCES public.dias_semana(id_dia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.usuarios(id_usuario);


--
-- Name: horario_docente horario_docente_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: horario_docente horario_docente_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.secciones(id_seccion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justificaciones_estudiante justificaciones_estudiante_id_asistencia_est_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones_estudiante
    ADD CONSTRAINT justificaciones_estudiante_id_asistencia_est_fkey FOREIGN KEY (id_asistencia_est) REFERENCES public.asistencia_estudiante(id_asistencia_est) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justificaciones justificaciones_id_asistencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones
    ADD CONSTRAINT justificaciones_id_asistencia_fkey FOREIGN KEY (id_asistencia) REFERENCES public.asistencia_docente(id_asistencia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: materia_pendiente materia_pendiente_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura) ON UPDATE CASCADE;


--
-- Name: materia_pendiente materia_pendiente_id_docente_evaluador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_docente_evaluador_fkey FOREIGN KEY (id_docente_evaluador) REFERENCES public.usuarios(id_usuario);


--
-- Name: materia_pendiente materia_pendiente_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante) ON UPDATE CASCADE;


--
-- Name: materia_pendiente materia_pendiente_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE;


--
-- Name: matricula matricula_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matricula
    ADD CONSTRAINT matricula_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: matricula matricula_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matricula
    ADD CONSTRAINT matricula_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: matricula matricula_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.matricula
    ADD CONSTRAINT matricula_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.secciones(id_seccion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: momentos momentos_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.momentos
    ADD CONSTRAINT momentos_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notas_parciales notas_parciales_id_escala_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notas_parciales
    ADD CONSTRAINT notas_parciales_id_escala_fkey FOREIGN KEY (id_escala) REFERENCES public.escala_calificaciones(id_escala) ON UPDATE CASCADE;


--
-- Name: notas_parciales notas_parciales_id_evaluacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notas_parciales
    ADD CONSTRAINT notas_parciales_id_evaluacion_fkey FOREIGN KEY (id_evaluacion) REFERENCES public.evaluaciones(id_evaluacion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notas_parciales notas_parciales_id_matricula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notas_parciales
    ADD CONSTRAINT notas_parciales_id_matricula_fkey FOREIGN KEY (id_matricula) REFERENCES public.matricula(id_matricula) ON UPDATE CASCADE;


--
-- Name: plan_estudio plan_estudio_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plan_estudio plan_estudio_id_grado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plan_estudio
    ADD CONSTRAINT plan_estudio_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES public.grados_anos(id_grado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: secciones secciones_id_aula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_id_aula_fkey FOREIGN KEY (id_aula) REFERENCES public.aulas(id_aula) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: secciones secciones_id_docente_guia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_id_docente_guia_fkey FOREIGN KEY (id_docente_guia) REFERENCES public.usuarios(id_usuario);


--
-- Name: secciones secciones_id_grado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES public.grados_anos(id_grado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: secciones secciones_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE;


--
-- Name: usuarios usuarios_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidades(id_especialidad) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuarios usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict ZjzowbRsGErGnCpWZx5opbcdRakNAkjcLF9ieysvVN7fp5rztt1sMWgeoHCuSpS

