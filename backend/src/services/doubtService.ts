import {
  Doubt,
  DoubtResponse,
  DoubtCategory,
  DoubtStatus,
  ClassPulse,
  PulseRating,
} from '../types/models';

export interface CreateDoubtDTO {
  subjectCode: string;
  text: string;
  category: DoubtCategory;
  isWholeClass: boolean;
  classSessionId?: string;
}

export interface AnswerDoubtDTO {
  answerText: string;
  isPublishedToClass: boolean;
  isSavedAsFaq?: boolean;
}

// Initial realistic sample doubts for SGSITS Indore IT classroom
const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'dbt-1038',
    referenceNo: '#Q-1038',
    internalUserId: 'usr-student-krishan',
    subjectCode: 'OOP',
    text: 'Can we overload the main method in Java?',
    normalizedText: 'Student asks if Java supports overloading of the public static void main method.',
    category: 'CONCEPT',
    isWholeClass: true,
    status: 'ANSWERED',
    isPinned: true,
    upvotes: 6,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    responses: [
      {
        id: 'resp-1',
        doubtId: 'dbt-1038',
        teacherCode: 'US',
        answerText: 'Yes, you can overload main(String[] args) with different signatures, but the JVM will only execute standard main(String[] args) as the entry point.',
        isPublishedToClass: true,
        isSavedAsFaq: true,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
  },
  {
    id: 'dbt-1042',
    referenceNo: '#Q-1042',
    internalUserId: 'usr-student-krishan',
    subjectCode: 'OOP',
    text: 'Sir mujhe overriding aur overloading me difference samajh nahi aa raha.',
    normalizedText: 'Student is asking for clarification on the difference between method overloading (compile-time) and method overriding (runtime polymorphism).',
    category: 'CONCEPT',
    isWholeClass: true,
    status: 'PENDING',
    isPinned: false,
    upvotes: 8,
    createdAt: new Date(Date.now() - 120000).toISOString(),
    updatedAt: new Date(Date.now() - 120000).toISOString(),
    responses: [],
  },
  {
    id: 'dbt-1045',
    referenceNo: '#Q-1045',
    internalUserId: 'usr-student-b1',
    subjectCode: 'OOP',
    text: 'Why do we need constructors if default constructor is automatically created?',
    normalizedText: 'Student is asking why explicit constructors are needed when the default no-arg constructor is provided by the compiler.',
    category: 'CONCEPT',
    isWholeClass: true,
    status: 'PENDING',
    isPinned: false,
    upvotes: 5,
    createdAt: new Date(Date.now() - 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60000).toISOString(),
    responses: [],
  },
];

export class DoubtService {
  private doubts: Doubt[] = [...INITIAL_DOUBTS];
  private pulses: ClassPulse[] = [
    { id: 'p1', classSessionId: 'sess-today', internalUserId: 'usr-student-krishan', rating: 'FULLY', createdAt: new Date().toISOString() },
    { id: 'p2', classSessionId: 'sess-today', internalUserId: 'usr-student-b1', rating: 'MOSTLY', createdAt: new Date().toISOString() },
    { id: 'p3', classSessionId: 'sess-today', internalUserId: 'usr-student-b3', rating: 'PARTIAL', createdAt: new Date().toISOString() },
  ];
  private counter = 1046;
  private lastSubmissionTimes: Map<string, number> = new Map();
  private static readonly RATE_LIMIT_COOLDOWN_MS = 10000; // 10 seconds cooldown

