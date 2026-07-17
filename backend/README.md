# Backend - Sistema de Gestión Académica (Liceo Estilita Orozco)

Backend API REST construido con **Node.js + Express + TypeScript + Sequelize (PostgreSQL)**.

## Stack

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 18+ | Runtime |
| TypeScript | ^5.5 | Lenguaje |
| Express | ^4.21 | Framework web |
| Sequelize | ^6.37 | ORM (PostgreSQL) |
| PostgreSQL | (NeonDB) | Base de datos |
| JWT (jsonwebtoken) | ^9.0 | Autenticación |
| bcrypt | ^6.0 | Hash de contraseñas |
| Nodemailer | ^9.0 | Envío de correos |
| Helmet | ^7.1 | Seguridad HTTP |
| express-rate-limit | ^8.5 | Rate limiting en rutas de autenticación |
| Vitest | ^4.1 | Tests unitarios |

## Requisitos

- Node.js 18+
- npm
- Base de datos PostgreSQL (local o NeonDB)

## Instalación

```bash
git clone <repo>
cd backend
npm install
```

## Configuración

Copia `.env.example` a `.env` y completa las variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=tu_correo@gmail.com
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia servidor en modo desarrollo (hot reload) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia servidor en producción |
| `npm test` | Ejecuta tests unitarios |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura |
| `npm run lint` | Ejecuta ESLint |
| `npm run typecheck` | Verifica tipos con TypeScript |
| `npm run seed` | Ejecuta seed fase 1 (usuarios, docentes, estudiantes) |

## Estructura del proyecto

```
backend/
├── config/
│   ├── database.ts          # Configuración de Sequelize
│   └── environment.ts       # Variables de entorno
├── src/
│   ├── app.ts               # Configuración Express (middleware, rutas)
│   ├── server.ts            # Punto de entrada
│   ├── seed.ts              # Seed inicial (roles + usuario default)
│   ├── controllers/         # Controladores (lógica de endpoints)
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Verificación JWT
│   │   ├── rbac.middleware.ts    # Control de acceso por roles
│   │   ├── audit.middleware.ts   # Registro de auditoría
│   │   ├── rateLimiter.ts        # Rate limiting
│   │   └── errorHandler.ts       # Manejo global de errores
│   ├── models/              # Modelos Sequelize (22 modelos)
│   ├── routes/              # Rutas Express (agrupadas por entidad)
│   ├── services/            # Lógica de negocio
│   ├── validators/          # Validación de datos de entrada
│   ├── types/               # Tipos TypeScript (DTOs)
│   └── shared/
│       ├── types/
│       ├── errors/          # Clases de error personalizadas
│       └── utils/
├── __tests__/               # Tests unitarios
├── scripts/                 # Scripts de seed
├── .env.example
├── vitest.config.ts
└── tsconfig.json
```

## Endpoints

### Autenticación (públicos)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/forgot-password` | Solicitar recuperación de contraseña |
| POST | `/api/auth/reset-password` | Restablecer contraseña |

### Entidades (requieren autenticación)
Todas las rutas siguen el patrón RESTful:

| Ruta | Métodos |
|---|---|
| `/api/usuarios` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/docentes` | GET, POST, PATCH/:id, DELETE/:id, POST/:id/qr |
| `/api/estudiantes` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/representantes` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/roles` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/periodos` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/grados` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/secciones` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/asignaturas` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/plan-estudio` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/matriculas` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/momentos` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/escalas` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/calificaciones` | GET, POST, PATCH/:id, DELETE/:id, POST/bulk |
| `/api/historicos` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/aulas` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/dias` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/bloques` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/horarios` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/asistencias` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/justificaciones` | GET, POST, PATCH/:id, DELETE/:id |
| `/api/auditorias` | GET, POST, PATCH/:id, DELETE/:id |

### Control de acceso por roles

| Rol | ID |
|---|---|
| Admin | 1 |
| Docente | 2 |
| Secretaría | 3 |
| Coordinador | 4 |

- **DELETE** en cualquier entidad: solo Admin (rol 1)
- **POST** en entidades académicas: Admin o Secretaría (roles 1, 3)
- **Calificaciones**: Admin, Docente o Coordinador (roles 1, 2, 4)
- **Auditoría**: solo Admin (rol 1)
- **Roles**: solo Admin (rol 1)

## Licencia

MIT
