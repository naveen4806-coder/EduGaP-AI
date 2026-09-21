'use client';

import React, { useState } from 'react';
import { db } from '@/lib/store/mock-db';
import { Profile } from '@/lib/types';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  BookOpen,
  Check,
  CheckCircle2,
} from 'lucide-react';

export default function HODUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>(db.profiles);
  const [notification, setNotification] = useState<string | null>(null);

  const staffMembers = profiles.filter((p) => p.role === 'staff');
  const students = profiles.filter((p) => p.role === 'student');

  const handleToggleStaffStatus = (staffId: string) => {
    const updated = profiles.map((p) => {
      if (p.id === staffId) {
        const nextState = !p.isActive;
        db.addAuditLog({
          actorId: '33333333-3333-3333-3333-333333333001',
          actorName: 'Dr. Aris Thorne (HOD)',
          action: nextState ? 'ACTIVATE_STAFF' : 'DEACTIVATE_STAFF',
          targetType: 'profiles',
          targetId: staffId,
          reason: `HOD administrative status modification for ${p.fullName}`,
        });
        return { ...p, isActive: nextState };
      }
      return p;
    });

    setProfiles(updated);
    setNotification('Staff status updated and recorded in audit log.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
          Faculty & Student Enrollment Directory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Authorize teaching staff, review class assignments, and manage student enrollments across Grade 10 sections.
        </p>
      </div>

      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Staff Management Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Shield className="h-4 w-4 text-purple-600" />
          Department Teaching Faculty ({staffMembers.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">Faculty Member</th>
                <th className="px-4 py-3">Department Role</th>
                <th className="px-4 py-3">Assigned Class & Subject</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 font-bold text-white text-xs shadow-xs">
                        {staff.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{staff.fullName}</span>
                        <span className="text-[11px] text-slate-500">{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-purple-50 px-2 py-0.5 font-bold uppercase text-purple-700 text-[10px] border border-purple-100">
                      Instructional Staff
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    Grade 10 Section A &bull; Mathematics
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                        staff.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {staff.isActive ? 'Active / Approved' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleStaffStatus(staff.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                        staff.isActive
                          ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {staff.isActive ? 'Deactivate' : 'Re-Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Enrollment Register */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <GraduationCap className="h-4 w-4 text-indigo-600" />
          Student Enrollment Register ({students.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Enrolled Class</th>
                <th className="px-4 py-3">Academic Year</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{st.fullName}</td>
                  <td className="px-4 py-3 text-slate-500">{st.email}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">Grade 10 - Section A</td>
                  <td className="px-4 py-3 text-slate-500">2026-2027</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase border border-emerald-100">
                      Active
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
