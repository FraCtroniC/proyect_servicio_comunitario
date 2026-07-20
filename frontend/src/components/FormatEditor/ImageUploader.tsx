import React, { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { ImageElement, generateId } from '../../types/formatEditor.types';

interface ImageUploaderProps {
  mode: 'logo' | 'reference';
  onImageSelected: (data: string) => void;
  onElementCreated?: (element: ImageElement) => void;
  onClose: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  mode,
  onImageSelected,
  onElementCreated,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (mode === 'reference' && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelected(result);
      if (onElementCreated) {
        onElementCreated({
          id: generateId(),
          tipo: 'image',
          contenido: result,
          x: 10,
          y: 10,
          ancho: 80,
          alto: 80,
          alineacion: 'center',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-800">
            {mode === 'logo' ? 'Subir Logo/Imagen' : 'Subir Formato Referencia'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>
        <div className="p-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
            }`}
          >
            {preview ? (
              <div className="space-y-3">
                {mode === 'logo' ? (
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <FileText className="h-8 w-8" />
                    <span>Archivo cargado</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {mode === 'logo' ? (
                  <ImageIcon className="h-12 w-12 mx-auto text-slate-400" />
                ) : (
                  <Upload className="h-12 w-12 mx-auto text-slate-400" />
                )}
                <p className="text-sm text-slate-600">
                  {mode === 'logo'
                    ? 'Arrastra una imagen o haz clic para seleccionar'
                    : 'Arrastra un archivo Word/PDF o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-slate-400">
                  {mode === 'logo' ? 'PNG, JPG, SVG, GIF' : 'PDF, DOCX, PNG, JPG'}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={mode === 'logo' ? 'image/*' : 'image/*,.pdf,.docx'}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancelar
          </button>
          {preview && (
            <button
              onClick={() => { onImageSelected(preview); onClose(); }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Usar Imagen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
