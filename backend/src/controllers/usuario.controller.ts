import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const ALLOWED_CREATE_FIELDS = [
  'idRol', 'username', 'password',
  'cedula', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'correo', 'telefono',
  'fecha_nac', 'id_especialidad',
];
const ALLOWED_UPDATE_FIELDS = [
  'idRol', 'username', 'password', 'estatus',
  'cedula', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'correo', 'telefono',
  'fecha_nac', 'id_especialidad',
];



function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const UsuarioController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const usuarios = await UsuarioService.listar();
    res.json({ data: usuarios });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuario = await UsuarioService.obtenerPorId(id);
    res.json({ data: usuario });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const dto = pick(req.body, ALLOWED_CREATE_FIELDS);
    const usuario = await UsuarioService.crear(dto);
    getIO().emit('usuario:create', { data: usuario });
    res.status(201).json({ data: usuario });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const currentUserId = req.user?.idUsuario;
    const usuario = await UsuarioService.actualizar(id, pick(req.body, ALLOWED_UPDATE_FIELDS), currentUserId);
    getIO().emit('usuario:update', { data: usuario });
    res.json({ data: usuario });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await UsuarioService.eliminar(id);
    getIO().emit('usuario:delete', { data: { id_usuario: id } });
    res.status(204).send();
  }),
};
