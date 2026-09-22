import { TimetableEntry, User, StudentProfile, TeacherProfile } from '../types/models';

/**
 * Official Seed Timetable for SGSITS Indore
 * Department of Information Technology • 2nd Year • Section B
 */
export const SEED_TIMETABLE: TimetableEntry[] = [
  // ================= MONDAY =================
  {
    id: 'tt-mon-1',
    dayOfWeek: 'MONDAY',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    startMinutes: 660, // 11:00
    endMinutes: 720,   // 12:00
    subjectCode: 'OOP',
    subjectName: 'Object Oriented Programming',
    isLab: false,
    section: 'B',
    teacherCodes: ['US'],
    roomNumber: 'ATC-301',
  },
  {
    id: 'tt-mon-2',
    dayOfWeek: 'MONDAY',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // 13:00
    endMinutes: 840,   // 14:00
    subjectCode: 'MATH3',
    subjectName: 'Mathematics III',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'ATC-309',
  },
  // Monday Parallel Labs 02:00 PM – 04:00 PM
  {
    id: 'tt-mon-3-b1',
    dayOfWeek: 'MONDAY',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 960,   // 16:00
    subjectCode: 'DSD-LAB',
    subjectName: 'DSD Lab',
    isLab: true,
    section: 'B',
    batch: 'B1',
    teacherCodes: ['LP', 'IK'],
    roomNumber: 'LAB105',
  },
  {
    id: 'tt-mon-3-b2',
    dayOfWeek: 'MONDAY',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 960,   // 16:00
    subjectCode: 'DS-LAB',
    subjectName: 'DS Lab',
    isLab: true,
    section: 'B',
    batch: 'B2',
    teacherCodes: ['LP', 'IK'],
    roomNumber: 'LAB105',
  },
  {
    id: 'tt-mon-3-b3',
    dayOfWeek: 'MONDAY',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 960,   // 16:00
    subjectCode: 'OOP-LAB',
    subjectName: 'OOP Lab',
    isLab: true,
    section: 'B',
    batch: 'B3',
    teacherCodes: ['US', 'VM'],
    roomNumber: 'Lab207',
  },
  // Monday 04:00 PM – 06:00 PM
  {
    id: 'tt-mon-4-b2',
    dayOfWeek: 'MONDAY',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    startMinutes: 960,  // 16:00
    endMinutes: 1080,  // 18:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B2',
    teacherCodes: ['PrKh', 'IK'],
    roomNumber: 'Lab206',
  },

  // ================= TUESDAY =================
  // Tuesday Parallel Labs 10:00 AM – 12:00 PM
  {
    id: 'tt-tue-1-b1',
    dayOfWeek: 'TUESDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B1',
    teacherCodes: ['NA', 'ShV'],
    roomNumber: 'Lab206',
  },
  {
    id: 'tt-tue-1-b2',
    dayOfWeek: 'TUESDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B2',
    teacherCodes: ['PrKh', 'IK'],
    roomNumber: 'Lab204',
  },
  // Tuesday 01:00 PM – 02:00 PM (Section A,B)
  {
    id: 'tt-tue-2',
    dayOfWeek: 'TUESDAY',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // 13:00
    endMinutes: 840,   // 14:00
    subjectCode: 'DS',
    subjectName: 'Data Structures',
    isLab: false,
    section: 'B',
    teacherCodes: ['LP'],
    roomNumber: 'LT-201',
  },
  // Tuesday 02:00 PM – 03:00 PM
  {
    id: 'tt-tue-3',
    dayOfWeek: 'TUESDAY',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 900,   // 15:00
    subjectCode: 'DSD',
    subjectName: 'Digital System Design',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'ATC-309',
  },
  // Tuesday 03:00 PM – 04:00 PM
  {
    id: 'tt-tue-4',
    dayOfWeek: 'TUESDAY',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 900, // 15:00
    endMinutes: 960,   // 16:00
    subjectCode: 'DS',
    subjectName: 'Data Structures',
    isLab: false,
    section: 'B',
    teacherCodes: ['MuS'],
    roomNumber: 'ATC-309',
  },

  // ================= WEDNESDAY =================
  // Wednesday Parallel Labs 10:00 AM – 12:00 PM
  {
    id: 'tt-wed-1-b2',
    dayOfWeek: 'WEDNESDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'DSD-LAB',
    subjectName: 'DSD Lab',
    isLab: true,
    section: 'B',
    batch: 'B2',
    teacherCodes: ['FACULTY'],
    roomNumber: 'LAB105',
  },
  {
    id: 'tt-wed-1-b3',
    dayOfWeek: 'WEDNESDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'DS-LAB',
    subjectName: 'DS Lab',
    isLab: true,
    section: 'B',
    batch: 'B3',
    teacherCodes: ['MuS', 'IK'],
    roomNumber: 'LAB105',
  },
  {
    id: 'tt-wed-1-b1',
    dayOfWeek: 'WEDNESDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'OOP-LAB',
    subjectName: 'OOP Lab',
    isLab: true,
    section: 'B',
    batch: 'B1',
    teacherCodes: ['US', 'VM'],
    roomNumber: 'Lab207',
  },
  // Wednesday 01:00 PM – 02:00 PM
  {
    id: 'tt-wed-2',
    dayOfWeek: 'WEDNESDAY',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // 13:00
    endMinutes: 840,   // 14:00
    subjectCode: 'MATH3',
    subjectName: 'Mathematics III',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'LT-002',
  },
  // Wednesday 02:00 PM – 03:00 PM
  {
    id: 'tt-wed-3',
    dayOfWeek: 'WEDNESDAY',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 900,   // 15:00
    subjectCode: 'DSD',
    subjectName: 'Digital System Design',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'LT-002',
  },
  // Wednesday 03:00 PM – 04:00 PM
  {
    id: 'tt-wed-4',
    dayOfWeek: 'WEDNESDAY',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 900, // 15:00
    endMinutes: 960,   // 16:00
    subjectCode: 'COA',
    subjectName: 'Computer Organization & Architecture',
    isLab: false,
    section: 'B',
    teacherCodes: ['ShV'],
    roomNumber: 'LT-002',
  },
  // Wednesday 04:00 PM – 05:00 PM
  {
    id: 'tt-wed-5',
    dayOfWeek: 'WEDNESDAY',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    startMinutes: 960,  // 16:00
    endMinutes: 1020,  // 17:00
    subjectCode: 'OOP',
    subjectName: 'Object Oriented Programming',
    isLab: false,
    section: 'B',
    teacherCodes: ['US'],
    roomNumber: 'LT-002',
  },

  // ================= THURSDAY =================
  // Thursday 11:00 AM – 12:00 PM
  {
    id: 'tt-thu-1',
    dayOfWeek: 'THURSDAY',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    startMinutes: 660, // 11:00
    endMinutes: 720,   // 12:00
    subjectCode: 'OOP',
    subjectName: 'Object Oriented Programming',
    isLab: false,
    section: 'B',
    teacherCodes: ['US'],
    roomNumber: 'ATC-309',
  },
  // Thursday 01:00 PM – 02:00 PM
  {
    id: 'tt-thu-2',
    dayOfWeek: 'THURSDAY',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // 13:00
    endMinutes: 840,   // 14:00
    subjectCode: 'DSD',
    subjectName: 'Digital System Design',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'LT-201',
  },
  // Thursday 02:00 PM – 03:00 PM
  {
    id: 'tt-thu-3',
    dayOfWeek: 'THURSDAY',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 900,   // 15:00
    subjectCode: 'COA',
    subjectName: 'Computer Organization & Architecture',
    isLab: false,
    section: 'B',
    teacherCodes: ['ShV'],
    roomNumber: 'ATC-309',
  },
  // Thursday 03:00 PM – 04:00 PM
  {
    id: 'tt-thu-4',
    dayOfWeek: 'THURSDAY',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 900, // 15:00
    endMinutes: 960,   // 16:00
    subjectCode: 'DS',
    subjectName: 'Data Structures',
    isLab: false,
    section: 'B',
    teacherCodes: ['MuS'],
    roomNumber: 'LT-201',
  },
  // Thursday 04:00 PM – 06:00 PM
  {
    id: 'tt-thu-5-b3',
    dayOfWeek: 'THURSDAY',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    startMinutes: 960,  // 16:00
    endMinutes: 1080,  // 18:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B3',
    teacherCodes: ['PrKh'],
    roomNumber: 'Lab206',
  },

  // ================= FRIDAY =================
  // Friday 08:00 AM – 10:00 AM
  {
    id: 'tt-fri-1-b3',
    dayOfWeek: 'FRIDAY',
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    startMinutes: 480, // 08:00
    endMinutes: 600,   // 10:00
    subjectCode: 'DSD-LAB',
    subjectName: 'DSD Lab',
    isLab: true,
    section: 'B',
    batch: 'B3',
    teacherCodes: ['FACULTY'],
    roomNumber: 'LAB105',
  },
  // Friday Parallel Labs 10:00 AM – 12:00 PM
  {
    id: 'tt-fri-2-b1',
    dayOfWeek: 'FRIDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B1',
    teacherCodes: ['NA', 'ShV'],
    roomNumber: 'Lab206',
  },
  {
    id: 'tt-fri-2-b3',
    dayOfWeek: 'FRIDAY',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600, // 10:00
    endMinutes: 720,   // 12:00
    subjectCode: 'LSP',
    subjectName: 'Linux Shell Programming',
    isLab: true,
    section: 'B',
    batch: 'B3',
    teacherCodes: ['AG', 'PrKh'],
    roomNumber: 'Lab204',
  },
  // Friday 01:00 PM – 02:00 PM (Section A,B)
  {
    id: 'tt-fri-3',
    dayOfWeek: 'FRIDAY',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    startMinutes: 780, // 13:00
    endMinutes: 840,   // 14:00
    subjectCode: 'DS',
    subjectName: 'Data Structures',
    isLab: false,
    section: 'B',
    teacherCodes: ['LP'],
    roomNumber: 'LT-201',
  },
  // Friday 02:00 PM – 03:00 PM
  {
    id: 'tt-fri-4',
    dayOfWeek: 'FRIDAY',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    startMinutes: 840, // 14:00
    endMinutes: 900,   // 15:00
    subjectCode: 'MATH3',
    subjectName: 'Mathematics III',
    isLab: false,
    section: 'B',
    teacherCodes: ['FACULTY'],
    roomNumber: 'ATC-309',
  },
  // Friday 03:00 PM – 04:00 PM
  {
    id: 'tt-fri-5',
    dayOfWeek: 'FRIDAY',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    startMinutes: 900, // 15:00
    endMinutes: 960,   // 16:00
    subjectCode: 'COA',
    subjectName: 'Computer Organization & Architecture',
    isLab: false,
    section: 'B',
    teacherCodes: ['ShV'],
    roomNumber: 'ATC-309',
  },
  // Friday Parallel Labs 04:00 PM – 06:00 PM
  {
    id: 'tt-fri-6-b1',
    dayOfWeek: 'FRIDAY',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    startMinutes: 960,  // 16:00
    endMinutes: 1080,  // 18:00
    subjectCode: 'DS-LAB',
    subjectName: 'DS Lab',
    isLab: true,
    section: 'B',
    batch: 'B1',
    teacherCodes: ['MuS', 'YS'],
    roomNumber: 'LAB105',
  },
  {
    id: 'tt-fri-6-b2',
    dayOfWeek: 'FRIDAY',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    startMinutes: 960,  // 16:00
    endMinutes: 1080,  // 18:00
    subjectCode: 'OOP-LAB',
    subjectName: 'OOP Lab',
    isLab: true,
    section: 'B',
    batch: 'B2',
    teacherCodes: ['US', 'VM'],
    roomNumber: 'Lab207',
  },
];

