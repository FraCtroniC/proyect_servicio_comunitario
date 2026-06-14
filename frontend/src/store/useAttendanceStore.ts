import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type AttendanceEntry = {
  name: string;
  present: boolean;
};

export type AttendanceRecord = {
  id: string;
  date: string;
  entries: AttendanceEntry[];
};

type AttendanceState = {
  students: string[];
  presence: Record<string, boolean>;
  records: AttendanceRecord[];
  togglePresence: (name: string) => void;
  saveRecord: (date?: string) => void;
  setStudents: (names: string[]) => void;
  clearPresence: () => void;
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  students: [],
  presence: {},
  records: [],
  togglePresence: (name: string) =>
    set((state) => ({
      presence: { ...state.presence, [name]: !state.presence[name] },
    })),
  saveRecord: (date?: string) =>
    set((state) => {
      const id = nanoid();
      const recordDate = date ?? new Date().toISOString();
      const entries = state.students.map((name) => ({ name, present: !!state.presence[name] }));
      const record: AttendanceRecord = { id, date: recordDate, entries };
      return { records: [record, ...state.records] };
    }),
  setStudents: (names: string[]) =>
    set(() => ({
      students: names,
      presence: names.reduce<Record<string, boolean>>((acc, n) => ({ ...acc, [n]: false }), {}),
    })),
  clearPresence: () => set((state) => ({ presence: state.students.reduce((acc, n) => ({ ...acc, [n]: false }), {}) })),
}));
