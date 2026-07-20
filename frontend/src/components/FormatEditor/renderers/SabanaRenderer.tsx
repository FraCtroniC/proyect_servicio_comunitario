import React from 'react';
import { FormatConfig, FormatElement } from '../../../types/formatEditor.types';

interface StudentData {
  list_number: number;
  cedula: string;
  full_name: string;
  lapso1: string;
  lapso2: string;
  lapso3: string;
  final: string;
  status: string;
}

interface SabanaRendererProps {
  config: FormatConfig;
  students: StudentData[];
  institutionData: {
    name: string;
    code: string;
    address?: string;
    phone?: string;
  };
  periodData: {
    year: string;
    name?: string;
  };
  sectionData: {
    name: string;
    grade: string;
    full_name: string;
  };
  subjectData?: {
    name: string;
    code: string;
  };
  teacherData?: {
    name: string;
  };
  directorData?: {
    name: string;
  };
  controlEstudiosData?: {
    name: string;
  };
}

const resolveFieldValue = (
  campo: string,
  ctx: {
    students: StudentData[];
    institutionData: SabanaRendererProps['institutionData'];
    periodData: SabanaRendererProps['periodData'];
    sectionData: SabanaRendererProps['sectionData'];
    subjectData?: SabanaRendererProps['subjectData'];
    teacherData?: SabanaRendererProps['teacherData'];
    directorData?: SabanaRendererProps['directorData'];
    controlEstudiosData?: SabanaRendererProps['controlEstudiosData'];
    student?: StudentData;
  }
): string => {
  switch (campo) {
    case 'institution.name': return ctx.institutionData.name;
    case 'institution.code': return ctx.institutionData.code;
    case 'institution.address': return ctx.institutionData.address || '';
    case 'institution.phone': return ctx.institutionData.phone || '';
    case 'period.year': return ctx.periodData.year;
    case 'period.name': return ctx.periodData.name || '';
    case 'section.name': return ctx.sectionData.name;
    case 'section.grade': return ctx.sectionData.grade;
    case 'section.full_name': return ctx.sectionData.full_name;
    case 'subject.name': return ctx.subjectData?.name || '';
    case 'subject.code': return ctx.subjectData?.code || '';
    case 'teacher.name': return ctx.teacherData?.name || '';
    case 'director.name': return ctx.directorData?.name || '';
    case 'control_estudios.name': return ctx.controlEstudiosData?.name || '';
    case 'current_date': return new Date().toLocaleDateString('es-VE');
    case 'current_year': return String(new Date().getFullYear());
    case 'student.list_number': return ctx.student ? String(ctx.student.list_number) : '';
    case 'student.cedula': return ctx.student?.cedula || '';
    case 'student.full_name': return ctx.student?.full_name || '';
    case 'student.first_name': return ctx.student?.full_name.split(' ').slice(-2).join(' ') || '';
    case 'student.last_name': return ctx.student?.full_name.split(' ').slice(0, -2).join(' ') || '';
    case 'grades.lapso1': return ctx.student?.lapso1 || '';
    case 'grades.lapso2': return ctx.student?.lapso2 || '';
    case 'grades.lapso3': return ctx.student?.lapso3 || '';
    case 'grades.final': return ctx.student?.final || '';
    case 'grades.status': return ctx.student?.status || '';
    default: return `[${campo}]`;
  }
};

