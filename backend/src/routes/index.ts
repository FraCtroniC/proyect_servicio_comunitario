import { Router } from 'express';
import { usuarioRoutes } from './usuario.routes';

export const routes = Router();

routes.use('/usuarios', usuarioRoutes);
