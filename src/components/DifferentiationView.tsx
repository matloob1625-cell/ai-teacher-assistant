import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  BookOpen,
  Bookmark,
  Copy,
  AlertCircle,
  HelpCircle,
  Sparkle,
  Globe
} from 'lucide-react';
import { DifferentiationData } from '../types';
import { differentiateContent } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface DifferentiationViewProps {
  onSaveSuccess: () => void;
}

export const DifferentiationView: React.FC<DifferentiationViewProps> = ({ onSaveSuccess }) => {
  const [originalTextOrConcept, setOriginalTextOrConcept] = useState(
    `Ecosystems rely on a delicate balance between producers, consumers, and decomposers. Producers like green plants convert radiant energy from the sun into chemical energy through photosynthesis. Primary consumers (herbivores) consume producers for energy, while secondary consumers (carnivores or omnivores) hunt primary consumers. Decomposers like fungi and bacteria break down dead organic matter, recycling nutrients back into the soil.`
  );
  const [gradeLevel, setGradeLevel] = useState('6th Grade Science');
  const [additionalNeeds, setAdditionalNeeds] = useState('Include visual drawing prompts for ELL students.');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DifferentiationData | null>(null);
  const [activeTab, setActiveTab] = useState<'tier1' | 'tier2' | 'tier3' | 'ell'>('tier1');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDifferentiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const res = await differentiateContent({
        originalTextOrConcept,
        gradeLevel,
        additionalNeeds,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to differentiate content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!data) return;
    saveAsset(`Differentiation: ${gradeLevel}`, 'differentiation', data);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyCurrent = () => {
    if (!data) return;
    let text = '';
    if (activeTab === 'tier1') {
      text = `BELOW GRADE LEVEL / TIER 1 SUPPORT:
${data.tier1Support.adaptedContent}

GLOSSARY:
${data.tier1Support.vocabularyGlossary.map((v) => `• ${v}`).join('\n')}

SCAFFOLDS:
${data.tier1Support.scaffoldsAndPrompts.map((s) => `• ${s}`).join('\n')}`;
    } else if (activeTab === 'tier2') {
      text = `ON GRADE LEVEL:
${data.tier2OnLevel.adaptedContent}

QUESTIONS:
${data.tier2OnLevel.comprehensionQuestions.map((q) => `• ${q}`).join('\n')}`;
    } else if (activeTab === 'tier3') {
      text = `ABOVE GRADE LEVEL / ENRICHMENT:
${data.tier3Enrichment.adaptedContent}

ENRICHMENT ACTIVITIES:
${data.tier3Enrichment.extensionActivities.map((a) => `• ${a}`).join('\n')}`;
    } else {
      text = `ELL / ESL SUPPORT:
${data.ellSupport.adaptedContent}

SENTENCE FRAMES:
${data.ellSupport.sentenceFrames.map((f) => `• ${f}`).join('\n')}

VISUAL IDEAS:
${data.ellSupport.visualSupportIdeas.map((v) => `• ${v}`).join('\n')}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Tiered Content Differentiator</h1>
            <p className="text-amber-200 text-sm">Instantly adapt passages and tasks into 4 tailored learning levels.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Original Lesson Material
          </h2>

          <form onSubmit={handleDifferentiate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Grade Level</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. 5th Grade Reading, 9th Grade Biology"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Reading Passage or Concept</label>
              <textarea
                value={originalTextOrConcept}
                onChange={(e) => setOriginalTextOrConcept(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Paste the original article, textbook snippet, or lesson core..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Student Needs / Context</label>
              <textarea
                value={additionalNeeds}
                onChange={(e) => setAdditionalNeeds(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Focus on Spanish vocabulary glossaries, simple sentence structures"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Differentiating Material...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 4 Tiered Adaptations</span>
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

        {/* Output Column with Tier Tabs */}
        <div className="lg:col-span-7 space-y-4">
          {data ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Adaptation Summary: {data.originalSummary}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCurrent}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied Tab!' : 'Copy Current Tab'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-colors ${
                      saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save All Tiers'}</span>
                  </button>
                </div>
              </div>

              {/* Tier Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: 'tier1', label: 'Below Level / Scaffolded', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                  { id: 'tier2', label: 'On Grade Level', color: 'bg-sky-100 text-sky-900 border-sky-300' },
                  { id: 'tier3', label: 'Enrichment / Advanced', color: 'bg-purple-100 text-purple-900 border-purple-300' },
                  { id: 'ell', label: 'ELL / ESL Supports', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      activeTab === t.id
                        ? `${t.color} shadow-sm scale-105`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="space-y-4">
                {activeTab === 'tier1' && (
                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-amber-950 mb-1">{data.tier1Support.levelName}</h3>
                      <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-amber-100">
                        {data.tier1Support.adaptedContent}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-amber-900 mb-1">Vocabulary Glossary</h4>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {data.tier1Support.vocabularyGlossary.map((v, idx) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-amber-900 mb-1">Scaffolds & Graphic Organizer Hints</h4>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {data.tier1Support.scaffoldsAndPrompts.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'tier2' && (
                  <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-sky-950 mb-1">{data.tier2OnLevel.levelName}</h3>
                      <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-sky-100">
                        {data.tier2OnLevel.adaptedContent}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-sky-900 mb-1">Check-In Comprehension Questions</h4>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {data.tier2OnLevel.comprehensionQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'tier3' && (
                  <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-purple-950 mb-1">{data.tier3Enrichment.levelName}</h3>
                      <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-purple-100">
                        {data.tier3Enrichment.adaptedContent}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-purple-900 mb-1">Higher-Order Extension Activities</h4>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {data.tier3Enrichment.extensionActivities.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'ell' && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 mb-1">{data.ellSupport.levelName}</h3>
                      <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
                        {data.ellSupport.adaptedContent}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 mb-1">Sentence Frames for Discussion & Writing</h4>
                      <div className="space-y-1">
                        {data.ellSupport.sentenceFrames.map((f, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border border-emerald-100 text-xs font-mono text-emerald-950">
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 mb-1">Visual Support & Gesture Ideas</h4>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {data.ellSupport.visualSupportIdeas.map((v, idx) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Content Differentiated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Paste your core text passage or topic on the left to generate 4 customized learning levels for your classroom.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
