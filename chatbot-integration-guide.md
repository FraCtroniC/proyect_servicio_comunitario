# Guía de Integración — Chatbot Flotante con Rol y Contexto del Sistema

## Visión General

Arquitectura: **Frontend React + Backend Express + Groq API (LLaMA)**


```
┌──────────────────────────────┐
│   Frontend (React + Vite)    │
│  ┌────────────────────────┐  │
│  │  ChatbotUniversitario  │  │
│  │  .jsx                  │  │
│  │  ┌──────┐ ┌──────────┐│  │
│  │  │Botón │ │ Ventana  ││  │
│  │  │flot. │ │ de chat  ││  │
│  │  └──────┘ └──────────┘│  │
│  └────────┬───────────────┘  │
│           │ POST /api/chatbot/consultar
│           │ { mensaje, roleId, nombre }
└───────────┼──────────────────┘
            │
┌───────────┼──────────────────┐
│ Backend (Express)           │
│  ┌────────┴───────────────┐ │
│  │ chatbotController.js   │ │
│  │  - system prompts x    │ │
│  │    cada rol            │ │
│  │  - llamarOpenAI() vía  │ │
│  │    https (Node nativo) │ │
│  │  - manejo errores      │ │
│  │    (429, 401, timeout) │ │
│  └────────┬───────────────┘ │
└───────────┼──────────────────┘
            │ POST /openai/v1/chat/completions
            │ Authorization: Bearer <key>
            │ model: llama-3.3-70b-versatile
┌───────────┼──────────────────┐
│  Groq API (api.groq.com)    │
│  (alternativa gratuita a    │
│   OpenAI, funciona en VE)   │
└─────────────────────────────┘
```

---

## 1. Backend — Configuración Inicial

### 1.1 Variable de entorno

Archivo `backend/.env`:

```env
OPENAI_API_KEY=gsk_tu_key_aqui
```

### 1.2 Validación con Joi (opcional pero recomendado)

En tu archivo de validación de entorno (ej. `backend/src/config/env.js`):

```js
OPENAI_API_KEY: Joi.string().allow('').default(''),
```

Y en las exportaciones:

```js
openaiApiKey: envVars.OPENAI_API_KEY,
```

Verifica que no esté vacía antes de usar:

```js
if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY no configurada');
}
```

---

## 2. Backend — Controlador del Chatbot

Archivo: `backend/src/controllers/chatbotController.js`

### 2.1 Importaciones y constantes

```js
const https = require('https');
const { openaiApiKey } = require('../config/env');
```

### 2.2 Reglas de formato (opcional — útil para respuestas limpias)

```js
const FORMAT_RULES = `
REGLAS DE FORMATO OBLIGATORIAS:
- Divide siempre tus respuestas en parrafos cortos separados por un doble salto de linea.
- Si explicas un proceso paso a paso, utiliza listas numeradas donde cada paso empiece obligatoriamente en una nueva linea.
- Si enumeras requisitos o campos, utiliza viñetas (-) donde cada elemento tenga su propia linea.
- PROHIBIDO amontonar o agrupar pasos o listas en un solo bloque denso de texto.`;
```

### 2.3 System Prompts por rol

Estructura:

```js
const SYSTEM_PROMPTS = {
  1: `Eres el asistente oficial del sistema. Tu funcion es orientar SOLO a ADMINISTRADORES.
[DESCRIPCION DEL SISTEMA PARA ADMIN]` + FORMAT_RULES,

  2: `Eres el asistente oficial del sistema. Tu funcion es orientar SOLO a USUARIOS REGULARES.
[DESCRIPCION DEL SISTEMA PARA USUARIO]` + FORMAT_RULES,
};
```

**Patrón para cada prompt:**
1. **Frase de rol**: "Eres el asistente oficial de [Sistema]. Tu función es orientar SOLO a [ROL]."
2. **Restricción de seguridad**: "Nunca menciones nombres de tablas, campos de base de datos, ni rutas de API. Usa siempre los mismos nombres que aparecen en la interfaz."
3. **Estructura del sistema**: Describe cada pantalla/sección con los labels exactos de la UI, los campos de formulario, los botones, y los pasos que el usuario debe seguir.
4. **Reglas de negocio**: Validaciones, límites, cálculos (ej: "máximo 24 créditos", "aprobado >= 10").
5. **Restricción final**: "No inventes procesos. Si la duda no aplica al rol, deniega amablemente."

