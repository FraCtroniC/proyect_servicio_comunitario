/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, PlusCircle, Trash, Shield, AlertTriangle, Cpu, Radio, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Classroom, ScheduleEvent, UserRole, Section, Student } from '../types';
import { Modal } from './Modal';

interface FacilitiesProps {
  classrooms: Classroom[];
  scheduleEvents: ScheduleEvent[];
  sections?: Section[];
  students?: Student[];
  currentUserRole: UserRole;
  onAddClassroom: (room: Classroom) => Promise<void> | void;
  onEditClassroom: (roomId: string, data: Partial<Classroom>) => Promise<void> | void;
  onRemoveClassroom: (roomId: string) => Promise<void> | void;
}

export default function FacilitiesManager({
  classrooms,
  scheduleEvents,
  sections = [],
  students = [],
  currentUserRole,
  onAddClassroom,
  onEditClassroom,
  onRemoveClassroom
}: FacilitiesProps) {
  // Add Classroom form states
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | string>(30);
  const [type, setType] = useState<'Teórica' | 'Laboratorio' | 'Deportiva'>('Teórica');
  const [resources, setResources] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Classroom | null>(null);

  const openAddModal = () => {
    setName('');
    setCapacity(30);
    setType('Teórica');
    setResources('');
    setEditingRoomId(null);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (room: Classroom) => {
    setName(room.name);
    setCapacity(room.capacity);
    setType(room.type);
    setResources(room.resources ? room.resources.join(', ') : '');
    setEditingRoomId(room.id);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    if (!name || capacity === '' || Number(capacity) <= 0) {
      setErrorMsg('Nombre y Capacidad (mayor a 0) son requeridos.');
      return;
    }

    const parsedResources = resources ? resources.split(',').map(r => r.trim()).filter(Boolean) : [];

    try {
      if (editingRoomId) {
        await onEditClassroom(editingRoomId, {
          name,
          capacity: Number(capacity),
          type,
          resources: parsedResources
        });
        setSuccessMsg(`Aula física "${name}" editada con éxito.`);
      } else {
        const newRoom: Classroom = {
          id: 'rm-' + Date.now(),
          name,
          capacity: Number(capacity),
          type,
          resources: parsedResources
        };
        await onAddClassroom(newRoom);
        setSuccessMsg(`Aula física "${newRoom.name}" agregada con éxito.`);
      }
      
      setErrorMsg('');
      setFieldErrors({});
      setName('');
      setCapacity(30);
      setResources('');
      setIsModalOpen(false);
    } catch (err: any) {
      const details = err.details;
      if (details && typeof details === 'object') {
        setFieldErrors(details);
      } else {
        setErrorMsg(err.message || 'Error al guardar el aula.');
      }
    }
  };

  const getClassroomOccupancyCount = (roomId: string) => {
    // Count days and slots booked
    const bookings = scheduleEvents.filter(e => e.classroomId === roomId);
    return bookings.length;
  };

  const getCapacityWarning = (cap: number) => {
    if (cap < 25) {
      return (
        <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Capacidad Reducida (Lab/Taller)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Capacidad Óptima EMG
      </span>
    );
  };

  return (
    <>
      <div id="facilities-root" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <div id="facilities-header" className="border-b border-slate-100 pb-4">
        <h1 id="facilities-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Home className="h-6 w-6 text-indigo-600" />
          Administración de Planta Física y Aulas
        </h1>
        <p className="text-xs text-slate-500 mt-1">Estructuración e inventariado de salones de clase teóricos, laboratorios especializados, y espacios deportivos regulados por el MPPE.</p>
      </div>

      <div id="facilities-grid" className="grid grid-cols-1 gap-6">

        {/* Room list display (full width now) */}
        <div id="room-list-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div id="room-list-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Directorio de Planta Física Activa</h3>
            <div className="flex gap-4 items-center">
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded">Total Locaciones: {classrooms.length}</span>
              {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Agregar Aula
                </button>
              )}
            </div>
          </div>

          <div id="room-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {classrooms.map(room => {
              const bookingCount = getClassroomOccupancyCount(room.id);
              
              return (
                <div id={`room-card-${room.id}`} key={room.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-indigo-950 uppercase block">{room.name}</span>
                      <span className="bg-slate-200/60 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded font-mono leading-none">
                        {room.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-semibold">
                      <span>Aforo Máx: <strong>{room.capacity}</strong> pupitres / alumnos</span>
                      <span>•</span>
                      <span>Ocupado: <strong>{bookingCount}</strong> clases / sem</span>
                    </div>

                    {getCapacityWarning(room.capacity)}
                    
                    {(() => {
                       const assignedSection = sections.find(s => s.homeClassroomId === room.id);
                       if (assignedSection) {
                          const enrolled = students.filter(s => s.academicYear === assignedSection.grade && s.section === assignedSection.letter).length;
                          const percent = Math.min(100, Math.round((enrolled / room.capacity) * 100));
                          return (
                             <div className="mt-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">
                                  Aula Base: Sección {assignedSection.grade}° "{assignedSection.letter}"
                                </span>
                                <div className="w-full bg-indigo-200 rounded-full h-1.5 mb-1 overflow-hidden">
                                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                                </div>
                                <span className="text-[9px] font-bold text-indigo-700 flex justify-between">
                                  <span>{enrolled} alumnos inscritos</span>
                                  <span>{percent}%</span>
                                </span>
                             </div>
                          );
                       }
                       return null;
                    })()}

                    {room.resources.length > 0 && (
                      <div id={`room-resources-${room.id}`} className="space-y-1 pt-1.5 border-t border-slate-150 mt-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Recursos de Inventario:</span>
                        <div className="flex flex-wrap gap-1">
                          {room.resources.map((res, i) => (
                            <span key={i} className="text-[9px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions (Only for supervisor role) */}
                  {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-105 mt-3">
                      <button
                        onClick={() => openEditModal(room)}
                        className="text-[9px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-300 font-mono py-1 px-2 rounded-md transition-colors pointer-events-auto cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        id={`btn-del-room-${room.id}`}
                        onClick={() => {
                          if (bookingCount > 0) {
                            toast.error("No se puede desincorporar este salón ya que posee bloques horarios planificados pendientes.");
                            return;
                          }
                          setRoomToDelete(room);
                        }}
                        className="text-[9px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-300 font-mono py-1 px-2 rounded-md transition-colors pointer-events-auto cursor-pointer flex items-center gap-1"
                      >
                        <Trash className="h-3 w-3" />
                        <span>Desincorporar</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
      </div>

      {/* Modal de Eliminación */}
      <Modal isOpen={!!roomToDelete} onClose={() => setRoomToDelete(null)} title="Confirmar Desincorporación">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            ¿Está seguro de desincorporar <strong>{roomToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setRoomToDelete(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              onClick={() => {
                if (roomToDelete) {
                  onRemoveClassroom(roomToDelete.id);
                  setRoomToDelete(null);
                }
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Desincorporar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoomId ? "Editar Aula Física" : "Registrar Nueva Aula Física"}>
        {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
          <div id="room-form-locked" className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <p className="font-bold">Acceso Denegado</p>
            <p className="leading-relaxed">
              Su rol simulado no posee habilitaciones para administrar el inventariado de planta física. 
              Por favor, modifique su perfil a <strong>Director</strong> o <strong>Control de Estudios</strong>.
            </p>
          </div>
        ) : (
          <form id="add-room-form" onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div id="add-room-error" className="p-2.5 bg-rose-50 border border-rose-250 font-medium rounded-lg text-rose-800 text-[11px]">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div id="add-room-success" className="p-2.5 bg-green-50 border border-green-250 font-medium rounded-lg text-green-800 text-[11px]">
                {successMsg}
              </div>
            )}

            <div id="form-room-name" className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Nombre / Identificador del Espacio</label>
              <input 
                type="text" 
                placeholder="e.g. Laboratorio de Biología" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white font-medium ${fieldErrors.nombre_codigo ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
              />
              {fieldErrors.nombre_codigo && <p className="text-red-600 text-[11px]">{fieldErrors.nombre_codigo}</p>}
            </div>

            <div id="form-room-cap" className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Aforo / Capacidad de Pupitres</label>
              <input 
                type="number" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <div id="form-room-type" className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Función / Tipología</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Teórica">Teórica</option>
                <option value="Laboratorio">Laboratorio Especializado</option>
                <option value="Deportiva">Deportiva / Recreativa</option>
              </select>
            </div>

            <div id="form-room-res" className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Inventario de Recursos (Separado por coma)</label>
              <textarea 
                placeholder="e.g. Proyector, Microscopios, Ventiladores, Acondicionador de Aire" 
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Registrar Aula en Inventario
            </button>
          </form>
        )}
      </Modal>

    </>
  );
}
