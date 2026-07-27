import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  Bookmark,
  Copy,
  Printer,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { LessonPlanData } from '../types';
import { generateLessonPlan } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface LessonPlanViewProps {
  onSaveSuccess: () => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({ onSaveSuccess }) => {
  const [subject, setSubject] = useState('Science');
  const [gradeLevel, setGradeLevel] = useState('7th Grade');
  const [topic, setTopic] = useState('Photosynthesis and Plant Cellular Respiration');
  const [duration, setDuration] = useState('60 minutes');
  const [standards, setStandards] = useState('MS-LS1-6 (NGSS): Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy.');
  const [learningObjectives, setLearningObjectives] = useState('Students will be able to model the inputs and outputs of photosynthesis and explain how plants convert light energy into chemical energy.');
  const [specialRequirements, setSpecialRequirements] = useState('Include hands-on diagram activity and sentence stems for English learners.');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanData | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const data = await generateLessonPlan({
        subject,
        gradeLevel,
        topic,
        duration,
        standards,
        learningObjectives,
        specialRequirements,
      });
      setLessonPlan(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate lesson plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!lessonPlan) return;
    saveAsset(lessonPlan.title, 'lesson_plan', lessonPlan);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    if (!lessonPlan) return;
    const text = `LESSON PLAN: ${lessonPlan.title}
Subject: ${lessonPlan.subject} | Grade: ${lessonPlan.gradeLevel} | Duration: ${lessonPlan.duration}

SUMMARY:
${lessonPlan.summary}

OBJECTIVES:
${lessonPlan.learningObjectives.map((o) => `• ${o}`).join('\n')}

MATERIALS NEEDED:
${lessonPlan.materialsNeeded.map((m) => `• ${m}`).join('\n')}

PROCEDURE:
- Hook (${lessonPlan.procedure.hookMinutes}): ${lessonPlan.procedure.hookDescription}
- Direct Instruction (${lessonPlan.procedure.directInstructionMinutes}): ${lessonPlan.procedure.directInstructionDescription}
- Guided Practice (${lessonPlan.procedure.guidedPracticeMinutes}): ${lessonPlan.procedure.guidedPracticeDescription}
- Independent Practice (${lessonPlan.procedure.independentPracticeMinutes}): ${lessonPlan.procedure.independentPracticeDescription}
- Closure (${lessonPlan.procedure.closureMinutes}): ${lessonPlan.procedure.closureDescription}

FORMATIVE ASSESSMENT:
${lessonPlan.formativeAssessment}

DIFFERENTIATION:
- Support: ${lessonPlan.differentiationStrategies.supportForStruggling}
- Extension: ${lessonPlan.differentiationStrategies.extensionForAdvanced}
- ELL: ${lessonPlan.differentiationStrategies.ellAccommodations}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Lesson Plan Generator</h1>
            <p className="text-indigo-200 text-sm">Design structured, standards-aligned, differentiated lesson plans in seconds.</p>
          </div>
        </div>
      </div>

      {/* Input Form & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Lesson Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Science, Math, History"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 7th Grade, High School"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Photosynthesis, Fractions, Civil War"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. 45 min, 90 min block"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Educational Standards</label>
              <textarea
                value={standards}
                onChange={(e) => setStandards(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Common Core, NGSS, or state curriculum code"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Objectives (SWBAT)</label>
              <textarea
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Students will be able to..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requirements / Accommodations</label>
              <textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Hands-on activity, lab, ELL sentence frames, etc."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting Lesson Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Lesson Plan</span>
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

        {/* Right Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          {lessonPlan ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 print:p-0 print:border-none">
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 print:hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Generated Lesson Plan</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
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
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved to Library!' : 'Save Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Plan Card Output */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-md">
                      {lessonPlan.subject}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-md">
                      {lessonPlan.gradeLevel}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lessonPlan.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{lessonPlan.title}</h2>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{lessonPlan.summary}</p>
                </div>

                {/* Standards & Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standards Aligned
                    </h3>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {lessonPlan.standards.map((st, idx) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-indigo-600" /> Learning Objectives (SWBAT)
                    </h3>
                    <ul className="text-xs text-indigo-950 space-y-1 list-disc list-inside">
                      {lessonPlan.learningObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Essential Questions & Materials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Essential Questions
                    </h3>
                    <ul className="space-y-1.5">
                      {lessonPlan.essentialQuestions.map((q, idx) => (
                        <li key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-200 italic">
                          "{q}"
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> Materials & Prep
                    </h3>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {lessonPlan.materialsNeeded.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Vocabulary Words */}
                {lessonPlan.vocabularyWords && lessonPlan.vocabularyWords.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Key Vocabulary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lessonPlan.vocabularyWords.map((v, idx) => (
                        <div key={idx} className="p-2.5 bg-sky-50/50 border border-sky-100 rounded-lg">
                          <span className="font-bold text-sky-900 text-xs">{v.word}: </span>
                          <span className="text-xs text-slate-700">{v.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lesson Procedure Timeline */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" /> Step-By-Step Procedure
                  </h3>
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100">
                    {[
                      { title: 'Hook / Warm-Up', min: lessonPlan.procedure.hookMinutes, desc: lessonPlan.procedure.hookDescription, color: 'bg-amber-500' },
                      { title: 'Direct Instruction', min: lessonPlan.procedure.directInstructionMinutes, desc: lessonPlan.procedure.directInstructionDescription, color: 'bg-indigo-500' },
                      { title: 'Guided Practice', min: lessonPlan.procedure.guidedPracticeMinutes, desc: lessonPlan.procedure.guidedPracticeDescription, color: 'bg-sky-500' },
                      { title: 'Independent Practice', min: lessonPlan.procedure.independentPracticeMinutes, desc: lessonPlan.procedure.independentPracticeDescription, color: 'bg-purple-500' },
                      { title: 'Closure & Exit Ticket', min: lessonPlan.procedure.closureMinutes, desc: lessonPlan.procedure.closureDescription, color: 'bg-emerald-500' },
                    ].map((step, idx) => (
                      <div key={idx} className="pl-8 relative">
                        <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ${step.color} ring-4 ring-white`} />
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{step.title}</span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 rounded-full">
                              {step.min}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formative Assessment & Differentiation */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Formative Assessment</h3>
                  <p className="text-xs text-emerald-950">{lessonPlan.formativeAssessment}</p>

                  <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 block">Struggling Learners:</span>
                      <span className="text-slate-700">{lessonPlan.differentiationStrategies.supportForStruggling}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-900 block">Advanced Extensions:</span>
                      <span className="text-slate-700">{lessonPlan.differentiationStrategies.extensionForAdvanced}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-900 block">ELL Supports:</span>
                      <span className="text-slate-700">{lessonPlan.differentiationStrategies.ellAccommodations}</span>
                    </div>
                  </div>
                </div>

                {lessonPlan.homeworkOrFollowUp && (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800">
                    <span className="font-bold">Homework / Extension: </span>
                    <span>{lessonPlan.homeworkOrFollowUp}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Lesson Plan Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Fill in the topic and grade parameters on the left and click "Generate AI Lesson Plan" to create a complete classroom lesson.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
