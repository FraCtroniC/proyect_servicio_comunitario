--
-- PostgreSQL database dump
--

\restrict OEld6B1zyzGgKFxZKsJPNxpB0lLuZEfP4q3qt21vyAOTrqXtIU22pMMXYEi6KmD

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
    id_docente integer NOT NULL,
    fecha date NOT NULL,
    hora_entrada time without time zone,
    hora_salida time without time zone,
    estatus character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_usuario_crea integer,
    id_usuario_modifica integer,
    fecha_anulacion timestamp without time zone,
    id_horario integer,
    id_asignatura integer
);


ALTER TABLE public.asistencia_docente OWNER TO neondb_owner;

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
-- Name: COLUMN asistencia_docente.id_horario; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_horario IS 'Horario/clase especifica asociada al registro';


--
-- Name: COLUMN asistencia_docente.id_asignatura; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_docente.id_asignatura IS 'Materia asociada al registro de asistencia docente';


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
    estatus character varying(20),
    observacion character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_usuario_crea integer,
    id_usuario_modifica integer,
    id_horario integer,
    id_docente_toma integer
);


ALTER TABLE public.asistencia_estudiante OWNER TO neondb_owner;

--
-- Name: COLUMN asistencia_estudiante.estatus; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.estatus IS 'Presente, Ausente, Justificado';


--
-- Name: COLUMN asistencia_estudiante.id_usuario_modifica; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.id_usuario_modifica IS 'Usuario que modificó la asistencia';


--
-- Name: COLUMN asistencia_estudiante.id_horario; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.id_horario IS 'Horario/clase especifica a la que pertenece esta asistencia';


--
-- Name: COLUMN asistencia_estudiante.id_docente_toma; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.asistencia_estudiante.id_docente_toma IS 'Docente que tomo/registro la asistencia';


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
-- Name: docentes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.docentes (
    id_docente integer NOT NULL,
    cedula_docente character varying(15) NOT NULL,
    nombre1 character varying(20) NOT NULL,
    nombre2 character varying(20),
    apellido1 character varying(20) NOT NULL,
    apellido2 character varying(20),
    telefono character varying(20),
    correo character varying(50),
    token_qr character varying(255),
    estatus character varying(15),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_especialidad integer,
    fecha_nac date
);


ALTER TABLE public.docentes OWNER TO neondb_owner;

--
-- Name: docentes_id_docente_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.docentes_id_docente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.docentes_id_docente_seq OWNER TO neondb_owner;

