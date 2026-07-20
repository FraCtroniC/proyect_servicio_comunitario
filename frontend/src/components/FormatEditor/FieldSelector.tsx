import React from 'react';
import { AVAILABLE_FIELDS, FieldElement, DEFAULT_TEXT_STYLE, generateId } from '../../types/formatEditor.types';

interface FieldSelectorProps {
  onSelect: (field: FieldElement) => void;
  onClose: () => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ onSelect, onClose }) => {
  const categories = Array.from(new Set(AVAILABLE_FIELDS.map((f) => f.categoria)));

  const handleSelect = (campo: string, label: string) => {
    const element: FieldElement = {
      id: generateId(),
      tipo: 'field',
      campo,
      label,
      x: 10,
      y: 0,
      ancho: 200,
      estilo: { ...DEFAULT_TEXT_STYLE },
    };
    onSelect(element);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-800">Seleccionar Campo de Datos</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {categories.map((cat) => (
            <div key={cat}>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{cat}</h4>
              <div className="space-y-1">
                {AVAILABLE_FIELDS.filter((f) => f.categoria === cat).map((field) => (
                  <button
                    key={field.campo}
                    onClick={() => handleSelect(field.campo, field.label)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-slate-700 transition-colors"
                  >
                    <span className="font-medium">{field.label}</span>
                    <span className="ml-2 text-xs text-slate-400">{field.campo}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
