import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot.controller';

export const chatbotRoutes = Router();

chatbotRoutes.get('/probar', ChatbotController.probar);
chatbotRoutes.post('/consultar', ChatbotController.consultar);
