/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Home, PlusCircle, Trash, Shield, AlertTriangle, Cpu, Radio, ShieldCheck, MapPin, Users, CalendarDays, Edit3, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Classroom, ScheduleEvent, UserRole, Section, Student } from '../types';
import { Modal } from './Modal';

interface FacilitiesProps {
  classrooms: Classroom[];
  scheduleEvents: ScheduleEvent[];
  sections?: Section[];
  students?: Student[];
  activePeriodId?: string;
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
  activePeriodId,
  currentUserRole,
  onAddClassroom,
  onEditClassroom,
  onRemoveClassroom
}: FacilitiesProps) {
  // Add Classroom form states
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | string>(30);
  const [type, setType] = useState<'Teórica' | 'Laboratorio' | 'Deportiva'>('Teórica');
  const [location, setLocation] = useState('Planta Baja');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Classroom | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isModalOpen && successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    return () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); };
  }, [isModalOpen]);

  const isDuplicateName = name.trim() !== '' && classrooms.some(
    c => c.name.toUpperCase() === name.toUpperCase() && c.id !== editingRoomId
  );

  const uniqueLocations = Array.from(new Set(classrooms.map(c => c.location).filter(Boolean)));

  const openAddModal = () => {
    setName('');
    setCapacity(30);
    setType('Teórica');
    setLocation('Planta Baja');
    setIsCustomLocation(false);
    setEditingRoomId(null);
    setErrorMsg('');
    setFieldErrors({});
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (room: Classroom) => {
    setName(room.name);
    setCapacity(room.capacity);
    setType(room.type);
    setLocation(room.location || 'Planta Baja');
    setIsCustomLocation(false);
    setEditingRoomId(room.id);
    setErrorMsg('');
    setFieldErrors({});
    setSuccessMsg('');
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

    setIsSubmitting(true);
    try {
      if (editingRoomId) {
        await onEditClassroom(editingRoomId, {
          name,
          capacity: Number(capacity),
          type,
          location
        });
        setSuccessMsg(`Aula física "${name}" editada con éxito.`);
        toast.success(`Aula física "${name}" editada con éxito.`);
      } else {
        const newRoom: Classroom = {
          id: 'rm-' + Date.now(),
          name,
          capacity: Number(capacity),
          type,
          location
        };
        await onAddClassroom(newRoom);
        setSuccessMsg(`Aula física "${newRoom.name}" registrada exitosamente.`);
        toast.success(`Aula física "${newRoom.name}" registrada exitosamente.`);
      }

      setErrorMsg('');
      setFieldErrors({});
      setName('');
      setCapacity(30);
      setLocation('Planta Baja');
      successTimerRef.current = setTimeout(() => setIsModalOpen(false), 1500);
    } catch (err: any) {
      const details = err.details;
      if (details && typeof details === 'object') {
        setFieldErrors(details);
      } else {
        setErrorMsg(err.message || 'Error al guardar el aula.');
      }
    } finally {
      setIsSubmitting(false);
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
        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Capacidad Reducida
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Capacidad Óptima
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
          <p className="text-sm text-slate-500 mt-1">Estructuración e inventariado de salones de clase teóricos, laboratorios especializados, y espacios deportivos regulados por el MPPE.</p>
        </div>

        <div id="facilities-grid" className="grid grid-cols-1 gap-6">

          {/* Room list display (full width now) */}
          <div id="room-list-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div id="room-list-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Directorio de Planta Física Activa</h3>
              <div className="flex gap-4 items-center">
                <span className="text-xs bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded">Total Locaciones: {classrooms.length}</span>
                {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar Aula
                  </button>
                )}
              </div>
            </div>

            <div id="room-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classrooms.slice(0, visibleCount).map(room => {
                const bookingCount = getClassroomOccupancyCount(room.id);

                return (
                  <div id={`room-card-${room.id}`} key={room.id} className="group p-5 bg-white hover:bg-slate-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                    {/* Top colored accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-black text-slate-800 uppercase truncate tracking-tight">{room.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide truncate">
                              {room.location || 'Sin Ubicación'}
                            </span>
                          </div>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-100 shrink-0">
                          {room.type}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Users className="h-3 w-3" /> Capacidad
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {room.capacity} <span className="text-xs font-semibold text-slate-500 font-normal">pupitres</span>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" /> Ocupación
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {bookingCount} <span className="text-xs font-semibold text-slate-500 font-normal">clases</span>
                          </span>
                        </div>
                      </div>

                      {/* Warnings */}
                      <div className="flex justify-start">
                        {getCapacityWarning(room.capacity)}
                      </div>

                      {/* Section Progress */}
                      {(() => {
                        const assignedSection = sections?.find(s => s.homeClassroomId === room.id && s.periodId === activePeriodId);
                        if (assignedSection && students) {
                          const enrolled = students.filter(s => s.academicYear === assignedSection.grade && s.section === assignedSection.letter).length;
                          const percent = Math.min(100, Math.round((enrolled / room.capacity) * 100));
                          const isOverfull = percent >= 100;
                          
                          return (
                            <div className="mt-2 p-3 bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/60 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider">
                                  Aula Base: {assignedSection.grade}° "{assignedSection.letter}"
                                </span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${isOverfull ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                  {percent}%
                                </span>
                              </div>
                              <div className="w-full bg-indigo-200/50 rounded-full h-2 mb-1.5 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${isOverfull ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
                              </div>
                              <div className="text-[11px] font-bold text-indigo-600/80 text-right">
                                {enrolled} de {room.capacity} inscritos
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Actions (Only for supervisor role) */}
                    {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(room)}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Editar
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
                          className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {visibleCount < classrooms.length && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount(p => p + 8)}
                  className="text-base font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 pointer-events-auto cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Cargar más aulas
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal de Eliminación */}
      <Modal isOpen={!!roomToDelete} onClose={() => setRoomToDelete(null)} title="Confirmar Desincorporación">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            ¿Está seguro de desincorporar <strong>{roomToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setRoomToDelete(null)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button
              onClick={() => {
                if (roomToDelete) {
                  onRemoveClassroom(roomToDelete.id);
                  toast.success(`Aula física "${roomToDelete.name}" desincorporada exitosamente.`);
                  setRoomToDelete(null);
                }
              }}
              className="px-4 py-2 text-base font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Desincorporar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoomId ? "Editar Aula Física" : "Registrar Nueva Aula Física"}>
        {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
          <div id="room-form-locked" className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800 space-y-2">
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
              <div id="add-room-error" className="p-2.5 bg-rose-50 border border-rose-250 font-medium rounded-lg text-rose-800 text-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div id="add-room-success" className="p-2.5 bg-green-50 border border-green-250 font-medium rounded-lg text-green-800 text-sm">
                {successMsg}
              </div>
            )}

            <div id="form-room-name" className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nombre / Identificador del Espacio</label>
              <input
                type="text"
                placeholder="EJ. LABORATORIO DE BIOLOGÍA"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                className={`w-full text-sm p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white font-medium ${isDuplicateName || fieldErrors.nombre_codigo ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
              />
              {isDuplicateName && <p className="text-red-600 text-sm">Este nombre ya está registrado</p>}
              {fieldErrors.nombre_codigo && <p className="text-red-600 text-sm">{fieldErrors.nombre_codigo}</p>}
            </div>

            <div id="form-room-cap" className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Capacidad de Pupitres</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <div id="form-room-type" className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Función / Tipología</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Teórica">Teórica</option>
                <option value="Laboratorio">Laboratorio Especializado</option>
                <option value="Deportiva">Deportiva / Recreativa</option>
              </select>
            </div>

            <div id="form-room-loc" className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ubicación (Nivel / Piso)</label>
              {isCustomLocation ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Escriba la nueva ubicación..."
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomLocation(false);
                      setLocation(uniqueLocations.length > 0 ? uniqueLocations[0] : 'Planta Baja');
                    }}
                    className="px-3 py-2.5 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 cursor-pointer transition-colors"
                  >
                    Volver
                  </button>
                </div>
              ) : (
                <select
                  value={location}
                  onChange={(e) => {
                    if (e.target.value === 'custom_new') {
                      setIsCustomLocation(true);
                      setLocation('');
                    } else {
                      setLocation(e.target.value);
                    }
                  }}
                  className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  {uniqueLocations.length === 0 && <option value="Planta Baja">Planta Baja</option>}
                  <option value="custom_new" className="font-bold bg-indigo-50 text-indigo-700">➕ Otra (Escribir nueva)...</option>
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={isDuplicateName || !name.trim() || isSubmitting}
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {editingRoomId ? 'Guardando...' : 'Registrando...'}</>
              ) : isDuplicateName ? (
                'Nombre ya existe'
              ) : (
                editingRoomId ? 'Guardar Cambios' : 'Registrar Aula en Inventario'
              )}
            </button>
          </form>
        )}
      </Modal>

    </>
  );
}
