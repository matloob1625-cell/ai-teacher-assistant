import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Copy,
  AlertCircle,
  ShieldCheck,
  Brain,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { AccommodationData } from '../types';
import { generateAccommodations } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface AccommodationViewProps {
  onSaveSuccess: () => void;
}

export const AccommodationView: React.FC<AccommodationViewProps> = ({ onSaveSuccess }) => {
  const [learningChallenge, setLearningChallenge] = useState('ADHD & Executive Functioning Challenges');
  const [studentProfile, setStudentProfile] = useState('Student struggles with task initiation, multi-step directions, and time management during independent work.');
  const [subjectArea, setSubjectArea] = useState('General Classroom / All Subjects');
  const [gradeLevel, setGradeLevel] = useState('7th Grade');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AccommodationData | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);
    setCheckedItems({});

    try {
      const res = await generateAccommodations({
        studentProfile,
        learningChallenge,
        subjectArea,
        gradeLevel,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate accommodations.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSave = () => {
    if (!data) return;
    saveAsset(`Accommodations: ${learningChallenge}`, 'accommodation', data);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `ACCOMMODATION PLAN: ${data.categoryTitle}
Overview: ${data.overview}

INSTRUCTIONAL ACCOMMODATIONS:
${data.instructionalAccommodations.map((a) => `• ${a}`).join('\n')}

ENVIRONMENTAL MODIFICATIONS:
${data.environmentalModifications.map((m) => `• ${m}`).join('\n')}

ASSESSMENT ACCOMMODATIONS:
${data.assessmentAccommodations.map((a) => `• ${a}`).join('\n')}

BEHAVIOR & FOCUS STRATEGIES:
${data.behaviorAndFocusStrategies.map((b) => `• ${b}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-400/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">IEP & 504 Accommodation Helper</h1>
            <p className="text-teal-200 text-sm">Targeted classroom strategies, behavioral interventions, and teacher check-lists.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Student Needs Profile
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Challenge / Diagnosis</label>
              <select
                value={learningChallenge}
                onChange={(e) => setLearningChallenge(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="ADHD & Executive Functioning Challenges">ADHD & Executive Functioning Challenges</option>
                <option value="Dyslexia & Reading Comprehension Support">Dyslexia & Reading Comprehension Support</option>
                <option value="Dysgraphia & Written Expression Difficulties">Dysgraphia & Written Expression Difficulties</option>
                <option value="Anxiety & School Stress Management">Anxiety & School Stress Management</option>
                <option value="Auditory / Visual Processing Speed Delay">Auditory / Visual Processing Speed Delay</option>
                <option value="Autism Spectrum & Social Communication Needs">Autism Spectrum & Social Communication Needs</option>
                <option value="Behavioral Self-Regulation & Frustration Tolerance">Behavioral Self-Regulation & Frustration Tolerance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Area</label>
                <input
                  type="text"
                  value={subjectArea}
                  onChange={(e) => setSubjectArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Classroom Observations / Triggers</label>
              <textarea
                value={studentProfile}
                onChange={(e) => setStudentProfile(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Describe when the student struggles or what triggers overwhelm..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Accommodation Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Support Strategy</span>
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

        {/* Accommodation Strategy Output */}
        <div className="lg:col-span-7 space-y-4">
          {data ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{data.categoryTitle}</h2>
                  <p className="text-xs text-slate-500">{data.overview}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-teal-600" />
                    <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-colors ${
                      saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Grid of Accommodations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instructional Accommodations */}
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-teal-600" /> Instructional Accommodations
                  </h3>
                  <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside">
                    {data.instructionalAccommodations.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>

                {/* Environmental Modifications */}
                <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-sky-600" /> Seating & Environment
                  </h3>
                  <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside">
                    {data.environmentalModifications.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                {/* Assessment Accommodations */}
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Assessment Accommodations
                  </h3>
                  <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside">
                    {data.assessmentAccommodations.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>

                {/* Behavior & Focus Strategies */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Focus & Behavior Breaks
                  </h3>
                  <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside">
                    {data.behaviorAndFocusStrategies.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Teacher Self-Checklist */}
              {data.teacherSelfChecklist && data.teacherSelfChecklist.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-teal-600" /> Teacher Daily Execution Checklist
                  </h3>
                  <div className="space-y-2">
                    {data.teacherSelfChecklist.map((item, idx) => {
                      const isChecked = !!checkedItems[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleCheck(idx)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center space-x-2.5 ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through opacity-80'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Accommodation Plan Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select the primary student challenge and grade level on the left to receive evidence-based IEP/504 classroom strategies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
