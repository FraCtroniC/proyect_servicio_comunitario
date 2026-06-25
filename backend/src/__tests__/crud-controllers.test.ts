import { describe, it, expect, vi } from 'vitest';

vi.mock('../models/Asignatura', () => ({ Asignatura: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/Aula', () => ({ Aula: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/PeriodoEscolar', () => ({ PeriodoEscolar: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/GradoAno', () => ({ GradoAno: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/Representante', () => ({ Representante: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));

vi.mock('../models/Momento', () => ({ Momento: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/EscalaCalificacion', () => ({ EscalaCalificacion: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/DiaSemana', () => ({ DiaSemana: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/BloqueHorario', () => ({ BloqueHorario: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));
vi.mock('../models/Justificacion', () => ({ Justificacion: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() } }));

function testCrud(ctrlPath: string, modelPath: string, modelName: string, ctrlName: string) {
  describe(ctrlName, () => {
    it('listar retorna todos', async () => {
      const mod: any = await import(modelPath);
      mod[modelName].findAll.mockResolvedValue([{ id: 1 }]);
      const ctrl: any = await import(ctrlPath);
      const res = { json: vi.fn() } as any;
      await ctrl[ctrlName].listar({} as any, res, vi.fn());
      expect(res.json).toHaveBeenCalled();
    });
    it('obtenerPorId retorna 404', async () => {
      const mod: any = await import(modelPath);
      mod[modelName].findByPk.mockResolvedValue(null);
      const ctrl: any = await import(ctrlPath);
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      await ctrl[ctrlName].obtenerPorId({ params: { id: '999' } } as any, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('crear retorna 201', async () => {
      const mod: any = await import(modelPath);
      mod[modelName].create.mockResolvedValue({ id: 1 });
      const ctrl: any = await import(ctrlPath);
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      await ctrl[ctrlName].crear({ body: {} } as any, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(201);
    });
    it('actualizar retorna 404', async () => {
      const mod: any = await import(modelPath);
      mod[modelName].findByPk.mockResolvedValue(null);
      const ctrl: any = await import(ctrlPath);
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      await ctrl[ctrlName].actualizar({ params: { id: '999' }, body: {} } as any, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('eliminar retorna 204', async () => {
      const mod: any = await import(modelPath);
      let destroyed = false;
      mod[modelName].findByPk.mockResolvedValue({ id: 1, destroy: vi.fn(() => { destroyed = true; }) });
      const ctrl: any = await import(ctrlPath);
      const res = { status: vi.fn((c: number) => res), send: vi.fn() } as any;
      await ctrl[ctrlName].eliminar({ params: { id: '1' } } as any, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(204);
      expect(destroyed).toBe(true);
    });
  });
}

testCrud('../controllers/asignatura.controller', '../models/Asignatura', 'Asignatura', 'AsignaturaController');
testCrud('../controllers/aula.controller', '../models/Aula', 'Aula', 'AulaController');
testCrud('../controllers/periodo-escolar.controller', '../models/PeriodoEscolar', 'PeriodoEscolar', 'PeriodoEscolarController');
testCrud('../controllers/grado-ano.controller', '../models/GradoAno', 'GradoAno', 'GradoAnoController');
testCrud('../controllers/representante.controller', '../models/Representante', 'Representante', 'RepresentanteController');
testCrud('../controllers/momento.controller', '../models/Momento', 'Momento', 'MomentoController');
testCrud('../controllers/escala-calificacion.controller', '../models/EscalaCalificacion', 'EscalaCalificacion', 'EscalaCalificacionController');
testCrud('../controllers/dia-semana.controller', '../models/DiaSemana', 'DiaSemana', 'DiaSemanaController');
testCrud('../controllers/bloque-horario.controller', '../models/BloqueHorario', 'BloqueHorario', 'BloqueHorarioController');
testCrud('../controllers/justificacion.controller', '../models/Justificacion', 'Justificacion', 'JustificacionController');
