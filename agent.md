# Agent Context — Proyecto Servicio Comunitario

## Perfil del Proyecto

Sistema web para la gestión de asistencia y calificaciones del **Liceo Estilita Orozco**. Reemplaza procesos manuales y reduce errores en el registro académico.

| Módulo | Stack |
|--------|-------|
| **Backend** | Node.js + Express + TypeScript + Sequelize ORM + PostgreSQL |
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| **Testing** | Vitest (backend), ninguno configurado en frontend |
| **Linter** | ESLint 10 (backend), `tsc --noEmit` (frontend) |
| **Gestor** | npm |

## Arquitectura y Estructura

```
/
├── agent.md                ← Este archivo (memoria del agente)
├── backend/                ← API REST (Express)
│   └── src/
│       ├── __tests__/      ← Tests con Vitest (*.test.ts / *.spec.ts)
│       ├── controllers/    ← Lógica de endpoints
│       ├── middlewares/     ← Auth, RBAC, error handler, rate limiter
│       ├── models/         ← Modelos Sequelize (27 modelos)
│       ├── routes/         ← Definición de rutas
│       ├── services/       ← Lógica de negocio (email, usuario)
│       ├── shared/         ← Errores, tipos, utilidades compartidas
│       ├── types/          ← Interfaces TypeScript
│       └── validators/     ← Validación de entrada
├── frontend/               ← SPA React
│   └── src/
│       ├── components/     ← 14 componentes/páginas
│       ├── services/       ← api.ts, mappers.ts
│       └── utils/          ← Utilidades
└── DataBase/               ← Esquemas SQL y documentación
```

**Backend** sigue una arquitectura por capas: Routes → Controllers → Services → Models (Sequelize).  
**Frontend** es SPA con componentes funcionales de React, llamadas a API via `services/api.ts`.

## Instrucciones de Operación

Todos los comandos se ejecutan desde la carpeta correspondiente (`backend/` o `frontend/`).

### Backend

```bash
cd backend
npm install              # Instalar dependencias
npm run dev              # Iniciar servidor en modo desarrollo (tsx watch)
npm run build            # Compilar TypeScript a JS (tsc)
npm start                # Ejecutar compilado (node dist/src/server.js)
npm test                 # Ejecutar tests (vitest run)
npm run test:watch       # Tests en modo watch (vitest)
npm run test:coverage    # Tests con cobertura
npm run lint             # ESLint sobre src/
npm run typecheck        # TypeScript type-check (tsc --noEmit)
npm run seed             # Ejecutar seed de datos
```

### Frontend

```bash
cd frontend
npm install              # Instalar dependencias
npm run dev              # Servidor de desarrollo Vite (puerto 5173)
npm run build            # Build de producción
npm run preview          # Previsualizar build
npm run lint             # Type-check (tsc --noEmit)
```

## Reglas de Desarrollo

1. **Plan Mode primero**: Antes de escribir o modificar código, analizar el contexto, entender lo que se pide y proponer un plan. No ejecutar cambios sin aprobación explícita.

2. **No borrar tests existentes**: Preservar todos los archivos en `backend/src/__tests__/`. Si se agrega funcionalidad nueva, escribir tests nuevos.

3. **Respetar arquitectura existente**: Seguir el patrón Routes → Controllers → Services → Models en el backend. No mezclar responsabilidades entre capas.

4. **Principios SOLID**: Priorizar código desacoplado, inyección de dependencias y responsabilidad única.

5. **Convenciones del código**:
   - TypeScript estricto (`strict: true` en tsconfig).
   - Usar `camelCase` para variables/funciones, `PascalCase` para clases/modelos.
   - Los tests de backend se ubican en `backend/src/__tests__/` con nombres `*.test.ts`.
   - No mezclar JS y TS; todo el código fuente es TypeScript.

6. **Base de datos**: Usar Sequelize ORM. No escribir SQL crudo a menos que sea estrictamente necesario. Los modelos están en `backend/src/models/`.

7. **Seguridad**: No exponer secrets. Usar variables de entorno (`.env`). Respetar middlewares de autenticación y RBEXistentes.

8. **Frontend**: Componentes funcionales con hooks. Estilos con Tailwind CSS. Llamadas API a través de `services/api.ts`.

9. **Verificación**: Siempre ejecutar `npm run lint` y `npm run typecheck` (backend) después de cambios. Si se modifican tests, verificar que `npm test` pase.