--
-- Name: docentes_id_docente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.docentes_id_docente_seq OWNED BY public.docentes.id_docente;


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
    cedula_escolar character varying(15) NOT NULL,
    nombre1 character varying(50) NOT NULL,
    nombre2 character varying(50),
    apellido1 character varying(50) NOT NULL,
    apellido2 character varying(50),
    fecha_nac date NOT NULL,
    lugar_nac character varying(100),
    municipio character varying(50),
    estado character varying(50),
    genero character(1),
    id_representante integer NOT NULL,
    estatus_estudiante character varying(20),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
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
    id_docente integer NOT NULL,
    id_asignatura integer NOT NULL,
    id_seccion integer NOT NULL,
    id_dia integer NOT NULL,
    id_bloque integer NOT NULL,
    id_aula integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_periodo integer
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
    created_at timestamp without time zone DEFAULT now() NOT NULL
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
    id_docente_evaluador integer,
    nota_definitiva integer,
    estatus character varying(20) DEFAULT 'Cursando'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
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
-- Name: periodos_escolares; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.periodos_escolares (
    id_periodo integer NOT NULL,
    nombre character varying(9) NOT NULL,
    estatus character varying(20) NOT NULL,
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
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    revoked_at timestamp without time zone
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
    cedula_rep character varying(15) NOT NULL,
    nombre1 character varying(20) NOT NULL,
    nombre2 character varying(20),
    apellido1 character varying(20) NOT NULL,
    apellido2 character varying(20),
    telefono character varying(20),
    direccion text,
    correo character varying(50),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
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
    id_docente_guia integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id_aula integer
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
    id_docente integer,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    estatus character varying(15) DEFAULT 'Activo'::character varying,
    correo character varying(100),
    ultimo_acceso timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    failed_attempts integer DEFAULT 0 NOT NULL,
    locked_until timestamp without time zone,
    token_version integer DEFAULT 0 NOT NULL
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
-- Name: docentes id_docente; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes ALTER COLUMN id_docente SET DEFAULT nextval('public.docentes_id_docente_seq'::regclass);


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
24	Castellano 	Cuantitativa	2026-07-01 20:49:18.646+00	2026-07-01 20:49:18.646+00
25	Ingles	Cuantitativa	2026-07-01 21:58:11.109+00	2026-07-01 21:58:11.109+00
26	Inglés y otras Lenguas Extranjeras	Cuantitativa	2026-07-02 14:19:05.178+00	2026-07-02 14:19:05.178+00
27	Matemáticas	Cuantitativa	2026-07-02 14:19:49.656+00	2026-07-02 14:19:49.656+00
28	Educación Física	Cuantitativa	2026-07-02 14:20:29.927+00	2026-07-02 14:20:29.927+00
29	Arte y Patrimonio	Cuantitativa	2026-07-02 14:21:09.497+00	2026-07-02 14:21:09.497+00
30	Ciencias Naturales	Cuantitativa	2026-07-02 14:21:41.437+00	2026-07-02 14:21:41.437+00
31	Geografía, Historia y Ciudadanía	Cuantitativa	2026-07-02 14:22:18.518+00	2026-07-02 14:22:18.518+00
32	Orientación y Convivencia	Cuantitativa	2026-07-02 14:22:59.447+00	2026-07-02 14:22:59.447+00
33	Grupo de Participación	Cuantitativa	2026-07-02 14:24:35.235+00	2026-07-02 14:24:35.235+00
34	Castellano	Cuantitativa	2026-07-02 14:38:10.743+00	2026-07-02 14:38:10.743+00
35	Lenguaje español	Cuantitativa	2026-07-11 21:38:37.197+00	2026-07-11 21:38:37.197+00
36	lenguas profanas	Cuantitativa	2026-07-11 21:39:39.923+00	2026-07-11 21:39:39.923+00
37	Lenguas raras	Cuantitativa	2026-07-11 21:53:48.192+00	2026-07-11 21:53:48.192+00
38	Matematicas	Cuantitativa	2026-07-11 22:17:49.466+00	2026-07-11 22:17:49.466+00
39	Prueba Red	Cuantitativa	2026-07-13 02:38:08.875+00	2026-07-13 02:38:08.875+00
40	Redes inalambricas	Cuantitativa	2026-07-13 04:31:00.522+00	2026-07-13 04:31:00.522+00
41	historia univerrsal	Cuantitativo	2026-07-14 15:15:33.037+00	2026-07-14 15:15:33.037+00
45	historia universal	Cuantitativo	2026-07-14 15:24:16.619+00	2026-07-14 15:24:16.619+00
46	psicologia	Cualitativo	2026-07-14 15:24:56.63+00	2026-07-14 15:24:56.63+00
\.


--
-- Data for Name: asistencia_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_docente (id_asistencia, id_docente, fecha, hora_entrada, hora_salida, estatus, created_at, updated_at, id_usuario_crea, id_usuario_modifica, fecha_anulacion, id_horario, id_asignatura) FROM stdin;
14	13	2026-07-13	02:40:00	\N	Puntual	2026-07-13 06:40:50.249+00	2026-07-13 06:40:50.249+00	\N	\N	\N	\N	\N
15	16	2026-07-13	02:47:00	\N	Puntual	2026-07-13 06:48:07.653+00	2026-07-13 06:48:07.653+00	\N	\N	\N	\N	\N
16	17	2026-07-13	08:14:00	\N	Retardo	2026-07-13 12:14:21.21+00	2026-07-13 12:14:21.21+00	\N	\N	\N	\N	\N
17	14	2026-07-11	12:56:00	\N	Retardo	2026-07-13 16:56:28.177+00	2026-07-13 16:56:28.177+00	\N	\N	\N	\N	\N
13	14	2026-07-13	02:40:00	12:56:00	Puntual	2026-07-13 06:40:49.385+00	2026-07-13 16:57:01.014+00	\N	\N	\N	\N	\N
18	13	2026-07-07	17:03:00	\N	Retardo	2026-07-13 21:03:23.922+00	2026-07-13 21:03:23.922+00	14	\N	\N	\N	\N
\.


--
-- Data for Name: asistencia_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_estudiante (id_asistencia_est, id_matricula, fecha, estatus, observacion, created_at, updated_at, id_usuario_crea, id_usuario_modifica, id_horario, id_docente_toma) FROM stdin;
38	21	2026-07-02	Ausente	\N	2026-07-02 14:28:57.733+00	2026-07-02 14:28:59.922+00	16	16	\N	\N
40	22	2026-07-14	Ausente	\N	2026-07-13 05:00:08.282+00	2026-07-13 05:00:13.348+00	14	14	\N	\N
41	22	2025-01-13	Presente	\N	2026-07-13 05:21:39.82+00	2026-07-13 05:21:39.82+00	14	\N	\N	\N
42	23	2025-01-13	Presente	\N	2026-07-13 05:22:07.123+00	2026-07-13 05:22:07.123+00	14	\N	\N	\N
43	24	2025-01-13	Presente	\N	2026-07-13 05:22:07.926+00	2026-07-13 05:22:07.926+00	14	\N	\N	\N
46	23	2026-07-12	Presente	\N	2026-07-13 05:22:21.45+00	2026-07-13 05:22:21.45+00	14	\N	\N	\N
47	24	2026-07-12	Ausente	\N	2026-07-13 05:22:21.832+00	2026-07-13 05:22:21.832+00	14	\N	\N	\N
48	23	2026-07-11	Justificado	\N	2026-07-13 05:22:28.94+00	2026-07-13 05:22:28.94+00	14	\N	\N	\N
49	24	2026-07-11	Ausente	\N	2026-07-13 05:22:29.698+00	2026-07-13 05:22:29.698+00	14	\N	\N	\N
51	24	2026-07-10	Presente	\N	2026-07-13 05:22:36.009+00	2026-07-13 05:22:36.009+00	14	\N	\N	\N
53	23	2026-07-09	Presente	\N	2026-07-13 05:29:58.587+00	2026-07-13 05:30:03.481+00	14	14	\N	\N
52	24	2026-07-09	Ausente	\N	2026-07-13 05:29:55.186+00	2026-07-13 05:30:09.869+00	14	14	\N	\N
44	23	2026-07-13	Justificado	\N	2026-07-13 05:22:15.528+00	2026-07-13 21:20:08.856+00	14	14	\N	\N
54	22	2026-07-08	Presente	\N	2026-07-13 06:49:38.53+00	2026-07-13 06:49:38.53+00	14	\N	\N	\N
55	22	2026-07-09	Ausente	\N	2026-07-13 07:02:47.964+00	2026-07-13 07:04:15.578+00	16	16	\N	\N
56	22	2026-07-07	Ausente	\N	2026-07-13 07:04:31.275+00	2026-07-13 07:08:02.976+00	16	15	\N	\N
50	23	2026-07-10	Ausente	\N	2026-07-13 05:22:34.27+00	2026-07-13 20:29:44.849+00	14	15	\N	\N
45	24	2026-07-13	Presente	\N	2026-07-13 05:22:16.12+00	2026-07-13 20:31:48.715+00	14	15	\N	\N
39	22	2026-07-13	Presente	\N	2026-07-13 04:59:54.119+00	2026-07-13 21:04:36.638+00	14	14	\N	\N
57	22	2026-07-12	Ausente	\N	2026-07-13 21:04:47.656+00	2026-07-13 21:04:50.101+00	14	14	\N	\N
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.auditoria (id_auditoria, id_usuario, accion, tabla_afectada, registro_id, valores_antiguos, valores_nuevos, ip_direccion, fecha_hora) FROM stdin;
47	14	Configuración	evaluaciones	\N	\N	{"id_plan": 89, "id_momento": 1, "id_seccion": 15, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 50, "id_evaluacion": null}]}	::1	2026-07-01 22:36:52.702+00
48	14	Configuración	evaluaciones	\N	\N	{"id_plan": 89, "id_momento": 1, "id_seccion": 15, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 25, "id_evaluacion": 35}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": 36}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}]}	::1	2026-07-02 18:11:47.451+00
49	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:25:17.884+00
51	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:26:09.886+00
53	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:26:21.623+00
56	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:33:05.087+00
57	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 14, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:33:40.399+00
59	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 14, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:35:42.427+00
61	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 20, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:36:28.167+00
63	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 20, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 1, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 9, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:42:57.822+00
65	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 20, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 1, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 9, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 18:43:14.423+00
67	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 10, "id_estudiante": 22, "id_evaluacion": 38}]}	::1	2026-07-02 20:26:03.549+00
68	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 1, "lapso": 1, "section": "A", "detalles": [{"score": 15, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "35", "evaluationName": "Evaluación Única"}, {"score": 15, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "36", "evaluationName": "Nueva Actividad"}, {"score": 15, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "37", "evaluationName": "Nueva Actividad"}, {"score": 10, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "38", "evaluationName": "Nueva Actividad"}], "asignatura": "Castellano ", "planEvaluaciones": [{"id": "35", "name": "Evaluación Única", "percentage": 25}, {"id": "36", "name": "Nueva Actividad", "percentage": 25}, {"id": "37", "name": "Nueva Actividad", "percentage": 25}, {"id": "38", "name": "Nueva Actividad", "percentage": 25}]}	\N	2026-07-02 20:26:03.604+00
69	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 5, "id_estudiante": 22, "id_evaluacion": 36}, {"id_escala": 8, "id_estudiante": 22, "id_evaluacion": 35}, {"id_escala": 12, "id_estudiante": 22, "id_evaluacion": 37}, {"id_escala": 19, "id_estudiante": 22, "id_evaluacion": 38}]}	10.198.143.16	2026-07-08 14:46:05.9+00
70	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 1, "lapso": 1, "section": "A", "detalles": [{"score": 5, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "36", "evaluationName": "Nueva Actividad"}, {"score": 8, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "35", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "37", "evaluationName": "Nueva Actividad"}, {"score": 19, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "38", "evaluationName": "Nueva Actividad"}], "asignatura": "Castellano ", "planEvaluaciones": [{"id": "35", "name": "Evaluación Única", "percentage": 25}, {"id": "36", "name": "Nueva Actividad", "percentage": 25}, {"id": "37", "name": "Nueva Actividad", "percentage": 25}, {"id": "38", "name": "Nueva Actividad", "percentage": 25}]}	\N	2026-07-08 14:46:06.767+00
71	14	Configuración	evaluaciones	\N	\N	{"id_plan": 89, "id_momento": 2, "id_seccion": 15, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}]}	10.194.238.2	2026-07-08 14:48:44.203+00
72	14	Configuración	evaluaciones	\N	\N	{"id_plan": 108, "id_momento": 1, "id_seccion": 20, "evaluaciones": [{"descripcion": "Examen 1", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "Examen 2", "ponderacion": 50, "id_evaluacion": null}]}	::1	2026-07-13 13:18:57.123+00
73	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 24, "id_evaluacion": 44}, {"id_escala": 15, "id_estudiante": 24, "id_evaluacion": 43}, {"id_escala": 1, "id_estudiante": 25, "id_evaluacion": 43}, {"id_escala": 17, "id_estudiante": 25, "id_evaluacion": 44}]}	::1	2026-07-13 13:20:04.316+00
74	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 4, "lapso": 1, "section": "A", "detalles": [{"score": 20, "percentage": 50, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "44", "evaluationName": "Examen 2"}, {"score": 15, "percentage": 50, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "43", "evaluationName": "Examen 1"}, {"score": 1, "percentage": 50, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "43", "evaluationName": "Examen 1"}, {"score": 17, "percentage": 50, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "44", "evaluationName": "Examen 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "43", "name": "Examen 1", "percentage": 50}, {"id": "44", "name": "Examen 2", "percentage": 50}]}	\N	2026-07-13 13:20:04.402+00
75	16	Configuración	evaluaciones	\N	\N	{"id_plan": 106, "id_momento": 1, "id_seccion": 20, "evaluaciones": [{"descripcion": "Evaluación primera", "ponderacion": 100, "id_evaluacion": null}]}	::1	2026-07-13 13:26:28.976+00
76	16	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 24, "id_evaluacion": 45}, {"id_escala": 3, "id_estudiante": 25, "id_evaluacion": 45}]}	::1	2026-07-13 13:26:40.188+00
77	16	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 24, "id_evaluacion": 45}, {"id_escala": 3, "id_estudiante": 25, "id_evaluacion": 45}]}	::1	2026-07-13 13:37:17.329+00
78	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 4, "lapso": 1, "section": "A", "detalles": [{"score": 20, "percentage": 100, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "45", "evaluationName": "Evaluación primera"}, {"score": 3, "percentage": 100, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "45", "evaluationName": "Evaluación primera"}], "asignatura": "Prueba Red", "planEvaluaciones": [{"id": "45", "name": "Evaluación primera", "percentage": 100}]}	\N	2026-07-13 13:37:17.726+00
79	17	Configuración	evaluaciones	\N	\N	{"id_plan": 111, "id_momento": 1, "id_seccion": 21, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 80, "id_evaluacion": null}, {"descripcion": "Nueva Actividad 1", "ponderacion": 10, "id_evaluacion": null}, {"descripcion": "Nueva Actividad 2", "ponderacion": 10, "id_evaluacion": null}]}	::1	2026-07-15 03:30:27.961+00
80	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 11, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 12, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 13, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 31, "id_evaluacion": 46}, {"id_escala": 12, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 1, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 5, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 8, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 17, "id_estudiante": 31, "id_evaluacion": 47}, {"id_escala": 1, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 7, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 7, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 11, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 2, "id_estudiante": 31, "id_evaluacion": 48}]}	::1	2026-07-15 03:32:00.662+00
81	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 10, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 11, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 13, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "wfw wfw, wfw wfw", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 1, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 5, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 8, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 17, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 1, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 7, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 7, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 11, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 2, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 03:32:01.149+00
82	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 11, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 12, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 13, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 1, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 5, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 8, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 17, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 7, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 7, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 11, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 48}]}	::1	2026-07-15 03:33:39.354+00
83	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 10, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 11, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 13, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 1, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 5, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 8, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 17, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 7, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 7, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 11, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 2, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "wfw wfw, wfw wfw", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 03:33:39.833+00
103	39	Configuración	evaluaciones	\N	\N	{"id_plan": 91, "id_momento": 1, "id_seccion": 15, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}]}	::1	2026-07-15 04:51:17.271+00
84	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 7, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 11, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 12, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 13, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 8, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 17, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 11, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 48}]}	::1	2026-07-15 03:34:26.032+00
85	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 7, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 11, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 13, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 8, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 17, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 11, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 2, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 03:34:26.587+00
88	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 5, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 13, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 17, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 1, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 2, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 5, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 15, "id_estudiante": 31, "id_evaluacion": 48}]}	::1	2026-07-15 03:36:24.363+00
89	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 5, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 13, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 17, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 1, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 2, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 5, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 15, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 03:36:24.854+00
86	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 12, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 13, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 15, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 17, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 11, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 2, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 48}]}	::1	2026-07-15 03:34:55.648+00
87	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 12, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 13, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 15, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 17, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 11, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 2, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 03:34:56.123+00
90	14	Configuración	evaluaciones	\N	\N	{"id_plan": 111, "id_momento": 2, "id_seccion": 21, "evaluaciones": [{"descripcion": "examen", "ponderacion": 50, "id_evaluacion": null}, {"descripcion": "lamina", "ponderacion": 50, "id_evaluacion": null}]}	::1	2026-07-15 04:06:54.274+00
91	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}]}	::1	2026-07-15 04:07:13.907+00
92	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 04:07:14.391+00
93	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 31, "id_evaluacion": 50}]}	::1	2026-07-15 04:07:45.085+00
94	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 13, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "50", "evaluationName": "lamina"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 04:07:45.566+00
113	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 24, "id_evaluacion": 55}, {"id_escala": 15, "id_estudiante": 25, "id_evaluacion": 55}]}	::1	2026-07-15 05:49:13.715+00
95	16	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 31, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 50}]}	::1	2026-07-15 04:08:38.079+00
96	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 13, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "50", "evaluationName": "lamina"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 04:08:38.628+00
97	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 26, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 50}]}	::1	2026-07-15 04:31:32.703+00
98	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 13, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "50", "evaluationName": "lamina"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 04:31:33.097+00
99	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 5, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 20, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 17, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 2, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 5, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 46}]}	::1	2026-07-15 04:41:07.72+00
100	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 5, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 20, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 17, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 2, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 5, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 04:41:07.805+00
101	14	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 50}, {"id_escala": 1, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 15, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 26, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 31, "id_evaluacion": 50}]}	::1	2026-07-15 04:47:45.665+00
102	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}, {"score": 20, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 1, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 15, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 2, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 13, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "50", "evaluationName": "lamina"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 04:47:46.221+00
104	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 28, "id_evaluacion": 46}, {"id_escala": 5, "id_estudiante": 28, "id_evaluacion": 48}, {"id_escala": 15, "id_estudiante": 31, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 47}, {"id_escala": 1, "id_estudiante": 31, "id_evaluacion": 46}, {"id_escala": 20, "id_estudiante": 26, "id_evaluacion": 46}, {"id_escala": 17, "id_estudiante": 26, "id_evaluacion": 47}, {"id_escala": 2, "id_estudiante": 26, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 27, "id_evaluacion": 46}, {"id_escala": 5, "id_estudiante": 27, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 46}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 48}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 47}, {"id_escala": 10, "id_estudiante": 29, "id_evaluacion": 46}]}	::1	2026-07-15 04:51:18.491+00
105	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 1, "section": "A", "detalles": [{"score": 10, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 5, "percentage": 10, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 15, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "wfw wfw, wfw wfw", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 1, "percentage": 80, "studentName": "wfw wfw, wfw wfw", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 20, "percentage": 80, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 17, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 2, "percentage": 10, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 5, "percentage": 10, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "46", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 10, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "48", "evaluationName": "Nueva Actividad 2"}, {"score": 10, "percentage": 10, "studentName": "roa como, samuel mandarina", "evaluationId": "47", "evaluationName": "Nueva Actividad 1"}, {"score": 10, "percentage": 80, "studentName": "roa como, samuel mandarina", "evaluationId": "46", "evaluationName": "Evaluación Única"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "46", "name": "Evaluación Única", "percentage": 80}, {"id": "47", "name": "Nueva Actividad 1", "percentage": 10}, {"id": "48", "name": "Nueva Actividad 2", "percentage": 10}]}	\N	2026-07-15 04:51:18.968+00
106	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 50}, {"id_escala": 1, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 26, "id_evaluacion": 50}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 15, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 31, "id_evaluacion": 50}]}	::1	2026-07-15 04:52:27.249+00
107	39	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 15, "id_estudiante": 22, "id_evaluacion": 51}, {"id_escala": 10, "id_estudiante": 23, "id_evaluacion": 51}, {"id_escala": 16, "id_estudiante": 22, "id_evaluacion": 52}, {"id_escala": 8, "id_estudiante": 23, "id_evaluacion": 52}, {"id_escala": 14, "id_estudiante": 22, "id_evaluacion": 53}, {"id_escala": 9, "id_estudiante": 23, "id_evaluacion": 53}, {"id_escala": 14, "id_estudiante": 22, "id_evaluacion": 54}, {"id_escala": 18, "id_estudiante": 23, "id_evaluacion": 54}]}	::1	2026-07-15 05:03:27.405+00
108	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 1, "lapso": 1, "section": "A", "detalles": [{"score": 15, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "51", "evaluationName": "Evaluación Única"}, {"score": 10, "percentage": 25, "studentName": "Arequipe Rem consequu Sed molestiae sit n, Exercitationem assum Mollit consectetur", "evaluationId": "51", "evaluationName": "Evaluación Única"}, {"score": 16, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "52", "evaluationName": "Nueva Actividad"}, {"score": 8, "percentage": 25, "studentName": "Arequipe Rem consequu Sed molestiae sit n, Exercitationem assum Mollit consectetur", "evaluationId": "52", "evaluationName": "Nueva Actividad"}, {"score": 14, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "53", "evaluationName": "Nueva Actividad"}, {"score": 9, "percentage": 25, "studentName": "Arequipe Rem consequu Sed molestiae sit n, Exercitationem assum Mollit consectetur", "evaluationId": "53", "evaluationName": "Nueva Actividad"}, {"score": 14, "percentage": 25, "studentName": "Carvajal Chacon, Josedaniel", "evaluationId": "54", "evaluationName": "Nueva Actividad"}, {"score": 18, "percentage": 25, "studentName": "Arequipe Rem consequu Sed molestiae sit n, Exercitationem assum Mollit consectetur", "evaluationId": "54", "evaluationName": "Nueva Actividad"}], "asignatura": "Matemáticas", "planEvaluaciones": [{"id": "51", "name": "Evaluación Única", "percentage": 25}, {"id": "52", "name": "Nueva Actividad", "percentage": 25}, {"id": "53", "name": "Nueva Actividad", "percentage": 25}, {"id": "54", "name": "Nueva Actividad", "percentage": 25}]}	\N	2026-07-15 05:03:27.972+00
109	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 49}, {"id_escala": 1, "id_estudiante": 28, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 31, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 28, "id_evaluacion": 50}, {"id_escala": 1, "id_estudiante": 27, "id_evaluacion": 49}, {"id_escala": 10, "id_estudiante": 30, "id_evaluacion": 49}, {"id_escala": 2, "id_estudiante": 29, "id_evaluacion": 50}, {"id_escala": 13, "id_estudiante": 30, "id_evaluacion": 50}, {"id_escala": 20, "id_estudiante": 27, "id_evaluacion": 50}, {"id_escala": 15, "id_estudiante": 29, "id_evaluacion": 49}, {"id_escala": 20, "id_estudiante": 31, "id_evaluacion": 50}, {"id_escala": 10, "id_estudiante": 26, "id_evaluacion": 50}]}	::1	2026-07-15 05:12:01.267+00
110	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 5, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "49", "evaluationName": "examen"}, {"score": 1, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "49", "evaluationName": "examen"}, {"score": 20, "percentage": 50, "studentName": "sdgsdg gsdg, fsfgdf fgsfg", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 1, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 10, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "49", "evaluationName": "examen"}, {"score": 2, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 13, "percentage": 50, "studentName": "emiliana vsfvsfvsdv, veatriz fsdvcsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 20, "percentage": 50, "studentName": "fsdfs dfsdfs, sdfwd fsdfsd", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 15, "percentage": 50, "studentName": "roa como, samuel mandarina", "evaluationId": "49", "evaluationName": "examen"}, {"score": 20, "percentage": 50, "studentName": "wfw wfw, wfw wfw", "evaluationId": "50", "evaluationName": "lamina"}, {"score": 10, "percentage": 50, "studentName": "Romero Lopez, Maria Isabela", "evaluationId": "50", "evaluationName": "lamina"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "49", "name": "examen", "percentage": 50}, {"id": "50", "name": "lamina", "percentage": 50}]}	\N	2026-07-15 05:12:01.824+00
111	39	Configuración	evaluaciones	\N	\N	{"id_plan": 89, "id_momento": 1, "id_seccion": 15, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 25, "id_evaluacion": 35}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": 36}, {"descripcion": "Nueva Actividad", "ponderacion": 50, "id_evaluacion": 37}]}	::1	2026-07-15 05:34:21.908+00
112	17	Configuración	evaluaciones	\N	\N	{"id_plan": 108, "id_momento": 2, "id_seccion": 20, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 100, "id_evaluacion": null}]}	::1	2026-07-15 05:49:02.315+00
114	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 4, "lapso": 2, "section": "A", "detalles": [{"score": 10, "percentage": 100, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "55", "evaluationName": "Evaluación Única"}, {"score": 15, "percentage": 100, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "55", "evaluationName": "Evaluación Única"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "55", "name": "Evaluación Única", "percentage": 100}]}	\N	2026-07-15 05:49:14.193+00
115	17	Configuración	evaluaciones	\N	\N	{"id_plan": 108, "id_momento": 3, "id_seccion": 20, "evaluaciones": [{"descripcion": "Evaluación Única", "ponderacion": 75, "id_evaluacion": null}, {"descripcion": "Nueva Actividad", "ponderacion": 25, "id_evaluacion": null}]}	::1	2026-07-15 05:50:09.196+00
116	17	Registro	notas_parciales	\N	\N	{"notas_parciales": [{"id_escala": 20, "id_estudiante": 24, "id_evaluacion": 56}, {"id_escala": 14, "id_estudiante": 25, "id_evaluacion": 56}, {"id_escala": 12, "id_estudiante": 24, "id_evaluacion": 57}, {"id_escala": 10, "id_estudiante": 25, "id_evaluacion": 57}]}	::1	2026-07-15 05:51:21.298+00
117	\N	GUARDAR_NOTAS	notas_parciales	\N	\N	{"year": 4, "lapso": 3, "section": "A", "detalles": [{"score": 20, "percentage": 75, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "56", "evaluationName": "Evaluación Única"}, {"score": 14, "percentage": 75, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "56", "evaluationName": "Evaluación Única"}, {"score": 12, "percentage": 25, "studentName": "Duque Mendoza, Gregory Steve", "evaluationId": "57", "evaluationName": "Nueva Actividad"}, {"score": 10, "percentage": 25, "studentName": "crepusculo daltonico, aurelio bizancio", "evaluationId": "57", "evaluationName": "Nueva Actividad"}], "asignatura": "Castellano", "planEvaluaciones": [{"id": "56", "name": "Evaluación Única", "percentage": 75}, {"id": "57", "name": "Nueva Actividad", "percentage": 25}]}	\N	2026-07-15 05:51:21.775+00
\.


