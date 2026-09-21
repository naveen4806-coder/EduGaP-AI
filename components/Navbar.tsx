'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import {
  BrainCircuit,
  LogOut,
  LogIn,
  UserPlus,
  GraduationCap,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isStudent = user?.role === 'student';
  const isStaff = user?.role === 'staff';
  const isHOD = user?.role === 'hod' || user?.role === 'admin';

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700 transition">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              EdU<span className="text-indigo-600">GaP</span>{' '}
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                AI
              </span>
            </span>
            <p className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
              Education Gap Filler AI
            </p>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {isStudent && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/student/dashboard' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Student Dashboard
                </Link>
                <Link
                  href="/student/assessments"
                  className={`transition hover:text-indigo-600 ${
                    pathname.startsWith('/student/assessments') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Assessments
                </Link>
                <Link
                  href="/student/planner"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/student/planner' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Study Planner
                </Link>
              </>
            )}

            {isStaff && (
              <>
                <Link
                  href="/staff/dashboard"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/staff/dashboard' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Faculty Dashboard
                </Link>
                <Link
                  href="/staff/assessments/builder"
                  className={`transition hover:text-indigo-600 ${
                    pathname.includes('/builder') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Assessment Builder
                </Link>
                <Link
                  href="/staff/resources"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/staff/resources' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Resource Library
                </Link>
                <Link
                  href="/staff/analytics"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/staff/analytics' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Class Analytics
                </Link>
                <Link
                  href="/staff/students"
                  className={`transition hover:text-indigo-600 ${
                    pathname.startsWith('/staff/students') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Students
                </Link>
              </>
            )}

            {isHOD && (
              <>
                <Link
                  href="/hod/dashboard"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/hod/dashboard' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Overview
                </Link>
                <Link
                  href="/hod/analytics"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/hod/analytics' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Dept Analytics & MLP
                </Link>
                <Link
                  href="/hod/users"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/hod/users' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Faculty & Students
                </Link>
                <Link
                  href="/hod/oversight"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/hod/oversight' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Assessment Oversight
                </Link>
                <Link
                  href="/hod/audit-logs"
                  className={`transition hover:text-indigo-600 ${
                    pathname === '/hod/audit-logs' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Audit Logs
                </Link>
              </>
            )}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/#features" className="hover:text-indigo-600 transition">
              Platform Features
            </Link>
            <Link href="/#ml-pipeline" className="hover:text-indigo-600 transition">
              PyTorch MLP Engine
            </Link>
            <Link href="/#integrity" className="hover:text-indigo-600 transition">
              Integrity Monitoring
            </Link>
            <Link href="/#impact" className="hover:text-indigo-600 transition">
              Institutional Impact
            </Link>
          </nav>
        )}

        {/* User Account or Auth CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 border border-indigo-200">
                  {user.role}
                </span>
              </div>

              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {user.fullName.charAt(0)}
              </div>

              <button
                onClick={handleSignOut}
                title="Sign out of account"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5 text-indigo-600" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register Access</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
