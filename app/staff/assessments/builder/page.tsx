'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { db } from '@/lib/store/mock-db';
import { aiService } from '@/lib/ai/service';
import { Assessment, Question, QuestionType, AssessmentStatus } from '@/lib/types';
import {
  FilePlus,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Send,
  Copy,
  Archive,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Clock,
  BookOpen,
  Sliders,
} from 'lucide-react';

function AssessmentBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const staffId = user?.id || '33333333-3333-3333-3333-333333333002';
  const staffName = user?.fullName || 'Prof. Sarah Jenkins';

  const editId = searchParams.get('id');
  const resourceId = searchParams.get('resourceId');

  const existing = editId ? db.assessments.find((a) => a.id === editId) : null;
  const linkedResource = resourceId ? db.resources.find((r) => r.id === resourceId) : null;

  // Metadata Form State
  const [title, setTitle] = useState(existing?.title || 'Diagnostic: Coordinate Geometry & Systems');
  const [subjectId, setSubjectId] = useState(existing?.subjectId || '55555555-5555-5555-5555-555555555001');
  const [classId, setClassId] = useState(existing?.classId || '44444444-4444-4444-4444-444444444001');
  const [topic, setTopic] = useState(existing?.topic || 'Coordinate Geometry and Linear Systems');
  const [durationMinutes, setDurationMinutes] = useState(existing?.durationMinutes || 45);
  const [dueDate, setDueDate] = useState(
    existing?.dueDate
      ? existing.dueDate.split('T')[0]
      : new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [learningObjective, setLearningObjective] = useState(
    existing?.learningObjective ||
      'Evaluate student mastery in distance formula, coordinate verification, and graphical solutions.'
  );
  const [status, setStatus] = useState<AssessmentStatus>(existing?.status || 'draft');

  // Questions State
  const [questions, setQuestions] = useState<Question[]>(
    existing?.questions && existing.questions.length > 0
      ? existing.questions
      : [
          {
            id: `q-${Date.now()}-1`,
            assessmentId: existing?.id || 'new',
            questionText: 'What is the distance between points P(2, 3) and Q(4, 1)?',
            questionType: 'multiple_choice',
            options: [
              { id: 'A', text: '2√2 units' },
              { id: 'B', text: '4 units' },
              { id: 'C', text: '8 units' },
              { id: 'D', text: '√10 units' },
            ],
            correctAnswer: 'A',
            marks: 5,
            difficulty: 'easy',
            topicTags: ['Coordinate Geometry', 'Distance Formula'],
            explanation: 'Distance = √((4-2)² + (1-3)²) = √(4 + 4) = √8 = 2√2 units.',
            orderIndex: 1,
          },
        ]
  );

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Total Marks Sum
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  // AI Question Generation from resource text
  const handleGenerateAIQuestions = async () => {
    setIsGeneratingAI(true);
    const sourceText =
      linkedResource?.extractedText ||
      `Unit: Coordinate Geometry and Linear Equations.
      Core concepts include finding section points, distance between coordinates, graphical intersections of linear pairs, and discriminant nature of quadratics.`;

    const generated = await aiService.generateQuestionsFromText(sourceText, topic, 3);

    const formatted: Question[] = generated.map((g, idx) => ({
      id: `ai-q-${Date.now()}-${idx}`,
      assessmentId: existing?.id || 'new',
      questionText: g.questionText,
      questionType: g.questionType,
      options: g.options,
      correctAnswer: g.correctAnswer,
      marks: g.marks,
      difficulty: g.difficulty,
      topicTags: g.topicTags,
      explanation: g.explanation,
      orderIndex: questions.length + idx + 1,
    }));

    setQuestions((prev) => [...prev, ...formatted]);
    setIsGeneratingAI(false);
    setNotificationMsg('Generated 3 curriculum-aligned questions using AI service!');
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Add Manual Question
  const handleAddQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: `manual-q-${Date.now()}`,
      assessmentId: existing?.id || 'new',
      questionText: 'Enter your new question description here...',
      questionType: type,
      options:
        type === 'multiple_choice'
          ? [
              { id: 'A', text: 'Option A' },
              { id: 'B', text: 'Option B' },
              { id: 'C', text: 'Option C' },
              { id: 'D', text: 'Option D' },
            ]
          : undefined,
      correctAnswer: type === 'multiple_choice' ? 'A' : '',
      marks: type === 'descriptive' ? 15 : 5,
      difficulty: 'medium',
      topicTags: [topic || 'Mathematics'],
      explanation: 'Detailed solution explanation for student post-assessment review.',
      orderIndex: questions.length + 1,
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof Question, val: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: val };
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Save / Publish / Archive / Duplicate
  const handleSave = (targetStatus: AssessmentStatus) => {
    const newAssessment: Assessment = {
      id: existing?.id || `asm-${Date.now()}`,
      title,
      subjectId,
      subjectName: 'Grade 10 Mathematics',
      classId,
      className: 'Grade 10 - Section A',
      creatorId: staffId,
      creatorName: staffName,
      topic,
      durationMinutes,
      totalMarks,
      passPercentage: 50,
      dueDate: new Date(dueDate).toISOString(),
      learningObjective,
      status: targetStatus,
      questions,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existing) {
      const idx = db.assessments.findIndex((a) => a.id === existing.id);
      if (idx !== -1) {
        db.assessments[idx] = newAssessment;
      }
    } else {
      db.addAssessment(newAssessment);
    }

    setStatus(targetStatus);
    setNotificationMsg(`Assessment successfully saved as ${targetStatus.toUpperCase()}!`);
    setTimeout(() => {
      router.push('/staff/dashboard');
    }, 1200);
  };

  const handleDuplicate = () => {
    const dup: Assessment = {
      id: `asm-dup-${Date.now()}`,
      title: `${title} (Duplicate)`,
      subjectId,
      subjectName: 'Grade 10 Mathematics',
      classId,
      className: 'Grade 10 - Section A',
      creatorId: staffId,
      creatorName: staffName,
      topic,
      durationMinutes,
      totalMarks,
      passPercentage: 50,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      learningObjective,
      status: 'draft',
      questions: questions.map((q, i) => ({ ...q, id: `q-dup-${Date.now()}-${i}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.addAssessment(dup);
    setNotificationMsg('Duplicate created in draft status!');
    setTimeout(() => router.push('/staff/dashboard'), 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 uppercase border border-indigo-100">
              Assessment Builder
            </span>
            <span className="text-xs text-slate-500">
              Current Status: <strong className="text-slate-800">{status.toUpperCase()}</strong>
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl font-heading">
            {existing ? `Edit: ${existing.title}` : 'Author New Assessment'}
          </h1>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Save className="h-4 w-4 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Publish Assessment</span>
          </button>

          {existing && (
            <>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => handleSave(status === 'closed' ? 'published' : 'closed')}
                className="flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{status === 'closed' ? 'Reopen' : 'Close'}</span>
              </button>

              <button
                onClick={() => handleSave('archived')}
                className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-xs"
              >
                <Archive className="h-3.5 w-3.5" />
                <span>Archive</span>
              </button>
            </>
          )}
        </div>
      </div>

      {notificationMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Metadata Form Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Sliders className="h-4 w-4 text-indigo-600" />
          Assessment Metadata & Target Class
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="55555555-5555-5555-5555-555555555001">Grade 10 Mathematics</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="44444444-4444-4444-4444-444444444001">Grade 10 - Section A</option>
              <option value="44444444-4444-4444-4444-444444444002">Grade 10 - Section B</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Topic / Unit</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              min="5"
              max="240"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Total Marks Calculated</label>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-2.5 text-base font-black text-indigo-700">
              {totalMarks} Marks
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block font-bold text-slate-700 mb-1">Learning Objective</label>
            <input
              type="text"
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* AI Question Suggestion Engine */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2 font-heading">
              <Sparkles className="h-4 w-4 text-purple-600" />
              AI Curriculum Question Generator
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {linkedResource
                ? `Ready to synthesize questions from uploaded: "${linkedResource.title}"`
                : 'Synthesizes MCQs, short-answers, and descriptive problems from Grade 10 curriculum standards.'}
            </p>
          </div>

          <button
            onClick={handleGenerateAIQuestions}
            disabled={isGeneratingAI}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Generating Questions...' : 'Generate Questions from Syllabus'}</span>
          </button>
        </div>
      </div>

      {/* Questions List & Authoring Canvas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Questions ({questions.length}) &bull; {totalMarks} Total Marks
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Add Question:</span>
            <button
              onClick={() => handleAddQuestion('multiple_choice')}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              + MCQ
            </button>
            <button
              onClick={() => handleAddQuestion('short_answer')}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              + Short Answer
            </button>
            <button
              onClick={() => handleAddQuestion('descriptive')}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              + Descriptive
            </button>
          </div>
        </div>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold uppercase text-indigo-700 border border-indigo-100">
                  {q.questionType.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <span className="font-bold">Marks:</span>
                  <input
                    type="number"
                    value={q.marks}
                    onChange={(e) => handleUpdateQuestion(idx, 'marks', Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-bold text-slate-900"
                  />
                </div>

                <button
                  onClick={() => handleDeleteQuestion(idx)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Delete question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt</label>
              <textarea
                rows={3}
                value={q.questionText}
                onChange={(e) => handleUpdateQuestion(idx, 'questionText', e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* MCQ Options Editor */}
            {q.questionType === 'multiple_choice' && (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Multiple Choice Options & Correct Answer Selection:
                </span>
                {q.options?.map((opt, optIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctAnswer === opt.id}
                      onChange={() => handleUpdateQuestion(idx, 'correctAnswer', opt.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-white"
                    />
                    <span className="w-5 font-bold text-indigo-700 text-xs">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updatedOpts = [...(q.options || [])];
                        updatedOpts[optIdx] = { ...updatedOpts[optIdx], text: e.target.value };
                        handleUpdateQuestion(idx, 'options', updatedOpts);
                      }}
                      className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Short Answer / Descriptive Answer Key & Rubric */}
            {q.questionType !== 'multiple_choice' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Answer Key / Model Solution
                </label>
                <input
                  type="text"
                  value={q.correctAnswer || ''}
                  onChange={(e) => handleUpdateQuestion(idx, 'correctAnswer', e.target.value)}
                  placeholder="Official answer benchmark..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            )}

            {/* Explanation & Topic Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Solution Explanation</label>
                <input
                  type="text"
                  value={q.explanation || ''}
                  onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                  placeholder="Detailed rationale displayed to student after submission..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={q.topicTags.join(', ')}
                  onChange={(e) =>
                    handleUpdateQuestion(
                      idx,
                      'topicTags',
                      e.target.value.split(',').map((t) => t.trim())
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AssessmentBuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading assessment builder...</div>}>
      <AssessmentBuilderContent />
    </Suspense>
  );
}
