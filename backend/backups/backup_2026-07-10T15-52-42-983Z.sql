--
-- PostgreSQL database dump
--

\restrict zFRzyIpTryL3XDBZiHyBsqgGWqh7kXfFaGQdnOKhvoMHYhSYWQZ9uha8jxDCaPq

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
    fecha_anulacion timestamp without time zone
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
    id_usuario_modifica integer
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
    updated_at timestamp with time zone NOT NULL
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
    updated_at timestamp with time zone NOT NULL
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
\.


--
-- Data for Name: asistencia_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_docente (id_asistencia, id_docente, fecha, hora_entrada, hora_salida, estatus, created_at, updated_at, id_usuario_crea, id_usuario_modifica, fecha_anulacion) FROM stdin;
\.


--
-- Data for Name: asistencia_estudiante; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.asistencia_estudiante (id_asistencia_est, id_matricula, fecha, estatus, observacion, created_at, updated_at, id_usuario_crea, id_usuario_modifica) FROM stdin;
38	21	2026-07-02	Ausente	\N	2026-07-02 14:28:57.733+00	2026-07-02 14:28:59.922+00	16	16
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
\.


--
-- Data for Name: aulas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aulas (id_aula, nombre_codigo, capacidad, tipo_espacio, ubicacion, estatus, created_at, updated_at) FROM stdin;
10	AULA 1	30	Teórica	\N	Activo	2026-07-01 19:38:09.166+00	2026-07-01 19:38:09.166+00
11	AULA 2	25	Teórica	\N	Activo	2026-07-01 19:38:29.477+00	2026-07-01 19:38:29.477+00
12	AULA 3 	35	Teórica	\N	Activo	2026-07-01 19:38:41.802+00	2026-07-01 19:38:41.802+00
13	AULA 4	32	Teórica	\N	Activo	2026-07-01 19:38:55.798+00	2026-07-01 19:38:55.798+00
14	AULA 5	30	Teórica	\N	Activo	2026-07-01 19:39:10.375+00	2026-07-01 19:39:10.375+00
15	LABORATORIO 1	30	Laboratorio	\N	Activo	2026-07-01 19:39:25.127+00	2026-07-01 19:39:25.127+00
16	LABORATORIO 2 	30	Laboratorio	\N	Activo	2026-07-01 19:39:36.999+00	2026-07-01 19:39:36.999+00
\.


--
-- Data for Name: bloques_horarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bloques_horarios (id_bloque, hora_inicio, hora_fin, tipo_bloque, numero_bloque, created_at, updated_at) FROM stdin;
8	07:00:00	07:45:00	Clase	1	2026-07-01 21:32:53.782+00	2026-07-01 21:32:53.782+00
9	07:45:00	08:30:00	Clase	1	2026-07-01 21:59:09.523+00	2026-07-01 21:59:09.523+00
\.


--
-- Data for Name: calificaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.calificaciones (id_calificacion, id_matricula, id_plan, id_momento, id_escala, inasistencias_asignatura, created_at, updated_at) FROM stdin;
103	21	89	1	11	0	2026-07-02 18:25:17.416+00	2026-07-08 14:46:05.826+00
\.


--
-- Data for Name: dias_semana; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dias_semana (id_dia, nombre, created_at, updated_at) FROM stdin;
6	Lunes	2026-07-01 21:32:53.386+00	2026-07-01 21:32:53.386+00
7	Miércoles	2026-07-01 21:33:23.04+00	2026-07-01 21:33:23.04+00
\.


