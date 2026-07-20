import React, { useState } from 'react';
import {
  Save,
  FolderOpen,
  RotateCcw,
  Download,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FormatSabana } from '../../types/formatEditor.types';

interface EditorToolbarProps {
  formatos: FormatSabana[];
  formatoActivo: FormatSabana | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  onLoadFormatos: () => void;
  onLoadFormato: (id: number) => void;
  onSaveNew: (nombre: string) => void;
  onUpdateCurrent: (nombre: string) => void;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
  onPrint: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  formatos,
  formatoActivo,
  loading,
  saving,
  error,
  success,
  onLoadFormatos,
  onLoadFormato,
  onSaveNew,
  onUpdateCurrent,
  onActivate,
  onDelete,
  onReset,
  onPrint,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [formatName, setFormatName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleSave = () => {
    if (!formatName.trim()) return;
    if (formatoActivo) {
      onUpdateCurrent(formatName.trim());
    } else {
      onSaveNew(formatName.trim());
    }
    setShowSaveDialog(false);
    setFormatName('');
  };

  const handleLoad = () => {
    onLoadFormatos();
    setShowLoadDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Save button */}
        <button
          onClick={() => {
            setFormatName(formatoActivo?.nombre_formato || '');
            setShowSaveDialog(true);
          }}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {formatoActivo ? 'Guardar Cambios' : 'Guardar Formato'}
        </button>

        {/* Load button */}
        <button
          onClick={handleLoad}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          <FolderOpen className="h-4 w-4" />
          Cargar Formato
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Restablecer
        </button>

        {/* Print/Preview button */}
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Vista Previa / Imprimir
        </button>

        {/* Status messages */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {formatoActivo ? 'Guardar Cambios' : 'Nuevo Formato'}
            </h3>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Nombre del Formato
            </label>
            <input
              type="text"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              placeholder="Ej: Formato Oficial Zona Educativa 2026"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setShowSaveDialog(false); setFormatName(''); }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formatName.trim() || saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-slate-800">Cargar Formato</h3>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                  <p className="text-sm text-slate-500 mt-2">Cargando formatos...</p>
                </div>
              ) : formatos.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No hay formatos guardados</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formatos.map((f) => (
                    <div
                      key={f.id_formato}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        f.es_activo
                          ? 'border-green-300 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 text-sm">{f.nombre_formato}</span>
                          {f.es_activo && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Modificado: {new Date(f.fecha_modificacion).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onLoadFormato(f.id_formato);
                            setShowLoadDialog(false);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          Editar
                        </button>
                        {!f.es_activo && (
                          <button
                            onClick={() => {
                              onActivate(f.id_formato);
                              setShowLoadDialog(false);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 rounded-lg"
                          >
                            Activar
                          </button>
                        )}
                        {!f.es_activo && (
                          <div className="relative">
                            {confirmDelete === f.id_formato ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    onDelete(f.id_formato);
                                    setConfirmDelete(null);
                                    setShowLoadDialog(false);
                                  }}
                                  className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(f.id_formato)}
                                className="px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 rounded-lg"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
