import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { Momento } from '../models/Momento';
import { Matricula } from '../models/Matricula';
import { Calificacion } from '../models/Calificacion';
import { PlanEstudio } from '../models/PlanEstudio';
import { EscalaCalificacion } from '../models/EscalaCalificacion';
import { MateriaPendiente } from '../models/MateriaPendiente';
import { Asignatura } from '../models/Asignatura';
import { Seccion } from '../models/Seccion';
import { GradoAno } from '../models/GradoAno';
import { Estudiante } from '../models/Estudiante';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const PeriodoEscolarController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await PeriodoEscolar.findAll({ include: [{ model: Momento, as: 'momentos' }] });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await PeriodoEscolar.findByPk(id, { include: [{ model: Momento, as: 'momentos' }] });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { nombre, estatus } = req.body;
    if (nombre) {
      const existing = await PeriodoEscolar.findOne({ where: { nombre } });
      if (existing) {
        res.status(400).json({ error: { message: `Ya existe un período escolar registrado con el nombre ${nombre}` } });
        return;
      }
    }
    if (estatus === 'Activo') {
      const activoExistente = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activoExistente) {
        res.status(400).json({ error: { message: `Ya existe un período escolar activo (${activoExistente.nombre}). Debe cerrarlo antes de activar uno nuevo.` } });
        return;
      }
    }
    const result = await PeriodoEscolar.create(req.body);
    
    // Autogenerar los 3 momentos para el nuevo periodo
    await Momento.bulkCreate([
      { id_periodo: result.id_periodo, descripcion: 'Primer Lapso', estatus: 'Abierto' },
      { id_periodo: result.id_periodo, descripcion: 'Segundo Lapso', estatus: 'Abierto' },
      { id_periodo: result.id_periodo, descripcion: 'Tercer Lapso', estatus: 'Abierto' },
    ]);

    const resultWithMomentos = await PeriodoEscolar.findByPk(result.id_periodo, { include: [{ model: Momento, as: 'momentos' }] });

    getIO().emit('periodo:create', { data: resultWithMomentos });
    res.status(201).json({ data: resultWithMomentos });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const { nombre, estatus } = req.body;
    const record = await PeriodoEscolar.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    if (nombre && nombre !== record.nombre) {
      const existing = await PeriodoEscolar.findOne({ where: { nombre } });
      if (existing) {
        res.status(400).json({ error: { message: `Ya existe un período escolar registrado con el nombre ${nombre}` } });
        return;
      }
    }
    if (estatus === 'Activo' && record.estatus === 'Cerrado') {
      if (req.user?.idRol !== 1 && req.user?.rol !== 'Administrador') {
        res.status(403).json({ error: { message: 'Solo el administrador puede reactivar un período cerrado' } });
        return;
      }
    }
    if (estatus === 'Activo' && record.estatus !== 'Activo') {
      const activoExistente = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activoExistente) {
        res.status(400).json({ error: { message: `Ya existe un período escolar activo (${activoExistente.nombre}). Debe cerrarlo antes de activar uno nuevo.` } });
        return;
      }
    }
    await record.update(req.body);
    const resultWithMomentos = await PeriodoEscolar.findByPk(id, { include: [{ model: Momento, as: 'momentos' }] });
    getIO().emit('periodo:update', { data: resultWithMomentos });
    res.json({ data: resultWithMomentos });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await PeriodoEscolar.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('periodo:delete', { data: { id_periodo: id } });
    res.status(204).send();
  }),

  cierreAnual: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const periodo = await PeriodoEscolar.findByPk(id);
    if (!periodo) {
      res.status(404).json({ error: { message: 'Periodo no encontrado' } });
      return;
    }

    if (periodo.estatus === 'Cerrado') {
      res.status(400).json({ error: { message: 'El periodo ya está cerrado' } });
      return;
    }

    // 1. Obtener matrículas del periodo (con sección y grado)
    const matriculas = await Matricula.findAll({
      where: { id_periodo: id },
      include: [{ model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] }],
    });
    if (matriculas.length === 0) {
      // Si no hay matrículas igual cerramos
      await periodo.update({ estatus: 'Cerrado' });
      await Momento.update({ estatus: 'Cerrado' }, { where: { id_periodo: id } });
      res.json({ message: 'Periodo cerrado sin estudiantes matriculados.' });
      return;
    }

    const matriculaIds = matriculas.map(m => m.id_matricula);

    // 2. Obtener las calificaciones de esas matrículas
    const calificaciones = await Calificacion.findAll({
      where: { id_matricula: matriculaIds },
      include: [
        { model: PlanEstudio, as: 'plan' },
        { model: EscalaCalificacion, as: 'escala', attributes: ['nota_calculo'] }
      ]
    });

    // 3. Agrupar por estudiante y asignatura
    // estructura: { estudianteId: { asignaturaId: [notas] } }
    const notasByEstudiante: Record<number, Record<number, number[]>> = {};

    for (const cal of calificaciones) {
      const plan = (cal as any).plan;
      const escala = (cal as any).escala;
      if (!plan || !escala || escala.nota_calculo == null) continue;

      const mat = matriculas.find(m => m.id_matricula === cal.id_matricula);
      if (!mat) continue;

      const idEstudiante = mat.id_estudiante;
      const idAsig = plan.id_asignatura;

      if (!notasByEstudiante[idEstudiante]) notasByEstudiante[idEstudiante] = {};
      if (!notasByEstudiante[idEstudiante][idAsig]) notasByEstudiante[idEstudiante][idAsig] = [];

      notasByEstudiante[idEstudiante][idAsig].push(escala.nota_calculo);
    }

    const materiasARegistrar: any[] = [];
    
    // Obtener las materias pendientes que ya existen (para no duplicar si el usuario le da dos veces o hubo un error previo)
    const existentesDB = await MateriaPendiente.findAll({
       where: { id_periodo: id }
    });
    const existentesSet = new Set(existentesDB.map(mp => `${mp.id_estudiante}-${mp.id_asignatura}`));

    // 4. Calcular promedio y decidir reprobados
    for (const idEstudianteStr of Object.keys(notasByEstudiante)) {
      const idEstudiante = Number(idEstudianteStr);
      for (const idAsigStr of Object.keys(notasByEstudiante[idEstudiante])) {
        const idAsig = Number(idAsigStr);
        const grades = notasByEstudiante[idEstudiante][idAsig];
        
        const suma = grades.reduce((s, g) => s + g, 0);
        const notaFinal = Math.round(suma / 3);

        if (notaFinal >= 1 && notaFinal < 10) {
           const key = `${idEstudiante}-${idAsig}`;
           if (!existentesSet.has(key)) {
             materiasARegistrar.push({
               id_estudiante: idEstudiante,
               id_asignatura: idAsig,
               id_periodo: id,
               estatus: 'Cursando'
             });
             existentesSet.add(key);
           }
        }
      }
    }

    // 4b. Detectar materias sin calificaciones (nunca se ingresaron notas)
    const existingPlanIdsByMatricula: Record<number, Set<number>> = {};
    for (const cal of calificaciones) {
      if (!existingPlanIdsByMatricula[cal.id_matricula]) {
        existingPlanIdsByMatricula[cal.id_matricula] = new Set();
      }
      existingPlanIdsByMatricula[cal.id_matricula].add(cal.id_plan);
    }

    for (const mat of matriculas) {
      const sec = (mat as any).seccion;
      const grado = sec?.grado;
      if (!grado) continue;

      const existingPlans = existingPlanIdsByMatricula[mat.id_matricula] || new Set();
      const allPlans = await PlanEstudio.findAll({ where: { id_grado: grado.id_grado } });

      for (const plan of allPlans) {
        if (!existingPlans.has(plan.id_plan)) {
          const key = `${mat.id_estudiante}-${plan.id_asignatura}`;
          if (!existentesSet.has(key)) {
            materiasARegistrar.push({
              id_estudiante: mat.id_estudiante,
              id_asignatura: plan.id_asignatura,
              id_periodo: id,
              estatus: 'Cursando',
            });
            existentesSet.add(key);
          }
        }
      }
    }

    // 5. Insertar materias pendientes
    if (materiasARegistrar.length > 0) {
      await MateriaPendiente.bulkCreate(materiasARegistrar);
    }

    // 6. Cerrar Periodo y Momentos
    await periodo.update({ estatus: 'Cerrado' });
    await Momento.update({ estatus: 'Cerrado' }, { where: { id_periodo: id } });

    const resultWithMomentos = await PeriodoEscolar.findByPk(id, { include: [{ model: Momento, as: 'momentos' }] });
    getIO().emit('periodo:update', { data: resultWithMomentos });

    res.json({ 
      message: 'Cierre anual completado exitosamente', 
      materiasReprobadasProcesadas: materiasARegistrar.length,
      data: resultWithMomentos 
    });
  }),

  promocionPreview: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const periodo = await PeriodoEscolar.findByPk(id);
    if (!periodo) {
      res.status(404).json({ error: { message: 'Periodo no encontrado' } });
      return;
    }
    if (periodo.estatus !== 'Cerrado') {
      res.status(400).json({ error: { message: 'El periodo debe estar cerrado para ver el preview de promoción' } });
      return;
    }

    const matriculas = await Matricula.findAll({
      where: { id_periodo: id },
      include: [
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: Estudiante, as: 'estudiante' },
      ],
    });

    if (matriculas.length === 0) {
      res.json({ periodoActual: { id: periodo.id_periodo, nombre: periodo.nombre }, siguientePeriodo: null, estudiantes: [], resumen: { total: 0, promovidos: 0, promovidosPendientes: 0, repitentes: 0 } });
      return;
    }

    const estudianteIds = matriculas.map(m => m.id_estudiante);
    const materiaPendientes = await MateriaPendiente.findAll({
      where: { id_estudiante: estudianteIds, estatus: { [Op.ne]: 'Aprobada' } },
      include: [{ model: Asignatura, as: 'asignatura' }],
    });
    const pendientesMap: Record<number, number> = {};
    for (const mp of materiaPendientes) {
      const estId = mp.id_estudiante;
      pendientesMap[estId] = (pendientesMap[estId] || 0) + 1;
    }

    const gradoMax = await GradoAno.max('numero') as number;
    const estudiantes: any[] = [];

    for (const mat of matriculas) {
      const est = (mat as any).estudiante;
      const sec = (mat as any).seccion;
      const grado = sec?.grado;
      if (!est || !grado) continue;

      const materiasReprobadas = pendientesMap[est.id_estudiante] || 0;
      const gradoNumero = grado.numero;
      const esUltimoAno = gradoNumero >= gradoMax;

      let accionRecomendada: string;
      if (materiasReprobadas === 0) {
        accionRecomendada = esUltimoAno ? 'graduado' : 'promovido';
      } else if (materiasReprobadas <= 2) {
        accionRecomendada = esUltimoAno ? 'graduado_pendientes' : 'promovido_pendientes';
      } else {
        accionRecomendada = esUltimoAno ? 'graduado_pendientes' : 'repitente';
      }

      const siguienteGradoNumero = esUltimoAno ? null : gradoNumero + 1;

      const materiasReprobadasDetalle = materiaPendientes
        .filter(mp => mp.id_estudiante === est.id_estudiante)
        .map(mp => ({
          id_asignatura: mp.id_asignatura,
          nombre: (mp as any).asignatura?.nombre || 'Sin nombre',
        }));

      estudiantes.push({
        id_estudiante: est.id_estudiante,
        nombre: `${est.nombre1 || ''} ${est.nombre2 || ''} ${est.apellido1 || ''} ${est.apellido2 || ''}`.trim(),
        gradoActual: grado.nombre,
        gradoNumero,
        seccionActual: sec.letra,
        materiasReprobadas,
        materiasReprobadasDetalle,
        accionRecomendada,
        siguienteGrado: siguienteGradoNumero ? null : 'Graduado',
        siguienteGradoNumero,
      });
    }

    const periodoActualNombre = periodo.nombre;
    const anioInicio = parseInt(periodoActualNombre.split('-')[0] || periodoActualNombre.split('/')[0] || '0');
    const nombreSiguiente = `${anioInicio + 1}-${anioInicio + 2}`;
    const siguientePeriodo = await PeriodoEscolar.findOne({ where: { nombre: nombreSiguiente } });

    const resumen = {
      total: estudiantes.length,
      promovidos: estudiantes.filter(e => e.accionRecomendada === 'promovido' || e.accionRecomendada === 'graduado').length,
      promovidosPendientes: estudiantes.filter(e => e.accionRecomendada === 'promovido_pendientes' || e.accionRecomendada === 'graduado_pendientes').length,
      repitentes: estudiantes.filter(e => e.accionRecomendada === 'repitente').length,
    };

    res.json({
      periodoActual: { id: periodo.id_periodo, nombre: periodo.nombre },
      siguientePeriodo: siguientePeriodo ? { id: siguientePeriodo.id_periodo, nombre: siguientePeriodo.nombre } : null,
      estudiantes,
      resumen,
    });
  }),

  promocionConfirmar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const { decisiones } = req.body;

    if (!Array.isArray(decisiones) || decisiones.length === 0) {
      res.status(400).json({ error: { message: 'Debe proporcionar un array de decisiones' } });
      return;
    }

    const periodo = await PeriodoEscolar.findByPk(id);
    if (!periodo) {
      res.status(404).json({ error: { message: 'Periodo no encontrado' } });
      return;
    }
    if (periodo.estatus !== 'Cerrado') {
      res.status(400).json({ error: { message: 'El periodo debe estar cerrado para promover estudiantes' } });
      return;
    }

    const periodoActualNombre = periodo.nombre;
    const anioInicio = parseInt(periodoActualNombre.split('-')[0] || periodoActualNombre.split('/')[0] || '0');
    const nombreSiguiente = `${anioInicio + 1}-${anioInicio + 2}`;

    let siguientePeriodo = await PeriodoEscolar.findOne({ where: { nombre: nombreSiguiente } });
    let nuevoPeriodo = false;
    if (!siguientePeriodo) {
      siguientePeriodo = await PeriodoEscolar.create({ nombre: nombreSiguiente, estatus: 'Planificacion' });
      await Momento.bulkCreate([
        { id_periodo: siguientePeriodo.id_periodo, descripcion: 'Primer Lapso', estatus: 'Abierto' },
        { id_periodo: siguientePeriodo.id_periodo, descripcion: 'Segundo Lapso', estatus: 'Abierto' },
        { id_periodo: siguientePeriodo.id_periodo, descripcion: 'Tercer Lapso', estatus: 'Abierto' },
      ]);
      nuevoPeriodo = true;
    }

    const estudiantesIds = decisiones.map((d: any) => d.id_estudiante);
    const matriculasActuales = await Matricula.findAll({
      where: { id_periodo: id, id_estudiante: estudiantesIds },
      include: [{ model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] }],
    });

    const mapaMatriculas: Record<number, any> = {};
    for (const mat of matriculasActuales) {
      mapaMatriculas[mat.id_estudiante] = mat;
    }

    // 1. Cerrar matrículas viejas de TODOS los estudiantes
    for (const d of decisiones) {
      await Matricula.update(
        { estatus_matricula: 'Cerrada' },
        { where: { id_estudiante: d.id_estudiante, id_periodo: id } }
      );
    }

    // 2. Marcar graduados (5to año) como Inactivo
    const gradoMax = await GradoAno.max('numero') as number;
    for (const d of decisiones) {
      if (d.accion === 'graduado' || d.accion === 'graduado_pendientes') {
        const mat = mapaMatriculas[d.id_estudiante];
        if (mat?.seccion?.grado?.numero === gradoMax) {
          await Estudiante.update(
            { estatus_estudiante: 'Inactivo' },
            { where: { id_estudiante: d.id_estudiante } }
          );
        }
      }
    }

    // 3. Determinar grados necesarios en el periodo siguiente
    const gradosNecesarios = new Set<number>();
    for (const d of decisiones) {
      if (d.accion === 'promovido' || d.accion === 'promovido_pendientes') {
        const mat = mapaMatriculas[d.id_estudiante];
        if (mat?.seccion?.grado) {
          const siguienteGrado = mat.seccion.grado.numero + 1;
          if (siguienteGrado <= gradoMax) gradosNecesarios.add(siguienteGrado);
        }
      }
    }

    // 4. Crear secciones en el periodo siguiente si no existen
    const seccionesExistentes = await Seccion.findAll({
      where: { id_periodo: siguientePeriodo.id_periodo },
      include: [{ model: GradoAno, as: 'grado' }],
    });

    const mapaSecciones: Record<number, number> = {};
    for (const sec of seccionesExistentes) {
      const grado = (sec as any).grado;
      if (grado && gradosNecesarios.has(grado.numero)) {
        mapaSecciones[grado.numero] = sec.id_seccion;
      }
    }

    for (const gradoNum of gradosNecesarios) {
      if (!mapaSecciones[gradoNum]) {
        const seccionOriginal = matriculasActuales.find(m => m.seccion?.grado?.numero === gradoNum - 1)?.seccion;
        const grado = await GradoAno.findOne({ where: { numero: gradoNum } });
        if (!grado) continue;

        const nuevaSeccion = await Seccion.create({
          id_periodo: siguientePeriodo.id_periodo,
          id_grado: grado.id_grado,
          letra: seccionOriginal?.letra || 'A',
          id_docente_guia: seccionOriginal?.id_docente_guia || 1,
          capacidad_maxima: seccionOriginal?.capacidad_maxima || 30,
        });
        mapaSecciones[gradoNum] = nuevaSeccion.id_seccion;
      }
    }

    // 5. Crear matrículas nuevas para promovidos
    let matriculasCreadas = 0;
    const matriculasNuevas: any[] = [];
    const matriculasCreadasMap: Record<number, any> = {};

    for (const d of decisiones) {
      if (d.accion === 'promovido' || d.accion === 'promovido_pendientes') {
        const mat = mapaMatriculas[d.id_estudiante];
        if (!mat?.seccion?.grado) continue;

        const siguienteGrado = mat.seccion.grado.numero + 1;
        if (siguienteGrado > gradoMax) continue;

        const idSeccion = mapaSecciones[siguienteGrado];
        if (!idSeccion) continue;

        const matriculaExistente = await Matricula.findOne({
          where: { id_estudiante: d.id_estudiante, id_periodo: siguientePeriodo.id_periodo },
        });
        if (matriculaExistente) {
          matriculasCreadasMap[d.id_estudiante] = matriculaExistente;
          continue;
        }

        const maxNumero = await Matricula.max('numero_lista', {
          where: { id_periodo: siguientePeriodo.id_periodo, id_seccion: idSeccion },
        }) as number | null;

        const nuevaMatricula = {
          id_estudiante: d.id_estudiante,
          id_seccion: idSeccion,
          id_periodo: siguientePeriodo.id_periodo,
          numero_lista: (maxNumero || 0) + 1,
          estatus_matricula: 'Activa',
        };
        matriculasNuevas.push(nuevaMatricula);
        matriculasCreadas++;
      }
    }

    if (matriculasNuevas.length > 0) {
      const creadas = await Matricula.bulkCreate(matriculasNuevas);
      for (const mat of creadas) {
        matriculasCreadasMap[mat.id_estudiante] = mat;
      }
    }

    // 6. Crear Calificacion placeholder para materias pendientes
    let calificacionesCreadas = 0;
    const momentosSiguiente = await Momento.findAll({
      where: { id_periodo: siguientePeriodo.id_periodo },
      order: [['id_momento', 'ASC']],
    });

    for (const d of decisiones) {
      if (d.accion !== 'promovido_pendientes' && d.accion !== 'graduado_pendientes') continue;

      const nuevaMatricula = matriculasCreadasMap[d.id_estudiante];
      if (!nuevaMatricula) continue;

      const pendientes = await MateriaPendiente.findAll({
        where: { id_estudiante: d.id_estudiante, id_periodo: id, estatus: { [Op.ne]: 'Aprobada' } },
      });

      const idsSeleccionadas = Array.isArray(d.materias_pendientes) ? d.materias_pendientes : null;
      const pendientesFiltradas = idsSeleccionadas
        ? pendientes.filter(p => idsSeleccionadas.includes(p.id_asignatura))
        : pendientes;

      for (const pendiente of pendientesFiltradas) {
        const mat = mapaMatriculas[d.id_estudiante];
        const gradoAnterior = mat?.seccion?.grado?.numero;
        if (!gradoAnterior) continue;

        const planEntry = await PlanEstudio.findOne({
          where: { id_grado: gradoAnterior, id_asignatura: pendiente.id_asignatura },
        });
        if (!planEntry) continue;

        for (const momento of momentosSiguiente) {
          const calificacionExistente = await Calificacion.findOne({
            where: {
              id_matricula: nuevaMatricula.id_matricula,
              id_plan: planEntry.id_plan,
              id_momento: momento.id_momento,
            },
          });
          if (!calificacionExistente) {
            await Calificacion.create({
              id_matricula: nuevaMatricula.id_matricula,
              id_plan: planEntry.id_plan,
              id_momento: momento.id_momento,
              id_escala: 1,
              inasistencias_asignatura: 0,
            });
            calificacionesCreadas++;
          }
        }
      }
    }

    const mensaje = [
      `Promoción completada.`,
      nuevoPeriodo ? `Periodo ${nombreSiguiente} creado.` : '',
      `${matriculasCreadas} matrículas creadas.`,
      `${calificacionesCreadas} calificaciones de materias pendientes creadas.`,
      `${decisiones.filter((d: any) => d.accion === 'repitente').length} estudiantes repitentes.`,
    ].filter(Boolean).join(' ');

    const siguienteConMomentos = await PeriodoEscolar.findByPk(siguientePeriodo.id_periodo, { include: [{ model: Momento, as: 'momentos' }] });
    if (nuevoPeriodo) getIO().emit('periodo:create', { data: siguienteConMomentos });
    getIO().emit('periodo:update', { data: siguienteConMomentos });

    res.json({
      message: mensaje,
      matriculasCreadas,
      calificacionesCreadas,
      repitentes: decisiones.filter((d: any) => d.accion === 'repitente').length,
      periodoSiguiente: siguienteConMomentos,
    });
  }),
};
