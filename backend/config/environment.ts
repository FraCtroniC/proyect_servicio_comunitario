import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env en la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const environment = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
