import { DayOfWeek, TimetableEntry, ClassStatus } from '../types/models';
import { SEED_TIMETABLE } from '../data/seedData';

export interface ClassStatusInfo {
  status: ClassStatus;
  isLive: boolean;
  isStartingSoon: boolean;
  isCompleted: boolean;
  minutesUntilStart?: number;
  minutesRemaining?: number;
}

export interface ActiveClassResult {
  entry: TimetableEntry | null;
  statusInfo: ClassStatusInfo;
  nextEntry: TimetableEntry | null;
  nextStatusInfo?: ClassStatusInfo;
  academicTime: {
    dayOfWeek: DayOfWeek;
    timeString: string; // "10:30 AM"
    currentMinutes: number;
    timezone: string;
    isSimulated: boolean;
  };
}

export interface TimetableQueryOptions {
  batch?: string;         // 'B1' | 'B2' | 'B3'
  teacherCode?: string;   // 'US' | 'LP' | etc.
  simulatedTime?: string | Date;
  includeAllBatches?: boolean; // For admin/faculty full parallel view
}

export class TimetableService {
  private static readonly TIMEZONE = 'Asia/Kolkata';
  private static readonly STARTING_SOON_THRESHOLD_MINUTES = 10;
  private entries: TimetableEntry[] = [...SEED_TIMETABLE];

  /**
   * Allows adding or overriding timetable entries dynamically
   */
  public setEntries(entries: TimetableEntry[]): void {
    this.entries = entries;
  }

  public getEntries(): TimetableEntry[] {
    return this.entries;
  }

  /**
   * Helper to convert an IST date to DayOfWeek and minutes from 00:00 IST
   */
  public getISTComponents(targetDate?: string | Date): {
    dayOfWeek: DayOfWeek;
    hours: number;
    minutes: number;
    totalMinutes: number;
    timeString: string;
    isSimulated: boolean;
  } {
    const isSimulated = !!targetDate;
    const date = targetDate ? new Date(targetDate) : new Date();

    // Format parts authoritative in Asia/Kolkata
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: TimetableService.TIMEZONE,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    let weekdayStr = '';
    let hourStr = '0';
    let minuteStr = '0';

    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value.toUpperCase();
      if (part.type === 'hour') hourStr = part.value;
      if (part.type === 'minute') minuteStr = part.value;
    }

    const dayOfWeek = (weekdayStr.toUpperCase() as DayOfWeek) || 'MONDAY';
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    const totalMinutes = hours * 60 + minutes;

    // Create 12-hour formatted string e.g. "11:30 AM"
    const time12Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: TimetableService.TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const timeString = time12Formatter.format(date);

