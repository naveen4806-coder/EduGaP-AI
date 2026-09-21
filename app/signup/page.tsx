'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/lib/types';
import {
  BrainCircuit,
  Lock,
  Mail,
  User,
  GraduationCap,
  BookOpen,
  Cpu,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [departmentId, setDepartmentId] = useState('22222222-2222-2222-2222-222222222001');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full official name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signup({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role,
      departmentId,
    });
    setLoading(false);

    if (result.success) {
      if (role === 'student') router.push('/student/dashboard');
      else if (role === 'staff') router.push('/staff/dashboard');
      else router.push('/hod/dashboard');
    } else {
      setError(result.error || 'Failed to create institutional account.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3 shadow-xs">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Register Institutional Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Create your profile to access proctored assessments, study planning, and AI diagnostics
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Academic Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                    role === 'student'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 mb-1" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                    role === 'staff'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mb-1" />
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('hod')}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                    role === 'hod'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Cpu className="h-4 w-4 mb-1" />
                  <span>HOD</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department / Faculty</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
              >
                <option value="22222222-2222-2222-2222-222222222001">Mathematics & Computational Sciences</option>
                <option value="22222222-2222-2222-2222-222222222002">Natural Sciences & Physics</option>
              </select>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Registering Account...' : 'Complete Institutional Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
            Already have an active institutional account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
