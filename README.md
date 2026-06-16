> [!NOTE]Nota: Información útil que el usuario debe tener en cuenta.
> [!TIP]Consejo: Consejos útiles para hacer las cosas mejor o más fácil.
> [!IMPORTANT]Importante: Información clave para que los usuarios logren sus objetivos.
> [!WARNING]Advertencia: Información urgente que requiere atención inmediata para evitar problemas.
> [!CAUTION]Precaución: Informa sobre riesgos o resultados negativos de ciertas acciones.


# Sistema Web Liceo Estilita Orozco

Plataforma web para la gestión de asistencia y calificaciones del **Liceo Estilita Orozco**, desarrollada para eliminar procesos manuales y reducir errores humanos en el registro académico.

## Tecnologías

| Módulo | Stack |
|--------|-------|
| **Frontend** | Vite + React + TypeScript + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Base de datos** | (por definir) |

## Estructura del proyecto

```
proyecto-servicio-comunitario/
├── frontend/          → Interfaz de usuario
│   ├── src/
│   │   ├── components/   → Componentes reutilizables
│   │   ├── features/     → Módulos (auth, grades, attendance)
│   │   ├── hooks/        → Custom hooks
│   │   ├── services/     → Consumo de API
│   │   ├── store/        → Estado global
│   │   ├── types/        → Interfaces TypeScript
│   │   └── utils/        → Utilidades
│   └── ...
├── backend/           → API REST
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/
│       └── shared/
└── DataBase/          → Esquemas y documentación de BD
```

## Requisitos

- Node.js 18+
- npm / pnpm / yarn

## Inicio rápido

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

## Scripts del frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar build |
| `npm run test` | Ejecutar tests |
| `npm run lint` | Ejecutar linter |

## Documentación por módulo

- [Frontend](frontend/README.md) — detalles de instalación y estructura del cliente web
- [DataBase](DataBase/DataBase.md) — esquema y modelo de datos
- [Backend](backend/README.md) — *(pendiente)*

## Variables de entorno

**Frontend** (`.env.local`):
```
VITE_API_URL=https://api.example.com
VITE_AUTH_KEY=tu_token_aqui
```

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de contribución, estilo de commits y pruebas.

## Código de Conducta

Por favor, lee [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) para mantener un ambiente respetuoso.

## Licencia

MIT — ver [LICENSE](LICENSE).