const renderElement = (
  el: FormatElement,
  key: string,
  ctx: Parameters<typeof resolveFieldValue>[1],
  flowLayout: boolean = false
): React.ReactNode => {
  const absPosition = flowLayout ? {} : {
    position: 'absolute' as const,
    left: `${el.x}px`,
    top: `${el.y}px`,
  };

  switch (el.tipo) {
    case 'text':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: el.ancho === '100%' ? (flowLayout ? undefined : '100%') : `${el.ancho}px`,
            fontFamily: el.estilo.fuente,
            fontSize: `${el.estilo.tamano}px`,
            fontWeight: el.estilo.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo.cursiva ? 'italic' : 'normal',
            textAlign: el.estilo.alineacion,
            color: el.estilo.color,
          }}
        >
          {el.contenido}
        </div>
      );
    case 'field':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: el.ancho === '100%' ? (flowLayout ? undefined : '100%') : `${el.ancho}px`,
            fontFamily: el.estilo.fuente,
            fontSize: `${el.estilo.tamano}px`,
            fontWeight: el.estilo.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo.cursiva ? 'italic' : 'normal',
            textAlign: el.estilo.alineacion,
            color: el.estilo.color,
          }}
        >
          {resolveFieldValue(el.campo, ctx)}
        </div>
      );
    case 'image':
      return (
        <img
          key={key}
          src={el.contenido}
          alt="Logo"
          style={{
            ...absPosition,
            width: `${el.ancho}px`,
            height: `${el.alto}px`,
            objectFit: 'contain',
          }}
        />
      );
    case 'line':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: el.ancho === '100%' ? (flowLayout ? undefined : '100%') : `${el.ancho}px`,
            borderTop: `${el.grosor}px ${el.estilo} ${el.color}`,
          }}
        />
      );
    case 'signature':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: flowLayout ? `${el.ancho}px` : `${el.ancho}px`,
            textAlign: 'center',
          }}
        >
          <div style={{ borderTop: '1px solid #000', marginBottom: '4px' }} />
          <span style={{ fontFamily: el.fuente || 'Arial', fontSize: `${el.tamano || 10}px`, whiteSpace: 'pre-line' }}>
            {el.titulo}
          </span>
        </div>
      );
    case 'space':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: el.ancho === '100%' ? (flowLayout ? undefined : '100%') : `${el.ancho}px`,
            height: `${el.alto}px`,
          }}
        />
      );
    case 'grades_table':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: el.ancho === '100%' ? (flowLayout ? undefined : '100%') : `${el.ancho}px`,
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: `${el.estilo_cuerpo?.tamano || 9}px`,
              fontFamily: el.estilo_cuerpo?.fuente || 'Arial',
            }}
          >
            <thead>
              <tr>
                {el.columnas.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      backgroundColor: el.estilo_encabezado.fondo,
                      color: el.estilo_encabezado.color_texto,
                      fontFamily: el.estilo_encabezado.fuente,
                      fontSize: `${el.estilo_encabezado.tamano}px`,
                      fontWeight: el.estilo_encabezado.negrita ? 'bold' : 'normal',
                      padding: '6px 4px',
                      textAlign: 'center',
                      width: `${col.ancho}px`,
                      border: el.bordes ? '1px solid #ccc' : 'none',
                    }}
                  >
                    {col.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ctx.students.map((student, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    backgroundColor:
                      el.alternar_colores
                        ? rowIdx % 2 === 0
                          ? el.estilo_cuerpo.fondo_impar
                          : el.estilo_cuerpo.fondo_par
                        : '#FFFFFF',
                  }}
                >
                  {el.columnas.map((col) => (
                    <td
                      key={col.id}
                      style={{
                        padding: '5px 4px',
                        textAlign: el.estilo_cuerpo.alineacion,
                        border: el.bordes ? '1px solid #ccc' : 'none',
                      }}
                    >
                      {col.id === 'num'
                        ? student.list_number
                        : col.id === 'cedula'
                        ? student.cedula
                        : col.id === 'nombre'
                        ? student.full_name
                        : col.id === 'l1'
                        ? student.lapso1
                        : col.id === 'l2'
                        ? student.lapso2
                        : col.id === 'l3'
                        ? student.lapso3
                        : col.id === 'final'
                        ? student.final
                        : col.id === 'estado'
                        ? student.status
                        : '---'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cuadricula':
      return (
        <div
          key={key}
          style={{
            ...absPosition,
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
            height: `${el.alto}px`,
            backgroundColor: el.fondo,
            border: `${el.borde_grosor}px ${el.borde_estilo} ${el.borde_color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: el.estilo.alineacion === 'left' ? 'flex-start' : el.estilo.alineacion === 'right' ? 'flex-end' : 'center',
            padding: '2px 6px',
            fontFamily: el.estilo.fuente,
            fontSize: `${el.estilo.tamano}px`,
            fontWeight: el.estilo.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo.cursiva ? 'italic' : 'normal',
            color: el.estilo.color,
            boxSizing: 'border-box',
          }}
        >
          {el.contenido}
        </div>
      );
    default:
      return null;
  }
};

export const SabanaRenderer: React.FC<SabanaRendererProps> = ({
  config,
  students,
  institutionData,
  periodData,
  sectionData,
  subjectData,
  teacherData,
  directorData,
  controlEstudiosData,
}) => {
  const ctx = {
    students,
    institutionData,
    periodData,
    sectionData,
    subjectData,
    teacherData,
    directorData,
    controlEstudiosData,
  };

  const sections: Array<'header' | 'body' | 'footer'> = ['header', 'body', 'footer'];

  return (
    <div
      style={{
        position: 'relative',
        padding: `${config.margenes.top}px ${config.margenes.right}px ${config.margenes.bottom}px ${config.margenes.left}px`,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {sections.map((sectionName) => {
        const section = config.secciones[sectionName];
        const isAuto = section.altura === 'auto';
        const sectionHeight = typeof section.altura === 'number' ? section.altura : undefined;
        const hasOnlySignatures = section.elementos.length > 0 && section.elementos.every(el => el.tipo === 'signature');

        return (
          <div
            key={sectionName}
            style={{
              position: 'relative',
              height: isAuto ? 'auto' : `${sectionHeight}px`,
              marginBottom: isAuto ? '8px' : '0',
              ...(!isAuto && hasOnlySignatures ? {
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
              } : {}),
            }}
          >
            {section.elementos.map((el, idx) =>
              renderElement(el, `${sectionName}-${idx}`, ctx, isAuto || hasOnlySignatures)
            )}
          </div>
        );
      })}
    </div>
  );
};
