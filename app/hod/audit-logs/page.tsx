'use client';

import React, { useState } from 'react';
import { db } from '@/lib/store/mock-db';
import { AuditLog } from '@/lib/types';
import {
  FileCheck,
  ShieldAlert,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function HODAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(db.auditLogs);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Score Adjustment Audit Form State
  const [selectedAttemptId, setSelectedAttemptId] = useState(
    db.attempts[0]?.id || '99999999-9999-9999-9999-999999999001'
  );
  const [newScore, setNewScore] = useState<number>(24);
  const [mandatoryReason, setMandatoryReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleScoreAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mandatoryReason || mandatoryReason.trim().length < 10) {
      setError('A comprehensive academic justification of at least 10 characters is mandatory to adjust student scores.');
      return;
    }

    const attempt = db.attempts.find((a) => a.id === selectedAttemptId);
    if (!attempt) {
      setError('Selected student attempt could not be found.');
      return;
    }

    const oldScore = attempt.totalScore;
    const oldPct = attempt.percentage;

    // Mutate attempt
    attempt.totalScore = newScore;
    attempt.percentage = Math.round((newScore / (attempt.maxScore || 50)) * 100);

    // Record immutable audit log
    const newLog = db.addAuditLog({
      actorId: '33333333-3333-3333-3333-333333333001',
      actorName: 'Dr. Aris Thorne (HOD)',
      action: 'OVERRIDE_STUDENT_SCORE',
      targetType: 'attempts',
      targetId: attempt.id,
      beforeState: { score: oldScore, percentage: oldPct },
      afterState: { score: newScore, percentage: attempt.percentage },
      reason: mandatoryReason,
    });

    setLogs([newLog, ...logs]);
    setSuccess(`Score for ${attempt.studentName} updated from ${oldScore} to ${newScore}. Audit record #${newLog.id} generated.`);
    setShowAdjustModal(false);
    setMandatoryReason('');
    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Lock className="h-4 w-4" />
            <span>Cryptographic Traceability & Governance</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl font-heading">Institutional Audit Trail</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Immutable log of all administrative actions, faculty approvals, and mandatory justifications for any score alterations.
          </p>
        </div>

        <button
          onClick={() => setShowAdjustModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
        >
          <FileCheck className="h-4 w-4" />
          <span>Adjust Score with Audit Trail</span>
        </button>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Mandatory Policy Alert */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-xs">
        <strong className="text-amber-900 block mb-1 font-heading font-bold">Institutional Governance Policy:</strong>
        Under institutional accreditation rules, Heads of Department and academic evaluators are strictly prohibited from changing student responses or modifying examination scores without providing a permanent, non-repudiable audit reason.
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600 tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Type</th>
                <th className="px-6 py-4">Mandatory Justification / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString()} &bull; {new Date(log.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{log.actorName || 'HOD Dr. Thorne'}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700 border border-indigo-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">{log.targetType}</td>
                  <td className="px-6 py-4 text-slate-700">{log.reason || 'Standard administrative review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Adjustment Modal with Mandatory Reason */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                Score Adjustment with Mandatory Audit Reason
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleScoreAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student Assessment Attempt</label>
                <select
                  value={selectedAttemptId}
                  onChange={(e) => setSelectedAttemptId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                >
                  {db.attempts.map((att) => (
                    <option key={att.id} value={att.id}>
                      {att.studentName} - {att.assessmentTitle} (Current Score: {att.totalScore}/{att.maxScore})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Score (Total Marks: 50)</label>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                  min="0"
                  max="50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mandatory Academic Justification (Required for Audit Trail)
                </label>
                <textarea
                  rows={4}
                  value={mandatoryReason}
                  onChange={(e) => setMandatoryReason(e.target.value)}
                  placeholder="e.g. Re-evaluated descriptive Question 4 after verifying student demonstrated correct substitution methodology on step 3."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
                >
                  Commit Score & Record Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
