import { create } from 'zustand';
import studentService from '../services/studentService';

export interface Intervention {
  id: string;
  studentId: number;
  studentName: string;
  type: 'Attendance Counseling' | 'Academic Mentoring' | 'Parent Meeting' | 'Extra Tutoring' | 'Performance Monitoring' | 'Other';
  notes: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

const STORAGE_KEY = 'eduvision_interventions';

const saveToStorage = (interventions: Intervention[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interventions));
  } catch (e) {
    console.warn('Failed to save interventions to localStorage', e);
  }
};

const loadFromStorage = (): Intervention[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load interventions from localStorage', e);
  }
  return null;
};

const generateSeedInterventions = (): Intervention[] => {
  const students = studentService.getStudents();
  const highRisk = students.filter(s => s.riskLevel.toLowerCase() === 'high').slice(0, 2);
  const mediumRisk = students.filter(s => s.riskLevel.toLowerCase() === 'medium').slice(0, 1);
  const targets = [...highRisk, ...mediumRisk];

  const types: Intervention['type'][] = [
    'Attendance Counseling',
    'Academic Mentoring',
    'Parent Meeting',
  ];
  const statuses: Intervention['status'][] = ['Planned', 'In Progress', 'Planned'];
  const priorities: Intervention['priority'][] = ['High', 'High', 'Medium'];
  const notes = [
    'Student showing persistent attendance issues. Schedule counseling session.',
    'Academic performance declining. Assign mentoring program.',
    'Notify parents about current academic standing.',
  ];

  return targets.map((s, i) => ({
    id: `${Date.now() + i}-${Math.floor(Math.random() * 10000)}`,
    studentId: s.id,
    studentName: s.name,
    type: types[i % types.length],
    notes: notes[i % notes.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignedTo: 'Academic Advisor',
    dueDate: new Date(Date.now() + (7 + i * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  }));
};

interface InterventionsState {
  interventions: Intervention[];
  loading: boolean;
  addIntervention: (intervention: Omit<Intervention, 'id' | 'createdAt'>) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;
  removeIntervention: (id: string) => void;
  updateStatus: (id: string, status: Intervention['status']) => void;
  getInterventionsByStudent: (studentId: number) => Intervention[];
  initializeInterventions: () => void;
}

export const useInterventionsStore = create<InterventionsState>((set, get) => ({
  interventions: [],
  loading: false,

  addIntervention: (intervention) => {
    const newItem: Intervention = {
      ...intervention,
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().interventions, newItem];
    saveToStorage(updated);
    set({ interventions: updated });
  },

  updateIntervention: (id, updates) => {
    const updated = get().interventions.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    saveToStorage(updated);
    set({ interventions: updated });
  },

  removeIntervention: (id) => {
    const updated = get().interventions.filter(item => item.id !== id);
    saveToStorage(updated);
    set({ interventions: updated });
  },

  updateStatus: (id, status) => {
    const updated = get().interventions.map(item =>
      item.id === id ? { ...item, status } : item
    );
    saveToStorage(updated);
    set({ interventions: updated });
  },

  getInterventionsByStudent: (studentId) => {
    return get().interventions.filter(item => item.studentId === studentId);
  },

  initializeInterventions: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({ interventions: stored });
    } else {
      const seed = generateSeedInterventions();
      saveToStorage(seed);
      set({ interventions: seed });
    }
  },
}));

export default useInterventionsStore;
