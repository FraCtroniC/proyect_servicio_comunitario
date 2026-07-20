import React, { useState, useMemo } from 'react';
import { CalendarDays, Plus, Lock, CheckCircle2, Clock, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { SchoolPeriod, UserRole } from '../types';
import { Modal } from './Modal';

interface PeriodManagerProps {
  periods: SchoolPeriod[];
  currentUserRole: UserRole;
  onAddPeriod: (name: string, status: 'Activo' | 'Planificación', fecha_inicio?: string | null, fecha_fin?: string | null) => Promise<void>;
  onUpdatePeriodStatus: (id: string, newStatus: 'Activo' | 'Cerrado' | 'Planificación') => Promise<void>;
  onUpdateMomentoStatus?: (id_momento: number, newStatus: 'Abierto' | 'Cerrado') => Promise<void>;
  onEditPeriod: (id: string, data: { nombre?: string; estatus?: string; fecha_inicio?: string | null; fecha_fin?: string | null }) => Promise<void>;
  onCierreAnual?: (id: string) => Promise<void>;
}

export default function PeriodManager({ periods, currentUserRole, onAddPeriod, onUpdatePeriodStatus, onUpdateMomentoStatus, onEditPeriod, onCierreAnual }: PeriodManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isCierreAnualModalOpen, setIsCierreAnualModalOpen] = useState(false);
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
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const [confirmText, setConfirmText] = useState('');
  const [confirmCierreText, setConfirmCierreText] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPeriodId, setEditPeriodId] = useState<string>('');
  const [editStartYear, setEditStartYear] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editFechaInicio, setEditFechaInicio] = useState<string>('');
  const [editFechaFin, setEditFechaFin] = useState<string>('');

  const openAddModal = () => {
    setStartYear(String(currentYear));
    setNewStatus('Planificación');
    setFechaInicio(`${currentYear}-09-01`);
    setFechaFin(`${currentYear + 1}-08-31`);
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
      await onAddPeriod(generatedName, newStatus, fechaInicio || null, fechaFin || null);
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

  const openCierreAnualModal = (period: SchoolPeriod) => {
    setSelectedPeriod(period);
    setConfirmCierreText('');
    setIsCierreAnualModalOpen(true);
  };

  const handleCierreAnualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmCierreText !== 'CERRAR AÑO') {
      toast.error('Debes escribir la palabra CERRAR AÑO exactamente igual para confirmar.');
      return;
    }
    if (selectedPeriod && onCierreAnual) {
      try {
        await onCierreAnual(selectedPeriod.id);
        setIsCierreAnualModalOpen(false);
      } catch (error) {
        // handled in App.tsx
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

  const openEditModal = (period: SchoolPeriod) => {
    const yearStart = period.name.split('-')[0];
    setEditPeriodId(period.id);
    setEditStartYear(yearStart);
    setEditStatus(period.status);
    setEditFechaInicio(period.fecha_inicio || '');
    setEditFechaFin(period.fecha_fin || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newName = `${editStartYear}-${Number(editStartYear) + 1}`;
    const payload: any = {};
    const original = periods.find(p => p.id === editPeriodId);
    if (!original) return;
    if (newName !== original.name) {
      const existing = periods.find(p => p.name === newName);
      if (existing) {
        toast.error(`Ya existe un período escolar con el nombre ${newName}.`);
        return;
      }
      payload.nombre = newName;
    }
    if (editStatus !== original.status) {
      payload.estatus = editStatus;
    }
    const newFechaInicio = editFechaInicio || null;
    const newFechaFin = editFechaFin || null;
    if (newFechaInicio !== original.fecha_inicio) payload.fecha_inicio = newFechaInicio;
    if (newFechaFin !== original.fecha_fin) payload.fecha_fin = newFechaFin;
    if (Object.keys(payload).length === 0) {
      toast.error('No hay cambios para guardar.');
      return;
    }
    try {
      await onEditPeriod(editPeriodId, payload);
      toast.success('Periodo actualizado exitosamente.');
      setIsEditModalOpen(false);
    } catch {
      // handled in App.tsx
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
          <p className="text-sm text-slate-500 mt-1">Gestión de Años Académicos y Bloqueo de Lapsos.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {canEdit && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm pointer-events-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Aperturar Nuevo Periodo
            </button>
          )}
        </div>
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
                  <th className="p-3 font-bold text-center">INICIO</th>
                  <th className="p-3 font-bold text-center">FIN</th>
                  {canEdit && <th className="p-3 font-bold text-center w-72">ACCIONES</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((per) => (
                  <React.Fragment key={per.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono font-bold">#{per.id}</td>
                      <td className="p-3 font-bold text-slate-700 text-base">{per.name}</td>
                      <td className="p-3 text-center">
                        {getStatusBadge(per.status)}
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium text-xs">
                        {per.fecha_inicio ? new Date(per.fecha_inicio + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium text-xs">
                        {per.fecha_fin ? new Date(per.fecha_fin + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : <span className="text-slate-300">—</span>}
                      </td>
                      {canEdit && (
                        <td className="p-3 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(per)}
                            className="bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 px-3 py-1.5 rounded text-xs font-bold transition-colors pointer-events-auto cursor-pointer flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Editar
                          </button>
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
                              title="Cerrar periodo normalmente"
                            >
                              <Lock className="w-3 h-3" />
                              Cerrar
                            </button>
                          )}
                          {per.status === 'Activo' && canEdit && onCierreAnual && (
                            <button
                              onClick={() => openCierreAnualModal(per)}
                              className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors pointer-events-auto cursor-pointer flex items-center gap-1 shadow-sm"
                              title="Cierre de Año Definitivo (Promueve aplazados a Materias Pendientes)"
                            >
                              <Lock className="w-3 h-3" />
                              Cierre Definitivo
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                    {per.momentos && per.momentos.length > 0 && (
                      <tr className="bg-slate-50/30 border-b border-slate-200">
                        <td colSpan={canEdit ? 6 : 5} className="p-4">
                          <div className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mb-1 flex items-center gap-2">
                              <CalendarDays className="w-3.5 h-3.5" />
                              Control de Lapsos Académicos
                            </h4>
                            <div className="flex gap-4 flex-wrap">
                              {[...per.momentos].sort((a,b) => a.id_momento - b.id_momento).map((m, idx) => (
                                <div key={m.id_momento} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 min-w-[200px]">
                                  <div className="flex-1">
                                    <span className="block text-sm font-bold text-slate-700">Lapso {idx + 1}</span>
                                    {m.estatus === 'Abierto' ? (
                                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Abierto
                                      </span>
                                    ) : (
                                      <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Cerrado
                                      </span>
                                    )}
                                  </div>
                                  {canEdit && onUpdateMomentoStatus && per.status === 'Activo' && (
                                    <button
                                      onClick={() => onUpdateMomentoStatus(m.id_momento, m.estatus === 'Abierto' ? 'Cerrado' : 'Abierto')}
                                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                                        m.estatus === 'Abierto' 
                                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                      }`}
                                    >
                                      {m.estatus === 'Abierto' ? 'Cerrar Lapso' : 'Abrir Lapso'}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            {per.status !== 'Activo' && (
                              <p className="text-xs text-slate-400 font-medium italic mt-1">
                                * Los lapsos no pueden modificarse mientras el periodo no esté activo.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
              onChange={(e) => {
                const year = Number(e.target.value);
                setStartYear(e.target.value);
                setFechaInicio(`${year}-09-01`);
                setFechaFin(`${year + 1}-08-31`);
              }}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha de Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha de Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
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

      {/* Modal Editar Periodo */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Periodo Escolar">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Año de Inicio</label>
            <select
              value={editStartYear}
              onChange={(e) => {
                const year = Number(e.target.value);
                setEditStartYear(e.target.value);
                setEditFechaInicio(`${year}-09-01`);
                setEditFechaFin(`${year + 1}-08-31`);
              }}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Año Escolar</span>
            <span className="text-base font-black text-indigo-700 tracking-wider">{editStartYear}-{Number(editStartYear) + 1}</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Estatus</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Planificación">En Planificación</option>
              <option value="Activo">Activo</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha de Inicio</label>
              <input
                type="date"
                value={editFechaInicio}
                onChange={(e) => setEditFechaInicio(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha de Fin</label>
              <input
                type="date"
                value={editFechaFin}
                onChange={(e) => setEditFechaFin(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cierre de Año Anual */}
      <Modal isOpen={isCierreAnualModalOpen} onClose={() => setIsCierreAnualModalOpen(false)} title="Cierre de Año Escolar Definitivo">
        <form onSubmit={handleCierreAnualSubmit} className="space-y-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-medium">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              ¡ADVERTENCIA CRÍTICA!
            </h4>
            <p className="mb-2">Estás a punto de realizar el <strong>Cierre de Año Escolar Definitivo</strong> para el periodo <strong>{selectedPeriod?.name}</strong>.</p>
            <ul className="list-disc list-inside space-y-1 mb-2 text-red-600 text-xs">
              <li>El periodo y todos sus lapsos quedarán cerrados permanentemente.</li>
              <li>Se calcularán las calificaciones definitivas de todos los estudiantes de forma masiva.</li>
              <li>Los estudiantes con calificación definitiva menor a 10 ptos serán registrados automáticamente en <strong>Materias Pendientes</strong>.</li>
            </ul>
            <p>Esta acción puede demorar varios segundos y <strong>no se puede deshacer</strong> fácilmente.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Escribe <span className="text-rose-600">CERRAR AÑO</span> para confirmar
            </label>
            <input
              type="text"
              required
              value={confirmCierreText}
              onChange={(e) => setConfirmCierreText(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500 font-bold text-center uppercase"
              placeholder="CERRAR AÑO"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCierreAnualModalOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={confirmCierreText !== 'CERRAR AÑO'}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Ejecutar Cierre Anual
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
