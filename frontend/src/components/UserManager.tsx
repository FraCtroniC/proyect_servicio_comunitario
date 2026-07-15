/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, ToggleLeft, ToggleRight, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { Modal } from './Modal';

interface UserManagerProps {
  users: User[];
  currentUserRole: UserRole;
  onAddUser: (user: Partial<User> & { password?: string }) => Promise<void>;
  onEditUser: (userId: string, data: Partial<User> & { password?: string }) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleUserActive: (userId: string) => Promise<void>;
}

export default function UserManager({ users, currentUserRole, onAddUser, onEditUser, onDeleteUser, onToggleUserActive }: UserManagerProps) {
  // Setup forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('docente');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');

  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="bg-red-50 text-red-700 border border-red-200/50 text-xs px-2 py-0.5 rounded-full font-bold">Director/Principal</span>;
      case 'control_estudios':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 text-xs px-2 py-0.5 rounded-full font-bold">Control de Estudios</span>;
      case 'coordinador':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-xs px-2 py-0.5 rounded-full font-bold">Coordinador</span>;
      case 'docente':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs px-2 py-0.5 rounded-full font-bold">Docente</span>;
    }
  };

  const openAddModal = () => {
    setName('');
    setEmail('');
    setRole('docente');
    setCedula('');
    setPhone('');
    setPassword('');
    setEditingUserId(null);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setCedula(u.cedula || u.username || '');
    setPhone(u.phone || '');
    setPassword('');
    setEditingUserId(u.id);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const isDocente = !!users.find(u => u.id === editingUserId)?.teacherId;

  const handleCedulaChange = (value: string) => {
    setCedula(value);
    if (!isDocente) {
      setName(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    try {
      if (editingUserId) {
        await onEditUser(editingUserId, { name, email, role, cedula, phone, password });
        setSuccessMsg('Usuario editado con éxito.');
      } else {
        if (!password) {
          setErrorMsg('La contraseña es requerida para un nuevo usuario.');
          return;
        }
        await onAddUser({ name, email, role, cedula, phone, password });
        setSuccessMsg('Usuario agregado con éxito.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else {
        setErrorMsg(err.message || 'Error al guardar el usuario.');
      }
    }
  };

  const triggerDelete = (u: User) => {
    setDeletingUser(u);
    setDeleteConfirmText('');
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await onDeleteUser(deletingUser.id);
      setSuccessMsg('Usuario eliminado con éxito.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al eliminar el usuario.');
    }
    setDeletingUser(null);
  };

  return (
    <>
      <div id="user-manager-container" className="space-y-8 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">

      {successMsg && (
        <div id="user-success" className="p-3 bg-indigo-50 text-indigo-800 text-sm rounded-lg flex items-center gap-2 border border-indigo-100">
          <CheckCircle2 className="h-4 bg-transparent text-indigo-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Users list full width now */}
      <div id="users-grid" className="grid grid-cols-1 gap-6">
        
        {/* Users List */}
        <div id="users-list-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
          <div id="users-list-header" className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Cuentas de Acceso del Sistema</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Total Cuentas: {users.length}</span>
              {['super_admin'].includes(currentUserRole) && (
                <button
                  onClick={openAddModal}
                  className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2 flex flex-col gap-1">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o correo..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium w-full"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-1">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
                className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium w-full"
              >
                <option value="">Todos los roles</option>
                <option value="super_admin">Director / Principal</option>
                <option value="control_estudios">Control de Estudios</option>
                <option value="coordinador">Coordinador</option>
                <option value="docente">Docente</option>
              </select>
            </div>
          </div>

          {(() => {
            const filteredUsers = users.filter(u => {
              const searchLower = filterName.toLowerCase();
              const matchName = `${u.name} ${u.cedula} ${u.email} ${u.username}`.toLowerCase().includes(searchLower);
              const matchRole = filterRole ? u.role === filterRole : true;
              return matchName && matchRole;
            });

            return (
              <>
                <div id="users-items" className="space-y-3.5">
                  {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 5)).map(u => (
                    <div id={`user-card-${u.id}`} key={u.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl transition-all">
                <div id={`user-card-info-${u.id}`} className="flex items-center gap-3">
                  <img id={`user-avatar-${u.id}`} src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'} className="h-10 w-10 rounded-full object-cover border border-slate-200" alt="avatar" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 leading-tight">{u.name}</span>
                      {getRoleBadge(u.role)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1 text-sm text-slate-400">
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
                  <div className="flex items-center">
                    <button 
                      id={`active-toggle-${u.id}`}
                      onClick={async () => {
                        if (u.id === 'usr-1' || u.id === 'usr-2') {
                          setErrorMsg('No se pueden desactivar los usuarios del staff fundadores de demostración.');
                          return;
                        }
                        try {
                          await onToggleUserActive(u.id);
                          setSuccessMsg(`Usuario ${u.name} ${u.active ? 'desactivado' : 'activado'} con éxito.`);
                          setErrorMsg('');
                        } catch (e: any) {
                          setErrorMsg(e.message || 'Error al cambiar estatus del usuario.');
                        }
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
                    {['super_admin'].includes(currentUserRole) && (
                      <div className="flex items-center gap-2 ml-2">
                        <button onClick={() => openEditModal(u)} className="text-sm text-blue-600 hover:underline cursor-pointer">Editar</button>
                        <button onClick={() => triggerDelete(u)} className="text-sm text-red-600 hover:underline cursor-pointer">Eliminar</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-300 font-medium">Solo lectura</span>
                )}
              </div>
                ))}
              </div>
              {filteredUsers.length > 5 && (
                <div className="pt-2 flex justify-center border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-4 rounded-lg hover:bg-indigo-50 cursor-pointer"
                  >
                    {showAllUsers ? 'Ocultar usuarios' : `Ver más (${filteredUsers.length - 5} ocultos)`}
                  </button>
                </div>
              )}
            </>
          )})()}
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUserId ? "Editar Usuario" : "Nuevo Usuario"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <div className="text-red-600 text-sm bg-red-50 p-2 rounded whitespace-pre-line">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-700">Nombre</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} readOnly={!isDocente} className={`mt-1 w-full p-2 border border-slate-300 rounded-lg text-base ${!isDocente ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Usuario / Cedula</label>
            <input type="text" required value={cedula} onChange={e => handleCedulaChange(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.username ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
            {fieldErrors.username && <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.correo ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
            {fieldErrors.correo && <p className="text-red-600 text-sm mt-1">{fieldErrors.correo}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Teléfono</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="xxxx-xxxxxxx" className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.telefono ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
            {fieldErrors.telefono && <p className="text-red-600 text-sm mt-1">{fieldErrors.telefono}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Rol</label>
            <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-base">
              <option value="docente">Docente</option>
              <option value="control_estudios">Control de Estudios</option>
              <option value="coordinador">Coordinador</option>
              <option value="super_admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Contraseña {editingUserId ? '(Dejar en blanco para no cambiar)' : ''}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-base" />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-base text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-base text-slate-600 leading-relaxed">
            Esta acción es irreversible. Para confirmar que deseas eliminar al usuario <strong className="text-slate-800">{deletingUser?.name}</strong>, por favor escribe su nombre exactamente en el campo de abajo.
          </p>
          <div>
            <input 
              type="text" 
              value={deleteConfirmText} 
              onChange={e => setDeleteConfirmText(e.target.value)} 
              className="w-full p-2 border border-slate-300 rounded-lg text-base focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" 
              placeholder={`Escribe: ${deletingUser?.name}`}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setDeletingUser(null)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
            <button 
              type="button" 
              onClick={confirmDelete}
              disabled={deleteConfirmText !== deletingUser?.name}
              className="px-4 py-2 text-base font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Eliminar Permanentemente
            </button>
          </div>
        </div>
      </Modal>

      </div>
    </>
  );
}