--
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.docentes (id_docente, cedula_docente, nombre1, nombre2, apellido1, apellido2, telefono, correo, token_qr, estatus, created_at, updated_at, id_especialidad, fecha_nac) FROM stdin;
13	30965286	Gregory	Steve	Duque	Mendoza	0414-7399890	gsdm07@gmail.com	\N	Activo	2026-07-01 00:14:57.970679+00	2026-07-01 20:55:57.635+00	21	2005-03-25
14	33654890	Fabian	Martin	Delgado	Angulo	04268760563	elbowe277@gmail.com	\N	\N	2026-07-08 14:38:11.951+00	2026-07-08 14:38:11.951+00	22	2000-07-27
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
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.estudiantes (id_estudiante, cedula_escolar, nombre1, nombre2, apellido1, apellido2, fecha_nac, lugar_nac, municipio, estado, genero, id_representante, estatus_estudiante, created_at, updated_at) FROM stdin;
22	V-27462797	Josedaniel	\N	Carvajal	Chacon	2000-11-14	\N	Cárdenas	Táchira	M	19	\N	2026-07-01 22:11:41.418+00	2026-07-01 22:11:41.418+00
23	V-31562394	Exercitationem	assum Mollit consectetur	Aliqua	Rem consequu Sed molestiae sit n	1982-06-14	Táriba	Cárdenas	Táchira	M	20	\N	2026-07-08 14:52:30.38+00	2026-07-08 14:52:30.38+00
\.


--
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.evaluaciones (id_evaluacion, id_plan, id_seccion, id_momento, descripcion, ponderacion, created_at, updated_at) FROM stdin;
35	89	15	1	Evaluación Única	25	2026-07-01 22:36:52.409+00	2026-07-02 18:11:46.974+00
36	89	15	1	Nueva Actividad	25	2026-07-01 22:36:52.518+00	2026-07-02 18:11:47.129+00
37	89	15	1	Nueva Actividad	25	2026-07-02 18:11:47.205+00	2026-07-02 18:11:47.205+00
38	89	15	1	Nueva Actividad	25	2026-07-02 18:11:47.293+00	2026-07-02 18:11:47.293+00
39	89	15	2	Evaluación Única	25	2026-07-08 14:48:43.824+00	2026-07-08 14:48:43.824+00
40	89	15	2	Nueva Actividad	25	2026-07-08 14:48:43.903+00	2026-07-08 14:48:43.903+00
41	89	15	2	Nueva Actividad	25	2026-07-08 14:48:43.978+00	2026-07-08 14:48:43.978+00
42	89	15	2	Nueva Actividad	25	2026-07-08 14:48:44.054+00	2026-07-08 14:48:44.054+00
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
\.


--
-- Data for Name: horario_docente; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.horario_docente (id_horario, id_docente, id_asignatura, id_seccion, id_dia, id_bloque, id_aula, created_at, updated_at) FROM stdin;
15	13	24	15	6	8	10	2026-07-02 17:28:03.848+00	2026-07-02 17:28:03.848+00
16	14	27	15	6	9	10	2026-07-08 14:40:14.283+00	2026-07-08 14:40:14.283+00
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
\.


--
-- Data for Name: momentos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.momentos (id_momento, id_periodo, descripcion, created_at, updated_at) FROM stdin;
1	6	Primer Lapso	2026-07-01 22:36:52.098+00	2026-07-01 22:36:52.098+00
2	7	Segundo Lapso	2026-07-08 14:48:43.668+00	2026-07-08 14:48:43.668+00
\.


--
-- Data for Name: notas_parciales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notas_parciales (id_nota, id_matricula, id_evaluacion, id_escala, created_at, updated_at) FROM stdin;
372	21	36	5	2026-07-02 18:25:15.555+00	2026-07-08 14:46:03.796+00
371	21	35	8	2026-07-02 18:25:15.077+00	2026-07-08 14:46:04.242+00
373	21	37	12	2026-07-02 18:25:16.028+00	2026-07-08 14:46:04.673+00
374	21	38	19	2026-07-02 18:25:16.495+00	2026-07-08 14:46:05.105+00
\.


