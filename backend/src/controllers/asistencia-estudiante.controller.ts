import { Op, fn, col } from 'sequelize';
import { Request, Response } from 'express';
import {
  AsistenciaEstudiante, Matricula, Estudiante, Seccion,
  Calificacion, PeriodoEscolar, HorarioDocente, Asignatura,
  BloqueHorario, Usuario, sequelize
} from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { validateZod } from '../validators/zod.middleware';
import {
  crearAsistenciaEstudianteSchema,
  crearBatchAsistenciaEstudianteSchema,
  actualizarAsistenciaEstudianteSchema,
  syncInasistenciasSchema,
  syncInasistenciasBatchSchema,
} from '../validators/asistencia-estudiante.schema';

const MATRICULA_INCLUDES = [{
  model: Matricula, as: 'matricula',
  include: [
    { model: Estudiante, as: 'estudiante' },
    { model: Seccion, as: 'seccion' }
  ]
}];

export const AsistenciaEstudianteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.fecha) where.fecha = String(req.query.fecha);
    if (req.query.id_matricula) where.id_matricula = Number(req.query.id_matricula);
    if (req.query.estatus) where.estatus = String(req.query.estatus);
    if (req.query.id_horario) where.id_horario = Number(req.query.id_horario);

    if (req.query.fecha_desde || req.query.fecha_hasta) {
      where.fecha = {};
      if (req.query.fecha_desde) where.fecha[Op.gte] = String(req.query.fecha_desde);
      if (req.query.fecha_hasta) where.fecha[Op.lte] = String(req.query.fecha_hasta);
    }

    const matriculaWhere: any = {};
    if (req.query.id_seccion) matriculaWhere.id_seccion = Number(req.query.id_seccion);
    if (req.query.id_periodo) matriculaWhere.id_periodo = Number(req.query.id_periodo);

    const seccionWhere: any = {};
    if (req.query.id_grado) seccionWhere.id_grado = Number(req.query.id_grado);

    const horarioWhere: any = {};
    if (req.query.id_asignatura) horarioWhere.id_asignatura = Number(req.query.id_asignatura);
    if (req.query.id_docente) horarioWhere.id_docente = Number(req.query.id_docente);
    if (req.query.id_bloque) horarioWhere.id_bloque = Number(req.query.id_bloque);
    if (req.query.id_dia) horarioWhere.id_dia = Number(req.query.id_dia);

    const includeMatricula: any = {
      model: Matricula,
      as: 'matricula',
      where: Object.keys(matriculaWhere).length > 0 ? matriculaWhere : undefined,
      include: [
        { model: Estudiante, as: 'estudiante' },
        {
          model: Seccion, as: 'seccion',
          where: Object.keys(seccionWhere).length > 0 ? seccionWhere : undefined
        }
      ]
    };

    const include: any[] = [includeMatricula];

    const hasHorarioFilter = Object.keys(horarioWhere).length > 0
      || req.query.id_horario;

    if (hasHorarioFilter) {
      include.push({
        model: HorarioDocente,
        as: 'horario',
        where: Object.keys(horarioWhere).length > 0 ? horarioWhere : undefined,
        include: [
          { model: Asignatura, as: 'asignatura' },
          { model: BloqueHorario, as: 'bloque' },
          { model: Usuario, as: 'docente' }
        ]
      });
    }

    const { count, rows } = await AsistenciaEstudiante.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['fecha', 'DESC'], ['id_asistencia_est', 'DESC']]
    });
    res.json({ data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  }),

  crear: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const parsed = crearAsistenciaEstudianteSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const whereClause: any = { id_matricula: parsed.data.id_matricula, fecha: parsed.data.fecha };
    if (parsed.data.id_horario != null) {
      whereClause.id_horario = parsed.data.id_horario;
    }

    const existing = await AsistenciaEstudiante.findOne({ where: whereClause });
    if (existing) {
      const msg = parsed.data.id_horario
        ? 'Ya existe un registro de asistencia para este estudiante, fecha y horario'
        : 'Ya existe un registro de asistencia para este estudiante en esta fecha';
      res.status(409).json({ error: { message: msg } });
      return;
    }

    const payload: any = { ...parsed.data };
    if (parsed.data.id_horario != null) payload.id_horario = parsed.data.id_horario;
    if (parsed.data.id_docente_toma != null) payload.id_docente_toma = parsed.data.id_docente_toma;

    const nueva = await AsistenciaEstudiante.create({
      ...payload,
      id_usuario_crea: req.user!.idUsuario,
    });
    const completa = await AsistenciaEstudiante.findByPk(nueva.id_asistencia_est, { include: MATRICULA_INCLUDES });
    res.status(201).json(completa || nueva);
  }),

  crearBatch: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const parsed = crearBatchAsistenciaEstudianteSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const idUsuario = req.user!.idUsuario;

    const result = await sequelize.transaction(async (t) => {
      const creados: any[] = [];
      for (const r of parsed.data.registros) {
        const payload: any = {
          id_matricula: r.id_matricula,
          fecha: r.fecha,
          estatus: r.estatus || 'Presente',
          observacion: r.observacion || null,
          id_horario: r.id_horario || null,
          id_usuario_crea: idUsuario,
        };

        const whereClause: any = { id_matricula: payload.id_matricula, fecha: payload.fecha };
        if (payload.id_horario != null) {
          whereClause.id_horario = payload.id_horario;
        }

        const [registro, created] = await AsistenciaEstudiante.findOrCreate({
          where: whereClause,
          defaults: payload,
          transaction: t,
        });

        if (!created) {
          await registro.update({ estatus: payload.estatus, observacion: payload.observacion }, { transaction: t });
        }
        creados.push(registro);
      }
      return creados;
    });

    const completos = await Promise.all(
      result.map((r: any) => AsistenciaEstudiante.findByPk(r.id_asistencia_est, { include: MATRICULA_INCLUDES }))
    );
    const data = completos.map((r, i) => r || result[i]);
    res.status(201).json({ data, meta: { total: data.length } });
  }),

  porHorario: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id_horario, fecha, registros } = req.body;

    if (!id_horario || !fecha || !Array.isArray(registros)) {
      res.status(400).json({ error: { message: 'Se requieren id_horario, fecha y registros' } });
      return;
    }

    const horario = await HorarioDocente.findByPk(Number(id_horario));
    if (!horario) {
      res.status(404).json({ error: { message: 'Horario no encontrado' } });
      return;
    }

    const idUsuario = req.user!.idUsuario;

    const result = await sequelize.transaction(async (t) => {
      const creados: any[] = [];
      for (const r of registros) {
        const payload = {
          id_matricula: r.id_matricula,
          fecha,
          id_horario: Number(id_horario),
          estatus: r.estatus || 'Presente',
          observacion: r.observacion || null,
          id_usuario_crea: idUsuario,
        };

        const [registro, created] = await AsistenciaEstudiante.findOrCreate({
          where: { id_matricula: payload.id_matricula, fecha, id_horario: Number(id_horario) },
          defaults: payload,
          transaction: t,
        });

        if (!created) {
          await registro.update({ estatus: payload.estatus, observacion: payload.observacion }, { transaction: t });
        }
        creados.push(registro);
      }
      return creados;
    });

    const completos = await Promise.all(
      result.map((r: any) => AsistenciaEstudiante.findByPk(r.id_asistencia_est, {
        include: [...MATRICULA_INCLUDES, {
          model: HorarioDocente, as: 'horario',
          include: [
            { model: Asignatura, as: 'asignatura' },
            { model: BloqueHorario, as: 'bloque' }
          ]
        }]
      }))
    );
    const data = completos.map((r, i) => r || result[i]);
    res.status(201).json({ data, meta: { total: data.length } });
  }),

  estadisticas: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, id_seccion, id_grado, id_periodo, id_asignatura, fecha_desde, fecha_hasta } = req.query;

    const whereConditions: string[] = [];
    const replacements: any[] = [];

    if (id_matricula) {
      whereConditions.push('ae.id_matricula = ?');
      replacements.push(Number(id_matricula));
    }
    if (id_seccion) {
      whereConditions.push('m.id_seccion = ?');
      replacements.push(Number(id_seccion));
    }
    if (id_periodo) {
      whereConditions.push('m.id_periodo = ?');
      replacements.push(Number(id_periodo));
    }
    if (id_grado) {
      whereConditions.push('s.id_grado = ?');
      replacements.push(Number(id_grado));
    }
    if (id_asignatura) {
      whereConditions.push('hd.id_asignatura = ?');
      replacements.push(Number(id_asignatura));
    }
    if (fecha_desde) {
      whereConditions.push('ae.fecha >= ?');
      replacements.push(String(fecha_desde));
    }
    if (fecha_hasta) {
      whereConditions.push('ae.fecha <= ?');
      replacements.push(String(fecha_hasta));
    }

    const joinHorario = id_asignatura
      ? 'LEFT JOIN horario_docente hd ON hd.id_horario = ae.id_horario'
      : '';

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const groupFields = id_asignatura
      ? 'm.id_estudiante, e.apellido, e.nombre, e.cedula, s.id_grado, s.letra, hd.id_asignatura'
      : 'm.id_estudiante, e.apellido, e.nombre, e.cedula, s.id_grado, s.letra';

    const selectAsignatura = id_asignatura
      ? ', a.nombre AS asignatura_nombre'
      : '';

    const joinAsignatura = id_asignatura
      ? 'LEFT JOIN asignaturas a ON a.id_asignatura = hd.id_asignatura'
      : '';

    const query = `
      SELECT
        m.id_estudiante,
        CONCAT(e.apellido, ', ', e.nombre) AS nombre,
        e.cedula,
        CONCAT(s.id_grado, '° "', s.letra, '"') AS seccion,
        SUM(CASE WHEN ae.estatus = 'Presente' THEN 1 ELSE 0 END) AS presente,
        SUM(CASE WHEN ae.estatus = 'Ausente' THEN 1 ELSE 0 END) AS ausente,
        SUM(CASE WHEN ae.estatus = 'Justificado' THEN 1 ELSE 0 END) AS justificado,
        COUNT(*) AS total
        ${selectAsignatura}
      FROM asistencia_estudiante ae
      INNER JOIN matricula m ON m.id_matricula = ae.id_matricula
      INNER JOIN estudiantes e ON e.id_estudiante = m.id_estudiante
      INNER JOIN secciones s ON s.id_seccion = m.id_seccion
      ${joinHorario}
      ${joinAsignatura}
      ${whereClause}
      GROUP BY ${groupFields}
      ORDER BY e.apellido, e.nombre
    `;

    const [results]: any = await sequelize.query(query, { replacements });

    const stats = results.map((s: any) => ({
      id_estudiante: s.id_estudiante,
      nombre: s.nombre,
      cedula: s.cedula,
      seccion: s.seccion,
      ...(s.asignatura_nombre ? { asignatura: s.asignatura_nombre } : {}),
      presente: Number(s.presente),
      ausente: Number(s.ausente),
      justificado: Number(s.justificado),
      total: Number(s.total),
      porcentaje_asistencia: Number(s.total) > 0
        ? Math.round(((Number(s.presente) + Number(s.justificado)) / Number(s.total)) * 100)
        : 100
    }));

    res.json({ data: stats });
  }),

  syncInasistencias: wrapAsync(async (req: Request, res: Response) => {
    const parsed = syncInasistenciasSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const { id_matricula, id_periodo } = parsed.data;

    const periodoId = id_periodo || null;
    let periodo: any = null;
    if (!periodoId) {
      periodo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    } else {
      periodo = await PeriodoEscolar.findByPk(periodoId);
    }

    if (!periodo) {
      res.status(400).json({ error: { message: 'No se encontró un período activo' } });
      return;
    }

    await sequelize.transaction(async (t) => {
      const ausenciasCount = await AsistenciaEstudiante.count({
        where: {
          id_matricula,
          estatus: 'Ausente'
        },
        include: [{
          model: Matricula,
          as: 'matricula',
          where: { id_periodo: periodo.id_periodo },
          attributes: []
        }],
        transaction: t,
      });

      await Calificacion.update(
        { inasistencias_asignatura: ausenciasCount },
        { where: { id_matricula }, transaction: t }
      );
    });

    res.json({ data: { id_matricula } });
  }),

  syncInasistenciasBatch: wrapAsync(async (req: Request, res: Response) => {
    const parsed = syncInasistenciasBatchSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const { ids_matricula, id_periodo } = parsed.data;

    const periodoId = id_periodo || null;
    let periodo: any = null;
    if (!periodoId) {
      periodo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    } else {
      periodo = await PeriodoEscolar.findByPk(periodoId);
    }

    if (!periodo) {
      res.status(400).json({ error: { message: 'No se encontró un período activo' } });
      return;
    }

    const results = await sequelize.transaction(async (t) => {
      const counts = await AsistenciaEstudiante.findAll({
        attributes: ['id_matricula', [fn('COUNT', col('AsistenciaEstudiante.id_asistencia_est')), 'total_ausencias']],
        where: {
          id_matricula: { [Op.in]: ids_matricula },
          estatus: 'Ausente'
        },
        include: [{
          model: Matricula,
          as: 'matricula',
          where: { id_periodo: periodo.id_periodo },
          attributes: []
        }],
        group: ['id_matricula'],
        transaction: t,
        raw: true,
      });

      const countMap: Record<number, number> = {};
      for (const r of counts as any[]) {
        countMap[r.id_matricula] = Number(r.total_ausencias);
      }

      for (const id of ids_matricula) {
        const ausencias = countMap[id] || 0;
        await Calificacion.update(
          { inasistencias_asignatura: ausencias },
          { where: { id_matricula: id }, transaction: t }
        );
      }

      return ids_matricula.map(id => ({ id_matricula: id, inasistencias: countMap[id] || 0 }));
    });

    res.json({ data: results, meta: { total: results.length } });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const record = await AsistenciaEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Asistencia de estudiante no encontrada' } });
      return;
    }

    const parsed = actualizarAsistenciaEstudianteSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    await record.update({
      ...parsed.data,
      id_usuario_modifica: req.user!.idUsuario,
    });
    const completa = await AsistenciaEstudiante.findByPk(record.id_asistencia_est, { include: MATRICULA_INCLUDES });
    res.json(completa || record);
  }),

  eliminar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const record = await AsistenciaEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Asistencia de estudiante no encontrada' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
