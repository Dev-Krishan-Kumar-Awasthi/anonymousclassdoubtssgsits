import { OOPClass, OOP_CLASSES } from '@/data/mockData';

export interface ClassScheduleSlot {
  classId: string;
  day: string; // 'Monday', 'Wednesday', etc.
  dayNumber: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  startMinutes: number; // minutes from midnight (e.g. 11:00 AM = 660)
  endMinutes: number; // minutes from midnight (e.g. 12:00 PM = 720)
}

export const OOP_SCHEDULE_SLOTS: Record<string, ClassScheduleSlot> = {
  'oop-monday-11': {
    classId: 'oop-monday-11',
    day: 'Monday',
    dayNumber: 1,
    startMinutes: 11 * 60, // 11:00 AM = 660
    endMinutes: 12 * 60, // 12:00 PM = 720
  },
  'oop-lab-monday-b3': {
    classId: 'oop-lab-monday-b3',
    day: 'Monday',
    dayNumber: 1,
    startMinutes: 14 * 60, // 2:00 PM = 840
    endMinutes: 16 * 60, // 4:00 PM = 960
  },
  'oop-lab-wednesday-b1': {
    classId: 'oop-lab-wednesday-b1',
    day: 'Wednesday',
    dayNumber: 3,
    startMinutes: 10 * 60, // 10:00 AM = 600
    endMinutes: 12 * 60, // 12:00 PM = 720
  },
  'oop-wednesday-4': {
    classId: 'oop-wednesday-4',
    day: 'Wednesday',
    dayNumber: 3,
    startMinutes: 16 * 60, // 4:00 PM = 960
    endMinutes: 17 * 60, // 5:00 PM = 1020
  },
  'oop-thursday-11': {
    classId: 'oop-thursday-11',
    day: 'Thursday',
    dayNumber: 4,
    startMinutes: 11 * 60, // 11:00 AM = 660
    endMinutes: 12 * 60, // 12:00 PM = 720
  },
  'oop-lab-friday-b2': {
    classId: 'oop-lab-friday-b2',
    day: 'Friday',
    dayNumber: 5,
    startMinutes: 16 * 60, // 4:00 PM = 960
    endMinutes: 18 * 60, // 6:00 PM = 1080
  },
};

/**
 * Get current Asia/Kolkata date and time
 */
export function getIndiaCurrentDateTime(simulatedDate?: Date | null): {
  dayName: string;
  dayNumber: number;
  currentMinutes: number;
  formattedTime: string;
  formattedDate: string;
} {
  const targetDate = simulatedDate || new Date();

  // Format to Asia/Kolkata
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(targetDate);

  let weekday = '';
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value;
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  const daysMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const dayNumber = daysMap[weekday] ?? targetDate.getDay();
  const currentMinutes = hour * 60 + minute;

  const displayTime = targetDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const displayDate = targetDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return {
    dayName: weekday,
    dayNumber,
    currentMinutes,
    formattedTime: displayTime,
    formattedDate: displayDate,
  };
}

/**
 * Check if a specific class is active right now based on day and time
 */
export function isClassActive(
  classId: string,
  simulatedDate?: Date | null
): {
  isActive: boolean;
  statusText: string;
  slot?: ClassScheduleSlot;
} {
  const slot = OOP_SCHEDULE_SLOTS[classId];
  if (!slot) {
    return {
      isActive: false,
      statusText: 'No schedule found',
    };
  }

  const current = getIndiaCurrentDateTime(simulatedDate);

  const isSameDay = current.dayNumber === slot.dayNumber;
  const isDuringSlot =
    current.currentMinutes >= slot.startMinutes &&
    current.currentMinutes < slot.endMinutes;

  if (isSameDay && isDuringSlot) {
    return {
      isActive: true,
      statusText: 'Class is Active',
      slot,
    };
  }

  // If same day but not started yet
  if (isSameDay && current.currentMinutes < slot.startMinutes) {
    const minutesLeft = slot.startMinutes - current.currentMinutes;
    return {
      isActive: false,
      statusText: `Starts today in ${minutesLeft} min`,
      slot,
    };
  }

  return {
    isActive: false,
    statusText: 'Class is Not Active',
    slot,
  };
}

/**
 * Sort classes so that the currently active class is pinned to the VERY FIRST (#1) position!
 */
export function sortClassesWithActiveFirst(
  classes: OOPClass[],
  simulatedDate?: Date | null
): (OOPClass & { isActive: boolean; statusText: string })[] {
  const mapped = classes.map((cls) => {
    const activeCheck = isClassActive(cls.id, simulatedDate);
    return {
      ...cls,
      isActive: activeCheck.isActive,
      statusText: activeCheck.statusText,
    };
  });

  return mapped.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
  });
}
