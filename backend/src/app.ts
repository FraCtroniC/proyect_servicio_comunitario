import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { environment } from '../config/environment';


const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: environment.frontendUrl || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

export default app;
