/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, ToggleLeft, ToggleRight, CheckCircle2, UserCheck, Users, Briefcase, Shield, BookOpen } from 'lucide-react';
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
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('docente');
  const [cedula, setCedula] = useState('');
  const [username, setUsername] = useState('');
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
    setLastName('');
    setEmail('');
    setRole('docente');
    setCedula('');
    setUsername('');
    setPhone('');
    setPassword('');
    setEditingUserId(null);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setName(u.firstName || u.name?.split(' ')[0] || '');
    setLastName(u.lastName || u.name?.split(' ').slice(1).join(' ') || '');
    setEmail(u.email);
    setRole(u.role);
    setCedula(u.cedula || '');
    setUsername(u.username || u.cedula || '');
    setPhone(u.phone || '');
    setPassword('');
    setEditingUserId(u.id);
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    try {
      const userData = { name, lastName, email, role, cedula, username, phone, password };
      if (editingUserId) {
        await onEditUser(editingUserId, userData);
        setSuccessMsg('Usuario editado con éxito.');
      } else {
        if (!password) {
          setErrorMsg('La contraseña es requerida para un nuevo usuario.');
          return;
        }
        await onAddUser(userData);
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

      {/* Role Statistics Cards */}
      {(() => {
        const totalUsuarios = users.length;
        const docentes = users.filter(u => u.role === 'docente').length;
        const administradores = users.filter(u => u.role === 'super_admin').length;
        const controlEstudios = users.filter(u => u.role === 'control_estudios').length;
        const coordinadores = users.filter(u => u.role === 'coordinador').length;
        const filteredCount = filterRole ? users.filter(u => u.role === filterRole).length : totalUsuarios;

        const stats = [
          {
            label: 'TOTAL USUARIOS',
            value: totalUsuarios,
            sub: filterRole ? `${filteredCount} filtrados` : 'Registrados en el sistema',
            icon: <Users className="h-6 w-6" />,
            bg: 'bg-slate-50',
            iconColor: 'text-slate-500',
            border: 'border-slate-200/80',
            activeBorder: 'border-slate-600',
            roleFilter: '' as UserRole | '',
          },
          {
            label: 'DOCENTES',
            value: docentes,
            sub: 'Registrados',
            icon: <Briefcase className="h-6 w-6" />,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            border: 'border-blue-200/60',
            activeBorder: 'border-blue-500 ring-2 ring-blue-200',
            roleFilter: 'docente' as UserRole | '',
          },
          {
            label: 'ADMINISTRADORES',
            value: administradores,
            sub: 'Con acceso',
            icon: <Shield className="h-6 w-6" />,
            bg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            border: 'border-amber-200/60',
            activeBorder: 'border-amber-500 ring-2 ring-amber-200',
            roleFilter: 'super_admin' as UserRole | '',
          },
          {
            label: 'CONTROL DE ESTUDIOS',
            value: controlEstudios,
            sub: 'Registrados',
            icon: <BookOpen className="h-6 w-6" />,
            bg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            border: 'border-indigo-200/60',
            activeBorder: 'border-indigo-500 ring-2 ring-indigo-200',
            roleFilter: 'control_estudios' as UserRole | '',
          },
        ];

        if (coordinadores > 0) {
          stats.push({
            label: 'COORDINADORES',
            value: coordinadores,
            sub: 'Registrados',
            icon: <UserCheck className="h-6 w-6" />,
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            border: 'border-emerald-200/60',
            activeBorder: 'border-emerald-500 ring-2 ring-emerald-200',
            roleFilter: 'coordinador' as UserRole | '',
          });
        }

        return (
          <div id="user-stats-section" className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Gestión de Usuarios</h3>
            <div id="user-stats-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.map((stat) => {
                const isActive = filterRole === stat.roleFilter;
                return (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => {
                      setFilterRole(stat.roleFilter);
                      setFilterName('');
                    }}
                    className={`bg-white p-4 rounded-xl border shadow-xs flex items-center gap-3 transition-all text-left w-full cursor-pointer ${isActive ? stat.activeBorder : stat.border} ${isActive ? 'shadow-sm' : 'hover:border-slate-300 hover:shadow-sm'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-semibold uppercase tracking-wider ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>{stat.label}</p>
                      <h3 className={`text-2xl font-bold mt-1 ${isActive ? 'text-indigo-600' : 'text-slate-800'}`}>{stat.value}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">{stat.sub}</p>
                    </div>
                    <div className={`p-2.5 ${stat.bg} ${stat.iconColor} rounded-lg shrink-0`}>
                      {stat.icon}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nombre(s)</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.nombre1 ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
              {fieldErrors.nombre1 && <p className="text-red-600 text-sm mt-1">{fieldErrors.nombre1}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Apellido(s)</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.apellido1 ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
              {fieldErrors.apellido1 && <p className="text-red-600 text-sm mt-1">{fieldErrors.apellido1}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Cédula</label>
              <input type="text" required value={cedula} onChange={e => setCedula(e.target.value)} placeholder="V-12345678" className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.cedula ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
              {fieldErrors.cedula && <p className="text-red-600 text-sm mt-1">{fieldErrors.cedula}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Usuario</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.username ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
              {fieldErrors.username && <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.correo ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
            {fieldErrors.correo && <p className="text-red-600 text-sm mt-1">{fieldErrors.correo}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Teléfono</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="xxxx-xxxxxxx" className={`mt-1 w-full p-2 border rounded-lg text-base ${fieldErrors.telefono ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-slate-300'}`} />
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