### 2.4 Función para llamar a Groq (vía https nativo)

**NO uses `fetch`** — en algunos entornos Node.js da problemas de conectividad. Usa el módulo `https`.

```js
function llamarOpenAI(mensaje, systemPrompt) {
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
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
```

**Cambia estos valores según tu proveedor:**
- `hostname`: `'api.groq.com'` → para OpenAI es `'api.openai.com'`
- `path`: `'/openai/v1/chat/completions'` → igual para OpenAI
- `model`: `'llama-3.3-70b-versatile'` → para OpenAI usa `'gpt-4'` o `'gpt-3.5-turbo'`

### 2.5 Manejador del endpoint `/consultar`

```js
async function consultar(req, res) {
  try {
    const { mensaje, roleId, nombre } = req.body;

    // Validaciones
    if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
      return res.status(400).json({ error: 'El campo "mensaje" es requerido.' });
    }
    if (![1, 2, 3].includes(roleId)) {
      return res.status(400).json({ error: 'El campo "roleId" debe ser 1, 2 o 3.' });
    }
    if (!openaiApiKey) {
      return res.status(503).json({ error: 'API key no configurada.' });
    }

    // Inyectar nombre del usuario al system prompt
    const nombreUsuario = nombre?.trim() || 'Usuario';
    const systemPrompt = `${SYSTEM_PROMPTS[roleId]}\n\nEl usuario que te consulta se llama ${nombreUsuario}. Dirígete a el por su nombre cuando sea apropiado.`;

    const data = await llamarOpenAI(mensaje, systemPrompt);

    const textoRespuesta = data?.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';

    res.json({ respuesta: textoRespuesta });
  } catch (err) {
    console.error('Error del chatbot:', err.message);
    res.status(502).json({
      error: 'Error al comunicarse con la IA.',
      detalle: err.message,
    });
  }
}
```

### 2.6 Endpoint de prueba (opcional)

```js
function probar(req, res) {
  if (!openaiApiKey) {
    return res.json({ ok: false, error: 'API Key no configurada.' });
  }
  const keyPreview = openaiApiKey.slice(0, 7) + '...' + openaiApiKey.slice(-4);
  res.json({ ok: true, mensaje: 'API Key configurada', keyPreview, longitud: openaiApiKey.length });
}
```

### 2.7 Rutas

Archivo: `backend/src/routes/chatbotRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { consultar, probar } = require('../controllers/chatbotController');

router.get('/probar', probar);
router.post('/consultar', consultar);

module.exports = router;
```

Registrar en `routes/index.js`:

```js
router.use('/chatbot', chatbotRoutes);
```

---

## 3. Frontend — Componente del Chatbot

### 3.1 API Service

Usa el cliente HTTP de tu proyecto (axios, fetch, etc.). Ejemplo con axios:

Archivo: `frontend/src/services/api.js`

```js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para token JWT (opcional)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Error de red';
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.data = error.response?.data;
    return Promise.reject(normalizedError);
  }
);

export const http = {
  get(endpoint, config) { return api.get(endpoint, config).then(r => r.data); },
  post(endpoint, body, config) { return api.post(endpoint, body, config).then(r => r.data); },
};

export default http;
```

### 3.2 Componente ChatbotUniversitario

Archivo: `frontend/src/components/ChatbotUniversitario.jsx`

#### 3.2.1 Props que recibe

```jsx
export default function ChatbotUniversitario({ roleId = 3, userName = '' })
```

- `roleId` (number): 1, 2, 3… para identificar el rol del usuario.
- `userName` (string): nombre del usuario para personalizar saludos.

#### 3.2.2 Saludo personalizado por rol

```js
const getSaludo = (roleId, nombre) => ({
  1: `¡Bienvenido ${nombre} al asistente del sistema! ¿En que puedo ayudarte?`,
  2: `¡Bienvenido ${nombre} al asistente! ¿Necesitas ayuda con tus tareas?`,
  3: `¡Hola ${nombre}! Soy el asistente del sistema. ¿Que necesitas?`,
}[roleId]);
```

