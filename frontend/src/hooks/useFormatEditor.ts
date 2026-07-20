import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import {
  FormatConfig,
  FormatSabana,
  FormatElement,
  SectionName,
  createDefaultConfig,
} from '../types/formatEditor.types';

interface UseFormatEditorReturn {
  formatos: FormatSabana[];
  formatoActivo: FormatSabana | null;
  config: FormatConfig;
  selectedElementId: string | null;
  selectedSection: SectionName;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  setConfig: (config: FormatConfig) => void;
  setSelectedElementId: (id: string | null) => void;
  setSelectedSection: (section: SectionName) => void;
  addElement: (section: SectionName, element: FormatElement) => void;
  updateElement: (section: SectionName, elementId: string, updates: Partial<FormatElement>) => void;
  removeElement: (section: SectionName, elementId: string) => void;
  moveElement: (section: SectionName, fromIndex: number, toIndex: number) => void;
  loadFormatos: () => Promise<void>;
  loadFormatoActivo: () => Promise<void>;
  loadFormato: (id: number) => Promise<void>;
  saveFormato: (nombre: string, imagenReferencia?: string) => Promise<void>;
  updateFormato: (id: number, nombre: string) => Promise<void>;
  activateFormato: (id: number) => Promise<void>;
  deleteFormato: (id: number) => Promise<void>;
  resetToDefault: () => void;
  getSelectedElement: () => FormatElement | null;
}

export function useFormatEditor(): UseFormatEditorReturn {
  const [formatos, setFormatos] = useState<FormatSabana[]>([]);
  const [formatoActivo, setFormatoActivo] = useState<FormatSabana | null>(null);
  const [config, setConfig] = useState<FormatConfig>(createDefaultConfig());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionName>('body');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  const loadFormatos = useCallback(async () => {
    try {
      setLoading(true);
      const data: any = await api.formatosSabana.getAll();
      setFormatos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar formatos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormatoActivo = useCallback(async () => {
    try {
      setLoading(true);
      const data: any = await api.formatosSabana.getActive();
      if (data && data.configuracion) {
        setFormatoActivo(data);
        setConfig(data.configuracion);
      }
    } catch (err: any) {
      setConfig(createDefaultConfig());
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormato = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data: any = await api.formatosSabana.getById(id);
      if (data && data.configuracion) {
        setFormatoActivo(data);
        setConfig(data.configuracion);
        setSelectedElementId(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar formato');
    } finally {
      setLoading(false);
    }
  }, []);

  const addElement = useCallback((section: SectionName, element: FormatElement) => {
    setConfig((prev) => ({
      ...prev,
      secciones: {
        ...prev.secciones,
        [section]: {
          ...prev.secciones[section],
          elementos: [...prev.secciones[section].elementos, element],
        },
      },
    }));
  }, []);

  const updateElement = useCallback((section: SectionName, elementId: string, updates: Partial<FormatElement>) => {
    setConfig((prev) => ({
      ...prev,
      secciones: {
        ...prev.secciones,
        [section]: {
          ...prev.secciones[section],
          elementos: prev.secciones[section].elementos.map((el) =>
            el.id === elementId ? { ...el, ...updates } as FormatElement : el
          ),
        },
      },
    }));
  }, []);

  const removeElement = useCallback((section: SectionName, elementId: string) => {
    setConfig((prev) => ({
      ...prev,
      secciones: {
        ...prev.secciones,
        [section]: {
          ...prev.secciones[section],
          elementos: prev.secciones[section].elementos.filter((el) => el.id !== elementId),
        },
      },
    }));
    setSelectedElementId((prev) => (prev === elementId ? null : prev));
  }, []);

  const moveElement = useCallback((section: SectionName, fromIndex: number, toIndex: number) => {
    setConfig((prev) => {
      const elementos = [...prev.secciones[section].elementos];
      const [moved] = elementos.splice(fromIndex, 1);
      elementos.splice(toIndex, 0, moved);
      return {
        ...prev,
        secciones: {
          ...prev.secciones,
          [section]: {
            ...prev.secciones[section],
            elementos,
          },
        },
      };
    });
  }, []);

  const saveFormato = useCallback(async (nombre: string, imagenReferencia?: string) => {
    try {
      setSaving(true);
      clearMessages();
      const data: any = await api.formatosSabana.create({
        nombre_formato: nombre,
        configuracion: config,
        imagen_referencia: imagenReferencia,
        es_activo: true,
      });
      setFormatoActivo(data);
      setSuccess('Formato guardado correctamente');
      await loadFormatos();
    } catch (err: any) {
      setError(err.message || 'Error al guardar formato');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [config, loadFormatos, clearMessages]);

  const updateFormato = useCallback(async (id: number, nombre: string) => {
    try {
      setSaving(true);
      clearMessages();
      const data: any = await api.formatosSabana.update(id, {
        nombre_formato: nombre,
        configuracion: config,
      });
      setFormatoActivo(data);
      setSuccess('Formato actualizado correctamente');
      await loadFormatos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar formato');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [config, loadFormatos, clearMessages]);

  const activateFormato = useCallback(async (id: number) => {
    try {
      setSaving(true);
      clearMessages();
      await api.formatosSabana.activate(id);
      await loadFormatos();
      await loadFormato(id);
      setSuccess('Cambio de formato realizado con éxito');
      toast.success('Cambio de formato realizado con éxito');
    } catch (err: any) {
      const msg = err?.message || 'Error al activar formato';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [loadFormatos, loadFormato, clearMessages]);

  const deleteFormato = useCallback(async (id: number) => {
    try {
      setSaving(true);
      clearMessages();
      await api.formatosSabana.delete(id);
      if (formatoActivo?.id_formato === id) {
        setFormatoActivo(null);
        setConfig(createDefaultConfig());
      }
      setSuccess('Formato eliminado correctamente');
      await loadFormatos();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar formato');
    } finally {
      setSaving(false);
    }
  }, [formatoActivo, loadFormatos, clearMessages]);

  const resetToDefault = useCallback(() => {
    setConfig(createDefaultConfig());
    setSelectedElementId(null);
  }, []);

  const getSelectedElement = useCallback((): FormatElement | null => {
    if (!selectedElementId) return null;
    const sectionElements = config.secciones[selectedSection].elementos;
    return sectionElements.find((el) => el.id === selectedElementId) || null;
  }, [selectedElementId, selectedSection, config]);

  return {
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
  };
}
