import React, { useState } from 'react';
import { Book, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { StudyPlanItem, UserRole } from '../types';
import { Modal } from './Modal';

interface SubjectManagerProps {
  studyPlans: StudyPlanItem[];
  currentUserRole: UserRole;
  onAddStudyPlanItem: (name: string, year: number, codigo: string, posicion: number) => void;
}

export default function SubjectManager({ studyPlans, currentUserRole, onAddStudyPlanItem }: SubjectManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [filterYear, setFilterYear] = useState<number | 'Todos'>('Todos');

  // Form states
  const [nombre, setNombre] = useState('');
  const [year, setYear] = useState<number>(1);
  const [codigo, setCodigo] = useState('');
  const [posicion, setPosicion] = useState<number>(1);

  const openAddModal = () => {
    setNombre('');
    setYear(filterYear === 'Todos' ? 1 : filterYear);
    setCodigo('');
    setPosicion(1);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !codigo.trim()) {
      toast.error("El nombre y el código son requeridos");
      return;
    }

    onAddStudyPlanItem(nombre, year, codigo, posicion);
    setIsModalOpen(false);
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Agregar al Plan de Estudio */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar al Plan de Estudio">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Materia</label>
            <input 
              type="text"
              placeholder="Ej. Castellano"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Código Asignatura</label>
              <input 
                type="text"
                placeholder="Ej. CAS1"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono font-bold uppercase"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Posición en Boletín</label>
              <input 
                type="number"
                min="1"
                value={posicion}
                onChange={(e) => setPosicion(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Año Escolar</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
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
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Agregar Materia al Plan
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
