export type ElementType = 'text' | 'field' | 'image' | 'grades_table' | 'line' | 'signature' | 'space' | 'cuadricula';

export type TextAlign = 'left' | 'center' | 'right';
export type Orientacion = 'portrait' | 'landscape';
export type SectionName = 'header' | 'body' | 'footer';

export interface ElementPosition {
  x: number;
  y: number;
  ancho: number | string;
  alto?: number | string;
}

export interface TextStyle {
  fuente: string;
  tamano: number;
  negrita: boolean;
  cursiva: boolean;
  alineacion: TextAlign;
  color: string;
}

export interface TextElement extends ElementPosition {
  id: string;
  tipo: 'text';
  contenido: string;
  estilo: TextStyle;
}

export interface FieldElement extends ElementPosition {
  id: string;
  tipo: 'field';
  campo: string;
  label: string;
  estilo: TextStyle;
}

export interface ImageElement extends ElementPosition {
  id: string;
  tipo: 'image';
  contenido: string;
  alto: number;
  alineacion: TextAlign;
}

export interface TableColumn {
  id: string;
  nombre: string;
  ancho: number;
  campo_dato: string | null;
}

export interface TableStyle {
  fondo: string;
  color_texto: string;
  fuente: string;
  tamano: number;
  negrita: boolean;
}

export interface GradesTableElement extends ElementPosition {
  id: string;
  tipo: 'grades_table';
  columnas: TableColumn[];
  estilo_encabezado: TableStyle;
  estilo_cuerpo: {
    fondo_par: string;
    fondo_impar: string;
    fuente: string;
    tamano: number;
    alineacion: TextAlign;
  };
  bordes: boolean;
  alternar_colores: boolean;
}

export interface LineElement extends ElementPosition {
  id: string;
  tipo: 'line';
  grosor: number;
  color: string;
  estilo: 'solid' | 'dashed' | 'dotted';
}

export interface SignatureElement extends ElementPosition {
  id: string;
  tipo: 'signature';
  titulo: string;
  fuente: string;
  tamano: number;
}

export interface SpaceElement extends ElementPosition {
  id: string;
  tipo: 'space';
  alto: number;
}

export interface CuadriculaElement extends ElementPosition {
  id: string;
  tipo: 'cuadricula';
  contenido: string;
  fondo: string;
  borde_color: string;
  borde_grosor: number;
  borde_estilo: 'solid' | 'dashed' | 'dotted';
  alto: number;
  estilo: TextStyle;
}

export type FormatElement =
  | TextElement
  | FieldElement
  | ImageElement
  | GradesTableElement
  | LineElement
  | SignatureElement
  | SpaceElement
  | CuadriculaElement;

export interface Seccion {
  altura: number | string;
  elementos: FormatElement[];
}

export interface Margenes {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface FormatConfig {
  margenes: Margenes;
  orientacion: Orientacion;
  secciones: {
    header: Seccion;
    body: Seccion;
    footer: Seccion;
  };
}

export interface FormatSabana {
  id_formato: number;
  nombre_formato: string;
  configuracion: FormatConfig;
  imagen_referencia: string | null;
  es_activo: boolean;
  creado_por: number | null;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface AvailableField {
  campo: string;
  label: string;
  categoria: string;
}

export const AVAILABLE_FIELDS: AvailableField[] = [
  { campo: 'institution.name', label: 'Nombre Institución', categoria: 'Institución' },
  { campo: 'institution.code', label: 'Código MPPE', categoria: 'Institución' },
  { campo: 'institution.address', label: 'Dirección', categoria: 'Institución' },
  { campo: 'institution.phone', label: 'Teléfono', categoria: 'Institución' },
  { campo: 'period.year', label: 'Año Escolar', categoria: 'Periodo' },
  { campo: 'period.name', label: 'Nombre Periodo', categoria: 'Periodo' },
  { campo: 'section.name', label: 'Sección', categoria: 'Sección' },
  { campo: 'section.grade', label: 'Grado', categoria: 'Sección' },
  { campo: 'section.full_name', label: 'Sección Completa', categoria: 'Sección' },
  { campo: 'subject.name', label: 'Asignatura', categoria: 'Asignatura' },
  { campo: 'subject.code', label: 'Código Asignatura', categoria: 'Asignatura' },
  { campo: 'student.list_number', label: 'Nº Lista', categoria: 'Estudiante' },
  { campo: 'student.cedula', label: 'Cédula', categoria: 'Estudiante' },
  { campo: 'student.full_name', label: 'Nombre Completo', categoria: 'Estudiante' },
  { campo: 'student.first_name', label: 'Nombre', categoria: 'Estudiante' },
  { campo: 'student.last_name', label: 'Apellido', categoria: 'Estudiante' },
  { campo: 'grades.lapso1', label: 'Lapso 1', categoria: 'Calificaciones' },
  { campo: 'grades.lapso2', label: 'Lapso 2', categoria: 'Calificaciones' },
  { campo: 'grades.lapso3', label: 'Lapso 3', categoria: 'Calificaciones' },
  { campo: 'grades.final', label: 'Nota Final', categoria: 'Calificaciones' },
  { campo: 'grades.status', label: 'Estado', categoria: 'Calificaciones' },
  { campo: 'teacher.name', label: 'Profesor(a)', categoria: 'Firmas' },
  { campo: 'director.name', label: 'Director(a)', categoria: 'Firmas' },
  { campo: 'control_estudios.name', label: 'Control de Estudios', categoria: 'Firmas' },
  { campo: 'current_date', label: 'Fecha Actual', categoria: 'Sistema' },
  { campo: 'current_year', label: 'Año Actual', categoria: 'Sistema' },
];

export const FONT_OPTIONS = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Helvetica',
];

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fuente: 'Arial',
  tamano: 10,
  negrita: false,
  cursiva: false,
  alineacion: 'center',
  color: '#000000',
};

export const createDefaultConfig = (): FormatConfig => ({
  margenes: { top: 20, bottom: 20, left: 15, right: 15 },
  orientacion: 'portrait',
  secciones: {
    header: { altura: 140, elementos: [] },
    body: { altura: 'auto', elementos: [] },
    footer: { altura: 100, elementos: [] },
  },
});

export const generateId = (): string => {
  return `el_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
