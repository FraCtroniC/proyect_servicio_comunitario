# AGENT.md - Sistema Web Liceo Estilita Orozco

Este archivo sirve como system prompt persistente para guiar el desarrollo del Frontend del sistema de gestión de notas y asistencia.

---

## 1. Stack Tecnológico (Frontend)

- Framework: React (Vite como build tool).
- Lenguaje: TypeScript (para robustez en tipos de datos de estudiantes y docentes).
- Estilado: Tailwind CSS.
- Gestión de Estado: React Context API o Zustand.
- Enrutamiento: React Router DOM.
- Validación de Formularios: React Hook Form + Zod.

---

## 2. Estructura de Proyecto Sugerida

src/
├── assets/ # Imágenes, logos y fuentes.
├── components/ # Componentes reutilizables (Botones, inputs, modales).
│ ├── common/ # Componentes genéricos.
│ └── layout/ # Navbar, Sidebar, Footer.
├── features/ # Lógica dividida por módulos del sistema.
│ ├── auth/ # Login y recuperación de cuenta.
│ ├── grades/ # Módulo de gestión de notas.
│ └── attendance/ # Módulo de control de asistencia.
├── hooks/ # Custom hooks.
├── services/ # Consumo de API (Axios/Fetch).
├── store/ # Estado global.
├── types/ # Definiciones de interfaces TypeScript.
└── utils/ # Funciones de ayuda (formateo de fechas, etc.).

---

## 3. Convenciones de Código y Patrones

- Componentes: Utilizar Componentes Funcionales con Hooks.
- Nomenclatura: PascalCase para componentes, camelCase para funciones/variables.
- Estructura de Carpetas: Basada en Features para facilitar el escalado de los módulos de asistencia
y notas [cite: image_0d30db.png].
- Atomic Design: Separar componentes pequeños de las vistas complejas.
- Manejo de Errores: Implementar un sistema de notificaciones para errores y éxitos (ej: Toasts).

---

## 4. Flujo de Trabajo y Reglas

- Prohibiciones: No usar estilos inline (usar Tailwind), evitar el uso de 'any' en TypeScript.

- Testing: Implementar pruebas unitarias para la lógica de cálculo de promedios de notas.

- Commits: Seguir el estándar de Conventional Commits (ej: feat: add student attendance
list).

---

## 5. Contexto del Negocio (Resumen)

El sistema busca eliminar procesos manuales y errores humanos en el Liceo Nacional Estilita Orozco. Los módulos principales a desarrollar en el Frontend son:

- Gestión de Notas: Carga y visualización de calificaciones de media general .
- Control de Asistencia: Registro diario para personal docente y administrativo.

---