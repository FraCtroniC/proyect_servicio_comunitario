/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layers, UserPlus, Filter, ShieldAlert, GraduationCap, Users, Download, FileText, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, AcademicYear, UserRole, MateriaPendiente, Section } from '../types';
import { generateConstanciaEstudio } from '../utils/pdfGenerator';
import { exportStudentsToExcel } from '../utils/excelGenerator';
import { Modal } from './Modal';
import { api } from '../services/api';
import { getStates, getMunicipalities, getParishes } from '../utils/venezuela';
import { SearchableSelect } from './SearchableSelect';

interface StudentManagerProps {
  students: Student[];
  sections: Section[];
  classrooms?: import('../types').Classroom[];
  currentUserRole: UserRole;
  representatives: any[];
  onAddStudent: (std: Student) => void;
  onUpdateStudentStatus: (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => void;
  onUpdateStudentProfile?: (studentId: string, studentData: any) => Promise<void>;
  onNavigateToPending?: (studentId: string) => void;
  onRefreshData?: () => Promise<void>;
}

export default function StudentManager({ students, sections, classrooms, currentUserRole, representatives, onAddStudent, onUpdateStudentStatus, onUpdateStudentProfile, onNavigateToPending, onRefreshData }: StudentManagerProps) {
  // Filters
  const [selectedYear, setSelectedYear] = useState<AcademicYear | 0>(5); // Default showing 5th year for rich showcase
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Register Form states
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [birthYear, setBirthYear] = useState('2009-05-15');
  const [gender, setGender] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [enrollYear, setEnrollYear] = useState<AcademicYear>(5);
  const [enrollSection, setEnrollSection] = useState<string>('A');
  const [repFirstName, setRepFirstName] = useState('');
  const [repSecondName, setRepSecondName] = useState('');
  const [repLastName, setRepLastName] = useState('');
  const [repSecondLastName, setRepSecondLastName] = useState('');
  const [repCedula, setRepCedula] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repAddress, setRepAddress] = useState('');
  
