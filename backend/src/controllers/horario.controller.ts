import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  HorarioDocente, Asignatura, Seccion, GradoAno,
  DiaSemana, BloqueHorario, Aula, PeriodoEscolar,
  Usuario, Matricula, Estudiante
} from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const DIAS_MAP: Record<string, number> = {
  'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5,
  'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5,
};

function diaDeLaSemana(y: number, m: number, d: number): string {
  const nombres = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  if (m < 3) y--;
  return nombres[(y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[m - 1] + d) % 7];
}

export const HorarioController = {
  miHorario: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const fecha = String(req.query.fecha || new Date().toISOString().split('T')[0]);

    const usuario = await Usuario.findByPk(req.user!.idUsuario);

    if (!usuario) {
      res.status(400).json({ error: { message: 'Usuario no encontrado' } });
      return;
    }

    const [y, m, d] = fecha.split('-').map(Number);
    const diaSemana = diaDeLaSemana(y, m, d);
    const idDia = DIAS_MAP[diaSemana];
    if (!idDia) {
      res.json({ data: [], meta: { message: 'La fecha no corresponde a un día de clase (Lunes a Viernes)' } });
      return;
    }

    const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    if (!periodoActivo) {
      res.status(400).json({ error: { message: 'No hay un período escolar activo' } });
      return;
    }

    const horarios = await HorarioDocente.findAll({
      where: {
        id_docente: usuario.id_usuario,
        id_dia: idDia,
        id_periodo: periodoActivo.id_periodo,
      },
      include: [
        { model: Asignatura, as: 'asignatura' },
        {
          model: Seccion, as: 'seccion',
          include: [{ model: GradoAno, as: 'grado' }]
        },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' },
        { model: Usuario, as: 'docente' },
      ],
      order: [
        [{ model: BloqueHorario, as: 'bloque' }, 'numero_bloque', 'ASC']
      ]
    });

    const horariosConEstudiantes = await Promise.all(
      horarios.map(async (h) => {
        const estudiantes = await Matricula.findAll({
          where: {
            id_seccion: h.id_seccion,
            id_periodo: periodoActivo.id_periodo,
          },
          include: [
            {
              model: Estudiante, as: 'estudiante',
              where: { estatus_estudiante: 'Activo' },
            }
          ],
          attributes: ['id_matricula', 'id_estudiante'],
        });

        return {
          ...h.toJSON(),
          estudiantes: estudiantes.map((m: any) => {
            const e = m.estudiante;
            return {
              id_matricula: m.id_matricula,
              id_estudiante: m.id_estudiante,
              nombre: e
                ? `${e.apellido1 || ''} ${e.apellido2 || ''}, ${e.nombre1 || ''} ${e.nombre2 || ''}`.trim().replace(/^, /, '')
                : '',
              cedula: e?.cedula_escolar || '',
            };
          }),
        };
      })
    );

    res.json({
      data: horariosConEstudiantes,
      meta: {
        docente: `${usuario.nombre1 || ''} ${usuario.apellido1 || ''}`.trim(),
        fecha,
        dia: diaSemana,
        total_horarios: horariosConEstudiantes.length,
      }
    });
  }),

  listarDisponibles: wrapAsync(async (req: Request, res: Response) => {
    const { id_docente, fecha } = req.query;
    const filterDate = String(fecha || new Date().toISOString().split('T')[0]);

    const diaSemana = new Date(filterDate).toLocaleDateString('en-US', { weekday: 'long' });
    const idDia = DIAS_MAP[diaSemana];

    const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });

    const where: any = { id_dia: idDia };
    if (id_docente) where.id_docente = Number(id_docente);
    if (periodoActivo) where.id_periodo = periodoActivo.id_periodo;

    const horarios = await HorarioDocente.findAll({
      where,
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' },
        { model: Usuario, as: 'docente' },
      ],
      order: [
        [{ model: BloqueHorario, as: 'bloque' }, 'numero_bloque', 'ASC']
      ]
    });

    res.json({ data: horarios });
  }),
};
