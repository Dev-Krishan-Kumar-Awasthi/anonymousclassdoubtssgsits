export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type ClassStatus = 'UPCOMING' | 'STARTING_SOON' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export type DoubtCategory =
  | 'CONCEPT'
  | 'PROGRAMMING'
  | 'ASSIGNMENT'
  | 'EXAM_MST'
  | 'LECTURE_PACE'
  | 'OTHER';

export type DoubtStatus =
  | 'PENDING'
  | 'ANSWERED'
  | 'PUBLISHED'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'FLAGGED';

export type PulseRating = 'FULLY' | 'MOSTLY' | 'PARTIAL' | 'NEED_REVISION';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isDemo?: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  departmentCode: string;
  academicYear: string;
  section: string;
  batch: string; // 'B1' | 'B2' | 'B3'
}

export interface TeacherProfile {
  id: string;
  userId: string;
  fullName: string;
  teacherCode: string; // US, VM, LP, IK, NA, ShV, PrKh, MuS, YS, AG
  departmentCode: string;
}

export interface TimetableEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "11:00 AM"
  endTime: string;   // "12:00 PM"
  startMinutes: number; // minutes from 00:00 (e.g. 11*60 = 660)
  endMinutes: number;   // minutes from 00:00 (e.g. 12*60 = 720)
  subjectCode: string;
  subjectName: string;
  isLab: boolean;
  section: string;
  batch?: string; // "B1" | "B2" | "B3" (undefined if all section)
  teacherCodes: string[];
  roomNumber: string;
}

export interface ClassSession {
  id: string;
  timetableEntryId: string;
  date: string; // "YYYY-MM-DD"
  status: ClassStatus;
  actualRoomNumber?: string;
  overrideTeacher?: string;
  notes?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface Doubt {
  id: string;
  referenceNo: string;
  internalUserId: string; // Authenticated student (NEVER sent to teacher)
  classSessionId?: string;
  subjectCode: string;
  text: string;
  normalizedText?: string;
  category: DoubtCategory;
  isWholeClass: boolean;
  status: DoubtStatus;
  isPinned: boolean;
  upvotes: number;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
  responses?: DoubtResponse[];
}

export interface DoubtResponse {
  id: string;
  doubtId: string;
  teacherCode: string;
  answerText: string;
  isPublishedToClass: boolean;
  isSavedAsFaq: boolean;
  createdAt: string;
}

export interface DoubtGroup {
  id: string;
  topicTitle: string;
  subjectCode: string;
  doubtIds: string[];
  createdAt: string;
}

export interface ClassPulse {
  id: string;
  classSessionId: string;
  internalUserId: string;
  rating: PulseRating;
  createdAt: string;
}
