--
-- PostgreSQL database dump
--

\restrict gL2Thslq0GMikVufJE8JRwvg3BKYmalXVfHMq2XKjxlGBHEvsvsbh41WmUYfGNf

-- Dumped from database version 18.4 (709c4c3)
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
    updated_at timestamp with time zone NOT NULL
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
    updated_at timestamp with time zone NOT NULL
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
\.


--
-- Data for Name: asistencia_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_docente (id_asistencia, fecha, hora_entrada, hora_salida, estatus, id_horario, id_asignatura, id_usuario_crea, id_usuario_modifica, fecha_anulacion, created_at, updated_at, id_docente) FROM stdin;
\.


--
-- Data for Name: asistencia_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_estudiante (id_asistencia_est, id_matricula, fecha, id_horario, estatus, id_usuario_crea, id_usuario_modifica, created_at, updated_at, id_docente_toma, id_observacion) FROM stdin;
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
16	1	2026-07-14	207	Justificado	17	17	2026-07-18 08:47:47.704+00	2026-07-18 10:09:59.836+00	\N	3
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.auditoria (id_auditoria, id_usuario, accion, tabla_afectada, registro_id, valores_antiguos, valores_nuevos, ip_direccion, fecha_hora) FROM stdin;
\.


--
-- Data for Name: aulas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aulas (id_aula, nombre_codigo, capacidad, tipo_espacio, ubicacion, estatus, created_at, updated_at) FROM stdin;
8	Lab. Ciencias	25	Laboratorio	Planta Baja	Disponible	2026-07-18 03:02:24.022+00	2026-07-18 03:02:24.022+00
9	Lab. Computación	20	Laboratorio	Planta Baja	Disponible	2026-07-18 03:02:24.326+00	2026-07-18 03:02:24.326+00
1	A-1	35	Teórica	Planta Baja	Disponible	2026-07-18 03:02:21.859+00	2026-07-18 03:02:21.859+00
2	A-2	35	Teórica	Planta Baja	Disponible	2026-07-18 03:02:22.179+00	2026-07-18 03:02:22.179+00
3	A-3	35	Teórica	Planta Baja	Disponible	2026-07-18 03:02:22.491+00	2026-07-18 03:02:22.491+00
5	A-5	30	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.106+00	2026-07-18 03:02:23.106+00
6	B-1	40	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.412+00	2026-07-18 03:02:23.412+00
7	B-2	40	Teórica	Planta Alta	Disponible	2026-07-18 03:02:23.717+00	2026-07-18 03:02:23.717+00
10	CANCHA	34	Deportiva	Planta Baja	Disponible	2026-07-18 03:02:24.641+00	2026-07-18 04:39:27.838+00
4	A-4	30	Teórica	Edificio Admin	Disponible	2026-07-18 03:02:22.798+00	2026-07-18 16:11:46.256+00
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
1	Hospital Central	San cristobal	Tachira	1	Activo	2026-07-17 22:00:28.889+00	2026-07-17 22:00:28.889+00	CE-001	Luis	Manuel	Martínez	López	2008-05-12	M
2	Hospital Central	San cristobal	Tachira	2	Activo	2026-07-17 22:00:28.978+00	2026-07-17 22:00:28.978+00	CE-002	Carmen	Elena	González	Pérez	2009-08-23	F
3	Clinica Sucre	San cristobal	Tachira	3	Activo	2026-07-17 22:00:29.061+00	2026-07-17 22:00:29.061+00	CE-003	Juan	Carlos	Rodríguez	Hernández	2008-11-15	M
4	Ambulatorio	San cristobal	Tachira	4	Activo	2026-07-17 22:00:29.146+00	2026-07-17 22:00:29.146+00	CE-004	María	José	Sánchez	Díaz	2009-02-28	F
\.


--
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluaciones (id_evaluacion, id_plan, id_seccion, id_momento, descripcion, ponderacion, created_at, updated_at) FROM stdin;
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
\.


