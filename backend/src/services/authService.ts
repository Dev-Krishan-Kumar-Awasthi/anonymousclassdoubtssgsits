import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, StudentProfile, TeacherProfile } from '../types/models';
import { SEED_USERS } from '../data/seedData';
import { config } from '../config';

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  fullName: string;
  batch?: string;          // For students (e.g. 'B2')
  rollNumber?: string;     // For students
  teacherCode?: string;    // For teachers (e.g. 'US')
  departmentCode: string;
  isDemo: boolean;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    role: UserRole;
    isDemo: boolean;
  };
  profile: StudentProfile | TeacherProfile | { fullName: string; departmentCode: string };
  token: string;
}

export class AuthService {
  private users: typeof SEED_USERS = [...SEED_USERS];

  /**
   * Find user by email
   */
  public findByEmail(email: string) {
    return this.users.find((u) => u.user.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Find user by ID
   */
  public findById(id: string) {
    return this.users.find((u) => u.user.id === id);
  }

  /**
   * Generate JWT Token
   */
  public generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d',
    });
  }

  /**
   * Verify JWT Token
   */
  public verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    } catch {
      throw new Error('Invalid or expired authentication token');
    }
  }

  /**
   * Standard Login
   */
  public async login(email: string, password: string): Promise<UserSession> {
    const userRecord = this.findByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid email or password');
    }

    // Compare with bcrypt hash or demo password fallback
    const isMatch =
      password === 'password123' ||
      (await bcrypt.compare(password, userRecord.user.passwordHash));

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    return this.createSession(userRecord);
  }

  /**
   * 1-Click Demo Login
   */
  public demoLogin(role: UserRole, identifier?: string): UserSession {
    let match: (typeof SEED_USERS)[0] | undefined;

    if (role === 'STUDENT') {
      // Default to Krishan Awasthi (B2) or specific batch
      if (identifier === 'B1') {
        match = this.users.find((u) => u.studentProfile?.batch === 'B1');
      } else if (identifier === 'B3') {
        match = this.users.find((u) => u.studentProfile?.batch === 'B3');
      } else {
        match = this.users.find((u) => u.studentProfile?.fullName.includes('Krishan'));
      }
    } else if (role === 'TEACHER') {
      const code = identifier || 'US';
      match = this.users.find((u) => u.teacherProfile?.teacherCode === code);
    } else if (role === 'ADMIN') {
      match = this.users.find((u) => u.user.role === 'ADMIN');
    }

    if (!match) {
      throw new Error(`Demo user not found for role ${role}`);
    }

    return this.createSession(match);
  }

  /**
   * Get public list of demo accounts for login screen switcher
   */
  public getDemoAccountsList() {
    return [
      {
        role: 'STUDENT',
        name: 'Krishan Awasthi',
        badge: 'IT 2nd Year • Section B • Batch B2',
        email: 'krishan.awasthi@sgsits.ac.in',
        identifier: 'krishan',
        description: 'Primary demo student for lecture doubts and practicals',
      },
      {
        role: 'STUDENT',
        name: 'Aarav Patel',
        badge: 'IT 2nd Year • Section B • Batch B1',
        email: 'student.b1@sgsits.ac.in',
        identifier: 'B1',
        description: 'Parallel Lab Batch B1 student',
      },
      {
        role: 'STUDENT',
        name: 'Priya Sharma',
        badge: 'IT 2nd Year • Section B • Batch B3',
        email: 'student.b3@sgsits.ac.in',
        identifier: 'B3',
        description: 'Parallel Lab Batch B3 student',
      },
      {
        role: 'TEACHER',
        name: 'Faculty US',
        badge: 'Teacher Code: US',
        email: 'faculty.us@sgsits.ac.in',
        identifier: 'US',
        description: 'Teaches OOP Lecture (ATC-301) and OOP Lab',
      },
      {
        role: 'TEACHER',
        name: 'Faculty LP',
        badge: 'Teacher Code: LP',
        email: 'faculty.lp@sgsits.ac.in',
        identifier: 'LP',
        description: 'Teaches Data Structures & DSD Labs (LAB105)',
      },
      {
        role: 'ADMIN',
        name: 'IT Department Admin',
        badge: 'Administrator',
        email: 'admin.it@sgsits.ac.in',
        identifier: 'admin',
        description: 'Full timetable, room, and moderation controls',
      },
    ];
  }

  private createSession(userRecord: (typeof SEED_USERS)[0]): UserSession {
    const { user, studentProfile, teacherProfile } = userRecord;

    const fullName =
      studentProfile?.fullName ||
      teacherProfile?.fullName ||
      'SGSITS Administrator';

    const payload: AuthTokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      fullName,
      batch: studentProfile?.batch,
      rollNumber: studentProfile?.rollNumber,
      teacherCode: teacherProfile?.teacherCode,
      departmentCode: studentProfile?.departmentCode || teacherProfile?.departmentCode || 'IT',
      isDemo: !!user.isDemo,
    };

    const token = this.generateToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: !!user.isDemo,
      },
      profile:
        studentProfile ||
        teacherProfile || {
          fullName,
          departmentCode: 'IT',
        },
      token,
    };
  }
}

export const authService = new AuthService();
