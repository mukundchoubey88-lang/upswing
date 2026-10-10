import { INITIAL_STUDENTS, StudentRecord } from '../data/students';

// Migration: copy old key data to new key, then remove old key
const OLD_STORAGE_KEY = 'eduvision_students_data_v2';
const STORAGE_KEY = 'upswing_students_data_v2';

// Run migration once
const migrateStorage = () => {
  try {
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldData && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, oldData);
      localStorage.removeItem(OLD_STORAGE_KEY);
      console.log('✅ Migrated student data from old key to new key');
    }
  } catch (e) {
    console.warn('Storage migration failed:', e);
  }
};
migrateStorage();

export interface StudentStats {
  total_students: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  improving_count: number;
  declining_count: number;
  stable_count: number;
  active_interventions: number;
  average_attendance: number;
  average_performance: number;
}

export interface StudentQueryFilters {
  search?: string;
  department?: string;
  section?: string;
  riskLevel?: string;
  page?: number;
  pageSize?: number;
}

class StudentService {
  private students: StudentRecord[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.students = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored students, using initial dataset', e);
    }
    this.students = [...INITIAL_STUDENTS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }

  public getStudents(): StudentRecord[] {
    if (this.students.length === 0) {
      this.loadFromStorage();
    }
    return [...this.students];
  }

  public filterStudents(filters: StudentQueryFilters) {
    let list = this.getStudents();

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    if (filters.department) {
      list = list.filter((s) => s.department === filters.department);
    }

    if (filters.section) {
      list = list.filter((s) => s.section === filters.section);
    }

    if (filters.riskLevel) {
      const r = filters.riskLevel.toLowerCase();
      list = list.filter((s) => s.riskLevel.toLowerCase() === r);
    }

    const total = list.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const items = list.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public getStudentById(id: string | number): StudentRecord | undefined {
    const all = this.getStudents();
    return all.find(
      (s) => s.id.toString() === id.toString() || s.rollNumber === id
    );
  }

  public getStats(): StudentStats {
    const list = this.getStudents();
    const total = list.length;

    if (total === 0) {
      return {
        total_students: 0,
        high_risk_count: 0,
        medium_risk_count: 0,
        low_risk_count: 0,
        improving_count: 0,
        declining_count: 0,
        stable_count: 0,
        active_interventions: 0,
        average_attendance: 0,
        average_performance: 0,
      };
    }

    let high = 0;
    let medium = 0;
    let low = 0;
    let improving = 0;
    let declining = 0;
    let stable = 0;
    let sumAttendance = 0;
    let sumPerformance = 0;

    list.forEach((s) => {
      const rl = s.riskLevel.toLowerCase();
      if (rl === 'high') high++;
      else if (rl === 'medium') medium++;
      else if (rl === 'low') low++;

      const tr = s.trend.toLowerCase();
      if (tr === 'improving') improving++;
      else if (tr === 'declining') declining++;
      else if (tr === 'stable') stable++;

      sumAttendance += Number(s.attendance) || 0;
      sumPerformance += Number(s.avgPerformance) || 0;
    });

    const avgAttendance = Number((sumAttendance / total).toFixed(1));
    const avgPerformance = Number((sumPerformance / total).toFixed(1));

    return {
      total_students: total,
      high_risk_count: high,
      medium_risk_count: medium,
      low_risk_count: low,
      improving_count: improving,
      declining_count: declining,
      stable_count: stable,
      active_interventions: high + medium,
      average_attendance: avgAttendance,
      average_performance: avgPerformance,
    };
  }

  public setStudents(newStudents: StudentRecord[]) {
    this.students = [...newStudents];
    this.saveToStorage();
  }

  public resetToDefault() {
    this.students = [...INITIAL_STUDENTS];
    this.saveToStorage();
  }
}

export const studentService = new StudentService();
export default studentService;
