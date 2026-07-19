import { Request, Response } from 'express';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { Momento } from '../models/Momento';
import { Matricula } from '../models/Matricula';
import { Calificacion } from '../models/Calificacion';
import { PlanEstudio } from '../models/PlanEstudio';
import { EscalaCalificacion } from '../models/EscalaCalificacion';
import { MateriaPendiente } from '../models/MateriaPendiente';
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
      { id_periodo: result.id_periodo, descripcion: 'Lapso 1', estatus: 'Abierto' },
      { id_periodo: result.id_periodo, descripcion: 'Lapso 2', estatus: 'Abierto' },
      { id_periodo: result.id_periodo, descripcion: 'Lapso 3', estatus: 'Abierto' },
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

    // 1. Obtener matrículas del periodo
    const matriculas = await Matricula.findAll({ where: { id_periodo: id } });
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
};