--
-- Data for Name: periodos_escolares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.periodos_escolares (id_periodo, nombre, estatus, created_at, updated_at) FROM stdin;
7	2025-2026	Activo	2026-07-02 13:56:55.028+00	2026-07-02 13:56:55.028+00
6	2026-2027	Cerrado	2026-07-01 16:53:50.392+00	2026-07-08 14:12:20.951+00
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
97	1	33	PGC1	9	2026-07-02 14:24:35.683+00	2026-07-02 14:24:35.683+00
98	2	34	CAS2	1	2026-07-02 14:38:11.221+00	2026-07-02 14:38:11.221+00
99	2	26	ING2	2	2026-07-02 14:38:42.866+00	2026-07-02 14:38:42.866+00
100	2	27	MAT2	2	2026-07-02 14:39:13.013+00	2026-07-02 14:39:13.013+00
101	1	34	CAS1	1	2026-07-08 14:34:33.446+00	2026-07-08 14:34:33.446+00
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.refresh_tokens (id, id_usuario, token_hash, expires_at, created_at, revoked_at) FROM stdin;
1	14	36e7d2fe693fc9ffb3d918aa03cef94bf3d35e8935ea2c236d4a3858ba56cb5e	2026-07-10 00:02:31.975	2026-07-03 00:02:31.975	2026-07-03 00:07:29.553
2	14	32739b2647a63a579701f8ea16a2121681cc9a3266b116a64618850edecf1a17	2026-07-10 00:08:34.643	2026-07-03 00:08:34.643	2026-07-03 00:08:41.938
3	14	648f1b3dcc41ecd9f414c7ebbbe2d3962a6a83bc8832d67353968f28cca7a8ab	2026-07-10 17:21:55.844	2026-07-03 17:21:55.845	\N
4	14	7d4a1f2964574758c38ef9633dd72fb3e2f055cdebe5f6ff15996d36ba7bd9b9	2026-07-13 00:06:27.686	2026-07-06 00:06:27.686	\N
5	17	154ecacbb16e2727d5158d50a8c833dc4697f90d13a467c7d7bbd7a6acd8f745	2026-07-13 17:48:01.494	2026-07-06 17:48:01.494	2026-07-06 17:54:42.461
6	17	1ce4aeb2c466e7445e3ac0e7e703980fe6b443cabece88ffb9958ca73535a176	2026-07-13 20:48:58.577	2026-07-06 20:48:58.578	\N
7	17	b729398dafc60c328228442152336866a694d2482be703ae2f4dd329ec23c31f	2026-07-14 00:19:11.802	2026-07-07 00:19:11.802	2026-07-07 00:19:18.37
8	17	631cb49478b36be8d82c56dcf9fb07a84e526ff6810d343156cba6567dbf6c13	2026-07-14 00:19:25.293	2026-07-07 00:19:25.293	\N
9	17	a44ff4257b3ab3350d3c974c163a9bb4e6d525f563d652cb934fd1e6637bbe7c	2026-07-14 20:12:46.368	2026-07-07 20:12:46.368	\N
10	17	3bcf4f0ec37ab60a53d818f5dd5a4ff244b7ed0d37c13bc7e9ae2e21c5bae6b8	2026-07-15 02:38:48.54	2026-07-08 02:38:48.54	2026-07-08 02:38:54.74
11	17	3af2623cb0eead349b7a1086b68ee030e593860bc25a1896596da8f8c4812635	2026-07-15 02:39:01.125	2026-07-08 02:39:01.125	2026-07-08 02:42:31.987
12	14	3aa74ed5955f3466b6ab9cc1c61c5ce1f05bd0b57f637838dfa9eb9d4713ca9e	2026-07-15 02:43:06.66	2026-07-08 02:43:06.66	\N
13	15	bb971c1aaff778947306754eb44d5f77fd8b35f66dbaac49a6adf1d99153f0f3	2026-07-15 02:44:22.482	2026-07-08 02:44:22.482	\N
14	16	dd6dd033784554f71a1e775b1c82ddb9b1aa51fd52b5a1f1229369f5b783f1cb	2026-07-15 02:45:10.113	2026-07-08 02:45:10.113	\N
15	14	1d25d9fc7406806ea426be6a48a0e21b729dd279a53422ae685c7a4f9fea9ab0	2026-07-15 13:25:43.57	2026-07-08 13:25:43.57	2026-07-08 13:25:49.893
18	14	3b5847959d1b7799be4d83c5e0fddfccefd327d18ebb2c57bf086a6e6651141b	2026-07-15 13:28:09.479	2026-07-08 13:28:09.479	\N
16	14	e9a5eaa7bd5284b5b73c1f9273acee2eae8dd7e9ad168b7b32611d7f17b5a4af	2026-07-15 13:26:05.358	2026-07-08 13:26:05.358	2026-07-08 13:28:30.929
17	14	96f7f7aed1b8e4e0dbe3fcf090632e5884c67fd2f3b100caa0aad20b76d1e0db	2026-07-15 13:26:46.665	2026-07-08 13:26:46.666	2026-07-08 13:28:45.722
19	14	37138a7314503b9ca9f396221a33fd4d59ed96a098ae32be06dfb208ae6565b4	2026-07-15 14:11:14.215	2026-07-08 14:11:14.215	\N
20	14	f0d47d7248218cd844c24115c2bffee3adaf8ac5170b88aaaaaf3aa6210bc33c	2026-07-15 14:31:52.744	2026-07-08 14:31:52.744	2026-07-08 14:47:42.442
21	14	3abcd126e47293de71ab9c7e132f0aabf28988b2b46f439091edb98690180c59	2026-07-15 14:47:51.114	2026-07-08 14:47:51.114	\N
22	14	8ae8cfbb6510519609ac6799b04c13d0d93d6af72946f06259873c1b62692731	2026-07-17 03:48:54.298	2026-07-10 03:48:54.298	\N
23	17	301cb702436732bf6e569d957860e9a677c5d8069181589f152f7a3a0f71dd61	2026-07-17 03:55:50.943	2026-07-10 03:55:50.944	2026-07-10 04:00:05.082
24	17	cd9d36fa6daa319b6bec4dc73875ceedc7370460f818612beac5f87576b9c389	2026-07-17 04:00:13.732	2026-07-10 04:00:13.732	\N
25	14	535ce5deb14f7a63ed749b4baee08f5f27ec0f7b50f136b9a6314dee02a22e85	2026-07-17 14:03:29.361	2026-07-10 14:03:29.362	2026-07-10 14:20:25.921
26	14	318be28dc886c3378449b69923297f2f9c98c7239782bb3d5950912f93ffc087	2026-07-10 22:47:00.474	2026-07-10 14:47:00.474	\N
27	14	868933babf0b7c589f9d3b68124fa150a224351ed6c999e801289e822004ca02	2026-07-10 23:32:23.096	2026-07-10 15:32:23.099	\N
28	14	2dc007d4abd92e43ec667d09d28d1430892350eab62271fc6671f4e92c488ef1	2026-07-10 23:41:05.952	2026-07-10 15:41:05.952	2026-07-10 15:52:30.435
29	14	896802c408ead509017337e2867c4921fa6f0ef540d25f12a4fa4f01147d7d2b	2026-07-10 23:52:37.735	2026-07-10 15:52:37.735	\N
\.


