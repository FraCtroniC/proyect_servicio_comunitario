import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Attendance } from '../types';
import { Modal } from './Modal';

interface StudentAttendanceCalendarProps {
  studentId: string;
  studentName: string;
  calendarAttendance: Attendance[];
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const STATUS_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  P: { bg: 'bg-green-500', border: 'border-green-600', label: 'Presente' },
  A: { bg: 'bg-rose-500', border: 'border-rose-600', label: 'Ausente' },
  J: { bg: 'bg-amber-500', border: 'border-amber-600', label: 'Justificado' },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function StudentAttendanceCalendar({
  studentId,
  studentName,
  calendarAttendance,
  isOpen,
  onClose,
}: StudentAttendanceCalendarProps) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const studentAttendance = useMemo(
    () => calendarAttendance.filter(a => a.studentId === studentId),
    [calendarAttendance, studentId]
  );

  const attendanceByDate = useMemo(() => {
    const map: Record<string, Attendance[]> = {};
    studentAttendance.forEach(a => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [studentAttendance]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const stats = useMemo(() => {
    const monthAtts = studentAttendance.filter(a => {
      const [y, m] = a.date.split('-').map(Number);
      return y === currentYear && m - 1 === currentMonth;
    });
    const p = monthAtts.filter(a => a.status === 'P').length;
    const a = monthAtts.filter(a => a.status === 'A').length;
    const j = monthAtts.filter(a => a.status === 'J').length;
    return { presentes: p, ausentes: a, justificados: j, total: p + a + j };
  }, [studentAttendance, currentYear, currentMonth]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Calendario de Asistencia`} maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Student name */}
        <p className="text-sm font-bold text-slate-600">{studentName}</p>

        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-slate-800">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 justify-center">
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            P: {stats.presentes}
          </span>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            A: {stats.ausentes}
          </span>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            J: {stats.justificados}
          </span>
        </div>

        {/* Calendar grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {DAY_LABELS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-14 border-b border-r border-slate-100 bg-slate-50/30" />;
              }

              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayAtts = attendanceByDate[dateStr] || [];
              const primaryStatus = dayAtts.length > 0 ? dayAtts[0].status : null;
              const color = primaryStatus ? STATUS_COLORS[primaryStatus] : null;

              return (
                <div
                  key={day}
                  className={`h-14 border-b border-r border-slate-100 flex flex-col items-center justify-center relative group ${
                    day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear()
                      ? 'bg-indigo-50/50'
                      : ''
                  }`}
                >
                  <span className={`text-sm font-semibold ${
                    day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear()
                      ? 'text-indigo-700 font-bold'
                      : 'text-slate-700'
                  }`}>
                    {day}
                  </span>
                  {color && (
                    <div className={`w-2 h-2 rounded-full ${color.bg} mt-0.5`} />
                  )}

                  {/* Tooltip */}
                  {dayAtts.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                      <div className="bg-slate-800 text-white text-[10px] rounded-lg px-2 py-1.5 whitespace-nowrap shadow-lg">
                        {dayAtts.map((a, i) => (
                          <div key={i}>
                            {STATUS_COLORS[a.status]?.label || a.status}
                            {a.horarioId ? ` (${a.horarioId})` : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center">
          {Object.entries(STATUS_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${val.bg}`} />
              <span className="text-xs font-semibold text-slate-500">{val.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-xs font-semibold text-slate-500">Sin registro</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
