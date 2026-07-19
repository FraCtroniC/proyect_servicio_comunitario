/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, lazy, Suspense } from 'react';
import { BookOpen, LogIn, LayoutDashboard, CalendarDays, Shield, Home, Book, Briefcase, ClipboardCheck, GraduationCap, Users, Award, Calendar, BookOpen as BookOpenIcon } from 'lucide-react';

const LoginDocs = lazy(() => import('./docs/LoginDocs'));
const DashboardDocs = lazy(() => import('./docs/DashboardDocs'));
const PeriodsDocs = lazy(() => import('./docs/PeriodsDocs'));
const UsersDocs = lazy(() => import('./docs/UsersDocs'));
const FacilitiesDocs = lazy(() => import('./docs/FacilitiesDocs'));
const SubjectsDocs = lazy(() => import('./docs/SubjectsDocs'));
const DocentesDocs = lazy(() => import('./docs/DocentesDocs'));
const ScheduleDocs = lazy(() => import('./docs/ScheduleDocs'));
const SectionsDocs = lazy(() => import('./docs/SectionsDocs'));
const StudentsDocs = lazy(() => import('./docs/StudentsDocs'));
const GradesDocs = lazy(() => import('./docs/GradesDocs'));
const AttendanceDocs = lazy(() => import('./docs/AttendanceDocs'));
const PendingDocs = lazy(() => import('./docs/PendingDocs'));
const RolesDocs = lazy(() => import('./docs/RolesDocs'));

type TabId = 'login' | 'dashboard' | 'periods' | 'users' | 'facilities' | 'subjects' | 'docentes' | 'schedule' | 'sections' | 'students' | 'grades' | 'attendance' | 'pending' | 'roles';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
  group: string;
}

const tabs: TabDef[] = [
  { id: 'login', label: 'Login', icon: LogIn, group: 'Acceso' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Principal' },
  { id: 'periods', label: 'Periodos', icon: CalendarDays, group: 'Configuración' },
  { id: 'users', label: 'Usuarios', icon: Shield, group: 'Configuración' },
  { id: 'facilities', label: 'Aulas', icon: Home, group: 'Configuración' },
  { id: 'subjects', label: 'Plan de Estudio', icon: Book, group: 'Planificación' },
  { id: 'docentes', label: 'Docentes', icon: Briefcase, group: 'Planificación' },
  { id: 'schedule', label: 'Horarios', icon: ClipboardCheck, group: 'Planificación' },
  { id: 'sections', label: 'Secciones', icon: GraduationCap, group: 'Organización' },
  { id: 'students', label: 'Estudiantes', icon: Users, group: 'Organización' },
  { id: 'grades', label: 'Calificaciones', icon: Award, group: 'Operaciones' },
  { id: 'attendance', label: 'Asistencia', icon: Calendar, group: 'Operaciones' },
  { id: 'pending', label: 'Pendientes', icon: BookOpenIcon, group: 'Operaciones' },
  { id: 'roles', label: 'Roles', icon: Shield, group: 'Sistema' },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
    </div>
  );
}

const componentMap: Record<TabId, React.LazyExoticComponent<React.ComponentType<any>>> = {
  login: LoginDocs,
  dashboard: DashboardDocs,
  periods: PeriodsDocs,
  users: UsersDocs,
  facilities: FacilitiesDocs,
  subjects: SubjectsDocs,
  docentes: DocentesDocs,
  schedule: ScheduleDocs,
  sections: SectionsDocs,
  students: StudentsDocs,
  grades: GradesDocs,
  attendance: AttendanceDocs,
  pending: PendingDocs,
  roles: RolesDocs,
};

export default function DocumentationView() {
  const [activeTab, setActiveTab] = useState<TabId>('login');

  const ActiveComponent = componentMap[activeTab];

  const groups = tabs.reduce<Record<string, TabDef[]>>((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-[2200px] mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-indigo-600" />
          Manual de Usuario
        </h1>
        <p className="text-slate-500 mt-1 text-sm leading-relaxed max-w-3xl">
          Guia paso a paso para el uso del Sistema Integrado de Gestion Academica del Liceo Nacional Estilita Orozco.
          Describa como utilizar cada modulo y submodulo del sistema.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/80">
          <div className="flex overflow-x-auto scrollbar-hide">
            {Object.entries(groups).map(([group, groupTabs]) => (
              <div key={group} className="flex items-center">
                <span className="px-3 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 bg-slate-100/50">
                  {group}
                </span>
                {groupTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap border-r border-slate-100 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-b-2 border-b-indigo-600'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <Suspense fallback={<LoadingFallback />}>
            <ActiveComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