--
-- Data for Name: aulas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aulas (id_aula, nombre_codigo, capacidad, tipo_espacio, ubicacion, estatus, created_at, updated_at) FROM stdin;
10	AULA 1	30	Teórica	Planta Baja	Activo	2026-07-01 19:38:09.166+00	2026-07-13 21:16:49.886+00
11	AULA 2	25	Teórica	Planta Baja	Activo	2026-07-01 19:38:29.477+00	2026-07-13 21:17:05.52+00
12	AULA 3 	34	Teórica	Planta Baja	Activo	2026-07-01 19:38:41.802+00	2026-07-13 21:17:20.565+00
13	AULA 4	32	Teórica	Planta Baja	Activo	2026-07-01 19:38:55.798+00	2026-07-13 21:17:29.37+00
14	AULA 5	30	Teórica	Planta Baja	Activo	2026-07-01 19:39:10.375+00	2026-07-13 21:17:38.337+00
15	LABORATORIO 1	30	Laboratorio	Piso 2	Activo	2026-07-01 19:39:25.127+00	2026-07-13 21:17:50.751+00
16	LABORATORIO 2 	30	Laboratorio	Piso 2	Activo	2026-07-01 19:39:36.999+00	2026-07-13 21:17:58.257+00
21	Aula 6	30	Teórica	Planta Baja	Activo	2026-07-11 20:39:39.886+00	2026-07-13 21:18:03.385+00
22	AULA 7	34	Teórica	Piso 1	Activo	2026-07-14 14:42:39.94+00	2026-07-14 14:42:39.94+00
23	AULA 8	24	Teórica	Piso 1	Activo	2026-07-14 17:12:40.765+00	2026-07-14 17:12:40.765+00
\.


--
-- Data for Name: bloques_horarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bloques_horarios (id_bloque, hora_inicio, hora_fin, tipo_bloque, numero_bloque, created_at, updated_at) FROM stdin;
8	07:00:00	07:45:00	Clase	1	2026-07-01 21:32:53.782+00	2026-07-01 21:32:53.782+00
9	07:45:00	08:30:00	Clase	2	2026-07-01 21:59:09.523+00	2026-07-01 21:59:09.523+00
10	08:45:00	09:30:00	Clase	4	2026-07-11 23:36:01.290211+00	2026-07-11 23:36:01.290211+00
14	10:15:00	10:30:00	Receso	6	2026-07-12 00:22:26.58506+00	2026-07-12 00:22:26.58506+00
15	08:30:00	08:45:00	Receso	3	2026-07-12 00:22:26.584559+00	2026-07-12 00:22:26.584559+00
13	09:30:00	10:15:00	Clase	5	2026-07-11 23:38:32.652285+00	2026-07-11 23:38:32.652285+00
12	11:15:00	12:00:00	Clase	8	2026-07-11 23:38:32.65201+00	2026-07-11 23:38:32.65201+00
11	10:30:00	11:15:00	Clase	7	2026-07-11 23:38:32.572941+00	2026-07-11 23:38:32.572941+00
\.


--
-- Data for Name: calificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.calificaciones (id_calificacion, id_matricula, id_plan, id_momento, id_escala, inasistencias_asignatura, created_at, updated_at) FROM stdin;
103	21	89	1	11	0	2026-07-02 18:25:17.416+00	2026-07-08 14:46:05.826+00
104	23	108	3	18	0	2026-07-13 13:20:03.635+00	2026-07-13 13:20:03.635+00
105	24	108	3	9	0	2026-07-13 13:20:04.166+00	2026-07-13 13:20:04.166+00
106	23	106	3	20	0	2026-07-13 13:26:39.585+00	2026-07-13 13:26:39.585+00
107	24	106	3	3	0	2026-07-13 13:26:40.032+00	2026-07-13 13:26:40.032+00
112	29	111	3	10	0	2026-07-15 03:31:59.944+00	2026-07-15 03:34:25.958+00
111	28	111	3	10	0	2026-07-15 03:31:59.371+00	2026-07-15 03:34:55.574+00
110	27	111	3	10	0	2026-07-15 03:31:58.795+00	2026-07-15 03:36:23.705+00
116	27	111	2	11	0	2026-07-15 04:07:12.147+00	2026-07-15 04:08:36.685+00
115	26	111	2	11	0	2026-07-15 04:07:11.64+00	2026-07-15 04:31:30.682+00
118	29	111	2	12	0	2026-07-15 04:07:13.156+00	2026-07-15 04:31:32.123+00
108	25	111	3	18	0	2026-07-15 03:31:57.639+00	2026-07-15 04:41:06.053+00
109	26	111	3	10	0	2026-07-15 03:31:58.221+00	2026-07-15 04:41:06.638+00
119	30	111	2	15	0	2026-07-15 04:07:13.663+00	2026-07-15 04:47:44.232+00
117	28	111	2	9	0	2026-07-15 04:07:12.651+00	2026-07-15 04:47:45.161+00
113	30	111	3	3	0	2026-07-15 03:32:00.515+00	2026-07-15 04:51:16.393+00
120	21	91	3	15	0	2026-07-15 05:03:26.401+00	2026-07-15 05:03:26.401+00
121	22	91	3	11	0	2026-07-15 05:03:27.214+00	2026-07-15 05:03:27.214+00
114	25	111	2	10	0	2026-07-15 04:07:11.124+00	2026-07-15 05:11:59.033+00
122	23	108	2	10	0	2026-07-15 05:49:13.133+00	2026-07-15 05:49:13.133+00
123	24	108	2	15	0	2026-07-15 05:49:13.567+00	2026-07-15 05:49:13.567+00
124	23	108	4	18	0	2026-07-15 05:51:20.647+00	2026-07-15 05:51:20.647+00
125	24	108	4	13	0	2026-07-15 05:51:21.153+00	2026-07-15 05:51:21.153+00
\.


--
-- Data for Name: dias_semana; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dias_semana (id_dia, nombre, created_at, updated_at) FROM stdin;
1	Lunes	2026-07-01 21:32:53.386+00	2026-07-01 21:32:53.386+00
5	Viernes	2026-07-11 23:34:07.164704+00	2026-07-11 23:34:07.164704+00
4	Jueves	2026-07-11 23:34:07.155625+00	2026-07-11 23:34:07.155625+00
3	Miércoles	2026-07-01 21:33:23.04+00	2026-07-01 21:33:23.04+00
2	Martes	2026-07-11 23:33:37.89463+00	2026-07-11 23:33:37.89463+00
\.


--
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.docentes (id_docente, cedula_docente, nombre1, nombre2, apellido1, apellido2, telefono, correo, token_qr, estatus, created_at, updated_at, id_especialidad, fecha_nac) FROM stdin;
13	30965286	Gregory	Steve	Duque	Mendoza	0414-7399890	gsdm07@gmail.com	\N	Activo	2026-07-01 00:14:57.970679+00	2026-07-01 20:55:57.635+00	21	2005-03-25
14	33654890	Fabian	Martin	Delgado	Angulo	04268760563	elbowe277@gmail.com	\N	\N	2026-07-08 14:38:11.951+00	2026-07-08 14:38:11.951+00	22	2000-07-27
16	V-9469044	Sandra	Elizavet	Mendoza	Pacheco	0414-0763386	voncabito42@gmail.com	\N	Activo	2026-07-11 12:27:16.572+00	2026-07-11 12:27:16.574+00	21	1971-12-28
17	V-9469045	prueba	editar	eliminar	etc	0414-7399810	tusabespa1solofalsedad1aqui@gmail.com	\N	Activo	2026-07-11 19:32:30.093+00	2026-07-11 19:32:30.095+00	20	1972-12-28
18	V-9469047	asdas	dasdasd	dadsdqsde	qwqws	0414-7955140	gsqwdddm07@gmail.com	\N	Activo	2026-07-11 20:13:07.779+00	2026-07-11 20:13:07.78+00	22	2000-01-01
20	987654321	Juan	Carlos	Pérez	Gómez	0414-2814679	docente@gmail.com	\N	Activo	2026-07-14 16:19:55.533+00	2026-07-14 16:19:55.536+00	23	1975-06-12
25	31098412	Isamary	de la Consolacion	Sarmiento	Suarez	0412-4159061	isamaryprueba@gmail.com	\N	Activo	2026-07-14 18:35:58.974+00	2026-07-14 18:35:58.975+00	24	2004-08-06
26	27462797	Josedaniel	Josdaniel	Carvajal	Chacon	04123129425	josdanielcch@gmail.com	\N	Activo	2026-07-15 03:15:05.843+00	2026-07-15 03:15:05.845+00	25	2000-11-14
28	15990468	Daniela	Andrea	Chacon	Ramirez	04141776859	danielachacon@gmail.com	\N	Activo	2026-07-15 05:59:48.156+00	2026-07-15 05:59:48.159+00	20	1984-02-28
\.


