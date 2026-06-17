import { sequelize, PeriodoEscolar, GradoAno, Seccion, Aula, DiaSemana, BloqueHorario, Asignatura, PlanEstudio, Momento, EscalaCalificacion, Estudiante, Matricula, Calificacion, Docente, HorarioDocente } from '../models';

async function runSeed() {
  try {
    console.log('Conectando a la base de datos para inyectar datos de Fase 2...');
    await sequelize.authenticate();
    
    // 1. Periodo Escolar
    const [periodo] = await PeriodoEscolar.findOrCreate({
      where: { nombre: '2025-2026' },
      defaults: { estatus: 'Activo' }
    });

    // 2. Grados (1 a 5)
    const grados = [
      { numero: 1, nombre: 'Primer Año' },
      { numero: 2, nombre: 'Segundo Año' },
      { numero: 3, nombre: 'Tercer Año' },
      { numero: 4, nombre: 'Cuarto Año' },
      { numero: 5, nombre: 'Quinto Año' },
    ];
    const gradosDb = [];
    for (const g of grados) {
      const [grado] = await GradoAno.findOrCreate({
        where: { numero: g.numero },
        defaults: { nombre: g.nombre }
      });
      gradosDb.push(grado);
    }

    // 3. Aulas
    const aulasData = [
      { nombre_codigo: 'Aula 1-A', capacidad: 35, tipo_espacio: 'Teórica', estatus: 'Activo' },
      { nombre_codigo: 'Aula 1-B', capacidad: 35, tipo_espacio: 'Teórica', estatus: 'Activo' },
      { nombre_codigo: 'Aula 2-A', capacidad: 35, tipo_espacio: 'Teórica', estatus: 'Activo' },
      { nombre_codigo: 'Aula 2-B', capacidad: 35, tipo_espacio: 'Teórica', estatus: 'Activo' },
      { nombre_codigo: 'Lab Física', capacidad: 20, tipo_espacio: 'Laboratorio', estatus: 'Activo' },
      { nombre_codigo: 'Lab Química', capacidad: 20, tipo_espacio: 'Laboratorio', estatus: 'Activo' },
      { nombre_codigo: 'Cancha', capacidad: 50, tipo_espacio: 'Deportiva', estatus: 'Activo' },
    ];
    const aulasDb = [];
    for (const a of aulasData) {
      const [aula] = await Aula.findOrCreate({
        where: { nombre_codigo: a.nombre_codigo },
        defaults: a
      });
      aulasDb.push(aula);
    }

    // 4. Asignaturas
    const asignaturasData = [
      { nombre: 'Matemáticas', tipo_calificacion: 'Cuantitativa' },
      { nombre: 'Física', tipo_calificacion: 'Cuantitativa' },
      { nombre: 'Química', tipo_calificacion: 'Cuantitativa' },
      { nombre: 'Castellano', tipo_calificacion: 'Cuantitativa' },
      { nombre: 'Inglés', tipo_calificacion: 'Cuantitativa' },
      { nombre: 'Educación Física', tipo_calificacion: 'Cualitativa' },
      { nombre: 'Geografía', tipo_calificacion: 'Cuantitativa' },
    ];
    const asignaturasDb = [];
    for (const asig of asignaturasData) {
      const [a] = await Asignatura.findOrCreate({
        where: { nombre: asig.nombre },
        defaults: asig
      });
      asignaturasDb.push(a);
    }

    // 5. Plan de Estudio (Vincular asignaturas a grados)
    const planesDb = [];
    for (const grado of gradosDb) {
      for (const asig of asignaturasDb) {
        const [plan] = await PlanEstudio.findOrCreate({
          where: { id_grado: grado.get('id_grado'), id_asignatura: asig.get('id_asignatura') },
          defaults: { codigo_asignatura: `COD-${grado.get('numero')}-${asig.get('id_asignatura')}` }
        });
        planesDb.push(plan);
      }
    }

    // 6. Días de la semana
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const diasDb = [];
    for (let i = 0; i < dias.length; i++) {
      const [d] = await DiaSemana.findOrCreate({
        where: { nombre: dias[i] },
        defaults: { numero_dia: i + 1 }
      });
      diasDb.push(d);
    }

    // 7. Bloques de horario
    const bloquesData = [
      { hora_inicio: '07:00:00', hora_fin: '07:45:00', tipo: 'Clase' },
      { hora_inicio: '07:45:00', hora_fin: '08:30:00', tipo: 'Clase' },
      { hora_inicio: '08:30:00', hora_fin: '09:15:00', tipo: 'Clase' },
      { hora_inicio: '09:15:00', hora_fin: '09:45:00', tipo: 'Receso' },
      { hora_inicio: '09:45:00', hora_fin: '10:30:00', tipo: 'Clase' },
      { hora_inicio: '10:30:00', hora_fin: '11:15:00', tipo: 'Clase' },
      { hora_inicio: '11:15:00', hora_fin: '12:00:00', tipo: 'Clase' },
    ];
    const bloquesDb = [];
    for (const b of bloquesData) {
      const [bl] = await BloqueHorario.findOrCreate({
        where: { hora_inicio: b.hora_inicio },
        defaults: b
      });
      bloquesDb.push(bl);
    }

    // 8. Docentes (Traer los creados en la fase 1)
    const docentesDb = await Docente.findAll();
    if (docentesDb.length === 0) {
      console.log('No hay docentes creados. Asegúrate de correr el seed de fase 1 primero.');
      return;
    }

    // 9. Secciones (Crear múltiples secciones A, B, C, D para 1er año, y A, B para el resto)
    const seccionesDb = [];
    for (const grado of gradosDb) {
      const letras = grado.get('numero') === 1 ? ['A', 'B', 'C', 'D'] : ['A', 'B'];
      for (const letra of letras) {
        const d_guia = docentesDb[Math.floor(Math.random() * docentesDb.length)];
        const [seccion] = await Seccion.findOrCreate({
          where: { id_grado: grado.get('id_grado'), letra: letra },
          defaults: { id_docente_guia: d_guia.get('id_docente') }
        });
        seccionesDb.push(seccion);
      }
    }

    // 10. Horarios (Asignar aleatoriamente materias y docentes a las secciones)
    console.log('Creando Horarios...');
    for (const seccion of seccionesDb) {
      for (const dia of diasDb) {
        const asig = asignaturasDb[Math.floor(Math.random() * asignaturasDb.length)];
        const docente = docentesDb[Math.floor(Math.random() * docentesDb.length)];
        const bloque = bloquesDb[0]; // 07:00
        const aula = aulasDb[Math.floor(Math.random() * aulasDb.length)];

        await HorarioDocente.findOrCreate({
          where: { 
            id_seccion: seccion.get('id_seccion'), 
            id_dia: dia.get('id_dia'), 
            id_bloque: bloque.get('id_bloque') 
          },
          defaults: {
            id_docente: docente.get('id_docente'),
            id_asignatura: asig.get('id_asignatura'),
            id_aula: aula.get('id_aula')
          }
        });
      }
    }

    // 11. Escala Calificacion
    const escalas = [
      { valor: '20', descripcion: 'Excelente', nota_min: 19, nota_max: 20 },
      { valor: '15', descripcion: 'Regular', nota_min: 10, nota_max: 15 },
    ];
    const escalasDb = [];
    for (const e of escalas) {
      const [esc] = await EscalaCalificacion.findOrCreate({
        where: { valor: e.valor },
        defaults: e
      });
      escalasDb.push(esc);
    }

    // 12. Momentos (Lapsos 1, 2, 3)
    const lapsos = [1, 2, 3];
    const momentosDb = [];
    for (const l of lapsos) {
      const [m] = await Momento.findOrCreate({
        where: { nombre: `Lapso ${l}`, id_periodo: periodo.get('id_periodo') },
        defaults: { fecha_inicio: new Date(), fecha_fin: new Date(), estatus: 'Activo' }
      });
      momentosDb.push(m);
    }

    // 13. Matricula y Calificaciones
    console.log('Matriculando Estudiantes y Creando Calificaciones...');
    const estudiantesDb = await Estudiante.findAll();
    for (const estudiante of estudiantesDb) {
      const seccion = seccionesDb[Math.floor(Math.random() * seccionesDb.length)];
      
      const [matricula] = await Matricula.findOrCreate({
        where: { id_estudiante: estudiante.get('id_estudiante'), id_periodo: periodo.get('id_periodo') },
        defaults: { id_seccion: seccion.get('id_seccion'), estatus_matricula: 'Activo' }
      });

      const planesSeccion = planesDb.filter(p => p.get('id_grado') === seccion.get('id_grado'));
      
      for (const plan of planesSeccion) {
        for (const momento of momentosDb) {
          const escala = escalasDb[Math.floor(Math.random() * escalasDb.length)];
          
          await Calificacion.findOrCreate({
            where: { 
              id_matricula: matricula.get('id_matricula'),
              id_plan: plan.get('id_plan'),
              id_momento: momento.get('id_momento')
            },
            defaults: {
              id_escala: escala.get('id_escala'),
              inasistencias_asignatura: 0
            }
          });
        }
      }
    }

    console.log('✅ Fase 2 de datos inyectada con éxito.');

  } catch (error) {
    console.error('Error al inyectar datos de la fase 2:', error);
  } finally {
    await sequelize.close();
  }
}

runSeed();
