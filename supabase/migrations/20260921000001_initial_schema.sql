-- ============================================================================
-- EdUGaP AI Database Migration: Initial Schema & Row Level Security
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Definitions
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('student', 'staff', 'hod', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE assessment_status_type AS ENUM ('draft', 'published', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE question_type_enum AS ENUM ('multiple_choice', 'short_answer', 'descriptive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_type AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE integrity_event_enum AS ENUM (
        'tab_switch',
        'window_blur',
        'fullscreen_exit',
        'copy_attempt',
        'paste_attempt',
        'right_click',
        'key_shortcut',
        'multiple_devices'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name user_role_type UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Profiles (extending auth.users or standalone for demo compatibility)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL DEFAULT 'student',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Enrollments (Student to Class)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(student_id, class_id, academic_year)
);

-- 7. Staff Assignments (Staff to Subject and Class)
CREATE TABLE IF NOT EXISTS staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(staff_id, class_id, subject_id)
);

-- 8. Resource Files
CREATE TABLE IF NOT EXISTS resource_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'processed' NOT NULL,
    extracted_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    topic VARCHAR(255) NOT NULL,
    duration_minutes INTEGER DEFAULT 60 NOT NULL,
    total_marks NUMERIC(6,2) DEFAULT 100.00 NOT NULL,
    pass_percentage NUMERIC(5,2) DEFAULT 40.00 NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    learning_objective TEXT,
    status assessment_status_type DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. Questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type question_type_enum NOT NULL,
    options JSONB, -- For multiple choice: [{"id": "A", "text": "..."}, ...]
    correct_answer TEXT, -- For MCQ or short answer
    marks NUMERIC(5,2) DEFAULT 1.00 NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'medium' NOT NULL,
    topic_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    explanation TEXT,
    rubric JSONB, -- For descriptive evaluation: criteria and scoring guidelines
    order_index INTEGER DEFAULT 0 NOT NULL
);

-- 11. Assessment Assignments (Specific assignments per student)
CREATE TABLE IF NOT EXISTS assessment_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    due_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'assigned' NOT NULL, -- assigned, in_progress, completed, overdue
    UNIQUE(assessment_id, student_id)
);

-- 12. Attempts
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    end_time TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    total_score NUMERIC(6,2) DEFAULT 0.00,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL, -- in_progress, submitted, graded
    integrity_violation_count INTEGER DEFAULT 0 NOT NULL,
    overall_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 13. Answers
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    student_response TEXT,
    is_correct BOOLEAN,
    score_awarded NUMERIC(5,2) DEFAULT 0.00,
    clarity_score NUMERIC(5,2),
    relevance_score NUMERIC(5,2),
    grammar_score NUMERIC(5,2),
    topic_understanding_score NUMERIC(5,2),
    ai_feedback TEXT,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(attempt_id, question_id)
);

-- 14. Integrity Events
CREATE TABLE IF NOT EXISTS integrity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    event_type integrity_event_enum NOT NULL,
    event_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    severity VARCHAR(20) DEFAULT 'warning' NOT NULL
);

-- 15. Study Plans
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    school_end_time VARCHAR(10) DEFAULT '15:30',
    commute_time_mins INTEGER DEFAULT 45,
    extracurriculars TEXT,
    preferred_study_time VARCHAR(20) DEFAULT 'evening',
    available_days TEXT[] DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    exam_goals TEXT,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 16. Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    duration_mins INTEGER DEFAULT 45 NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ
);

-- 17. AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
    topic VARCHAR(150) NOT NULL,
    recommendation_text TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' NOT NULL,
    suggested_duration_mins INTEGER DEFAULT 25,
    is_acted_upon BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 18. Student Feature Snapshots (Input for MLP)
CREATE TABLE IF NOT EXISTS student_feature_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    previous_assessment_avg NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    recent_assessment_score NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    topic_wise_accuracy NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    quiz_completion_rate NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    attendance_percentage NUMERIC(5,2) DEFAULT 100.00 NOT NULL,
    assignment_completion_rate NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    study_session_completion_rate NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    avg_daily_study_time_minutes NUMERIC(6,2) DEFAULT 0.00 NOT NULL,
    late_submissions_count INTEGER DEFAULT 0 NOT NULL,
    integrity_events_count INTEGER DEFAULT 0 NOT NULL,
    weak_topics_count INTEGER DEFAULT 0 NOT NULL,
    assessment_attempt_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 19. Risk Predictions
CREATE TABLE IF NOT EXISTS risk_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    snapshot_id UUID REFERENCES student_feature_snapshots(id) ON DELETE CASCADE,
    risk_level risk_level_type NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL,
    low_risk_prob NUMERIC(5,4) NOT NULL,
    medium_risk_prob NUMERIC(5,4) NOT NULL,
    high_risk_prob NUMERIC(5,4) NOT NULL,
    top_risk_factors JSONB DEFAULT '[]'::jsonb,
    model_version VARCHAR(50) DEFAULT 'v1.0-mlp' NOT NULL,
    model_limitation_notice TEXT DEFAULT 'Risk predictions are advisory screening signals only and must not be used as the sole basis for grades, punitive actions, or academic dismissal.' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id UUID,
    before_state JSONB,
    after_state JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 21. Notification Tokens (FCM)
CREATE TABLE IF NOT EXISTS notification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    platform VARCHAR(50) DEFAULT 'web' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_feature_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role_type AS $$
    SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can view their own profile, staff/HOD can view relevant profiles
CREATE POLICY "Profiles are viewable by owner or staff/HOD"
ON profiles FOR SELECT
USING (
    user_id = auth.uid() OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

CREATE POLICY "Profiles are updatable by owner or HOD"
ON profiles FOR UPDATE
USING (
    user_id = auth.uid() OR
    current_user_role() IN ('hod', 'admin')
);

-- Assessments: Students see published assessments, Staff see created/assigned, HOD sees department
CREATE POLICY "Students see published assessments, Staff and HOD see all"
ON assessments FOR SELECT
USING (
    (current_user_role() = 'student' AND status = 'published') OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

CREATE POLICY "Staff and HOD manage assessments"
ON assessments FOR ALL
USING (
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Attempts: Students access own attempts, Staff and HOD view attempts
CREATE POLICY "Students manage own attempts"
ON attempts FOR ALL
USING (
    student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Answers: Students see their answers, Staff/HOD see answers
CREATE POLICY "Answers accessible by student or staff"
ON answers FOR ALL
USING (
    attempt_id IN (
        SELECT id FROM attempts WHERE student_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    ) OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Integrity Events: Insertable during attempt, readable by staff and HOD
CREATE POLICY "Integrity events insertable by attempt owner, viewable by staff/HOD"
ON integrity_events FOR ALL
USING (
    student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Study Plans: Students manage their own study plans, Staff/HOD view
CREATE POLICY "Study plans managed by student"
ON study_plans FOR ALL
USING (
    student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Study Sessions: Managed by student
CREATE POLICY "Study sessions managed by student"
ON study_sessions FOR ALL
USING (
    student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Risk Predictions: Visible to Staff and HOD
CREATE POLICY "Risk predictions visible to staff and HOD"
ON risk_predictions FOR SELECT
USING (
    current_user_role() IN ('staff', 'hod', 'admin')
);

-- Audit Logs: Insertable by system/HOD, readable by HOD
CREATE POLICY "Audit logs visible to HOD"
ON audit_logs FOR SELECT
USING (
    current_user_role() IN ('hod', 'admin')
);

-- Storage Buckets Configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('student-submissions', 'student-submissions', false)
ON CONFLICT (id) DO NOTHING;