--
-- Data for Name: escala_calificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.escala_calificaciones (id_escala, nota_impresa, nota_literal, nota_calculo, ponderacion_letra, created_at, updated_at) FROM stdin;
1	01	Insuficiente	1	C	2026-07-02 18:20:51.81+00	2026-07-02 18:20:51.81+00
2	02	Insuficiente	2	C	2026-07-02 18:20:52.184+00	2026-07-02 18:20:52.184+00
3	03	Insuficiente	3	C	2026-07-02 18:20:52.506+00	2026-07-02 18:20:52.506+00
4	04	Insuficiente	4	C	2026-07-02 18:20:52.822+00	2026-07-02 18:20:52.822+00
5	05	Insuficiente	5	C	2026-07-02 18:20:53.129+00	2026-07-02 18:20:53.129+00
6	06	Insuficiente	6	C	2026-07-02 18:20:53.766+00	2026-07-02 18:20:53.766+00
7	07	Insuficiente	7	C	2026-07-02 18:21:29.149+00	2026-07-02 18:21:29.149+00
8	08	Insuficiente	8	C	2026-07-02 18:21:29.457+00	2026-07-02 18:21:29.457+00
9	09	Insuficiente	9	C	2026-07-02 18:21:29.747+00	2026-07-02 18:21:29.747+00
10	10	Mínima	10	B	2026-07-02 18:21:30.036+00	2026-07-02 18:21:30.036+00
11	11	Mínima	11	B	2026-07-02 18:21:30.337+00	2026-07-02 18:21:30.337+00
12	12	Mínima	12	B	2026-07-02 18:21:30.628+00	2026-07-02 18:21:30.628+00
13	13	Mínima	13	B	2026-07-02 18:21:30.911+00	2026-07-02 18:21:30.911+00
14	14	Mínima	14	B	2026-07-02 18:21:31.191+00	2026-07-02 18:21:31.191+00
15	15	Sobresaliente	15	A	2026-07-02 18:21:31.476+00	2026-07-02 18:21:31.476+00
16	16	Sobresaliente	16	A	2026-07-02 18:21:31.798+00	2026-07-02 18:21:31.798+00
17	17	Sobresaliente	17	A	2026-07-02 18:21:32.099+00	2026-07-02 18:21:32.099+00
18	18	Sobresaliente	18	A	2026-07-02 18:21:32.376+00	2026-07-02 18:21:32.376+00
19	19	Sobresaliente	19	A	2026-07-02 18:21:32.715+00	2026-07-02 18:21:32.715+00
20	20	Sobresaliente	20	A	2026-07-02 18:21:33.036+00	2026-07-02 18:21:33.036+00
\.


--
-- Data for Name: especialidades; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.especialidades (id_especialidad, nombre, estatus, created_at, updated_at) FROM stdin;
20	Biologia	Activa	2026-07-01 20:55:36.297+00	2026-07-01 20:55:36.297+00
21	Matematica	Activa	2026-07-01 20:55:48.053+00	2026-07-01 20:55:48.053+00
22	Física	Activa	2026-07-08 14:37:40.425+00	2026-07-08 14:37:40.425+00
23	Historiador	Activa	2026-07-11 22:32:15.118+00	2026-07-11 22:32:15.118+00
24	Físico Nucleo	Activa	2026-07-14 16:59:42.227+00	2026-07-14 16:59:42.227+00
25	Educacion Fisica	Activa	2026-07-15 03:14:53.835+00	2026-07-15 03:14:53.835+00
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.estudiantes (id_estudiante, cedula_escolar, nombre1, nombre2, apellido1, apellido2, fecha_nac, lugar_nac, municipio, estado, genero, id_representante, estatus_estudiante, created_at, updated_at) FROM stdin;
22	V-27462797	Josedaniel	\N	Carvajal	Chacon	2000-11-14	\N	Cárdenas	Táchira	M	19	Activo	2026-07-01 22:11:41.418+00	2026-07-13 00:40:07.801+00
24	V-30965286	Gregory	Steve	Duque	Mendoza	2005-03-25	Pedro María Morantes	San Cristóbal	Táchira	M	21	Activo	2026-07-13 00:39:23.671+00	2026-07-13 03:35:31.717+00
23	V-31562394	Exercitationem	assum Mollit consectetur	Arequipe	Rem consequu Sed molestiae sit n	1982-06-14	La Florida	Cárdenas	Táchira	M	20	Activo	2026-07-08 14:52:30.38+00	2026-07-13 03:58:11.181+00
25	V-123456789	aurelio	bizancio	crepusculo	daltonico	2005-03-25	Platanillal	Atures	Amazonas	M	22	Activo	2026-07-13 01:51:38.629+00	2026-07-13 04:16:06.332+00
28	V-71515243	fsfgdf	fgsfg	sdgsdg	gsdg	2005-03-25	Apurito	Achaguas	Apure	F	25	Activo	2026-07-15 01:38:14.772+00	2026-07-15 01:38:14.772+00
26	V-33965286	Maria	Isabela	Romero	Lopez	2005-03-25	El Recreo	San Fernando	Apure	F	23	Activo	2026-07-15 01:25:17.585+00	2026-07-15 01:40:11.801+00
27	V-13423342	sdfwd	fsdfsd	fsdfs	dfsdfs	2005-03-25	Pozuelos	Sotillo	Anzoátegui	F	24	Activo	2026-07-15 01:32:35.759+00	2026-07-15 01:45:37.632+00
29	V-12345564	samuel	mandarina	roa	como	2005-03-25	La Sabanita	Heres	Bolívar	F	26	Activo	2026-07-15 01:50:21.923+00	2026-07-15 02:05:28.368+00
30	V-132334245	veatriz	fsdvcsd	emiliana	vsfvsfvsdv	2005-03-25	Anaco	Anaco	Anzoátegui	M	27	Activo	2026-07-15 02:07:27.002+00	2026-07-15 02:12:03.9+00
31	V-56789034	wfw	wfw	wfw	wfw	2005-03-25	Pozuelos	Sotillo	Anzoátegui	F	28	Activo	2026-07-15 02:12:51.884+00	2026-07-15 02:12:51.884+00
32	V-1234567	alejo	duran	camargo	malandro	2005-03-25	Chirica	Caroní	Bolívar	M	29	Inactivo	2026-07-15 02:31:52.895+00	2026-07-15 02:32:03.131+00
\.


--
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluaciones (id_evaluacion, id_plan, id_seccion, id_momento, descripcion, ponderacion, created_at, updated_at) FROM stdin;
35	89	15	1	Evaluación Única	25	2026-07-01 22:36:52.409+00	2026-07-02 18:11:46.974+00
36	89	15	1	Nueva Actividad	25	2026-07-01 22:36:52.518+00	2026-07-02 18:11:47.129+00
38	89	15	1	Nueva Actividad	25	2026-07-02 18:11:47.293+00	2026-07-02 18:11:47.293+00
39	89	15	2	Evaluación Única	25	2026-07-08 14:48:43.824+00	2026-07-08 14:48:43.824+00
40	89	15	2	Nueva Actividad	25	2026-07-08 14:48:43.903+00	2026-07-08 14:48:43.903+00
41	89	15	2	Nueva Actividad	25	2026-07-08 14:48:43.978+00	2026-07-08 14:48:43.978+00
42	89	15	2	Nueva Actividad	25	2026-07-08 14:48:44.054+00	2026-07-08 14:48:44.054+00
43	108	20	3	Examen 1	50	2026-07-13 13:18:56.891+00	2026-07-13 13:18:56.891+00
44	108	20	3	Examen 2	50	2026-07-13 13:18:56.97+00	2026-07-13 13:18:56.97+00
45	106	20	3	Evaluación primera	100	2026-07-13 13:26:28.821+00	2026-07-13 13:26:28.821+00
46	111	21	3	Evaluación Única	80	2026-07-15 03:30:27.662+00	2026-07-15 03:30:27.662+00
47	111	21	3	Nueva Actividad 1	10	2026-07-15 03:30:27.74+00	2026-07-15 03:30:27.74+00
48	111	21	3	Nueva Actividad 2	10	2026-07-15 03:30:27.814+00	2026-07-15 03:30:27.814+00
49	111	21	2	examen	50	2026-07-15 04:06:54.045+00	2026-07-15 04:06:54.045+00
50	111	21	2	lamina	50	2026-07-15 04:06:54.123+00	2026-07-15 04:06:54.123+00
51	91	15	3	Evaluación Única	25	2026-07-15 04:51:16.798+00	2026-07-15 04:51:16.798+00
52	91	15	3	Nueva Actividad	25	2026-07-15 04:51:16.896+00	2026-07-15 04:51:16.896+00
53	91	15	3	Nueva Actividad	25	2026-07-15 04:51:16.986+00	2026-07-15 04:51:16.986+00
54	91	15	3	Nueva Actividad	25	2026-07-15 04:51:17.077+00	2026-07-15 04:51:17.077+00
37	89	15	1	Nueva Actividad	50	2026-07-02 18:11:47.205+00	2026-07-15 05:34:21.723+00
55	108	20	2	Evaluación Única	100	2026-07-15 05:49:02.163+00	2026-07-15 05:49:02.163+00
56	108	20	4	Evaluación Única	75	2026-07-15 05:50:08.974+00	2026-07-15 05:50:08.974+00
57	108	20	4	Nueva Actividad	25	2026-07-15 05:50:09.051+00	2026-07-15 05:50:09.051+00
\.


--
-- Data for Name: grados_anos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.grados_anos (id_grado, numero, nombre, created_at, updated_at) FROM stdin;
1	1	1er Año	2026-07-01 20:45:59.392+00	2026-07-01 20:45:59.392+00
2	2	2do Año	2026-07-01 20:45:59.392+00	2026-07-01 20:45:59.392+00
3	3	3er Año	2026-07-01 20:45:59.392+00	2026-07-01 20:45:59.392+00
4	4	4to Año	2026-07-01 20:45:59.392+00	2026-07-01 20:45:59.392+00
5	5	5to Año	2026-07-01 20:45:59.392+00	2026-07-01 20:45:59.392+00
\.


--
-- Data for Name: historico_notas_certificadas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.historico_notas_certificadas (id_historico, id_estudiante, id_grado, id_asignatura, id_periodo, id_escala, institucion_origen, created_at, updated_at) FROM stdin;
5	24	4	34	7	11	L.N. Estilita Orozco	2026-07-13 13:57:59.798+00	2026-07-13 13:57:59.798+00
6	24	4	39	7	17	L.N. Estilita Orozco	2026-07-13 13:57:59.798+00	2026-07-13 13:57:59.798+00
\.


--
-- Data for Name: horario_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.horario_docente (id_horario, id_docente, id_asignatura, id_seccion, id_dia, id_bloque, id_aula, created_at, updated_at, id_periodo) FROM stdin;
25	18	26	15	2	8	10	2026-07-13 03:31:24.873+00	2026-07-13 03:34:07.99+00	7
26	25	33	15	2	9	10	2026-07-14 20:05:33.258+00	2026-07-14 23:47:30.089+00	6
16	14	27	15	1	9	10	2026-07-08 14:40:14.283+00	2026-07-08 14:40:14.283+00	7
24	17	34	17	3	9	21	2026-07-12 22:04:19.309+00	2026-07-12 22:04:19.309+00	7
15	13	24	15	1	8	10	2026-07-02 17:28:03.848+00	2026-07-02 17:28:03.848+00	7
27	17	29	15	2	9	10	2026-07-15 00:13:06.286+00	2026-07-15 00:13:06.286+00	7
\.


