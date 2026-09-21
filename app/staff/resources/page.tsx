'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import { ResourceFile } from '@/lib/types';
import {
  UploadCloud,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Plus,
  X,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffResourcesPage() {
  const { user } = useAuth();
  const staffId = user?.id || '33333333-3333-3333-3333-333333333002';
  const staffName = user?.fullName || 'Prof. Sarah Jenkins';

  const [resources, setResources] = useState<ResourceFile[]>(db.resources);
  const [previewResource, setPreviewResource] = useState<ResourceFile | null>(null);

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('55555555-5555-5555-5555-555555555001');
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('application/pdf');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFileName(file.name);
      setNewFileType(file.type || 'application/pdf');
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      setExtractedText(
        `Curriculum extraction from ${file.name}:
Unit: Core Mathematics & Polynomial Analysis
Focus topics: Real numbers, algebraic substitution, quadratic formulas, coordinate geometries, and trigonometric ratios. Includes recommended learning objectives for secondary examinations.`
      );
    }
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const added: ResourceFile = {
        id: `res-${Date.now()}`,
        title: newTitle || 'Grade 10 Curriculum Material',
        subjectId: newSubject,
        uploaderId: staffId,
        uploaderName: staffName,
        fileName: newFileName || 'curriculum_supplement.pdf',
        fileUrl: `/resources/${newFileName || 'curriculum_supplement.pdf'}`,
        fileType: newFileType,
        fileSize: 312000,
        status: 'processed',
        extractedText:
          extractedText ||
          'Extracted syllabus topics: Pair of linear equations in two variables, quadratic equations, and coordinate geometry.',
        createdAt: new Date().toISOString(),
      };

      db.addResource(added);
      setResources([added, ...resources]);
      setIsProcessing(false);
      setShowUploadModal(false);
      setNewTitle('');
      setNewFileName('');
      setExtractedText('');
    }, 500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl font-heading">
            Teaching Material & Resource Library
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Upload syllabi (PDF), DOCX files, previous year question papers, and diagrams to power AI assessment generation.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Teaching Material</span>
        </button>
      </div>

      {/* Resource Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase font-bold text-slate-600 tracking-wider">
              <tr>
                <th className="px-6 py-4">Resource Document</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Uploader</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{res.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {res.fileName} &bull; {Math.round(res.fileSize / 1024)} KB
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                      Grade 10 Mathematics
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{res.uploaderName || 'Staff'}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={res.fileUrl}
                        download
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulated secure download from Supabase 'resources' bucket: ${res.fileName}`);
                        }}
                        className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-500" />
                        <span>Download</span>
                      </a>

                      <Link
                        href={`/staff/assessments/builder?resourceId=${res.id}`}
                        className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Create Assessment</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <UploadCloud className="h-5 w-5 text-indigo-600" />
                Upload Teaching Material
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unit 2: Linear Equations Syllabus"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="55555555-5555-5555-5555-555555555001">Grade 10 Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select File (PDF, DOCX, Image, Question Paper)
                </label>
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Extracted Curriculum Text (Used for AI Assessment Suggestions)
                </label>
                <textarea
                  rows={4}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text appears here..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 font-mono focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processing & Storing...' : 'Save to Resources Bucket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">{previewResource.title}</h3>
                <span className="text-xs text-slate-500">{previewResource.fileName}</span>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {previewResource.extractedText || 'No text content extracted for this resource.'}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Link
                href={`/staff/assessments/builder?resourceId=${previewResource.id}`}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-xs"
              >
                Use to Generate AI Questions
              </Link>
              <button
                onClick={() => setPreviewResource(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
