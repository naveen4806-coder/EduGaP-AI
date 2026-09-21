'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import {
  Flame,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const studentId = user?.id || '33333333-3333-3333-3333-333333333003';
  const studentName = user?.fullName || 'Alex Rivera';

  // Fetch student records from store
  const studyPlan = db.studyPlans.find((p) => p.studentId === studentId) || db.studyPlans[0];
  const publishedAssessments = db.assessments.filter((a) => a.status === 'published');
  const studentAttempts = db.attempts.filter((a) => a.studentId === studentId);
  const recommendations = db.aiRecommendations.filter((r) => r.studentId === studentId);
  const prediction = db.riskPredictions.find((r) => r.studentId === studentId) || {
    risk_level: 'Low Risk',
    confidence_score: 0.885,
    top_risk_factors: ['Consistent study routine', 'High quiz completion rate'],
  };

  // Compute stats
  const completedSessions = studyPlan?.sessions?.filter((s) => s.isCompleted).length || 0;
  const totalSessions = studyPlan?.sessions?.length || 1;
  const planAdherence = Math.round((completedSessions / totalSessions) * 100);

  // State to track session toggles locally for immediate interaction
  const [sessions, setSessions] = useState(studyPlan?.sessions || []);

  const handleToggleSession = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const nextState = !s.isCompleted;
        db.toggleStudySession(sessionId);
        return { ...s, isCompleted: nextState, completedAt: nextState ? new Date().toISOString() : undefined };
      }
      return s;
    });
    setSessions(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header Greeting & Streak */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Grade 10 Mathematics &bull; Section A</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl font-heading">
            Welcome back, {studentName}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            You are on track for upcoming mid-terms. Complete today&rsquo;s 45-minute revision block to maintain your learning streak.
          </p>
        </div>

        {/* Highlight Streak & Mastery Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black shadow-xs">
              <Flame className="h-6 w-6 fill-white" />
            </div>
            <div>
              <div className="text-xl font-black text-amber-900 font-heading">7 Days</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Active Streak</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-black shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black text-emerald-900 font-heading">82%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Topic Mastery</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Daily Study Time */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Study Time</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-heading">75</span>
            <span className="text-xs text-slate-500">mins / day avg</span>
          </div>
          <div className="mt-2 text-xs text-indigo-700 font-semibold">Target: 60 mins/day (+25% ahead)</div>
        </div>

        {/* Weak Topics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Identified Weak Topics</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 font-heading">1</span>
            <span className="text-xs text-slate-500">topic below 60%</span>
          </div>
          <div className="mt-2 text-xs text-slate-700 truncate font-medium">
            Needs review: <strong className="text-amber-800">Linear Equations</strong>
          </div>
        </div>

        {/* Academic Risk Level */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Risk Level</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              {prediction.risk_level}
            </span>
            <span className="text-xs text-slate-500">
              ({Math.round(prediction.confidence_score * 100)}% conf)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            PyTorch MLP Model: Safe threshold
          </div>
        </div>

        {/* Study Plan Adherence */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Plan Adherence</span>
            <Target className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-heading">{planAdherence}%</span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${planAdherence}%` }} />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Assessments & AI Remediation Recommendations */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Published Assessments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Active & Upcoming Assessments
              </h2>
              <Link
                href="/student/assessments"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {publishedAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                        {assessment.subjectName || 'Mathematics'}
                      </span>
                      <span className="text-xs text-slate-500">&bull; {assessment.durationMinutes} mins</span>
                      <span className="text-xs text-slate-500">&bull; {assessment.totalMarks} marks</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{assessment.title}</h3>
                    <p className="text-xs text-slate-600">{assessment.learningObjective}</p>
                  </div>

                  <Link
                    href={`/student/assessments/${assessment.id}/take`}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
                  >
                    <span>Start Test</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* AI Gap Remediation Recommendations */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 text-sm font-bold mb-3 font-heading">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              AI Learning Gap Remediation Suggestions
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{rec.topic}</span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                      {rec.priority} Priority &bull; {rec.suggestedDurationMins} mins
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.recommendationText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Current Study Plan Sessions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Calendar className="h-5 w-5 text-purple-600" />
                This Week&rsquo;s Study Routine
              </h2>
              <Link
                href="/student/planner"
                className="text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                Edit Routine
              </Link>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Click checkboxes to mark completed study sessions and maintain your learning streak.
            </p>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleToggleSession(session.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition flex items-start gap-3 ${
                    session.isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50 text-slate-700'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      session.isCompleted
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    {session.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900">
                        {session.dayOfWeek} &bull; {session.startTime}
                      </span>
                      <span className="text-[10px] text-slate-500">{session.durationMins} mins</span>
                    </div>
                    <div
                      className={`text-xs mt-0.5 font-medium ${
                        session.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      {session.topic}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link
                href="/student/planner"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Regenerate weekly study schedule <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