#### 3.2.3 Estados del componente

Tres estados clave:

| Estado | Qué se muestra |
|--------|---------------|
| **Cargando** (`cargando=true`) | Spinner animado + texto "Pensando..." |
| **Error** (catch del POST) | Mensaje de error del bot (`emisor: 'bot'`) |
| **Vacío/Inicial** | Solo el saludo del bot |

#### 3.2.4 Lógica de envío

```js
async function enviar() {
  const texto = input.trim();
  if (!texto || cargando) return;

  setInput('');
  setMensajes((prev) => [...prev, { emisor: 'usuario', texto }]);
  setCargando(true);

  try {
    const data = await http.post('/chatbot/consultar', {
      mensaje: texto,
      roleId,
      nombre: userName,
    });
    setMensajes((prev) => [...prev, { emisor: 'bot', texto: data.respuesta }]);
  } catch (err) {
    setMensajes((prev) => [...prev, {
      emisor: 'bot',
      texto: err?.data?.error || err?.message || 'Ocurrio un error al procesar tu consulta.',
    }]);
  } finally {
    setCargando(false);
  }
}
```

#### 3.2.5 Estructura visual

```
┌─────────────────────────────────┐
│ Botón flotante (esquina inf-der) │
│  56x56px, circular, gradiente    │
│  Icono: MessageCircle / X        │
└─────────────────────────────────┘

         Al hacer clic:

┌─────────────────────────────────┐
│  Header:                        │
│  ┌────┐  Asistente [Rol]        │
│  │ Bot│  ● En línea             │
│  └────┘  │ barra de color       │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────┐           │
│  │ Mensaje del bot   │ ←──      │
│  └──────────────────┘           │
│              ┌────────────────┐ │
│              │ Mensaje usuario│→│
│              └────────────────┘ │
│  ┌──────────────────┐           │
│  │ ⟳ Pensando...     │ ←──     │
│  └──────────────────┘           │
│                                 │
├─────────────────────────────────┤
│  [Input........................]│
│                             [▶] │
└─────────────────────────────────┘
```

#### 3.2.6 Estilos clave

- **Ventana**: `position: fixed; bottom: 92px; right: 24px; z-index: 9999`
- **Fondo**: vidrio esmerilado (`backdropFilter: blur(20px)`)
- **Mensajes usuario**: gradiente de acento, alineados a la derecha
- **Mensajes bot**: fondo oscuro sutil, alineados a la izquierda
- **Input**: oscuro con foco brillante
- **Animación de entrada**: fadeIn + slideUp (200ms)
- **Scrollbar**: delgada (4px), con glow al hover
- **Auto-focus** en el input al abrir el chat

#### 3.2.7 Animaciones CSS

```css
@keyframes chatbotFadeIn {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes chatbotSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

### 3.3 Integración en el Layout

Archivo: `frontend/src/components/layout/AppLayout.jsx`

```jsx
import ChatbotUniversitario from '../ChatbotUniversitario';

// Mapeo de roles (si aplica):
const ROLE_MAP = {
  Admin: 1,
  User: 2,
  Viewer: 3,
};

export default function AppLayout() {
  const { user } = useAuth(); // o como obtengas el usuario
  const roleId = ROLE_MAP[user?.role] || 3;

  return (
    <div className="app-container">
      {/* Sidebar, Navbar, contenido */}
      <ChatbotUniversitario roleId={roleId} userName={user?.name} />
    </div>
  );
}
```

---

## 4. Decisiones Técnicas y Justificación

| Decisión | Alternativa | Por qué |
|----------|-------------|---------|
| **Groq** en vez de OpenAI | OpenAI, Gemini | OpenAI bloqueado en Venezuela (403), Gemini excedió cuota gratis; Groq funciona sin tarjeta de crédito |
| **`https` nativo** en vez de `fetch` | `fetch` (Node.js) | Fetch daba problemas de conectividad intermitente en producción; `https` es más estable |
| **Frontend labels only** en prompts | Describir DB/API | Seguridad: si alguien le pregunta al chatbot con ingeniería social, no revela estructura interna |
| **System prompt estático + inyección** | Prompt dinámico completo | Performance: el prompt base se escribe una vez; solo se inyecta el nombre del usuario |
| **`whiteSpace: 'pre-line'`** en el chat | `dangerouslySetInnerHTML` | Las respuestas vienen con saltos de línea literales (\n). `pre-line` los respeta sin exponerse a XSS |

---

## 5. Flujo Completo (Paso a Paso)

```
1. Usuario hace clic en botón flotante
2. Se abre ventana del chat
   → useEffect: muestra saludo personalizado con el nombre del usuario
