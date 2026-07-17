import React, { useState, useEffect } from 'react';
import { UserPlus, ToggleLeft, ToggleRight, CheckCircle2, Users, Briefcase, Shield, BookOpen, PlusCircle, AlertCircle, UserCheck } from 'lucide-react';
import { User, UserRole, Especialidad } from '../types';
import { api } from '../services/api';
import { Modal } from './Modal';
import { SearchableSelect } from './SearchableSelect';

interface UserManagerProps {
  users: User[];
  currentUserRole: UserRole;
  onAddUser: (user: Partial<User> & { password?: string; lastName?: string; username?: string; secondName?: string; secondLastName?: string; dateOfBirth?: string; id_especialidad?: number }) => Promise<void>;
  onEditUser: (userId: string, data: Partial<User> & { password?: string; lastName?: string; username?: string; secondName?: string; secondLastName?: string; dateOfBirth?: string; id_especialidad?: number }) => Promise<void>;
  onToggleUserActive: (userId: string) => Promise<void>;
}

export default function UserManager({ users, currentUserRole, onAddUser, onEditUser, onToggleUserActive }: UserManagerProps) {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [cedulaType, setCedulaType] = useState('V');
  const [cedula, setCedula] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dobError, setDobError] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('docente');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [id_especialidad, setIdEspecialidad] = useState<number | ''>('');
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive'>('active');

  const [isEspecialidadModalOpen, setIsEspecialidadModalOpen] = useState(false);

  useEffect(() => {
    const initialFilter = sessionStorage.getItem('initialUserFilter');
    if (initialFilter) {
      setFilterRole(initialFilter as UserRole);
      sessionStorage.removeItem('initialUserFilter');
    }
  }, []);
  const [newEspecialidadName, setNewEspecialidadName] = useState('');
  const [especialidadErrorMsg, setEspecialidadErrorMsg] = useState('');

  useEffect(() => {
    api.get<any[]>('/api/especialidades').then(res => {
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setEspecialidades(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!cedula) {
      setUsername('');
      return;
    }
    const num = cedula.replace(/\D/g, '');
    if (num) {
      setUsername(`${cedulaType}-${num}`);
    }
  }, [cedula, cedulaType]);

  const checkCedula = (val: string, type: string, isBlur: boolean = false) => {
    if (!val) { setCedulaError(''); return; }
    const fullCedula = `${type}-${val.trim()}`;

    if (editingUserId) {
      const currentUser = users.find(u => u.id === editingUserId);
      if (currentUser && (currentUser.cedula === fullCedula || currentUser.cedula === val.trim())) {
        setCedulaError('');
        return;
      }
    }

    const duplicate = users.some(u =>
      u.cedula === fullCedula || u.cedula === val.trim()
    );
    if (duplicate) {
      setCedulaError('Esta cédula ya está registrada.');
      return;
    }

    if (isBlur && !val.trim().match(/^\d{7,9}$/)) {
      setCedulaError('Formato inválido (Solo 7-9 números)');
      return;
    }

    setCedulaError('');
  };

  const checkDateOfBirth = (val: string) => {
    if (!val) { setDobError(''); return; }
    const today = new Date();
    const dob = new Date(val);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 18 || age > 70) {
      setDobError('La edad debe estar entre 18 y 70 años.');
    } else {
      setDobError('');
    }
  };

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
    setEditingUserId(null);
    setFirstName('');
    setSecondName('');
    setLastName('');
    setSecondLastName('');
    setCedulaType('V');
    setCedula('');
    setDateOfBirth('');
    setEmail('');
    setRole('docente');
    setUsername('');
    setPhone('');
    setPassword('');
    setIdEspecialidad('');
    setCedulaError('');
    setDobError('');
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUserId(u.id);
    setFirstName(u.firstName || u.name?.split(' ')[0] || '');
    setSecondName(u.secondName || '');
    setLastName(u.lastName || u.name?.split(' ').slice(1).join(' ') || '');
    setSecondLastName(u.secondLastName || '');
    const [type, num] = (u.cedula || '').split('-');
    setCedulaType(type || 'V');
    setCedula(num || u.cedula || '');
    setDateOfBirth(u.dateOfBirth || '');
    setEmail(u.email);
    setRole(u.role);
    setUsername(u.username || u.cedula || '');
    setPhone(u.phone || '');
    setPassword('');
    setIdEspecialidad(u.id_especialidad || '');
    setCedulaError('');
    setDobError('');
    setErrorMsg('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (!firstName || !lastName || !cedula) {
      setErrorMsg('Nombre, Apellido y Cédula son obligatorios');
      return;
    }

    if (role === 'docente') {
      if (!cedula.trim().match(/^\d{7,9}$/)) {
        setCedulaError('Formato inválido (Solo 7-9 números)');
        return;
      }
      if (dateOfBirth) {
        const today = new Date();
        const dob = new Date(dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18 || age > 70) {
          setDobError('La edad debe estar entre 18 y 70 años.');
          return;
        }
      } else if (!editingUserId) {
        setDobError('La fecha de nacimiento es obligatoria para docentes');
        return;
      }
    }

    const fullCedula = `${cedulaType}-${cedula.trim()}`;

    try {
      const userData: any = {
        name: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        cedula: fullCedula,
        username: username.trim() || fullCedula,
        phone: phone.trim() || undefined,
        secondName: secondName.trim() || undefined,
        secondLastName: secondLastName.trim() || undefined,
      };

      if (password) userData.password = password;

      if (role === 'docente') {
        userData.dateOfBirth = dateOfBirth || undefined;
        userData.id_especialidad = id_especialidad ? Number(id_especialidad) : undefined;
      }

      if (editingUserId) {
        await onEditUser(editingUserId, userData);
        setSuccessMsg('Usuario editado con éxito.');
      } else {
        if (!password) {
          setErrorMsg('La contraseña es requerida para un nuevo usuario.');
          return;
        }
        await onAddUser(userData);
        setSuccessMsg('Usuario creado con éxito.');
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

  const handleCreateEspecialidad = async (e: React.FormEvent) => {
    e.preventDefault();
    setEspecialidadErrorMsg('');
    if (!newEspecialidadName.trim()) {
      setEspecialidadErrorMsg('El nombre de la especialidad es obligatorio');
      return;
    }
    try {
      const res: any = await api.especialidades.create({ nombre: newEspecialidadName.trim() });
      const nueva = res.data || res;
      setEspecialidades(prev => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setIdEspecialidad(nueva.id_especialidad);
      setIsEspecialidadModalOpen(false);
      setNewEspecialidadName('');
    } catch (err: any) {
      setEspecialidadErrorMsg(err.message || 'Error al crear la especialidad');
    }
  };

  const isDocente = role === 'docente';
  const canManage = ['super_admin', 'control_estudios'].includes(currentUserRole);
  const canCreate = currentUserRole === 'super_admin';

  const adminCount = users.filter(u => u.role === 'super_admin' && u.active).length;
  const canAddAdmin = adminCount < 2;

  const especialidadNombre = (id: number | undefined) => {
    if (!id) return '';
    const esp = especialidades.find(e => e.id_especialidad === id);
    return esp ? esp.nombre : '';
  };

  return (
    <>
      <div className="space-y-8 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">

      {successMsg && (
        <div className="p-3 bg-indigo-50 text-indigo-800 text-sm rounded-lg flex items-center gap-2 border border-indigo-100">
          <CheckCircle2 className="h-4 bg-transparent text-indigo-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 text-sm rounded-lg flex items-center gap-2 border border-red-100">
          <AlertCircle className="h-4 bg-transparent text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Role Statistics Cards */}
      {(() => {
        const totalUsuarios = users.filter(u => u.active).length;
        const docentes = users.filter(u => u.role === 'docente' && u.active).length;
        const administradores = users.filter(u => u.role === 'super_admin' && u.active).length;
        const controlEstudios = users.filter(u => u.role === 'control_estudios' && u.active).length;
        const coordinadores = users.filter(u => u.role === 'coordinador' && u.active).length;

        const stats = [
          {
            label: 'TOTAL USUARIOS',
            value: totalUsuarios,
            sub: 'Registrados en el sistema',
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
            sub: `Activos (máx. 2)`,
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
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Gestión de Usuarios</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.map((stat) => {
                const isActive = filterRole === stat.roleFilter;
                return (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => { setFilterRole(stat.roleFilter); setFilterName(''); }}
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

      {/* Users List */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Cuentas de Acceso del Sistema</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Total Cuentas: {users.length}</span>
              {canCreate && (
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Estado:</span>
            {[
              { value: 'active' as const, label: 'Activos', count: users.filter(u => u.active).length, bg: 'bg-green-50', activeBg: 'bg-green-600', activeText: 'text-white' },
              { value: 'inactive' as const, label: 'Inactivos', count: users.filter(u => !u.active).length, bg: 'bg-red-50', activeBg: 'bg-red-500', activeText: 'text-white' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  filterStatus === opt.value
                    ? `${opt.activeBg} ${opt.activeText} border-transparent shadow-sm`
                    : `${opt.bg} text-slate-600 border-slate-200 hover:border-slate-300`
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>

          {(() => {
            const filteredUsers = users
              .filter(u => {
                const searchLower = filterName.toLowerCase();
                const matchName = `${u.name} ${u.cedula} ${u.email} ${u.username}`.toLowerCase().includes(searchLower);
                const matchRole = filterRole ? u.role === filterRole : true;
                const matchStatus = filterStatus === 'active' ? u.active : !u.active;
                return matchName && matchRole && matchStatus;
              })
              .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));

            return (
              <>
                <div className="space-y-3.5">
                  {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 5)).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {u.firstName ? u.firstName.charAt(0) : u.name?.charAt(0)}{u.lastName ? u.lastName.charAt(0) : ''}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800 leading-tight">{u.name}</span>
                            {getRoleBadge(u.role)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-400">
                            <span className="font-medium text-slate-500 font-mono">{u.cedula}</span>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{u.email}</span>
                            {u.phone && (
                              <>
                                <span>•</span>
                                <span>{u.phone}</span>
                              </>
                            )}
                          </div>
                          {u.role === 'docente' && (u.dateOfBirth || especialidadNombre(u.id_especialidad)) && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                              {u.dateOfBirth && <span>Nac: {u.dateOfBirth}</span>}
                              {especialidadNombre(u.id_especialidad) && (
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                                  {especialidadNombre(u.id_especialidad)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {canManage ? (
                        <div className="flex items-center shrink-0">
                          <button
                            onClick={async () => {
                              if (u.role === 'super_admin' && u.active) {
                                const otherAdmins = users.filter(x => x.role === 'super_admin' && x.active && x.id !== u.id);
                                if (otherAdmins.length === 0) {
                                  setErrorMsg('No se puede desactivar al único administrador del sistema. Debe haber al menos 1 administrador activo.');
                                  return;
                                }
                              }
                              if (u.role === 'super_admin' && !u.active) {
                                const activeAdmins = users.filter(x => x.role === 'super_admin' && x.active);
                                if (activeAdmins.length >= 2) {
                                  setErrorMsg(`Límite alcanzado: solo se permiten 2 administradores simultáneamente. Actualmente hay ${activeAdmins.length} activos.`);
                                  return;
                                }
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
                          {canCreate && (
                            <div className="flex items-center gap-2 ml-2">
                              <button onClick={() => openEditModal(u)} className="text-sm text-blue-600 hover:underline cursor-pointer">Editar</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-medium shrink-0">Solo lectura</span>
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
            );
          })()}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUserId ? "Editar Usuario" : "Nuevo Usuario"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && <div className="text-red-600 text-sm bg-red-50 p-2 rounded whitespace-pre-line">{errorMsg}</div>}

          {/* Información Personal */}
          <div className="space-y-3">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest block border-b border-indigo-50 pb-1">
              Información Personal
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Cédula <span className="text-red-500">*</span></label>
                <div className="flex">
                  <select
                    value={cedulaType}
                    onChange={(e) => setCedulaType(e.target.value)}
                    className={`text-sm p-2 bg-slate-50 border ${cedulaError ? 'border-red-400' : 'border-slate-200'} rounded-l focus:outline-hidden font-medium border-r-0`}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </select>
                  <input
                    required
                    type="text"
                    value={cedula}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCedula(val);
                      checkCedula(val, cedulaType);
                    }}
                    onBlur={(e) => checkCedula(e.target.value, cedulaType, true)}
                    className={`w-full text-sm p-2 bg-slate-50 border ${cedulaError ? 'border-red-400' : 'border-slate-200'} rounded-r focus:outline-hidden font-mono`}
                    placeholder="Ej. 12345678"
                  />
                </div>
                {cedulaError && <p className="text-red-500 text-xs mt-1 font-semibold">{cedulaError}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Rol <span className="text-red-500">*</span></label>
                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <option value="docente">Docente</option>
                  <option value="control_estudios">Control de Estudios</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="super_admin" disabled={!canAddAdmin && !(editingUserId && users.find(u => u.id === editingUserId)?.role === 'super_admin')}>
                    Administrador{!canAddAdmin ? ' (máximo alcanzado)' : ''}
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Nombre <span className="text-red-500">*</span></label>
                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className={`w-full text-sm p-2 bg-slate-50 border ${fieldErrors.nombre1 ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg focus:outline-hidden`} />
                {fieldErrors.nombre1 && <p className="text-red-600 text-xs mt-1">{fieldErrors.nombre1}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Nombre</label>
                <input type="text" value={secondName} onChange={e => setSecondName(e.target.value)}
                  className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" placeholder="Opcional" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Apellido <span className="text-red-500">*</span></label>
                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  className={`w-full text-sm p-2 bg-slate-50 border ${fieldErrors.apellido1 ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg focus:outline-hidden`} />
                {fieldErrors.apellido1 && <p className="text-red-600 text-xs mt-1">{fieldErrors.apellido1}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Apellido</label>
                <input type="text" value={secondLastName} onChange={e => setSecondLastName(e.target.value)}
                  className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" placeholder="Opcional" />
              </div>
            </div>

            {/* Fields that appear only when role is Docente */}
            {isDocente && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-slate-500">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                  <input type="date" value={dateOfBirth} onChange={e => { setDateOfBirth(e.target.value); setDobError(''); }}
                    onBlur={(e) => checkDateOfBirth(e.target.value)}
                    className={`w-full text-sm p-2 bg-slate-50 border ${dobError ? 'border-red-400' : 'border-slate-200'} rounded-lg focus:outline-hidden`} />
                  {dobError && <p className="text-red-500 text-xs mt-1 font-semibold">{dobError}</p>}
                </div>
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-slate-500">Especialidad</label>
                  <div className="flex gap-2">
                    <SearchableSelect
                      options={especialidades.map(esp => ({ value: esp.id_especialidad, label: esp.nombre }))}
                      value={id_especialidad}
                      onChange={(val) => setIdEspecialidad(val === '' ? '' : Number(val))}
                      placeholder="-- Seleccionar --"
                    />
                    <button type="button" onClick={() => { setEspecialidadErrorMsg(''); setNewEspecialidadName(''); setIsEspecialidadModalOpen(true); }}
                      className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded border border-indigo-200 shrink-0 cursor-pointer" title="Nueva especialidad">
                      <PlusCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Correo Electrónico <span className="text-red-500">*</span></label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className={`w-full text-sm p-2 bg-slate-50 border ${fieldErrors.correo ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg focus:outline-hidden`} />
                {fieldErrors.correo && <p className="text-red-600 text-xs mt-1">{fieldErrors.correo}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Teléfono</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="0412-1234567"
                  className={`w-full text-sm p-2 bg-slate-50 border ${fieldErrors.telefono ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg focus:outline-hidden`} />
                {fieldErrors.telefono && <p className="text-red-600 text-xs mt-1">{fieldErrors.telefono}</p>}
              </div>
            </div>
          </div>

          {/* Cuenta de Acceso */}
          <div className="space-y-3 pt-2">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest block border-b border-indigo-50 pb-1">
              Cuenta de Acceso
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Nombre de Usuario</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className={`w-full text-sm p-2 bg-slate-50 border ${fieldErrors.username ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg focus:outline-hidden font-mono`} />
                {fieldErrors.username && <p className="text-red-600 text-xs mt-1">{fieldErrors.username}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Contraseña {editingUserId ? '(Dejar en blanco)' : ''} <span className="text-red-500">*</span></label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* Especialidad Modal */}
      <Modal isOpen={isEspecialidadModalOpen} onClose={() => setIsEspecialidadModalOpen(false)} title="Nueva Especialidad" maxWidth="max-w-md">
        <form onSubmit={handleCreateEspecialidad} className="flex flex-col gap-4">
          {especialidadErrorMsg && <div className="p-2 bg-rose-50 text-rose-700 text-sm rounded-lg font-medium border border-rose-100">{especialidadErrorMsg}</div>}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre de la Especialidad <span className="text-rose-500">*</span></label>
            <input autoFocus type="text" value={newEspecialidadName} onChange={e => setNewEspecialidadName(e.target.value)}
              placeholder="Ej. Profesor de Biología"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-sm" required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsEspecialidadModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">Aceptar</button>
          </div>
        </form>
      </Modal>

      </div>
    </>
  );
}
