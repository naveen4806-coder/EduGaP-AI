-- ============================================================================
-- EdUGaP AI Seed Data
-- ============================================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111001', 'admin', 'System Administrator'),
('11111111-1111-1111-1111-111111111002', 'hod', 'Head of Department with institutional oversight'),
('11111111-1111-1111-1111-111111111003', 'staff', 'Teaching Staff & Assessment Authors'),
('11111111-1111-1111-1111-111111111004', 'student', 'Learners taking assessments and following study plans')
ON CONFLICT (name) DO NOTHING;

-- Departments
INSERT INTO departments (id, name, code, description) VALUES
('22222222-2222-2222-2222-222222222001', 'Mathematics & Computational Sciences', 'MATH-DEPT', 'Department responsible for Secondary & Higher Secondary Mathematics education')
ON CONFLICT (code) DO NOTHING;

-- Institutional Leadership, Faculty & Enrolled Student Profiles
INSERT INTO profiles (id, email, full_name, role, department_id, is_active) VALUES
('33333333-3333-3333-3333-333333333001', 'hod@edugap.ai', 'Dr. Aris Thorne (HOD)', 'hod', '22222222-2222-2222-2222-222222222001', true),
('33333333-3333-3333-3333-333333333002', 'staff@edugap.ai', 'Prof. Sarah Jenkins', 'staff', '22222222-2222-2222-2222-222222222001', true),
('33333333-3333-3333-3333-333333333003', 'student@edugap.ai', 'Alex Rivera', 'student', '22222222-2222-2222-2222-222222222001', true),
('33333333-3333-3333-3333-333333333004', 'marcus.vance@student.edugap.ai', 'Marcus Vance', 'student', '22222222-2222-2222-2222-222222222001', true),
('33333333-3333-3333-3333-333333333005', 'elena.rostova@student.edugap.ai', 'Elena Rostova', 'student', '22222222-2222-2222-2222-222222222001', true)
ON CONFLICT (email) DO NOTHING;

-- Classes
INSERT INTO classes (id, department_id, name, grade_level, academic_year) VALUES
('44444444-4444-4444-4444-444444444001', '22222222-2222-2222-2222-222222222001', 'Grade 10 - Section A', 'Grade 10', '2026-2027'),
('44444444-4444-4444-4444-444444444002', '22222222-2222-2222-2222-222222222001', 'Grade 10 - Section B', 'Grade 10', '2026-2027')
ON CONFLICT DO NOTHING;

-- Subjects
INSERT INTO subjects (id, department_id, name, code, description) VALUES
('55555555-5555-5555-5555-555555555001', '22222222-2222-2222-2222-222222222001', 'Grade 10 Mathematics', 'MATH10', 'Core secondary mathematics covering Real Numbers, Polynomials, Linear Equations, Quadratic Equations, and Trigonometry')
ON CONFLICT (code) DO NOTHING;

-- Enrollments
INSERT INTO enrollments (student_id, class_id, academic_year, status) VALUES
('33333333-3333-3333-3333-333333333003', '44444444-4444-4444-4444-444444444001', '2026-2027', 'active'),
('33333333-3333-3333-3333-333333333004', '44444444-4444-4444-4444-444444444001', '2026-2027', 'active'),
('33333333-3333-3333-3333-333333333005', '44444444-4444-4444-4444-444444444001', '2026-2027', 'active')
ON CONFLICT DO NOTHING;

-- Staff Assignments
INSERT INTO staff_assignments (staff_id, class_id, subject_id, department_id) VALUES
('33333333-3333-3333-3333-333333333002', '44444444-4444-4444-4444-444444444001', '55555555-5555-5555-5555-555555555001', '22222222-2222-2222-2222-222222222001')
ON CONFLICT DO NOTHING;