--
-- Data for Name: justificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.justificaciones (id_justificacion, id_asistencia, motivo, soporte_digital, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: login_audit; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.login_audit (id, username, ip_address, user_agent, success, created_at) FROM stdin;
1	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-02 23:15:11.617
2	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-02 23:16:20.257
3	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-02 23:16:41.655
4	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-02 23:16:58.209
5	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-02 23:17:11.066
6	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-02 23:17:15.254
7	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-02 23:17:30.558
8	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-03 00:02:31.77
9	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-03 00:07:35.279
10	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-03 00:08:18.821
11	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-03 00:08:34.419
12	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-03 17:21:55.586
13	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:41:31.025
14	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:41:34.369
15	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:41:38.888
16	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:41:50.93
17	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:42:18.841
18	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:42:53.314
19	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:43:00.302
20	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:43:03.752
21	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:43:09.178
22	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-05 23:43:11.894
23	admin	10.197.22.131	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	f	2026-07-06 00:05:29.968
24	admin	10.197.217.9	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	f	2026-07-06 00:05:34.479
25	admin	10.193.123.3	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	t	2026-07-06 00:06:27.547
26	gregory	10.197.22.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-06 17:48:01.347
27	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-06 20:48:58.387
28	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-07 00:19:11.627
29	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-07 00:19:24.812
30	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-07 20:12:46.195
31	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 02:38:48.385
32	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 02:39:00.981
33	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	f	2026-07-08 02:42:55.208
34	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 02:43:06.514
35	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 02:44:22.333
36	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 02:45:09.966
37	admin	10.194.238.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	t	2026-07-08 13:25:43.412
38	admin	10.194.97.5	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	t	2026-07-08 13:26:05.212
39	admin	10.199.186.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-08 13:26:46.507
40	admin	10.194.97.5	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	t	2026-07-08 13:28:09.332
41	admin	10.194.238.2	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-08 14:11:14.058
42	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-08 14:31:52.58
43	admin	10.194.97.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-08 14:47:50.968
44	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 03:48:54.026
45	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 03:55:50.775
46	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 04:00:13.574
47	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 14:03:29.154
48	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 14:47:00.24
49	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 15:32:22.887
50	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 15:41:05.741
51	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 15:52:37.525
52	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-10 17:35:00.266
53	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 04:11:28.783
54	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 04:41:52.358
55	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 05:07:54.279
56	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 11:13:54.979
57	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 11:47:57.703
58	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 11:48:12.706
59	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:03:10.786
60	secretaria	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:03:36.251
61	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:18:17.453
62	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:26:35.525
63	9469044	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:27:50.251
64	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:34:49.007
65	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 12:41:22.2
66	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 18:50:10.455
67	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 19:22:24.876
68	9469045	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 19:32:49.595
69	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 19:45:03.891
70	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:02:15.308
71	admin	10.192.29.131	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	t	2026-07-11 20:02:20.93
72	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:03:11.228
73	9469045	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:08:36.842
74	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:12:12.151
75	9469047	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:14:25.951
76	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:15:31.369
77	9469047	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:16:11.623
78	9469047	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:16:36.57
79	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:26:43.432
80	30965287	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:31:03.068
81	12345678	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:32:39.966
82	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-11 20:51:57.581
83	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 20:52:03.283
84	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 21:16:31.46
85	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 21:37:08.8
86	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 21:50:01.558
87	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	f	2026-07-11 22:05:21.802
88	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	f	2026-07-11 22:05:35.572
89	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-11 22:05:43.167
90	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-11 22:05:59.567
91	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 22:08:58.26
92	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-11 22:47:48.257
93	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 22:47:51.937
94	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 23:46:46.114
95	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-11 23:48:04.131
96	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-11 23:56:55.66
97	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 00:03:31.786
98	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-12 00:06:27.153
99	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-12 00:06:36.8
100	admin	::1	Mozilla/5.0 (Windows NT; Windows NT 10.0; es-MX) WindowsPowerShell/5.1.26100.8655	t	2026-07-12 00:06:47.898
101	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 00:12:13.177
102	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 00:22:56.535
103	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 00:24:18.236
104	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 00:46:09.477
105	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 16:34:25.975
106	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 18:31:51.433
107	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 19:54:52.151
108	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:09:47.631
109	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:10:52.664
110	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:12:03.897
111	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:30:10.949
112	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:30:28.477
113	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:54:13.843
114	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 20:55:25.193
115	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-12 21:17:42.258
116	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-12 21:18:02.351
117	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 21:18:18.709
118	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 21:30:41.515
119	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 21:32:52.004
120	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 21:34:46.71
121	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 22:03:28.101
122	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 22:03:35.509
123	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 22:14:44.843
124	admin	10.192.164.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 22:51:55.815
125	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 22:57:15.938
126	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 23:30:51.022
127	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 23:39:09.503
128	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 23:48:15.862
129	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-12 23:49:00.039
130	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 00:02:09.138
131	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 00:26:52.922
132	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 00:26:57.915
133	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 00:37:33.411
134	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 00:37:42.357
135	admin	10.198.143.16	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 01:13:48.423
136	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 01:49:21.784
137	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 01:49:30.219
138	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 02:16:58.874
139	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 02:17:03.851
140	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 02:37:08.061
141	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 02:38:17.184
142	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:08:28.898
143	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:09:48.955
144	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:10:46.066
145	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:13:23.163
146	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:13:28.167
147	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:28:42.183
148	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:45:47.191
149	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:47:25.246
150	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:54:15.765
151	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 03:54:20.351
152	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 04:14:20.145
153	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 04:14:35.594
154	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 04:14:49.154
155	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 04:36:58.159
156	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 05:34:05.425
157	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 05:35:28.765
158	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:07:26.156
159	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:07:32.627
160	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:30:33.509
161	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:39:43.382
162	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:44:13.417
163	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:44:30.249
164	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 06:44:57.905
165	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:02:04.069
166	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:02:11.27
167	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:05:50.464
168	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:24:19.552
169	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:24:39.179
170	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:24:55.683
171	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:26:59.762
172	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:29:21.321
173	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:29:49.358
174	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 07:30:11.64
175	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:11:16.844
176	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:11:30.549
177	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:12:13.734
178	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:14:13.515
179	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:37:29.059
180	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:37:38.141
181	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:39:06.735
182	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:53:46.819
183	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:53:51.525
184	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:56:18.905
185	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 12:56:33.57
186	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 13:13:13.174
187	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 13:19:14.433
188	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 13:26:04.146
189	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 13:36:12.797
190	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 13:36:21.429
191	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 14:16:21.368
192	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 14:16:26.572
193	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 14:21:20.15
194	admin	10.192.187.130	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-13 14:32:34.086
195	admin	10.199.65.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-13 14:40:20.683
196	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 14:59:11.537
197	admin	10.196.111.132	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:18:16.836
198	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:28:05.586
199	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:28:33.26
200	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:28:44.413
201	admin	10.198.143.16	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 15:32:00.671
202	admin	10.192.187.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 15:32:09.562
203	admin	10.192.164.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:32:17.134
204	admin	10.197.222.135	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	t	2026-07-13 15:33:43.326
205	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:41:14.834
206	admin	10.192.187.130	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:51:00.434
207	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	t	2026-07-13 15:53:27.653
208	admin	10.197.222.135	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 15:55:58.33
209	admin	10.199.65.131	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	t	2026-07-13 16:04:54.033
210	admin	10.199.65.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 16:06:30.33
211	admin	10.192.164.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 16:07:21.93
212	admin	10.198.143.16	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 16:20:16.242
213	admin	10.197.222.135	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	f	2026-07-13 16:20:55.153
214	admin	10.198.143.16	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	t	2026-07-13 16:21:02.733
215	docente	10.192.29.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 16:45:33.432
216	admin	10.192.164.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 17:07:57.642
217	admin	10.196.111.132	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 18:58:35.556
218	admin	10.192.164.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	t	2026-07-13 18:58:53.756
219	docente	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:05:43.473
220	control	10.192.29.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:06:32.651
221	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:07:54.166
222	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:09:59.916
223	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:17:10.666
224	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:19:42.997
225	secretaria	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:20:12.923
226	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:25:06.833
227	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:36:47.647
228	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:42:20.032
229	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:43:38.527
230	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:47:52.713
231	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:50:10.845
232	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:51:44
233	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:51:56.305
234	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:52:09.375
235	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:53:15.225
236	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:56:34.5
237	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:56:35.562
238	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:58:58.245
239	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 19:59:48.5
240	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:00:44.476
241	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:01:27.729
242	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:05:21.232
243	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:07:29.012
244	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:07:48.592
245	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:09:49.836
246	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:11:30.03
247	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:21:34.34
248	control	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:27:52.945
249	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:43:43.199
250	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 20:45:32.121
251	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:45:36.277
252	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 20:45:49.596
253	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 20:46:00.238
254	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:00:09.686
255	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 21:00:47.772
256	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:01:27.163
257	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:01:37.842
258	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-13 21:02:40.121
259	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:03:33.286
260	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:07:06.357
261	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:07:14.574
262	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:11:28.804
263	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:20:49.829
264	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 21:20:55.564
265	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 22:01:13.79
266	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 22:01:24.212
267	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 22:08:58.424
268	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 23:44:32.809
269	admin	10.199.186.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-13 23:47:18.276
270	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 05:59:10.097
271	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 05:59:39.967
272	coordinador	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 06:29:40.622
273	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 06:55:07.487
274	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 06:55:12.666
275	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-14 07:05:58.856
276	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 07:06:02.583
277	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 07:06:21.902
278	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 07:16:58.402
279	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 07:17:05.357
280	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-14 10:16:36.372
281	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 10:17:34.98
282	admin	10.196.111.132	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 13:00:18.48
283	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 14:41:21.44
284	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 14:41:41.194
285	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 15:13:36.1
286	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 15:14:21.705
287	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 16:57:04.329
288	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 16:57:16.052
289	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 17:01:50.261
290	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 17:32:32.061
291	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 17:32:39.758
292	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 17:54:48.083
293	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 17:55:00.833
294	admin	10.196.111.132	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	f	2026-07-14 18:02:36.452
295	admin	10.199.65.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	f	2026-07-14 18:02:55.661
296	admin	10.199.65.131	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-14 18:03:19.529
297	admin	10.192.164.3	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	t	2026-07-14 18:06:10.249
298	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 18:33:49.053
299	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-14 18:33:58.329
300	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 18:34:04.038
301	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 19:43:00.72
302	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 20:04:38.068
303	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 20:04:42.744
304	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 21:00:35.831
305	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 21:05:57.272
306	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 23:46:59.681
307	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-14 23:47:08.4
308	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:12:15.683
309	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:12:20.295
310	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:16:58.025
311	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:26:21.072
312	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:31:33.686
313	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:34:41.149
314	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:48:50.308
315	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:49:30.634
316	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:57:17.674
317	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 00:57:22.207
318	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:12:56.928
319	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:13:25.524
320	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:14:39.997
321	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:22:38.609
322	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:23:00.255
323	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:23:32.065
324	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:28:58.087
325	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:39:37.394
326	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:39:42.009
327	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:48:05.909
328	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:48:12.497
329	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 01:58:19.262
330	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:03:10.823
331	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:03:15.387
332	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:10:01.055
333	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:18:40.843
334	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:20:35.915
335	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:26:05.943
336	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 02:27:19.967
337	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:27:33.506
338	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:27:52.142
339	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:29:23.031
340	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:29:28.325
341	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:39:17.556
342	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:50:05.025
343	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:50:36.768
344	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 02:53:48.104
345	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 03:14:43.263
346	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 03:29:29.017
347	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 03:29:36.847
348	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 03:29:49.4
349	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:06:04.447
350	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:06:09.842
351	docente	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:08:14.578
352	27462797	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:20:29.57
353	27462797	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:20:38.001
354	27462797	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:20:50.778
355	27462797	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:20:57.697
356	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:21:07.645
357	27462797	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:21:21.842
358	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	f	2026-07-15 04:21:51.073
359	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:22:27.689
360	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:23:08.256
361	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:23:14.129
362	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:24:26.125
363	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:35:56.232
364	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:38:05.422
365	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:41:16.923
366	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:46:51.259
367	admin	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:46:59.133
368	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:49:13.514
369	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:49:41.63
370	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 04:50:15.879
371	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 05:05:17.285
372	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 05:10:46.085
373	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 05:46:18.318
374	gregory	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 05:57:45.266
375	josedaniel	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	t	2026-07-15 05:58:05.667
\.


--
-- Data for Name: materia_pendiente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.materia_pendiente (id_materia_pendiente, id_estudiante, id_asignatura, id_periodo, id_docente_evaluador, nota_definitiva, estatus, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: matricula; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.matricula (id_matricula, id_estudiante, id_seccion, id_periodo, numero_lista, estatus_matricula, created_at, updated_at) FROM stdin;
21	22	15	6	\N	\N	2026-07-01 22:11:41.612+00	2026-07-01 22:11:41.612+00
22	23	15	7	\N	\N	2026-07-08 14:52:30.826+00	2026-07-08 14:52:30.826+00
23	24	20	7	\N	\N	2026-07-13 00:39:24.159+00	2026-07-13 00:39:24.159+00
24	25	20	7	\N	\N	2026-07-13 01:51:39.128+00	2026-07-13 01:51:39.128+00
25	26	21	7	\N	\N	2026-07-15 01:25:17.847+00	2026-07-15 01:25:17.847+00
26	27	21	7	\N	\N	2026-07-15 01:32:36.087+00	2026-07-15 01:32:36.087+00
27	28	21	7	\N	\N	2026-07-15 01:38:15.117+00	2026-07-15 01:38:15.117+00
28	29	21	7	\N	\N	2026-07-15 01:50:22.181+00	2026-07-15 01:50:22.181+00
29	30	21	7	\N	\N	2026-07-15 02:07:27.255+00	2026-07-15 02:07:27.255+00
30	31	21	7	\N	\N	2026-07-15 02:12:52.139+00	2026-07-15 02:12:52.139+00
31	32	20	7	\N	\N	2026-07-15 02:31:53.6+00	2026-07-15 02:31:53.6+00
\.


--
-- Data for Name: momentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.momentos (id_momento, id_periodo, descripcion, created_at, updated_at) FROM stdin;
1	6	Primer Lapso	2026-07-01 22:36:52.098+00	2026-07-01 22:36:52.098+00
2	7	Segundo Lapso	2026-07-08 14:48:43.668+00	2026-07-08 14:48:43.668+00
3	7	Primer Lapso	2026-07-13 13:18:56.686+00	2026-07-13 13:18:56.686+00
4	7	Tercer Lapso	2026-07-15 05:50:08.825+00	2026-07-15 05:50:08.825+00
\.


--
-- Data for Name: notas_parciales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notas_parciales (id_nota, id_matricula, id_evaluacion, id_escala, created_at, updated_at) FROM stdin;
389	27	47	10	2026-07-15 03:31:53.079+00	2026-07-15 03:36:19.648+00
383	27	46	10	2026-07-15 03:31:50.46+00	2026-07-15 03:36:20.082+00
395	27	48	5	2026-07-15 03:31:55.693+00	2026-07-15 03:36:20.517+00
398	30	48	15	2026-07-15 03:31:56.99+00	2026-07-15 03:36:20.961+00
399	25	49	10	2026-07-15 04:07:08.17+00	2026-07-15 04:07:08.17+00
401	27	49	1	2026-07-15 04:07:09.249+00	2026-07-15 04:07:09.249+00
372	21	36	5	2026-07-02 18:25:15.555+00	2026-07-08 14:46:03.796+00
371	21	35	8	2026-07-02 18:25:15.077+00	2026-07-08 14:46:04.242+00
373	21	37	12	2026-07-02 18:25:16.028+00	2026-07-08 14:46:04.673+00
374	21	38	19	2026-07-02 18:25:16.495+00	2026-07-08 14:46:05.105+00
375	23	44	20	2026-07-13 13:20:01.684+00	2026-07-13 13:20:01.684+00
376	23	43	15	2026-07-13 13:20:02.141+00	2026-07-13 13:20:02.141+00
377	24	43	1	2026-07-13 13:20:02.588+00	2026-07-13 13:20:02.588+00
378	24	44	17	2026-07-13 13:20:03.038+00	2026-07-13 13:20:03.038+00
379	23	45	20	2026-07-13 13:26:38.598+00	2026-07-13 13:26:38.598+00
380	24	45	3	2026-07-13 13:26:39.052+00	2026-07-13 13:26:39.052+00
404	30	49	10	2026-07-15 04:07:10.547+00	2026-07-15 04:07:10.547+00
410	27	50	20	2026-07-15 04:08:35.161+00	2026-07-15 04:08:35.161+00
400	26	49	1	2026-07-15 04:07:08.817+00	2026-07-15 04:31:25.478+00
403	29	49	10	2026-07-15 04:07:10.114+00	2026-07-15 04:31:26.707+00
407	28	50	2	2026-07-15 04:07:40.933+00	2026-07-15 04:31:27.935+00
408	29	50	13	2026-07-15 04:07:41.377+00	2026-07-15 04:31:28.37+00
392	30	47	10	2026-07-15 03:31:54.379+00	2026-07-15 03:33:34.864+00
406	26	50	20	2026-07-15 04:07:40.496+00	2026-07-15 04:31:28.802+00
381	25	46	20	2026-07-15 03:31:49.589+00	2026-07-15 04:40:59.777+00
387	25	47	17	2026-07-15 03:31:52.216+00	2026-07-15 04:41:00.209+00
393	25	48	2	2026-07-15 03:31:54.819+00	2026-07-15 04:41:00.644+00
388	26	47	10	2026-07-15 03:31:52.648+00	2026-07-15 04:41:01.079+00
382	26	46	10	2026-07-15 03:31:50.028+00	2026-07-15 04:41:01.51+00
394	26	48	5	2026-07-15 03:31:55.26+00	2026-07-15 04:41:01.94+00
396	28	48	10	2026-07-15 03:31:56.123+00	2026-07-15 04:41:04.173+00
402	28	49	15	2026-07-15 04:07:09.681+00	2026-07-15 04:47:40.564+00
409	30	50	20	2026-07-15 04:07:41.813+00	2026-07-15 04:47:42.79+00
391	29	47	10	2026-07-15 03:31:53.943+00	2026-07-15 03:34:22.136+00
385	29	46	10	2026-07-15 03:31:51.326+00	2026-07-15 03:34:22.567+00
397	29	48	10	2026-07-15 03:31:56.559+00	2026-07-15 03:34:22.997+00
390	28	47	10	2026-07-15 03:31:53.514+00	2026-07-15 03:34:51.845+00
384	28	46	10	2026-07-15 03:31:50.89+00	2026-07-15 03:34:52.274+00
386	30	46	1	2026-07-15 03:31:51.783+00	2026-07-15 04:51:10.94+00
411	21	51	15	2026-07-15 05:03:21.681+00	2026-07-15 05:03:21.681+00
412	22	51	10	2026-07-15 05:03:22.237+00	2026-07-15 05:03:22.237+00
413	21	52	16	2026-07-15 05:03:22.776+00	2026-07-15 05:03:22.776+00
414	22	52	8	2026-07-15 05:03:23.317+00	2026-07-15 05:03:23.317+00
415	21	53	14	2026-07-15 05:03:23.859+00	2026-07-15 05:03:23.859+00
416	22	53	9	2026-07-15 05:03:24.402+00	2026-07-15 05:03:24.402+00
417	21	54	14	2026-07-15 05:03:24.95+00	2026-07-15 05:03:24.95+00
418	22	54	18	2026-07-15 05:03:25.496+00	2026-07-15 05:03:25.496+00
405	25	50	10	2026-07-15 04:07:40.052+00	2026-07-15 05:11:58.458+00
419	23	55	10	2026-07-15 05:49:12.124+00	2026-07-15 05:49:12.124+00
420	24	55	15	2026-07-15 05:49:12.629+00	2026-07-15 05:49:12.629+00
421	23	56	20	2026-07-15 05:51:18.754+00	2026-07-15 05:51:18.754+00
422	24	56	14	2026-07-15 05:51:19.19+00	2026-07-15 05:51:19.19+00
423	23	57	12	2026-07-15 05:51:19.628+00	2026-07-15 05:51:19.628+00
424	24	57	10	2026-07-15 05:51:20.062+00	2026-07-15 05:51:20.062+00
\.


--
-- Data for Name: periodos_escolares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.periodos_escolares (id_periodo, nombre, estatus, created_at, updated_at) FROM stdin;
6	2026-2027	Cerrado	2026-07-01 16:53:50.392+00	2026-07-08 14:12:20.951+00
7	2025-2026	Activo	2026-07-02 13:56:55.028+00	2026-07-13 20:26:57.685+00
\.


--
-- Data for Name: plan_estudio; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.plan_estudio (id_plan, id_grado, id_asignatura, codigo_asignatura, posicion, created_at, updated_at) FROM stdin;
89	1	24	CAS1	1	2026-07-01 20:49:18.842+00	2026-07-01 20:49:18.842+00
90	1	26	ING1	2	2026-07-01 21:58:11.381+00	2026-07-02 14:19:05.782+00
91	1	27	MAT1	3	2026-07-02 14:19:49.921+00	2026-07-02 14:19:49.921+00
92	1	28	EDF1	4	2026-07-02 14:20:30.35+00	2026-07-02 14:20:30.35+00
93	1	29	AYP1	5	2026-07-02 14:21:09.816+00	2026-07-02 14:21:09.816+00
94	1	30	CSN1	6	2026-07-02 14:21:41.713+00	2026-07-02 14:21:41.713+00
95	1	31	GHC1	7	2026-07-02 14:22:18.783+00	2026-07-02 14:22:18.783+00
96	1	32	OYC1	8	2026-07-02 14:22:59.85+00	2026-07-02 14:22:59.85+00
98	2	34	CAS2	1	2026-07-02 14:38:11.221+00	2026-07-02 14:38:11.221+00
99	2	26	ING2	2	2026-07-02 14:38:42.866+00	2026-07-02 14:38:42.866+00
100	2	27	MAT2	2	2026-07-02 14:39:13.013+00	2026-07-02 14:39:13.013+00
102	3	34	CAS3	1	2026-07-11 21:37:56.101+00	2026-07-11 21:37:56.101+00
105	3	37	LRA1	2	2026-07-11 21:53:49.202+00	2026-07-11 21:53:49.202+00
106	4	39	PRD1	1	2026-07-13 02:38:09.297+00	2026-07-13 02:38:09.297+00
107	3	40	RED1	3	2026-07-13 04:31:02.571+00	2026-07-13 04:31:02.571+00
108	4	34	CAS4	2	2026-07-13 04:43:14.538+00	2026-07-13 04:43:14.538+00
109	4	45	HIT1	3	2026-07-14 15:24:18.264+00	2026-07-14 15:24:18.264+00
110	4	46	PSC1	4	2026-07-14 15:24:57.539+00	2026-07-14 15:24:57.539+00
111	5	34	CAS5	1	2026-07-15 03:17:03.16+00	2026-07-15 03:17:03.16+00
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.refresh_tokens (id, id_usuario, token_hash, expires_at, created_at, revoked_at) FROM stdin;
433	14	214e179c9b03f17fa499b591d2ea587e08c34903f8ff4422a19f5f0ed23b4466	2026-07-15 08:49:30.786	2026-07-15 00:49:30.786	\N
432	14	f0c85832d9b23d7742e7e1dbe41998b068e9cf6d88bfc91274295e96b437a07f	2026-07-15 08:48:50.525	2026-07-15 00:48:50.525	2026-07-15 00:51:33.069
434	14	ac2f69d0f6aadc05fb3dc557922776dc0d235a13dc644e15bf8d03032ec4c952	2026-07-15 08:51:33.396	2026-07-15 00:51:33.397	\N
435	17	a13623c114a126df059608970bc1c58accf45defe480b641130f791daa9ad9c3	2026-07-15 08:57:17.831	2026-07-15 00:57:17.831	\N
436	14	3042e51c57a2e6061282736d144a5c2c199c1c4c5a8a1f8d4f2d8f6839963742	2026-07-15 08:57:22.355	2026-07-15 00:57:22.355	\N
437	14	e51c1374826bccb659c48bba95b39a3f36d646b27dee3909d2578f465446ad70	2026-07-15 09:12:57.178	2026-07-15 01:12:57.178	2026-07-15 01:14:20.482
439	39	6c9cc3e79d161c76e56296db8a93ab551a5d0faf2192ebb4d94616ce36d27506	2026-07-15 09:14:40.197	2026-07-15 01:14:40.197	\N
438	14	63e986d3ccf84b5f4ba6faefbd6cd13bb3c9556b36a380e678c92895e09016c1	2026-07-15 09:13:25.684	2026-07-15 01:13:25.686	2026-07-15 01:14:49.154
440	14	1152f474c8567104e7605cc83ac29f4b844c7edd03cff9f956a9f71a4749ce27	2026-07-15 09:14:49.405	2026-07-15 01:14:49.405	2026-07-15 01:21:26.017
441	17	4b375ae94b6f2f6d69458d6f5e84121bb437d8771a11ed84f9940b42af49d5c7	2026-07-15 09:22:38.778	2026-07-15 01:22:38.778	\N
443	14	7cb6af9a547d65e2545846c919810178335e3378592d2d42be248f78da22f1e3	2026-07-15 09:23:32.212	2026-07-15 01:23:32.212	2026-07-15 01:38:39.387
445	14	7702924c0c062d61708778d2f8df1fb9eb5eb66010e0badd74cbcc261b3f4075	2026-07-15 09:38:39.617	2026-07-15 01:38:39.617	\N
442	14	2b7edd7b2b0d48592bb9b409ea3fadc7883574c584c1e8a5332440fa7baab665	2026-07-15 09:23:00.407	2026-07-15 01:23:00.408	2026-07-15 01:39:27.28
447	17	e41373185997c491492c66bcfa79ec417c6398623982568b9b5cc0f9beeb1692	2026-07-15 09:39:37.553	2026-07-15 01:39:37.553	\N
448	14	952a4419255af521401e285907f89d2905c1c38fcecca9ec37318eff58442429	2026-07-15 09:39:42.157	2026-07-15 01:39:42.157	\N
449	17	565b6dbba48374e21e324acacb5f87d560450ef67ae646994cde77e83ccf56d5	2026-07-15 09:48:06.068	2026-07-15 01:48:06.068	\N
450	14	6295ebf3721dd057d0e5763c7dda946049d1027beed44acfe4fe3402d13837b8	2026-07-15 09:48:12.645	2026-07-15 01:48:12.645	\N
444	39	9d674bc35e0b539119fbb32c6b4e984dfd059aaca915c17df1fcbccfda27a6be	2026-07-15 09:28:58.316	2026-07-15 01:28:58.317	2026-07-15 01:49:19.774
451	39	655a86a73f48c6d260eb4f12a7776be9339c84d7d4c31e9b31927317fd8037a1	2026-07-15 09:49:20.061	2026-07-15 01:49:20.062	2026-07-15 01:55:59.649
446	14	d34f57fcac111fee02585cad7891b00926e9aa57f6d40fade5618c3afc9a8d47	2026-07-15 09:39:27.508	2026-07-15 01:39:27.508	2026-07-15 01:56:53.002
452	14	326bf1a387c14743ace163fa680ee576f7bdcd814daccc976a1e4fab5ed39089	2026-07-15 09:56:53.239	2026-07-15 01:56:53.239	\N
454	17	0d9e37d8bd4e969efcffadf81ce834b73cf2870f1740636523e667dadcbb9370	2026-07-15 10:03:10.98	2026-07-15 02:03:10.98	\N
453	39	a102b3309843620a1319046c5e4581355d79eb5bef6577af30fb5bd155c04ed8	2026-07-15 09:58:19.461	2026-07-15 01:58:19.461	2026-07-15 02:09:08.372
456	14	8ba54ec9989ef25b911b74c351b0eb14cc7c7212c796d7b489d8820f470aa2f1	2026-07-15 10:10:01.221	2026-07-15 02:10:01.221	2026-07-15 02:10:28.796
455	14	06921008d101ef5bcad8b2551749c6ead8276f2c173140b1d1fd489a877c3517	2026-07-15 10:03:15.536	2026-07-15 02:03:15.536	2026-07-15 02:12:02.644
457	14	83301224e93c6a5d810155fc6e2afd17b9f43180b891ee185359c98b8e631684	2026-07-15 10:12:02.865	2026-07-15 02:12:02.865	\N
458	39	f094eb33fc30d0033e239c557bf9f6336cfe276c8d7d3c699a53316b69a08538	2026-07-15 10:18:41.048	2026-07-15 02:18:41.049	2026-07-15 02:25:52.993
460	39	b82dfa5e6c1029b2ea922969034ea9fd73f50e449fa449a6f5eaf2d0341ff86d	2026-07-15 10:26:06.146	2026-07-15 02:26:06.146	2026-07-15 02:27:08.469
461	39	69d37d4889a4849b166d161d3cf10c321d0a900b26f7a172ed6ee557cd1ba22f	2026-07-15 10:27:33.709	2026-07-15 02:27:33.709	2026-07-15 02:27:36.844
462	39	9001448472e2bad0fd718c5c11661d21cf8a6f42f4837435bc9c69a24c0d7a04	2026-07-15 10:27:52.346	2026-07-15 02:27:52.346	2026-07-15 02:27:55.097
463	17	b4ce489c16333d5447299a77ee58cee9e18bdc87186987d77031b8b63ad59eac	2026-07-15 10:29:23.189	2026-07-15 02:29:23.189	\N
464	14	165b16cdf278c2fd35cf1eeadb7279ef8c6e1428ebb6e7912736abd0da4b2bb5	2026-07-15 10:29:28.471	2026-07-15 02:29:28.471	\N
459	14	e192d19a7832cbcde1f783224099e9ac3521cffeece408b8865fbd9453653f06	2026-07-15 10:20:36.088	2026-07-15 02:20:36.088	2026-07-15 02:35:40.727
465	14	954578a5ea45a012d8c22c58364d74795e622719835cfb90eaa305256c9a8659	2026-07-15 10:35:40.965	2026-07-15 02:35:40.966	\N
466	39	8c5754c64c29736b192f22f6e9f5d8d44454a1aac9177b8ec1e612b495be8b55	2026-07-15 10:39:17.768	2026-07-15 02:39:17.769	2026-07-15 02:39:25.789
467	17	22cec5761c6768ce394722c720768b0b1ffac9b70070fc84a329d726341cb047	2026-07-15 10:50:05.196	2026-07-15 02:50:05.196	2026-07-15 02:50:22.459
469	39	d441a6aa1fc42ea416ab5ab24a8dccdc40eab9d5f85faae3170bd7a85566d266	2026-07-15 10:53:48.327	2026-07-15 02:53:48.327	2026-07-15 03:11:21.167
468	17	3843405b11059dbb06dce89c7ade25ec2a901ef4eb5146aa80b915d81e485aed	2026-07-15 10:50:36.915	2026-07-15 02:50:36.915	2026-07-15 03:13:16.698
471	17	0dc44f062444f7d7515b2ea9f60763130f4513d7b537a5f0fa4572d92ea509b4	2026-07-15 11:13:16.921	2026-07-15 03:13:16.921	\N
472	14	2092c96f60970eeb56556b9ae7aa6eb3b1e3935385fa945085f7d0ff9f3127ec	2026-07-15 11:14:43.424	2026-07-15 03:14:43.425	\N
470	39	89ad8a5286d0d4722147ef72f7aa25716971fa0260e8b22bbae73657ed272bce	2026-07-15 11:11:21.62	2026-07-15 03:11:21.62	2026-07-15 03:26:22.924
474	14	535baf751322a6cc46e3ec8f99c8da87bb1b7890c19489482bd0f09035e7a1d9	2026-07-15 11:29:29.172	2026-07-15 03:29:29.172	\N
473	39	8e5ad421b70b7ebde943324ac5a448da504088baa792dd0431a66334029cfb4f	2026-07-15 11:26:23.219	2026-07-15 03:26:23.22	2026-07-15 03:43:36.693
476	39	aa9399691ce15d1f671b008a5efdeff87d0a8a436a7734487aad43ffcff759d1	2026-07-15 11:43:36.987	2026-07-15 03:43:36.987	2026-07-15 03:43:38.966
475	17	7d2286c0dd350e41511c08bdc7c517bf96afdf158be2a1110dca1418c16d1256	2026-07-15 11:29:49.548	2026-07-15 03:29:49.548	2026-07-15 03:45:48.91
478	17	dede2cd401bdaf0b395d51001f83ab2229e53d21e8476c9d93e3e9a39b6598b2	2026-07-15 11:45:49.132	2026-07-15 03:45:49.133	\N
477	39	96ccc1ff826c331fd9dd152a0f90142276e31e277bc5be1aa76cfa4675d46680	2026-07-15 11:43:39.273	2026-07-15 03:43:39.273	2026-07-15 04:03:01.877
479	39	79a5247c15612a8e7a369b486dafd268dedd46fa248dd08fdc4ec8a9e34d9864	2026-07-15 12:03:02.313	2026-07-15 04:03:02.314	\N
480	17	e89721619bc33387b2197c13d07e5671a1d499539a3b490be7cdb64c97725079	2026-07-15 12:06:04.651	2026-07-15 04:06:04.651	\N
481	14	f852410807b56d40e87080d145a1b95d6bc3b39ffb4f87157a47470b3da95fe5	2026-07-15 12:06:09.99	2026-07-15 04:06:09.99	\N
482	16	2731ca2897595a5e7760b5b0649ddaff7509ec2bdb54169fdda532e7adfa5127	2026-07-15 12:08:14.725	2026-07-15 04:08:14.725	\N
483	39	84414902c72bee11de2f3809fc136f1c20dabd8adaaa5bc52496f5c42d01275f	2026-07-15 12:21:07.877	2026-07-15 04:21:07.877	2026-07-15 04:21:11.287
484	17	9b6db13e14855641c2565c49d9b881a8333fef64eb0ff7234f3550a7bfbaf20a	2026-07-15 12:22:27.853	2026-07-15 04:22:27.853	\N
486	17	9c663ff8bcfaf6d8ac8195c6512ff2645f29f51885753979b2ab56f63a5b4b38	2026-07-15 12:23:14.325	2026-07-15 04:23:14.325	2026-07-15 04:23:18.461
487	39	03e1ca82b63194fc1ad1dc0702a6dfc97b36ab810a9af6e1559f67e4d78f0838	2026-07-15 12:24:26.302	2026-07-15 04:24:26.302	2026-07-15 04:27:32.492
485	14	d482f7e06851718571801253f5133f8102f36d60aed96d596a7058017bab60b6	2026-07-15 12:23:08.403	2026-07-15 04:23:08.403	2026-07-15 04:31:50.925
488	39	e75670691a1411ec1270d7ad597eaecc267aeea8ff8087905505d3e1b907059a	2026-07-15 12:35:56.435	2026-07-15 04:35:56.435	\N
489	17	865855a8b023e0d2262709bdfb87b97c9aa9a55d0c8f30a20cedc40fae0c4b45	2026-07-15 12:38:05.578	2026-07-15 04:38:05.578	\N
490	14	81729b866f189bd0bb883519842ab61770f374fa4d6525880f049c8d365752a1	2026-07-15 12:41:17.126	2026-07-15 04:41:17.126	\N
491	17	3b95586c2cf1ca45314133bf3328d1fddd484927818f55aabc9a441e3e6c0e93	2026-07-15 12:46:51.413	2026-07-15 04:46:51.413	\N
492	14	7f80488a97b3eaf3f8a8670876cda5cce32df1a2481e1407ba69654b8bd70779	2026-07-15 12:46:59.28	2026-07-15 04:46:59.28	2026-07-15 04:49:01.685
493	17	a6799ee7fe9b9f55123fc779cad0cea33d7bd4dd68efd3c480b7a4b49988f460	2026-07-15 12:49:13.661	2026-07-15 04:49:13.661	\N
494	17	32ab9abda930dcdcd5d83c6eade600c332a06cd6e9ebd80359a9e59bc2cd2d5d	2026-07-15 12:49:41.778	2026-07-15 04:49:41.778	\N
495	39	ba694cefe4c5e26f275b4f66338ddc48d38d73989a9ddc610804a84b23289914	2026-07-15 12:50:16.233	2026-07-15 04:50:16.233	2026-07-15 05:05:08.048
496	39	552f16bd43adfa2a8f1c2b0e41df9fd8dc0edbed5c81db55105ced6ffff7821d	2026-07-15 13:05:17.474	2026-07-15 05:05:17.475	2026-07-15 05:23:34.149
497	17	c56a2723fd18a5509576e193f48a8c752793c61765decbeea3688e3991afb79b	2026-07-15 13:10:46.241	2026-07-15 05:10:46.241	2026-07-15 05:32:43.276
499	17	1712f974fe3d0e3958abe955fb240c4725ac78c533133ebd5945724fddc0afbf	2026-07-15 13:32:43.498	2026-07-15 05:32:43.499	\N
498	39	f6173df46f9040a4259dc890538f5cc150f1090adfdecdb46d278782985bd33f	2026-07-15 13:23:34.591	2026-07-15 05:23:34.592	2026-07-15 05:38:55.025
501	17	dc799836d4c7a70556195bac2f33aa5c7961d5ecd23f27c4fc7f13db058b2d6a	2026-07-15 13:46:18.514	2026-07-15 05:46:18.514	\N
500	39	e6acb115c98d7bfdce7c515a6d9ae6780e37acfbbf9692708158cd3751acff61	2026-07-15 13:38:55.303	2026-07-15 05:38:55.303	2026-07-15 05:56:02.213
502	39	43bdfdee3f8a39699630538f17f6a32dd68f0e5cb71c3a8ec7135773a84181ba	2026-07-15 13:56:02.499	2026-07-15 05:56:02.499	2026-07-15 05:57:24.809
503	17	1f00d016a9b760af6ec6a30a8ba6682cfa7519a47e170815ffaa1d3513a3b36d	2026-07-15 13:57:45.46	2026-07-15 05:57:45.46	2026-07-15 05:57:58.113
504	39	92c3189d702cbb9b7a8b15ca61fec292544eed4010a9b4d4b976b9012ffacab1	2026-07-15 13:58:05.88	2026-07-15 05:58:05.88	\N
\.


--
-- Data for Name: representantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.representantes (id_representante, cedula_rep, nombre1, nombre2, apellido1, apellido2, telefono, direccion, correo, created_at, updated_at) FROM stdin;
19	V-15858097	Arturo	Jose	Carvajal	Molina	04141776859	Palmira calle 4 con carrera 3	arturo@gmail.com	2026-07-01 22:11:41.137+00	2026-07-01 22:11:41.137+00
20	E-10145775	Sint consectetur et	Mollit labore omnis	Similique sunt temp	Placeat veniam non	04147006863	Animi ab dolor dict	fofurop@mailinator.com	2026-07-08 14:52:29.762+00	2026-07-08 14:52:29.762+00
21	V-9469044	Sandra	Elizavet	Mendoza	Pacheco	0414-0763386	calle del hambre	ingsm07@gmail.com	2026-07-13 00:39:23.023+00	2026-07-13 03:47:14.021+00
22	V-1234567	eugenio	francisco	gregorio	hemiliano	0414-0763387	joaquin	indominus@hotmail.com	2026-07-13 01:51:38.125+00	2026-07-13 04:16:27.346+00
23	V-10965147	Carmen	Maria	Romero	Lopez	0414-7388210	porahi	dasdaushfo@gmail.com	2026-07-15 01:25:17.323+00	2026-07-15 01:25:17.323+00
24	V-65436509	fsdfs	dfsdfs	yutj	yujgh	4541-54541514	gfhdchnfkvm	tfgdcx@gmail.com	2026-07-15 01:32:35.106+00	2026-07-15 01:32:35.106+00
25	V-2342668	sdfsdc	dsffsdfs	fsdfsdf	sdfsd	3453453453	sgsfghsr	ssedfsrh@gmail.com	2026-07-15 01:38:11.294+00	2026-07-15 01:38:11.294+00
26	V-12325454	sr	armando	referendum	mano	2342452453	ayvale	jandjfa@gmail.com	2026-07-15 01:50:21.661+00	2026-07-15 02:05:44.497+00
27	V-23423423	sdcsdzcvs	wrfwsdrf	fadfswd	wsrfswrfr	2342342342342	agjsadhfojn	rfsdrfwet@gmail.com	2026-07-15 02:07:26.733+00	2026-07-15 02:07:26.733+00
28	V-34243234	sdfw	wfwedf	wfwd	wdfwe	242342	dqeadfe	wef@gmail.com	2026-07-15 02:12:51.372+00	2026-07-15 02:12:51.372+00
29	V-12345566	camila	sepulbeda	raiz	sql	12315	porentreaqui y entrealla	asda@hotmail.com	2026-07-15 02:31:52.63+00	2026-07-15 02:31:52.63+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id_rol, nombre, descripcion, created_at, updated_at) FROM stdin;
4	Administrador	Acceso total al sistema de control de notas y asistencia	2026-06-30 21:50:20.092+00	2026-06-30 21:50:20.092+00
5	Docente	Acceso a registrar calificaciones y asistencias de sus secciones asignadas	2026-06-30 21:50:20.245+00	2026-06-30 21:50:20.245+00
6	Secretaria	Gestión administrativa del plantel	2026-06-30 21:50:20.33+00	2026-06-30 21:50:20.33+00
7	Coordinador	Supervisión académica y de personal	2026-06-30 21:50:20.417+00	2026-06-30 21:50:20.417+00
8	Control de Estudios	Gestión administrativa y control académico	2026-06-30 21:50:42.119+00	2026-06-30 21:50:42.119+00
\.


--
-- Data for Name: secciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.secciones (id_seccion, id_periodo, id_grado, letra, id_docente_guia, created_at, updated_at, id_aula) FROM stdin;
15	6	1	A	13	2026-07-01 21:10:05.021+00	2026-07-01 21:10:05.021+00	\N
16	7	2	B	14	2026-07-08 14:41:06.665+00	2026-07-08 14:41:06.665+00	\N
17	7	3	A	16	2026-07-12 19:57:21.453+00	2026-07-12 19:57:21.453+00	\N
18	7	1	A	13	2026-07-12 22:58:57.019+00	2026-07-12 22:58:57.019+00	\N
19	7	2	A	13	2026-07-12 23:32:43.42+00	2026-07-12 23:32:43.42+00	\N
20	7	4	A	17	2026-07-12 23:48:43.125+00	2026-07-12 23:48:43.125+00	12
21	7	5	A	14	2026-07-15 00:59:05.307+00	2026-07-15 00:59:05.307+00	23
22	7	1	B	26	2026-07-15 03:51:45.898+00	2026-07-15 03:51:45.898+00	10
23	7	3	B	20	2026-07-15 04:11:41.301+00	2026-07-15 04:11:41.301+00	11
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.usuarios (id_usuario, id_rol, id_docente, username, password_hash, estatus, correo, ultimo_acceso, created_at, updated_at, failed_attempts, locked_until, token_version) FROM stdin;
21	7	\N	coordinador	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	cordinador@gmail.com	2026-07-14 06:29:40.868+00	2026-07-01 12:00:00+00	2026-07-15 01:17:56.726+00	0	\N	5
14	4	\N	admin	$2b$10$0d98uLRaOCGcDuyMmev.iOxaDcvUnDDjbt4sYhLYv46orjsxQTrZG	Activo	fabiandelgado5b@gmail.com	2026-07-15 04:46:59.353+00	2026-06-30 21:50:42.591+00	2026-07-15 04:49:01.761+00	0	\N	58
16	5	\N	docente	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	\N	2026-07-15 04:08:14.798+00	2026-06-30 21:50:42.928+00	2026-07-15 04:08:14.799+00	0	\N	7
17	4	13	gregory	$2a$04$E0FR6DapXky6Lq4RYs7iJOiO76eMwgm6XJ.XifrrajZ9FvKtLgwlG	Activo	gsdm07@gmail.com	2026-07-15 05:57:45.557+00	2026-06-30 22:32:04.807491+00	2026-07-15 05:57:58.206+00	0	\N	22
39	4	\N	josedaniel	$2b$10$9wrw5RsnYNSDQUh4FH1RGeUPT9JE9FGkA0w9p8OCtFDmPRcDs0rRC	Activo	josdanielcch@gmail.com	2026-07-15 05:58:05.974+00	2026-07-15 01:14:15.495+00	2026-07-15 05:58:05.974+00	0	\N	11
41	5	28	15990468	$2b$10$rK4k2w2SiPmfuvOORB2FauXPIpaC3dNn/mSoIolKJCYlQr4OUQJl2	Activo	danielachacon@gmail.com	\N	2026-07-15 05:59:48.156+00	2026-07-15 05:59:48.436+00	0	\N	0
15	8	\N	control	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	\N	2026-07-13 20:27:53.234+00	2026-06-30 21:50:42.76+00	2026-07-13 20:27:53.235+00	0	\N	1
13	5	\N	secretaria	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	secretaria@local.liceo	2026-07-13 19:20:13.148+00	2026-06-30 21:50:20.784+00	2026-07-13 19:20:30.304+00	0	\N	2
\.


--
-- Name: asignaturas_id_asignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asignaturas_id_asignatura_seq', 46, true);


--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_docente_id_asistencia_seq', 18, true);


--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_estudiante_id_asistencia_est_seq', 57, true);


--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.auditoria_id_auditoria_seq', 117, true);


--
-- Name: aulas_id_aula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aulas_id_aula_seq', 24, true);


--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bloques_horarios_id_bloque_seq', 15, true);


--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.calificaciones_id_calificacion_seq', 125, true);


--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dias_semana_id_dia_seq', 11, true);


--
-- Name: docentes_id_docente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.docentes_id_docente_seq', 28, true);


--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.escala_calificaciones_id_escala_seq', 1, false);


--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.especialidades_id_especialidad_seq', 25, true);


--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 32, true);