--
-- Data for Name: horario_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.horario_docente (id_horario, id_asignatura, id_seccion, id_dia, id_bloque, id_aula, id_periodo, created_at, updated_at, id_docente) FROM stdin;
204	1	1	1	1	1	1	2026-07-18 06:11:11.747+00	2026-07-18 06:11:11.747+00	6
205	2	1	1	2	1	1	2026-07-18 06:11:32.04+00	2026-07-18 06:11:32.04+00	5
206	8	1	1	3	1	1	2026-07-18 06:11:42.629+00	2026-07-18 06:11:42.629+00	4
207	1	1	2	2	1	1	2026-07-18 06:40:58.626+00	2026-07-18 06:40:58.626+00	6
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
\.


--
-- Data for Name: momentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.momentos (id_momento, id_periodo, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notas_parciales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notas_parciales (id_nota, id_matricula, id_evaluacion, id_escala, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: observaciones_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.observaciones_estudiante (id_observacion, texto, gravedad, id_usuario_crea, created_at, updated_at) FROM stdin;
1	toce mucho	Bajo	17	2026-07-18 09:32:31.973+00	2026-07-18 09:32:31.973+00
2	se durmio al final de la clase	Bajo	17	2026-07-18 09:44:34.85+00	2026-07-18 09:44:34.85+00
3	ta feo el joven	Bajo	17	2026-07-18 10:09:59.181+00	2026-07-18 10:09:59.181+00
\.


--
-- Data for Name: periodos_escolares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.periodos_escolares (id_periodo, nombre, estatus, fecha_inicio, fecha_fin, created_at, updated_at) FROM stdin;
2	2025-2026	Planificación	2025-09-01	2026-08-31	2026-07-18 04:37:45.566+00	2026-07-18 05:00:20.891+00
1	2026-2027	Activo	2026-07-01	2027-08-31	2026-07-18 02:40:06.362+00	2026-07-18 05:00:25.718+00
\.


--
-- Data for Name: plan_estudio; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.plan_estudio (id_plan, id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) FROM stdin;
1	1	1	CAS1	1	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
2	1	2	ING1	2	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
3	1	3	MAT1	3	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
4	1	4	EDF1	4	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
5	1	5	AYP1	5	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
6	1	6	CSN1	6	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
7	1	7	GHC1	7	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
8	1	8	OYC1	8	2026-07-18 05:31:46.843286+00	2026-07-18 05:31:46.843286+00
9	2	1	CAS2	1	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
10	2	2	ING2	2	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
11	2	3	MAT2	3	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
12	2	4	EDF2	4	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
13	2	5	AYP2	5	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
14	2	6	CSN2	6	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
15	2	7	GHC2	7	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
16	2	8	OYC2	8	2026-07-18 05:31:46.922399+00	2026-07-18 05:31:46.922399+00
17	3	1	CAS3	1	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
18	3	2	ING3	2	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
19	3	3	MAT3	3	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
20	3	4	EDF3	4	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
21	3	5	AYP3	5	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
22	3	6	CSN3	6	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
23	3	7	GHC3	7	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
24	3	8	OYC3	8	2026-07-18 05:31:47.007176+00	2026-07-18 05:31:47.007176+00
25	4	1	CAS4	1	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
26	4	2	ING4	2	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
27	4	3	MAT4	3	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
28	4	4	EDF4	4	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
29	4	5	AYP4	5	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
30	4	9	BIO4	6	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
31	4	7	GHC4	7	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
32	4	8	OYC4	8	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
33	4	10	PSC4	9	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
34	4	11	FPS4	10	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
35	4	12	GRP4	11	2026-07-18 05:31:47.083204+00	2026-07-18 05:31:47.083204+00
36	5	1	CAS5	1	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
37	5	2	ING5	2	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
38	5	3	MAT5	3	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
39	5	4	EDF5	4	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
40	5	5	AYP5	5	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
41	5	9	BIO5	6	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
42	5	7	GHC5	7	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
43	5	8	OYC5	8	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
44	5	10	PSC5	9	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
45	5	11	FPS5	10	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
46	5	12	GRP5	11	2026-07-18 05:31:47.161343+00	2026-07-18 05:31:47.161343+00
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
99	13	5906f540c23cc78dd18ac3121bc862f04b3dbabf838cbd5686b999b7495448c9	2026-07-19 00:46:51.335+00	2026-07-18 16:46:51.336+00	\N
100	17	508f6e6ce80568b43310eaf7062da14441ec9d67d322e06906fb032fd1ea30a3	2026-07-19 00:49:59.928+00	2026-07-18 16:49:59.929+00	\N
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
1	1	1	A	1	35	2026-07-18 03:02:32.26+00	2026-07-18 03:02:32.26+00	\N
2	1	1	B	2	35	2026-07-18 03:02:32.573+00	2026-07-18 03:02:32.573+00	\N
3	1	2	A	3	35	2026-07-18 03:02:32.879+00	2026-07-18 03:02:32.879+00	\N
4	1	2	B	4	30	2026-07-18 03:02:33.183+00	2026-07-18 03:02:33.183+00	\N
5	1	3	A	5	30	2026-07-18 03:02:33.49+00	2026-07-18 03:02:33.49+00	\N
6	1	3	B	6	40	2026-07-18 03:02:33.795+00	2026-07-18 03:02:33.795+00	\N
7	1	4	A	7	40	2026-07-18 03:02:34.101+00	2026-07-18 03:02:34.101+00	\N
8	1	4	B	8	25	2026-07-18 03:02:34.406+00	2026-07-18 03:02:34.406+00	\N
9	1	5	A	9	20	2026-07-18 03:02:34.711+00	2026-07-18 03:02:34.711+00	\N
10	1	5	B	10	50	2026-07-18 03:02:35.016+00	2026-07-18 03:02:35.016+00	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.usuarios (id_usuario, id_rol, username, password_hash, estatus, failed_attempts, locked_until, token_version, ultimo_acceso, cedula, nombre1, nombre2, apellido1, apellido2, fecha_nac, telefono, id_especialidad, token_qr, estatus_docente, created_at, updated_at, correo) FROM stdin;
2	8	jose.gonzalez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-12345678	Jose	\N	Gonzalez	\N	\N	0412-2345678	\N	\N	Activo	2026-07-17 22:00:27.039+00	2026-07-17 22:00:27.039+00	\N
5	5	ana.lopez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-15678901	Ana	\N	Lopez	\N	\N	0414-5678901	\N	\N	Activo	2026-07-17 22:00:27.297+00	2026-07-17 22:00:27.297+00	\N
6	5	pedro.martinez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-16789012	Pedro	\N	Martinez	\N	\N	0412-6789012	\N	\N	Activo	2026-07-17 22:00:27.383+00	2026-07-17 22:00:27.383+00	\N
7	5	luisa.gomez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-17890123	Luisa	\N	Gomez	\N	\N	0416-7890123	\N	\N	Activo	2026-07-17 22:00:27.475+00	2026-07-17 22:00:27.475+00	\N
8	5	carlos.diaz	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-18901234	Carlos	\N	Diaz	\N	\N	0424-8901234	\N	\N	Activo	2026-07-17 22:00:27.556+00	2026-07-17 22:00:27.556+00	\N
9	5	marta.torres	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-19012345	Marta	\N	Torres	\N	\N	0414-9012345	\N	\N	Activo	2026-07-17 22:00:27.641+00	2026-07-17 22:00:27.641+00	\N
10	5	jorge.ruiz	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-20123456	Jorge	\N	Ruiz	\N	\N	0412-0123456	\N	\N	Activo	2026-07-17 22:00:27.724+00	2026-07-17 22:00:27.724+00	\N
11	5	diana.morales	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-21234567	Diana	\N	Morales	\N	\N	0414-1122334	\N	\N	Activo	2026-07-17 22:00:27.808+00	2026-07-17 22:00:27.808+00	\N
12	5	ricardo.navas	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-22345678	Ricardo	\N	Navas	\N	\N	0412-2233445	\N	\N	Activo	2026-07-17 22:00:27.892+00	2026-07-17 22:00:27.892+00	\N
14	8	control	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:41.943+00	2026-07-17 22:00:41.943+00	\N
16	7	coordinador	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:42.254+00	2026-07-17 22:00:42.254+00	\N
13	4	admin	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	8	2026-07-18 16:46:51.454+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:41.773+00	2026-07-18 16:46:51.455+00	\N
17	4	gregory	$2b$10$JR2esMYGjPPFPR7SMUPeBech748cAaXGKCe/8q.nuAdixUig5nX1S	Activo	0	\N	10	2026-07-18 16:50:00.007+00	V-30965286	Gregory	Steve	Duque	Mendoza	\N	0414-7399890	\N	\N	\N	2026-07-17 22:26:29.048+00	2026-07-18 16:50:00.008+00	\N
4	5	luis.fernandez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-14567890	Luis	\N	Fernandez	\N	\N	0424-4567890	\N	\N	Activo	2026-07-17 22:00:27.207+00	2026-07-17 22:53:33.757+00	\N
1	4	V-10234567	$2b$10$v.1/fLptLCQsILqibvr4LOOLNkSaN4zxZddxqdjBs345fEGl5Anfi	Inactivo	0	\N	1	2026-07-17 22:43:31.894+00	V-10234567	Maria	\N	Perez	\N	\N	0414-1234567	\N	\N	Activo	2026-07-17 22:00:26.949+00	2026-07-17 22:57:07.12+00	\N
15	5	docente	$2b$10$bjFChN6FfTbsv5aT8RR/qu1SVI2XGpLPo9hnE0aRqzqsgFyWfA8iu	Activo	0	\N	1	2026-07-17 22:28:29.65+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-17 22:00:42.098+00	2026-07-17 22:28:39.828+00	\N
3	8	carmen.rodriguez	$2b$10$WRe/tooXki0x.TUt6LD/BeBqL6abV/sy3vxtkFg6XOLpmoznYDhvG	Activo	0	\N	0	\N	V-13456789	Carmen	\N	Rodriguez	\N	\N	0416-3456789	\N	\N	Activo	2026-07-17 22:00:27.122+00	2026-07-17 22:42:10.011+00	\N
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

SELECT pg_catalog.setval('public.asignaturas_id_asignatura_seq', 12, true);


--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_docente_id_asistencia_seq', 1, false);


--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_estudiante_id_asistencia_est_seq', 23, true);


--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.auditoria_id_auditoria_seq', 1, false);


--
-- Name: aulas_id_aula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aulas_id_aula_seq', 1, false);


--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bloques_horarios_id_bloque_seq', 1, false);


--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.calificaciones_id_calificacion_seq', 1, false);


--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dias_semana_id_dia_seq', 1, false);


--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.escala_calificaciones_id_escala_seq', 1, false);


--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.especialidades_id_especialidad_seq', 1, false);


--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 15, true);


--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 1, false);