-- Resource Files (Syllabus & Past Papers)
INSERT INTO resource_files (id, title, subject_id, uploader_id, file_url, file_name, file_type, file_size, status, extracted_text) VALUES
('66666666-6666-6666-6666-666666666001', 'Grade 10 Mathematics Complete Curriculum & Learning Objectives', '55555555-5555-5555-5555-555555555001', '33333333-3333-3333-3333-333333333002', 'https://storage.edugap.ai/resources/grade10_math_syllabus.pdf', 'grade10_math_syllabus.pdf', 'application/pdf', 245760, 'processed',
'Unit 1: Number Systems - Real Numbers, Euclid division lemma, Fundamental Theorem of Arithmetic.
Unit 2: Algebra - Polynomials (zeros, relationship between zeros and coefficients). Pair of Linear Equations in Two Variables (graphical and algebraic solutions by substitution, elimination). Quadratic Equations (roots by factorization, quadratic formula, nature of discriminant). Arithmetic Progressions.
Unit 3: Coordinate Geometry - Distance formula, section formula.
Unit 4: Geometry - Triangles, Circles.
Unit 5: Trigonometry - Introduction to trigonometric ratios, identities, heights and distances.
Unit 6: Statistics and Probability - Mean, median, mode of grouped data; simple probability problems.'),
('66666666-6666-6666-6666-666666666002', 'Previous Year Algebra & Quadratic Equations Question Bank', '55555555-5555-5555-5555-555555555001', '33333333-3333-3333-3333-333333333002', 'https://storage.edugap.ai/resources/pyq_algebra_2025.pdf', 'pyq_algebra_2025.pdf', 'application/pdf', 389120, 'processed',
'Key examination questions focusing on algebraic manipulation, word problems involving speed and time converted to quadratics, and solving systems of linear equations.')
ON CONFLICT DO NOTHING;

-- Assessments (Algebra Assessment with MCQ, Short Answer, Descriptive)
INSERT INTO assessments (id, title, subject_id, class_id, creator_id, topic, duration_minutes, total_marks, pass_percentage, due_date, learning_objective, status) VALUES
('77777777-7777-7777-7777-777777777001', 'Unit Diagnostic: Algebra & Linear Equations Mastery', '55555555-5555-5555-5555-555555555001', '44444444-4444-4444-4444-444444444001', '33333333-3333-3333-3333-333333333002', 'Linear Equations and Polynomials', 45, 50.00, 50.00, now() + interval '7 days', 'Evaluate conceptual understanding of linear systems, algebraic substitution, and multi-step real-world word problems.', 'published')
ON CONFLICT DO NOTHING;

-- Questions for Algebra Assessment
INSERT INTO questions (id, assessment_id, question_text, question_type, options, correct_answer, marks, difficulty, topic_tags, explanation, rubric, order_index) VALUES
('88888888-8888-8888-8888-888888888001', '77777777-7777-7777-7777-777777777001',
'If a pair of linear equations is consistent and independent, then the lines representing them are:',
'multiple_choice',
'[{"id": "A", "text": "Parallel"}, {"id": "B", "text": "Intersecting at a unique point"}, {"id": "C", "text": "Coincident"}, {"id": "D", "text": "Perpendicular only"}]'::jsonb,
'B', 5.00, 'easy', ARRAY['Linear Equations', 'Geometry of Equations'],
'A consistent and independent pair of linear equations has exactly one unique solution, which means their graphical representations intersect at a single point.',
NULL, 1),

('88888888-8888-8888-8888-888888888002', '77777777-7777-7777-7777-777777777001',
'What is the discriminant of the quadratic equation 2x^2 - 4x + 3 = 0, and what does it tell you about the nature of the roots?',
'short_answer',
NULL,
'-8, roots are complex or no real roots',
10.00, 'medium', ARRAY['Quadratic Equations', 'Discriminant'],
'Discriminant D = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
'{"key_components": ["Calculates D = -8", "Identifies no real roots or complex roots"]}'::jsonb, 2),

('88888888-8888-8888-8888-888888888003', '77777777-7777-7777-7777-777777777001',
'For which value of k will the system of equations (k - 1)x + 3y = 2 and 6x + (1 - 2k)y = 6 have infinitely many solutions?',
'multiple_choice',
'[{"id": "A", "text": "k = -1"}, {"id": "B", "text": "k = 2"}, {"id": "C", "text": "k = -2"}, {"id": "D", "text": "No such value exists"}]'::jsonb,
'C', 10.00, 'hard', ARRAY['Linear Equations', 'System Consistency'],
'For infinitely many solutions, (k-1)/6 = 3/(1-2k) = 2/6 = 1/3. Setting (k-1)/6 = 1/3 yields k - 1 = 2 => k = 3. But 3/(1 - 2*3) = 3/(-5) != 1/3. Hence, no single value of k satisfies all conditions simultaneously.',
NULL, 3),

('88888888-8888-8888-8888-888888888004', '77777777-7777-7777-7777-777777777001',
'A boat travels 30 km upstream and 44 km downstream in 10 hours. In 13 hours, it can travel 40 km upstream and 55 km downstream. Formulate the algebraic equations, describe step-by-step how you solve for the speed of the stream and the speed of the boat in still water, and state your final answers clearly with units.',
'descriptive',
NULL,
'Speed of boat = 8 km/h, Speed of stream = 3 km/h',
25.00, 'hard', ARRAY['Linear Equations', 'Word Problems', 'Upstream-Downstream'],
'Let speed of boat in still water be x km/h and speed of stream be y km/h. Speed upstream = x - y, downstream = x + y.
Let u = 1/(x-y) and v = 1/(x+y).
Equation 1: 30u + 44v = 10
Equation 2: 40u + 55v = 13
Multiplying Eq 1 by 4 and Eq 2 by 3:
120u + 176v = 40
120u + 165v = 39
Subtracting gives 11v = 1 => v = 1/11.
Substituting v: 30u + 4 = 10 => 30u = 6 => u = 1/5.
So x - y = 5 and x + y = 11.
Adding: 2x = 16 => x = 8 km/h.
Subtracting: 2y = 6 => y = 3 km/h.',
'{"rubric": {"clarity": 6.25, "relevance": 6.25, "grammar": 6.25, "topic_understanding": 6.25}}'::jsonb, 4)
ON CONFLICT DO NOTHING;

-- Pre-seed an attempt for Marcus Vance (student 4, showing high risk with integrity events)
INSERT INTO attempts (id, assessment_id, student_id, start_time, submitted_at, total_score, percentage, status, integrity_violation_count, overall_feedback) VALUES
('99999999-9999-9999-9999-999999999001', '77777777-7777-7777-7777-777777777001', '33333333-3333-3333-3333-333333333004', now() - interval '2 days', now() - interval '2 days' + interval '35 minutes', 18.00, 36.00, 'graded', 4, 'Significant conceptual gaps in Quadratic Discriminants and Multi-step Word Problems. Multiple integrity incidents noted.')
ON CONFLICT DO NOTHING;

-- Integrity events for Marcus
INSERT INTO integrity_events (assessment_id, attempt_id, student_id, event_type, details, severity) VALUES
('77777777-7777-7777-7777-777777777001', '99999999-9999-9999-9999-999999999001', '33333333-3333-3333-3333-333333333004', 'tab_switch', '{"message": "User switched out of the exam tab to external application", "duration_seconds": 14}'::jsonb, 'warning'),
('77777777-7777-7777-7777-777777777001', '99999999-9999-9999-9999-999999999001', '33333333-3333-3333-3333-333333333004', 'copy_attempt', '{"message": "Attempted to copy Question 4 descriptive prompt"}'::jsonb, 'violation'),
('77777777-7777-7777-7777-777777777001', '99999999-9999-9999-9999-999999999001', '33333333-3333-3333-3333-333333333004', 'fullscreen_exit', '{"message": "Student exited fullscreen examination enclosure"}'::jsonb, 'warning'),
('77777777-7777-7777-7777-777777777001', '99999999-9999-9999-9999-999999999001', '33333333-3333-3333-3333-333333333004', 'paste_attempt', '{"message": "Attempted to paste clipboard content into descriptive answer area"}'::jsonb, 'violation')
ON CONFLICT DO NOTHING;

-- Pre-seed student feature snapshots & MLP risk predictions
INSERT INTO student_feature_snapshots (id, student_id, previous_assessment_avg, recent_assessment_score, topic_wise_accuracy, quiz_completion_rate, attendance_percentage, assignment_completion_rate, study_session_completion_rate, avg_daily_study_time_minutes, late_submissions_count, integrity_events_count, weak_topics_count, assessment_attempt_count) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '33333333-3333-3333-3333-333333333003', 78.50, 82.00, 80.00, 95.00, 94.00, 90.00, 85.00, 75.00, 0, 0, 1, 6),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '33333333-3333-3333-3333-333333333004', 42.00, 36.00, 38.00, 55.00, 68.00, 48.00, 30.00, 20.00, 4, 4, 4, 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '33333333-3333-3333-3333-333333333005', 91.50, 94.00, 93.00, 100.00, 98.00, 96.00, 92.00, 110.00, 0, 0, 0, 8)
ON CONFLICT DO NOTHING;

