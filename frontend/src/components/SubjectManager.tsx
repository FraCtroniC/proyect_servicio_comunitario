import React, { useState } from 'react';
import { Book, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { StudyPlanItem, UserRole } from '../types';
import { Modal } from './Modal';

interface SubjectManagerProps {
  studyPlans: StudyPlanItem[];
  currentUserRole: UserRole;
  onAddStudyPlanItem: (name: string, year: number, codigo: string, posicion: number) => void;
  onUpdateStudyPlanItem?: (id: string, name: string, year: number, codigo: string, posicion: number) => void;
  onDeleteStudyPlanItem?: (id: string) => void;
}

export default function SubjectManager({ studyPlans, currentUserRole, onAddStudyPlanItem, onUpdateStudyPlanItem, onDeleteStudyPlanItem }: SubjectManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlanItem | null>(null);
  
  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<StudyPlanItem | null>(null);

  // Filters
  const [filterYear, setFilterYear] = useState<number | 'Todos'>('Todos');

  // Form states
  const [nombre, setNombre] = useState('');
  const [year, setYear] = useState<number>(1);
  const [codigo, setCodigo] = useState('');
  const [posicion, setPosicion] = useState<number>(1);
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
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (plan: StudyPlanItem) => {
    setEditingPlan(plan);
    setNombre(plan.subjectName);
    setYear(plan.year as number);
    setCodigo(plan.codigo || '');
    setPosicion(plan.posicion);
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
        await onUpdateStudyPlanItem(editingPlan.id, nombre, year, codigo, posicion);
      } else {
        await onAddStudyPlanItem(nombre, year, codigo, posicion);
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

  const canEdit = ['super_admin', 'control_estudios'].includes(currentUserRole);

  const filteredPlans = studyPlans
    .filter(p => filterYear === 'Todos' || p.year === filterYear)
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
          <p className="text-xs text-slate-500 mt-1">Gestión de códigos y posiciones de materias según normativa MPPE.</p>
        </div>
        {canEdit && (
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value === 'Todos' ? 'Todos' : Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-600 focus:outline-hidden"
              >
                <option value="Todos">Todos los Años</option>
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar Materia
            </button>
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Materias del Plan de Estudio {filterYear !== 'Todos' ? `(${filterYear}° Año)` : ''}</h3>
        </div>
        
        {filteredPlans.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-xs font-semibold text-slate-400">No hay materias registradas en este año.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <th className="p-3 font-bold w-24 text-center">CÓDIGO</th>
                  <th className="p-3 font-bold">MATERIA</th>
                  <th className="p-3 font-bold text-center w-24">POSICIÓN</th>
                  <th className="p-3 font-bold text-center w-24">AÑO</th>
                  {canEdit && <th className="p-3 font-bold text-center w-24">ACCIONES</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-center">
                      <span className="bg-slate-100 text-slate-600 font-mono font-bold px-2 py-1 rounded text-[10px]">
                        {item.codigo || '-'}
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
                            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors font-bold cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setPlanToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-xs text-rose-500 hover:text-rose-700 transition-colors font-bold cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
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
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Materia</label>
            <input 
              type="text"
              placeholder="Ej. Castellano"
              value={nombre}
              onChange={(e) => handleFieldChange('nombre', e.target.value, setNombre)}
              onBlur={() => checkDuplicate('nombre')}
              className={`w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-medium ${fieldErrors.nombre ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
              required
            />
            {fieldErrors.nombre && <p className="text-red-600 text-[11px]">{fieldErrors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Código Asignatura</label>
              <input 
                type="text"
                placeholder="Ej. CAS1"
                value={codigo}
                onChange={(e) => handleFieldChange('codigo', e.target.value.toUpperCase(), setCodigo)}
                onBlur={() => checkDuplicate('codigo')}
                className={`w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-mono font-bold uppercase ${fieldErrors.codigo ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
                required
              />
              {fieldErrors.codigo && <p className="text-red-600 text-[11px]">{fieldErrors.codigo}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Posición en Boletín</label>
              <input 
                type="number"
                min="1"
                value={posicion}
                onChange={(e) => handleFieldChange('posicion', e.target.value, setPosicion, 'number')}
                onBlur={() => checkDuplicate('posicion')}
                className={`w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden font-medium ${fieldErrors.posicion ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
                required
              />
              {fieldErrors.posicion && <p className="text-red-600 text-[11px]">{fieldErrors.posicion}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Año Escolar</label>
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); }}
              onBlur={() => { checkDuplicate('codigo'); checkDuplicate('posicion'); }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
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
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors cursor-pointer ${Object.keys(fieldErrors).length > 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {editingPlan ? "Guardar Cambios" : "Guardar Materia"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            ¿Está seguro de eliminar la materia <span className="font-bold text-slate-800">{planToDelete?.subjectName}</span> del plan de estudio?
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={() => {
                if (planToDelete && onDeleteStudyPlanItem) {
                  onDeleteStudyPlanItem(planToDelete.id);
                  setIsDeleteModalOpen(false);
                  setPlanToDelete(null);
                }
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
