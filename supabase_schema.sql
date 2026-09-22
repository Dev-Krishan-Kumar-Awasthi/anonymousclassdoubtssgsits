-- ==============================================================================
-- SGSITS Ask — Phase 1 MVP Database Schema
-- Supabase PostgreSQL + Realtime
-- ==============================================================================

-- 1. Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Lecture', 'Laboratory')),
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT NOT NULL,
    section_or_batch TEXT NOT NULL,
    teacher TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create doubts table
CREATE TABLE IF NOT EXISTS public.doubts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id TEXT NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doubt_id UUID NOT NULL REFERENCES public.doubts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Phase 1 MVP (Public Anonymous Access without Auth)
-- Classes: Read-only for all
DROP POLICY IF EXISTS "Public can view classes" ON public.classes;
CREATE POLICY "Public can view classes" ON public.classes
    FOR SELECT USING (true);

-- Doubts: Public read & insert
DROP POLICY IF EXISTS "Public can view doubts" ON public.doubts;
CREATE POLICY "Public can view doubts" ON public.doubts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert doubts" ON public.doubts;
CREATE POLICY "Public can insert doubts" ON public.doubts
    FOR INSERT WITH CHECK (char_length(trim(content)) > 0);

-- Replies: Public read & insert
DROP POLICY IF EXISTS "Public can view replies" ON public.replies;
CREATE POLICY "Public can view replies" ON public.replies
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert replies" ON public.replies;
CREATE POLICY "Public can insert replies" ON public.replies
    FOR INSERT WITH CHECK (char_length(trim(content)) > 0);

-- 6. Enable Supabase Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.doubts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.replies;

-- 7. Seed Authoritative OOP Timetable Classes
INSERT INTO public.classes (id, subject, type, day, time, room, section_or_batch, teacher)
VALUES
    ('oop-monday-11', 'Object Oriented Programming', 'Lecture', 'Monday', '11:00 AM – 12:00 PM', 'ATC-301', 'Section B', 'US'),
    ('oop-lab-monday-b3', 'Object Oriented Programming Laboratory', 'Laboratory', 'Monday', '2:00 PM – 4:00 PM', 'Lab 207', 'Batch B3', 'US / VM'),
    ('oop-lab-wednesday-b1', 'Object Oriented Programming Laboratory', 'Laboratory', 'Wednesday', '10:00 AM – 12:00 PM', 'Lab 207', 'Batch B1', 'US / VM'),
    ('oop-wednesday-4', 'Object Oriented Programming', 'Lecture', 'Wednesday', '4:00 PM – 5:00 PM', 'LT-002', 'Section B', 'US'),
    ('oop-thursday-11', 'Object Oriented Programming', 'Lecture', 'Thursday', '11:00 AM – 12:00 PM', 'ATC-309', 'Section B', 'US'),
    ('oop-lab-friday-b2', 'Object Oriented Programming Laboratory', 'Laboratory', 'Friday', '4:00 PM – 6:00 PM', 'Lab 207', 'Batch B2', 'US / VM')
ON CONFLICT (id) DO UPDATE SET
    subject = EXCLUDED.subject,
    type = EXCLUDED.type,
    day = EXCLUDED.day,
    time = EXCLUDED.time,
    room = EXCLUDED.room,
    section_or_batch = EXCLUDED.section_or_batch,
    teacher = EXCLUDED.teacher;

-- 8. Seed Realistic Demo Doubts
DO $$
DECLARE
    d1 UUID;
    d2 UUID;
    d3 UUID;
    d4 UUID;
    d5 UUID;
BEGIN
    -- Check if doubts already exist to avoid duplicate seeding
    IF NOT EXISTS (SELECT 1 FROM public.doubts WHERE class_id = 'oop-monday-11') THEN
        INSERT INTO public.doubts (class_id, content, created_at)
        VALUES ('oop-monday-11', 'What is the difference between method overloading and overriding in Java?', NOW() - INTERVAL '15 minutes')
        RETURNING id INTO d1;

        INSERT INTO public.doubts (class_id, content, created_at)
        VALUES ('oop-monday-11', 'Why do we need constructors if default constructor is automatically created by the compiler?', NOW() - INTERVAL '12 minutes')
        RETURNING id INTO d2;

        INSERT INTO public.doubts (class_id, content, created_at)
        VALUES ('oop-monday-11', 'Can someone explain polymorphism with a simple real-life example?', NOW() - INTERVAL '9 minutes')
        RETURNING id INTO d3;

        INSERT INTO public.doubts (class_id, content, created_at)
        VALUES ('oop-monday-11', 'What is the difference between a class and an object?', NOW() - INTERVAL '6 minutes')
        RETURNING id INTO d4;

        INSERT INTO public.doubts (class_id, content, created_at)
        VALUES ('oop-monday-11', 'Why is multiple inheritance through classes not supported in Java?', NOW() - INTERVAL '3 minutes')
        RETURNING id INTO d5;

        -- Seed Replies
        INSERT INTO public.replies (doubt_id, content, created_at)
        VALUES
            (d1, 'Overloading happens within the same class with different parameters (compile-time), while overriding redefines a method in a subclass (runtime).', NOW() - INTERVAL '13 minutes'),
            (d1, 'Overloading uses different method signatures. Overriding requires the exact same signature.', NOW() - INTERVAL '10 minutes'),
            (d2, 'Parameterized constructors allow initializing instance variables with specific values during instantiation.', NOW() - INTERVAL '11 minutes'),
            (d3, 'A person behaves as a student in college, a customer at a store, and a passenger on a bus. One entity taking multiple forms.', NOW() - INTERVAL '7 minutes'),
            (d4, 'A class is the blueprint in memory; an object is an actual instance created in the heap with "new".', NOW() - INTERVAL '4 minutes'),
            (d5, 'To avoid the Diamond Problem ambiguity. Java supports multiple inheritance through interfaces instead.', NOW() - INTERVAL '1 minute');
    END IF;
END $$;
