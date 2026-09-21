// ============================================================================
// EdUGaP AI - In-Memory & Local Persistent State Store
// Supports instant zero-config full-stack evaluation with pre-seeded data
// ============================================================================

import {
  Department,
  Profile,
  ClassEntity,
  Subject,
  ResourceFile,
  Assessment,
  Question,
  Attempt,
  Answer,
  IntegrityEvent,
  StudyPlan,
  StudySession,
  AIRecommendation,
  RiskPrediction,
  AuditLog,
  StudentFeatureSnapshot,
} from '@/lib/types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: '22222222-2222-2222-2222-222222222001',
    name: 'Mathematics & Computational Sciences',
    code: 'MATH-DEPT',
    description: 'Secondary & Higher Secondary Mathematics curriculum',
    createdAt: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222002',
    name: 'Natural Sciences & Physics',
    code: 'SCI-DEPT',
    description: 'Physics, Chemistry, and Biological Sciences',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_CLASSES: ClassEntity[] = [
  {
    id: '44444444-4444-4444-4444-444444444001',
    departmentId: '22222222-2222-2222-2222-222222222001',
    name: 'Grade 10 - Section A',
    gradeLevel: 'Grade 10',
    academicYear: '2026-2027',
    createdAt: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444002',
    departmentId: '22222222-2222-2222-2222-222222222001',
    name: 'Grade 10 - Section B',
    gradeLevel: 'Grade 10',
    academicYear: '2026-2027',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: '55555555-5555-5555-5555-555555555001',
    departmentId: '22222222-2222-2222-2222-222222222001',
    name: 'Grade 10 Mathematics',
    code: 'MATH10',
    description: 'Real Numbers, Polynomials, Linear Equations, Quadratic Equations, and Trigonometry',
    createdAt: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555002',
    departmentId: '22222222-2222-2222-2222-222222222001',
    name: 'Advanced Linear Algebra',
    code: 'MATH12-ALG',
    description: 'Matrices, Vector Spaces, and Determinants',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: '33333333-3333-3333-3333-333333333001',
    email: 'hod@edugap.ai',
    fullName: 'Dr. Aris Thorne',
    role: 'hod',
    departmentId: '22222222-2222-2222-2222-222222222001',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333002',
    email: 'staff@edugap.ai',
    fullName: 'Prof. Sarah Jenkins',
    role: 'staff',
    departmentId: '22222222-2222-2222-2222-222222222001',
    isActive: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333003',
    email: 'student@edugap.ai',
    fullName: 'Alex Rivera',
    role: 'student',
    departmentId: '22222222-2222-2222-2222-222222222001',
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333004',
    email: 'marcus.vance@student.edugap.ai',
    fullName: 'Marcus Vance',
    role: 'student',
    departmentId: '22222222-2222-2222-2222-222222222001',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333005',
    email: 'elena.rostova@student.edugap.ai',
    fullName: 'Elena Rostova',
    role: 'student',
    departmentId: '22222222-2222-2222-2222-222222222001',
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const INITIAL_RESOURCES: ResourceFile[] = [
  {
    id: '66666666-6666-6666-6666-666666666001',
    title: 'Grade 10 Mathematics Syllabus & Term Standards',
    subjectId: '55555555-5555-5555-5555-555555555001',
    uploaderId: '33333333-3333-3333-3333-333333333002',
    uploaderName: 'Prof. Sarah Jenkins',
    fileUrl: '/resources/grade10_math_syllabus.pdf',
    fileName: 'grade10_math_syllabus.pdf',
    fileType: 'application/pdf',
    fileSize: 245760,
    status: 'processed',
    extractedText: `Unit 1: Number Systems - Real Numbers, Euclid division lemma, Fundamental Theorem of Arithmetic.
Unit 2: Algebra - Polynomials (zeros, relationship between zeros and coefficients). Pair of Linear Equations in Two Variables (graphical and algebraic solutions by substitution, elimination). Quadratic Equations (roots by factorization, quadratic formula, nature of discriminant). Arithmetic Progressions.
Unit 3: Coordinate Geometry - Distance formula, section formula.
Unit 4: Geometry - Triangles, Circles.
Unit 5: Trigonometry - Introduction to trigonometric ratios, identities, heights and distances.
Unit 6: Statistics and Probability - Mean, median, mode of grouped data; simple probability problems.`,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-666666666002',
    title: 'Previous Year Question Paper - Algebra & Equations 2025',
    subjectId: '55555555-5555-5555-5555-555555555001',
    uploaderId: '33333333-3333-3333-3333-333333333002',
    uploaderName: 'Prof. Sarah Jenkins',
    fileUrl: '/resources/pyq_algebra_2025.pdf',
    fileName: 'pyq_algebra_2025.pdf',
    fileType: 'application/pdf',
    fileSize: 389120,
    status: 'processed',
    extractedText: `Key examination questions focusing on algebraic manipulation, word problems involving speed and time converted to quadratics, and solving systems of linear equations.`,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: '88888888-8888-8888-8888-888888888001',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    questionText: 'If a pair of linear equations is consistent and independent, then the lines representing them are:',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Parallel' },
      { id: 'B', text: 'Intersecting at a unique point' },
      { id: 'C', text: 'Coincident' },
      { id: 'D', text: 'Perpendicular only' },
    ],
    correctAnswer: 'B',
    marks: 5,
    difficulty: 'easy',
    topicTags: ['Linear Equations', 'Geometry of Equations'],
    explanation: 'A consistent and independent system of linear equations has exactly one unique solution, meaning the two graphical lines intersect at exactly one point.',
    orderIndex: 1,
  },
  {
    id: '88888888-8888-8888-8888-888888888002',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    questionText: 'What is the discriminant of the quadratic equation 2x² - 4x + 3 = 0, and what does it indicate regarding the nature of the roots?',
    questionType: 'short_answer',
    correctAnswer: '-8, no real roots',
    marks: 10,
    difficulty: 'medium',
    topicTags: ['Quadratic Equations', 'Discriminant'],
    explanation: 'Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots (two complex roots).',
    rubric: {
      keyPoints: ['Calculates D = -8', 'Mentions no real roots or complex roots'],
    },
    orderIndex: 2,
  },
  {
    id: '88888888-8888-8888-8888-888888888003',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    questionText: 'For which value of k will the system of equations (k - 1)x + 3y = 2 and 6x + (1 - 2k)y = 6 have infinitely many solutions?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'k = -1' },
      { id: 'B', text: 'k = 2' },
      { id: 'C', text: 'k = -2' },
      { id: 'D', text: 'No such value exists' },
    ],
    correctAnswer: 'C',
    marks: 10,
    difficulty: 'hard',
    topicTags: ['Linear Equations', 'System Consistency'],
    explanation: 'For infinitely many solutions, (k-1)/6 = 3/(1-2k) = 2/6 = 1/3. From (k-1)/6 = 1/3 we get k=3. But substituting k=3 into 3/(1-2k) gives 3/-5 != 1/3. Hence no single value of k satisfies all consistency ratios.',
    orderIndex: 3,
  },
  {
    id: '88888888-8888-8888-8888-888888888004',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    questionText: 'A boat travels 30 km upstream and 44 km downstream in 10 hours. In 13 hours, it can travel 40 km upstream and 55 km downstream. Formulate the algebraic equations, solve step-by-step for the speed of the stream and the speed of the boat in still water, and state your final answers with units.',
    questionType: 'descriptive',
    marks: 25,
    difficulty: 'hard',
    topicTags: ['Linear Equations', 'Word Problems', 'Upstream-Downstream'],
    correctAnswer: 'Speed of boat in still water = 8 km/h, Speed of stream = 3 km/h',
    explanation: 'Let boat speed in still water be x km/h and stream speed be y km/h. Speed upstream = x-y, downstream = x+y. Letting u=1/(x-y) and v=1/(x+y), the equations are 30u + 44v = 10 and 40u + 55v = 13. Solving yields u=1/5, v=1/11, so x-y=5 and x+y=11, giving x=8 km/h and y=3 km/h.',
    rubric: {
      clarity: 6.25,
      relevance: 6.25,
      grammar: 6.25,
      topicUnderstanding: 6.25,
      keyPoints: [
        'Formulates upstream and downstream relative speeds',
        'Sets up system of equations correctly',
        'Demonstrates correct algebraic substitution or elimination',
        'Concludes with Boat speed = 8 km/h and Stream speed = 3 km/h',
      ],
    },
    orderIndex: 4,
  },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: '77777777-7777-7777-7777-777777777001',
    title: 'Unit Diagnostic: Algebra & Linear Equations Mastery',
    subjectId: '55555555-5555-5555-5555-555555555001',
    subjectName: 'Grade 10 Mathematics',
    classId: '44444444-4444-4444-4444-444444444001',
    className: 'Grade 10 - Section A',
    creatorId: '33333333-3333-3333-3333-333333333002',
    creatorName: 'Prof. Sarah Jenkins',
    topic: 'Linear Equations and Polynomials',
    durationMinutes: 45,
    totalMarks: 50,
    passPercentage: 50,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    learningObjective: 'Evaluate conceptual understanding of linear systems, algebraic substitution, and multi-step real-world word problems.',
    status: 'published',
    questions: INITIAL_QUESTIONS,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '77777777-7777-7777-7777-777777777002',
    title: 'Diagnostic Quiz: Real Numbers & Euclid Lemma',
    subjectId: '55555555-5555-5555-5555-555555555001',
    subjectName: 'Grade 10 Mathematics',
    classId: '44444444-4444-4444-4444-444444444001',
    className: 'Grade 10 - Section A',
    creatorId: '33333333-3333-3333-3333-333333333002',
    creatorName: 'Prof. Sarah Jenkins',
    topic: 'Number Systems & Fundamental Theorem of Arithmetic',
    durationMinutes: 30,
    totalMarks: 25,
    passPercentage: 60,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    learningObjective: 'Assess proficiency in prime factorization and rational vs irrational proofs.',
    status: 'draft',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  {
    id: '99999999-9999-9999-9999-999999999001',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    assessmentTitle: 'Unit Diagnostic: Algebra & Linear Equations Mastery',
    studentId: '33333333-3333-3333-3333-333333333004', // Marcus Vance (high risk)
    studentName: 'Marcus Vance',
    startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 2 * 86400000 + 35 * 60000).toISOString(),
    totalScore: 18,
    maxScore: 50,
    percentage: 36,
    status: 'graded',
    integrityViolationCount: 4,
    weakTopics: ['Quadratic Equations', 'Linear Equations Word Problems'],
    overallFeedback: 'Significant gaps in Quadratic Discriminants and multi-step word problem formulation. 4 integrity warnings logged during assessment.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '99999999-9999-9999-9999-999999999002',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    assessmentTitle: 'Unit Diagnostic: Algebra & Linear Equations Mastery',
    studentId: '33333333-3333-3333-3333-333333333005', // Elena Rostova (low risk)
    studentName: 'Elena Rostova',
    startTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 1 * 86400000 + 40 * 60000).toISOString(),
    totalScore: 47,
    maxScore: 50,
    percentage: 94,
    status: 'graded',
    integrityViolationCount: 0,
    weakTopics: [],
    overallFeedback: 'Outstanding mathematical reasoning, precise substitution, and clean descriptive derivation.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_INTEGRITY_EVENTS: IntegrityEvent[] = [
  {
    id: 'ie-001',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    attemptId: '99999999-9999-9999-9999-999999999001',
    studentId: '33333333-3333-3333-3333-333333333004',
    studentName: 'Marcus Vance',
    eventType: 'tab_switch',
    eventTime: new Date(Date.now() - 2 * 86400000 + 10 * 60000).toISOString(),
    details: { message: 'Switched out of exam window for 14 seconds' },
    severity: 'warning',
  },
  {
    id: 'ie-002',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    attemptId: '99999999-9999-9999-9999-999999999001',
    studentId: '33333333-3333-3333-3333-333333333004',
    studentName: 'Marcus Vance',
    eventType: 'copy_attempt',
    eventTime: new Date(Date.now() - 2 * 86400000 + 18 * 60000).toISOString(),
    details: { message: 'Attempted to copy Question 4 problem description' },
    severity: 'violation',
  },
  {
    id: 'ie-003',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    attemptId: '99999999-9999-9999-9999-999999999001',
    studentId: '33333333-3333-3333-3333-333333333004',
    studentName: 'Marcus Vance',
    eventType: 'fullscreen_exit',
    eventTime: new Date(Date.now() - 2 * 86400000 + 22 * 60000).toISOString(),
    details: { message: 'Student left full screen mode' },
    severity: 'warning',
  },
  {
    id: 'ie-004',
    assessmentId: '77777777-7777-7777-7777-777777777001',
    attemptId: '99999999-9999-9999-9999-999999999001',
    studentId: '33333333-3333-3333-3333-333333333004',
    studentName: 'Marcus Vance',
    eventType: 'paste_attempt',
    eventTime: new Date(Date.now() - 2 * 86400000 + 30 * 60000).toISOString(),
    details: { message: 'Pasting external clipboard content blocked' },
    severity: 'violation',
  },
];

