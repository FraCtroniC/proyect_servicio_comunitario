import { sequelize } from '../models';

async function truncateAll() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    const tables = [
      'materia_pendiente',
      'asistencia_estudiante',
      'notas_parciales',
      'evaluaciones',
      'auditoria',
      'justificaciones',
      'asistencia_docente',
      'horario_docente',
      'calificaciones',
      'historico_notas_certificadas',
      'matricula',
      'estudiantes',
      'representantes',
      'plan_estudio',
      'asignaturas',
      'bloques_horarios',
      'dias_semana',
      'aulas',
      'secciones',
      'grados_anos',
      'momentos',
      'escala_calificaciones',
      'periodos_escolares',
      'usuarios',
      'docentes',
      'especialidades',
      'roles',
    ];

    console.log('Eliminando todos los registros de las tablas...');
    await sequelize.query(`TRUNCATE TABLE ${tables.join(', ')} CASCADE;`);

    console.log('✓ Todos los datos han sido eliminados correctamente.');
    console.log(`✓ ${tables.length} tablas truncadas.`);
    console.log('✓ Las estructuras de las tablas se mantienen intactas.');

    await sequelize.close();
  } catch (error) {
    console.error('Error al truncar las tablas:', error);
    process.exit(1);
  }
}

truncateAll();
