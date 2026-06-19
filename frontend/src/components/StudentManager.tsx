/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, UserPlus, Filter, ShieldAlert, GraduationCap, Users } from 'lucide-react';
import { Student, AcademicYear, UserRole } from '../types';
import { Modal } from './Modal';

interface StudentManagerProps {
  students: Student[];
  currentUserRole: UserRole;
  onAddStudent: (std: Student) => void;
  onUpdateStudentStatus: (studentId: string, status: 'Activo' | 'Inactivo' | 'Retirado') => void;
}

export default function StudentManager({ students, currentUserRole, onAddStudent, onUpdateStudentStatus }: StudentManagerProps) {
  // Filters
  const [selectedYear, setSelectedYear] = useState<AcademicYear | 0>(5); // Default showing 5th year for rich showcase
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Register Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [birthYear, setBirthYear] = useState('2009-05-15');
  const [enrollYear, setEnrollYear] = useState<AcademicYear>(5);
  const [enrollSection, setEnrollSection] = useState<string>('A');
  const [repName, setRepName] = useState('');
  const [repCedula, setRepCedula] = useState('');
  const [repPhone, setRepPhone] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Tab & Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Filter students array
  const filteredStudents = students.filter(s => {
    const matchesYear = selectedYear === 0 ? true : s.academicYear === selectedYear;
    const matchesSection = selectedSection === 'Todos' ? true : s.section === selectedSection;
    
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || s.cedula.toLowerCase().includes(query) || s.representativeName.toLowerCase().includes(query);

    return matchesYear && matchesSection && matchesSearch;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !cedula || !repName || !repCedula || !repPhone) {
      setFormError('Todos los campos solicitados de Alumno y Representante LOPNA son obligatorios.');
      setFormSuccess('');
      return;
    }

    let cleanCedula = cedula.trim().toUpperCase();
    if (!cleanCedula.startsWith('V-') && !cleanCedula.startsWith('E-')) {
      cleanCedula = 'V-' + cleanCedula;
    }

    let cleanRepCedula = repCedula.trim().toUpperCase();
    if (!cleanRepCedula.startsWith('V-') && !cleanRepCedula.startsWith('E-')) {
      cleanRepCedula = 'V-' + cleanRepCedula;
    }

    const newStudent: Student = {
      id: 'std-' + Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      cedula: cleanCedula,
      academicYear: enrollYear,
      section: enrollSection,
      status: 'Activo',
      representativeName: repName.trim(),
      representativeCedula: cleanRepCedula,
      representativePhone: repPhone.trim(),
      dateOfBirth: birthYear
    };

    onAddStudent(newStudent);
    setFormSuccess(`Estudiante ${newStudent.firstName} ${newStudent.lastName} matriculado correctamente en ${newStudent.academicYear}° Año Secc. ${newStudent.section}.`);
    setFormError('');

    // Clear forms
    setFirstName('');
    setLastName('');
    setCedula('');
    setRepName('');
    setRepCedula('');
    setRepPhone('');
    setIsStudentModalOpen(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-50 text-green-700 border border-green-150 text-[10px] px-2 py-0.5 rounded-full font-semibold';
      case 'Inactivo':
        return 'bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded-full font-semibold';
      case 'Retirado':
        return 'bg-rose-50 text-rose-700 border border-rose-200/55 text-[10px] px-2 py-0.5 rounded-full font-semibold';
      default:
        return 'bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-semibold';
    }
  };

  return (
    <div id="student-manager-container" className="space-y-6 max-w-6xl mx-auto p-2 md:p-4 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Title & Info */}
      <div id="student-header" className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 id="student-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Matrícula Estudiantes
          </h1>
          <p className="text-xs text-slate-500 mt-1">Directorio de estudiantes matriculados y sus representantes.</p>
        </div>
        <div className="flex items-center gap-1.5 mt-3 md:mt-0 text-xs bg-indigo-50 border border-indigo-100/50 p-2.5 rounded-xl text-indigo-800">
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
            <div id="explorer-filter-icon" className="flex items-center gap-1 text-xs font-semibold text-slate-500 shrink-0">
              <Filter className="h-4 w-4" />
              <span>Filtros:</span>
            </div>

            {/* Year filter dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value) as AcademicYear | 0)}
              className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
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
              className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Todos">Todas las Secciones</option>
              <option value="A">Sección "A"</option>
              <option value="B">Sección "B"</option>
            </select>

            {/* Text Search input */}
            <input
              type="text"
              placeholder="Buscar por Nombre, Cédula, Representante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 min-w-[200px]"
            />
            
            {['super_admin', 'control_estudios'].includes(currentUserRole) && (
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="md:ml-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Matricular Alumno
              </button>
            )}
          </div>

          {/* Student list layout */}
          <div id="student-list-scroller" className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Cédula</th>
                  <th className="py-2.5">Estudiante</th>
                  <th className="py-2.5">Año / Secc.</th>
                  <th className="py-2.5">Representante (LOPNA)</th>
                  <th className="py-2.5">Estatus</th>
                  {['super_admin', 'control_estudios'].includes(currentUserRole) && <th className="py-2.5 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-medium text-slate-750">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <tr id={`std-row-${s.id}`} key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-700">{s.cedula}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800 text-[12px] block">{s.lastName}, {s.firstName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Nacimiento: {s.dateOfBirth}</span>
                      </td>
                      <td className="py-3">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">{s.academicYear}° Año "{s.section}"</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-700 block text-[11px] font-semibold">{s.representativeName}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{s.representativeCedula} | {s.representativePhone}</span>
                      </td>
                      <td className="py-3">
                        <span className={getStatusStyle(s.status)}>{s.status}</span>
                      </td>
                      {['super_admin', 'control_estudios'].includes(currentUserRole) && (
                        <td className="py-3 text-right">
                          <select
                            value={s.status}
                            onChange={(e) => onUpdateStudentStatus(s.id, e.target.value as 'Activo' | 'Inactivo' | 'Retirado')}
                            className="bg-white border border-slate-200 text-[10px] rounded p-1 font-semibold focus:outline-hidden cursor-pointer"
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
      <Modal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} title="Matricular Nuevo Alumno">
        <form id="enrollment-form" onSubmit={handleRegister} className="space-y-4">
          {formError && (
            <div id="enrollment-error" className="p-2.5 bg-rose-50 border border-rose-200 font-medium rounded-lg text-rose-800 text-[11px]">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div id="enrollment-success" className="p-2.5 bg-green-50 border border-green-200 font-medium rounded-lg text-green-800 text-[11px]">
              {formSuccess}
            </div>
          )}

          {/* Form division: student details */}
          <div id="section-form-part1" className="space-y-3">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block border-b border-indigo-50 pb-0.5">Ficha Escolar</span>
            
            <div id="form-name-flex" className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Nombres *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Alejandro" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" 
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Apellidos *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Gómez" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" 
                />
              </div>
            </div>

            <div id="form-ids-flex" className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Cédula Alumno *</label>
                <input 
                  type="text" 
                  placeholder="e.g. V-32112443" 
                  value={cedula} 
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium font-mono" 
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Fecha Nac. *</label>
                <input 
                  type="date" 
                  value={birthYear} 
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" 
                />
              </div>
            </div>

            <div id="form-grade-flex" className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Año Escolar *</label>
                <select 
                  value={enrollYear} 
                  onChange={(e) => setEnrollYear(Number(e.target.value) as AcademicYear)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                >
                  <option value={1}>1er Año</option>
                  <option value={2}>2do Año</option>
                  <option value={3}>3er Año</option>
                  <option value={4}>4to Año</option>
                  <option value={5}>5to Año</option>
                </select>
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Sección *</label>
                <select 
                  value={enrollSection} 
                  onChange={(e) => setEnrollSection(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                >
                  <option value="A">Sección "A"</option>
                  <option value="B">Sección "B"</option>
                  <option value="C">Sección "C"</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form division: Representative details */}
          <div id="section-form-part2" className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block border-b border-amber-50 pb-0.5">Representante Legal (LOPNA)</span>
            
            <div className="space-y-0.5">
              <label className="text-[10px] font-semibold text-slate-500">Nombre Completo *</label>
              <input 
                type="text" 
                placeholder="e.g. Carmen de Gómez" 
                value={repName} 
                onChange={(e) => setRepName(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium" 
              />
            </div>

            <div id="rep-ids-flex" className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Cédula Rep. *</label>
                <input 
                  type="text" 
                  placeholder="e.g. V-12111000" 
                  value={repCedula} 
                  onChange={(e) => setRepCedula(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium font-mono" 
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-500">Teléfono Rep. *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 0414-1112233" 
                  value={repPhone} 
                  onChange={(e) => setRepPhone(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden font-medium font-mono" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors pointer-events-auto cursor-pointer text-center"
          >
            Inscribir y Matricular
          </button>
        </form>
      </Modal>

    </div>
  );
}
