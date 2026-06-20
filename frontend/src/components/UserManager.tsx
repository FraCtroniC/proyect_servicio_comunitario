/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, UserPlus, ToggleLeft, ToggleRight, Check, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { Modal } from './Modal';

interface UserManagerProps {
  users: User[];
  currentUserRole: UserRole;
  onSetUserRole: (role: UserRole) => void;
  onAddUser: (user: User) => void;
  onToggleUserActive: (userId: string) => void;
}

export default function UserManager({ users, currentUserRole, onSetUserRole, onAddUser, onToggleUserActive }: UserManagerProps) {
  // Setup forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('docente');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

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
      {/* Simulation Persona Selector */}
      <div id="persona-selector-header" className="bg-indigo-50 border border-indigo-200/60 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-700" />
          Simulador de Perspectiva / Rol de Acceso
        </h3>
        <p className="text-xs text-indigo-700/80 mt-1">
          Cambia tu rol de acceso para probar de manera inmediata cómo el sistema restringe o habilita las diferentes vistas, 
          módulos de horarios, controles de asistencia y el cargado reglamentario de calificaciones MPPE.
        </p>

        <div id="role-buttons" className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {(['super_admin', 'control_estudios', 'docente'] as UserRole[]).map(r => {
            const isActive = currentUserRole === r;
            return (
              <button
                id={`role-btn-${r}`}
                key={r}
                onClick={() => {
                  onSetUserRole(r);
                  setSuccessMsg(`Simulando rol: ${r === 'super_admin' ? 'Director/Super Admin' : r === 'control_estudios' ? 'Funcionario Control de Estudios' : 'Profesor/Docente'}. Las vistas se han actualizado.`);
                  setErrorMsg('');
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-between pointer-events-auto cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-700 text-white shadow-md' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>
                  {r === 'super_admin' && '🔑 Director Principal'}
                  {r === 'control_estudios' && '📁 Control de Estudios'}
                  {r === 'docente' && '📝 Docente'}
                </span>
                {isActive && <Check id={`check-${r}`} className="h-4 w-4 bg-white text-indigo-700 rounded-full p-0.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

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
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Cuentas de Acceso del Sistema</h3>
            <div className="flex items-center gap-4">
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Total Cuentas: {users.length}</span>
            </div>
          </div>

          <div id="users-items" className="space-y-3.5">
            {(showAllUsers ? users : users.slice(0, 5)).map(u => (
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
          </div>
          {users.length > 5 && (
            <div className="pt-2 flex justify-center border-t border-slate-100 mt-4">
              <button
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-4 rounded-lg hover:bg-indigo-50 cursor-pointer"
              >
                {showAllUsers ? 'Ocultar usuarios' : `Ver más (${users.length - 5} ocultos)`}
              </button>
            </div>
          )}
        </div>

      </div>
      </div>
    </>
  );
}
