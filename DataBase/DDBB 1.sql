CREATE SCHEMA "public";
CREATE TABLE "asignaturas" (
	"id_asignatura" serial PRIMARY KEY,
	"nombre" varchar(50) NOT NULL CONSTRAINT "asignaturas_nombre_key" UNIQUE,
	"tipo_calificacion" varchar(15) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "asistencia_docente" (
	"id_asistencia" serial PRIMARY KEY,
	"id_docente" integer NOT NULL,
	"fecha" date NOT NULL,
	"hora_entrada" time,
	"hora_salida" time,
	"estatus" varchar(20),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "asistencia_estudiante" (
	"id_asistencia_est" serial PRIMARY KEY,
	"id_matricula" integer NOT NULL,
	"fecha" date NOT NULL,
	"estatus" varchar(20),
	"observacion" varchar(255),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "auditoria" (
	"id_auditoria" serial PRIMARY KEY,
	"id_usuario" integer,
	"accion" varchar(20) NOT NULL,
	"tabla_afectada" varchar(50) NOT NULL,
	"registro_id" integer,
	"valores_antiguos" jsonb,
	"valores_nuevos" jsonb,
	"ip_direccion" varchar(45),
	"fecha_hora" timestamp with time zone NOT NULL
);
CREATE TABLE "aulas" (
	"id_aula" serial PRIMARY KEY,
	"nombre_codigo" varchar(30) NOT NULL,
	"capacidad" integer,
	"tipo_espacio" varchar(30),
	"ubicacion" varchar(100),
	"estatus" varchar(20),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "bloques_horarios" (
	"id_bloque" serial PRIMARY KEY,
	"hora_inicio" time NOT NULL,
	"hora_fin" time NOT NULL,
	"tipo_bloque" varchar(20),
	"numero_bloque" integer,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "calificaciones" (
	"id_calificacion" serial PRIMARY KEY,
	"id_matricula" integer NOT NULL,
	"id_plan" integer NOT NULL,
	"id_momento" integer NOT NULL,
	"id_escala" integer NOT NULL,
	"inasistencias_asignatura" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "dias_semana" (
	"id_dia" serial PRIMARY KEY,
	"nombre" varchar(15) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "docentes" (
	"id_docente" serial PRIMARY KEY,
	"cedula_docente" varchar(15) NOT NULL CONSTRAINT "docentes_cedula_docente_key" UNIQUE,
	"nombre1" varchar(20) NOT NULL,
	"nombre2" varchar(20),
	"apellido1" varchar(20) NOT NULL,
	"apellido2" varchar(20),
	"especialidad" varchar(100),
	"telefono" varchar(20),
	"correo" varchar(50),
	"token_qr" varchar(255) CONSTRAINT "docentes_token_qr_key" UNIQUE,
	"estatus" varchar(15),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "escala_calificaciones" (
	"id_escala" serial PRIMARY KEY,
	"nota_impresa" varchar(3) NOT NULL,
	"nota_literal" varchar(20) NOT NULL,
	"nota_calculo" integer,
	"ponderacion_letra" char(1),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "estudiantes" (
	"id_estudiante" serial PRIMARY KEY,
	"cedula_escolar" varchar(15) NOT NULL CONSTRAINT "estudiantes_cedula_escolar_key" UNIQUE,
	"nombre1" varchar(50) NOT NULL,
	"nombre2" varchar(50),
	"apellido1" varchar(50) NOT NULL,
	"apellido2" varchar(50),
	"fecha_nac" date NOT NULL,
	"lugar_nac" varchar(100),
	"municipio" varchar(50),
	"estado" varchar(50),
	"genero" char(1),
	"id_representante" integer NOT NULL,
	"estatus_estudiante" varchar(20),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "evaluaciones" (
	"id_evaluacion" serial PRIMARY KEY,
	"id_plan" integer NOT NULL,
	"id_seccion" integer NOT NULL,
	"id_momento" integer NOT NULL,
	"descripcion" varchar(100) NOT NULL,
	"ponderacion" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "grados_anos" (
	"id_grado" serial PRIMARY KEY,
	"numero" integer NOT NULL,
	"nombre" varchar(30) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "historico_notas_certificadas" (
	"id_historico" serial PRIMARY KEY,
	"id_estudiante" integer NOT NULL,
	"id_grado" integer NOT NULL,
	"id_asignatura" integer NOT NULL,
	"id_periodo" integer NOT NULL,
	"id_escala" integer NOT NULL,
	"institucion_origen" varchar(150) DEFAULT 'L.N. Estilita Orozco' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "horario_docente" (
	"id_horario" serial PRIMARY KEY,
	"id_docente" integer NOT NULL,
	"id_asignatura" integer NOT NULL,
	"id_seccion" integer NOT NULL,
	"id_dia" integer NOT NULL,
	"id_bloque" integer NOT NULL,
	"id_aula" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "justificaciones" (
	"id_justificacion" serial PRIMARY KEY,
	"id_asistencia" integer NOT NULL,
	"motivo" text,
	"soporte_digital" varchar(255),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "materia_pendiente" (
	"id_materia_pendiente" serial PRIMARY KEY,
	"id_estudiante" integer NOT NULL,
	"id_asignatura" integer NOT NULL,
	"id_periodo" integer NOT NULL,
	"id_docente_evaluador" integer,
	"nota_definitiva" integer,
	"estatus" varchar(20) DEFAULT 'Cursando',
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "matricula" (
	"id_matricula" serial PRIMARY KEY,
	"id_estudiante" integer NOT NULL,
	"id_seccion" integer NOT NULL,
	"id_periodo" integer NOT NULL,
	"numero_lista" integer,
	"estatus_matricula" varchar(20),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "momentos" (
	"id_momento" serial PRIMARY KEY,
	"id_periodo" integer NOT NULL,
	"descripcion" varchar(20),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "notas_parciales" (
	"id_nota" serial PRIMARY KEY,
	"id_matricula" integer NOT NULL,
	"id_evaluacion" integer NOT NULL,
	"id_escala" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "periodos_escolares" (
	"id_periodo" serial PRIMARY KEY,
	"nombre" varchar(9) NOT NULL,
	"estatus" varchar(20) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "plan_estudio" (
	"id_plan" serial PRIMARY KEY,
	"id_grado" integer NOT NULL,
	"id_asignatura" integer NOT NULL,
	"codigo_asignatura" varchar(15),
	"posicion" integer,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "representantes" (
	"id_representante" serial PRIMARY KEY,
	"cedula_rep" varchar(15) NOT NULL CONSTRAINT "representantes_cedula_rep_key" UNIQUE,
	"nombre1" varchar(20) NOT NULL,
	"nombre2" varchar(20),
	"apellido1" varchar(20) NOT NULL,
	"apellido2" varchar(20),
	"telefono" varchar(20),
	"direccion" text,
	"correo" varchar(50),
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "roles" (
	"id_rol" serial PRIMARY KEY,
	"nombre" varchar(50) NOT NULL CONSTRAINT "roles_nombre_key" UNIQUE,
	"descripcion" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "secciones" (
	"id_seccion" serial PRIMARY KEY,
	"id_periodo" integer NOT NULL,
	"id_grado" integer NOT NULL,
	"letra" char(1) NOT NULL,
	"id_docente_guia" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE TABLE "usuarios" (
	"id_usuario" serial PRIMARY KEY,
	"id_rol" integer NOT NULL,
	"id_docente" integer,
	"username" varchar(50) NOT NULL CONSTRAINT "usuarios_username_key" UNIQUE,
	"password_hash" varchar(255) NOT NULL,
	"estatus" varchar(15) DEFAULT 'Activo',
	"correo" varchar(100),
	"ultimo_acceso" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
CREATE UNIQUE INDEX "asignaturas_nombre_key" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key1" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key10" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key11" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key12" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key2" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key3" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key4" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key5" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key6" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key7" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key8" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_nombre_key9" ON "asignaturas" ("nombre");
CREATE UNIQUE INDEX "asignaturas_pkey" ON "asignaturas" ("id_asignatura");
CREATE UNIQUE INDEX "asistencia_docente_pkey" ON "asistencia_docente" ("id_asistencia");
CREATE UNIQUE INDEX "asistencia_estudiante_pkey" ON "asistencia_estudiante" ("id_asistencia_est");
CREATE UNIQUE INDEX "auditoria_pkey" ON "auditoria" ("id_auditoria");
CREATE UNIQUE INDEX "aulas_pkey" ON "aulas" ("id_aula");
CREATE UNIQUE INDEX "bloques_horarios_pkey" ON "bloques_horarios" ("id_bloque");
CREATE UNIQUE INDEX "calificaciones_pkey" ON "calificaciones" ("id_calificacion");
CREATE UNIQUE INDEX "dias_semana_pkey" ON "dias_semana" ("id_dia");
CREATE UNIQUE INDEX "docentes_cedula_docente_key" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key1" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key10" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key11" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key12" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key13" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key2" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key3" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key4" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key5" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key6" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key7" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key8" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_cedula_docente_key9" ON "docentes" ("cedula_docente");
CREATE UNIQUE INDEX "docentes_pkey" ON "docentes" ("id_docente");
CREATE UNIQUE INDEX "docentes_token_qr_key" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key1" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key10" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key11" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key12" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key13" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key2" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key3" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key4" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key5" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key6" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key7" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key8" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "docentes_token_qr_key9" ON "docentes" ("token_qr");
CREATE UNIQUE INDEX "escala_calificaciones_pkey" ON "escala_calificaciones" ("id_escala");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key1" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key10" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key11" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key12" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key2" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key3" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key4" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key5" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key6" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key7" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key8" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_cedula_escolar_key9" ON "estudiantes" ("cedula_escolar");
CREATE UNIQUE INDEX "estudiantes_pkey" ON "estudiantes" ("id_estudiante");
CREATE UNIQUE INDEX "evaluaciones_pkey" ON "evaluaciones" ("id_evaluacion");
CREATE UNIQUE INDEX "grados_anos_pkey" ON "grados_anos" ("id_grado");
CREATE UNIQUE INDEX "historico_notas_certificadas_pkey" ON "historico_notas_certificadas" ("id_historico");
CREATE UNIQUE INDEX "horario_docente_pkey" ON "horario_docente" ("id_horario");
CREATE UNIQUE INDEX "justificaciones_pkey" ON "justificaciones" ("id_justificacion");
CREATE UNIQUE INDEX "materia_pendiente_pkey" ON "materia_pendiente" ("id_materia_pendiente");
CREATE UNIQUE INDEX "matricula_pkey" ON "matricula" ("id_matricula");
CREATE UNIQUE INDEX "momentos_pkey" ON "momentos" ("id_momento");
CREATE UNIQUE INDEX "notas_parciales_pkey" ON "notas_parciales" ("id_nota");
CREATE UNIQUE INDEX "periodos_escolares_pkey" ON "periodos_escolares" ("id_periodo");
CREATE UNIQUE INDEX "plan_estudio_pkey" ON "plan_estudio" ("id_plan");
CREATE UNIQUE INDEX "representantes_cedula_rep_key" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key1" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key10" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key11" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key12" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key2" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key3" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key4" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key5" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key6" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key7" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key8" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_cedula_rep_key9" ON "representantes" ("cedula_rep");
CREATE UNIQUE INDEX "representantes_pkey" ON "representantes" ("id_representante");
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key1" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key10" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key11" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key12" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key13" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key2" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key3" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key4" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key5" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key6" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key7" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key8" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_nombre_key9" ON "roles" ("nombre");
CREATE UNIQUE INDEX "roles_pkey" ON "roles" ("id_rol");
CREATE UNIQUE INDEX "secciones_pkey" ON "secciones" ("id_seccion");
CREATE UNIQUE INDEX "usuarios_pkey" ON "usuarios" ("id_usuario");
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key1" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key10" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key11" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key12" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key2" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key3" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key4" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key5" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key6" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key7" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key8" ON "usuarios" ("username");
CREATE UNIQUE INDEX "usuarios_username_key9" ON "usuarios" ("username");
ALTER TABLE "asistencia_docente" ADD CONSTRAINT "asistencia_docente_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "docentes"("id_docente") ON UPDATE CASCADE;
ALTER TABLE "asistencia_estudiante" ADD CONSTRAINT "asistencia_estudiante_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matricula"("id_matricula") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_escala_fkey" FOREIGN KEY ("id_escala") REFERENCES "escala_calificaciones"("id_escala") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matricula"("id_matricula") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_momento_fkey" FOREIGN KEY ("id_momento") REFERENCES "momentos"("id_momento") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "plan_estudio"("id_plan") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_representante_fkey" FOREIGN KEY ("id_representante") REFERENCES "representantes"("id_representante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evaluaciones" ADD CONSTRAINT "evaluaciones_id_momento_fkey" FOREIGN KEY ("id_momento") REFERENCES "momentos"("id_momento") ON UPDATE CASCADE;
ALTER TABLE "evaluaciones" ADD CONSTRAINT "evaluaciones_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "plan_estudio"("id_plan") ON UPDATE CASCADE;
ALTER TABLE "evaluaciones" ADD CONSTRAINT "evaluaciones_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "secciones"("id_seccion") ON UPDATE CASCADE;
ALTER TABLE "historico_notas_certificadas" ADD CONSTRAINT "historico_notas_certificadas_id_asignatura_fkey" FOREIGN KEY ("id_asignatura") REFERENCES "asignaturas"("id_asignatura") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_notas_certificadas" ADD CONSTRAINT "historico_notas_certificadas_id_escala_fkey" FOREIGN KEY ("id_escala") REFERENCES "escala_calificaciones"("id_escala") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_notas_certificadas" ADD CONSTRAINT "historico_notas_certificadas_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_notas_certificadas" ADD CONSTRAINT "historico_notas_certificadas_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_anos"("id_grado") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_notas_certificadas" ADD CONSTRAINT "historico_notas_certificadas_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos_escolares"("id_periodo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_asignatura_fkey" FOREIGN KEY ("id_asignatura") REFERENCES "asignaturas"("id_asignatura") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "aulas"("id_aula") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_bloque_fkey" FOREIGN KEY ("id_bloque") REFERENCES "bloques_horarios"("id_bloque") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_dia_fkey" FOREIGN KEY ("id_dia") REFERENCES "dias_semana"("id_dia") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "docentes"("id_docente") ON UPDATE CASCADE;
ALTER TABLE "horario_docente" ADD CONSTRAINT "horario_docente_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "secciones"("id_seccion") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "justificaciones" ADD CONSTRAINT "justificaciones_id_asistencia_fkey" FOREIGN KEY ("id_asistencia") REFERENCES "asistencia_docente"("id_asistencia") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "materia_pendiente" ADD CONSTRAINT "materia_pendiente_id_asignatura_fkey" FOREIGN KEY ("id_asignatura") REFERENCES "asignaturas"("id_asignatura");
ALTER TABLE "materia_pendiente" ADD CONSTRAINT "materia_pendiente_id_docente_evaluador_fkey" FOREIGN KEY ("id_docente_evaluador") REFERENCES "docentes"("id_docente");
ALTER TABLE "materia_pendiente" ADD CONSTRAINT "materia_pendiente_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante");
ALTER TABLE "materia_pendiente" ADD CONSTRAINT "materia_pendiente_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos_escolares"("id_periodo");
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos_escolares"("id_periodo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_id_seccion_fkey" FOREIGN KEY ("id_seccion") REFERENCES "secciones"("id_seccion") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "momentos" ADD CONSTRAINT "momentos_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos_escolares"("id_periodo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notas_parciales" ADD CONSTRAINT "notas_parciales_id_escala_fkey" FOREIGN KEY ("id_escala") REFERENCES "escala_calificaciones"("id_escala") ON UPDATE CASCADE;
ALTER TABLE "notas_parciales" ADD CONSTRAINT "notas_parciales_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "evaluaciones"("id_evaluacion") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notas_parciales" ADD CONSTRAINT "notas_parciales_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matricula"("id_matricula") ON UPDATE CASCADE;
ALTER TABLE "plan_estudio" ADD CONSTRAINT "plan_estudio_id_asignatura_fkey" FOREIGN KEY ("id_asignatura") REFERENCES "asignaturas"("id_asignatura") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plan_estudio" ADD CONSTRAINT "plan_estudio_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_anos"("id_grado") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_id_docente_guia_fkey" FOREIGN KEY ("id_docente_guia") REFERENCES "docentes"("id_docente") ON UPDATE CASCADE;
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "grados_anos"("id_grado") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos_escolares"("id_periodo") ON UPDATE CASCADE;
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "docentes"("id_docente") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;