--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 57, true);


--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.grados_anos_id_grado_seq', 5, true);


--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.historico_notas_certificadas_id_historico_seq', 6, true);


--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.horario_docente_id_horario_seq', 27, true);


--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_id_justificacion_seq', 1, false);


--
-- Name: login_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.login_audit_id_seq', 375, true);


--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.materia_pendiente_id_materia_pendiente_seq', 1, true);


--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.matricula_id_matricula_seq', 31, true);


--
-- Name: momentos_id_momento_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.momentos_id_momento_seq', 4, true);


--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notas_parciales_id_nota_seq', 424, true);


--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.periodos_escolares_id_periodo_seq', 20, true);


--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plan_estudio_id_plan_seq', 111, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 504, true);


--
-- Name: representantes_id_representante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.representantes_id_representante_seq', 29, true);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 8, true);


--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.secciones_id_seccion_seq', 23, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 41, true);


--
-- Name: asignaturas asignaturas_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key1 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key10 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key11 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key12 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key2 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key3 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key4 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key5 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key6 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key7 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key8 UNIQUE (nombre);


--
-- Name: asignaturas asignaturas_nombre_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_nombre_key9 UNIQUE (nombre);


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
-- Name: docentes docentes_cedula_docente_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key1 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key10 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key11 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key12 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key13; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key13 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key14; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key14 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key15; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key15 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key2 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key3 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key4 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key5 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key6 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key7 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key8 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_cedula_docente_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_cedula_docente_key9 UNIQUE (cedula_docente);


