import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Award,
  ThumbsUp,
  Target,
  TrendingUp,
  Copy,
  Bookmark,
  AlertCircle,
  FileText
} from 'lucide-react';
import { GradingData } from '../types';
import { gradeAssignment } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface AutoGraderViewProps {
  onSaveSuccess: () => void;
}

export const AutoGraderView: React.FC<AutoGraderViewProps> = ({ onSaveSuccess }) => {
  const [assignmentPrompt, setAssignmentPrompt] = useState(
    'Write a 3-paragraph essay explaining how renewable energy sources like solar and wind power reduce carbon emissions compared to fossil fuels.'
  );
  const [rubricOrCriteria, setRubricOrCriteria] = useState(
    '1. Scientific Accuracy (40%)\n2. Evidence & Examples (30%)\n3. Writing Clarity & Structure (30%)'
  );
  const [maxScore, setMaxScore] = useState(100);
  const [studentSubmission, setStudentSubmission] = useState(
    `Renewable energy is energy that comes from natural resources like sunlight, wind, and rain. Fossil fuels like coal and oil release a lot of greenhouse gases when burned. Solar power uses photovoltaic panels to convert sunlight directly into electricity without burning anything, which means zero emissions during operation.

Similarly, wind turbines harness kinetic energy from wind to turn generators. By replacing coal plants with wind farms, cities can generate clean electricity. For instance, Denmark generates over 50% of its power from wind.

In conclusion, transitioning to solar and wind power helps stop climate change because they generate power cleanly without releasing harmful carbon pollution into our atmosphere.`
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grading, setGrading] = useState<GradingData | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const result = await gradeAssignment({
        assignmentPrompt,
        studentSubmission,
        rubricOrCriteria,
        maxScore,
      });
      setGrading(result);
    } catch (err: any) {
      setError(err.message || 'Failed to grade submission.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!grading) return;
    saveAsset(`Grading: ${grading.assignedScore}/${grading.maxScore} (${grading.overallGradeLetter})`, 'grader', grading);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyNote = () => {
    if (!grading) return;
    const text = `STUDENT FEEDBACK & GRADE
Score: ${grading.assignedScore} / ${grading.maxScore} (${grading.percentage}% - Letter Grade: ${grading.overallGradeLetter})

TEACHER SUMMARY:
${grading.summaryAssessment}

STRENGTHS:
${grading.keyStrengths.map((s) => `• ${s}`).join('\n')}

AREAS FOR GROWTH:
${grading.areasForImprovement.map((a) => `• ${a}`).join('\n')}

STUDENT NOTE:
${grading.studentFacingNote}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-purple-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-400/30">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Assignment Auto-Grader & Feedback</h1>
            <p className="text-purple-200 text-sm">Evaluate student essays instantly against rubrics with constructive growth feedback.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Grading Inputs
          </h2>

          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Prompt</label>
              <textarea
                value={assignmentPrompt}
                onChange={(e) => setAssignmentPrompt(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="What were students instructed to write or solve?"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rubric / Criteria</label>
                <textarea
                  value={rubricOrCriteria}
                  onChange={(e) => setRubricOrCriteria(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Key scoring criteria..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Score</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Submission Text</label>
              <textarea
                value={studentSubmission}
                onChange={(e) => setStudentSubmission(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
                placeholder="Paste the student's essay or response here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Submission...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Grade & Generate Feedback</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Feedback Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {grading ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
              {/* Score Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                    {grading.overallGradeLetter}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-900">
                        {grading.assignedScore} / {grading.maxScore}
                      </span>
                      <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {grading.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{grading.summaryAssessment}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyNote}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                    <span>{copied ? 'Copied Note!' : 'Copy Note'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-colors ${
                      saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save Result'}</span>
                  </button>
                </div>
              </div>

              {/* Strengths & Growth Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" /> Key Strengths
                  </h3>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                    {grading.keyStrengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-600" /> Areas for Growth
                  </h3>
                  <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                    {grading.areasForImprovement.map((area, idx) => (
                      <li key={idx}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Criterion Breakdown Table */}
              {grading.criterionBreakdown && grading.criterionBreakdown.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Criterion Breakdown</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="p-2.5">Criterion</th>
                          <th className="p-2.5 text-center">Score</th>
                          <th className="p-2.5">Feedback Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grading.criterionBreakdown.map((c, idx) => (
                          <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                            <td className="p-2.5 font-semibold text-slate-900">{c.criterion}</td>
                            <td className="p-2.5 text-center font-bold text-purple-700">
                              {c.scoreObtained}/{c.maxCriterionScore}
                            </td>
                            <td className="p-2.5 text-slate-700">{c.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Student Facing Draft Note */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" /> Student-Facing Teacher Feedback
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                  "{grading.studentFacingNote}"
                </p>
              </div>

              {/* Actionable Next Steps */}
              {grading.actionableNextSteps && grading.actionableNextSteps.length > 0 && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Actionable Next Steps for Student:
                  </span>
                  <ul className="list-disc list-inside text-indigo-950 space-y-1 pt-1">
                    {grading.actionableNextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Student Work Graded Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Paste student work and optional rubric guidelines on the left to generate detailed grading scores and growth feedback.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
