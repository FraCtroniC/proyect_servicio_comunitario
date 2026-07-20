import React, { useState } from 'react';
import {
  Type,
  FormInput,
  Image,
  Table2,
  Minus,
  PenLine,
  ArrowUpDown,
  Grid3x3,
} from 'lucide-react';
import { ElementType } from '../../types/formatEditor.types';
import { FieldSelector } from './FieldSelector';
import { ImageUploader } from './ImageUploader';

interface ElementPaletteProps {
  onAddElement: (tipo: ElementType) => void;
  onAddFieldElement: (campo: string, label: string) => void;
  onAddImageElement: (data: string) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  onAddElement,
  onAddFieldElement,
  onAddImageElement,
}) => {
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const elements: { tipo: ElementType; label: string; icon: React.ReactNode; color: string }[] = [
    { tipo: 'text', label: 'Texto Fijo', icon: <Type className="h-5 w-5" />, color: 'text-blue-600' },
    { tipo: 'field', label: 'Campo de Datos', icon: <FormInput className="h-5 w-5" />, color: 'text-green-600' },
    { tipo: 'image', label: 'Imagen / Logo', icon: <Image className="h-5 w-5" />, color: 'text-purple-600' },
    { tipo: 'grades_table', label: 'Tabla de Notas', icon: <Table2 className="h-5 w-5" />, color: 'text-orange-600' },
    { tipo: 'line', label: 'Línea Separadora', icon: <Minus className="h-5 w-5" />, color: 'text-slate-600' },
    { tipo: 'signature', label: 'Firma', icon: <PenLine className="h-5 w-5" />, color: 'text-teal-600' },
    { tipo: 'space', label: 'Espacio Vacío', icon: <ArrowUpDown className="h-5 w-5" />, color: 'text-slate-400' },
    { tipo: 'cuadricula', label: 'Celdilla', icon: <Grid3x3 className="h-5 w-5" />, color: 'text-indigo-600' },
  ];

  const handleClick = (tipo: ElementType) => {
    if (tipo === 'field') {
      setShowFieldSelector(true);
    } else if (tipo === 'image') {
      setShowImageUploader(true);
    } else {
      onAddElement(tipo);
    }
  };

  return (
    <>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide px-2 mb-2">
          Elementos Disponibles
        </h4>
        {elements.map((el) => (
          <button
            key={el.tipo}
            onClick={() => handleClick(el.tipo)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className={el.color}>{el.icon}</span>
            <span>{el.label}</span>
          </button>
        ))}
      </div>

      {showFieldSelector && (
        <FieldSelector
          onSelect={(element) => onAddFieldElement(element.campo, element.label)}
          onClose={() => setShowFieldSelector(false)}
        />
      )}

      {showImageUploader && (
        <ImageUploader
          mode="logo"
          onImageSelected={(data) => {
            onAddImageElement(data);
            setShowImageUploader(false);
          }}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </>
  );
};
