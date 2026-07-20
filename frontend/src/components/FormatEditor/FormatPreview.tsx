import React from 'react';
import { FormatConfig } from '../../types/formatEditor.types';

interface FormatPreviewProps {
  config: FormatConfig;
}

const MOCK_DATA: Record<string, string> = {
  'institution.name': 'Liceo Estilita Orozco',
  'institution.code': 'U.E. 00XX00XX',
  'institution.address': 'Av. Principal, Ciudad Bolívar',
  'institution.phone': '(0281) 123-4567',
  'period.year': '2025 - 2026',
  'period.name': 'Periodo Escolar',
  'section.name': 'Sección A',
  'section.grade': '2do Año',
  'section.full_name': '2do Año "A"',
  'subject.name': 'Matemática',
  'subject.code': 'MAT2',
  'student.list_number': '01',
  'student.cedula': 'V-12345678',
  'student.full_name': 'GARCÍA MARÍA JOSE',
  'student.first_name': 'MARÍA JOSE',
  'student.last_name': 'GARCÍA',
  'grades.lapso1': '16',
  'grades.lapso2': '17',
  'grades.lapso3': '18',
  'grades.final': '17',
  'grades.status': 'Aprobado',
  'teacher.name': 'Prof. Juan Pérez',
  'director.name': 'Dir. María López',
  'control_estudios.name': 'Coord. Ana García',
  'current_date': new Date().toLocaleDateString('es-VE'),
  'current_year': String(new Date().getFullYear()),
};

const MOCK_STUDENTS = [
  { num: '01', cedula: 'V-12345678', nombre: 'GARCÍA MARÍA JOSE', l1: '16', l2: '17', l3: '18', final: '17', estado: 'Aprobado' },
  { num: '02', cedula: 'V-23456789', nombre: 'RODRÍGUEZ PEDRO LUIS', l1: '14', l2: '15', l3: '16', final: '15', estado: 'Aprobado' },
  { num: '03', cedula: 'V-34567890', nombre: 'MARTÍNEZ ANA BELÉN', l1: '12', l2: '13', l3: '11', final: '12', estado: 'Aprobado' },
  { num: '04', cedula: 'V-45678901', nombre: 'HERNÁNDEZ CARLOS ANDRÉS', l1: '08', l2: '09', l3: '10', final: '09', estado: 'Reprobado' },
  { num: '05', cedula: 'V-56789012', nombre: 'LÓPEZ Laura Beatriz', l1: '18', l2: '19', l3: '20', final: '19', estado: 'Aprobado' },
];

const resolveFieldValue = (campo: string): string => {
  return MOCK_DATA[campo] || `[${campo}]`;
};