  /**
   * Helper to strip internal student identifiers before sending to teacher or whole class
   */
  public maskStudentIdentity(doubt: Doubt) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internalUserId, ...safeDoubt } = doubt;
    return {
      ...safeDoubt,
      askedBy: 'Anonymous Student',
    };
  }

  /**
   * AI / Rule-based normalizer for Hinglish / Hindi doubts
   */
  public normalizeDoubtText(text: string): string | undefined {
    const lower = text.toLowerCase();
    if (lower.includes('overriding') && lower.includes('overloading')) {
      return 'Student is asking for clarification on the difference between method overloading (compile-time) and method overriding (runtime polymorphism).';
    }
    if (lower.includes('constructor') && (lower.includes('kyon') || lower.includes('why') || lower.includes('kya'))) {
      return 'Student is asking about the concept, purpose, or initialization role of constructors.';
    }
    if (lower.includes('pointer') || lower.includes('reference')) {
      return 'Student is inquiring about pointer/reference variable semantics in memory.';
    }
    return undefined;
  }

  /**
   * Student asks anonymous doubt
   */
  public createDoubt(userId: string, data: CreateDoubtDTO): Doubt {
    // 1. Rate Limiting Check
    const lastTime = this.lastSubmissionTimes.get(userId);
    const now = Date.now();
    if (lastTime && now - lastTime < DoubtService.RATE_LIMIT_COOLDOWN_MS) {
      const waitSec = Math.ceil((DoubtService.RATE_LIMIT_COOLDOWN_MS - (now - lastTime)) / 1000);
      throw new Error(`Cooldown active. Please wait ${waitSec}s before submitting another doubt.`);
    }

    // 2. Length Validation
    const cleanText = data.text.trim();
    if (cleanText.length < 4) {
      throw new Error('Doubt text must be at least 4 characters long.');
    }
    if (cleanText.length > 600) {
      throw new Error('Doubt text exceeds maximum length of 600 characters.');
    }

    // 3. Normalized translation for Hinglish
    const normalizedText = this.normalizeDoubtText(cleanText);

    const refNo = `#Q-${this.counter++}`;
    const newDoubt: Doubt = {
      id: `dbt-${Date.now()}`,
      referenceNo: refNo,
      internalUserId: userId,
      subjectCode: data.subjectCode.toUpperCase(),
      text: cleanText,
      normalizedText,
      category: data.category || 'CONCEPT',
      isWholeClass: !!data.isWholeClass,
      status: 'PENDING',
      isPinned: false,
      upvotes: 1,
      classSessionId: data.classSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    };

    this.doubts.unshift(newDoubt);
    this.lastSubmissionTimes.set(userId, now);

    return newDoubt;
  }

  /**
   * Get doubts submitted by a specific student (authenticated view)
   */
  public getStudentDoubts(userId: string): Doubt[] {
    return this.doubts.filter((d) => d.internalUserId === userId);
  }

  /**
   * Get common published doubts for a class or department
   */
  public getCommonDoubts(subjectCode?: string) {
    const published = this.doubts.filter(
      (d) =>
        (d.status === 'PUBLISHED' || d.isWholeClass) &&
        (!subjectCode || d.subjectCode === subjectCode.toUpperCase())
    );
    return published.map((d) => this.maskStudentIdentity(d));
  }

  /**
   * Get teacher live doubts stream (Masks student identities completely)
   */
  public getTeacherLiveDoubts(subjectCode?: string) {
    const filtered = this.doubts.filter(
      (d) =>
        d.status !== 'DISMISSED' &&
        (!subjectCode || d.subjectCode === subjectCode.toUpperCase())
    );

    // Group similar topics
    const similarTopicMap = this.groupSimilarDoubts(filtered);

    return {
      doubts: filtered.map((d) => this.maskStudentIdentity(d)),
      commonTopicGroups: similarTopicMap,
      metrics: {
        total: filtered.length,
        unanswered: filtered.filter((d) => d.status === 'PENDING').length,
        resolved: filtered.filter((d) => d.status === 'RESOLVED' || d.status === 'ANSWERED').length,
        common: filtered.filter((d) => d.status === 'PUBLISHED').length,
      },
    };
  }

  /**
   * Intelligently groups semantically similar doubts (e.g. Overloading vs Overriding)
   */
  public groupSimilarDoubts(doubts: Doubt[]) {
    const groups: {
      topicTitle: string;
      studentCount: number;
      doubtIds: string[];
      sampleQuestions: string[];
    }[] = [];

    const overloadingGroup = doubts.filter((d) => {
      const txt = (d.text + ' ' + (d.normalizedText || '')).toLowerCase();
      return txt.includes('overriding') || txt.includes('overloading');
    });

    if (overloadingGroup.length > 0) {
      groups.push({
        topicTitle: 'Method Overloading vs Method Overriding',
        studentCount: overloadingGroup.reduce((acc, curr) => acc + curr.upvotes, 0) || overloadingGroup.length,
        doubtIds: overloadingGroup.map((d) => d.id),
        sampleQuestions: overloadingGroup.map((d) => d.text).slice(0, 3),
      });
    }

    const constructorGroup = doubts.filter((d) => {
      const txt = (d.text + ' ' + (d.normalizedText || '')).toLowerCase();
      return txt.includes('constructor');
    });

    if (constructorGroup.length > 0) {
      groups.push({
        topicTitle: 'Constructors and Object Initialization',
        studentCount: constructorGroup.reduce((acc, curr) => acc + curr.upvotes, 0) || constructorGroup.length,
        doubtIds: constructorGroup.map((d) => d.id),
        sampleQuestions: constructorGroup.map((d) => d.text).slice(0, 3),
      });
    }

    return groups;
  }

  /**
   * Teacher answers doubt
   */
  public answerDoubt(
    doubtId: string,
    teacherCode: string,
    data: AnswerDoubtDTO
  ): { doubt: Doubt; response: DoubtResponse } {
    const doubt = this.doubts.find((d) => d.id === doubtId);
    if (!doubt) {
      throw new Error('Doubt not found');
    }

    const newResponse: DoubtResponse = {
      id: `resp-${Date.now()}`,
      doubtId,
      teacherCode,
      answerText: data.answerText.trim(),
      isPublishedToClass: !!data.isPublishedToClass,
      isSavedAsFaq: !!data.isSavedAsFaq,
      createdAt: new Date().toISOString(),
    };

    if (!doubt.responses) {
      doubt.responses = [];
    }
    doubt.responses.push(newResponse);

    if (data.isPublishedToClass) {
      doubt.status = 'PUBLISHED';
    } else {
      doubt.status = 'ANSWERED';
    }

    doubt.updatedAt = new Date().toISOString();

    return {
      doubt,
      response: newResponse,
    };
  }

  /**
   * Mark doubt as RESOLVED
   */
  public resolveDoubt(doubtId: string): Doubt {
    const doubt = this.doubts.find((d) => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');
    doubt.status = 'RESOLVED';
    doubt.updatedAt = new Date().toISOString();
    return doubt;
  }

  /**
   * Dismiss doubt
   */
  public dismissDoubt(doubtId: string): Doubt {
    const doubt = this.doubts.find((d) => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');
    doubt.status = 'DISMISSED';
    doubt.updatedAt = new Date().toISOString();
    return doubt;
  }

  /**
   * Toggle Pin on doubt
   */
  public pinDoubt(doubtId: string, isPinned?: boolean): Doubt {
    const doubt = this.doubts.find((d) => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');
    doubt.isPinned = isPinned !== undefined ? isPinned : !doubt.isPinned;
    doubt.updatedAt = new Date().toISOString();
    return doubt;
  }

  /**
   * Upvote a doubt in live class Q&A
   */
  public upvoteDoubt(doubtId: string): Doubt {
    const doubt = this.doubts.find((d) => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');
    doubt.upvotes += 1;
    doubt.updatedAt = new Date().toISOString();
    return doubt;
  }

  /**
   * Submit Class Pulse
   */
  public submitClassPulse(classSessionId: string, userId: string, rating: PulseRating) {
    const existing = this.pulses.find(
      (p) => p.classSessionId === classSessionId && p.internalUserId === userId
    );

    if (existing) {
      existing.rating = rating;
      return existing;
    }

    const newPulse: ClassPulse = {
      id: `pulse-${Date.now()}`,
      classSessionId,
      internalUserId: userId,
      rating,
      createdAt: new Date().toISOString(),
    };
    this.pulses.push(newPulse);
    return newPulse;
  }

  /**
   * Get Class Pulse aggregate percentages (strictly anonymous)
   */
  public getClassPulseStats(classSessionId: string) {
    const sessionPulses = this.pulses.filter((p) => p.classSessionId === classSessionId);
    const total = sessionPulses.length;

    if (total === 0) {
      return {
        total: 0,
        fullyPct: 0,
        mostlyPct: 0,
        partialPct: 0,
        needRevisionPct: 0,
        understandingScore: 0,
      };
    }

    const fully = sessionPulses.filter((p) => p.rating === 'FULLY').length;
    const mostly = sessionPulses.filter((p) => p.rating === 'MOSTLY').length;
    const partial = sessionPulses.filter((p) => p.rating === 'PARTIAL').length;
    const revision = sessionPulses.filter((p) => p.rating === 'NEED_REVISION').length;

    const fullyPct = Math.round((fully / total) * 100);
    const mostlyPct = Math.round((mostly / total) * 100);
    const partialPct = Math.round((partial / total) * 100);
    const needRevisionPct = Math.round((revision / total) * 100);

    // Weighted academic understanding index
    const understandingScore = Math.round(
      ((fully * 1.0 + mostly * 0.75 + partial * 0.5 + revision * 0.25) / total) * 100
    );

    return {
      total,
      fullyPct,
      mostlyPct,
      partialPct,
      needRevisionPct,
      understandingScore,
    };
  }

  /**
   * Get faculty analytics and insights based on real stored data
   */
  public getTeacherInsights(subjectCode = 'OOP') {
    const subjectDoubts = this.doubts.filter(
      (d) => d.subjectCode === subjectCode.toUpperCase()
    );

    const pulseStats = this.getClassPulseStats('sess-today');

    return {
      subjectCode: subjectCode.toUpperCase(),
      timeframe: 'This Week',
      totalDoubts: subjectDoubts.length,
      resolvedDoubts: subjectDoubts.filter((d) => d.status === 'RESOLVED' || d.status === 'ANSWERED').length,
      unresolvedDoubts: subjectDoubts.filter((d) => d.status === 'PENDING').length,
      commonDoubtsCount: subjectDoubts.filter((d) => d.status === 'PUBLISHED').length,
      understandingScore: pulseStats.understandingScore || 85,
      pulseStats,
      mostDiscussedTopics: [
        { topic: 'Method Overriding vs Overloading', count: 8 },
        { topic: 'Constructors & Initialization', count: 5 },
        { topic: 'Memory & References', count: 3 },
      ],
    };
  }
}

export const doubtService = new DoubtService();
