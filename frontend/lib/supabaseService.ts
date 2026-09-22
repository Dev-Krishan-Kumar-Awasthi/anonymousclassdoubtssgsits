import { supabase, isSupabaseConfigured } from './supabase';
import { OOP_CLASSES, OOPClass, Doubt, Reply, INITIAL_DOUBTS } from '@/data/mockData';

// Helper to format timestamps to relative time
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // already relative or custom text

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } catch {
    return dateString;
  }
}

// LocalStorage persistence keys for seamless fallback if Supabase env is not configured
const STORAGE_PREFIX = 'sgsits_ask_doubts_';

function getLocalDoubts(classId: string): Doubt[] {
  if (typeof window === 'undefined') return INITIAL_DOUBTS[classId] || [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${classId}`);
    if (raw) return JSON.parse(raw);
    const defaults = INITIAL_DOUBTS[classId] || [];
    localStorage.setItem(`${STORAGE_PREFIX}${classId}`, JSON.stringify(defaults));
    return defaults;
  } catch {
    return INITIAL_DOUBTS[classId] || [];
  }
}

function saveLocalDoubts(classId: string, doubts: Doubt[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${classId}`, JSON.stringify(doubts));
    // Broadcast for multi-tab fallback realtime
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`sgsits_ask_${classId}`);
      bc.postMessage({ type: 'SYNC', doubts });
      bc.close();
    }
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetch all classes (from Supabase if configured, otherwise OOP timetable)
 */
export async function fetchClasses(): Promise<OOPClass[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('day', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          subject: item.subject,
          code: item.type === 'Laboratory' ? 'OOP LAB' : 'OOP',
          type: item.type,
          day: item.day,
          time: item.time,
          room: item.room,
          section: item.section_or_batch,
          teacher: item.teacher,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchClasses fallback to local data:', err);
    }
  }
  return OOP_CLASSES;
}

/**
 * Fetch all doubts across all classes (for students and teachers to view all questions of the day)
 */
