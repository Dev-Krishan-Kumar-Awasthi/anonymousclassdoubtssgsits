export interface UserProfile {
  id?: string;
  fullName: string;
  rollNumber?: string;
  departmentCode: string;
  academicYear?: string;
  section?: string;
  batch?: string;
  teacherCode?: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    isDemo: boolean;
  };
  profile: UserProfile;
  token: string;
}

const SESSION_KEY = 'sgsits_auth_session';

export const authStorage = {
  saveSession(session: UserSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  },

  getSession(): UserSession | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  getToken(): string | null {
    const session = this.getSession();
    return session?.token || null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
