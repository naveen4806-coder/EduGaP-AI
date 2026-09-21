'use client';

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/store/mock-db';
import {
  Users,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function StaffStudentsPage() {
  const students = db.profiles.filter((p) => p.role === 'student');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
          Class Roster & Student Progress
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Individual student mastery scores, AI academic risk classifications, study routine compliance, and integrity track records.
        </p>
      </div>

      {/* Roster Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Average Score</th>
                <th className="px-6 py-4">Latest Score</th>
                <th className="px-6 py-4">Identified Weak Topics</th>
                <th className="px-6 py-4">MLP Risk Level</th>
                <th className="px-6 py-4">Study Plan Completion</th>
                <th className="px-6 py-4">Integrity Flags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const attempts = db.attempts.filter((a) => a.studentId === st.id);
                const avg = attempts.length
                  ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
                  : 80;
                const latest = attempts.length ? attempts[0].percentage : 82;
                const prediction = db.riskPredictions.find((r) => r.studentId === st.id) || {
                  risk_level: 'Low Risk',
                };
                const plan = db.studyPlans.find((p) => p.studentId === st.id) || db.studyPlans[0];
                const sessions = plan?.sessions || [];
                const planPercent = Math.round(
                  (sessions.filter((s) => s.isCompleted).length / (sessions.length || 1)) * 100
                );
                const integrityCount = db.integrityEvents.filter((e) => e.studentId === st.id).length;

                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-xs">
                          {st.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{st.fullName}</span>
                          <span className="text-[11px] text-slate-500">{st.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900">{avg}%</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{latest}%</td>

                    <td className="px-6 py-4">
                      {st.fullName.includes('Marcus') ? (
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                          Linear Equations, Discriminants
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          Linear Equations (Review)
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                          prediction.risk_level.toLowerCase().includes('high')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {prediction.risk_level}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${planPercent}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{planPercent}%</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          integrityCount > 0 ? 'text-rose-600' : 'text-slate-500'
                        }`}
                      >
                        {integrityCount} event(s)
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/staff/students/${st.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                      >
                        <span>Inspect Profile</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
