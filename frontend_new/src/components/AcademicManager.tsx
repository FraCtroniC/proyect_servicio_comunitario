/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, UserPlus, Filter, ShieldAlert, GraduationCap, Users } from 'lucide-react';
import { Student, AcademicYear, UserRole } from '../types';
import { Modal } from './Modal';

interface AcademicManagerProps {
  students: Student[];
  currentUserRole: UserRole;
  onAddStudent: (std: Student) => void;
  onUpdateStudentStatus: (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => void;
}

export default function AcademicManager({ students, currentUserRole, onAddStudent, onUpdateStudentStatus }: AcademicManagerProps) {
  // Modal states
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  // Section Form states
  const [secPeriodo, setSecPeriodo] = useState<number>(1);
  const [secGrado, setSecGrado] = useState<number>(1);
  const [secLetra, setSecLetra] = useState<string>('A');
  const [secDocente, setSecDocente] = useState<number>(1);
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se llamaría a la API para crear la sección
    setSecSuccess(`Sección ${secGrado}° "${secLetra}" creada para el periodo ${secPeriodo}`);
    setTimeout(() => { setIsSectionModalOpen(false); setSecSuccess(''); }, 2000);
  };



  return (
    <div id="academic-manager-container" className="space-y-6 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div id="academic-header" className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 id="academic-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            Gestión de Secciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">Administración de Secciones Activas por Grado y Periodo Escolar.</p>
        </div>
      </div>

      {/* Main layout grid */}
      <div id="academic-grid" className="grid grid-cols-1 gap-6">

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Secciones Aperturadas</h3>
              {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                <button
                  onClick={() => setIsSectionModalOpen(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  Aperturar Sección
                </button>
              )}
            </div>
            
            <div className="p-8 text-center text-slate-500 text-xs">
              Módulo de visualización de Secciones en construcción...
            </div>
          </div>
      </div>

      {/* Modal Secciones */}
      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Aperturar Nueva Sección">
        <form onSubmit={handleCreateSection} className="space-y-4">
          {secError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-[11px]">
              {secError}
            </div>
          )}
          {secSuccess && (
            <div className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-[11px]">
              {secSuccess}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Periodo Académico</label>
            <select
              value={secPeriodo}
              onChange={(e) => setSecPeriodo(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value={1}>2025-2026 (Activo)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Grado / Año</label>
              <select
                value={secGrado}
                onChange={(e) => setSecGrado(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value={1}>1er Año</option>
                <option value={2}>2do Año</option>
                <option value={3}>3er Año</option>
                <option value={4}>4to Año</option>
                <option value={5}>5to Año</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Letra</label>
              <select
                value={secLetra}
                onChange={(e) => setSecLetra(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                {['A','B','C','D','E','F'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Docente Guía</label>
            <input 
              type="number"
              placeholder="ID del Docente Guía"
              value={secDocente}
              onChange={(e) => setSecDocente(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
          >
            Aperturar Sección
          </button>
        </form>
      </Modal>

    </div>
  );
}
