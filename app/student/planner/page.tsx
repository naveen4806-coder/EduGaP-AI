'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import { StudySession } from '@/lib/types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Save,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function StudentPlannerPage() {
  const { user } = useAuth();
  const studentId = user?.id || '33333333-3333-3333-3333-333333333003';

  const existingPlan = db.studyPlans.find((p) => p.studentId === studentId) || db.studyPlans[0];

  // Routine Form inputs
  const [schoolEndTime, setSchoolEndTime] = useState(existingPlan.schoolEndTime || '15:30');
  const [commuteTimeMins, setCommuteTimeMins] = useState(existingPlan.commuteTimeMins || 30);
  const [extracurriculars, setExtracurriculars] = useState(
    existingPlan.extracurriculars || 'Track & field on Tuesdays and Thursdays'
  );
  const [preferredStudyTime, setPreferredStudyTime] = useState(
    existingPlan.preferredStudyTime || '18:00 - 20:00'
  );
  const [availableDays, setAvailableDays] = useState<string[]>(
    existingPlan.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );
  const [examGoals, setExamGoals] = useState(
    existingPlan.examGoals || 'Mid-term Mathematics: Score 90%+ and master Linear Equations'
  );

  // Active Sessions
  const [sessions, setSessions] = useState<StudySession[]>(existingPlan.sessions || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleSession = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const next = !s.isCompleted;
        db.toggleStudySession(sessionId);
        return {
          ...s,
          isCompleted: next,
          completedAt: next ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });
    setSessions(updated);
  };

  // Routine-based schedule generation
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // Diagnostic weak topics
      const studentAttempts = db.attempts.filter((a) => a.studentId === studentId);
      const weakTopics = studentAttempts.flatMap((a) => a.weakTopics || []);
      const primaryWeakTopic = weakTopics[0] || 'Linear Equations: Elimination & Word Problems';

      const generated: StudySession[] = [];
      const planId = existingPlan.id;

      availableDays.forEach((day, index) => {
        let topic = '';
        let duration = 45;
        let time = '18:30';

        if (day === 'Tuesday' || day === 'Thursday') {
          time = '19:00'; // accommodate extracurricular
          duration = 40;
        }

        if (index % 3 === 0) {
          topic = primaryWeakTopic;
        } else if (index % 3 === 1) {
          topic = 'Quadratic Equations & Discriminant Root Verification';
        } else {
          topic = 'Real Numbers & Polynomial Factorization Review';
          duration = 60;
        }

        generated.push({
          id: `gen-ss-${index}-${Date.now()}`,
          studyPlanId: planId,
          studentId,
          subject: 'Grade 10 Mathematics',
          topic,
          dayOfWeek: day,
          startTime: time,
          durationMins: duration,
          isCompleted: false,
        });
      });

      setSessions(generated);
      setIsGenerating(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  const completedCount = sessions.filter((s) => s.isCompleted).length;
  const totalMins = sessions.reduce((acc, s) => acc + s.durationMins, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Adaptive Routine Optimization</span>
        </div>
        <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl font-heading">Personalized Study Planner</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Build an adaptive weekly study timetable harmonized with your school timings, commute, and extracurriculars while prioritizing detected learning gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Routine Form Intake */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-heading">
            <Clock className="h-4 w-4 text-indigo-600" />
            Your Daily Routine & Preferences
          </h2>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">School End Time</label>
              <input
                type="time"
                value={schoolEndTime}
                onChange={(e) => setSchoolEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Daily Commute Duration (minutes)</label>
              <input
                type="number"
                value={commuteTimeMins}
                onChange={(e) => setCommuteTimeMins(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                min="0"
                max="180"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Extracurricular Activities</label>
              <input
                type="text"
                value={extracurriculars}
                onChange={(e) => setExtracurriculars(e.target.value)}
                placeholder="e.g. Sports on Tuesdays, Band on Fridays"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Daily Study Window</label>
              <input
                type="text"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                placeholder="e.g. 18:00 - 20:00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Upcoming Exam Target</label>
              <input
                type="text"
                value={examGoals}
                onChange={(e) => setExamGoals(e.target.value)}
                placeholder="e.g. Mid-term Algebra 90%+"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Available Study Days</label>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const isSelected = availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating Schedule...' : 'Generate AI Study Schedule'}</span>
            </button>
          </form>

          {savedSuccess && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="h-4 w-4" />
              <span>Weekly study schedule successfully refreshed!</span>
            </div>
          )}
        </div>

        {/* Generated Weekly Schedule & Interactive Checklists */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary Card */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Sessions</span>
              <div className="text-xl font-black text-slate-900 mt-1 font-heading">{sessions.length}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Minutes</span>
              <div className="text-xl font-black text-indigo-700 mt-1 font-heading">{totalMins} min</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Completed</span>
              <div className="text-xl font-black text-emerald-700 mt-1 font-heading">
                {completedCount} / {sessions.length}
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Calendar className="h-4 w-4 text-purple-600" />
                Prescribed Weekly Routine
              </h2>
              <span className="text-xs text-slate-500">Click checkboxes to mark complete</span>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleToggleSession(session.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition flex items-start justify-between gap-4 ${
                    session.isCompleted
                      ? 'border-emerald-200 bg-emerald-50/60 text-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                        session.isCompleted
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      {session.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700">
                          {session.dayOfWeek} &bull; {session.startTime}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {session.durationMins} mins
                        </span>
                      </div>
                      <h3
                        className={`text-sm mt-1 font-bold ${
                          session.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 font-heading'
                        }`}
                      >
                        {session.topic}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{session.subject}</p>
                    </div>
                  </div>

                  {session.isCompleted ? (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
