'use client';

import React from 'react';
import { db } from '@/lib/store/mock-db';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Users,
  Award,
  Clock,
} from 'lucide-react';

export default function StaffAnalyticsPage() {
  const attempts = db.attempts;
  const integrityEvents = db.integrityEvents;

  // Score distribution counts
  const bracket90Plus = attempts.filter((a) => a.percentage >= 90).length;
  const bracket75to89 = attempts.filter((a) => a.percentage >= 75 && a.percentage < 90).length;
  const bracket50to74 = attempts.filter((a) => a.percentage >= 50 && a.percentage < 75).length;
  const bracketBelow50 = attempts.filter((a) => a.percentage < 50).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
          Classroom Academic Analytics
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          In-depth diagnostics across Grade 10 Section A: score distributions, topic mastery, integrity incident rates, and learning gap rankings.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Class Diagnostic Average</span>
          <div className="mt-2 text-3xl font-black text-indigo-600 font-heading">65.0%</div>
          <span className="text-[11px] text-slate-500">Passing Benchmark: 50%</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completion Rate</span>
          <div className="mt-2 text-3xl font-black text-emerald-600 font-heading">83.3%</div>
          <span className="text-[11px] text-slate-500">5 of 6 assigned tests submitted</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Integrity Flags</span>
          <div className="mt-2 text-3xl font-black text-rose-600 font-heading">{integrityEvents.length}</div>
          <span className="text-[11px] text-slate-500">Tab switches & blur events</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Curriculum Gap</span>
          <div className="mt-2 text-xl font-black text-amber-600 truncate font-heading">Linear Equations</div>
          <span className="text-[11px] text-slate-500">Ranked #1 learning deficit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Score Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            Student Score Distribution
          </h2>

          <div className="space-y-3 text-xs pt-2">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Distinction (90% - 100%)</span>
                <span className="font-bold text-emerald-700">{bracket90Plus} student(s)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(bracket90Plus / (attempts.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Proficient (75% - 89%)</span>
                <span className="font-bold text-indigo-700">{bracket75to89} student(s)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(bracket75to89 / (attempts.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Average (50% - 74%)</span>
                <span className="font-bold text-amber-700">{bracket50to74} student(s)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(bracket50to74 / (attempts.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="font-semibold">Needs Remediation (&lt; 50%)</span>
                <span className="font-bold text-rose-700">{bracketBelow50} student(s)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(bracketBelow50 / (attempts.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Topic Mastery Ranking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Topic Mastery & Curriculum Learning Deficit Ranking
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">1. Linear Equations (Word Problems)</span>
                <span className="text-rose-600 font-bold">36% Mastery (High Gap)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">2. Quadratic Discriminants & Complex Roots</span>
                <span className="text-amber-600 font-bold">54% Mastery (Moderate Gap)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">3. System Consistency & Geometric Lines</span>
                <span className="text-indigo-600 font-bold">78% Mastery (Satisfactory)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">4. Real Numbers & Prime Factorization</span>
                <span className="text-emerald-600 font-bold">92% Mastery (Mastered)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrity Event Reports */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <ShieldAlert className="h-4 w-4 text-rose-600" />
          Proctored Exam Integrity Incident Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Incident Type</th>
                <th className="px-4 py-3">Incident Description</th>
                <th className="px-4 py-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {integrityEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(evt.eventTime).toLocaleTimeString()} &bull; {new Date(evt.eventTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{evt.studentName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700 border border-indigo-100">
                      {evt.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{evt.details?.message || 'Suspicious browser event'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        evt.severity === 'violation'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
