'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function StudentAssessmentsPage() {
  const { user } = useAuth();
  const studentId = user?.id || '33333333-3333-3333-3333-333333333003';

  const published = db.assessments.filter((a) => a.status === 'published');
  const studentAttempts = db.attempts.filter((a) => a.studentId === studentId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-[calc(100vh-65px)] text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
          Assigned Assessments
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Complete mandatory diagnostic tests and quizzes. Browser integrity monitoring is active during all sessions.
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {published.map((assessment) => {
          const attempt = studentAttempts.find((att) => att.assessmentId === assessment.id);
          const isCompleted = attempt && (attempt.status === 'submitted' || attempt.status === 'graded');

          return (
            <div
              key={assessment.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                    {assessment.subjectName || 'Mathematics'}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle className="h-3.5 w-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-heading">{assessment.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{assessment.learningObjective}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{assessment.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-600" />
                    <span>{assessment.totalMarks} marks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-pink-600" />
                    <span>7 days left</span>
                  </div>
                </div>

                {isCompleted && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Your Diagnostic Score:</span>
                    <span className="font-bold text-emerald-700">
                      {attempt.totalScore} / {attempt.maxScore || assessment.totalMarks} ({attempt.percentage}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCompleted ? (
                  <Link
                    href={`/student/assessments/${assessment.id}/results`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    <span>View Graded Submission & AI Feedback</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ) : (
                  <Link
                    href={`/student/assessments/${assessment.id}/take`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Enter Monitored Test Environment</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
