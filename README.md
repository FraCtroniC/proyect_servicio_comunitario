# Sistema Web Liceo Estilita Orozco

Frontend desarrollado con Vite + React + TypeScript para la gestión de asistencia y calificaciones del Liceo Estilita Orozco.

## Descripción
Interfaz web para que personal administrativo y docente gestione usuarios, asistencia y notas. Este repositorio contiene el frontend del sistema.

## Tecnologías
- Vite
- React
- TypeScript
- Tailwind CSS

## Requisitos
- Node.js 18+ y npm / pnpm / yarn

## Instalación (local)
1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```

## Scripts recomendados
- `npm run dev` — servidor de desarrollo (Vite)
- `npm run build` — build de producción
- `npm run preview` — previsualizar build localmente
- `npm run test` — ejecutar tests
- `npm run lint` — ejecutar linter (si aplica)
- `npm run format` — formatear código (Prettier)

## Estructura del proyecto
- `index.html` — punto de entrada
- `src/`
  - `main.tsx`, `App.tsx` — arranque y componente raíz
  - `components/` — componentes reutilizables
  - `features/` — páginas y módulos por dominio (`auth`, `dashboard`, `attendance`, `grades`)
  - `store/` — hooks / estado local (ej. `useAuthStore.ts`)
  - `utils/` — utilidades y tests
  - `styles/` — CSS y Tailwind

## Variables de entorno
No incluir archivos `.env` en el repositorio. Ejemplo de variables en `.env.local`:

```
VITE_API_URL=https://api.example.com
VITE_AUTH_KEY=tu_token_aqui
```

## Testing
- Mantén tests cerca del código que prueban (`src/**/*.test.*` o `src/**/__tests__`).
- Ejecuta `npm run test` para ejecutar la suite.

## Contribuir
Lee `CONTRIBUTING.md` para el flujo de contribución, estilo de commits y pruebas.

## Licencia
Proyecto bajo licencia MIT — ver `LICENSE`.

## Contacto
- Mantenedor: Reemplaza con tu nombre y email.
