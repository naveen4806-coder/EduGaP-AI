'use client';

import React from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Cpu,
  ShieldCheck,
  LineChart,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  BarChart3,
  Award,
  Users,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 -z-10 h-[400px] w-[500px] rounded-full bg-purple-100/50 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:pt-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>AI Learning Gap Diagnostics & PyTorch MLP Academic Intervention</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 font-heading">
            Diagnose Student Gaps.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Elevate Academic Outcomes.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-semibold">EdUGaP AI</strong> (&ldquo;Education Gap Filler AI&rdquo;) is an institutional platform equipping schools and universities with anti-cheat monitored assessments, automatic AI writing rubric evaluation, routine-aware personalized study plans, and department-level oversight powered by a 4-layer PyTorch MLP risk classification model.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition active:scale-95"
            >
              <GraduationCap className="h-5 w-5 transition group-hover:rotate-12" />
              <span>Enter Institutional Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/signup"
              className="flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:border-slate-400 hover:bg-slate-50 transition active:scale-95"
            >
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Register New Workstation</span>
            </Link>
          </div>

          {/* Institutional Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Row Level Security (RLS) Enforced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>PyTorch 95.2% Predictive Accuracy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Zero-PII Machine Learning Ethics</span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <div className="text-3xl font-black text-indigo-600 font-heading">95.2%</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Attrition Prediction Accuracy</div>
            <div className="text-[11px] text-slate-500 mt-0.5">4-Layer PyTorch MLP Model</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <div className="text-3xl font-black text-purple-600 font-heading">4-Factor</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Descriptive Rubric Scoring</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Clarity, Relevance, Grammar & Mastery</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <div className="text-3xl font-black text-emerald-600 font-heading">100%</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Routine Adaptation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">School hours & commute aligned</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <div className="text-3xl font-black text-slate-900 font-heading">12-Point</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Zero-PII Schema</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Full academic ethics compliance</div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-20 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl font-heading">
              Comprehensive Institutional Capabilities
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
              Engineered to seamlessly coordinate students, instructional faculty, and department heads within one cohesive ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5 border border-indigo-100">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Integrity Monitored Exams</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Client-side lockdown deters academic misconduct by blocking copy/paste and context menus while logging fullscreen exits, window blur, and tab switching into Supabase audit tables.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-5 border border-purple-100">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">AI Writing Rubric Evaluation</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Objective scoring alongside automated descriptive answer evaluation across Clarity, Relevance, Grammar, and Topic Understanding with targeted remedial recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5 border border-emerald-100">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Routine-Aware Study Planner</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Adaptive timetabling engine integrates school dismissal timings, commute durations, and extracurricular commitments to formulate structured weekly revision routines.
              </p>
            </div>

            {/* Feature 4 */}
            <div id="ml-pipeline" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5 border border-indigo-100">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">PyTorch MLP Risk Classifier</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Classifies academic attrition risk into Low, Medium, and High categories using a 4-layer neural network with weighted CrossEntropyLoss and early stopping on validation loss.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-amber-300 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-5 border border-amber-100">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Resource & Question Generator</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Faculty can upload syllabi (PDFs, DOCX, question banks) and automatically synthesize balanced MCQs, short answers, and descriptive problems mapped directly to curriculum objectives.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mb-5 border border-slate-200">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">HOD Audit Governance</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Departmental comparative analytics across classes and faculty, CSV export capabilities, and strict audit logging requiring mandatory academic justifications for score modifications.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical AI & Governance Banner */}
        <div id="impact" className="mt-20 rounded-2xl border border-indigo-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                Institutional AI Ethics & Safety
              </span>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Advisory Decision Support &bull; Zero Automated Penalties
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                EdUGaP AI adheres strictly to institutional ethics guidelines. Model predictions serve exclusively to alert counselors and assist teachers in constructing proactive interventions. Predictions never dictate final grades, disciplinary action, or admissions decisions.
              </p>
            </div>

            <Link
              href="/login"
              className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
            >
              Sign In to Your Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Production Launch Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <span className="text-lg font-black text-slate-900">
                  EdU<span className="text-indigo-600">GaP</span> AI
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Next-generation academic gap identification, integrity-monitored testing, automated writing assessment rubrics, and PyTorch MLP early risk detection for K-12 and higher education institutions.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Academic Portals
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition">
                    Student Monitored Exam Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition">
                    Faculty Assessment Studio
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition">
                    Department HOD Oversight & MLP
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-indigo-600 transition">
                    Institutional Workstation Registration
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Core Technologies
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="flex items-center gap-1.5 text-slate-500">
                  <span>PyTorch 4-Layer MLP Classifier (95.2%)</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  <span>Supabase Postgres with Strict RLS</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  <span>OpenAI-Compatible Rubric Diagnostic</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  <span>Firebase Cloud Messaging Alert Queue</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Governance & Ethics
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="text-slate-500">Zero-PII Machine Learning Ethics Policy</li>
                <li className="text-slate-500">FERPA & EdTech Data Compliance</li>
                <li className="text-slate-500">Advisory-Only Intervention Protocols</li>
                <li className="text-slate-500">Immutable Audit Trail Governance</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>&copy; {new Date().getFullYear()} EdUGaP AI (&ldquo;Education Gap Filler AI&rdquo;). All rights reserved.</p>
            <p className="flex items-center gap-4">
              <span>Grade 10 Curriculum Alignment (CBSE / NCERT / State Board)</span>
              <span>&bull;</span>
              <span>Enterprise Release v2.4.0</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
