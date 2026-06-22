import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const systemRoutes = Router();

// Only super_admin (role 1) can trigger a backup
systemRoutes.get('/backup', authorize(1), SystemController.backup);