const renderElement = (el: any, key: string): React.ReactNode => {
  switch (el.tipo) {
    case 'text':
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: el.ancho === '100%' ? '100%' : `${el.ancho}px`,
            fontFamily: el.estilo?.fuente || 'Arial',
            fontSize: `${el.estilo?.tamano || 10}px`,
            fontWeight: el.estilo?.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo?.cursiva ? 'italic' : 'normal',
            textAlign: el.estilo?.alineacion || 'center',
            color: el.estilo?.color || '#000000',
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
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: el.ancho === '100%' ? '100%' : `${el.ancho}px`,
            fontFamily: el.estilo?.fuente || 'Arial',
            fontSize: `${el.estilo?.tamano || 10}px`,
            fontWeight: el.estilo?.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo?.cursiva ? 'italic' : 'normal',
            textAlign: el.estilo?.alineacion || 'center',
            color: el.estilo?.color || '#000000',
          }}
        >
          {resolveFieldValue(el.campo)}
        </div>
      );
    case 'image':
      return (
        <img
          key={key}
          src={el.contenido}
          alt="Logo"
          style={{
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
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
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: el.ancho === '100%' ? '100%' : `${el.ancho}px`,
            borderTop: `${el.grosor || 1}px ${el.estilo || 'solid'} ${el.color || '#000000'}`,
          }}
        />
      );
    case 'signature':
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: `${el.ancho}px`,
            textAlign: 'center',
          }}
        >
          <div style={{ borderTop: '1px solid #000', marginBottom: '4px' }} />
          <span style={{ fontFamily: el.fuente || 'Arial', fontSize: `${el.tamano || 10}px` }}>
            {el.titulo}
          </span>
        </div>
      );
    case 'space':
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: el.ancho === '100%' ? '100%' : `${el.ancho}px`,
            height: `${el.alto}px`,
          }}
        />
      );
    case 'grades_table':
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: el.ancho === '100%' ? '100%' : `${el.ancho}px`,
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
                {el.columnas.map((col: any) => (
                  <th
                    key={col.id}
                    style={{
                      backgroundColor: el.estilo_encabezado?.fondo || '#1E3A8A',
                      color: el.estilo_encabezado?.color_texto || '#FFFFFF',
                      fontFamily: el.estilo_encabezado?.fuente || 'Arial',
                      fontSize: `${el.estilo_encabezado?.tamano || 9}px`,
                      fontWeight: el.estilo_encabezado?.negrita ? 'bold' : 'normal',
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
              {MOCK_STUDENTS.map((student, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    backgroundColor:
                      el.alternar_colores
                        ? rowIdx % 2 === 0
                          ? el.estilo_cuerpo?.fondo_impar || '#FFFFFF'
                          : el.estilo_cuerpo?.fondo_par || '#F3F4F6'
                        : '#FFFFFF',
                  }}
                >
                  {el.columnas.map((col: any) => (
                    <td
                      key={col.id}
                      style={{
                        padding: '5px 4px',
                        textAlign: 'center',
                        border: el.bordes ? '1px solid #ccc' : 'none',
                      }}
                    >
                      {col.id === 'num'
                        ? student.num
                        : col.id === 'cedula'
                        ? student.cedula
                        : col.id === 'nombre'
                        ? student.nombre
                        : col.id === 'l1'
                        ? student.l1
                        : col.id === 'l2'
                        ? student.l2
                        : col.id === 'l3'
                        ? student.l3
                        : col.id === 'final'
                        ? student.final
                        : col.id === 'estado'
                        ? student.estado
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
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
            height: `${el.alto}px`,
            backgroundColor: el.fondo,
            border: `${el.borde_grosor}px ${el.borde_estilo} ${el.borde_color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: el.estilo?.alineacion === 'left' ? 'flex-start' : el.estilo?.alineacion === 'right' ? 'flex-end' : 'center',
            padding: '2px 6px',
            fontFamily: el.estilo?.fuente || 'Arial',
            fontSize: `${el.estilo?.tamano || 10}px`,
            fontWeight: el.estilo?.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo?.cursiva ? 'italic' : 'normal',
            color: el.estilo?.color || '#000000',
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

export const FormatPreview: React.FC<FormatPreviewProps> = ({ config }) => {
  const sections: Array<'header' | 'body' | 'footer'> = ['header', 'body', 'footer'];

  let currentY = config.margenes.top;

  return (
    <div className="bg-white border border-slate-300 shadow-lg overflow-hidden" style={{ maxWidth: '100%' }}>
      <div
        style={{
          position: 'relative',
          padding: `${config.margenes.top}px ${config.margenes.right}px ${config.margenes.bottom}px ${config.margenes.left}px`,
          minHeight: config.orientacion === 'portrait' ? '800px' : '600px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {sections.map((sectionName) => {
          const section = config.secciones[sectionName];
          const sectionHeight =
            typeof section.altura === 'number' ? section.altura : 100;

          const sectionTop = currentY;
          currentY += sectionHeight;

          return (
            <div
              key={sectionName}
              style={{
                position: 'relative',
                top: `${sectionTop}px`,
                height: section.altura === 'auto' ? 'auto' : `${sectionHeight}px`,
                marginBottom: section.altura === 'auto' ? '8px' : '0',
              }}
            >
              {section.elementos.map((el, idx) =>
                renderElement(el, `${sectionName}-${idx}`)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
