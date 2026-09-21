'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/store/mock-db';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = (params?.id as string) || '33333333-3333-3333-3333-333333333003';

  const student = db.profiles.find((p) => p.id === studentId) || db.profiles[2];
  const attempts = db.attempts.filter((a) => a.studentId === studentId);
  const integrityEvents = db.integrityEvents.filter((e) => e.studentId === studentId);
  const recommendations = db.aiRecommendations.filter((r) => r.studentId === studentId);
  const plan = db.studyPlans.find((p) => p.studentId === studentId) || db.studyPlans[0];
  const prediction = db.riskPredictions.find((r) => r.studentId === studentId) || {
    risk_level: 'Low Risk',
    confidence_score: 0.88,
    top_risk_factors: ['Consistent study pattern'],
  };

  const sessions = plan?.sessions || [];
  const completedSessions = sessions.filter((s) => s.isCompleted).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Back button & Student Header */}
      <div>
        <Link
          href="/staff/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Student Roster</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-md shadow-indigo-600/20">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">{student.fullName}</h1>
              <p className="text-xs text-slate-500">
                {student.email} &bull; Grade 10 Section A &bull; Mathematics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                PyTorch MLP Classification
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase mt-1 border ${
                  prediction.risk_level.toLowerCase().includes('high')
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {prediction.risk_level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Assessment History & Topic Performance */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Assessment History */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            Assessment History & Results
          </h2>

          <div className="space-y-3">
            {attempts.length === 0 ? (
              <p className="text-xs text-slate-500">No assessments completed yet.</p>
            ) : (
              attempts.map((att) => (
                <div
                  key={att.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{att.assessmentTitle}</span>
                    <span
                      className={`font-bold text-xs ${
                        att.percentage >= 50 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {att.totalScore}/{att.maxScore} ({att.percentage}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{att.overallFeedback}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>Date: {new Date(att.submittedAt || att.startTime).toLocaleDateString()}</span>
                    <span className="font-semibold text-rose-600">{att.integrityViolationCount} Integrity Events</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Study Plan Status & AI Recommendations */}
        <div className="space-y-6">
          {/* Study Plan Compliance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Calendar className="h-4 w-4 text-purple-600" />
                Prescribed Study Plan Adherence
              </h2>
              <span className="text-xs font-bold text-indigo-700">
                {completedSessions}/{sessions.length} sessions
              </span>
            </div>

            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-xl border p-3 flex items-center justify-between text-xs ${
                    s.isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50 text-slate-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {s.dayOfWeek} &bull; {s.startTime}
                    </span>
                    <span className="text-[11px] text-slate-500">{s.topic}</span>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      s.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Gap Recommendations */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-indigo-900 flex items-center gap-2 font-heading">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Active AI Recommendations
            </h2>

            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs space-y-1 shadow-xs"
              >
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Topic: {rec.topic}</span>
                  <span className="uppercase text-[10px] text-amber-700 font-bold">{rec.priority} Priority</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.recommendationText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrity Events Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <ShieldAlert className="h-4 w-4 text-rose-600" />
          Proctored Exam Integrity History
        </h2>

        {integrityEvents.length === 0 ? (
          <p className="text-xs text-emerald-600 font-semibold">Zero academic integrity incidents recorded for this student.</p>
        ) : (
          <div className="space-y-2">
            {integrityEvents.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl border border-rose-200 bg-rose-50/30 p-3 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-rose-800 font-mono block uppercase">
                    {evt.eventType}
                  </span>
                  <span className="text-slate-600">{evt.details?.message}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(evt.eventTime).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
