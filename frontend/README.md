# Frontend — Sistema de Gestión Escolar (Liceo Estilita Orozco)

Frontend en React + TypeScript + Vite + Tailwind CSS 4 para el Sistema Integrado de Control de Estudios de Educación Media General.

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000`

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El frontend se levanta en `http://localhost:5173` y el proxy de Vite redirige `/api/*` al backend.

## Producción

```bash
npm run build
```

Los archivos estáticos se generan en `dist/` y pueden servirse con cualquier servidor HTTP o directamente desde el backend Express.
