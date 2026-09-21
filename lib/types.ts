// ============================================================================
// EdUGaP AI - Core TypeScript Definitions
// ============================================================================

export type UserRole = 'student' | 'staff' | 'hod' | 'admin';

export type AssessmentStatus = 'draft' | 'published' | 'closed' | 'archived';

export type QuestionType = 'multiple_choice' | 'short_answer' | 'descriptive';

export type RiskLevel = 'low' | 'medium' | 'high';

export type IntegrityEventType =
  | 'tab_switch'
  | 'window_blur'
  | 'fullscreen_exit'
  | 'copy_attempt'
  | 'paste_attempt'
  | 'right_click'
  | 'key_shortcut'
  | 'multiple_devices';

// Database Models
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
}

export interface Profile {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  avatarUrl?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ClassEntity {
  id: string;
  departmentId: string;
  name: string;
  gradeLevel: string;
  academicYear: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  status: 'active' | 'graduated' | 'withdrawn';
  enrolledAt: string;
}

export interface StaffAssignment {
  id: string;
  staffId: string;
  classId: string;
  subjectId: string;
  departmentId: string;
  assignedAt: string;
}

export interface ResourceFile {
  id: string;
  title: string;
  subjectId: string;
  uploaderId: string;
  uploaderName?: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  extractedText?: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  creatorId: string;
  creatorName?: string;
  topic: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  dueDate: string;
  learningObjective?: string;
  status: AssessmentStatus;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string; // e.g. "A", "B", "C", "D"
  text: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  correctAnswer?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topicTags: string[];
  explanation?: string;
  rubric?: {
    clarity?: number;
    relevance?: number;
    grammar?: number;
    topicUnderstanding?: number;
    keyPoints?: string[];
  };
  orderIndex: number;
}

export interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  studentId: string;
  assignedAt: string;
  dueDate?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
}

export interface Attempt {
  id: string;
  assessmentId: string;
  assessmentTitle?: string;
  studentId: string;
  studentName?: string;
  startTime: string;
  endTime?: string;
  submittedAt?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: 'in_progress' | 'submitted' | 'graded';
  integrityViolationCount: number;
  overallFeedback?: string;
  weakTopics?: string[];
  createdAt: string;
}

export interface Answer {
  id: string;
  attemptId: string;
  questionId: string;
  studentResponse: string;
  isCorrect?: boolean;
  scoreAwarded: number;
  maxMarks: number;
  clarityScore?: number;
  relevanceScore?: number;
  grammarScore?: number;
  topicUnderstandingScore?: number;
  aiFeedback?: string;
  updatedAt: string;
}

export interface IntegrityEvent {
  id: string;
  assessmentId: string;
  attemptId: string;
  studentId: string;
  studentName?: string;
  eventType: IntegrityEventType;
  eventTime: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'violation';
}

export interface StudyPlan {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  schoolEndTime: string;
  commuteTimeMins: number;
  extracurriculars: string;
  preferredStudyTime: string;
  availableDays: string[];
  examGoals: string;
  status: 'active' | 'completed' | 'archived';
  sessions?: StudySession[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  studyPlanId: string;
  studentId: string;
  subject: string;
  topic: string;
  dayOfWeek: string;
  startTime: string;
  durationMins: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface AIRecommendation {
  id: string;
  studentId: string;
  attemptId?: string;
  topic: string;
  recommendationText: string;
  priority: 'low' | 'medium' | 'high';
  suggestedDurationMins: number;
  isActedUpon: boolean;
  createdAt: string;
}

export interface StudentFeatureSnapshot {
  id?: string;
  studentId?: string;
  previous_assessment_avg: number;
  recent_assessment_score: number;
  topic_wise_accuracy: number;
  quiz_completion_rate: number;
  attendance_percentage: number;
  assignment_completion_rate: number;
  study_session_completion_rate: number;
  avg_daily_study_time_minutes: number;
  late_submissions_count: number;
  integrity_events_count: number;
  weak_topics_count: number;
  assessment_attempt_count: number;
  createdAt?: string;
}

export interface FeatureAttribution {
  feature: string;
  label: string;
  impact_pct: number;
  risk_direction: 'increases_risk' | 'mitigates_risk' | 'neutral';
}

export interface RiskPrediction {
  id?: string;
  studentId: string;
  studentName?: string;
  snapshotId?: string;
  risk_level: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'low' | 'medium' | 'high';
  confidence_score: number;
  probabilities: {
    'Low Risk'?: number;
    'Medium Risk'?: number;
    'High Risk'?: number;
    low?: number;
    medium?: number;
    high?: number;
  };
  top_risk_factors?: string[];
  feature_attributions?: FeatureAttribution[];
  model_version: string;
  production_ready?: boolean;
  fallback_used?: boolean;
  model_limitation_notice: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName?: string;
  action: string;
  targetType: string;
  targetId?: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  reason?: string;
  createdAt: string;
}

export interface NotificationToken {
  id: string;
  userId: string;
  token: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
}
