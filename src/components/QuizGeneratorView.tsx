import React, { useState } from 'react';
import {
  FileQuestion,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Bookmark,
  Copy,
  Printer,
  AlertCircle,
  Award
} from 'lucide-react';
import { QuizData } from '../types';
import { generateQuiz } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface QuizGeneratorViewProps {
  onSaveSuccess: () => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({ onSaveSuccess }) => {
  const [topic, setTopic] = useState('Ecosystems & Food Webs');
  const [gradeLevel, setGradeLevel] = useState('6th Grade Science');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionTypes, setQuestionTypes] = useState<string[]>([
    'multiple_choice',
    'short_answer',
    'true_false'
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('Include 1 higher-order thinking essay prompt.');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleType = (type: string) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length === 1) return; // Keep at least one
      setQuestionTypes(questionTypes.filter((t) => t !== type));
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const data = await generateQuiz({
        topic,
        gradeLevel,
        questionCount,
        difficulty,
        questionTypes,
        specialInstructions,
      });
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!quiz) return;
    saveAsset(quiz.title, 'quiz', quiz);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    if (!quiz) return;
    const text = `ASSESSMENT: ${quiz.title}
Grade: ${quiz.gradeLevel} | Topic: ${quiz.topic}
Instructions: ${quiz.instructions}

${quiz.questions
  .map(
    (q, idx) =>
      `Q${idx + 1} (${q.points} pts): ${q.questionText}\n${
        q.options ? q.options.map((o) => `   ${o}`).join('\n') + '\n' : ''
      }${
        showAnswerKey
          ? `[ANSWER KEY]: ${q.correctAnswer}\n[EXPLANATION]: ${q.explanation}\n`
          : '\n'
      }`
  )
  .join('\n')}`;
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
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-sky-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-400/30">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Quiz & Worksheet Generator</h1>
            <p className="text-sky-200 text-sm">Create customizable assessments with instant answer keys & student printouts.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Assessment Builder
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Chapter</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g. World War I, Quadratic Equations"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g. 8th Grade, High School Chemistry"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={12}>12 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Easy / Introductory">Easy / Introductory</option>
                  <option value="Medium / Standard">Medium / Standard</option>
                  <option value="Challenging / Advanced">Challenging / Advanced</option>
                  <option value="Mixed Levels">Mixed Levels</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Question Formats</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'multiple_choice', label: 'Multiple Choice' },
                  { id: 'short_answer', label: 'Short Answer' },
                  { id: 'true_false', label: 'True / False' },
                  { id: 'essay', label: 'Essay / Open Prompt' },
                  { id: 'fill_blank', label: 'Fill-in-the-Blank' },
                ].map((item) => {
                  const active = questionTypes.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleType(item.id)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition-colors ${
                        active
                          ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '} {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Formatting / Focus Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="Include word bank, highlight key vocabulary, etc."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Quiz & Key</span>
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

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {quiz ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 print:p-0 print:border-none">
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 print:hidden">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                      showAnswerKey
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswerKey ? 'Teacher View (Key Visible)' : 'Student View (Key Hidden)'}</span>
                  </button>
                </div>

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
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save Quiz'}</span>
                  </button>
                </div>
              </div>

              {/* Printable Quiz Worksheet Sheet */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      {quiz.gradeLevel} • {quiz.topic}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Name: ____________________ Date: ________
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{quiz.title}</h2>
                  <p className="text-xs text-slate-600 mt-1 italic">Instructions: {quiz.instructions}</p>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {quiz.questions.map((q, idx) => (
                    <div key={q.id || idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {idx + 1}. {q.questionText}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 text-slate-600 rounded-full shrink-0 ml-2">
                          {q.points} {q.points === 1 ? 'pt' : 'pts'}
                        </span>
                      </div>

                      {/* Options for MC */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Line prompt for short answer / essay if key is hidden */}
                      {!showAnswerKey && (q.type === 'short_answer' || q.type === 'essay' || q.type === 'fill_blank') && (
                        <div className="pt-2">
                          <div className="w-full border-b border-dashed border-slate-300 h-6" />
                          <div className="w-full border-b border-dashed border-slate-300 h-6" />
                        </div>
                      )}

                      {/* Answer Key Box (Visible when teacher mode enabled) */}
                      {showAnswerKey && (
                        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1 print:hidden">
                          <div className="flex items-center space-x-1 font-bold text-amber-900">
                            <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Correct Answer: {q.correctAnswer}</span>
                          </div>
                          <p className="text-amber-950 text-xs leading-relaxed pl-4">
                            <span className="font-semibold">Teacher Explanation: </span>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Assessment Built Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select your question formats, count, and topic on the left to generate a complete quiz with answer keys.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
