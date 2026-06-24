import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { AsistenciaEstudiante, Matricula, Estudiante, Seccion, Calificacion, PeriodoEscolar } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

const ALLOWED_STATUSES = ['Presente', 'Ausente', 'Justificado'];

const ALLOWED_CREATE_FIELDS = ['id_matricula', 'fecha', 'estatus', 'observacion'];
const ALLOWED_UPDATE_FIELDS = ['estatus', 'observacion'];

export const AsistenciaEstudianteController = {
  // Obtener todas las asistencias de estudiantes
  listar: wrapAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.fecha) where.fecha = String(req.query.fecha);
    if (req.query.id_matricula) where.id_matricula = Number(req.query.id_matricula);

    const { count, rows } = await AsistenciaEstudiante.findAndCountAll({
      where,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            {
              model: Estudiante,
              as: 'estudiante'
            },
            {
              model: Seccion,
              as: 'seccion'
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha', 'DESC'], ['id_asistencia_est', 'DESC']]
    });
    res.json({ data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  }),

  // Crear asistencia
  crear: wrapAsync(async (req: Request, res: Response) => {
    const payload: any = {};
    for (const field of ALLOWED_CREATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (!payload.id_matricula || !payload.fecha) {
      res.status(400).json({ error: { message: 'id_matricula y fecha son requeridos' } });
      return;
    }

    if (payload.estatus && !ALLOWED_STATUSES.includes(payload.estatus)) {
      res.status(400).json({ error: { message: 'estatus debe ser: Presente, Ausente o Justificado' } });
      return;
    }

    const existing = await AsistenciaEstudiante.findOne({
      where: { id_matricula: payload.id_matricula, fecha: payload.fecha }
    });
    if (existing) {
      res.status(409).json({ error: { message: 'Ya existe un registro de asistencia para este estudiante en esta fecha' } });
      return;
    }

    const nueva = await AsistenciaEstudiante.create(payload);
    res.status(201).json(nueva);
  }),

  // Estadísticas de asistencia
  estadisticas: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, id_seccion, fecha_desde, fecha_hasta } = req.query;

    const where: any = {};
    if (id_matricula) where.id_matricula = Number(id_matricula);
    if (fecha_desde || fecha_hasta) {
      where.fecha = {};
      if (fecha_desde) where.fecha[Op.gte] = String(fecha_desde);
      if (fecha_hasta) where.fecha[Op.lte] = String(fecha_hasta);
    }

    const include: any[] = [
      {
        model: Matricula,
        as: 'matricula',
        attributes: ['id_matricula', 'id_estudiante', 'id_seccion'],
        include: [
          { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'nombre', 'apellido', 'cedula'] },
          { model: Seccion, as: 'seccion', attributes: ['id_seccion', 'id_grado', 'letra'] }
        ]
      }
    ];

    if (id_seccion) {
      include[0].where = { id_seccion: Number(id_seccion) };
    }

    const records = await AsistenciaEstudiante.findAll({ where, include });

    // Agrupar por estudiante
    const statsMap: Record<number, any> = {};
    for (const r of records) {
      const row = r as any;
      const estId = row.matricula?.id_estudiante;
      if (!estId) continue;
      if (!statsMap[estId]) {
        statsMap[estId] = {
          id_estudiante: estId,
          nombre: `${row.matricula.estudiante?.apellido || ''}, ${row.matricula.estudiante?.nombre || ''}`,
          cedula: row.matricula.estudiante?.cedula || '',
          seccion: `${row.matricula.seccion?.id_grado || '?'}° "${row.matricula.seccion?.letra || '?'}"`,
          presente: 0,
          ausente: 0,
          justificado: 0,
          total: 0
        };
      }
      const s = statsMap[estId];
      s.total++;
      if (r.estatus === 'Presente') s.presente++;
      else if (r.estatus === 'Ausente') s.ausente++;
      else if (r.estatus === 'Justificado') s.justificado++;
    }

    const stats = Object.values(statsMap).map((s: any) => ({
      ...s,
      porcentaje_asistencia: s.total > 0 ? Math.round(((s.presente + s.justificado) / s.total) * 100) : 100
    }));

    res.json({ data: stats });
  }),

  // Sincronizar inasistencias en calificaciones
  syncInasistencias: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, id_periodo } = req.body;

    if (!id_matricula) {
      res.status(400).json({ error: { message: 'id_matricula es requerido' } });
      return;
    }

    const periodoId = Number(id_periodo) || null;
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

    // Contar ausencias (no justificadas) del estudiante en el período
    const ausenciasCount = await AsistenciaEstudiante.count({
      where: {
        id_matricula: Number(id_matricula),
        estatus: 'Ausente'
      },
      include: [{
        model: Matricula,
        as: 'matricula',
        where: { id_periodo: periodo.id_periodo },
        attributes: []
      }]
    });

    // Actualizar todas las calificaciones del estudiante en este período
    await Calificacion.update(
      { inasistencias_asignatura: ausenciasCount },
      { where: { id_matricula: Number(id_matricula) } }
    );

    res.json({ data: { id_matricula: Number(id_matricula), inasistencias: ausenciasCount } });
  }),

  // Actualizar asistencia
  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const record = await AsistenciaEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Asistencia de estudiante no encontrada' } });
      return;
    }

    const payload: any = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (payload.estatus && !ALLOWED_STATUSES.includes(payload.estatus)) {
      res.status(400).json({ error: { message: 'estatus debe ser: Presente, Ausente o Justificado' } });
      return;
    }

    await record.update(payload);
    res.json(record);
  })
};
