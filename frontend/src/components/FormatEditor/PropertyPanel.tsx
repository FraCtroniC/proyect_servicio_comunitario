import React, { useRef, useEffect } from 'react';
import {
  FormatElement,
  TextElement,
  FieldElement,
  ImageElement,
  GradesTableElement,
  LineElement,
  SignatureElement,
  CuadriculaElement,
  AVAILABLE_FIELDS,
  FONT_OPTIONS,
} from '../../types/formatEditor.types';

interface PropertyPanelProps {
  element: FormatElement | null;
  onUpdate: (updates: Partial<FormatElement>) => void;
  onDelete: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ element, onUpdate, onDelete }) => {
  if (!element) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-slate-400 mb-3">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  const renderTextProps = (el: TextElement | FieldElement | CuadriculaElement) => (
    <>
      {'contenido' in el && (
        <PropField label="Contenido">
          <textarea
            value={el.contenido}
            onChange={(e) => onUpdate({ contenido: e.target.value } as any)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        </PropField>
      )}
      {'campo' in el && (
        <PropField label="Campo de Datos">
          <select
            value={el.campo}
            onChange={(e) => onUpdate({ campo: e.target.value } as any)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {AVAILABLE_FIELDS.map((f) => (
              <option key={f.campo} value={f.campo}>{f.label}</option>
            ))}
          </select>
        </PropField>
      )}
      <PropField label="Fuente">
        <select
          value={el.estilo.fuente}
          onChange={(e) => onUpdate({ estilo: { ...el.estilo, fuente: e.target.value } } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </PropField>
      <PropField label="Tamaño">
        <WheelNumberInput
          value={el.estilo.tamano}
          onChange={(val) => onUpdate({ estilo: { ...el.estilo, tamano: val } } as any)}
          min={6}
          max={72}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Alineación">
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ estilo: { ...el.estilo, alineacion: a } } as any)}
              className={`flex-1 py-2 text-sm rounded-lg border ${
                el.estilo.alineacion === a
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              {a === 'left' ? '⬅' : a === 'center' ? '⬛' : '➡'}
            </button>
          ))}
        </div>
      </PropField>
      <PropField label="Color">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.estilo.color}
            onChange={(e) => onUpdate({ estilo: { ...el.estilo, color: e.target.value } } as any)}
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.estilo.color}
            onChange={(e) => onUpdate({ estilo: { ...el.estilo, color: e.target.value } } as any)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <div className="flex gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={el.estilo.negrita}
            onChange={(e) => onUpdate({ estilo: { ...el.estilo, negrita: e.target.checked } } as any)}
            className="rounded"
          />
          Negrita
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={el.estilo.cursiva}
            onChange={(e) => onUpdate({ estilo: { ...el.estilo, cursiva: e.target.checked } } as any)}
            className="rounded"
          />
          Cursiva
        </label>
      </div>
    </>
  );

  const renderPositionProps = () => (
    <>
      <PropField label="Posición X (px)">
        <WheelNumberInput
          value={element.x}
          onChange={(val) => onUpdate({ x: val })}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Posición Y (px)">
        <WheelNumberInput
          value={element.y}
          onChange={(val) => onUpdate({ y: val })}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Ancho">
        <input
          type="text"
          value={element.ancho}
          onChange={(e) => onUpdate({ ancho: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) })}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="px o %"
        />
      </PropField>
    </>
  );

  const renderImageProps = (el: ImageElement) => (
    <>
      <PropField label="Ancho (px)">
        <WheelNumberInput
          value={el.ancho as number}
          onChange={(val) => onUpdate({ ancho: val })}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Alto (px)">
        <WheelNumberInput
          value={el.alto}
          onChange={(val) => onUpdate({ alto: val } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Alineación">
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ alineacion: a } as any)}
              className={`flex-1 py-2 text-sm rounded-lg border ${
                el.alineacion === a
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              {a === 'left' ? '⬅' : a === 'center' ? '⬛' : '➡'}
            </button>
          ))}
        </div>
      </PropField>
      <div className="mt-2">
        <img src={el.contenido} alt="Preview" className="max-h-20 mx-auto rounded border" />
      </div>
    </>
  );

  const renderLineProps = (el: LineElement) => (
    <>
      <PropField label="Grosor (px)">
        <WheelNumberInput
          value={el.grosor}
          onChange={(val) => onUpdate({ grosor: val } as any)}
          min={1}
          max={10}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Color">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.color}
            onChange={(e) => onUpdate({ color: e.target.value } as any)}
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.color}
            onChange={(e) => onUpdate({ color: e.target.value } as any)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <PropField label="Estilo">
        <select
          value={el.estilo}
          onChange={(e) => onUpdate({ estilo: e.target.value } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="solid">Sólida</option>
          <option value="dashed">Discontinua</option>
          <option value="dotted">Punteada</option>
        </select>
      </PropField>
    </>
  );

  const renderSignatureProps = (el: SignatureElement) => (
    <>
      <PropField label="Título de la Firma">
        <input
          type="text"
          value={el.titulo}
          onChange={(e) => onUpdate({ titulo: e.target.value } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Ancho (px)">
        <WheelNumberInput
          value={el.ancho as number}
          onChange={(val) => onUpdate({ ancho: val } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Fuente">
        <select
          value={el.fuente}
          onChange={(e) => onUpdate({ fuente: e.target.value } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </PropField>
      <PropField label="Tamaño Fuente">
        <WheelNumberInput
          value={el.tamano}
          onChange={(val) => onUpdate({ tamano: val } as any)}
          min={6}
          max={36}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
    </>
  );

  const renderSpaceProps = (el: any) => (
    <PropField label="Alto (px)">
      <WheelNumberInput
        value={el.alto}
        onChange={(val) => onUpdate({ alto: val } as any)}
        min={5}
        max={200}
        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </PropField>
  );

  const renderCuadriculaProps = (el: CuadriculaElement) => (
    <>
      <PropField label="Contenido">
        <textarea
          value={el.contenido}
          onChange={(e) => onUpdate({ contenido: e.target.value } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={2}
          placeholder="Texto de la celda..."
        />
      </PropField>
      <PropField label="Alto (px)">
        <WheelNumberInput
          value={el.alto}
          onChange={(val) => onUpdate({ alto: val } as any)}
          min={10}
          max={500}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Color de Fondo">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.fondo}
            onChange={(e) => onUpdate({ fondo: e.target.value } as any)}
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.fondo}
            onChange={(e) => onUpdate({ fondo: e.target.value } as any)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <PropField label="Color Borde">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.borde_color}
            onChange={(e) => onUpdate({ borde_color: e.target.value } as any)}
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.borde_color}
            onChange={(e) => onUpdate({ borde_color: e.target.value } as any)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <PropField label="Grosor Borde (px)">
        <WheelNumberInput
          value={el.borde_grosor}
          onChange={(val) => onUpdate({ borde_grosor: val } as any)}
          min={0}
          max={10}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </PropField>
      <PropField label="Estilo Borde">
        <select
          value={el.borde_estilo}
          onChange={(e) => onUpdate({ borde_estilo: e.target.value } as any)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="solid">Sólida</option>
          <option value="dashed">Discontinua</option>
          <option value="dotted">Punteada</option>
        </select>
      </PropField>
      {renderTextProps(el)}
    </>
  );

  const renderTableProps = (el: GradesTableElement) => (
    <>
      <PropField label="Bordes">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={el.bordes}
            onChange={(e) => onUpdate({ bordes: e.target.checked } as any)}
            className="rounded"
          />
          Mostrar bordes
        </label>
      </PropField>
      <PropField label="Alternar Colores">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={el.alternar_colores}
            onChange={(e) => onUpdate({ alternar_colores: e.target.checked } as any)}
            className="rounded"
          />
          Filas alternas
        </label>
      </PropField>
      <PropField label="Color Encabezado">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.estilo_encabezado.fondo}
            onChange={(e) =>
              onUpdate({
                estilo_encabezado: { ...el.estilo_encabezado, fondo: e.target.value },
              } as any)
            }
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.estilo_encabezado.fondo}
            onChange={(e) =>
              onUpdate({
                estilo_encabezado: { ...el.estilo_encabezado, fondo: e.target.value },
              } as any)
            }
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <PropField label="Color Texto Encabezado">
        <div className="flex gap-2">
          <input
            type="color"
            value={el.estilo_encabezado.color_texto}
            onChange={(e) =>
              onUpdate({
                estilo_encabezado: { ...el.estilo_encabezado, color_texto: e.target.value },
              } as any)
            }
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={el.estilo_encabezado.color_texto}
            onChange={(e) =>
              onUpdate({
                estilo_encabezado: { ...el.estilo_encabezado, color_texto: e.target.value },
              } as any)
            }
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PropField>
      <PropField label="Columnas">
        <div className="space-y-1">
          {el.columnas.map((col, idx) => (
            <div key={col.id} className="flex items-center gap-1 text-xs">
              <span className="w-4 text-slate-400">{idx + 1}.</span>
              <input
                type="text"
                value={col.nombre}
                onChange={(e) => {
                  const newCols = [...el.columnas];
                  newCols[idx] = { ...col, nombre: e.target.value };
                  onUpdate({ columnas: newCols } as any);
                }}
                className="flex-1 px-2 py-1 border rounded"
              />
              <WheelNumberInput
                value={col.ancho}
                onChange={(val) => {
                  const newCols = [...el.columnas];
                  newCols[idx] = { ...col, ancho: val };
                  onUpdate({ columnas: newCols } as any);
                }}
                className="w-16 px-2 py-1 border rounded"
              />
            </div>
          ))}
        </div>
      </PropField>
    </>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Propiedades
        </h4>
        <button
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Eliminar
        </button>
      </div>

      <div className="px-1 py-2 bg-slate-50 rounded-lg text-xs text-slate-500">
        <strong>Tipo:</strong> {element.tipo === 'grades_table' ? 'Tabla de Notas' : element.tipo === 'cuadricula' ? 'Celdilla' : element.tipo}
      </div>

      {renderPositionProps()}

      {element.tipo === 'text' && renderTextProps(element)}
      {element.tipo === 'field' && renderTextProps(element)}
      {element.tipo === 'image' && renderImageProps(element)}
      {element.tipo === 'line' && renderLineProps(element)}
      {element.tipo === 'signature' && renderSignatureProps(element)}
      {element.tipo === 'space' && renderSpaceProps(element)}
      {element.tipo === 'grades_table' && renderTableProps(element)}
      {element.tipo === 'cuadricula' && renderCuadriculaProps(element as CuadriculaElement)}
    </div>
  );
};

interface WheelNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const WheelNumberInput: React.FC<WheelNumberInputProps> = ({ value, onChange, min, max, step = 1, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -step : step;
      let newVal = value + delta;
      if (min !== undefined) newVal = Math.max(min, newVal);
      if (max !== undefined) newVal = Math.min(max, newVal);
      onChange(newVal);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [value, onChange, min, max, step]);

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className={className}
    />
  );
};

const PropField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
    {children}
  </div>
);