--
-- Data for Name: representantes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.representantes (id_representante, cedula_rep, nombre1, nombre2, apellido1, apellido2, telefono, direccion, correo, created_at, updated_at) FROM stdin;
19	V-15858097	Arturo	Jose	Carvajal	Molina	04141776859	Palmira calle 4 con carrera 3	arturo@gmail.com	2026-07-01 22:11:41.137+00	2026-07-01 22:11:41.137+00
20	E-10145775	Sint consectetur et	Mollit labore omnis	Similique sunt temp	Placeat veniam non	04147006863	Animi ab dolor dict	fofurop@mailinator.com	2026-07-08 14:52:29.762+00	2026-07-08 14:52:29.762+00
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

COPY public.secciones (id_seccion, id_periodo, id_grado, letra, id_docente_guia, created_at, updated_at) FROM stdin;
15	6	1	A	13	2026-07-01 21:10:05.021+00	2026-07-01 21:10:05.021+00
16	7	2	B	14	2026-07-08 14:41:06.665+00	2026-07-08 14:41:06.665+00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.usuarios (id_usuario, id_rol, id_docente, username, password_hash, estatus, correo, ultimo_acceso, created_at, updated_at, failed_attempts, locked_until, token_version) FROM stdin;
13	6	\N	secretaria	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	\N	2026-07-01 22:45:35.591+00	2026-06-30 21:50:20.784+00	2026-07-01 22:45:35.591+00	0	\N	0
14	4	\N	admin	$2b$10$0d98uLRaOCGcDuyMmev.iOxaDcvUnDDjbt4sYhLYv46orjsxQTrZG	Activo	\N	2026-07-10 15:52:37.82+00	2026-06-30 21:50:42.591+00	2026-07-10 15:52:37.821+00	0	\N	6
15	8	\N	control	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	\N	2026-07-08 02:44:22.556+00	2026-06-30 21:50:42.76+00	2026-07-08 02:44:22.556+00	0	\N	0
16	5	\N	docente	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	\N	2026-07-08 02:45:10.185+00	2026-06-30 21:50:42.928+00	2026-07-08 02:45:10.185+00	0	\N	0
21	7	\N	coordinador	$2a$12$q73CXrxMUe2AMuxCvD8h4.eM8f0BEzJV3GacQNtyVJFT0GzPYaUKO	Activo	josdanielcch@gmail.com	2026-07-01 17:06:05.136+00	2026-07-01 12:00:00+00	2026-07-01 17:06:05.144+00	0	\N	0
17	4	13	gregory	$2a$04$E0FR6DapXky6Lq4RYs7iJOiO76eMwgm6XJ.XifrrajZ9FvKtLgwlG	Activo	gsdm07@gmail.com	2026-07-10 04:00:13.811+00	2026-06-30 22:32:04.807491+00	2026-07-10 04:00:13.812+00	0	\N	5
\.


