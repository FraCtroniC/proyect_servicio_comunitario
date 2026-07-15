/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Database, Layers, Milestone, Calculator, FileCheck } from 'lucide-react';

export default function DocumentationView() {
  return (
    <div id="doc-view-container" className="space-y-8 max-w-[2200px] mx-auto p-4 md:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Title */}
      <div id="doc-header" className="border-b border-slate-100 pb-6">
        <h1 id="doc-title" className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          Documentación del Sistema y Arquitectura MPPE
        </h1>
        <p id="doc-subtitle" className="text-slate-500 mt-2 text-base leading-relaxed max-w-3xl">
          Especificación de arquitectura, diseño de base de datos relacional orientada a la legislación educativa de Venezuela, 
          y diseño detallado de cálculos de calificaciones y boletines oficiales para el nivel de Educación Media General 
          conforme a la Ley Orgánica de Educación y la LOPNA.
        </p>
      </div>

      <div id="doc-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Tech Stack */}
        <div id="doc-card-tech" className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
          <h2 id="tech-title" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            1. Arquitectura & Stack Tecnológico Recomendado
          </h2>
          <div id="tech-content" className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div>
              <span className="font-semibold text-slate-800 block">Frontend (Capa de Cliente):</span>
              <p className="mt-1">
                <strong>Tecnología:</strong> React con TypeScript y Vite. Tailwind CSS para renderizado fluido de interfaces administrativas, y Lucide-React para iconos.<br />
                <strong>Justificación:</strong> SPA extremadamente rápida y eficiente, reduce los costos de cómputo en servidores del liceo y se adapta excelente a velocidades variables de internet móvil de representantes y docentes en Venezuela (muy baja latencia en carga).
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-800 block">Backend (Capa de Servicios de Red):</span>
              <p className="mt-1">
                <strong>Tecnología:</strong> Node.js con Express de manera nativa (o NestJS para liceos grandes con mayor rigidez arquitectónica). TypeScript para seguridad tipográfica total.<br />
                <strong>Justificación:</strong> El modelo asíncrono y no bloqueante soporta múltiples peticiones simultáneas durante los picos de fin de Lapso ("descarga de notas por docentes") con uso mínimo de memoria ram.
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-800 block">Database (Capa de Persistencia Durable):</span>
              <p className="mt-1">
                <strong>Tecnología:</strong> PostgreSQL (operado en Cloud SQL o en servidores físicos de Control de Estudios local). Prisma ORM o Drizzle ORM.<br />
                <strong>Justificación:</strong> Soporte transaccional ACID completo. La legislación venezolana de Control de Estudios dictamina que los registros de asignaturas y boletines históricos no pueden sufrir corrupciones (lopna y actas oficiales), requiriendo integridad referencial estricta.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: MPPE Grading Logic */}
        <div id="doc-card-grading" className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
          <h2 id="grading-title" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            2. Lógica de Calificaciones Oficiales (3 Lapsos)
          </h2>
          <div id="grading-content" className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              El sistema de evaluación venezolana para Educación Media General se rige bajo la escala del <strong>1 al 20</strong>, siendo <strong>10 la calificación mínima aprobatoria</strong>. El año escolar se divide en <strong>3 Lapsos Académicos</strong>.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
              <p className="font-medium text-slate-700">Algoritmia del Redondeo Oficial (Art. 108 RLOE):</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>Calificación de Lapso:</strong> Es la sumatoria de las evaluaciones parciales ponderadas (e.g., 4 evaluaciones de 25% cada una).
                  <br />
                  <code className="bg-white px-1 py-0.5 rounded text-indigo-700 border text-xs">Nota_Lapso = Suma(Nota_Evaluacion_i * Porcentaje_i / 100)</code>
                </li>
                <li>
                  <strong>Criterio de Ajuste:</strong> Las calificaciones de Lapso se expresan en números enteros. Las fracciones de <strong>0.50 o más</strong> se redondean al entero inmediato superior (e.g., una nota de <strong>9.50</strong> se convierte en <strong>10</strong> - Aprobado). Las inferiores a 0.50 bajan (e.g., 9.49 a 09).
                </li>
                <li>
                  <strong>Calificación Final de Asignatura:</strong> Es el promedio simple de las calificaciones de los <strong>3 Lapsos ya redondeados</strong>.
                  <br />
                  <code className="bg-white px-1 py-0.5 rounded text-green-700 border text-xs">Nota_Final = Redondear((Nota_Lapso1 + Nota_Lapso2 + Nota_Lapso3) / 3)</code>
                </li>
              </ul>
            </div>
            <p>
              <strong>Actividades de Superación Pedagógica (Recuperación):</strong> Se aplican de forma obligatoria al culminar cada lapso para aquellos estudiantes que no obtuvieron la nota mínima, sustituyendo la nota original de ser favorable.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Database Schema Design */}
      <div id="doc-card-schema" className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
        <h2 id="schema-title" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          3. Modelo de Datos Relacional de Clases (Drizzle/SQL Schema)
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          La base de datos relacional debe organizarse garantizando la trazabilidad histórica de los boletines oficiales para evitar fraudes en actas académicas.
        </p>

        <div id="schema-tabs" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
          {/* Col 1 */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="font-bold text-indigo-900 mb-2 border-b pb-1">Usuarios & LOPNA</h3>
            <pre className="font-mono text-xs text-slate-700 overflow-x-auto space-y-1">
{`-- ENTIDAD: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula VARCHAR(15) UNIQUE, -- V-XXXXXXXX
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(25) NOT NULL CHECK (
    role IN ('super_admin', 'control_estudios', 'docente')
  ),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENTIDAD: students (Bajo marco LOPNA)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula VARCHAR(15) UNIQUE,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  representative_id UUID REFERENCES users(id),
  gender CHAR(1) CHECK (gender IN ('M', 'F')),
  status VARCHAR(15) DEFAULT 'Activo' -- Activo, Inactivo, Retirado
);`}
            </pre>
          </div>

          {/* Col 2 */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="font-bold text-indigo-900 mb-2 border-b pb-1">Malla Curricular & Estructura</h3>
            <pre className="font-mono text-xs text-slate-700 overflow-x-auto space-y-1">
{`-- ENTIDAD: subjects
CREATE TABLE subjects (
  id VARCHAR(10) PRIMARY KEY, -- e.g., 'mat', 'qui'
  name VARCHAR(100) NOT NULL,
  shortName VARCHAR(15) NOT NULL
);

-- ENTIDAD: section_assignments
CREATE TABLE section_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year SMALLINT CHECK (academic_year BETWEEN 1 AND 5),
  section CHAR(1) NOT NULL, -- 'A', 'B', 'C'
  mppe_code VARCHAR(30) UNIQUE, -- Código oficial MPPE
  quota SMALLINT DEFAULT 35
);

-- RELACIÓN: student_enrollment
CREATE TABLE student_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  section_id UUID REFERENCES section_assignments(id),
  school_year VARCHAR(15) NOT NULL, -- e.g., '2025-2026'
  UNIQUE(student_id, school_year)
);`}
            </pre>
          </div>

          {/* Col 3 */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="font-bold text-indigo-900 mb-2 border-b pb-1">Evaluaciones & Horarios</h3>
            <pre className="font-mono text-xs text-slate-700 overflow-x-auto space-y-1">
{`-- ENTIDAD: evaluations
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES section_assignments(id),
  subject_id VARCHAR(10) REFERENCES subjects(id),
  lapso SMALLINT CHECK (lapso IN (1, 2, 3)),
  title VARCHAR(100) NOT NULL,
  weight_percentage REAL NOT NULL CHECK (
    weight_percentage BETWEEN 5 AND 100
  )
);

-- ENTIDAD: grades (Carga Transaccional)
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  evaluation_id UUID REFERENCES evaluations(id),
  score INT NOT NULL CHECK (score BETWEEN 1 AND 20),
  teacher_id UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, evaluation_id)
);`}
            </pre>
          </div>
        </div>
      </div>

      {/* Section 4: Project Roadmap Phases */}
      <div id="doc-card-roadmap" className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
        <h2 id="roadmap-title" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Milestone className="h-5 w-5 text-indigo-600" />
          4. Fases de Desarrollo Graduales e Hitos del Proyecto
        </h2>
        
        <div id="roadmap-steps" className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-slate-600 mt-4">
          <div className="border-l-2 border-indigo-200 pl-4 space-y-2 relative">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
            <span className="font-bold text-indigo-900 block text-base">Fase 1: Configuración</span>
            <p>Se construye primeramente la base de datos PostgreSQL, esquemas lógicos y autenticación multifactor integrada bajo roles oficiales. Diseño de seguridad para LOPNA.</p>
          </div>

          <div className="border-l-2 border-indigo-200 pl-4 space-y-2 relative">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
            <span className="font-bold text-indigo-900 block text-base">Fase 2: Admisión</span>
            <p>Sistemas de registro y transferencia de alumnos, generación de fichas confidenciales de representantes, matrículas del año en curso con secciones de 1er a 5to año.</p>
          </div>

          <div className="border-l-2 border-indigo-200 pl-4 space-y-2 relative">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-600"></div>
            <span className="font-bold text-indigo-900 block text-base">Fase 3: Académico & Notas</span>
            <p className="font-medium text-slate-800">El núcleo de carga del MPPE. Definición del plan de lapsos, carga de notas del 1-20, actas de recuperación y algoritmo del redondeo de notas oficial.</p>
          </div>

          <div className="border-l-2 border-slate-200 pl-4 space-y-2 relative item-active">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-slate-300"></div>
            <span className="font-bold text-indigo-900 block text-base">Fase 4: Horarios & Reportes</span>
            <p>Mapeo de aulas con asignación horaria matricial libre de sobreventas. Exportación de plantillas XLS y generación de Boletines oficiales firmables digitales.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
