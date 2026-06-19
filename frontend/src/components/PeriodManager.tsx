import React, { useState } from 'react';
import { CalendarDays, Plus, Lock, CheckCircle2, Clock } from 'lucide-react';
import { SchoolPeriod, UserRole } from '../types';
import { Modal } from './Modal';

interface PeriodManagerProps {
  periods: SchoolPeriod[];
  currentUserRole: UserRole;
  onAddPeriod: (name: string, status: 'Activo' | 'Planificación') => void;
  onUpdatePeriodStatus: (id: string, newStatus: 'Activo' | 'Cerrado' | 'Planificación') => void;
}

export default function PeriodManager({ periods, currentUserRole, onAddPeriod, onUpdatePeriodStatus }: PeriodManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<SchoolPeriod | null>(null);

  // Add Form
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<'Activo' | 'Planificación'>('Planificación');

  // Close Form
  const [confirmText, setConfirmText] = useState('');

  const openAddModal = () => {
    setNewName('');
    setNewStatus('Planificación');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('El nombre del periodo es requerido (ej. 2026-2027)');
      return;
    }
    onAddPeriod(newName, newStatus);
    setIsAddModalOpen(false);
  };

  const openCloseModal = (period: SchoolPeriod) => {
    setSelectedPeriod(period);
    setConfirmText('');
    setIsCloseModalOpen(true);
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== 'CERRAR') {
      alert('Debes escribir la palabra CERRAR exactamente igual para confirmar.');
      return;
    }
    if (selectedPeriod) {
      onUpdatePeriodStatus(selectedPeriod.id, 'Cerrado');
    }
    setIsCloseModalOpen(false);
  };

  const handleActivate = (period: SchoolPeriod) => {
    if (confirm(`¿Estás seguro de activar el periodo ${period.name}? Esto permitirá inscripciones y carga de notas bajo este periodo.`)) {
      onUpdatePeriodStatus(period.id, 'Activo');
    }
  };

  const canEdit = ['super_admin', 'control_estudios'].includes(currentUserRole);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activo':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> Activo</span>;
      case 'Cerrado':
        return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold"><Lock className="w-3 h-3" /> Cerrado</span>;
      case 'Planificación':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold"><Clock className="w-3 h-3" /> En Planificación</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Periodos Escolares
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de Años Académicos y Bloqueo de Históricos.</p>
        </div>
        {canEdit && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Aperturar Nuevo Periodo
            </button>
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Histórico de Periodos</h3>
        
        {periods.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-xs font-semibold text-slate-400">No hay periodos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <th className="p-3 font-bold w-20 text-center">ID</th>
                  <th className="p-3 font-bold">AÑO ESCOLAR</th>
                  <th className="p-3 font-bold text-center">ESTATUS</th>
                  {canEdit && <th className="p-3 font-bold text-center w-48">ACCIONES</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((per) => (
                  <tr key={per.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-center text-slate-400 font-mono font-bold">#{per.id}</td>
                    <td className="p-3 font-bold text-slate-700 text-sm">{per.name}</td>
                    <td className="p-3 text-center">
                      {getStatusBadge(per.status)}
                    </td>
                    {canEdit && (
                      <td className="p-3 text-center flex items-center justify-center gap-2">
                        {per.status === 'Planificación' && (
                          <button
                            onClick={() => handleActivate(per)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded text-[10px] font-bold transition-colors pointer-events-auto cursor-pointer"
                          >
                            Activar
                          </button>
                        )}
                        {(per.status === 'Activo' || per.status === 'Planificación') && (
                          <button
                            onClick={() => openCloseModal(per)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-3 py-1.5 rounded text-[10px] font-bold transition-colors pointer-events-auto cursor-pointer flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            Cerrar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nuevo Periodo */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Aperturar Nuevo Periodo">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Nombre del Año Escolar</label>
            <input 
              type="text"
              placeholder="Ej. 2026-2027"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Estatus Inicial</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Planificación">En Planificación (Solo configuraciones previas)</option>
              <option value="Activo">Activo (Permitir inscripciones de inmediato)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Registrar Periodo
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cerrar Periodo */}
      <Modal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} title="Cierre de Periodo Escolar">
        <form onSubmit={handleCloseSubmit} className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <h4 className="text-xs font-bold text-rose-800 mb-1 flex items-center gap-1"><Lock className="w-4 h-4"/> Acción Irreversible</h4>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Estás a punto de cerrar el periodo <strong>{selectedPeriod?.name}</strong>. Al hacer esto, todas las secciones y notas vinculadas a este año quedarán congeladas como histórico y no podrán ser modificadas.
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Escribe CERRAR para confirmar</label>
            <input 
              type="text"
              placeholder="CERRAR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 font-bold text-rose-600 text-center tracking-widest"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={confirmText !== 'CERRAR'}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Confirmar Cierre Definitivo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
