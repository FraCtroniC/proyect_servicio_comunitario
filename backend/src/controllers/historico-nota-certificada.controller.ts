import { Request, Response } from 'express';
import { HistoricoNotaCertificada } from '../models/HistoricoNotaCertificada';
import { Estudiante } from '../models/Estudiante';
import { Asignatura } from '../models/Asignatura';
import { GradoAno } from '../models/GradoAno';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { EscalaCalificacion } from '../models/EscalaCalificacion';
import { wrapAsync } from '../shared/utils/wrapAsync';
import ExcelJS from 'exceljs';
import path from 'path';

export const HistoricoNotaCertificadaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await HistoricoNotaCertificada.findAll({
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: GradoAno, as: 'grado' },
        { model: PeriodoEscolar, as: 'periodo' },
        { model: EscalaCalificacion, as: 'escala' },
      ],
    });
    res.json({ data: result });
  }),

  listarPorEstudiante: wrapAsync(async (req: Request, res: Response) => {
    const estudianteId = Number(req.params.estudianteId);

    const estudiante = await Estudiante.findByPk(estudianteId);
    if (!estudiante) {
      res.status(404).json({ error: { message: 'Estudiante no encontrado' } });
      return;
    }

    const notas = await HistoricoNotaCertificada.findAll({
      where: { id_estudiante: estudianteId },
      include: [
        { model: Asignatura, as: 'asignatura', attributes: ['id_asignatura', 'nombre', 'tipo_calificacion'] },
        { model: GradoAno, as: 'grado', attributes: ['id_grado', 'numero', 'nombre'] },
        { model: PeriodoEscolar, as: 'periodo', attributes: ['id_periodo', 'nombre', 'estatus'] },
        { model: EscalaCalificacion, as: 'escala', attributes: ['id_escala', 'nota_impresa', 'nota_literal', 'nota_calculo', 'ponderacion_letra'] },
      ],
      order: [['id_grado', 'ASC'], ['id_asignatura', 'ASC']],
    });

    res.json({
      data: notas,
      estudiante: {
        id_estudiante: estudiante.id_estudiante,
        cedula_escolar: estudiante.cedula_escolar,
        nombre: `${estudiante.nombre1}${estudiante.nombre2 ? ' ' + estudiante.nombre2 : ''} ${estudiante.apellido1}${estudiante.apellido2 ? ' ' + estudiante.apellido2 : ''}`,
      },
    });
  }),

  crearBulk: wrapAsync(async (req: Request, res: Response) => {
    const { notas } = req.body;

    if (!Array.isArray(notas) || notas.length === 0) {
      res.status(400).json({ error: { message: 'Se requiere un array "notas" con al menos un elemento.' } });
      return;
    }

    // Validate each entry
    for (const nota of notas) {
      if (!nota.id_estudiante || !nota.id_grado || !nota.id_asignatura || !nota.id_periodo || !nota.id_escala) {
        res.status(400).json({
          error: { message: 'Cada nota debe tener: id_estudiante, id_grado, id_asignatura, id_periodo, id_escala' },
        });
        return;
      }
    }

    // Check for duplicates in database
    const duplicateChecks = notas.map((n: any) => ({
      id_estudiante: n.id_estudiante,
      id_grado: n.id_grado,
      id_asignatura: n.id_asignatura,
      id_periodo: n.id_periodo,
    }));

    const { Op } = require('sequelize');
    const existing = await HistoricoNotaCertificada.findAll({
      where: {
        [Op.or]: duplicateChecks,
      },
    });

    if (existing.length > 0) {
      // Get names for better error message
      const existingWithNames = await Promise.all(
        existing.map(async (e: any) => {
          const asig = await Asignatura.findByPk(e.id_asignatura);
          const grado = await GradoAno.findByPk(e.id_grado);
          return `${asig?.nombre || 'Asignatura'} (${grado?.numero || e.id_grado}° Año)`;
        })
      );

      res.status(409).json({
        error: {
          message: `Ya existen notas certificadas para: ${existingWithNames.join(', ')}. Elimine los registros existentes primero o actualícelos individualmente.`,
        },
      });
      return;
    }

    // Build records with default institution
    const records = notas.map((n: any) => ({
      id_estudiante: n.id_estudiante,
      id_grado: n.id_grado,
      id_asignatura: n.id_asignatura,
      id_periodo: n.id_periodo,
      id_escala: n.id_escala,
      institucion_origen: n.institucion_origen || 'L.N. Estilita Orozco',
    }));

    const created = await HistoricoNotaCertificada.bulkCreate(records);
    res.status(201).json({ data: created });
  }),

  generarExcel: wrapAsync(async (req: Request, res: Response) => {
    const estudianteId = Number(req.params.id);
    const planCode = (req.query.plan as string) || '31059';

    const estudiante = await Estudiante.findByPk(estudianteId);
    if (!estudiante) {
      res.status(404).json({ error: { message: 'Estudiante no encontrado' } });
      return;
    }

    // Select template based on plan code
    const templateName = planCode === '31059'
      ? 'MODELO NOTAS CERTIFICADAS PLAN ESTUDIO 31059.xlsx'
      : 'MODELO NOTAS CERTIFICADAS PLAN ESTUDIO 32011, 31018.xlsx';

    const templatePath = path.join(__dirname, '../../src/templates/', templateName);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(templatePath);
    } catch (err) {
      console.error('Error al leer plantilla:', err);
      res.status(500).json({ error: { message: `Error al leer la plantilla de notas certificadas (${templateName})` } });
      return;
    }

    // Get all certified grades for this student with full details
    const notas = await HistoricoNotaCertificada.findAll({
      where: { id_estudiante: estudianteId },
      include: [
        { model: Asignatura, as: 'asignatura', attributes: ['id_asignatura', 'nombre', 'tipo_calificacion'] },
        { model: GradoAno, as: 'grado', attributes: ['id_grado', 'numero', 'nombre'] },
        { model: PeriodoEscolar, as: 'periodo', attributes: ['id_periodo', 'nombre'] },
        { model: EscalaCalificacion, as: 'escala', attributes: ['id_escala', 'nota_impresa', 'nota_literal', 'nota_calculo', 'ponderacion_letra'] },
      ],
      order: [['id_grado', 'ASC'], ['id_asignatura', 'ASC']],
    });

    // Group notes by grade for easy access
    const notasByGrado: Record<number, any[]> = {};
    for (const nota of notas) {
      const gradoNum = (nota as any).grado?.numero || (nota as any).id_grado;
      if (!notasByGrado[gradoNum]) notasByGrado[gradoNum] = [];
      notasByGrado[gradoNum].push(nota);
    }

    // Try to fill in student data in each worksheet
    // The template structure varies, so we attempt common cell positions
    for (const worksheet of workbook.worksheets) {
      // Attempt to fill student identification fields
      // These are common positions in MPPE templates — adjustments may be needed per template
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          const val = cell.value?.toString() || '';
          // Replace placeholder patterns
          if (val.includes('APELLIDOS Y NOMBRES') || val.includes('NOMBRE DEL ESTUDIANTE')) {
            cell.value = `${estudiante.apellido1}${estudiante.apellido2 ? ' ' + estudiante.apellido2 : ''}, ${estudiante.nombre1}${estudiante.nombre2 ? ' ' + estudiante.nombre2 : ''}`;
          }
          if (val.includes('CEDULA') || val.includes('C.I.') || val.includes('CÉDULA')) {
            cell.value = estudiante.cedula_escolar;
          }
          if (val.includes('FECHA DE NACIMIENTO') || val.includes('FECHA NAC')) {
            cell.value = estudiante.fecha_nac ? new Date(estudiante.fecha_nac).toLocaleDateString('es-VE') : '';
          }
          if (val.includes('LUGAR DE NACIMIENTO') || val.includes('LUGAR NAC')) {
            cell.value = estudiante.lugar_nac || '';
          }
          if (val.includes('ESTADO') && !val.includes('ESTATUS')) {
            cell.value = estudiante.estado || '';
          }
          if (val.includes('MUNICIPIO')) {
            cell.value = estudiante.municipio || '';
          }
        });
      });
    }

    // Set response headers for Excel download
    const safeCedula = (estudiante.cedula_escolar || 'sin_cedula').replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Notas_Certificadas_${safeCedula}_Plan_${planCode}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await HistoricoNotaCertificada.findByPk(id, {
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: GradoAno, as: 'grado' },
        { model: PeriodoEscolar, as: 'periodo' },
        { model: EscalaCalificacion, as: 'escala' },
      ],
    });
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
