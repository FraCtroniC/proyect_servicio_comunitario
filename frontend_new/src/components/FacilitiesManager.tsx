/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, PlusCircle, Trash, Shield, AlertTriangle, Cpu, Radio, ShieldCheck } from 'lucide-react';
import { Classroom, ScheduleEvent, UserRole } from '../types';

interface FacilitiesProps {
  classrooms: Classroom[];
  scheduleEvents: ScheduleEvent[];
  currentUserRole: UserRole;
  onAddClassroom: (room: Classroom) => void;
  onRemoveClassroom: (roomId: string) => void;
}

export default function FacilitiesManager({
  classrooms,
  scheduleEvents,
  currentUserRole,
  onAddClassroom,
  onRemoveClassroom
}: FacilitiesProps) {
  // Add Classroom form states
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [type, setType] = useState<'Teórica' | 'Laboratorio' | 'Deportiva' | 'Comunitaria'>('Teórica');
  const [resources, setResources] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capacity) {
      setErrorMsg('Nombre y Capacidad son requeridos.');
      return;
    }

    // Split resources
    const parsedResources = resources ? resources.split(',').map(r => r.trim()).filter(Boolean) : [];

    const newRoom: Classroom = {
      id: 'rm-' + Date.now(),
      name,
      capacity,
      type,
      resources: parsedResources
    };

    onAddClassroom(newRoom);
    setSuccessMsg(`Aula física "${newRoom.name}" agregada con éxito.`);
    setErrorMsg('');
    setName('');
    setCapacity(30);
    setResources('');
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
    <div id="facilities-root" className="space-y-6 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <div id="facilities-header" className="border-b border-slate-100 pb-4">
        <h1 id="facilities-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Home className="h-6 w-6 text-indigo-600" />
          Administración de Planta Física y Aulas
        </h1>
        <p className="text-xs text-slate-500 mt-1">Estructuración e inventariado de salones de clase teóricos, laboratorios especializados, y espacios deportivos regulados por el MPPE.</p>
      </div>

      <div id="facilities-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Room list display (col span 2) */}
        <div id="room-list-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 lg:col-span-2 space-y-4 shadow-xs">
          <div id="room-list-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Directorio de Planta Física Activa</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded">Total Locaciones: {classrooms.length}</span>
          </div>

          <div id="room-cards" className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
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

                    {room.resources.length > 0 && (
                      <div id={`room-resources-${room.id}`} className="space-y-1 pt-1.5 border-t border-slate-150">
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
                    <div className="flex justify-end pt-3 border-t border-slate-105 mt-3">
                      <button
                        id={`btn-del-room-${room.id}`}
                        onClick={() => {
                          if (bookingCount > 0) {
                            alert("No se puede desincorporar este salón ya que posee bloques horarios planificados pendientes.");
                            return;
                          }
                          onRemoveClassroom(room.id);
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

        {/* Right Side: Add new space register (requires SuperAdmin or ControlDeEstudios) */}
        <div id="add-room-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs h-fit space-y-4">
          <div id="add-room-panel-header" className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-600" />
              Ingresar Nueva Locación
            </h3>
          </div>

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
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <div id="form-room-cap" className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Aforo / Capacidad de Pupitres</label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
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
                  <option value="Teórica">Teórica (Aulas de EMG)</option>
                  <option value="Laboratorio">Laboratorio Especializado</option>
                  <option value="Deportiva">Deportiva / Recreativa</option>
                  <option value="Comunitaria">Taller de Vinculación Comunitaria</option>
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

        </div>

      </div>

    </div>
  );
}