--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.grados_anos_id_grado_seq', 1, false);


--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.historico_notas_certificadas_id_historico_seq', 1, false);


--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.horario_docente_id_horario_seq', 207, true);


--
-- Name: justificaciones_estudiante_id_justificacion_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_estudiante_id_justificacion_est_seq', 10, true);


--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_id_justificacion_seq', 1, false);


--
-- Name: login_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.login_audit_id_seq', 75, true);


--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.materia_pendiente_id_materia_pendiente_seq', 1, false);


--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.matricula_id_matricula_seq', 15, true);


--
-- Name: momentos_id_momento_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.momentos_id_momento_seq', 1, false);


--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notas_parciales_id_nota_seq', 1, false);


--
-- Name: observaciones_estudiante_id_observacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.observaciones_estudiante_id_observacion_seq', 3, true);


--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.periodos_escolares_id_periodo_seq', 2, true);


--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plan_estudio_id_plan_seq', 46, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 100, true);


--
-- Name: representantes_id_representante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.representantes_id_representante_seq', 10, true);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 1, false);


--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.secciones_id_seccion_seq', 4, true);


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

\unrestrict gL2Thslq0GMikVufJE8JRwvg3BKYmalXVfHMq2XKjxlGBHEvsvsbh41WmUYfGNf