export const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    studentId: '33333333-3333-3333-3333-333333333003', // Alex Rivera
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    schoolEndTime: '15:30',
    commuteTimeMins: 30,
    extracurriculars: 'Track and field on Tuesdays and Thursdays',
    preferredStudyTime: '18:00 - 20:00',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    examGoals: 'Score 90%+ in Mid-term Mathematics and eliminate Linear Equation gaps',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    sessions: [
      {
        id: 'ss-001',
        studyPlanId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        studentId: '33333333-3333-3333-3333-333333333003',
        subject: 'Grade 10 Mathematics',
        topic: 'Linear Equations: Substitution Method',
        dayOfWeek: 'Monday',
        startTime: '18:30',
        durationMins: 45,
        isCompleted: true,
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'ss-002',
        studyPlanId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        studentId: '33333333-3333-3333-3333-333333333003',
        subject: 'Grade 10 Mathematics',
        topic: 'Quadratic Discriminants and Root Verification',
        dayOfWeek: 'Wednesday',
        startTime: '18:30',
        durationMins: 45,
        isCompleted: true,
        completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'ss-003',
        studyPlanId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        studentId: '33333333-3333-3333-3333-333333333003',
        subject: 'Grade 10 Mathematics',
        topic: 'Word Problems: Speed, Distance, and Upstream/Downstream',
        dayOfWeek: 'Friday',
        startTime: '18:30',
        durationMins: 60,
        isCompleted: false,
      },
      {
        id: 'ss-004',
        studyPlanId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        studentId: '33333333-3333-3333-3333-333333333003',
        subject: 'Grade 10 Mathematics',
        topic: 'Mixed Diagnostic Review & Speed Drills',
        dayOfWeek: 'Saturday',
        startTime: '10:00',
        durationMins: 60,
        isCompleted: false,
      },
    ],
  },
];

