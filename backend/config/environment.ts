import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env en la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const environment = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_replace_in_production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },
};
