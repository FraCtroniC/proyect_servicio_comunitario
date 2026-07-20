import { Request, Response } from 'express';
import { FormatoSabana } from '../models/FormatoSabana';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const FormatoSabanaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const formatos = await FormatoSabana.findAll({
      order: [['es_activo', 'DESC'], ['fecha_creacion', 'DESC']],
    });
    res.json({ data: formatos });
  }),

  obtenerActivo: wrapAsync(async (_req: Request, res: Response) => {
    const formato = await FormatoSabana.findOne({
      where: { es_activo: true },
    });
    if (!formato) {
      res.status(404).json({ error: { message: 'No hay formato activo configurado' } });
      return;
    }
    res.json({ data: formato });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const formato = await FormatoSabana.findByPk(id);
    if (!formato) {
      res.status(404).json({ error: { message: 'Formato no encontrado' } });
      return;
    }
    res.json({ data: formato });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { nombre_formato, configuracion, imagen_referencia, es_activo } = req.body;

    if (!nombre_formato || !configuracion) {
      res.status(400).json({
        error: { message: 'Se requiere nombre_formato y configuracion' },
      });
      return;
    }

    const userId = (req as any).user?.id_usuario || (req as any).user?.id || null;
    const activar = es_activo !== undefined ? es_activo : true;

    // Si este formato se va a activar, desactivar todos los demás primero
    if (activar) {
      await FormatoSabana.update({ es_activo: false }, { where: {} });
    }

    const formato = await FormatoSabana.create({
      nombre_formato,
      configuracion,
      imagen_referencia: imagen_referencia || null,
      es_activo: activar,
      creado_por: userId,
    });

    res.status(201).json({ data: formato });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const formato = await FormatoSabana.findByPk(id);

    if (!formato) {
      res.status(404).json({ error: { message: 'Formato no encontrado' } });
      return;
    }

    const { nombre_formato, configuracion, imagen_referencia, es_activo } = req.body;

    // Si se está activando este formato, desactivar todos los demás primero
    if (es_activo === true && !formato.es_activo) {
      await FormatoSabana.update({ es_activo: false }, { where: {} });
    }

    await formato.update({
      ...(nombre_formato !== undefined && { nombre_formato }),
      ...(configuracion !== undefined && { configuracion }),
      ...(imagen_referencia !== undefined && { imagen_referencia }),
      ...(es_activo !== undefined && { es_activo }),
    });

    res.json({ data: formato });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const formato = await FormatoSabana.findByPk(id);

    if (!formato) {
      res.status(404).json({ error: { message: 'Formato no encontrado' } });
      return;
    }

    if (formato.es_activo) {
      res.status(400).json({
        error: { message: 'No se puede eliminar el formato activo. Active otro formato primero.' },
      });
      return;
    }

    await formato.destroy();
    res.json({ message: 'Formato eliminado correctamente' });
  }),

  activar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const formato = await FormatoSabana.findByPk(id);

    if (!formato) {
      res.status(404).json({ error: { message: 'Formato no encontrado' } });
      return;
    }

    // Desactivar TODOS los formatos primero, luego activar el seleccionado
    await FormatoSabana.update({ es_activo: false }, { where: {} });
    await formato.update({ es_activo: true });

    res.json({ data: formato, message: 'Formato activado correctamente' });
  }),
};
