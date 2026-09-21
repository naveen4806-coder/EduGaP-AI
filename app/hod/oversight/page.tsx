'use client';

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/store/mock-db';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Award,
  ChevronRight,
} from 'lucide-react';

export default function HODOversightPage() {
  const assessments = db.assessments;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
          Assessment Oversight & Curriculum Alignment
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Supervise departmental assessments authored by faculty, verify publication statuses, completion rates, and examine proctored integrity alerts.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600 tracking-wider">
              <tr>
                <th className="px-6 py-4">Assessment Title</th>
                <th className="px-6 py-4">Authoring Faculty</th>
                <th className="px-6 py-4">Publication Status</th>
                <th className="px-6 py-4">Class Completion</th>
                <th className="px-6 py-4">Class Average</th>
                <th className="px-6 py-4">Integrity Flags</th>
                <th className="px-6 py-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((asm) => {
                const attempts = db.attempts.filter((a) => a.assessmentId === asm.id);
                const avg = attempts.length
                  ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
                  : '--';
                const flags = db.integrityEvents.filter((e) => e.assessmentId === asm.id).length;

                return (
                  <tr key={asm.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm font-heading">{asm.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {asm.topic} &bull; {asm.durationMinutes} mins &bull; {asm.totalMarks} marks
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800">{asm.creatorName || 'Faculty Staff'}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                          asm.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {asm.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {attempts.length} / 3 students ({Math.round((attempts.length / 3) * 100)}%)
                    </td>

                    <td className="px-6 py-4 font-bold text-indigo-700 text-sm">{avg}%</td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          flags > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {flags} flags logged
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/hod/audit-logs"
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                      >
                        <span>Inspect Audit</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
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
