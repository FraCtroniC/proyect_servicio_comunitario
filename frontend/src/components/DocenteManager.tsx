import React, { useState } from 'react';
import { BookOpen, UserPlus, CheckCircle2, AlertCircle, PlusCircle, UserCheck } from 'lucide-react';
import { Docente, UserRole } from '../types';
import { Modal } from './Modal';

interface DocenteManagerProps {
  docentes: Docente[];
  currentUserRole: UserRole;
  onAddDocente: (docente: Omit<Docente, 'id'>) => Promise<void>;
  onToggleDocenteActive: (id: string) => Promise<void>;
}

export default function DocenteManager({ docentes, currentUserRole, onAddDocente, onToggleDocenteActive }: DocenteManagerProps) {
  // Setup forms
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !cedula) {
      setErrorMsg('El Primer Nombre, Primer Apellido y Cédula son obligatorios');
      setSuccessMsg('');
      return;
    }

    // Format Cedula
    let cleanCedula = cedula.trim().toUpperCase();
    if (!cleanCedula.startsWith('V-') && !cleanCedula.startsWith('E-')) {
      cleanCedula = 'V-' + cleanCedula;
    }

    setIsSubmitting(true);
    try {
      const newDocente = {
        cedula: cleanCedula,
        firstName: firstName.trim(),
        secondName: secondName.trim() || undefined,
        lastName: lastName.trim(),
        secondLastName: secondLastName.trim() || undefined,
        specialty: specialty.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        status: 'Activo' as const
      };

      await onAddDocente(newDocente);
      
      setSuccessMsg(`Docente ${newDocente.firstName} ${newDocente.lastName} registrado con éxito.`);
      setErrorMsg('');
      
      // Clear forms
      setFirstName('');
      setSecondName('');
      setLastName('');
      setSecondLastName('');
      setCedula('');
      setSpecialty('');
      setPhone('');
      setEmail('');
      setIsModalOpen(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'Error al guardar el docente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-indigo-600" />
              Gestión de Docentes
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Administre el personal docente, sus asignaciones y accesos.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                {docentes.length}
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Docentes</span>
            </div>
            
            {['super_admin', 'control_estudios'].includes(currentUserRole) && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-indigo-600/20"
              >
                <UserPlus className="w-4 h-4" />
                Registrar Docente
              </button>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl flex items-center gap-3 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="h-5 w-5 bg-transparent text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* List of Teachers */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {docentes.slice(0, visibleCount).map(d => (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {d.firstName.charAt(0)}{d.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">
                        {d.firstName} {d.lastName}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold tracking-wide">
                        {d.cedula}
                      </span>
                    </div>
                  </div>
                  
                  {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                    <button 
                      onClick={() => onToggleDocenteActive(d.id)}
                      className={`text-[10px] px-2 py-1 rounded-full font-bold transition-colors pointer-events-auto cursor-pointer ${d.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                    >
                      {d.status}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-500">
                  {d.specialty && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-600">{d.specialty}</span>
                    </div>
                  )}
                  {d.email && (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 text-center text-slate-400">@</span>
                      <span>{d.email}</span>
                    </div>
                  )}
                  {d.phone && (
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 text-center text-slate-400">#</span>
                      <span>{d.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < docentes.length && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount(p => p + 6)}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 pointer-events-auto cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Cargar más docentes
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Docente">
        {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="font-bold">Acceso Denegado</p>
            <p>Tu rol no tiene permisos para registrar docentes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Primer Nombre *</label>
                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej. Juan" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Segundo Nombre</label>
                <input type="text" value={secondName} onChange={e => setSecondName(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej. Carlos" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Primer Apellido *</label>
                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej. Pérez" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Segundo Apellido</label>
                <input type="text" value={secondLastName} onChange={e => setSecondLastName(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej. Gómez" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cédula de Identidad *</label>
              <input required type="text" value={cedula} onChange={e => setCedula(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="V-12345678" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Especialidad</label>
              <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej. Matemáticas, Física..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="docente@ejemplo.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Teléfono</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full text-sm p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors" placeholder="0414-1234567" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-colors mt-2 pointer-events-auto cursor-pointer"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Docente'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