/**
 * Demo Users
 */
export const SEED_USERS: {
  user: User;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
}[] = [
  // Primary Student: Krishan Awasthi (IT 2nd Year B, Batch B2)
  {
    user: {
      id: 'usr-student-krishan',
      email: 'krishan.awasthi@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq', // demo password: "password123"
      role: 'STUDENT',
      isDemo: true,
    },
    studentProfile: {
      id: 'sp-krishan',
      userId: 'usr-student-krishan',
      fullName: 'Krishan Awasthi',
      rollNumber: '0801IT221045',
      departmentCode: 'IT',
      academicYear: '2nd Year',
      section: 'B',
      batch: 'B2',
    },
  },
  // Student Demo B1
  {
    user: {
      id: 'usr-student-b1',
      email: 'student.b1@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'STUDENT',
      isDemo: true,
    },
    studentProfile: {
      id: 'sp-b1',
      userId: 'usr-student-b1',
      fullName: 'Aarav Patel',
      rollNumber: '0801IT221002',
      departmentCode: 'IT',
      academicYear: '2nd Year',
      section: 'B',
      batch: 'B1',
    },
  },
  // Student Demo B3
  {
    user: {
      id: 'usr-student-b3',
      email: 'student.b3@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'STUDENT',
      isDemo: true,
    },
    studentProfile: {
      id: 'sp-b3',
      userId: 'usr-student-b3',
      fullName: 'Priya Sharma',
      rollNumber: '0801IT221088',
      departmentCode: 'IT',
      academicYear: '2nd Year',
      section: 'B',
      batch: 'B3',
    },
  },

  // Faculty Demo: US
  {
    user: {
      id: 'usr-teacher-us',
      email: 'faculty.us@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'TEACHER',
      isDemo: true,
    },
    teacherProfile: {
      id: 'tp-us',
      userId: 'usr-teacher-us',
      fullName: 'Faculty US',
      teacherCode: 'US',
      departmentCode: 'IT',
    },
  },
  // Faculty Demo: LP
  {
    user: {
      id: 'usr-teacher-lp',
      email: 'faculty.lp@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'TEACHER',
      isDemo: true,
    },
    teacherProfile: {
      id: 'tp-lp',
      userId: 'usr-teacher-lp',
      fullName: 'Faculty LP',
      teacherCode: 'LP',
      departmentCode: 'IT',
    },
  },
  // Faculty Demo: ShV
  {
    user: {
      id: 'usr-teacher-shv',
      email: 'faculty.shv@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'TEACHER',
      isDemo: true,
    },
    teacherProfile: {
      id: 'tp-shv',
      userId: 'usr-teacher-shv',
      fullName: 'Faculty ShV',
      teacherCode: 'ShV',
      departmentCode: 'IT',
    },
  },
  // Admin Demo
  {
    user: {
      id: 'usr-admin-it',
      email: 'admin.it@sgsits.ac.in',
      passwordHash: '$2a$10$X8O9c3gY2eXQ3k9Q5mBv7e9kF5X.o0mXzO2hXyJm1yW.3iFkI0Gq',
      role: 'ADMIN',
      isDemo: true,
    },
  },
];
