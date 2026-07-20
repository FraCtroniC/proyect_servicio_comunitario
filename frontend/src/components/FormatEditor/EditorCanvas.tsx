import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { FormatConfig, FormatElement, SectionName } from '../../types/formatEditor.types';

interface EditorCanvasProps {
  config: FormatConfig;
  selectedElementId: string | null;
  selectedSection: SectionName;
  onSelectElement: (id: string, section: SectionName) => void;
  onSelectSection: (section: SectionName) => void;
  onMoveElement: (section: SectionName, from: number, to: number) => void;
  onRemoveElement: (section: SectionName, id: string) => void;
  onUpdateSectionHeight: (section: SectionName, height: number | string) => void;
}

const SECTION_LABELS: Record<SectionName, string> = {
  header: 'Encabezado (Header)',
  body: 'Cuerpo (Body)',
  footer: 'Pie de página (Footer)',
};

const SECTION_COLORS: Record<SectionName, string> = {
  header: 'border-t-blue-500',
  body: 'border-t-green-500',
  footer: 'border-t-orange-500',
};

const renderElementPreview = (el: FormatElement): React.ReactNode => {
  switch (el.tipo) {
    case 'text':
      return (
        <span
          style={{
            fontFamily: el.estilo.fuente,
            fontSize: `${el.estilo.tamano}px`,
            fontWeight: el.estilo.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo.cursiva ? 'italic' : 'normal',
            color: el.estilo.color,
            textAlign: el.estilo.alineacion,
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
            display: 'block',
          }}
        >
          {el.contenido}
        </span>
      );
    case 'field':
      return (
        <span
          style={{
            fontFamily: el.estilo.fuente,
            fontSize: `${el.estilo.tamano}px`,
            fontWeight: el.estilo.negrita ? 'bold' : 'normal',
            fontStyle: el.estilo.cursiva ? 'italic' : 'normal',
            color: el.estilo.color,
            textAlign: el.estilo.alineacion,
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
            display: 'block',
            backgroundColor: '#EFF6FF',
            border: '1px dashed #3B82F6',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          [{el.label}]
        </span>
      );
    case 'image':
      return (
        <img
          src={el.contenido}
          alt="Logo"
          style={{
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
            height: `${el.alto}px`,
            objectFit: 'contain',
          }}
        />
      );
    case 'line':
      return (
        <div
          style={{
            borderTop: `${el.grosor}px ${el.estilo} ${el.color}`,
            width: typeof el.ancho === 'string' ? el.ancho : `${el.ancho}px`,
          }}
        />
      );
    case 'signature':
      return (
        <div className="text-center">
          <div
            style={{
              width: `${el.ancho}px`,
              borderTop: '1px solid #000',
              margin: '0 auto 4px',
            }}
          />
          <span
            style={{
              fontFamily: el.fuente,
              fontSize: `${el.tamano}px`,
            }}
          >
            {el.titulo}
          </span>
        </div>
      );
    case 'space':
      return (
        <div
          style={{
            height: `${el.alto}px`,
            backgroundColor: '#F3F4F6',
            border: '1px dashed #D1D5DB',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#9CA3AF',
          }}
        >
          Espacio: {el.alto}px
        </div>
      );
    case 'grades_table':
      return (
        <div className="w-full overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ backgroundColor: el.estilo_encabezado.fondo, color: el.estilo_encabezado.color_texto }}>
                {el.columnas.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      width: `${col.ancho}px`,
                      fontFamily: el.estilo_encabezado.fuente,
                      fontSize: `${el.estilo_encabezado.tamano}px`,
                      fontWeight: el.estilo_encabezado.negrita ? 'bold' : 'normal',
                      padding: '4px',
                      textAlign: 'center',
                      border: el.bordes ? '1px solid #ccc' : 'none',
                    }}
                  >
                    {col.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr
                  key={row}
                  style={{
                    backgroundColor: el.alternar_colores
                      ? row % 2 === 0
                        ? el.estilo_cuerpo.fondo_par
                        : el.estilo_cuerpo.fondo_impar
                      : '#FFFFFF',
                  }}
                >
                  {el.columnas.map((col) => (
                    <td
                      key={col.id}
                      style={{
                        padding: '4px',
                        textAlign: 'center',
                        fontFamily: el.estilo_cuerpo.fuente,
                        fontSize: `${el.estilo_cuerpo.tamano}px`,
                        border: el.bordes ? '1px solid #ccc' : 'none',
                      }}
                    >
                      {col.id === 'num' ? row : '---'}
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
          style={{
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
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {el.contenido || <span style={{ color: '#9CA3AF', fontSize: '10px' }}>Celda vacía</span>}
        </div>
      );
    default:
      return <span className="text-xs text-slate-400">Elemento desconocido</span>;
  }
};

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  config,
  selectedElementId,
  selectedSection,
  onSelectElement,
  onSelectSection,
  onMoveElement,
  onRemoveElement,
  onUpdateSectionHeight,
}) => {
  const [editingHeight, setEditingHeight] = useState<Record<string, string>>({});

  const sections: SectionName[] = ['header', 'body', 'footer'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[500px]">
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Área de Edición
        </h4>
      </div>

      {sections.map((sectionName) => {
        const section = config.secciones[sectionName];
        const isSelected = selectedSection === sectionName;
        const sectionHeight = section.altura;

        return (
          <div
            key={sectionName}
            className={`mb-4 border-2 rounded-lg transition-colors ${
              isSelected
                ? 'border-blue-400 bg-blue-50/30'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => onSelectSection(sectionName)}
          >
            <div
              className={`flex items-center justify-between px-3 py-2 border-b ${SECTION_COLORS[sectionName]} border-t-2 bg-slate-50 rounded-t-lg`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  {SECTION_LABELS[sectionName]}
                </span>
                <span className="text-xs text-slate-400">
                  ({section.elementos.length} elemento{section.elementos.length !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Altura:</label>
                <input
                  type="text"
                  value={editingHeight[sectionName] ?? sectionHeight}
                  onChange={(e) => {
                    setEditingHeight((prev) => ({ ...prev, [sectionName]: e.target.value }));
                  }}
                  onBlur={() => {
                    const val = editingHeight[sectionName];
                    if (val !== undefined) {
                      const parsed = isNaN(Number(val)) ? val : Number(val);
                      onUpdateSectionHeight(sectionName, parsed);
                      setEditingHeight((prev) => {
                        const copy = { ...prev };
                        delete copy[sectionName];
                        return copy;
                      });
                    }
                  }}
                  className="w-20 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="auto"
                />
              </div>
            </div>

            <div className="p-3 min-h-[60px]">
              {section.elementos.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                  Arrastra elementos aquí desde la paleta
                </div>
              ) : (
                <div className="space-y-2">
                  {section.elementos.map((el, idx) => {
                    const isElementSelected = selectedElementId === el.id;
                    return (
                      <div
                        key={el.id}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                          isElementSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectElement(el.id, sectionName);
                        }}
                      >
                        <div className="flex flex-col gap-0.5 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx > 0) onMoveElement(sectionName, idx, idx - 1);
                            }}
                            disabled={idx === 0}
                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx < section.elementos.length - 1)
                                onMoveElement(sectionName, idx, idx + 1);
                            }}
                            disabled={idx === section.elementos.length - 1}
                            className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                          {renderElementPreview(el)}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveElement(sectionName, el.id);
                          }}
                          className="text-slate-400 hover:text-red-500 pt-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