--
-- Name: asignaturas_id_asignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asignaturas_id_asignatura_seq', 34, true);


--
-- Name: asistencia_docente_id_asistencia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_docente_id_asistencia_seq', 7, true);


--
-- Name: asistencia_estudiante_id_asistencia_est_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asistencia_estudiante_id_asistencia_est_seq', 38, true);


--
-- Name: auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.auditoria_id_auditoria_seq', 71, true);


--
-- Name: aulas_id_aula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aulas_id_aula_seq', 19, true);


--
-- Name: bloques_horarios_id_bloque_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bloques_horarios_id_bloque_seq', 9, true);


--
-- Name: calificaciones_id_calificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.calificaciones_id_calificacion_seq', 103, true);


--
-- Name: dias_semana_id_dia_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dias_semana_id_dia_seq', 7, true);


--
-- Name: docentes_id_docente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.docentes_id_docente_seq', 14, true);


--
-- Name: escala_calificaciones_id_escala_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.escala_calificaciones_id_escala_seq', 1, false);


--
-- Name: especialidades_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.especialidades_id_especialidad_seq', 22, true);


--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 23, true);


--
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 42, true);


--
-- Name: grados_anos_id_grado_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.grados_anos_id_grado_seq', 5, true);


--
-- Name: historico_notas_certificadas_id_historico_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.historico_notas_certificadas_id_historico_seq', 4, true);


--
-- Name: horario_docente_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.horario_docente_id_horario_seq', 16, true);


--
-- Name: justificaciones_id_justificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.justificaciones_id_justificacion_seq', 1, false);


--
-- Name: login_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.login_audit_id_seq', 51, true);


--
-- Name: materia_pendiente_id_materia_pendiente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.materia_pendiente_id_materia_pendiente_seq', 1, false);


--
-- Name: matricula_id_matricula_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.matricula_id_matricula_seq', 22, true);


--
-- Name: momentos_id_momento_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.momentos_id_momento_seq', 2, true);


--
-- Name: notas_parciales_id_nota_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notas_parciales_id_nota_seq', 374, true);


--
-- Name: periodos_escolares_id_periodo_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.periodos_escolares_id_periodo_seq', 9, true);


--
-- Name: plan_estudio_id_plan_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plan_estudio_id_plan_seq', 101, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 29, true);


--
-- Name: representantes_id_representante_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.representantes_id_representante_seq', 20, true);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 8, true);


--
-- Name: secciones_id_seccion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.secciones_id_seccion_seq', 16, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 22, true);


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
-- Name: asistencia_docente asistencia_docente_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asistencia_docente
    ADD CONSTRAINT asistencia_docente_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE;


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

\unrestrict zFRzyIpTryL3XDBZiHyBsqgGWqh7kXfFaGQdnOKhvoMHYhSYWQZ9uha8jxDCaPq