--
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (id_docente);


--
-- Name: docentes docentes_token_qr_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key1 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key10 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key11 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key12 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key13; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key13 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key14; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key14 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key15; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key15 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key2 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key3 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key4 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key5 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key6 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key7 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key8 UNIQUE (token_qr);


--
-- Name: docentes docentes_token_qr_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_token_qr_key9 UNIQUE (token_qr);


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
-- Name: estudiantes estudiantes_cedula_escolar_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key1 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key10 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key11 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key12 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key2 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key3 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key4 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key5 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key6 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key7 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key8 UNIQUE (cedula_escolar);


--
-- Name: estudiantes estudiantes_cedula_escolar_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_cedula_escolar_key9 UNIQUE (cedula_escolar);


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
-- Name: representantes representantes_cedula_rep_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key1 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key10 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key11 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key12 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key2 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key3 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key4 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key5 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key6 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key7 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key8 UNIQUE (cedula_rep);


--
-- Name: representantes representantes_cedula_rep_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.representantes
    ADD CONSTRAINT representantes_cedula_rep_key9 UNIQUE (cedula_rep);


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
-- Name: roles roles_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key1 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key10 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key11 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key12 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key13; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key13 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key2 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key3 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key4 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key5 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key6 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key7 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key8 UNIQUE (nombre);