  const [cedulaType, setCedulaType] = useState('V');
  const [repCedulaType, setRepCedulaType] = useState('V');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Tab & Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create'|'edit'>('create');
  const [editingStudentId, setEditingStudentId] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pendingSubjects, setPendingSubjects] = useState<MateriaPendiente[]>([]);
  
  useEffect(() => {
    if (modalMode === 'create' && isStudentModalOpen) {
      const draft = {
        firstName, secondName, lastName, secondLastName, cedula, cedulaType,
        birthYear, gender, estado, municipio, birthPlace, enrollYear, enrollSection,
        repFirstName, repSecondName, repLastName, repSecondLastName, repCedula,
        repCedulaType, repPhone, repEmail, repAddress
      };
      localStorage.setItem('student_create_draft', JSON.stringify(draft));
    }
  }, [
    firstName, secondName, lastName, secondLastName, cedula, cedulaType,
    birthYear, gender, estado, municipio, birthPlace, enrollYear, enrollSection,
    repFirstName, repSecondName, repLastName, repSecondLastName, repCedula,
    repCedulaType, repPhone, repEmail, repAddress, modalMode, isStudentModalOpen
  ]);

  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, []);

  const handleOpenProfile = async (s: Student) => {
    setSelectedStudent(s);
    setIsProfileModalOpen(true);
    try {
      const res = await api.materiasPendientes.getByStudent(s.id);
      setPendingSubjects(res);
    } catch (e) {
      console.error(e);
    }
  };

  const resetFormToDefaults = () => {
    setFirstName(''); setSecondName(''); setLastName(''); setSecondLastName('');
    setCedula(''); setCedulaType('V'); setBirthYear('2009-05-15'); setGender('');
    setEstado(''); setMunicipio(''); setBirthPlace(''); setEnrollYear(5); setEnrollSection('A');
    setRepFirstName(''); setRepSecondName(''); setRepLastName(''); setRepSecondLastName('');
    setRepCedula(''); setRepCedulaType('V'); setRepPhone(''); setRepEmail(''); setRepAddress('');
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingStudentId('');
    
    const draftStr = localStorage.getItem('student_create_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setFirstName(draft.firstName || '');
        setSecondName(draft.secondName || '');
        setLastName(draft.lastName || '');
        setSecondLastName(draft.secondLastName || '');
        setCedula(draft.cedula || '');
        setCedulaType(draft.cedulaType || 'V');
        setBirthYear(draft.birthYear || '2009-05-15');
        setGender(draft.gender || '');
        setEstado(draft.estado || '');
        setMunicipio(draft.municipio || '');
        setBirthPlace(draft.birthPlace || '');
        setEnrollYear(draft.enrollYear || 5);
        setEnrollSection(draft.enrollSection || 'A');
        setRepFirstName(draft.repFirstName || '');
        setRepSecondName(draft.repSecondName || '');
        setRepLastName(draft.repLastName || '');
        setRepSecondLastName(draft.repSecondLastName || '');
        setRepCedula(draft.repCedula || '');
        setRepCedulaType(draft.repCedulaType || 'V');
        setRepPhone(draft.repPhone || '');
        setRepEmail(draft.repEmail || '');
        setRepAddress(draft.repAddress || '');
      } catch (e) {
        resetFormToDefaults();
      }
    } else {
      resetFormToDefaults();
    }

    setErrors({});
    setFormError('');
    setFormSuccess('');
    setIsStudentModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setModalMode('edit');
    setEditingStudentId(s.id);
    
    // Parse student names
    const sNames = s.firstName.split(' ');
    const lNames = s.lastName.split(' ');
    setFirstName(sNames[0] || '');
    setSecondName(sNames.slice(1).join(' ') || '');
    setLastName(lNames[0] || '');
    setSecondLastName(lNames.slice(1).join(' ') || '');
    
    // Parse Cedula
    const parts = s.cedula.split('-');
    if (parts.length > 1) {
      setCedulaType(parts[0]);
      setCedula(parts[1]);
    } else {
      setCedulaType('V');
      setCedula(s.cedula);
    }
    
    setBirthYear(s.dateOfBirth);
    setGender(s.gender);
    setEstado(s.state || '');
    setMunicipio(s.municipality || '');
    setBirthPlace(s.birthPlace || '');
    setEnrollYear(s.academicYear);
    setEnrollSection(s.section);
    
    setRepFirstName(s.repFirstName || '');
    setRepSecondName(s.repSecondName || '');
    setRepLastName(s.repLastName || '');
    setRepSecondLastName(s.repSecondLastName || '');
    
    const repParts = s.representativeCedula.split('-');
    if (repParts.length > 1) {
      setRepCedulaType(repParts[0]);
      setRepCedula(repParts[1]);
    } else {
      setRepCedulaType('V');
      setRepCedula(s.representativeCedula);
    }
    
    setRepPhone(s.representativePhone);
    setRepEmail(s.representativeEmail || '');
    setRepAddress(s.representativeAddress || '');
    
    setErrors({});
    setFormError('');
    setFormSuccess('');
    setIsStudentModalOpen(true);
  };

  // Filter students array
  const filteredStudents = students.filter(s => {
    const matchesYear = selectedYear === 0 ? true : s.academicYear === selectedYear;
    const matchesSection = selectedSection === 'Todos' ? true : s.section === selectedSection;
    
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || s.cedula.toLowerCase().includes(query) || s.representativeName.toLowerCase().includes(query);

    return matchesYear && matchesSection && matchesSearch;
  });

  const validateName = (val: string) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/.test(val);
  const validateNumber = (val: string) => /^[0-9-]*$/.test(val);
  const validateCedula = (val: string) => /^[0-9]{7,9}$/.test(val);
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleFieldChange = (name: string, val: string, setter: (v: string) => void) => {
    setter(val);
    const newErrors = { ...errors };
    if ((name.includes('Name') || name.includes('LastName')) && val && !validateName(val)) {
      newErrors[name] = 'Solo se permiten letras.';
    } else {
      delete newErrors[name];
    }
    
    if (name === 'repPhone' && val && !validateNumber(val)) {
      newErrors[name] = 'Solo se permiten números y guiones.';
    } else if (name === 'repPhone') {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const checkCedula = (val: string, type: 'student' | 'rep', natType: string, isBlur: boolean = false) => {
    if (!val) {
      const newErrors = { ...errors };
      delete newErrors[type === 'student' ? 'cedula' : 'repCedula'];
      setErrors(newErrors);
      return;
    }
    
    let fullCedula = `${natType}-${val.trim()}`;
    let cleanCedula = val.trim();
    const newErrors = { ...errors };
    
    if (type === 'student') {
      const exists = students.some(s => 
        (s.cedula === fullCedula || s.cedula === cleanCedula || s.cedula === `V-${cleanCedula}` || s.cedula === `E-${cleanCedula}`) && 
        (!editingStudentId || s.id !== editingStudentId)
      );
      if (exists) {
        newErrors['cedula'] = 'Esta cédula ya está registrada.';
        setErrors(newErrors);
        return;
      } else {
        delete newErrors['cedula'];
      }
    } else {
      delete newErrors['repCedula'];
    }

    if (isBlur && !validateCedula(val)) {
      newErrors[type === 'student' ? 'cedula' : 'repCedula'] = 'Formato inválido (Solo 7-9 números)';
      setErrors(newErrors);
      return;
    }
    
    setErrors(newErrors);
  };

  const checkRepField = (field: 'telefono' | 'correo', value: string) => {
    if (!value) return;
    const newErrors = { ...errors };

    if (field === 'correo' && !validateEmail(value)) {
      newErrors['repEmail'] = 'Formato de correo inválido.';
      setErrors(newErrors);
      return;
    } else if (field === 'correo') {
      delete newErrors['repEmail'];
    }

    if (field === 'telefono') {
      delete newErrors['repPhone'];
    }
    
    setErrors(newErrors);
  };

  const checkAge = (val: string) => {
    if (!val) return;
    const newErrors = { ...errors };
    const age = calculateAge(val);
    if (age < 10) newErrors['birthYear'] = 'Edad ilógica (< 10 años).';
    else delete newErrors['birthYear'];
    setErrors(newErrors);
  };

  const scrollToError = () => {
    setTimeout(() => {
      const errorElement = document.querySelector('.border-rose-400') || document.getElementById('enrollment-error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setFormError('Por favor corrija los errores indicados antes de continuar.');
      setFormSuccess('');
      scrollToError();
      return;
    }

    // Capacity Check (only on create)
    if (modalMode === 'create') {
      const targetSection = sections.find(s => s.grade === enrollYear && s.letter === enrollSection);
      if (targetSection && classrooms) {
        const aula = classrooms.find(c => c.id === targetSection.homeClassroomId);
        if (aula) {
          const enrolledCount = students.filter(s => s.academicYear === enrollYear && s.section === enrollSection).length;
          if (enrolledCount >= aula.capacity) {
             setFormError(`La Sección "${enrollSection}" de ${enrollYear}° Año ya alcanzó el límite de capacidad de su Aula Base (${aula.name}: ${aula.capacity} pupitres).`);
             setFormSuccess('');
             scrollToError();
             return;
          }
        }
      }
    }

    if (!firstName || !lastName || !cedula || !repFirstName || !repLastName || !repCedula || !repPhone) {
      setFormError('Todos los campos marcados con * son obligatorios.');
      setFormSuccess('');
      scrollToError();
      return;
    }

    const age = calculateAge(birthYear);
    if (age < 10) {
      setErrors(prev => ({ ...prev, birthYear: 'El estudiante debe tener al menos 10 años.' }));
      setFormError('Revisar edad del estudiante.');
      scrollToError();
      return;
    }

    let cleanCedula = `${cedulaType}-${cedula.trim()}`;

    if (modalMode === 'create' && students.some(s => s.cedula === cleanCedula)) {
      setErrors(prev => ({ ...prev, cedula: 'Esta cédula ya está registrada.' }));
      setFormError('El estudiante ya está registrado.');
      scrollToError();
      return;
    }
    
    if (modalMode === 'edit' && students.some(s => s.cedula === cleanCedula && s.id !== editingStudentId)) {
      setErrors(prev => ({ ...prev, cedula: 'Esta cédula ya está registrada por otro alumno.' }));
      setFormError('La cédula ingresada ya está en uso.');
      scrollToError();
      return;
    }

    let cleanRepCedula = `${repCedulaType}-${repCedula.trim()}`;

    const newStudent: Student = {
      id: modalMode === 'edit' ? editingStudentId : 'std-' + Date.now(),
      firstName: firstName.trim() + (secondName.trim() ? ` ${secondName.trim()}` : ''),
      lastName: lastName.trim() + (secondLastName.trim() ? ` ${secondLastName.trim()}` : ''),
      cedula: cleanCedula,
      academicYear: enrollYear,
      section: enrollSection,
      status: 'Activo',
      representativeName: `${repFirstName.trim()}${repSecondName.trim() ? ` ${repSecondName.trim()}` : ''} ${repLastName.trim()}${repSecondLastName.trim() ? ` ${repSecondLastName.trim()}` : ''}`,
      representativeCedula: cleanRepCedula,
      representativePhone: repPhone.trim(),
      dateOfBirth: birthYear,
      gender: (gender || 'M') as 'M' | 'F',
      birthPlace: birthPlace.trim() || undefined,
      representativeEmail: repEmail.trim() || undefined,
      representativeAddress: repAddress.trim() || undefined,
      municipality: municipio.trim() || undefined,
      state: estado.trim() || undefined,
      repFirstName: repFirstName.trim(),
      repSecondName: repSecondName.trim() || undefined,
      repLastName: repLastName.trim(),
      repSecondLastName: repSecondLastName.trim() || undefined
    };

    if (modalMode === 'create') {
      onAddStudent(newStudent);
      setFormSuccess(`Estudiante ${newStudent.firstName} ${newStudent.lastName} matriculado correctamente en ${newStudent.academicYear}° Año Secc. ${newStudent.section}.`);
      
      localStorage.removeItem('student_create_draft');
      
      // Clear forms
      setFirstName('');
      setSecondName('');
      setLastName('');
      setSecondLastName('');
      setCedula('');
      setRepFirstName('');
      setRepSecondName('');
      setRepLastName('');
      setRepSecondLastName('');
      setRepCedula('');
      setRepPhone('');
      setRepEmail('');
      setRepAddress('');
      setGender('');
      setBirthPlace('');
      setMunicipio('');
      setEstado('');
      setErrors({});
      setTimeout(() => setIsStudentModalOpen(false), 3000);
    } else {
      if (onUpdateStudentProfile) {
        try {
          await onUpdateStudentProfile(editingStudentId, newStudent);
          setFormSuccess('Datos del estudiante actualizados exitosamente.');
          setTimeout(() => setIsStudentModalOpen(false), 3000);
        } catch (err: any) {
          setFormError(err.message || 'Error al actualizar el estudiante');
          scrollToError();
        }
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-full font-semibold';
      case 'Inactivo':
        return 'bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2.5 py-1 rounded-full font-semibold';
      case 'Retirado':
        return 'bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-semibold';
      default:
        return 'bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-semibold';
    }
  };

  return (
    <div id="student-manager-container" className="space-y-6 max-w-[2200px] mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div id="student-header" className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 id="student-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Matrícula Estudiantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">Directorio de estudiantes matriculados y sus representantes.</p>
        </div>
        <div className="flex items-center gap-1.5 mt-3 md:mt-0 text-sm bg-indigo-50 border border-indigo-100/50 p-2.5 rounded-xl text-indigo-800">
          <Users className="h-4.5 w-4.5 shrink-0" />
          <span>Matrícula Total: <strong>{students.length}</strong> alumnos ({students.filter(s => s.status === 'Activo').length} Activos)</span>
        </div>
      </div>

      {/* Main layout grid */}
      <div id="student-grid" className="grid grid-cols-1 gap-6">
        
        {/* Student list explorer with filters */}
        <div id="student-explorer-panel" className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          
          {/* Controls Bar */}
          <div id="explorer-filters-bar" className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
            <div id="explorer-filter-icon" className="flex items-center gap-1 text-sm font-semibold text-slate-500 shrink-0">
              <Filter className="h-4 w-4" />
              <span>Filtros:</span>
            </div>

            {/* Year filter dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value) as AcademicYear | 0)}
              className="text-sm p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value={0}>Todos los Años (1°-5to)</option>
              <option value={1}>1er Año (General)</option>
              <option value={2}>2do Año (General)</option>
              <option value={3}>3er Año (General)</option>
              <option value={4}>4to Año (Soberanía)</option>
              <option value={5}>5to Año (Soberanía)</option>
            </select>

            {/* Section filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-sm p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Todos">Todas las Secciones</option>
              {sections
                .filter(s => selectedYear === 0 || s.grade === selectedYear)
                .sort((a, b) => a.letter.localeCompare(b.letter))
                .map(s => (
                  <option key={`${s.grade}-${s.letter}`} value={s.letter}>
                    Sección "{s.letter}"
                  </option>
                ))}
            </select>

            {/* Text Search input */}
            <input
              type="text"
              placeholder="Buscar por Nombre, Cédula, Representante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 min-w-[200px]"
            />
            
            <button
              onClick={() => exportStudentsToExcel(filteredStudents)}
              className="hidden md:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exportar Nómina
            </button>

{['super_admin', 'control_estudios', 'coordinador'].includes(currentUserRole) && (
              <button
                onClick={handleOpenCreate}
                className="md:ml-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Matricular Alumno
              </button>
            )}
          </div>

          {/* Student list layout */}
          <div id="student-list-scroller" className="overflow-x-auto w-full pb-4">
            <table className="w-full text-left border-collapse text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-3 whitespace-nowrap">Cédula</th>
                  <th className="py-3 whitespace-nowrap">Estudiante</th>
                  <th className="py-3 whitespace-nowrap">Año / Secc.</th>
                  <th className="py-3 whitespace-nowrap">Representante (LOPNA)</th>
                  <th className="py-3 whitespace-nowrap">Estatus</th>
                  <th className="py-3 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-medium text-slate-750">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <tr id={`std-row-${s.id}`} key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-700 text-sm whitespace-nowrap">{s.cedula}</td>
                      <td className="py-3 min-w-[150px]">
                        <span className="font-bold text-slate-800 text-sm block">{s.lastName}, {s.firstName}</span>
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Nacimiento: {s.dateOfBirth}</span>
                      </td>
                      <td className="py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold text-xs">{s.academicYear}° Año "{s.section}"</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-800 block text-sm font-semibold">{s.representativeName}</span>
                        <span className="text-xs text-slate-500 font-medium font-mono">{s.representativeCedula} | {s.representativePhone}</span>
                      </td>
                      <td className="py-3">
                        <span className={getStatusStyle(s.status)}>{s.status}</span>
                      </td>
{['super_admin', 'control_estudios', 'coordinador'].includes(currentUserRole) && (
              <td className="py-3 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="Editar Registro"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                          <button
                            onClick={() => onNavigateToPending ? onNavigateToPending(s.id) : handleOpenProfile(s)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Materias Pendientes"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => generateConstanciaEstudio(s)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Constancia de Estudio"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <select
                            value={s.status}
                            onChange={(e) => onUpdateStudentStatus(s.id, e.target.value as 'Activo' | 'Inactivo' | 'Retirado')}
                            className="bg-white border border-slate-200 text-xs rounded p-1.5 font-semibold focus:outline-hidden cursor-pointer"
                          >
                            <option value="Activo">Activar</option>
                            <option value="Inactivo">Pasar Inactivo</option>
                            <option value="Retirado">Marcar Retirado</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No se encontraron alumnos bajo los filtros estipulados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Estudiantes */}
      <Modal 
        isOpen={isStudentModalOpen} 
        onClose={() => setIsStudentModalOpen(false)} 
        title={modalMode === 'create' ? "Inscripción y Matriculación Inicial" : "Editar Registro del Estudiante"}
      >
        <form onSubmit={handleRegister} className="space-y-6">
          {formError && (
            <div id="enrollment-error" className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-base">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div id="enrollment-success" className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-base">
              {formSuccess}
            </div>
          )}

          {/* Form division: student details */}
          <div id="section-form-part1" className="space-y-3">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest block border-b border-indigo-50 pb-0.5">Ficha del Estudiante</span>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Cédula Escolar <span className="text-red-500 font-bold text-base">*</span></label>
                <div className="flex">
                  <select
                    value={cedulaType}
                    onChange={(e) => {
                      setCedulaType(e.target.value);
                      if (cedula) checkCedula(cedula, 'student', e.target.value, false);
                    }}
                    className={`text-base p-2 bg-slate-50 border ${errors.cedula ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-l focus:bg-white focus:outline-hidden font-medium border-r-0`}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="e.g. 32112443" 
                    value={cedula} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCedula(val);
                      checkCedula(val, 'student', cedulaType, false);
                    }}
                    onBlur={(e) => checkCedula(e.target.value, 'student', cedulaType, true)}
                    className={`w-full text-base p-2 bg-slate-50 border ${errors.cedula ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-r focus:bg-white focus:outline-hidden font-medium font-mono`}
                  />
                </div>
                {errors.cedula && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.cedula}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Fecha Nac. <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="date" 
                  value={birthYear} 
                  onChange={(e) => setBirthYear(e.target.value)}
                  onBlur={(e) => checkAge(e.target.value)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.birthYear ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.birthYear && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.birthYear}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Nombre <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Alejandro" 
                  value={firstName} 
                  onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.firstName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.firstName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.firstName}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Nombre</label>
                <input 
                  type="text" 
                  placeholder="e.g. José" 
                  value={secondName} 
                  onChange={(e) => handleFieldChange('secondName', e.target.value, setSecondName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.secondName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.secondName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.secondName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Apellido <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Gómez" 
                  value={lastName} 
                  onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.lastName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.lastName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.lastName}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Apellido</label>
                <input 
                  type="text" 
                  placeholder="e.g. López" 
                  value={secondLastName} 
                  onChange={(e) => handleFieldChange('secondLastName', e.target.value, setSecondLastName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.secondLastName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.secondLastName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.secondLastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Estado (Nacimiento) <span className="text-red-500 font-bold text-base">*</span></label>
                <SearchableSelect
                  options={getStates().map(s => ({ value: s, label: s }))}
                  value={estado}
                  onChange={(val) => { setEstado(String(val)); setMunicipio(''); setBirthPlace(''); }}
                  placeholder="Seleccionar"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Municipio (Nacimiento) <span className="text-red-500 font-bold text-base">*</span></label>
                <SearchableSelect
                  options={estado ? getMunicipalities(estado).map(m => ({ value: m, label: m })) : []}
                  value={municipio}
                  onChange={(val) => { setMunicipio(String(val)); setBirthPlace(''); }}
                  disabled={!estado}
                  placeholder="Seleccionar"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Parroquia (Nacimiento)</label>
                <SearchableSelect
                  options={(estado && municipio) ? getParishes(estado, municipio).map((p: string) => ({ value: p, label: p })) : []}
                  value={birthPlace}
                  onChange={(val) => setBirthPlace(String(val))}
                  disabled={!municipio}
                  placeholder="Seleccionar"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Género</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Año Escolar <span className="text-red-500 font-bold text-base">*</span></label>
                <select 
                  value={enrollYear} 
                  onChange={(e) => setEnrollYear(Number(e.target.value) as AcademicYear)}
                  className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                >
                  <option value={1}>1er Año</option>
                  <option value={2}>2do Año</option>
                  <option value={3}>3er Año</option>
                  <option value={4}>4to Año</option>
                  <option value={5}>5to Año</option>
                </select>
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Sección <span className="text-red-500 font-bold text-base">*</span></label>
                <select 
                  value={enrollSection} 
                  onChange={(e) => setEnrollSection(e.target.value)}
                  className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                >
                  {Array.from(new Set(sections.filter(s => s.grade === enrollYear).map(s => s.letter)))
                    .sort((a, b) => a.localeCompare(b))
                    .map(letter => (
                      <option key={`${enrollYear}-${letter}`} value={letter}>
                        Sección "{letter}"
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form division: Representative details */}
          <div id="section-form-part2" className="space-y-3 pt-2">
            <span className="text-sm font-bold text-amber-600 uppercase tracking-widest block border-b border-amber-50 pb-0.5">Representante Legal (LOPNA)</span>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Cédula Rep. <span className="text-red-500 font-bold text-base">*</span></label>
                <div className="flex">
                  <select
                    value={repCedulaType}
                    onChange={(e) => {
                      setRepCedulaType(e.target.value);
                      if (repCedula) checkCedula(repCedula, 'rep', e.target.value, false);
                    }}
                    className={`text-base p-2 bg-slate-50 border ${errors.repCedula ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-l focus:bg-white focus:outline-hidden font-medium border-r-0`}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="e.g. 12111000" 
                    value={repCedula} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setRepCedula(val);
                      checkCedula(val, 'rep', repCedulaType, false);
                    }}
                    onBlur={(e) => checkCedula(e.target.value, 'rep', repCedulaType, true)}
                    className={`w-full text-base p-2 bg-slate-50 border ${errors.repCedula ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded-r focus:bg-white focus:outline-hidden font-medium font-mono`}
                  />
                </div>
                {errors.repCedula && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repCedula}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Teléfono Rep. <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. 0414-1112233" 
                  value={repPhone} 
                  onChange={(e) => handleFieldChange('repPhone', e.target.value, setRepPhone)}
                  onBlur={(e) => checkRepField('telefono', e.target.value)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repPhone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded focus:bg-white focus:outline-hidden font-medium font-mono`}
                />
                {errors.repPhone && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repPhone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Nombre <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Carmen" 
                  value={repFirstName} 
                  onChange={(e) => handleFieldChange('repFirstName', e.target.value, setRepFirstName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repFirstName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.repFirstName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repFirstName}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Nombre</label>
                <input 
                  type="text" 
                  placeholder="e.g. María" 
                  value={repSecondName} 
                  onChange={(e) => handleFieldChange('repSecondName', e.target.value, setRepSecondName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repSecondName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.repSecondName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repSecondName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Primer Apellido <span className="text-red-500 font-bold text-base">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. de Gómez" 
                  value={repLastName} 
                  onChange={(e) => handleFieldChange('repLastName', e.target.value, setRepLastName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repLastName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.repLastName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repLastName}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Segundo Apellido</label>
                <input 
                  type="text" 
                  placeholder="e.g. López" 
                  value={repSecondLastName} 
                  onChange={(e) => handleFieldChange('repSecondLastName', e.target.value, setRepSecondLastName)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repSecondLastName ? 'border-rose-400' : 'border-slate-200'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.repSecondLastName && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repSecondLastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Correo Rep.</label>
                <input 
                  type="email" 
                  placeholder="ej: carmen@email.com" 
                  value={repEmail} 
                  onChange={(e) => setRepEmail(e.target.value)}
                  onBlur={(e) => checkRepField('correo', e.target.value)}
                  className={`w-full text-base p-2 bg-slate-50 border ${errors.repEmail ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'} rounded focus:bg-white focus:outline-hidden font-medium`}
                />
                {errors.repEmail && <p className="text-rose-500 text-sm mt-1 font-semibold">{errors.repEmail}</p>}
              </div>
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-slate-500">Dirección Rep.</label>
                <input 
                  type="text" 
                  placeholder="e.g. Calle 5, Urb. Las Flores" 
                  value={repAddress} 
                  onChange={(e) => setRepAddress(e.target.value)}
                  className="w-full text-base p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={Object.keys(errors).length > 0}
            className={`w-full py-2.5 text-white font-bold text-sm rounded-lg shadow-sm transition-colors text-center ${Object.keys(errors).length > 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800 cursor-pointer'}`}
          >
            {modalMode === 'create' ? 'Inscribir y Matricular' : 'Guardar Cambios'}
          </button>
        </form>
      </Modal>

      {/* Modal Perfil Estudiante (Materias Pendientes) */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Perfil Académico Avanzado">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
              <p className="text-sm text-indigo-700">C.I: {selectedStudent.cedula} | {selectedStudent.academicYear}° Año "{selectedStudent.section}"</p>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-800 mb-3 border-b pb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                Materias Pendientes (Arrastre)
              </h4>
              
              {pendingSubjects.length > 0 ? (
                <ul className="space-y-2">
                  {pendingSubjects.map(mp => (
                    <li key={mp.id_materia_pendiente} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{mp.asignatura?.name || 'Asignatura'}</span>
                        <span className="text-xs text-slate-500">Periodo de Arrastre: {mp.id_periodo}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${mp.estatus === 'Aprobada' ? 'bg-green-100 text-green-700' : mp.estatus === 'Aplazada' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {mp.estatus}
                        </span>
                        {mp.nota_definitiva !== null && (
                          <span className="block text-sm font-mono font-bold mt-1 text-slate-700">Nota: {mp.nota_definitiva}/20</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  Este estudiante no posee materias pendientes.
                </p>
              )}
            </div>

            {['super_admin', 'control_estudios', 'coordinador'].includes(currentUserRole) && (
              <button 
                onClick={async () => {
                  const asigId = window.prompt('Ingrese el ID de la asignatura a matricular (Pendiente):');
                  if (asigId) {
                    try {
                      await api.materiasPendientes.create({
                        id_estudiante: selectedStudent.id,
                        id_asignatura: asigId,
                        id_periodo: 1 // Por defecto periodo activo
                      });
                      toast.success('Materia pendiente matriculada con éxito.');
                      handleOpenProfile(selectedStudent);
                    } catch (e) {
                      toast.error('Error matriculando materia pendiente.');
                    }
                  }
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
              >
                + Registrar Nueva Materia Pendiente
              </button>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
