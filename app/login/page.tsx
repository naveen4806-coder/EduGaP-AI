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
  ArrowRight,
  GraduationCap,
  BookOpen,
  Cpu,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await login(email, password, selectedRole);
    setLoading(false);

    if (result.success) {
      if (selectedRole === 'student') router.push('/student/dashboard');
      else if (selectedRole === 'staff') router.push('/staff/dashboard');
      else router.push('/hod/dashboard');
    } else {
      setError(result.error || 'Invalid credentials or unregistered institutional account.');
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
            Sign In to EdUGaP AI
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Education Gap Diagnostic & Academic Intervention Platform
          </p>
        </div>

        {/* Real Institutional Login Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Academic Role Portal Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">Portal Access</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                  selectedRole === 'student'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="h-4 w-4 mb-1" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('staff')}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                  selectedRole === 'staff'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="h-4 w-4 mb-1" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('hod')}
                className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-bold border transition ${
                  selectedRole === 'hod'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Cpu className="h-4 w-4 mb-1" />
                <span>HOD</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@edugap.ai"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your institutional email.')}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : `Enter ${selectedRole.toUpperCase()} Portal`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
            Don&rsquo;t have institutional credentials?{' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Register access here
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span>Protected by Supabase Auth with Row Level Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
