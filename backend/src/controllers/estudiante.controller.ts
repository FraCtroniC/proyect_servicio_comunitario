import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Estudiante, Representante, Matricula, Seccion, GradoAno, PeriodoEscolar } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

const ALLOWED_ESTUDIANTE_FIELDS = [
  'cedula_escolar', 'nombre1', 'nombre2', 'apellido1', 'apellido2',
  'fecha_nac', 'genero', 'lugar_nac', 'municipio', 'estado',
  'id_representante', 'estatus_estudiante',
];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const EstudianteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const { page, limit, busqueda, year, section } = req.query;

    if (!page) {
      const result = await Estudiante.findAll({
        include: [{ model: Representante, as: 'representante' }],
      });
      res.json({ data: result });
      return;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (busqueda && String(busqueda).trim()) {
      const term = `%${String(busqueda).trim()}%`;
      where[Op.or] = [
        { nombre1: { [Op.iLike]: term } },
        { nombre2: { [Op.iLike]: term } },
        { apellido1: { [Op.iLike]: term } },
        { apellido2: { [Op.iLike]: term } },
        { cedula_escolar: { [Op.iLike]: term } },
      ];
    }

    const hasYearFilter = year && year !== 'Todos';
    const hasSectionFilter = section && section !== 'Todos';
    const hasAnyFilter = hasYearFilter || hasSectionFilter;

    const activePeriod = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    const activePeriodId = activePeriod?.get('id_periodo');

    const showAllPeriods = req.query.allPeriods === 'true';

    const matriculaWhere: any = {};
    if (activePeriodId && !showAllPeriods) matriculaWhere.id_periodo = activePeriodId;

    const seccionWhere: any = {};
    if (hasSectionFilter) seccionWhere.letra = String(section).trim();

    const gradoWhere: any = {};
    if (hasYearFilter) gradoWhere.numero = Number(year);

    let matchingEstudianteIds: number[] | null = null;

    // Always filter by active period students unless showAllPeriods is true
    if (!showAllPeriods && activePeriodId) {
      const mats = await Matricula.findAll({
        where: { id_periodo: activePeriodId },
        include: [{
          model: Seccion,
          as: 'seccion',
          required: true,
          where: Object.keys(seccionWhere).length ? seccionWhere : undefined,
          include: [{
            model: GradoAno,
            as: 'grado',
            required: true,
            where: Object.keys(gradoWhere).length ? gradoWhere : undefined,
          }],
        }],
      });
      matchingEstudianteIds = mats.map((m: any) => m.id_estudiante);
    } else if (hasAnyFilter) {
      // Consultamos desde Matricula para obtener IDs
      const mats = await Matricula.findAll({
        include: [{
          model: Seccion,
          as: 'seccion',
          required: true,
          where: Object.keys(seccionWhere).length ? seccionWhere : undefined,
          include: [{
            model: GradoAno,
            as: 'grado',
            required: true,
            where: Object.keys(gradoWhere).length ? gradoWhere : undefined,
          }],
        }],
      });
      matchingEstudianteIds = mats.map((m: any) => m.id_estudiante);
    }

    if (matchingEstudianteIds) {
      if (matchingEstudianteIds.length === 0) {
        res.json({
          data: [],
          meta: { total: 0, page: pageNum, limit: limitNum }
        });
        return;
      }
      where.id_estudiante = { [Op.in]: matchingEstudianteIds };
    }

    const { count, rows } = await Estudiante.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['apellido1', 'ASC'], ['apellido2', 'ASC'], ['nombre1', 'ASC']],
      distinct: true,
      include: [
        { model: Representante, as: 'representante' },
        {
          model: Matricula,
          as: 'matriculas',
          required: false,
          where: Object.keys(matriculaWhere).length ? matriculaWhere : undefined,
          include: [{
            model: Seccion,
            as: 'seccion',
            include: [{
              model: GradoAno,
              as: 'grado',
            }],
          }],
        },
      ],
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Estudiante.findByPk(id, {
      include: [{ model: Representante, as: 'representante' }],
    });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const now = new Date();
    const result = await Estudiante.create({
      ...pick(req.body, ALLOWED_ESTUDIANTE_FIELDS),
      created_at: now,
      updated_at: now,
    });
    const completo = await Estudiante.findByPk(result.get('id_estudiante') as number, {
      include: [{ model: Representante, as: 'representante' }],
    });
    getIO().emit('estudiante:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_ESTUDIANTE_FIELDS));
    const completo = await Estudiante.findByPk(id, {
      include: [{ model: Representante, as: 'representante' }],
    });
    getIO().emit('estudiante:update', { data: completo });
    res.json({ data: completo });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('estudiante:delete', { data: { id_estudiante: id } });
    res.status(204).send();
  }),
};
