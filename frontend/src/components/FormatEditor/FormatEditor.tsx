import React, { useEffect, useState } from 'react';
import { FileEdit, Loader2, Upload, X } from 'lucide-react';
import { useFormatEditor } from '../../hooks/useFormatEditor';
import { ElementType, FormatElement, SectionName, DEFAULT_TEXT_STYLE, generateId } from '../../types/formatEditor.types';
import { EditorToolbar } from './EditorToolbar';
import { ElementPalette } from './ElementPalette';
import { EditorCanvas } from './EditorCanvas';
import { PropertyPanel } from './PropertyPanel';
import { FormatPreview } from './FormatPreview';
import { ImageUploader } from './ImageUploader';

export const FormatEditor: React.FC = () => {
  const {
    formatos,
    formatoActivo,
    config,
    selectedElementId,
    selectedSection,
    loading,
    saving,
    error,
    success,
    setConfig,
    setSelectedElementId,
    setSelectedSection,
    addElement,
    updateElement,
    removeElement,
    moveElement,
    loadFormatos,
    loadFormatoActivo,
    loadFormato,
    saveFormato,
    updateFormato,
    activateFormato,
    deleteFormato,
    resetToDefault,
    getSelectedElement,
  } = useFormatEditor();

  const [showReferenceUpload, setShowReferenceUpload] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadFormatoActivo();
      setInitialized(true);
    };
    init();
  }, []);

  const handleAddElement = (tipo: ElementType) => {
    let element: FormatElement;

    switch (tipo) {
      case 'text':
        element = {
          id: generateId(),
          tipo: 'text',
          contenido: 'Nuevo texto',
          x: 10,
          y: 0,
          ancho: 200,
          estilo: { ...DEFAULT_TEXT_STYLE },
        };
        break;
      case 'field':
        return;
      case 'image':
        return;
      case 'grades_table':
        element = {
          id: generateId(),
          tipo: 'grades_table',
          x: 0,
          y: 0,
          ancho: '100%',
          columnas: [
            { id: 'num', nombre: 'N', ancho: 30, campo_dato: null },
            { id: 'cedula', nombre: 'CÉDULA', ancho: 70, campo_dato: 'student.cedula' },
            { id: 'nombre', nombre: 'NOMBRE Y APELLIDO', ancho: 180, campo_dato: 'student.full_name' },
            { id: 'l1', nombre: 'LAPSO 1', ancho: 60, campo_dato: 'grades.lapso1' },
            { id: 'l2', nombre: 'LAPSO 2', ancho: 60, campo_dato: 'grades.lapso2' },
            { id: 'l3', nombre: 'LAPSO 3', ancho: 60, campo_dato: 'grades.lapso3' },
            { id: 'final', nombre: 'NOTA FINAL', ancho: 60, campo_dato: 'grades.final' },
            { id: 'estado', nombre: 'ESTADO', ancho: 60, campo_dato: 'grades.status' },
          ],
          estilo_encabezado: {
            fondo: '#1E3A8A',
            color_texto: '#FFFFFF',
            fuente: 'Arial',
            tamano: 9,
            negrita: true,
          },
          estilo_cuerpo: {
            fondo_par: '#F3F4F6',
            fondo_impar: '#FFFFFF',
            fuente: 'Arial',
            tamano: 9,
            alineacion: 'center',
          },
          bordes: true,
          alternar_colores: true,
        };
        break;
      case 'line':
        element = {
          id: generateId(),
          tipo: 'line',
          x: 0,
          y: 0,
          ancho: '100%',
          grosor: 1,
          color: '#000000',
          estilo: 'solid',
        };
        break;
      case 'signature':
        element = {
          id: generateId(),
          tipo: 'signature',
          titulo: 'FIRMA',
          x: 50,
          y: 10,
          ancho: 150,
          fuente: 'Arial',
          tamano: 10,
        };
        break;
      case 'space':
        element = {
          id: generateId(),
          tipo: 'space',
          x: 0,
          y: 0,
          ancho: '100%',
          alto: 30,
        };
        break;
      case 'cuadricula':
        element = {
          id: generateId(),
          tipo: 'cuadricula',
          x: 10,
          y: 0,
          ancho: 150,
          alto: 40,
          contenido: '',
          fondo: 'transparent',
          borde_color: '#000000',
          borde_grosor: 1,
          borde_estilo: 'solid',
          estilo: { ...DEFAULT_TEXT_STYLE },
        };
        break;
      default:
        return;
    }

    addElement(selectedSection, element);
    setSelectedElementId(element.id);
  };

  const handleAddFieldElement = (campo: string, label: string) => {
    const element: FormatElement = {
      id: generateId(),
      tipo: 'field',
      campo,
      label,
      x: 10,
      y: 0,
      ancho: 200,
      estilo: { ...DEFAULT_TEXT_STYLE },
    };
    addElement(selectedSection, element);
    setSelectedElementId(element.id);
  };

  const handleAddImageElement = (data: string) => {
    const element: FormatElement = {
      id: generateId(),
      tipo: 'image',
      contenido: data,
      x: 10,
      y: 10,
      ancho: 80,
      alto: 80,
      alineacion: 'center',
    };
    addElement(selectedSection, element);
    setSelectedElementId(element.id);
  };

  const handleUpdateSectionHeight = (section: SectionName, height: number | string) => {
    setConfig({
      ...config,
      secciones: {
        ...config.secciones,
        [section]: {
          ...config.secciones[section],
          altura: height,
        },
      },
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const previewEl = document.getElementById('sidebar-preview-content');
    if (!previewEl) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sábana de Notas - Imprimir</title>
        <style>
          @page { margin: 0; }
          body { margin: 0; padding: 0; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${previewEl.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenProperties = (id: string, section: SectionName) => {
    setSelectedElementId(id);
    setSelectedSection(section);
    setShowPropertiesModal(true);
  };

  const handleCloseProperties = () => {
    setShowPropertiesModal(false);
  };

  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-500 mt-4">Cargando editor de formatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <FileEdit className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edición de Formatos</h2>
            <p className="text-sm text-slate-500">
              Diseña el formato de la sábana de calificaciones
              {formatoActivo && (
                <span className="ml-2 text-green-600 font-medium">
                  — Activo: {formatoActivo.nombre_formato}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        formatos={formatos}
        formatoActivo={formatoActivo}
        loading={loading}
        saving={saving}
        error={error}
        success={success}
        onLoadFormatos={loadFormatos}
        onLoadFormato={loadFormato}
        onSaveNew={saveFormato}
        onUpdateCurrent={(nombre) => formatoActivo && updateFormato(formatoActivo.id_formato, nombre)}
        onActivate={activateFormato}
        onDelete={deleteFormato}
        onReset={resetToDefault}
        onPrint={handlePrint}
      />

      {/* Reference image upload button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReferenceUpload(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Subir Formato de Referencia (Word/PDF)
        </button>
        {referenceImage && (
          <span className="text-xs text-green-600">✓ Referencia cargada</span>
        )}
      </div>

      {/* Main editor layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Palette */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-3">
          <ElementPalette
            onAddElement={handleAddElement}
            onAddFieldElement={handleAddFieldElement}
            onAddImageElement={handleAddImageElement}
          />
        </div>

        {/* Center: Canvas */}
        <div className="col-span-5">
          <EditorCanvas
            config={config}
            selectedElementId={selectedElementId}
            selectedSection={selectedSection}
            onSelectElement={handleOpenProperties}
            onSelectSection={setSelectedSection}
            onMoveElement={moveElement}
            onRemoveElement={removeElement}
            onUpdateSectionHeight={handleUpdateSectionHeight}
          />
        </div>

        {/* Right: Live Preview */}
        <div className="col-span-5 bg-white rounded-xl border border-slate-200 p-4 max-h-[700px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vista Previa en Vivo</h4>
            <button
              onClick={handlePrint}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Imprimir
            </button>
          </div>
          <div id="sidebar-preview-content">
            <FormatPreview config={config} />
          </div>
        </div>
      </div>

      {/* Properties Modal */}
      {showPropertiesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-slate-800">Propiedades del Elemento</h3>
              <button
                onClick={handleCloseProperties}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <PropertyPanel
                element={getSelectedElement()}
                onUpdate={(updates) => {
                  if (selectedElementId) {
                    updateElement(selectedSection, selectedElementId, updates);
                  }
                }}
                onDelete={() => {
                  if (selectedElementId) {
                    removeElement(selectedSection, selectedElementId);
                    setShowPropertiesModal(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reference upload dialog */}
      {showReferenceUpload && (
        <ImageUploader
          mode="reference"
          onImageSelected={(data) => {
            setReferenceImage(data);
            setShowReferenceUpload(false);
          }}
          onClose={() => setShowReferenceUpload(false)}
        />
      )}
    </div>
  );
};