export const INITIAL_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'air-001',
    studentId: '33333333-3333-3333-3333-333333333003',
    topic: 'Linear Equations',
    recommendationText: 'You need to strengthen Linear Equations. Practice for 20 minutes tomorrow focusing on reciprocal substitution.',
    priority: 'high',
    suggestedDurationMins: 20,
    isActedUpon: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'air-002',
    studentId: '33333333-3333-3333-3333-333333333003',
    topic: 'Quadratic Equations',
    recommendationText: 'Review discriminant formulas (b² - 4ac) to reinforce recognition of non-real complex roots.',
    priority: 'medium',
    suggestedDurationMins: 15,
    isActedUpon: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_RISK_PREDICTIONS: RiskPrediction[] = [
  {
    studentId: '33333333-3333-3333-3333-333333333003',
    studentName: 'Alex Rivera',
    risk_level: 'Low Risk',
    confidence_score: 0.885,
    probabilities: {
      'Low Risk': 0.885,
      'Medium Risk': 0.095,
      'High Risk': 0.02,
    },
    top_risk_factors: ['Consistent study routine', 'High assessment completion (95%)'],
    model_version: 'v1.0-mlp',
    fallback_used: false,
    model_limitation_notice: 'Advisory screening signal only. Does not determine final grades or disciplinary action.',
    createdAt: new Date().toISOString(),
  },
  {
    studentId: '33333333-3333-3333-3333-333333333004',
    studentName: 'Marcus Vance',
    risk_level: 'High Risk',
    confidence_score: 0.912,
    probabilities: {
      'Low Risk': 0.021,
      'Medium Risk': 0.067,
      'High Risk': 0.912,
    },
    top_risk_factors: [
      'Low attendance (68%)',
      '4 late submissions',
      'High anti-cheat integrity flags (4 events)',
      'Low assessment average (36%)',
    ],
    model_version: 'v1.0-mlp',
    fallback_used: false,
    model_limitation_notice: 'Advisory screening signal only. Does not determine final grades or disciplinary action.',
    createdAt: new Date().toISOString(),
  },
  {
    studentId: '33333333-3333-3333-3333-333333333005',
    studentName: 'Elena Rostova',
    risk_level: 'Low Risk',
    confidence_score: 0.974,
    probabilities: {
      'Low Risk': 0.974,
      'Medium Risk': 0.022,
      'High Risk': 0.004,
    },
    top_risk_factors: ['Near-perfect attendance (98%)', 'Above 90% topic mastery', 'Zero integrity infractions'],
    model_version: 'v1.0-mlp',
    fallback_used: false,
    model_limitation_notice: 'Advisory screening signal only. Does not determine final grades or disciplinary action.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al-001',
    actorId: '33333333-3333-3333-3333-333333333001',
    actorName: 'Dr. Aris Thorne (HOD)',
    action: 'APPROVE_STAFF_ASSIGNMENT',
    targetType: 'staff_assignments',
    reason: 'Assigned Prof. Sarah Jenkins to Grade 10 Section A Mathematics curriculum',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'al-002',
    actorId: '33333333-3333-3333-3333-333333333001',
    actorName: 'Dr. Aris Thorne (HOD)',
    action: 'CURRICULUM_AUDIT_REVIEW',
    targetType: 'departments',
    reason: 'Approved Mid-term Mathematics diagnostic standards and AI rubric weighting',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

// Global in-memory storage manager
class StoreManager {
  departments: Department[] = [...INITIAL_DEPARTMENTS];
  classes: ClassEntity[] = [...INITIAL_CLASSES];
  subjects: Subject[] = [...INITIAL_SUBJECTS];
  profiles: Profile[] = [...INITIAL_PROFILES];
  resources: ResourceFile[] = [...INITIAL_RESOURCES];
  assessments: Assessment[] = [...INITIAL_ASSESSMENTS];
  questions: Question[] = [...INITIAL_QUESTIONS];
  attempts: Attempt[] = [...INITIAL_ATTEMPTS];
  integrityEvents: IntegrityEvent[] = [...INITIAL_INTEGRITY_EVENTS];
  studyPlans: StudyPlan[] = [...INITIAL_STUDY_PLANS];
  aiRecommendations: AIRecommendation[] = [...INITIAL_AI_RECOMMENDATIONS];
  riskPredictions: RiskPrediction[] = [...INITIAL_RISK_PREDICTIONS];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  getProfileByEmail(email: string): Profile | undefined {
    return this.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  addAssessment(assessment: Assessment): Assessment {
    this.assessments.unshift(assessment);
    if (assessment.questions) {
      this.questions.push(...assessment.questions);
    }
    return assessment;
  }

  updateAssessmentStatus(id: string, status: Assessment['status']): Assessment | undefined {
    const item = this.assessments.find((a) => a.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
    }
    return item;
  }

  recordIntegrityEvent(event: Omit<IntegrityEvent, 'id'>): IntegrityEvent {
    const newEvent: IntegrityEvent = {
      ...event,
      id: `ie-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.integrityEvents.unshift(newEvent);

    // Increment count on attempt if exists
    const attempt = this.attempts.find((a) => a.id === event.attemptId);
    if (attempt) {
      attempt.integrityViolationCount += 1;
    }
    return newEvent;
  }

  recordAttempt(attempt: Attempt): Attempt {
    this.attempts.unshift(attempt);
    return attempt;
  }

  addResource(resource: ResourceFile): ResourceFile {
    this.resources.unshift(resource);
    return resource;
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `al-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  toggleStudySession(sessionId: string): boolean {
    for (const plan of this.studyPlans) {
      if (plan.sessions) {
        const session = plan.sessions.find((s) => s.id === sessionId);
        if (session) {
          session.isCompleted = !session.isCompleted;
          session.completedAt = session.isCompleted ? new Date().toISOString() : undefined;
          return session.isCompleted;
        }
      }
    }
    return false;
  }
}

// Global singleton
export const db = new StoreManager();
