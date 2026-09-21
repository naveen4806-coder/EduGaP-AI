'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import {
  Cpu,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  BarChart3,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HODDashboardPage() {
  const { user } = useAuth();
  const hodName = user?.fullName || 'Dr. Aris Thorne';

  const staffCount = db.profiles.filter((p) => p.role === 'staff').length;
  const studentCount = db.profiles.filter((p) => p.role === 'student').length;
  const activeAssessments = db.assessments.filter((a) => a.status === 'published').length;
  const atRiskCount = db.riskPredictions.filter(
    (p) => p.risk_level === 'High Risk' || p.risk_level === 'high'
  ).length;

  const totalAttempts = db.attempts.length;
  const deptAverage = Math.round(
    db.attempts.reduce((sum, a) => sum + a.percentage, 0) / (totalAttempts || 1)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4" />
            <span>Institutional Governance &bull; Department of Mathematics</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl font-heading">
            Department Executive Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Welcome, {hodName}. Oversee faculty instructional pacing, review PyTorch student risk distributions, and maintain curriculum integrity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/hod/analytics"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Department Analytics & MLP</span>
          </Link>
          <Link
            href="/hod/audit-logs"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FileCheck className="h-4 w-4 text-purple-600" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (8 Metrics) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Staff Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Department Faculty</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-heading">{staffCount} Professors</div>
          <div className="mt-2 text-xs font-semibold text-purple-700">Active teaching assignments</div>
        </div>

        {/* Student Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Total Students</span>
            <GraduationCap className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-heading">{studentCount} Enrolled</div>
          <div className="mt-2 text-xs font-semibold text-indigo-700">Grade 10 Sections A & B</div>
        </div>

        {/* Active Assessments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Active Tests</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-700 font-heading">{activeAssessments} Published</div>
          <div className="mt-2 text-xs text-slate-500">All classes participating</div>
        </div>

        {/* Department Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Department Average</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-heading">{deptAverage}%</div>
          <div className="mt-2 text-xs font-semibold text-indigo-700">+4.2% higher than Q1 baseline</div>
        </div>

        {/* At-Risk Students */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase">At-Risk Students</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-rose-700 font-heading">{atRiskCount} Student</div>
          <div className="mt-2 text-xs text-rose-600">Flagged by PyTorch MLP model</div>
        </div>

        {/* Most Difficult Topics */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase">Most Difficult Topic</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 text-lg font-bold text-amber-900 truncate font-heading">Linear Equations</div>
          <div className="mt-2 text-xs text-amber-700">36% pass on word problems</div>
        </div>

        {/* Integrity Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Integrity Summary</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-rose-700 font-heading">{db.integrityEvents.length} Flags</div>
          <div className="mt-2 text-xs text-slate-500">Recorded across 2 attempts</div>
        </div>

        {/* Model Accuracy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">ML Model Precision</span>
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-indigo-700 font-heading">95.2%</div>
          <div className="mt-2 text-xs text-slate-500">Test split F1: 0.923</div>
        </div>
      </div>

      {/* Subject-level Trend Chart & Department Overview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Trend Bar Visualizer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Subject-Level Performance Trends
          </h2>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Real Numbers & Euclid Division</span>
                <span className="font-bold text-emerald-700">92% Mastery</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Polynomials & Factorization</span>
                <span className="font-bold text-indigo-700">81% Mastery</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '81%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Quadratic Equations & Discriminants</span>
                <span className="font-bold text-amber-700">54% Mastery</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Linear Equations in Two Variables</span>
                <span className="font-bold text-rose-700">36% Mastery (Target Deficit)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links to HOD Subsystems */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <Cpu className="h-4 w-4 text-purple-600" />
            Administrative Oversight Subsystems
          </h2>

          <div className="space-y-3 text-xs">
            <Link
              href="/hod/analytics"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 block font-heading">
                  Cross-Section Comparative Analytics & MLP Risk
                </span>
                <span className="text-slate-500">
                  Compare Section A vs B, export academic reports to CSV, view PyTorch predictions.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-indigo-600" />
            </Link>

            <Link
              href="/hod/users"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-purple-300 hover:bg-purple-50/50 transition"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 block font-heading">
                  Faculty Assignments & Student Enrollment Register
                </span>
                <span className="text-slate-500">
                  Manage professor subject assignments, approve staff, review enrollment rosters.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-600" />
            </Link>

            <Link
              href="/hod/audit-logs"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-pink-300 hover:bg-pink-50/50 transition"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 block font-heading">
                  Institutional Audit Trail & Score Alteration Guard
                </span>
                <span className="text-slate-500">
                  Inspect immutable administrative logs and grade change justification records.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-pink-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
