import { create } from 'zustand';
import studentService from '../services/studentService';

export interface AppNotification {
  id: string;
  studentId: number;
  studentName: string;
  type: 'high-risk' | 'attendance' | 'performance' | 'intervention';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'eduvision_notifications';

const saveToStorage = (notifications: AppNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.warn('Failed to save notifications to localStorage', e);
  }
};

const loadFromStorage = (): AppNotification[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load notifications from localStorage', e);
  }
  return null;
};

const generateSeedNotifications = (): AppNotification[] => {
  const students = studentService.getStudents();
  const notifications: AppNotification[] = [];
  let counter = 0;

  const highRisk = students.filter(s => s.riskLevel.toLowerCase() === 'high').slice(0, 5);
  const declining = students.filter(s => s.trend.toLowerCase() === 'declining').slice(0, 4);
  const lowAttendance = students.filter(s => Number(s.attendance) < 65).slice(0, 4);

  highRisk.forEach(s => {
    notifications.push({
      id: `${Date.now() + counter++}-${Math.floor(Math.random() * 10000)}`,
      studentId: s.id,
      studentName: s.name,
      type: 'high-risk',
      title: 'High Risk Alert',
      message: `${s.name} has been flagged as High Risk. Immediate intervention recommended.`,
      priority: 'high',
      read: false,
      createdAt: new Date(Date.now() - counter * 3600000).toISOString(),
    });
  });

  declining.forEach(s => {
    notifications.push({
      id: `${Date.now() + counter++}-${Math.floor(Math.random() * 10000)}`,
      studentId: s.id,
      studentName: s.name,
      type: 'performance',
      title: 'Performance Decline',
      message: `${s.name}'s academic performance is showing a declining trend.`,
      priority: 'medium',
      read: false,
      createdAt: new Date(Date.now() - counter * 3600000).toISOString(),
    });
  });

  lowAttendance.forEach(s => {
    notifications.push({
      id: `${Date.now() + counter++}-${Math.floor(Math.random() * 10000)}`,
      studentId: s.id,
      studentName: s.name,
      type: 'attendance',
      title: 'Low Attendance',
      message: `${s.name} has attendance below threshold (${s.attendance}%). Follow-up required.`,
      priority: Number(s.attendance) < 50 ? 'high' : 'medium',
      read: false,
      createdAt: new Date(Date.now() - counter * 3600000).toISOString(),
    });
  });

  return notifications.slice(0, 15);
};

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  deleteNotification: (id: string) => void;
  initializeNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  markAsRead: (id) => {
    const updated = get().notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveToStorage(updated);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    saveToStorage(updated);
    set({ notifications: updated, unreadCount: 0 });
  },

  addNotification: (notification) => {
    const newItem: AppNotification = {
      ...notification,
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...get().notifications];
    saveToStorage(updated);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },

  deleteNotification: (id) => {
    const updated = get().notifications.filter(n => n.id !== id);
    saveToStorage(updated);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },

  initializeNotifications: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({ notifications: stored, unreadCount: stored.filter(n => !n.read).length });
    } else {
      const seed = generateSeedNotifications();
      saveToStorage(seed);
      set({ notifications: seed, unreadCount: seed.filter(n => !n.read).length });
    }
  },
}));

// Export with both names for compatibility
export const useNotificationStore = useNotificationsStore;

export default useNotificationsStore;
