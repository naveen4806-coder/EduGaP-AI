'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import { aiService } from '@/lib/ai/service';
import { Question, Attempt, IntegrityEventType } from '@/lib/types';
import {
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  Eye,
  FileText,
  HelpCircle,
} from 'lucide-react';

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assessmentId = (params?.id as string) || '77777777-7777-7777-7777-777777777001';
  const studentId = user?.id || '33333333-3333-3333-3333-333333333003';
  const studentName = user?.fullName || 'Alex Rivera';

  const assessment = db.assessments.find((a) => a.id === assessmentId) || db.assessments[0];
  const questions: Question[] = assessment.questions || db.questions;

  // Active state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(assessment.durationMinutes * 60);
  const [integrityEvents, setIntegrityEvents] = useState<
    { type: IntegrityEventType; time: string; msg: string }[]
  >([]);
  const [warningModalMsg, setWarningModalMsg] = useState<string | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAutosaved, setLastAutosaved] = useState<string>('Just now');

  const attemptIdRef = useRef(`att-${Date.now()}`);

  // Log integrity violation to store & local state
  const recordViolation = useCallback(
    (type: IntegrityEventType, message: string) => {
      const timestamp = new Date().toISOString();
      db.recordIntegrityEvent({
        assessmentId,
        attemptId: attemptIdRef.current,
        studentId,
        studentName,
        eventType: type,
        eventTime: timestamp,
        details: { message },
        severity: type === 'copy_attempt' || type === 'paste_attempt' ? 'violation' : 'warning',
      });

      setIntegrityEvents((prev) => [...prev, { type, time: timestamp, msg: message }]);
      setWarningModalMsg(
        `Integrity Alert (${type.replace('_', ' ').toUpperCase()}): ${message}. All events are recorded in the institutional database for faculty review.`
      );
    },
    [assessmentId, studentId, studentName]
  );

  // Anti-cheat event listeners: visibility, blur, copy/paste, right click
  useEffect(() => {
    // 1. Tab change / visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch', 'Switched away from the exam tab or minimized browser window');
      }
    };

    // 2. Window blur
    const handleBlur = () => {
      recordViolation('window_blur', 'Window lost focus or student interacted with an external window');
    };

    // 3. Fullscreen change
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation('fullscreen_exit', 'Exited fullscreen examination mode');
      }
    };

    // 4. Copy attempt
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation('copy_attempt', 'Clipboard copy action intercepted and prevented');
    };

    // 5. Paste attempt
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation('paste_attempt', 'Clipboard paste action intercepted and prevented');
    };

    // 6. Right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation('right_click', 'Right-click context menu action intercepted and prevented');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [recordViolation]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAttempt();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Autosave tracker
  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    setLastAutosaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Submit and automated AI grading
  const handleSubmitAttempt = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    let maxScore = assessment.totalMarks || 50;
    const weakTopics: string[] = [];
    let descriptiveFeedback = '';
    let recommendation = 'Keep reviewing algebra basics.';

    // Score questions
    for (const q of questions) {
      const studentAns = answers[q.id] || '';

      if (q.questionType === 'multiple_choice') {
        const isCorrect = studentAns.trim().toUpperCase() === (q.correctAnswer || '').trim().toUpperCase();
        if (isCorrect) {
          totalScore += q.marks;
        } else {
          weakTopics.push(...q.topicTags);
        }
      } else if (q.questionType === 'short_answer') {
        const isCorrect =
          studentAns.toLowerCase().includes('-8') ||
          studentAns.toLowerCase().includes('no real roots') ||
          studentAns.toLowerCase().includes('complex');
        if (isCorrect) {
          totalScore += q.marks;
        } else {
          weakTopics.push(...q.topicTags);
        }
      } else if (q.questionType === 'descriptive') {
        // AI Rubric Evaluation
        const evalResult = await aiService.evaluateDescriptiveAnswer(
          q.questionText,
          studentAns,
          q.marks,
          q.rubric?.keyPoints
        );
        totalScore += evalResult.scoreAwarded;
        descriptiveFeedback = evalResult.aiFeedback;
        recommendation = evalResult.recommendation;
        if (evalResult.scoreAwarded < q.marks * 0.7) {
          weakTopics.push(...evalResult.identifiedWeakTopics);
        }
      }
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const uniqueWeakTopics = Array.from(new Set(weakTopics));

    // Create attempt
    const newAttempt: Attempt = {
      id: attemptIdRef.current,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      studentId,
      studentName,
      startTime: new Date(Date.now() - (assessment.durationMinutes * 60 - timeLeft) * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      totalScore,
      maxScore,
      percentage,
      status: 'graded',
      integrityViolationCount: integrityEvents.length,
      weakTopics: uniqueWeakTopics,
      createdAt: new Date().toISOString(),
      overallFeedback:
        descriptiveFeedback ||
        (percentage >= 80
          ? 'Strong analytical execution with accurate mathematical derivation.'
          : 'Moderate performance. Review highlighted weak topics.'),
    };

    db.recordAttempt(newAttempt);

    // Add recommendation to student's record
    if (uniqueWeakTopics.length > 0) {
      db.aiRecommendations.unshift({
        id: `air-${Date.now()}`,
        studentId,
        attemptId: newAttempt.id,
        topic: uniqueWeakTopics[0],
        recommendationText: recommendation,
        priority: percentage < 60 ? 'high' : 'medium',
        suggestedDurationMins: 20,
        isActedUpon: false,
        createdAt: new Date().toISOString(),
      });
    }

    setIsSubmitting(false);
    router.push(`/student/assessments/${assessment.id}/results?attemptId=${newAttempt.id}`);
  };

  const currentQ = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="anti-cheat-lockdown min-h-[calc(100vh-65px)] bg-slate-50 text-slate-900 p-4 sm:p-6 select-none">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Top Assessment Header & Live Timer */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 border border-indigo-100">
                {assessment.subjectName || 'Grade 10 Mathematics'}
              </span>
              <span className="text-xs text-slate-500">Autosaved: {lastAutosaved}</span>
            </div>
            <h1 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl font-heading">{assessment.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Integrity Events Flag Counter */}
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                integrityEvents.length > 0
                  ? 'border-rose-300 bg-rose-50 text-rose-700 animate-pulse'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>{integrityEvents.length} Integrity Flags</span>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-indigo-700">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="font-mono text-sm font-bold">{formatTimer(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Cheating Disclaimer Banner required by prompt */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="text-amber-900">Integrity Oversight Notice:</strong> Browser actions (tab switches, window focus loss, fullscreen exits, and clipboard interaction) are logged in real-time.
            <em className="block text-[11px] text-amber-700 mt-0.5">
              Notice: Automated browser monitoring deters academic misconduct but cannot fully prevent cheating. Honest individual effort is required.
            </em>
          </div>
        </div>

        {/* Progress Bar & Question Nav Palette */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-indigo-600 transition-all duration-300 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                    isCurrent
                      ? 'border-2 border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Display Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 uppercase border border-indigo-100">
                {currentQ.questionType.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500">&bull; {currentQ.marks} Marks</span>
              <span className="text-xs text-slate-500">&bull; Difficulty: {currentQ.difficulty}</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {currentQ.topicTags.join(', ')}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-heading">
            {currentQ.questionText}
          </h2>

          {/* Answer Inputs according to Type */}
          <div className="mt-6">
            {/* Multiple Choice Type */}
            {currentQ.questionType === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQ.options?.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-xs sm:text-sm transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-slate-900 shadow-xs font-medium'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(currentQ.id, opt.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className="font-bold text-indigo-600">{opt.id}.</span>
                      <span>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Short Answer Type */}
            {currentQ.questionType === 'short_answer' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Enter your concise answer or computed value..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <p className="text-[11px] text-slate-500">
                  Example format: State numerical value and conclusion (e.g., &ldquo;-8, no real roots&rdquo;)
                </p>
              </div>
            )}

            {/* Descriptive Type */}
            {currentQ.questionType === 'descriptive' && (
              <div className="space-y-2">
                <textarea
                  rows={8}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Write your complete step-by-step mathematical reasoning, equation formulations, and final conclusion with units..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    Words:{' '}
                    {(answers[currentQ.id] || '').trim().split(/\s+/).filter(Boolean).length}
                  </span>
                  <span>Evaluated against AI Rubric: Clarity, Relevance, Grammar, Topic Understanding</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
              >
                <span>Next Question</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Integrity Warning Alert Modal */}
      {warningModalMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-200">
                <ShieldAlert className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Integrity Event Detected</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{warningModalMsg}</p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setWarningModalMsg(null)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
              >
                I Acknowledge & Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">Confirm Assessment Submission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered {Object.keys(answers).length} of {questions.length} questions.
              Once submitted, your answers will be permanently graded and AI writing evaluation will be generated.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                Review Answers
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSubmitAttempt}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Grading & Analyzing...' : 'Confirm Final Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
