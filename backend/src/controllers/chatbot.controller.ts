import { Request, Response } from 'express';
import https from 'https';
import { environment } from '../../config/environment';
import { SYSTEM_PROMPTS } from '../../config/chatbot-prompts';

function callGroqAPI(mensaje: string, systemPrompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: mensaje },
      ],
      temperature: 0.3,
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST' as const,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${environment.openaiApiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk: string) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Error parseando respuesta: ' + data.slice(0, 200)));
          }
        } else if (res.statusCode === 429) {
          reject(new Error('Cuota de API excedida. Revisa tu plan.'));
        } else if (res.statusCode === 401) {
          reject(new Error('API key invalida. Verifica tu OPENAI_API_KEY en .env'));
        } else {
          reject(new Error('API respondio con status ' + res.statusCode));
        }
      });
    });

    req.on('error', (err) => reject(new Error('Error de red: ' + err.message)));
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout al conectar con la API')); });

    req.write(body);
    req.end();
  });
}

export const ChatbotController = {
  async consultar(req: Request, res: Response) {
    try {
      const { mensaje, roleId, nombre } = req.body;

      if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
        return res.status(400).json({ error: 'El campo "mensaje" es requerido.' });
      }
      if (![1, 2, 3].includes(roleId)) {
        return res.status(400).json({ error: 'El campo "roleId" debe ser 1, 2 o 3.' });
      }
      if (!environment.openaiApiKey) {
        return res.status(503).json({ error: 'API key no configurada.' });
      }

      const nombreUsuario = nombre?.trim() || 'Usuario';
      const systemPrompt = `${SYSTEM_PROMPTS[roleId]}\n\nEl usuario que te consulta se llama ${nombreUsuario}. Dirígete a el por su nombre cuando sea apropiado.`;

      const data = await callGroqAPI(mensaje, systemPrompt);
      const textoRespuesta = data?.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';

      res.json({ respuesta: textoRespuesta });
    } catch (err: any) {
      console.error('Error del chatbot:', err.message);
      res.status(502).json({
        error: 'Error al comunicarse con la IA.',
        detalle: err.message,
      });
    }
  },

  probar(req: Request, res: Response) {
    if (!environment.openaiApiKey) {
      return res.json({ ok: false, error: 'API Key no configurada.' });
    }
    const keyPreview = environment.openaiApiKey.slice(0, 7) + '...' + environment.openaiApiKey.slice(-4);
    res.json({ ok: true, mensaje: 'API Key configurada', keyPreview, longitud: environment.openaiApiKey.length });
  },
};