export async function fetchAllDoubts(): Promise<(Doubt & { classInfo?: OOPClass })[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .select(`
          id,
          class_id,
          content,
          created_at,
          replies (
            id,
            doubt_id,
            content,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        return data.map((item: any) => {
          const classInfo = OOP_CLASSES.find((c) => c.id === item.class_id);
          const replies: Reply[] = (item.replies || [])
            .map((r: any) => {
              const isInstructor = r.content.includes('blueprint or prototype') || r.content.includes('implicitly') || r.content.includes('common base fields');
              return {
                id: r.id,
                doubtId: r.doubt_id,
                author: isInstructor ? 'Instructor (US)' : 'Anonymous Student',
                content: r.content,
                createdAt: formatRelativeTime(r.created_at),
              };
            })
            .sort((a: any, b: any) => (a.createdAt > b.createdAt ? 1 : -1));

          return {
            id: item.id,
            classId: item.class_id,
            author: 'Anonymous Student',
            content: item.content,
            createdAt: formatRelativeTime(item.created_at),
            replies,
            classInfo,
          };
        });
      }
    } catch (err) {
      console.warn('Supabase fetchAllDoubts error, falling back to local data:', err);
    }
  }

  // Fallback to all local doubts
  const all: (Doubt & { classInfo?: OOPClass })[] = [];
  OOP_CLASSES.forEach((cls) => {
    const classDoubts = getLocalDoubts(cls.id);
    classDoubts.forEach((d) => {
      all.push({
        ...d,
        classInfo: cls,
      });
    });
  });
  return all.sort((a, b) => (b.id > a.id ? 1 : -1));
}

/**
 * Fetch doubt counts grouped by classId
 */
export async function fetchDoubtCountsPerClass(): Promise<Record<string, number>> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .select('class_id');

      if (!error && data) {
        const counts: Record<string, number> = {};
        OOP_CLASSES.forEach((c) => {
          counts[c.id] = 0;
        });
        data.forEach((row: any) => {
          counts[row.class_id] = (counts[row.class_id] || 0) + 1;
        });
        return counts;
      }
    } catch (err) {
      console.warn('Supabase fetchDoubtCountsPerClass error:', err);
    }
  }

  // Fallback
  const counts: Record<string, number> = {};
  OOP_CLASSES.forEach((c) => {
    counts[c.id] = getLocalDoubts(c.id).length;
  });
  return counts;
}

/**
 * Fetch doubts and their nested replies for a specific class
 */
export async function fetchDoubtsForClass(classId: string): Promise<Doubt[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .select(`
          id,
          class_id,
          content,
          created_at,
          replies (
            id,
            doubt_id,
            content,
            created_at
          )
        `)
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        return data.map((item: any) => {
          const replies: Reply[] = (item.replies || [])
            .map((r: any) => {
              const isInstructor = r.content.includes('blueprint or prototype') || r.content.includes('implicitly') || r.content.includes('common base fields');
              return {
                id: r.id,
                doubtId: r.doubt_id,
                author: isInstructor ? 'Instructor (US)' : 'Anonymous Student',
                content: r.content,
                createdAt: formatRelativeTime(r.created_at),
              };
            })
            .sort((a: any, b: any) => (a.createdAt > b.createdAt ? 1 : -1));

          return {
            id: item.id,
            classId: item.class_id,
            author: 'Anonymous Student',
            content: item.content,
            createdAt: formatRelativeTime(item.created_at),
            replies,
          };
        });
      }
    } catch (err) {
      console.warn('Supabase fetchDoubts error, using persistent fallback:', err);
    }
  }

  return getLocalDoubts(classId);
}

/**
 * Insert a new doubt into Supabase or fallback
 */
// Single authoritative Realtime topic for the entire SGSITS Anonymous Doubts platform
const REALTIME_CHANNEL_NAME = 'sgsits_realtime_doubts';

let globalBroadcastChannel: any = null;

function getGlobalBroadcaster() {
  if (typeof window === 'undefined' || !isSupabaseConfigured() || !supabase) return null;
  if (!globalBroadcastChannel) {
    globalBroadcastChannel = supabase.channel(REALTIME_CHANNEL_NAME, {
      config: { broadcast: { ack: false, self: true } },
    });
    globalBroadcastChannel.subscribe((status: string) => {
      console.log('[Supabase Realtime Broadcaster] Status:', status);
    });
  }
  return globalBroadcastChannel;
}

/**
 * Insert a new doubt into Supabase or fallback
 */
export async function createDoubt(classId: string, content: string): Promise<Doubt> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('Doubt content cannot be empty');
  }

  let createdDoubt: Doubt;

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('doubts')
      .insert({
        class_id: classId,
        content: trimmed,
      })
      .select('id, class_id, content, created_at')
      .single();

    if (error) {
      throw error;
    }

    createdDoubt = {
      id: data.id,
      classId: data.class_id,
      author: 'Anonymous Student',
      content: data.content,
      createdAt: 'Just now',
      replies: [],
    };
  } else {
    // Fallback to localStorage
    createdDoubt = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      classId,
      author: 'Anonymous Student',
      content: trimmed,
      createdAt: 'Just now',
      replies: [],
    };
    const existing = getLocalDoubts(classId);
    saveLocalDoubts(classId, [createdDoubt, ...existing]);
  }

  // Layer 1: Supabase Realtime WebSocket Broadcast (<30ms to all remote devices)
  try {
    const broadcaster = getGlobalBroadcaster();
    if (broadcaster) {
      broadcaster.send({
        type: 'broadcast',
        event: 'NEW_DOUBT',
        payload: createdDoubt,
      });
    }
  } catch (e) {
    console.warn('Realtime broadcast error:', e);
  }

  // Layer 2: Browser BroadcastChannel (<1ms to all other tabs on same device)
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('sgsits_ask_global');
      bc.postMessage({ type: 'NEW_DOUBT', payload: createdDoubt });
      bc.close();
    } catch {}
  }

  return createdDoubt;
}

/**
 * Insert a new reply into Supabase or fallback
 */
export async function createReply(
  doubtId: string,
  classId: string,
  content: string,
  author: string = 'Anonymous Student'
): Promise<Reply> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('Reply content cannot be empty');
  }

  let createdReply: Reply;

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('replies')
      .insert({
        doubt_id: doubtId,
        content: trimmed,
      })
      .select('id, doubt_id, content, created_at')
      .single();

    if (error) {
      throw error;
    }

    createdReply = {
      id: data.id,
      doubtId: data.doubt_id,
      author: author,
      content: data.content,
      createdAt: 'Just now',
    };
  } else {
    // Fallback to localStorage
    createdReply = {
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      doubtId,
      author: author,
      content: trimmed,
      createdAt: 'Just now',
    };
    const existing = getLocalDoubts(classId);
    const updated = existing.map((d) => {
      if (d.id === doubtId) {
        return {
          ...d,
          replies: [...(d.replies || []), createdReply],
        };
      }
      return d;
    });
    saveLocalDoubts(classId, updated);
  }

  // Layer 1: Supabase Realtime WebSocket Broadcast
  try {
    const broadcaster = getGlobalBroadcaster();
    if (broadcaster) {
      broadcaster.send({
        type: 'broadcast',
        event: 'NEW_REPLY',
        payload: { doubtId, classId, reply: createdReply },
      });
    }
  } catch (e) {
    console.warn('Realtime broadcast error:', e);
  }

  // Layer 2: Browser BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('sgsits_ask_global');
      bc.postMessage({ type: 'NEW_REPLY', payload: { doubtId, classId, reply: createdReply } });
      bc.close();
    } catch {}
  }

  return createdReply;
}

/**
 * Subscribe to realtime updates for a class (both new doubts and new replies)
 */
export function subscribeToClass(
  classId: string,
  onDoubtInsert: (doubt: Doubt) => void,
  onReplyInsert: (reply: Reply) => void
): () => void {
  const client = supabase;
  let subChannel: any = null;

  if (isSupabaseConfigured() && client) {
    const uniqueSubId = `class_sub_${classId}_${Math.random().toString(36).substring(2, 7)}`;
    subChannel = client
      .channel(uniqueSubId, {
        config: { broadcast: { ack: false, self: true } },
      })
      // 1. WebSocket Broadcast: fast (<30ms)
      .on('broadcast', { event: 'NEW_DOUBT' }, (event: any) => {
        if (event.payload && event.payload.classId === classId) {
          onDoubtInsert(event.payload);
        }
      })
      .on('broadcast', { event: 'NEW_REPLY' }, (event: any) => {
        if (event.payload?.classId === classId && event.payload?.reply) {
          onReplyInsert(event.payload.reply);
        }
      })
      // 2. PostgreSQL CDC (WAL database changes)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doubts',
        },
        (payload) => {
          const newRow = payload.new;
          if (newRow && newRow.class_id === classId) {
            const doubt: Doubt = {
              id: newRow.id,
              classId: newRow.class_id,
              author: 'Anonymous Student',
              content: newRow.content,
              createdAt: formatRelativeTime(newRow.created_at),
              replies: [],
            };
            onDoubtInsert(doubt);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'replies',
        },
        (payload) => {
          const newRow = payload.new;
          if (newRow) {
            const reply: Reply = {
              id: newRow.id,
              doubtId: newRow.doubt_id,
              author: 'Anonymous Student',
              content: newRow.content,
              createdAt: formatRelativeTime(newRow.created_at),
            };
            onReplyInsert(reply);
          }
        }
      )
      .subscribe((status: string) => {
        console.log(`[Class Realtime ${classId}] Subscription status:`, status);
      });
  }

  // 3. Multi-tab cross-tab broadcast (same computer/browser)
  let bc: any = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel('sgsits_ask_global');
      bc.onmessage = (event: any) => {
        if (event.data?.type === 'NEW_DOUBT' && event.data.payload?.classId === classId) {
          onDoubtInsert(event.data.payload);
        } else if (event.data?.type === 'NEW_REPLY' && event.data.payload?.reply) {
          if (event.data.payload.classId === classId) {
            onReplyInsert(event.data.payload.reply);
          }
        }
      };
    } catch {}
  }

  return () => {
    if (client && subChannel) {
      client.removeChannel(subChannel);
    }
    if (bc) {
      bc.close();
    }
  };
}

/**
 * Subscribe to realtime updates for ALL classes (for the Central Today Doubts Feed)
 */
export function subscribeToAllDoubts(
  onDoubtInsert: (doubt: Doubt & { classInfo?: OOPClass }) => void,
  onReplyInsert: (reply: Reply) => void
): () => void {
  const client = supabase;
  let allChannel: any = null;

  if (isSupabaseConfigured() && client) {
    const uniqueSubId = `all_doubts_sub_${Math.random().toString(36).substring(2, 7)}`;
    allChannel = client
      .channel(uniqueSubId, {
        config: { broadcast: { ack: false, self: true } },
      })
      // 1. WebSocket Broadcast: fast (<30ms)
      .on('broadcast', { event: 'NEW_DOUBT' }, (event: any) => {
        if (event.payload) {
          const classInfo = OOP_CLASSES.find((c) => c.id === event.payload.classId);
          onDoubtInsert({ ...event.payload, classInfo });
        }
      })
      .on('broadcast', { event: 'NEW_REPLY' }, (event: any) => {
        if (event.payload?.reply) {
          onReplyInsert(event.payload.reply);
        }
      })
      // 2. PostgreSQL CDC WAL
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doubts',
        },
        (payload) => {
          const newRow = payload.new;
          if (newRow) {
            const classInfo = OOP_CLASSES.find((c) => c.id === newRow.class_id);
            const doubt: Doubt & { classInfo?: OOPClass } = {
              id: newRow.id,
              classId: newRow.class_id,
              author: 'Anonymous Student',
              content: newRow.content,
              createdAt: formatRelativeTime(newRow.created_at),
              replies: [],
              classInfo,
            };
            onDoubtInsert(doubt);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'replies',
        },
        (payload) => {
          const newRow = payload.new;
          if (newRow) {
            const reply: Reply = {
              id: newRow.id,
              doubtId: newRow.doubt_id,
              author: 'Anonymous Student',
              content: newRow.content,
              createdAt: formatRelativeTime(newRow.created_at),
            };
            onReplyInsert(reply);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('[All Doubts Realtime] Subscription status:', status);
      });
  }

  // 3. Browser BroadcastChannel (<1ms cross-tab sync)
  let bc: any = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel('sgsits_ask_global');
      bc.onmessage = (event: any) => {
        if (event.data?.type === 'NEW_DOUBT' && event.data.payload) {
          const classInfo = OOP_CLASSES.find((c) => c.id === event.data.payload.classId);
          onDoubtInsert({ ...event.data.payload, classInfo });
        } else if (event.data?.type === 'NEW_REPLY' && event.data.payload?.reply) {
          onReplyInsert(event.data.payload.reply);
        }
      };
    } catch {}
  }

  return () => {
    if (client && allChannel) {
      client.removeChannel(allChannel);
    }
    if (bc) {
      bc.close();
    }
  };
}