--
-- Name: roles roles_nombre_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key9 UNIQUE (nombre);


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
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: usuarios usuarios_username_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key1 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key10; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key10 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key11; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key11 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key12; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key12 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key2 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key3; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key3 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key4; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key4 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key5; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key5 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key6; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key6 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key7; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key7 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key8; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key8 UNIQUE (username);


--
-- Name: usuarios usuarios_username_key9; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key9 UNIQUE (username);


--
-- Name: asistencia_docente_id_docente_fecha_id_horario_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX asistencia_docente_id_docente_fecha_id_horario_key ON public.asistencia_docente USING btree (id_docente, fecha, COALESCE(id_horario, 0));


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
-- Name: asistencia_docente asistencia_docente_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura);


--
-- Name: asistencia_docente asistencia_docente_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE;


--
-- Name: asistencia_docente asistencia_docente_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario_docente(id_horario);


--
-- Name: asistencia_docente asistencia_docente_id_usuario_crea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_usuario_crea_fkey FOREIGN KEY (id_usuario_crea) REFERENCES public.usuarios(id_usuario);


--
-- Name: asistencia_docente asistencia_docente_id_usuario_modifica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_usuario_modifica_fkey FOREIGN KEY (id_usuario_modifica) REFERENCES public.usuarios(id_usuario);


--
-- Name: asistencia_estudiante asistencia_estudiante_id_docente_toma_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_docente_toma_fkey FOREIGN KEY (id_docente_toma) REFERENCES public.docentes(id_docente);


--
-- Name: asistencia_estudiante asistencia_estudiante_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario_docente(id_horario);


--
-- Name: asistencia_estudiante asistencia_estudiante_id_matricula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_matricula_fkey FOREIGN KEY (id_matricula) REFERENCES public.matricula(id_matricula) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asistencia_estudiante asistencia_estudiante_id_usuario_crea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_usuario_crea_fkey FOREIGN KEY (id_usuario_crea) REFERENCES public.usuarios(id_usuario);


--
-- Name: asistencia_estudiante asistencia_estudiante_id_usuario_modifica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_estudiante
    ADD CONSTRAINT asistencia_estudiante_id_usuario_modifica_fkey FOREIGN KEY (id_usuario_modifica) REFERENCES public.usuarios(id_usuario);


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
-- Name: docentes docentes_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES public.especialidades(id_especialidad) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- Name: secciones fk_seccion_aula; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT fk_seccion_aula FOREIGN KEY (id_aula) REFERENCES public.aulas(id_aula) ON DELETE SET NULL;


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
    ADD CONSTRAINT horario_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE;


--
-- Name: horario_docente horario_docente_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: horario_docente horario_docente_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.horario_docente
    ADD CONSTRAINT horario_docente_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.secciones(id_seccion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justificaciones justificaciones_id_asistencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.justificaciones
    ADD CONSTRAINT justificaciones_id_asistencia_fkey FOREIGN KEY (id_asistencia) REFERENCES public.asistencia_docente(id_asistencia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: materia_pendiente materia_pendiente_id_asignatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_asignatura_fkey FOREIGN KEY (id_asignatura) REFERENCES public.asignaturas(id_asignatura);


--
-- Name: materia_pendiente materia_pendiente_id_docente_evaluador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_docente_evaluador_fkey FOREIGN KEY (id_docente_evaluador) REFERENCES public.docentes(id_docente);


--
-- Name: materia_pendiente materia_pendiente_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante);


--
-- Name: materia_pendiente materia_pendiente_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.materia_pendiente
    ADD CONSTRAINT materia_pendiente_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_escolares(id_periodo);


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
-- Name: secciones secciones_id_docente_guia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.secciones
    ADD CONSTRAINT secciones_id_docente_guia_fkey FOREIGN KEY (id_docente_guia) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE;


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
-- Name: usuarios usuarios_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE ON DELETE SET NULL;


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

\unrestrict OEld6B1zyzGgKFxZKsJPNxpB0lLuZEfP4q3qt21vyAOTrqXtIU22pMMXYEi6KmD

