'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
} from 'lucide-react';

function AssessmentResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const assessmentId = (params?.id as string) || '77777777-7777-7777-7777-777777777001';
  const attemptId = searchParams.get('attemptId');
  const studentId = user?.id || '33333333-3333-3333-3333-333333333003';

  const assessment = db.assessments.find((a) => a.id === assessmentId) || db.assessments[0];
  const questions = assessment.questions || db.questions;

  // Attempt lookup: either specific attemptId or latest student attempt
  const attempt = attemptId
    ? db.attempts.find((a) => a.id === attemptId) || db.attempts[0]
    : db.attempts.find((a) => a.studentId === studentId && a.assessmentId === assessmentId) || db.attempts[0];

  const weakTopics = attempt.weakTopics || ['Linear Equations', 'Quadratic Discriminants'];
  const percentage = attempt.percentage;
  const isPassed = percentage >= (assessment.passPercentage || 50);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Top Score Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
              Evaluation & Gap Diagnostic Complete
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl font-heading">{assessment.title}</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Submitted on {new Date(attempt.submittedAt || attempt.startTime).toLocaleDateString()} &bull; Duration: {assessment.durationMinutes} mins
            </p>
          </div>

          {/* Radial / Score Badge */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50/60 px-6 py-4 text-center">
              <span className="text-3xl font-black text-slate-900 sm:text-4xl font-heading">
                {attempt.totalScore}
                <span className="text-sm font-normal text-slate-500">/{attempt.maxScore || assessment.totalMarks}</span>
              </span>
              <span
                className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                  isPassed ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {percentage}% &bull; {isPassed ? 'Passed' : 'Needs Remediation'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights: Integrity Count & Weak Topics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Passing Benchmark</div>
              <div className="text-[11px] text-slate-500">{assessment.passPercentage}% Required</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                attempt.integrityViolationCount > 0
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {attempt.integrityViolationCount} Integrity Events
              </div>
              <div className="text-[11px] text-slate-500">
                {attempt.integrityViolationCount === 0 ? 'Clean proctored session' : 'Violations recorded in audit'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{weakTopics.length} Weak Topics</div>
              <div className="text-[11px] text-slate-500">Flagged for personal study plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Descriptive Writing Review Rubric & Recommendation */}
      <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm sm:text-base font-heading">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          AI Descriptive Writing Evaluation & Actionable Recommendation
        </div>

        {/* 4 Rubric Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Clarity</span>
            <div className="text-lg font-bold text-indigo-700 mt-0.5">5.5 / 6.25</div>
            <span className="text-[10px] text-slate-500">Formulation & steps</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Relevance</span>
            <div className="text-lg font-bold text-purple-700 mt-0.5">5.0 / 6.25</div>
            <span className="text-[10px] text-slate-500">Addressing prompt</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Grammar & Syntax</span>
            <div className="text-lg font-bold text-pink-700 mt-0.5">5.8 / 6.25</div>
            <span className="text-[10px] text-slate-500">Mathematical syntax</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Topic Understanding</span>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">4.5 / 6.25</div>
            <span className="text-[10px] text-slate-500">Conceptual mastery</span>
          </div>
        </div>

        {/* AI Commentary */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-900">AI Examiner Feedback:</strong> {attempt.overallFeedback}
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <strong>Targeted Recommendation:</strong> You need to strengthen Linear Equations. Practice for 20 minutes tomorrow focusing on reciprocal substitution.
          </div>
        </div>

        {/* Launch Planner Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500">
            Automatically incorporate these weak topics into your weekly schedule:
          </span>
          <Link
            href="/student/planner"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
          >
            <span>Update Routine in Study Planner</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Question-by-Question Solution Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          Question Review & Official Solutions
        </h2>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">
                Question {idx + 1} ({q.questionType.replace('_', ' ').toUpperCase()}) &bull; {q.marks} Marks
              </span>
              <span className="text-xs text-slate-500">{q.topicTags.join(', ')}</span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">{q.questionText}</p>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs space-y-1">
              <div className="font-bold text-emerald-700">
                Official Answer Key / Solution: {q.correctAnswer}
              </div>
              {q.explanation && (
                <div className="text-slate-600 leading-relaxed pt-1">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading evaluation results...</div>}>
      <AssessmentResultsContent />
    </Suspense>
  );
}
