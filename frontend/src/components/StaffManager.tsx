/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, UserPlus, ToggleLeft, ToggleRight, Check, CheckCircle2, UserCheck, AlertCircle, PlusCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { Modal } from './Modal';

interface StaffManagerProps {
  users: User[];
  currentUserRole: UserRole;
  onSetUserRole: (role: UserRole) => void;
  onAddUser: (user: User) => void;
  onToggleUserActive: (userId: string) => void;
}

export default function StaffManager({ users, currentUserRole, onSetUserRole, onAddUser, onToggleUserActive }: StaffManagerProps) {
  // Setup forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('docente');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [visibleUsersCount, setVisibleUsersCount] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cedula) {
      setErrorMsg('Nombre, Correo y Cédula son obligatorios');
      setSuccessMsg('');
      return;
    }

    // Format Cedula
    let cleanCedula = cedula.trim().toUpperCase();
    if (!cleanCedula.startsWith('V-') && !cleanCedula.startsWith('E-')) {
      cleanCedula = 'V-' + cleanCedula;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      cedula: cleanCedula,
      phone: phone.trim(),
      active: true,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=150`
    };

    onAddUser(newUser);
    setSuccessMsg(`Usuario ${newUser.name} registrado con éxito.`);
    setErrorMsg('');
    
    // Clear forms
    setName('');
    setEmail('');
    setCedula('');
    setPhone('');
    setIsModalOpen(false);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="bg-red-50 text-red-700 border border-red-200/50 text-[10px] px-2 py-0.5 rounded-full font-bold">Director/Principal</span>;
      case 'control_estudios':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 text-[10px] px-2 py-0.5 rounded-full font-bold">Ctrl de Estudios</span>;
      case 'docente':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] px-2 py-0.5 rounded-full font-bold">Docente</span>;
    }
  };

  return (
    <>
      <div id="user-manager-container" className="space-y-8 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">


      {successMsg && (
        <div id="user-success" className="p-3 bg-indigo-50 text-indigo-800 text-xs rounded-lg flex items-center gap-2 border border-indigo-100">
          <CheckCircle2 className="h-4 bg-transparent text-indigo-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Users list full width now */}
      <div id="users-grid" className="grid grid-cols-1 gap-6">
        
        {/* Users List */}
        <div id="users-list-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
          <div id="users-list-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Directorio del Personal & Usuarios</h3>
            <div className="flex items-center gap-4">
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Total: {users.length}</span>
              {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrar Personal
                </button>
              )}
            </div>
          </div>

          <div id="users-items" className="space-y-3.5">
            {users.slice(0, visibleUsersCount).map(u => (
              <div id={`user-card-${u.id}`} key={u.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl transition-all">
                <div id={`user-card-info-${u.id}`} className="flex items-center gap-3">
                  <img id={`user-avatar-${u.id}`} src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'} className="h-10 w-10 rounded-full object-cover border border-slate-200" alt="avatar" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 leading-tight">{u.name}</span>
                      {getRoleBadge(u.role)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500 font-mono">{u.cedula}</span>
                      <span>•</span>
                      <span>{u.email}</span>
                      {u.phone && (
                        <>
                          <span>•</span>
                          <span>{u.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Toggle / Controls (Only available if current user is super_admin or control_estudios) */}
                {['super_admin', 'control_estudios'].includes(currentUserRole) ? (
                  <button 
                    id={`active-toggle-${u.id}`}
                    onClick={() => {
                      if (u.id === 'usr-1' || u.id === 'usr-2') {
                        setErrorMsg('No se pueden desactivar los usuarios del staff fundadores de demostración.');
                        return;
                      }
                      onToggleUserActive(u.id);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors pointer-events-auto cursor-pointer"
                    title={u.active ? "Desactivar Usuario" : "Activar Usuario"}
                  >
                    {u.active ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-slate-300" />
                    )}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-300 font-medium">Solo lectura</span>
                )}
              </div>
            ))}
            
            {visibleUsersCount < users.length && (
              <div className="flex justify-center pt-2 pb-1">
                <button
                  onClick={() => setVisibleUsersCount(prev => prev + 3)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1 cursor-pointer pointer-events-auto"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Ver más
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      </div>

      {/* Modal for User Registration */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Personal">
        {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
          <div id="add-user-locked" className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="font-bold">Acceso Denegado</p>
            <p className="leading-relaxed">
              Tu rol actual de demostración (Docente) no tiene permisos para crear usuarios. 
              Por favor, selecciona el rol <strong>Director</strong> o <strong>Control de Estudios</strong> en la barra superior para habilitar esta funcionalidad.
            </p>
          </div>
        ) : (
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div id="user-form-error" className="p-2.5 bg-rose-50 text-rose-800 text-[11px] rounded-lg border border-rose-200 font-medium">
                {errorMsg}
              </div>
            )}

            <div id="form-name-group" className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Prof. Nombre Apellido" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div id="form-cedula-group" className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Cédula de Identidad</label>
              <input 
                type="text" 
                placeholder="V-20.123.456 o 20123456" 
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div id="form-email-group" className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="usuario@liceo-mppe.edu.ve" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div id="form-phone-group" className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Teléfono de Contacto (Opcional)</label>
              <input 
                type="text" 
                placeholder="0414-0000000" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div id="form-role-group" className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Rol / Cargo</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
              >
                <option value="docente">Docente / Profesor</option>
                <option value="control_estudios">Cuerpo de Control de Estudios (Admin)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer"
            >
              Agregar Personal
            </button>
          </form>
        )}
      </Modal>

    </>
  );
}
