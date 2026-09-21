'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import {
  BookOpen,
  Users,
  AlertTriangle,
  Award,
  CheckCircle2,
  TrendingUp,
  FilePlus,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  UploadCloud,
  FileText,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const staffName = user?.fullName || 'Prof. Sarah Jenkins';

  const activeAssessments = db.assessments.filter((a) => a.status === 'published');
  const allAttempts = db.attempts;
  const highRiskStudents = db.riskPredictions.filter(
    (r) => r.risk_level === 'High Risk' || r.risk_level === 'high'
  );

  const avgScore = Math.round(
    allAttempts.reduce((sum, a) => sum + a.percentage, 0) / (allAttempts.length || 1)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <span>Faculty Command &bull; Grade 10 Mathematics</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl font-heading">
            Welcome back, {staffName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Monitor class diagnostics, author curriculum assessments with AI assistance, and track student risk indicators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/staff/assessments/builder"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
          >
            <FilePlus className="h-4 w-4" />
            <span>Create Assessment</span>
          </Link>

          <Link
            href="/staff/resources"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <UploadCloud className="h-4 w-4 text-indigo-600" />
            <span>Upload Teaching Material</span>
          </Link>
        </div>
      </div>

      {/* Staff KPI Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Active Assessments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Assessments</span>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-heading">{activeAssessments.length}</div>
          <div className="mt-2 text-xs text-slate-500">Published to Grade 10</div>
        </div>

        {/* Total Submissions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-heading">{allAttempts.length}</div>
          <div className="mt-2 text-xs font-semibold text-emerald-600">Evaluated with AI rubrics</div>
        </div>

        {/* Class Average Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Class Average</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-heading">{avgScore}%</div>
          <div className="mt-2 text-xs text-purple-700 font-medium">Passing benchmark: 50%</div>
        </div>

        {/* Students At Risk */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">Students At Risk</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-rose-700 font-heading">{highRiskStudents.length}</div>
          <div className="mt-2 text-xs text-rose-600">MLP Model early alert</div>
        </div>

        {/* Integrity Incidents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Integrity Events</span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 font-heading">{db.integrityEvents.length}</div>
          <div className="mt-2 text-xs text-slate-500">Flags logged in exams</div>
        </div>
      </div>

      {/* Main Grid: Active Assessments & Recent Submissions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Active Assessments & Weak Topic Alert */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Assessments Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Department Assessments
              </h2>
              <Link
                href="/staff/assessments/builder"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                + New Assessment
              </Link>
            </div>

            <div className="space-y-3">
              {db.assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          a.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {a.status}
                      </span>
                      <span className="text-xs text-slate-500">&bull; {a.durationMinutes} mins</span>
                      <span className="text-xs text-slate-500">&bull; {a.totalMarks} marks</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                    <p className="text-xs text-slate-600">{a.topic}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/staff/assessments/builder?id=${a.id}`}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                    >
                      Edit & Manage
                    </Link>
                    <Link
                      href="/staff/analytics"
                      className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-xs"
                    >
                      Analytics
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics Ranking across Class */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 font-heading">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Classwide Learning Gap Diagnostics
            </h2>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-800">Linear Equations: Multi-step Word Problems</span>
                  <p className="text-slate-600 mt-0.5">42% average accuracy across enrolled students</p>
                </div>
                <span className="rounded bg-rose-100 px-2.5 py-1 font-bold text-rose-800 border border-rose-200">
                  Critical Deficit
                </span>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-800">Quadratic Equations: Discriminant Interpretation</span>
                  <p className="text-slate-600 mt-0.5">58% average accuracy across enrolled students</p>
                </div>
                <span className="rounded bg-amber-100 px-2.5 py-1 font-bold text-amber-800 border border-amber-200">
                  Moderate Gap
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Submissions & At-Risk Students */}
        <div className="space-y-6">
          {/* Students At Risk Widget */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-rose-900 flex items-center gap-2 font-heading">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Intervention Required
              </h2>
              <Link href="/staff/students" className="text-xs font-bold text-rose-700 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {highRiskStudents.map((pred) => (
                <div
                  key={pred.studentId}
                  className="rounded-xl border border-rose-200 bg-white p-3.5 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{pred.studentName}</span>
                    <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
                      HIGH RISK
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Reasons: {pred.top_risk_factors?.slice(0, 2).join(', ')}
                  </p>
                  <Link
                    href={`/staff/students/${pred.studentId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-1"
                  >
                    Open Student Profile <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-heading">
              <FileText className="h-4 w-4 text-indigo-600" />
              Recent Submissions
            </h2>

            <div className="space-y-3">
              {allAttempts.map((att) => (
                <div
                  key={att.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{att.studentName}</span>
                    <span
                      className={`font-bold ${
                        att.percentage >= 50 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {att.percentage}% ({att.totalScore}/{att.maxScore})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{att.assessmentTitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
