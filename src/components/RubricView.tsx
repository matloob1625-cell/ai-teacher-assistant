import React, { useState } from 'react';
import {
  Table,
  Sparkles,
  Bookmark,
  Copy,
  Printer,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { RubricData } from '../types';
import { generateRubric } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface RubricViewProps {
  onSaveSuccess: () => void;
}

export const RubricView: React.FC<RubricViewProps> = ({ onSaveSuccess }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('Persuasive Research Essay');
  const [subject, setSubject] = useState('English Language Arts');
  const [gradeLevel, setGradeLevel] = useState('8th Grade');
  const [scale, setScale] = useState('4-Point Scale (Exemplary, Proficient, Developing, Novice)');
  const [criteriaInput, setCriteriaInput] = useState('Thesis Statement, Evidence & Support, Structure & Transitions, Grammar & Mechanics');
  const [promptDetails, setPromptDetails] = useState('Students write a 3-page persuasive essay advocating for a community change using at least 3 cited sources.');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rubric, setRubric] = useState<RubricData | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    const criteriaList = criteriaInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const data = await generateRubric({
        assignmentTitle,
        subject,
        gradeLevel,
        scale,
        criteriaList,
        promptDetails,
      });
      setRubric(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate rubric.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!rubric) return;
    saveAsset(rubric.title, 'rubric', rubric);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    if (!rubric) return;
    let text = `RUBRIC: ${rubric.title}\nAssignment: ${rubric.assignmentDescription}\nLevels: ${rubric.scaleLevels.join(' | ')}\n\n`;
    rubric.criteria.forEach((c) => {
      text += `CRITERIA: ${c.categoryName} (${c.weight})\n`;
      c.descriptors.forEach((d) => {
        text += `  [${d.levelName} - ${d.score}pts]: ${d.description}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Rubric Matrix Builder</h1>
            <p className="text-emerald-200 text-sm">Generate objective, transparent grading rubrics with descriptive criteria.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Rubric Criteria
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Science Fair Poster Project"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. History"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 8th Grade"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scale Scale Format</label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="4-Point Scale (Exemplary, Proficient, Developing, Novice)">
                  4-Point Scale (Exemplary, Proficient, Developing, Novice)
                </option>
                <option value="3-Point Scale (Exceeds Standards, Meets Standards, Below Standards)">
                  3-Point Scale (Exceeds, Meets, Below)
                </option>
                <option value="5-Point Scale (5=Superior to 1=Unsatisfactory)">
                  5-Point Scale (5 to 1 Rating)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluation Categories (Comma separated)</label>
              <textarea
                value={criteriaInput}
                onChange={(e) => setCriteriaInput(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Thesis, Evidence, Organization, Conventions"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Description / Context</label>
              <textarea
                value={promptDetails}
                onChange={(e) => setPromptDetails(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Provide brief background on the assignment expectations"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Building Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Rubric Matrix</span>
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

        {/* Matrix Preview Column */}
        <div className="lg:col-span-8 space-y-4">
          {rubric ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 print:p-0 print:border-none">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Grading Rubric Matrix</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-colors ${
                      saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save Rubric'}</span>
                  </button>
                </div>
              </div>

              {/* Rubric Content */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{rubric.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">{rubric.assignmentDescription}</p>
                </div>

                {/* Table Matrix */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-800">
                        <th className="p-3 font-bold uppercase tracking-wider w-1/5 border-r border-slate-200">
                          Criteria & Weight
                        </th>
                        {rubric.scaleLevels.map((lvl, idx) => (
                          <th key={idx} className="p-3 font-bold uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                            {lvl}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rubric.criteria.map((c, cIdx) => (
                        <tr key={cIdx} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/80">
                            <div>{c.categoryName}</div>
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                              {c.weight}
                            </span>
                          </td>
                          {c.descriptors.map((desc, dIdx) => (
                            <td key={dIdx} className="p-3 border-r border-slate-200 last:border-r-0 align-top text-slate-700 space-y-1">
                              <span className="font-bold text-slate-900 block text-[11px] text-emerald-800">
                                {desc.score} pts
                              </span>
                              <p className="leading-relaxed text-[11px]">{desc.description}</p>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <Table className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Rubric Built Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Specify assignment details and evaluation categories on the left to generate an objective scoring grid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
