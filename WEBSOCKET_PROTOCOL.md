# Protocolo WebSocket — Sincronización en Tiempo Real

> **Propósito:** Guía completa para que cualquier agente o desarrollador conecte un módulo al sistema de WebSocket sin cometer los mismos errores que ya se resolvieron.

---

## Tabla de Contenidos

1. [Arquitectura General](#1-arquitectura-general)
2. [Componentes Existentes](#2-componentes-existentes)
3. [Cómo Conectar un Nuevo Módulo](#3-cómo-conectar-un-nuevo-módulo)
4. [Pitfalls Críticos (Lo Que Nos Costó)](#4-pitfalls-críticos-lo-que-nos-costó)
5. [Convenciones de Nombres](#5-convenciones-de-nombres)
6. [Extender a Otros Módulos — Ejemplo Concreto](#6-extender-a-otros-módulos--ejemplo-concreto)
7. [Cómo Depurar](#7-cómo-depurar)
8. [Limitaciones Conocidas](#8-limitaciones-conocidas)

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE DATOS                              │
│                                                                     │
│  Usuario A (Pestaña 1)                                              │
│       │                                                             │
│       ▼                                                             │
│  POST/PATCH/DELETE  ──►  Express Controller                         │
│                               │                                     │
│                               ▼                                     │
│                         Guarda en DB (Sequelize)                    │
│                               │                                     │
│                               ▼                                     │
│                     getIO().emit('entidad:acción', data)            │
│                               │                                     │
│                               ▼                                     │
│                     Socket.io Server (socket.ts)                    │
│                               │                                     │
│                  ┌────────────┼────────────┐                        │
│                  ▼            ▼            ▼                        │
│           Pestaña 1    Pestaña 2    Pestaña N                       │
│           (Usuario A)  (Usuario B)  (Usuario N)                     │
│                  │            │            │                        │
│                  ▼            ▼            ▼                        │
│           useSocket     useSocket     useSocket                     │
│                  │            │            │                        │
│                  ▼            ▼            ▼                        │
│            setPeriods   setPeriods   setPeriods                     │
│            setState     setState     setState                      │
│                  │            │            │                        │
│                  ▼            ▼            ▼                        │
│             UI se actualiza automáticamente                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Principio fundamental:** El CRUD sigue siendo REST. El WebSocket solo **notifica**. No se cambia la lógica de negocio.

---

## 2. Componentes Existentes

### 2.1 Backend

#### `backend/src/socket.ts` — Servidor Socket.IO

```typescript
// Punto de entrada: initSocket(httpServer) y getIO()
// - Crea el servidor Socket.IO pegado al HTTP server
// - Configura CORS con environment.frontendUrl
// - Middleware JWT que prueba TODOS los secrets (principal + legados)
// - Función verifyToken() alineada con auth.middleware.ts
// - Log de conexiones/desconexiones en consola del backend
```

**Exporta:**
- `initSocket(httpServer: HttpServer): Server` — Solo se llama UNA VEZ en `server.ts`
- `getIO(): Server` — Se llama desde CUALQUIER controller para emitir eventos

#### `backend/src/server.ts` — Arranque del servidor

```typescript
// Líneas clave:
const httpServer = createServer(app);  // ← NO usar app.listen() directamente
initSocket(httpServer);                // ← ANTES de httpServer.listen()
httpServer.listen(environment.port, () => { ... });
```

**REGLA:** Si ves `app.listen()` en `server.ts`, está MAL. Debe ser `createServer(app)` + `initSocket()` + `httpServer.listen()`.

#### `backend/src/controllers/*.controller.ts` — Emisión de eventos

Cada controller que necesita real-time importa `getIO` y emite después de cada mutación:

```typescript
import { getIO } from '../socket';

// En crear():
const result = await Model.create(data);
getIO().emit('entidad:create', { data: result });

// En actualizar():
await record.update(data);
getIO().emit('entidad:update', { data: record });

// En eliminar():
await record.destroy();
getIO().emit('entidad:delete', { data: { id_entidad: id } });
```

### 2.2 Frontend

#### `frontend/src/hooks/useSocket.ts` — Hook de conexión

```typescript
// Firma: useSocket(isLoggedIn: boolean, onEvent: (event, data) => void)
//
// FLUJO:
// 1. Espera a que isLoggedIn sea true (SI NO, NO CONECTA)
// 2. Lee el token de sessionStorage (campo "sessionToken")
// 3. Crea conexión io('/') con auth: { token }
// 4. Registra listeners para cada evento del módulo
// 5. En cleanup: socket.disconnect()
//
// IMPORTANTE: El hook usa [isLoggedIn] como dependencia del useEffect.
# Esto significa que se RE-EJECUTA (desconecta + reconecta) cada vez
# que isLoggedIn cambia. Si el usuario hace login DESPUÉS del mount,
# el socket se conecta automáticamente.
```

#### `frontend/vite.config.ts` — Proxy WebSocket

```typescript
proxy: {
  '/api': { target: 'http://localhost:3000', changeOrigin: true, secure: false },
  '/socket.io': { target: 'http://localhost:3000', ws: true },  // ← ESTO ES CLAVE
}
```

**SIN** `ws: true`, las conexiones WebSocket no se transmiten al backend en desarrollo.

#### `frontend/src/App.tsx` — Integración del hook

```typescript
// Línea de import:
import { useSocket } from './hooks/useSocket';

// Llamada al hook (después de los state, antes de handleLogin):
useSocket(isLoggedIn, (event, payload) => {
  if (event === 'entidad:create') {
    setEntidades(prev => [...prev, mapper(payload.data)]);
  } else if (event === 'entidad:update') {
    setEntidades(prev => prev.map(e =>
      e.id === String(payload.data.id_entidad) ? mapper(payload.data) : e
    ));
  } else if (event === 'entidad:delete') {
    setEntidades(prev => prev.filter(e =>
      e.id !== String(payload.data.id_entidad)
    ));
  }
});
```

---

## 3. Cómo Conectar un Nuevo Módulo

### Checklist (5 pasos)

#### Paso 1: Backend — Emitir eventos en el controller

Abre el controller del módulo (ej: `estudiante.controller.ts`).

Agrega el import:
```typescript
import { getIO } from '../socket';
```

Después de CADA operación de escritura (create, update, delete), agrega el emit:

```typescript
// En crear():
const result = await Estudiante.create(req.body);
getIO().emit('estudiante:create', { data: result });
res.status(201).json({ data: result });

// En actualizar():
await record.update(req.body);
getIO().emit('estudiante:update', { data: record });
res.json({ data: record });

// En eliminar():
await record.destroy();
getIO().emit('estudiante:delete', { data: { id_estudiante: id } });
res.status(204).send();
```

**REGLAS:**
- El payload SIEMPRE es `{ data: ... }` para mantener consistencia
- Para delete, el payload es `{ data: { id_entidad: id } }`
- El emit es DESPUÉS de la operación en DB, pero ANTES de la respuesta HTTP
- NO emitas en GET (listar/obtenerPorId), SOLO en mutaciones

#### Paso 2: Backend — Convención de nombres

```
{entidad}:{acción}

Ejemplos:
- periodo:create
- periodo:update
- periodo:delete
- estudiante:create
- estudiante:update
- estudiante:delete
- horario:create
- horario:update
- horario:delete
```

#### Paso 3: Frontend — Agregar listeners en `useSocket.ts`

```typescript
// Agregar después de los listeners existentes:
socket.on('estudiante:create', (d) => onEventRef.current('estudiante:create', d));
socket.on('estudiante:update', (d) => onEventRef.current('estudiante:update', d));
socket.on('estudiante:delete', (d) => onEventRef.current('estudiante:delete', d));
```

#### Paso 4: Frontend — Agregar handler en `App.tsx`

```typescript
// En el callback de useSocket:
if (event === 'estudiante:create') {
  setStudents(prev => [...prev, mapEstudianteToStudent(payload.data)]);
} else if (event === 'estudiante:update') {
  setStudents(prev => prev.map(s =>
    s.id === String(payload.data.id_estudiante)
      ? mapEstudianteToStudent(payload.data) : s
  ));
} else if (event === 'estudiante:delete') {
  setStudents(prev => prev.filter(s =>
    s.id !== String(payload.data.id_estudiante)
  ));
}
```

#### Paso 5: Probar

1. Abre pestaña A → login → verifica `[WS] Conectado` en consola del navegador
2. Abre pestaña B → login → verifica `[WS] Conectado`
3. En pestaña A: crea/edita/elimina un registro
4. En pestaña B: debería actualizarse automáticamente

---

## 4. Pitfalls Críticos (Lo Que Nos Costó)

### Bug 1: Nombre del campo de token en sessionStorage

**Problema:** El login screen guarda el token como `sessionToken`:
```typescript
// loginScreen.tsx línea 112:
sessionStorage.setItem('liceo-auth-session', JSON.stringify({
  sessionToken: data.token,  // ← campo se llama "sessionToken"
}));
```

Pero el hook original buscaba `.token`:
```typescript
return JSON.parse(raw).token || null;  // ← BUSCABA "token", NO EXISTE
```

**Resultado:** `getSessionToken()` retornaba `null` siempre. El socket nunca conectaba.

**Solución:** Usar el mismo campo que usa `api.ts`:
```typescript
return JSON.parse(raw).sessionToken || null;
```

**REGLA:** Siempre revisa `loginScreen.tsx` línea 108-113 para ver cómo se guarda el token, y `api.ts` línea 4-16 para ver cómo se lee. El hook debe usar la misma convención.

### Bug 2: useEffect con `[]` nunca reconecta

**Problema:** El hook original:
```typescript
useEffect(() => {
  const token = getSessionToken();
  if (!token) return;  // ← si no hay token, sale y NUNCA vuelve
  // ... conectar socket
}, []);  // ← [] = ejecutar solo al montar
```

Cuando `App` monta, `isLoggedIn` es `false`. Si el usuario no ha hecho login, no hay token. El efecto sale con `return`. Como `[]` nunca cambia, el efecto **nunca se vuelve a ejecutar** aunque el usuario haga login después.

**Solución:** Agregar `isLoggedIn` como parámetro y dependencia:
```typescript
useEffect(() => {
  if (!isLoggedIn) return;  // ← esperar a que esté logueado
  const token = getSessionToken();
  if (!token) return;
  // ... conectar socket
}, [isLoggedIn]);  // ← reconecta cuando cambia el login
```

**REGLA:** NUNCA uses `[]` como dependencia si el dato que necesitas (token) puede no estar disponible al montar. Usa el estado de login como trigger.

### Bug 3: Auth del socket no alineada con HTTP

**Problema:** El middleware HTTP (`auth.middleware.ts`) hace 3 cosas que el socket NO hacía:

1. Prueba múltiples secrets (`jwtLegacySecrets`)
2. Especifica `algorithms: ['HS256']`
3. Verifica `tokenVersion` contra la DB

El socket solo hacía:
```typescript
jwt.verify(token, environment.jwtSecret);  // ← 1 solo secret, sin algoritmo
```

Si el token fue firmado con un secreto legacy, el socket lo rechazaba silenciosamente.

**Solución:** Copiar la misma lógica de `auth.middleware.ts`:
```typescript
function getSecretList(): string[] {
  const secrets = [environment.jwtSecret];
  if (environment.jwtLegacySecrets) {
    secrets.push(...environment.jwtLegacySecrets.split(',').map(s => s.trim()).filter(Boolean));
  }
  return secrets;
}

function verifyToken(token: string): any {
  let lastError: any = null;
  for (const secret of allSecrets) {
    try {
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Token inválido');
}
```

**REGLA:** El middleware de auth del socket SIEMPRE debe ser idéntico al de HTTP. Si cambias uno, cambia el otro.

### Bug 4: Doble-add del que crea

**Problema:** Cuando Usuario A crea un registro:
1. El REST exitoso hace `setPeriods(...)` → el registro aparece en la UI
2. El socket emite `periodo:create` → el handler en `App.tsx` hace `setPeriods(...)` → el registro aparece DUPLICADO

**Solución conocida (pendiente):** Agregar un guard para ignorar eventos que originó el mismo usuario. Opcionalmente, quitar el `setPeriods` optimista del handler REST y confiar solo en el socket.

**Por ahora:** El usuario que crea verá el registro duplicado hasta recargar la página. Los demás usuarios verán el cambio correctamente.

### Bug 5: Sin logging de errores de conexión

**Problema:** Si el socket falla (token inválido, CORS, etc.), no hay ningún mensaje visible. El desarrollador no sabe qué falla.

**Solución:** Agregar handler de `connect_error`:
```typescript
socket.on('connect_error', (err) => console.error('[WS] Error de conexión:', err.message));
```

**REGLA:** SIEMPRE agrega `connect_error` en el frontend y `[WS] Conectado` en el backend para poder depurar.

---

## 5. Convenciones de Nombres

### Eventos Socket

```
{entidad}:{acción}
```

| Entidad | create | update | delete |
|---------|--------|--------|--------|
| Periodo Escolar | `periodo:create` | `periodo:update` | `periodo:delete` |
| Estudiante | `estudiante:create` | `estudiante:update` | `estudiante:delete` |
| Horario | `horario:create` | `horario:update` | `horario:delete` |
| Representante | `representante:create` | `representante:update` | `representante:delete` |
| Asistencia Estudiante | `asistencia-estudiante:create` | `asistencia-estudiante:update` | `asistencia-estudiante:delete` |
| Asistencia Docente | `asistencia-docente:create` | `asistencia-docente:update` | `asistencia-docente:delete` |
| Justificación | `justificacion:create` | `justificacion:update` | `justificacion:delete` |

### Payload

```typescript
// Para create y update:
{ data: <objeto_completo_desde_DB> }

// Para delete:
{ data: { id_<entidad>: <id> } }
```

### Función Mapper

Cada entidad tiene un mapper en `frontend/src/services/mappers.ts`. El handler de socket SIEMPRE pasa el payload por el mapper:

```typescript
setEntidades(prev => [...prev, mapper(payload.data)]);
```

---

## 6. Extender a Otros Módulos — Ejemplo Concreto

### Ejemplo: Conectar módulo "Estudiantes"

#### Backend: `estudiante.controller.ts`

```typescript
import { getIO } from '../socket';

// En crear():
const result = await Estudiante.create(req.body);
getIO().emit('estudiante:create', { data: result });
res.status(201).json({ data: result });

// En actualizar():
await record.update(req.body);
getIO().emit('estudiante:update', { data: record });
res.json({ data: record });

// En eliminar():
await record.destroy();
getIO().emit('estudiante:delete', { data: { id_estudiante: id } });
res.status(204).send();
```

#### Frontend: `useSocket.ts`

```typescript
socket.on('estudiante:create', (d) => onEventRef.current('estudiante:create', d));
socket.on('estudiante:update', (d) => onEventRef.current('estudiante:update', d));
socket.on('estudiante:delete', (d) => onEventRef.current('estudiante:delete', d));
```

#### Frontend: `App.tsx`

```typescript
useSocket(isLoggedIn, (event, payload) => {
  // ... handlers de periodo existentes ...

  if (event === 'estudiante:create') {
    setStudents(prev => [...prev, mapEstudianteToStudent(payload.data)]);
  } else if (event === 'estudiante:update') {
    setStudents(prev => prev.map(s =>
      s.id === String(payload.data.id_estudiante)
        ? mapEstudianteToStudent(payload.data) : s
    ));
  } else if (event === 'estudiante:delete') {
    setStudents(prev => prev.filter(s =>
      s.id !== String(payload.data.id_estudiante)
    ));
  }
});
```

---

## 7. Cómo Depurar

### Consola del Navegador

| Mensaje | Significado |
|---------|-------------|
| `[WS] Conectado` | Socket conectado exitosamente. El token es válido. |
| `[WS] Error de conexión: ...` | Socket NO conectó. Ver el error específico. |
| (ningún mensaje) | `useSocket` no se ejecutó. Probablemente `isLoggedIn` es `false` o el token no existe en sessionStorage. |

### Consola del Backend

| Mensaje | Significado |
|---------|-------------|
| `[WS] Conectado: <socketId>` | Un cliente se conectó. El middleware JWT pasó. |
| `[WS] Desconectado: <socketId>` | Un cliente se desconectó. |
| (ningún mensaje de [WS]) | `initSocket()` no se ejecutó. Verificar que `server.ts` use `createServer(app)` + `initSocket(httpServer)`. |

### Pasos de Depuración

1. **¿El socket conecta?**
   - Abre consola del navegador → busca `[WS] Conectado` o `[WS] Error`
   - Abre consola del backend → busca `[WS] Conectado: socketId`

2. **¿El controller emite?**
   - Agrega `console.log('EMITIENDO periodo:create')` antes de `getIO().emit()`
   - Si no aparece, el controller no se está ejecutando

3. **¿El frontend recibe?**
   - Agrega `console.log('WS EVENT:', event, payload)` en el callback de `useSocket`
   - Si no aparece, el socket no está conectado o el evento no coincide

4. **¿El estado se actualiza?**
   - Agrega `console.log('STATE BEFORE:', periods)` antes del `setPeriods`
   - Si el state no cambia, el mapper falla o el ID no coincide

---

## 8. Limitaciones Conocidas

1. **JWT de 15 minutos sin refresh en socket:** El JWT expira en 15 minutos (`auth.controller.ts` línea 109). Si el socket se desconecta por cualquier razón después de 15 min, el auto-reintento usará el token expirado y fallará silenciosamente. `api.ts` maneja el refresh HTTP, pero el socket no.

2. **Sin verificación de tokenVersion:** El middleware HTTP verifica `tokenVersion` contra la DB (para invalidar sesiones en logout). El socket NO hace esta verificación. Un usuario con token "revocado" podría seguir conectado al socket.

3. **Doble-add en el que crea:** Como se describe en el Bug 4, el usuario que crea un registro lo ve duplicado hasta recargar.

4. **Un solo socket por componente:** `useSocket` se llama una vez en `App.tsx`. Si en el futuro se necesitan eventos para módulos que no están en `App.tsx`, habrá que reestructurar.

---

## Archivos Relacionados

| Archivo | Propósito |
|---------|-----------|
| `backend/src/socket.ts` | Servidor Socket.IO, JWT auth, `initSocket()`, `getIO()` |
| `backend/src/server.ts` | `createServer(app)` + `initSocket(httpServer)` |
| `backend/src/controllers/periodo-escolar.controller.ts` | Ejemplo de emisión en controller |
| `backend/src/middlewares/auth.middleware.ts` | Auth HTTP (referencia para alinear con socket.ts) |
| `backend/config/environment.ts` | `jwtSecret`, `jwtLegacySecrets`, `frontendUrl` |
| `frontend/src/hooks/useSocket.ts` | Hook de conexión WebSocket |
| `frontend/src/App.tsx` | Integración del hook + handlers de eventos |
| `frontend/vite.config.ts` | Proxy `/socket.io` con `ws: true` |
| `frontend/src/components/loginScreen.tsx` | Línea 108-113: guarda `sessionToken` en sessionStorage |
| `frontend/src/services/api.ts` | Línea 4-16: lee `sessionToken` de sessionStorage |
| `frontend/src/services/mappers.ts` | Mappers de DB → Frontend para cada entidad |
