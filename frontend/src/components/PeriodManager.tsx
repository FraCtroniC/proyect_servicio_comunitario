import React, { useState, useMemo } from 'react';
import { CalendarDays, Plus, Lock, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { SchoolPeriod, UserRole } from '../types';
import { Modal } from './Modal';

interface PeriodManagerProps {
  periods: SchoolPeriod[];
  currentUserRole: UserRole;
  onAddPeriod: (name: string, status: 'Activo' | 'Planificación') => Promise<void>;
  onUpdatePeriodStatus: (id: string, newStatus: 'Activo' | 'Cerrado' | 'Planificación') => Promise<void>;
}

export default function PeriodManager({ periods, currentUserRole, onAddPeriod, onUpdatePeriodStatus }: PeriodManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<SchoolPeriod | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const existingYearStarts = useMemo(() => {
    return new Set(periods.map(p => parseInt(p.name.split('-')[0], 10)).filter(n => !isNaN(n)));
  }, [periods]);

  const [startYear, setStartYear] = useState<string>(String(currentYear));
  const generatedName = `${startYear}-${Number(startYear) + 1}`;

  const [newStatus, setNewStatus] = useState<'Activo' | 'Planificación'>('Planificación');

  const [confirmText, setConfirmText] = useState('');

  const openAddModal = () => {
    setStartYear(String(currentYear));
    setNewStatus('Planificación');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingYearStarts.has(Number(startYear))) {
      toast.error(`Ya existe un período escolar para el año ${startYear}-${Number(startYear) + 1}.`);
      return;
    }
    if (newStatus === 'Activo') {
      const yaActivo = periods.find(p => p.status === 'Activo');
      if (yaActivo) {
        toast.error(`Ya existe un período activo (${yaActivo.name}). Debe cerrarlo antes de activar uno nuevo.`);
        return;
      }
    }
    try {
      await onAddPeriod(generatedName, newStatus);
      toast.success('Periodo creado exitosamente.');
      setIsAddModalOpen(false);
    } catch (error) {
      // Error is handled in App.tsx
    }
  };

  const openCloseModal = (period: SchoolPeriod) => {
    setSelectedPeriod(period);
    setConfirmText('');
    setIsCloseModalOpen(true);
  };

  const handleCloseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== 'CERRAR') {
      toast.error('Debes escribir la palabra CERRAR exactamente igual para confirmar.');
      return;
    }
    if (selectedPeriod) {
      try {
        await onUpdatePeriodStatus(selectedPeriod.id, 'Cerrado');
        toast.success(`Periodo ${selectedPeriod.name} cerrado exitosamente.`);
        setIsCloseModalOpen(false);
      } catch (error) {
        // Error is handled in App.tsx
      }
    }
  };

  const openActivateModal = (period: SchoolPeriod) => {
    setSelectedPeriod(period);
    setIsActivateModalOpen(true);
  };

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeriod) {
      const yaActivo = periods.find(p => p.status === 'Activo' && p.id !== selectedPeriod.id);
      if (yaActivo) {
        toast.error(`Ya existe un período activo (${yaActivo.name}). Debe cerrarlo antes de activar uno nuevo.`);
        return;
      }
      try {
        await onUpdatePeriodStatus(selectedPeriod.id, 'Activo');
        toast.success(`Periodo ${selectedPeriod.name} activado exitosamente.`);
        setIsActivateModalOpen(false);
      } catch (error) {
        // Error is handled in App.tsx
      }
    }
  };

  const canEdit = ['super_admin', 'control_estudios'].includes(currentUserRole);
  const isAdmin = currentUserRole === 'super_admin';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activo':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Activo</span>;
      case 'Cerrado':
        return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold"><Lock className="w-3 h-3" /> Cerrado</span>;
      case 'Planificación':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> En Planificación</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Periodos Escolares
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de Años Académicos y Bloqueo de Históricos.</p>
        </div>
        {canEdit && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Aperturar Nuevo Periodo
            </button>
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Histórico de Periodos</h3>
        
        {periods.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-sm font-semibold text-slate-400">No hay periodos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
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
                    <td className="p-3 font-bold text-slate-700 text-base">{per.name}</td>
                    <td className="p-3 text-center">
                      {getStatusBadge(per.status)}
                    </td>
                    {canEdit && (
                      <td className="p-3 text-center flex items-center justify-center gap-2">
                        {(per.status === 'Planificación' || (per.status === 'Cerrado' && isAdmin)) && (
                          <button
                            onClick={() => openActivateModal(per)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded text-xs font-bold transition-colors pointer-events-auto cursor-pointer"
                          >
                            {per.status === 'Cerrado' ? 'Reactivar' : 'Activar'}
                          </button>
                        )}
                        {(per.status === 'Activo' || per.status === 'Planificación') && (
                          <button
                            onClick={() => openCloseModal(per)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-3 py-1.5 rounded text-xs font-bold transition-colors pointer-events-auto cursor-pointer flex items-center gap-1"
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
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Año de Inicio</label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
            >
              {yearOptions.map(y => {
                const taken = existingYearStarts.has(y);
                return (
                  <option key={y} value={y} disabled={taken}>
                    {y}{taken ? ' — ya registrado' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Año Escolar Generado</span>
            <span className="text-base font-black text-indigo-700 tracking-wider">{generatedName}</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Estatus Inicial</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Planificación">En Planificación (Solo configuraciones previas)</option>
              <option value="Activo">Activo (Permitir inscripciones de inmediato)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
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
            <h4 className="text-sm font-bold text-rose-800 mb-1 flex items-center gap-1"><Lock className="w-4 h-4"/> Acción Irreversible</h4>
            <p className="text-sm text-rose-700 leading-relaxed">
              Estás a punto de cerrar el periodo <strong>{selectedPeriod?.name}</strong>. Al hacer esto, todas las secciones y notas vinculadas a este año quedarán congeladas como histórico y no podrán ser modificadas.
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Escribe CERRAR para confirmar</label>
            <input 
              type="text"
              placeholder="CERRAR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 font-bold text-rose-600 text-center tracking-widest"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={confirmText !== 'CERRAR'}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Confirmar Cierre Definitivo
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Activar Periodo */}
      <Modal isOpen={isActivateModalOpen} onClose={() => setIsActivateModalOpen(false)} title="Activar Periodo Escolar">
        <form onSubmit={handleActivateSubmit} className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h4 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Confirmar Activación</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              ¿Estás seguro de activar el periodo <strong>{selectedPeriod?.name}</strong>? Esto permitirá inscripciones y carga de notas bajo este periodo.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Sí, Activar Periodo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
