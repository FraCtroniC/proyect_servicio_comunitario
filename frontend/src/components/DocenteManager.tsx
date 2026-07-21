import React, { useState, useEffect } from 'react';
import { BookOpen, UserPlus, CheckCircle2, AlertCircle, PlusCircle, UserCheck } from 'lucide-react';
import { Docente, UserRole, Especialidad, User } from '../types';
import { Modal } from './Modal';
import { api } from '../services/api';
import { SearchableSelect } from './SearchableSelect';

interface DocenteManagerProps {
  docentes: Docente[];
  users: User[];
  currentUserRole: UserRole;
  onAddDocente: (docente: Omit<Docente, 'id'>) => Promise<string | undefined>;
  onUpdateDocente?: (id: string, docente: Omit<Docente, 'id'>) => Promise<void>;
  onDeleteDocente?: (id: string) => Promise<void>;
  onToggleDocenteActive: (id: string) => Promise<void>;
}

export default function DocenteManager({ docentes, users, currentUserRole, onAddDocente, onUpdateDocente, onDeleteDocente, onToggleDocenteActive }: DocenteManagerProps) {
  // Setup forms
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [cedulaType, setCedulaType] = useState('V');
  const [cedula, setCedula] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [dobError, setDobError] = useState('');
  const [id_especialidad, setIdEspecialidad] = useState<number | ''>('');
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6);

  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  const [docenteToDelete, setDocenteToDelete] = useState<Docente | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filters
  const [filterName, setFilterName] = useState('');
  const [filterEspecialidad, setFilterEspecialidad] = useState<string>('');

  const [isEspecialidadModalOpen, setIsEspecialidadModalOpen] = useState(false);
  const [newEspecialidadName, setNewEspecialidadName] = useState('');
  const [isSubmittingEspecialidad, setIsSubmittingEspecialidad] = useState(false);
  const [especialidadErrorMsg, setEspecialidadErrorMsg] = useState('');

  useEffect(() => {
    async function loadEspecialidades() {
      try {
        const res: any = await api.especialidades.getAll();
        setEspecialidades(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Error cargando especialidades', err);
      }
    }
    loadEspecialidades();
  }, []);

  const checkCedula = (val: string, type: string, isBlur: boolean = false) => {
    if (!val) {
      setCedulaError('');
      return;
    }
    const fullCedula = `${type}-${val.trim()}`;
    const cleanCedula = val.trim();
    
    if (editingDocente && (editingDocente.cedula === fullCedula || editingDocente.cedula === cleanCedula)) {
      setCedulaError('');
      return;
    }

    const isDuplicateDocente = docentes.some(d => 
      d.cedula === fullCedula || d.cedula === cleanCedula || d.cedula === `V-${cleanCedula}` || d.cedula === `E-${cleanCedula}`
    );
    const isDuplicateUser = users.some(u => 
      u.username === fullCedula || u.username === cleanCedula || u.cedula === fullCedula || u.cedula === cleanCedula
    );

    if (isDuplicateDocente || isDuplicateUser) {
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
    if (!val) {
      setDobError('');
      return;
    }
    const today = new Date();
    const dob = new Date(val);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 18 || age > 70) {
        setDobError('La edad del docente debe estar entre 18 y 70 años.');
    } else {
        setDobError('');
    }
  };

  const handleCreateEspecialidadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEspecialidadErrorMsg('');
    if (!newEspecialidadName || !newEspecialidadName.trim()) {
      setEspecialidadErrorMsg('El nombre de la especialidad es obligatorio');
      return;
    }
    
    setIsSubmittingEspecialidad(true);
    try {
      const res: any = await api.especialidades.create({ nombre: newEspecialidadName.trim() });
      const nuevaEspecialidad = res;
      setEspecialidades(prev => [...prev, nuevaEspecialidad].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setIdEspecialidad(nuevaEspecialidad.id_especialidad);
      setSuccessMsg('Especialidad creada con éxito.');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEspecialidadModalOpen(false);
      setNewEspecialidadName('');
    } catch (err: any) {
      setEspecialidadErrorMsg(err.message || 'Error al crear la especialidad');
    } finally {
      setIsSubmittingEspecialidad(false);
    }
  };

  const handleOpenCreateEspecialidad = () => {
    setEspecialidadErrorMsg('');
    setNewEspecialidadName('');
    setIsEspecialidadModalOpen(true);
  };

  const openAddModal = () => {
    setEditingDocente(null);
    setFirstName('');
    setSecondName('');
    setLastName('');
    setSecondLastName('');
    setCedulaType('V');
    setCedula('');
    setIdEspecialidad('');
    setDateOfBirth('');
    setPhone('');
    setEmail('');
    setCedulaError('');
    setDobError('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (d: Docente) => {
    setEditingDocente(d);
    setFirstName(d.firstName);
    setSecondName(d.secondName || '');
    setLastName(d.lastName);
    setSecondLastName(d.secondLastName || '');
    const [type, num] = d.cedula.split('-');
    setCedulaType(type || 'V');
    setCedula(num || d.cedula);
    setIdEspecialidad(d.id_especialidad || '');
    setDateOfBirth(d.dateOfBirth);
    setPhone(d.phone || '');
    setEmail(d.email || '');
    setCedulaError('');
    setDobError('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !cedula || !dateOfBirth) {
      setErrorMsg('El Primer Nombre, Primer Apellido, Cédula y Fecha de Nacimiento son obligatorios');
      setSuccessMsg('');
      return;
    }

    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 18 || age > 70) {
        setDobError('La edad del docente debe estar entre 18 y 70 años.');
        return;
    }

    if (!cedula.trim().match(/^\d{7,9}$/)) {
      setCedulaError('Formato inválido (Solo 7-9 números)');
      return;
    }
    
    const fullCedula = `${cedulaType}-${cedula.trim()}`;
    const cleanCedula = cedula.trim();

    if (!editingDocente || (editingDocente.cedula !== fullCedula && editingDocente.cedula !== cleanCedula)) {
      const isDuplicateDocente = docentes.some(d => 
        d.cedula === fullCedula || d.cedula === cleanCedula || d.cedula === `V-${cleanCedula}` || d.cedula === `E-${cleanCedula}`
      );
      const isDuplicateUser = users.some(u => 
        u.username === fullCedula || u.username === cleanCedula || u.cedula === fullCedula || u.cedula === cleanCedula
      );
      if (isDuplicateDocente || isDuplicateUser) {
        setCedulaError('Esta cédula ya está registrada.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const newDocente = {
        cedula: fullCedula,
        firstName: firstName.trim(),
        secondName: secondName.trim() || undefined,
        lastName: lastName.trim(),
        secondLastName: secondLastName.trim() || undefined,
        id_especialidad: id_especialidad ? Number(id_especialidad) : undefined,
        dateOfBirth: dateOfBirth,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        status: editingDocente ? editingDocente.status : 'Activo'
      };

      if (editingDocente && onUpdateDocente) {
        await onUpdateDocente(editingDocente.id, newDocente);
        setSuccessMsg(`Docente ${newDocente.firstName} ${newDocente.lastName} actualizado con éxito.`);
      } else {
        const passwordTemporal = await onAddDocente(newDocente);
        if (passwordTemporal) {
          setSuccessMsg(`Docente ${newDocente.firstName} ${newDocente.lastName} registrado. Contraseña: ${passwordTemporal}`);
        } else {
          setSuccessMsg(`Docente ${newDocente.firstName} ${newDocente.lastName} registrado con éxito.`);
        }
      }
      
      setErrorMsg('');
      
      // Clear forms
      setFirstName('');
      setSecondName('');
      setLastName('');
      setSecondLastName('');
      setCedula('');
      setCedulaType('V');
      setIdEspecialidad('');
      setDateOfBirth('');
      setPhone('');
      setEmail('');
      setCedulaError('');
      setDobError('');
      setIsModalOpen(false);
      setEditingDocente(null);
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
            <p className="text-slate-500 text-base mt-1 font-medium">Administre el personal docente, sus asignaciones y accesos.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                {docentes.length}
              </div>
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Docentes</span>
            </div>
            
            {['super_admin', 'control_estudios'].includes(currentUserRole) && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-base font-bold transition-all shadow-sm shadow-indigo-600/20 pointer-events-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Registrar Docente
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación">
          <div className="space-y-4">
            <p className="text-base text-slate-600 leading-relaxed">
              ¿Está seguro de eliminar al docente <span className="font-bold text-slate-800">{docenteToDelete?.firstName} {docenteToDelete?.lastName}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-base text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancelar</button>
              <button 
                onClick={async () => {
                  if (docenteToDelete && onDeleteDocente) {
                    try {
                      await onDeleteDocente(docenteToDelete.id);
                      setIsDeleteModalOpen(false);
                      setDocenteToDelete(null);
                    } catch (e: any) {
                      setErrorMsg(e.message || 'Error al eliminar el docente');
                    }
                  }
                }}
                className="px-4 py-2 text-base font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-base rounded-xl flex items-center gap-3 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="h-5 w-5 bg-transparent text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="w-full md:w-1/3 flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-400 uppercase">Buscar por Nombre o Cédula</span>
            <input
              type="text"
              placeholder="Ej. Perez, Juan..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium w-full"
            />
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-400 uppercase">Filtrar por Especialidad</span>
            <SearchableSelect
              options={[{ value: '', label: 'Todas las especialidades' }, ...especialidades.map(e => ({ value: e.id_especialidad, label: e.nombre }))]}
              value={filterEspecialidad}
              onChange={(val) => setFilterEspecialidad(String(val))}
              placeholder="Seleccionar especialidad..."
            />
          </div>
        </div>

        {/* List of Teachers */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(() => {
            const filteredDocentes = docentes
              .filter(d => {
                const searchLower = filterName.toLowerCase();
                const nameMatch = `${d.firstName} ${d.lastName} ${d.cedula}`.toLowerCase().includes(searchLower);
                const specMatch = filterEspecialidad ? String(d.id_especialidad) === filterEspecialidad : true;
                return nameMatch && specMatch;
              })
              .sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName));

            return filteredDocentes.slice(0, visibleCount).map(d => (
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
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold tracking-wide">
                        {d.cedula}
                      </span>
                    </div>
                  </div>
                  
                  {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => onToggleDocenteActive(d.id)}
                        className={`text-xs px-2 py-1 rounded-full font-bold transition-colors pointer-events-auto cursor-pointer ${d.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                      >
                        {d.status}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(d)}
                          className="text-xs text-slate-500 hover:text-indigo-600 font-bold pointer-events-auto cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setDocenteToDelete(d);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 font-bold pointer-events-auto cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-sm text-slate-500">
                  {d.id_especialidad && especialidades.find(e => e.id_especialidad === d.id_especialidad) && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-600">{especialidades.find(e => e.id_especialidad === d.id_especialidad)?.nombre}</span>
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
          ))})()}
        </div>

        {(() => {
          const filteredDocentes = docentes.filter(d => {
            const searchLower = filterName.toLowerCase();
            const nameMatch = `${d.firstName} ${d.lastName} ${d.cedula}`.toLowerCase().includes(searchLower);
            const specMatch = filterEspecialidad ? String(d.id_especialidad) === filterEspecialidad : true;
            return nameMatch && specMatch;
          });
          return visibleCount < filteredDocentes.length && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount(p => p + 6)}
              className="text-base font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 pointer-events-auto cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Cargar más docentes
            </button>
          </div>
        )})()}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setEditingDocente(null);
      }} title={editingDocente ? "Editar Perfil del Docente" : "Registrar Nuevo Docente"}>
        {!['super_admin', 'control_estudios'].includes(currentUserRole) ? (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800 space-y-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="font-bold">Acceso Denegado</p>
            <p>Tu rol no tiene permisos para registrar docentes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 text-sm rounded-xl border border-rose-200 font-medium">
                {errorMsg}
              </div>
            )}

            <div id="section-form-docente" className="space-y-3 pt-2">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest block border-b border-indigo-50 pb-0.5">Ficha del Docente</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Cédula de Identidad <span className="text-red-500 font-bold text-base">*</span></label>
                <div className="flex">
                  <select
                    value={cedulaType}
                    onChange={(e) => {
                      setCedulaType(e.target.value);
                      if (cedula) checkCedula(cedula, e.target.value, false);
                    }}
                    className={`text-base p-2 bg-slate-50 border ${cedulaError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-l focus:bg-white focus:outline-hidden font-medium border-r-0 transition-colors`}
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
                      checkCedula(val, cedulaType, false);
                    }} 
                    onBlur={(e) => checkCedula(e.target.value, cedulaType, true)}
                    className={`w-full text-base p-2 bg-slate-50 border ${cedulaError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-r focus:outline-hidden focus:bg-white transition-colors font-mono`} 
                    placeholder="Ej. 12345678" 
                  />
                </div>
                {cedulaError && <p className="text-rose-500 text-sm mt-1 font-semibold">{cedulaError}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Fecha de Nacimiento <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="date" 
                  value={dateOfBirth} 
                  onChange={e => {
                    setDateOfBirth(e.target.value);
                    setDobError('');
                  }} 
                  onBlur={(e) => checkDateOfBirth(e.target.value)}
                  className={`w-full text-base p-2 bg-slate-50 border ${dobError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded focus:bg-white focus:outline-hidden font-medium`} 
                  required 
                />
                {dobError && <p className="text-rose-500 text-sm mt-1 font-semibold">{dobError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Nombre <span className="text-red-500 font-bold text-base">*</span></label>
                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="Ej. Juan" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Nombre</label>
                <input type="text" value={secondName} onChange={e => setSecondName(e.target.value)} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="Ej. Carlos" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Apellido <span className="text-red-500 font-bold text-base">*</span></label>
                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="Ej. Pérez" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Apellido</label>
                <input type="text" value={secondLastName} onChange={e => setSecondLastName(e.target.value)} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="Ej. Gómez" />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-slate-500">Especialidad</label>
              <div className="flex gap-2">
                <SearchableSelect
                  options={especialidades.map(esp => ({ value: esp.id_especialidad, label: esp.nombre }))}
                  value={id_especialidad}
                  onChange={(val) => setIdEspecialidad(val === '' ? '' : Number(val))}
                  placeholder="-- Seleccionar Especialidad --"
                />
                {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                  <button
                    type="button"
                    onClick={handleOpenCreateEspecialidad}
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors font-bold flex items-center justify-center shrink-0 cursor-pointer pointer-events-auto"
                    title="Añadir nueva especialidad"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="docente@ejemplo.com" />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Teléfono</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9-]/g, ''))} className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" placeholder="0414-1234567" />
              </div>
            </div>
            
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-base font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cancelar
              </button>
              <button disabled={isSubmitting} type="submit" aria-busy={isSubmitting} className="px-6 py-2.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? 'Guardando...' : 'Registrar Docente'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal for creating a new Especialidad */}
      <Modal
        isOpen={isEspecialidadModalOpen}
        onClose={() => setIsEspecialidadModalOpen(false)}
        title="Nueva Especialidad"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateEspecialidadSubmit} className="flex flex-col gap-4">
          {especialidadErrorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-base rounded-lg flex items-center gap-2 font-medium border border-rose-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {especialidadErrorMsg}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-base font-semibold text-slate-700">Nombre de la Especialidad <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              type="text"
              value={newEspecialidadName}
              onChange={(e) => setNewEspecialidadName(e.target.value)}
              placeholder="Ej. Profesor de Biología"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:outline-hidden font-medium text-slate-800 transition-colors"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEspecialidadModalOpen(false)}
              className="px-4 py-2 text-base font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={isSubmittingEspecialidad}
              type="submit"
              className="px-4 py-2 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-70"
            >
              {isSubmittingEspecialidad ? 'Guardando...' : 'Aceptar'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
