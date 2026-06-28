import { Request, Response } from 'express';
import { HistoricoNotaCertificada } from '../models/HistoricoNotaCertificada';
import { Estudiante } from '../models/Estudiante';
import { wrapAsync } from '../shared/utils/wrapAsync';
import ExcelJS from 'exceljs';
import path from 'path';

export const HistoricoNotaCertificadaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await HistoricoNotaCertificada.findAll();
    res.json({ data: result });
  }),

  generarExcel: wrapAsync(async (req: Request, res: Response) => {
    const estudianteId = Number(req.params.id);
    const estudiante = await Estudiante.findByPk(estudianteId);
    
    if (!estudiante) {
      res.status(404).json({ error: { message: 'Estudiante no encontrado' } });
      return;
    }

    // Default template (se puede hacer dinámico según el plan de estudio)
    const templatePath = path.join(__dirname, '../../src/templates/MODELO NOTAS CERTIFICADAS PLAN ESTUDIO 31059.xlsx');
    
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(templatePath);
    } catch (err) {
      res.status(500).json({ error: { message: 'Error al leer la plantilla de notas certificadas' } });
      return;
    }
    
    // const worksheet = workbook.worksheets[0];
    
    // TODO: Rellenar datos del estudiante. Ejemplo:
    // worksheet.getCell('B4').value = `${estudiante.nombre1} ${estudiante.apellido1}`;
    
    // Obtener las notas
    // const notas = await HistoricoNotaCertificada.findAll({
    //   where: { id_estudiante: estudianteId },
    //   include: ['asignatura', 'periodo', 'escala']
    // });
    
    // TODO: Lógica para iterar sobre las notas y rellenar las filas correspondientes
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Notas_Certificadas_${estudiante.cedula_escolar}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await HistoricoNotaCertificada.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await HistoricoNotaCertificada.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HistoricoNotaCertificada.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HistoricoNotaCertificada.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
