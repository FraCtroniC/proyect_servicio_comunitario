import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { environment } from '../config/environment';
import { apiLimiter } from './middlewares/rateLimiter';

const app = express();

app.use(helmet());
app.use(cors({
  origin: environment.frontendUrl || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

app.use('/api', apiLimiter, routes);

app.use(errorHandler);

export default app;
