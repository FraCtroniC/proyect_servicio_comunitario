import { sequelize } from '../models';

async function clearSeedData() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    const seedTables = [
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
      'secciones',
      'bloques_horarios',
      'dias_semana',
      'aulas',
      'plan_estudio',
      'asignaturas',
      'grados_anos',
      'momentos',
      'periodos_escolares',
      'escala_calificaciones',
    ];

    console.log('Eliminando datos del seed...');
    await sequelize.query(`TRUNCATE TABLE ${seedTables.join(', ')} CASCADE;`);

    console.log(`✓ ${seedTables.length} tablas limpiadas.`);
    console.log('✓ Tablas preservadas: usuarios, roles, docentes, estudiantes, representantes, especialidades, personas.');
    console.log('✓ Listo. La BD ahora solo contiene datos reales.');

    await sequelize.close();
  } catch (error) {
    console.error('Error al limpiar datos:', error);
    process.exit(1);
  }
}

clearSeedData();