    return {
      dayOfWeek,
      hours,
      minutes,
      totalMinutes,
      timeString,
      isSimulated,
    };
  }

  /**
   * Determines status of a timetable entry at given totalMinutes
   */
  public evaluateStatus(entry: TimetableEntry, currentMinutes: number): ClassStatusInfo {
    if (currentMinutes >= entry.endMinutes) {
      return {
        status: 'COMPLETED',
        isLive: false,
        isStartingSoon: false,
        isCompleted: true,
      };
    }

    if (currentMinutes >= entry.startMinutes && currentMinutes < entry.endMinutes) {
      return {
        status: 'LIVE',
        isLive: true,
        isStartingSoon: false,
        isCompleted: false,
        minutesRemaining: entry.endMinutes - currentMinutes,
      };
    }

    if (
      currentMinutes >= entry.startMinutes - TimetableService.STARTING_SOON_THRESHOLD_MINUTES &&
      currentMinutes < entry.startMinutes
    ) {
      return {
        status: 'STARTING_SOON',
        isLive: false,
        isStartingSoon: true,
        isCompleted: false,
        minutesUntilStart: entry.startMinutes - currentMinutes,
      };
    }

    return {
      status: 'UPCOMING',
      isLive: false,
      isStartingSoon: false,
      isCompleted: false,
      minutesUntilStart: entry.startMinutes - currentMinutes,
    };
  }

  /**
   * Filters entries relevant to a given student batch or teacher code
   */
  public filterEntries(
    entries: TimetableEntry[],
    options: { batch?: string; teacherCode?: string; includeAllBatches?: boolean }
  ): TimetableEntry[] {
    return entries.filter((entry) => {
      // If teacher specified, must match teacher codes
      if (options.teacherCode) {
        if (!entry.teacherCodes.includes(options.teacherCode)) {
          return false;
        }
      }

      // If student batch specified and not showing all batches:
      if (!options.includeAllBatches && options.batch) {
        // If entry has a batch requirement, student must match that batch
        if (entry.batch && entry.batch !== options.batch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get today's full schedule for student or teacher
   */
  public getTodaySchedule(options: TimetableQueryOptions = {}): {
    entries: TimetableEntry[];
    dayOfWeek: DayOfWeek;
    academicTime: {
      timeString: string;
      currentMinutes: number;
      timezone: string;
      isSimulated: boolean;
    };
  } {
    const ist = this.getISTComponents(options.simulatedTime);
    const dayEntries = this.entries.filter((e) => e.dayOfWeek === ist.dayOfWeek);
    const filtered = this.filterEntries(dayEntries, options);

    // Sort by startMinutes
    filtered.sort((a, b) => a.startMinutes - b.startMinutes);

    return {
      entries: filtered,
      dayOfWeek: ist.dayOfWeek,
      academicTime: {
        timeString: ist.timeString,
        currentMinutes: ist.totalMinutes,
        timezone: TimetableService.TIMEZONE,
        isSimulated: ist.isSimulated,
      },
    };
  }

  /**
   * Core Engine Method: Finds current active class or starting-soon class, and the next class
   */
  public getCurrentClass(options: TimetableQueryOptions = {}): ActiveClassResult {
    const ist = this.getISTComponents(options.simulatedTime);
    const today = this.getTodaySchedule(options);
    const { entries } = today;

    let activeEntry: TimetableEntry | null = null;
    let activeStatus: ClassStatusInfo = {
      status: 'UPCOMING',
      isLive: false,
      isStartingSoon: false,
      isCompleted: false,
    };

    let nextEntry: TimetableEntry | null = null;
    let nextStatus: ClassStatusInfo | undefined = undefined;

    // First check for LIVE class
    for (const entry of entries) {
      const statusInfo = this.evaluateStatus(entry, ist.totalMinutes);
      if (statusInfo.isLive) {
        activeEntry = entry;
        activeStatus = statusInfo;
        break;
      }
    }

    // If no LIVE class, check if any class is STARTING_SOON (within 10 minutes)
    if (!activeEntry) {
      for (const entry of entries) {
        const statusInfo = this.evaluateStatus(entry, ist.totalMinutes);
        if (statusInfo.isStartingSoon) {
          activeEntry = entry;
          activeStatus = statusInfo;
          break;
        }
      }
    }

    // Now find the next upcoming class
    for (const entry of entries) {
      // Must start strictly after currentMinutes or be upcoming
      if (entry.startMinutes > ist.totalMinutes) {
        if (!activeEntry || entry.id !== activeEntry.id) {
          nextEntry = entry;
          nextStatus = this.evaluateStatus(entry, ist.totalMinutes);
          break;
        }
      }
    }

    return {
      entry: activeEntry,
      statusInfo: activeStatus,
      nextEntry,
      nextStatusInfo: nextStatus,
      academicTime: {
        dayOfWeek: ist.dayOfWeek,
        timeString: ist.timeString,
        currentMinutes: ist.totalMinutes,
        timezone: TimetableService.TIMEZONE,
        isSimulated: ist.isSimulated,
      },
    };
  }

  /**
   * Get full weekly timetable matrix (Monday through Friday)
   */
  public getWeeklySchedule(options: TimetableQueryOptions = {}): Record<DayOfWeek, TimetableEntry[]> {
    const days: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const result: Record<DayOfWeek, TimetableEntry[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };

    for (const day of days) {
      const dayEntries = this.entries.filter((e) => e.dayOfWeek === day);
      const filtered = this.filterEntries(dayEntries, options);
      filtered.sort((a, b) => a.startMinutes - b.startMinutes);
      result[day] = filtered;
    }

    return result;
  }
}

export const timetableService = new TimetableService();
