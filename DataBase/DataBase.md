DBML para DBDiagram SERVICIO COMUNITARIO 

// =======================================================================
// Esquema Consolidado de Base de Datos para Control de Notas y Asistencia
// Institución: Liceo (Media General) - MPPE Venezuela
// =======================================================================

// ------------------------------------------
// 1. Estructura Académica y Periodos
// ------------------------------------------

Table periodos_escolares {
  id_periodo int [pk, increment]
  nombre varchar(9) [note: 'Formato: 2025-2026']
  estatus varchar(10) [note: 'Activo, Inactivo, Planificacion']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table grados_anos {
  id_grado int [pk, increment]
  numero int [note: '1 al 5 para Media General']
  nombre varchar(30) [note: 'Ej: Primer Año, Quinto Año']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table secciones {
  id_seccion int [pk, increment]
  id_grado int [ref: > grados_anos.id_grado]
  letra char(1) [note: 'A, B, C, D...']
  id_docente_guia int [ref: > docentes.id_docente, note: 'Docente Líder de la Sección']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table asignaturas {
  id_asignatura int [pk, increment]
  nombre varchar(50) [unique, note: 'La columna MATERIA. Ej: Castellano. ¡Escrita una sola vez!']
  tipo_calificacion varchar(15) [note: 'Cuantitativa o Cualitativa']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table plan_estudio {
  id_plan int [pk, increment]
  id_grado int [ref: > grados_anos.id_grado, note: 'Equivale a la columna AÑO (1, 2, 3)']
  id_asignatura int [ref: > asignaturas.id_asignatura, note: 'Conecta con la materia pura']
  codigo_asignatura varchar(15) [note: 'La columna COD del Excel. Ej: CAS1, CAS2, ING1']
  posicion int [note: 'La columna POSICION del Excel. Vital para imprimir el formato EMG']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}


// ------------------------------------------
// 2. Personal, Estudiantes y Representantes
// ------------------------------------------

Table docentes {
  id_docente int [pk, increment]
  cedula_docente varchar(15) [unique, note: 'V- o E-']
  nombre1 varchar(20)
  nombre2 varchar(20)
  apellido1 varchar(20)
  apellido2 varchar(20)
  especialidad varchar(100)
  telefono varchar(20)
  correo varchar(50)
  token_qr varchar(255) [unique, note: 'Cadena alfanumérica única e indescifrable generada por el backend. Ej: a7b8x9...']
  estatus varchar(15) [note: 'Activo, Reposo, Jubilado']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table representantes {
  id_representante int [pk, increment]
  cedula_rep varchar(15) [unique, note: 'V- o E- según corresponda']
  nombre1 varchar(20)
  nombre2 varchar(20)
  apellido1 varchar(20)
  apellido2 varchar(20)
  telefono varchar(20)
  direccion text
  correo varchar(50)
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table estudiantes {
  id_estudiante int [pk, increment]
  cedula_escolar varchar(15) [unique, note: 'Cédula de identidad o escolar asignada por MPPE']
  nombre1 varchar(50)
  nombre2 varchar(50)
  apellido1 varchar(50)
  apellido2 varchar(50)
  fecha_nac date
  lugar_nac varchar(100) [note: 'Requisito obligatorio para Notas Certificadas']
  municipio varchar(50)
  estado varchar(50)
  genero char(1) [note: 'M / F']
  id_representante int [ref: > representantes.id_representante]
  estatus_estudiante varchar(20) [note: 'Activo, Graduado, Retirado']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

// ------------------------------------------
// 3. Matrícula y Sistema de Calificaciones
// ------------------------------------------

Table matricula {
  id_matricula int [pk, increment]
  id_estudiante int [ref: > estudiantes.id_estudiante]
  id_seccion int [ref: > secciones.id_seccion]
  id_periodo int [ref: > periodos_escolares.id_periodo]
  numero_lista int [note: 'Orden alfabético para plantillas oficiales']
  estatus_matricula varchar(20) [note: 'Regular, Retirado, Pendiente']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table momentos {
  id_momento int [pk, increment]
  id_periodo int [ref: > periodos_escolares.id_periodo]
  descripcion varchar(20) [note: '1er Momento, 2do Momento, 3er Momento']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table calificaciones {
  id_calificacion int [pk, increment]
  id_matricula int [ref: > matricula.id_matricula]
  id_plan int [ref: > plan_estudio.id_plan, note: 'Apunta a la tabla pivote de Pensum']
  id_momento int [ref: > momentos.id_momento]
  id_escala int [ref: > escala_calificaciones.id_escala] 
  inasistencias_asignatura int [default: 0, note: 'Art. 108 del RLOLOE']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table escala_calificaciones {
  id_escala int [pk, increment]
  nota_impresa varchar(3) [note: 'Lo que sale en la planilla: 01, 15, NC, **']
  nota_literal varchar(20) [note: 'Para certificados: CERO UNO, QUINCE, NO CURSA']
  nota_calculo int [note: 'Valor matemático real (0 al 20). Null para NC/PE']
  ponderacion_letra char(1) [note: 'Equivalencia en letras: A, B, C, D']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table historico_notas_certificadas {
  id_historico int [pk, increment]
  id_estudiante int [ref: > estudiantes.id_estudiante, note: 'El alumno puede estar como Graduado']
  id_grado int [ref: > grados_anos.id_grado, note: 'Año que cursó (1ro a 5to)']
  id_asignatura int [ref: > asignaturas.id_asignatura, note: 'Materia cursada']
  id_periodo int [ref: > periodos_escolares.id_periodo, note: 'Año escolar en que la cursó (Ej: 2012-2013)']
  id_escala int [ref: > escala_calificaciones.id_escala, note: 'Nota definitiva anual que vino de Access']
  institucion_origen varchar(150) [default: 'L.N. Estilita Orozco', note: 'Por si cursó ese año en otro liceo']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

// ------------------------------------------
// 4. Espacios Físicos y Horarios
// ------------------------------------------

Table aulas {
  id_aula int [pk, increment]
  nombre_codigo varchar(30) [note: 'Ej: Aula 5, Lab Biología, Cancha']
  capacidad int [note: 'Capacidad máxima de estudiantes']
  tipo_espacio varchar(30) [note: 'Aula Regular, Laboratorio, Cancha, CBIT']
  ubicacion varchar(100) [note: 'Ej: Planta Baja, Pasillo Central']
  estatus varchar(20) [note: 'Activo, Mantenimiento']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table dias_semana {
  id_dia int [pk, increment]
  nombre varchar(15) [note: 'Lunes, Martes, Miércoles...']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table bloques_horarios {
  id_bloque int [pk, increment]
  hora_inicio time
  hora_fin time
  tipo_bloque varchar(20) [note: 'Clase Regular, Guardia']
  numero_bloque int [note: 'Ej: 1ra hora, 2da hora']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table horario_docente {
  id_horario int [pk, increment]
  id_docente int [ref: > docentes.id_docente]
  id_asignatura int [ref: > asignaturas.id_asignatura] 
  id_seccion int [ref: > secciones.id_seccion]         
  id_dia int [ref: > dias_semana.id_dia]               
  id_bloque int [ref: > bloques_horarios.id_bloque]    
  id_aula int [ref: > aulas.id_aula] // Relación con el espacio físico
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

// ------------------------------------------
// 5. Control de Asistencia del Personal
// ------------------------------------------

Table asistencia_docente {
  id_asistencia int [pk, increment]
  id_docente int [ref: > docentes.id_docente]
  fecha date
  hora_entrada time
  hora_salida time
  estatus varchar(20) [note: 'Asistió, Inasistencia, Permiso']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table justificaciones {
  id_justificacion int [pk, increment]
  id_asistencia int [ref: > asistencia_docente.id_asistencia]
  motivo text [note: 'Explicación o número de reposo IVSS']
  soporte_digital varchar(255) [note: 'Ruta al archivo PDF del justificativo']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

// ==========================================
// 6. Seguridad, Accesos y Auditoría 
// ==========================================

Table roles {
  id_rol int [pk, increment]
  nombre varchar(50) [unique, note: 'Ej: Administrador, Secretaria, Coordinador, Docente']
  descripcion text
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table usuarios {
  id_usuario int [pk, increment]
  id_rol int [ref: > roles.id_rol]
  id_docente int [ref: > docentes.id_docente, note: 'Opcional: Solo si el usuario es también un docente de la institución']
  username varchar(50) [unique, note: 'Ej: jperez o la cédula']
  password_hash varchar(255) [note: 'Contraseña encriptada (Ej: bcrypt)']
  estatus varchar(15) [note: 'Activo, Bloqueado, Inactivo']
  ultimo_acceso timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table auditoria {
  id_auditoria int [pk, increment]
  id_usuario int [ref: > usuarios.id_usuario, note: 'Quién hizo el cambio']
  accion varchar(20) [note: 'Ej: INSERT, UPDATE, DELETE, LOGIN']
  tabla_afectada varchar(50) [note: 'Ej: calificaciones, estudiantes']
  registro_id int [note: 'El ID de la fila que fue modificada']
  valores_antiguos json [note: 'Estado de la fila ANTES del cambio (PostgreSQL JSON)']
  valores_nuevos json [note: 'Estado de la fila DESPUÉS del cambio (PostgreSQL JSON)']
  ip_direccion varchar(45) [note: 'Soporta IPv4 e IPv6']
  fecha_hora timestamp [default: `now()`]
}

> [!IMPORTANT]
> LINK PARA VISUALZAR EL DIAGRAMA DE LA DB
> https://dbdiagram.io/d/Servicio-Comunitario-6a26e2c625fc5bf036bb3b9d