INSERT INTO risk_predictions (student_id, snapshot_id, risk_level, confidence_score, low_risk_prob, medium_risk_prob, high_risk_prob, top_risk_factors, model_version) VALUES
('33333333-3333-3333-3333-333333333003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'low', 0.8850, 0.8850, 0.0950, 0.0200, '["Consistent study routine", "High assessment completion rate"]'::jsonb, 'v1.0-mlp'),
('33333333-3333-3333-3333-333333333004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'high', 0.9120, 0.0210, 0.0670, 0.9120, '["Low attendance (68%)", "4 late submissions", "High integrity event count", "Low quiz completion (55%)"]'::jsonb, 'v1.0-mlp'),
('33333333-3333-3333-3333-333333333005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'low', 0.9740, 0.9740, 0.0220, 0.0040, '["Near-perfect attendance", "Above 90% topic mastery"]'::jsonb, 'v1.0-mlp')
ON CONFLICT DO NOTHING;

-- Active Curriculum Study Plan for Alex Rivera
INSERT INTO study_plans (id, student_id, start_date, end_date, school_end_time, commute_time_mins, extracurriculars, preferred_study_time, available_days, exam_goals) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333003', CURRENT_DATE, CURRENT_DATE + interval '30 days', '15:30', 30, 'Basketball on Tuesdays and Thursdays', '18:00 - 20:00', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'Score 90%+ in Mid-term Algebra and Polynomials')
ON CONFLICT DO NOTHING;

-- Pre-seed Study Sessions
INSERT INTO study_sessions (study_plan_id, student_id, subject, topic, day_of_week, start_time, duration_mins, is_completed, completed_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333003', 'Grade 10 Mathematics', 'Linear Equations Substitution Method', 'Monday', '18:30', 45, true, now() - interval '3 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333003', 'Grade 10 Mathematics', 'Discriminant & Nature of Quadratic Roots', 'Wednesday', '18:30', 45, true, now() - interval '1 day'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333003', 'Grade 10 Mathematics', 'Algebraic Word Problems (Upstream & Downstream)', 'Friday', '18:30', 60, false, NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333003', 'Grade 10 Mathematics', 'Revision and Mixed Practice Test', 'Saturday', '10:00', 60, false, NULL)
ON CONFLICT DO NOTHING;

-- Pre-seed AI Recommendations
INSERT INTO ai_recommendations (student_id, topic, recommendation_text, priority, suggested_duration_mins) VALUES
('33333333-3333-3333-3333-333333333003', 'Linear Equations', 'You need to strengthen Linear Equations. Practice for 20 minutes tomorrow on substitution methods.', 'high', 20),
('33333333-3333-3333-3333-333333333003', 'Quadratic Discriminants', 'Review negative discriminant interpretations to avoid misclassifying real vs complex roots.', 'medium', 15)
ON CONFLICT DO NOTHING;

-- Pre-seed Audit Logs for HOD Oversight
INSERT INTO audit_logs (actor_id, action, target_type, reason, created_at) VALUES
('33333333-3333-3333-3333-333333333001', 'APPROVE_STAFF_ASSIGNMENT', 'staff_assignments', 'Assigned Prof. Sarah Jenkins to Grade 10 Section A Mathematics curriculum', now() - interval '10 days'),
('33333333-3333-3333-3333-333333333001', 'PUBLISH_CURRICULUM_AUDIT', 'departments', 'Conducted Term 1 curriculum pacing and assessment alignment review', now() - interval '5 days')
ON CONFLICT DO NOTHING;