3. Usuario escribe consulta y presiona Enter
4. Frontend:
   a. Agrega mensaje del usuario al estado
   b. Muestra spinner "Pensando..."
   c. Hace POST /api/chatbot/consultar con { mensaje, roleId, nombre }
5. Backend:
   a. Valida mensaje, roleId y API key
   b. Construye system prompt: [prompt base del rol] + regla del nombre
   c. Envía a Groq via https (modelo llama-3.3-70b-versatile, temp 0.3)
   d. Retorna { respuesta: "texto" }
6. Frontend:
   a. Agrega respuesta del bot al estado
   b. Auto-scroll al último mensaje
   c. Input se limpia y queda listo para siguiente consulta
7. Si hay error en cualquier paso:
   → Se muestra mensaje de error como si fuera respuesta del bot
```

---

## 6. Manejo de Errores

| Error | Código HTTP | Causa | Mensaje al usuario |
|-------|-------------|-------|-------------------|
| API key inválida | 401 | `OPENAI_API_KEY` incorrecta | "API key invalida. Verifica tu configuracion." |
| Cuota excedida | 429 | Límite del plan gratuito | "Cuota de API excedida. Revisa tu plan." |
| Timeout | 502 | API no responde en 30s | "Timeout al conectar con el servicio de IA." |
| Red | 502 | Sin internet / DNS | "Error de red: ..." |
| Mensaje vacío | 400 | `mensaje` ausente o vacío | "El campo mensaje es requerido." |
| roleId inválido | 400 | No es 1, 2 o 3 | "El campo roleId debe ser 1, 2 o 3." |

---

## 7. Personalización para Otros Proyectos

### 7.1 Lo que cambia siempre

- **`SYSTEM_PROMPTS`**: descripción de tu sistema, roles, reglas de negocio
- **`ROLE_MAP`**: cómo se mapean los roles de tu auth al chatbot
- **`getSaludo`**: los textos de bienvenida según el rol
- **`ROLE_LABELS`**: el nombre que aparece en el header del chat

### 7.2 Lo que se reusa sin cambios

- Componente `ChatbotUniversitario.jsx` (estructura, lógica, estilos)
- `llamarOpenAI()` (solo cambiar `hostname` si usas otro proveedor)
- Manejador `consultar` (validaciones, inyección de nombre, respuesta)
- Rutas y registro
- Validación de entorno

### 7.3 Para cambiar de proveedor de IA

| Proveedor | hostname | path | model |
|-----------|----------|------|-------|
| **Groq** | `api.groq.com` | `/openai/v1/chat/completions` | `llama-3.3-70b-versatile` |
| **OpenAI** | `api.openai.com` | `/v1/chat/completions` | `gpt-3.5-turbo` o `gpt-4` |
| **Gemini** | `generativelanguage.googleapis.com` | `/v1/models/gemini-2.0-flash:generateContent` | — |

---

## 8. Checklist de Implementación

- [ ] Agregar `OPENAI_API_KEY` al `.env`
- [ ] Validar y exportar la key en `env.js`
- [ ] Crear `chatbotController.js` con system prompts, `llamarOpenAI()`, `consultar()`, `probar()`
- [ ] Crear `chatbotRoutes.js` con GET `/probar` y POST `/consultar`
- [ ] Registrar rutas en `routes/index.js`
- [ ] Probar con `curl` o Postman: `GET /api/chatbot/probar`
- [ ] Crear `ChatbotUniversitario.jsx` con botón flotante, ventana, estados
- [ ] Integrar en `AppLayout.jsx` pasando `roleId` y `userName`
- [ ] Verificar que los system prompts usan **solo labels de la UI**, no DB/API
- [ ] Probar flujo completo: abrir → saludar por nombre → consultar → recibir respuesta
- [ ] Probar errores: enviar vacío, sin API key, sin conexión
