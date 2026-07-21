import React, { useState } from 'react';
import { Book, Plus, Filter, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { StudyPlanItem, UserRole, StudyPlanVersion } from '../types';
import { Modal } from './Modal';
import { Tooltip } from './Tooltip';

interface SubjectManagerProps {
  studyPlans: StudyPlanItem[];
  studyPlanVersions: StudyPlanVersion[];
  currentUserRole: UserRole;
  onAddStudyPlanItem: (name: string, year: number, codigo: string, posicion: number, tipoCalificacion: string, id_tipo_plan: number) => void;
  onUpdateStudyPlanItem?: (id: string, name: string, year: number, codigo: string, posicion: number, tipoCalificacion: string, id_tipo_plan: number) => void;
  onDeleteStudyPlanItem?: (id: string) => void;
  onAddStudyPlanVersion?: (name: string) => Promise<any>;
  onDeleteStudyPlanVersion?: (id: number) => Promise<any>;
}

export default function SubjectManager({ studyPlans, studyPlanVersions, currentUserRole, onAddStudyPlanItem, onUpdateStudyPlanItem, onDeleteStudyPlanItem, onAddStudyPlanVersion, onDeleteStudyPlanVersion }: SubjectManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlanItem | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<StudyPlanItem | null>(null);

  // New Version Modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');

  // Delete Version Modal
  const [isDeleteVersionModalOpen, setIsDeleteVersionModalOpen] = useState(false);

  // Filters
  const defaultVersion = studyPlanVersions.length > 0 ? studyPlanVersions[0].id_tipo_plan : 1;
  const [selectedVersion, setSelectedVersion] = useState<number>(defaultVersion);
  const [filterYear, setFilterYear] = useState<number | 'Todos'>('Todos');

  // Form states
  const [nombre, setNombre] = useState('');
  const [year, setYear] = useState<number>(1);
  const [codigo, setCodigo] = useState('');
  const [posicion, setPosicion] = useState<number>(1);
  const [tipoCalificacion, setTipoCalificacion] = useState<string>('Cuantitativo');
  const [formSelectedVersion, setFormSelectedVersion] = useState<number>(defaultVersion);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateName = (val: string): boolean => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(val.trim());

  const handleFieldChange = (name: string, val: string, setter: (v: any) => void, type: 'text' | 'number' = 'text') => {
    setter(type === 'number' ? Number(val) : val);
    const newErrors = { ...fieldErrors };
    if (type === 'text' && name === 'nombre') {
      if (val && !validateName(val)) { newErrors[name] = 'Solo se permiten letras y espacios.'; }
      else if (!val.trim()) { newErrors[name] = 'El nombre es requerido.'; }
      else { delete newErrors[name]; }
    }
    if (name === 'codigo') {
      if (/\s/.test(val)) { newErrors[name] = 'El código no puede contener espacios.'; }
      else if (!val.trim()) { newErrors[name] = 'El código es requerido.'; }
      else { delete newErrors[name]; }
    }
    if (type === 'number' && name === 'posicion') {
      if (Number(val) < 1) { newErrors[name] = 'La posición debe ser mayor a 0.'; }
      else { delete newErrors[name]; }
    }
    setFieldErrors(newErrors);
  };

  const checkDuplicate = (field: string) => {
    const newErrors = { ...fieldErrors };
    const otherPlans = studyPlans.filter(p => editingPlan ? p.id !== editingPlan.id : true);
    if (field === 'codigo') {
      const dup = otherPlans.find(p => p.codigo?.toUpperCase() === codigo.toUpperCase() && p.year === year);
      if (dup) { newErrors.codigo = 'Este código ya existe para el año seleccionado.'; }
      else { delete newErrors.codigo; }
    }
    if (field === 'posicion') {
      const dup = otherPlans.find(p => p.posicion === posicion && p.year === year);
      if (dup) { newErrors.posicion = 'Esta posición ya está ocupada en el año seleccionado.'; }
      else { delete newErrors.posicion; }
    }
    if (field === 'nombre') {
      const dup = otherPlans.find(p => p.subjectName.toLowerCase() === nombre.trim().toLowerCase() && p.year === year);
      if (dup) { newErrors.nombre = 'Esta materia ya está registrada en el año seleccionado.'; }
      else { delete newErrors.nombre; }
    }
    setFieldErrors(newErrors);
  };

  const openAddModal = () => {
    setEditingPlan(null);
    setNombre('');
    setYear(filterYear === 'Todos' ? 1 : filterYear);
    setCodigo('');
    setPosicion(1);
    setTipoCalificacion('Cuantitativo');
    setFormSelectedVersion(selectedVersion);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (plan: StudyPlanItem) => {
    setEditingPlan(plan);
    setNombre(plan.subjectName);
    setYear(plan.year as number);
    setCodigo(plan.codigo || '');
    setPosicion(plan.posicion);
    setTipoCalificacion(plan.tipoCalificacion || 'Cuantitativo');
    setFormSelectedVersion(plan.id_tipo_plan || selectedVersion);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!nombre.trim() || !codigo.trim()) {
      toast.error("El nombre y el código son requeridos");
      return;
    }

    try {
      if (editingPlan && onUpdateStudyPlanItem) {
        await onUpdateStudyPlanItem(editingPlan.id, nombre, year, codigo, posicion, tipoCalificacion, formSelectedVersion);
      } else {
        await onAddStudyPlanItem(nombre, year, codigo, posicion, tipoCalificacion, formSelectedVersion);
      }
      setIsModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      const details = err.details;
      if (details && typeof details === 'object') {
        const mapped = { ...details };
        if (mapped.id_asignatura) { mapped.nombre = mapped.id_asignatura; delete mapped.id_asignatura; }
        if (mapped.codigo_asignatura) { mapped.codigo = mapped.codigo_asignatura; delete mapped.codigo_asignatura; }
        setFieldErrors(mapped);
      } else {
        toast.error(err.message || 'Error al guardar en el plan de estudio');
      }
    }
  };

  const handleOpenNewVersionModal = () => {
    setNewVersionName('');
    setIsVersionModalOpen(true);
  };

  const handleSubmitNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    
    if (onAddStudyPlanVersion) {
      try {
        const result = await onAddStudyPlanVersion(newVersionName.trim());
        if (result && result.id_tipo_plan) {
          setSelectedVersion(result.id_tipo_plan);
          toast.success("Nueva versión creada exitosamente");
          setIsVersionModalOpen(false);
          setNewVersionName('');
        }
      } catch (e) {
        // Error handled in parent
      }
    }
  };

  const handleDeleteVersionSubmit = async () => {
    if (onDeleteStudyPlanVersion) {
      try {
        await onDeleteStudyPlanVersion(selectedVersion);
        setIsDeleteVersionModalOpen(false);
        // Fallback to first available version if there is one
        const remainingVersions = studyPlanVersions.filter(v => v.id_tipo_plan !== selectedVersion);
        if (remainingVersions.length > 0) {
          setSelectedVersion(remainingVersions[0].id_tipo_plan);
        }
      } catch (e) {
        setIsDeleteVersionModalOpen(false); // Close on error so they can read the toast
      }
    }
  };

  const canEdit = ['super_admin', 'control_estudios'].includes(currentUserRole);

  const filteredPlans = studyPlans
    .filter(p => p.id_tipo_plan === selectedVersion && (filterYear === 'Todos' || p.year === filterYear))
    .sort((a, b) => a.posicion - b.posicion);

  return (
    <div className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Book className="h-6 w-6 text-indigo-600" />
            Configuración del Plan de Estudio
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de códigos y posiciones de materias según normativa.</p>
        </div>
        {canEdit && (
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-2">
                Versión del Plan:
                {onAddStudyPlanVersion && (
                  <Tooltip content="Crea una nueva versión del plan de estudio (ej. 2024, 2025)">
                    <button 
                      onClick={handleOpenNewVersionModal}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-indigo-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      + Nuevo
                    </button>
                  </Tooltip>
                )}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(Number(e.target.value))}
                  className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {studyPlanVersions.map(v => (
                    <option key={v.id_tipo_plan} value={v.id_tipo_plan}>{v.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 mt-5 rounded-lg text-sm font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar Materia
            </button>
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-800">Materias de la {studyPlanVersions.find(v => v.id_tipo_plan === selectedVersion)?.nombre}</h3>
            {canEdit && onDeleteStudyPlanVersion && studyPlanVersions.length > 1 && (
              <Tooltip content="Elimina esta versión del plan de estudio y todas sus materias asociadas.">
                <button
                  onClick={() => setIsDeleteVersionModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-md transition-colors shadow-sm cursor-pointer border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar Versión
                </button>
              </Tooltip>
            )}
          </div>
          
          {/* Segmentación por Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg self-start overflow-x-auto w-full max-w-full md:w-auto md:max-w-max hide-scrollbar">
            {['Todos', 1, 2, 3, 4, 5].map((y) => (
              <button
                key={y}
                onClick={() => setFilterYear(y as any)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap cursor-pointer pointer-events-auto ${
                  filterYear === y 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {y === 'Todos' ? 'Todos' : `${y}° Año`}
              </button>
            ))}
          </div>
        </div>
        
        {filteredPlans.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-sm font-semibold text-slate-400">No hay materias registradas en este año.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <th className="p-3 font-bold w-24 text-center">CÓDIGO</th>
                  <th className="p-3 font-bold text-center w-28">TIPO</th>
                  <th className="p-3 font-bold">MATERIA</th>
                  <th className="p-3 font-bold text-center w-24">POSICIÓN</th>
                  <th className="p-3 font-bold text-center w-24">AÑO</th>
                  {canEdit && <th className="p-3 font-bold text-center w-24">ACCIONES</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filterYear === 'Todos' ? (
                  [1, 2, 3, 4, 5].map(y => {
                    const yearPlans = filteredPlans.filter(p => p.year === y);
                    if (yearPlans.length === 0) return null;
                    return (
                      <React.Fragment key={`group-${y}`}>
                        <tr>
                          <td colSpan={canEdit ? 6 : 5} className="py-2.5 px-4 text-xs font-black text-indigo-500 uppercase tracking-widest border-y border-indigo-100 bg-indigo-50/50">
                            Materias de {y}° Año
                          </td>
                        </tr>
                        {yearPlans.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 text-center">
                              <span className="bg-slate-100 text-slate-600 font-mono font-bold px-2 py-1 rounded text-xs">
                                {item.codigo || '-'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                item.tipoCalificacion === 'Cualitativo' 
                                  ? 'bg-violet-100 text-violet-700' 
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {item.tipoCalificacion === 'Cualitativo' ? 'CUALI' : 'CUANTI'}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-slate-700">{item.subjectName}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-500">{item.posicion}</td>
                            <td className="p-3 text-center font-bold text-indigo-600">{item.year}°</td>
                            {canEdit && (
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-bold cursor-pointer"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => {
                                      setPlanToDelete(item);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="text-sm text-rose-500 hover:text-rose-700 transition-colors font-bold cursor-pointer"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  filteredPlans.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center">
                        <span className="bg-slate-100 text-slate-600 font-mono font-bold px-2 py-1 rounded text-xs">
                          {item.codigo || '-'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          item.tipoCalificacion === 'Cualitativo' 
                            ? 'bg-violet-100 text-violet-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.tipoCalificacion === 'Cualitativo' ? 'CUALI' : 'CUANTI'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{item.subjectName}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-500">{item.posicion}</td>
                      <td className="p-3 text-center font-bold text-indigo-600">{item.year}°</td>
                      {canEdit && (
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-bold cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                setPlanToDelete(item);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-sm text-rose-500 hover:text-rose-700 transition-colors font-bold cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar al Plan de Estudio */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setEditingPlan(null);
      }} title={editingPlan ? "Editar Materia en Plan" : "Agregar al Plan de Estudio"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Materia</label>
            <input 
              type="text"
              placeholder="Ej. Castellano"
              value={nombre}
              onChange={(e) => handleFieldChange('nombre', e.target.value, setNombre)}
              onBlur={() => checkDuplicate('nombre')}
              className={`w-full text-sm p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-medium ${fieldErrors.nombre ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
              required
            />
            {fieldErrors.nombre && <p className="text-red-600 text-sm">{fieldErrors.nombre}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Versión del Plan de Estudio</label>
            <select
              value={formSelectedVersion}
              onChange={(e) => setFormSelectedVersion(Number(e.target.value))}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium font-bold text-indigo-700"
            >
              {studyPlanVersions.map(v => (
                <option key={v.id_tipo_plan} value={v.id_tipo_plan}>{v.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Código Asignatura</label>
              <input 
                type="text"
                placeholder="Ej. CAS1"
                value={codigo}
                onChange={(e) => handleFieldChange('codigo', e.target.value.toUpperCase(), setCodigo)}
                onBlur={() => checkDuplicate('codigo')}
                className={`w-full text-sm p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-mono font-bold uppercase ${fieldErrors.codigo ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
                required
              />
              {fieldErrors.codigo && <p className="text-red-600 text-sm">{fieldErrors.codigo}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tipo de Calificación</label>
              <select
                value={tipoCalificacion}
                onChange={(e) => setTipoCalificacion(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
              >
                <option value="Cuantitativo">Cuantitativo (Numérico 1-20)</option>
                <option value="Cualitativo">Cualitativo (Letras A-D)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Posición en Boletín</label>
              <input 
                type="number"
                min="1"
                value={posicion}
                onChange={(e) => handleFieldChange('posicion', e.target.value, setPosicion, 'number')}
                onBlur={() => checkDuplicate('posicion')}
                className={`w-full text-sm p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-medium ${fieldErrors.posicion ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
                required
              />
              {fieldErrors.posicion && <p className="text-red-600 text-sm">{fieldErrors.posicion}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Año Escolar</label>
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); }}
              onBlur={() => { checkDuplicate('codigo'); checkDuplicate('posicion'); }}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value={1}>1er Año</option>
              <option value={2}>2do Año</option>
              <option value={3}>3er Año</option>
              <option value={4}>4to Año</option>
              <option value={5}>5to Año</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={Object.keys(fieldErrors).length > 0}
              className={`px-4 py-2 text-base font-bold text-white rounded-lg transition-colors cursor-pointer ${Object.keys(fieldErrors).length > 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {editingPlan ? "Guardar Cambios" : "Guardar Materia"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de eliminar la materia <span className="font-bold text-slate-800">{planToDelete?.subjectName}</span> del plan de estudio?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => planToDelete && onDeleteStudyPlanItem && (onDeleteStudyPlanItem(planToDelete.id), setIsDeleteModalOpen(false))}
              className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
            >
              Sí, eliminar materia
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Nueva Versión de Plan */}
      <Modal isOpen={isVersionModalOpen} onClose={() => setIsVersionModalOpen(false)} title="Nueva Versión del Plan">
        <form onSubmit={handleSubmitNewVersion} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nombre de la Versión</label>
            <input 
              type="text"
              placeholder="Ej: Plan Oficial 2026"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
              required
              autoFocus
            />
            <p className="text-[11px] text-slate-500 mt-1">Este nombre identificará a una nueva versión del pensum de estudio, las materias creadas pertenecerán a esta versión y no afectarán a otras versiones anteriores.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsVersionModalOpen(false)} 
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer pointer-events-auto"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm cursor-pointer pointer-events-auto"
            >
              Crear Versión
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Version Confirmation Modal */}
      <Modal isOpen={isDeleteVersionModalOpen} onClose={() => setIsDeleteVersionModalOpen(false)} title="Eliminar Versión del Plan">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de que desea eliminar la versión <span className="font-bold text-slate-800">{studyPlanVersions.find(v => v.id_tipo_plan === selectedVersion)?.nombre}</span>?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-amber-800">
            <p className="text-sm">
              <span className="font-bold">Advertencia:</span> Esta acción solo se podrá realizar si no hay materias asignadas a esta versión. Si hay materias, el sistema le impedirá eliminarla por seguridad.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteVersionModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteVersionSubmit}
              className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
            >
              Sí, intentar eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
