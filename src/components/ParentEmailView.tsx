import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Phone,
  Bookmark,
  Copy,
  AlertCircle,
  MessageSquareText,
  UserCheck
} from 'lucide-react';
import { ParentEmailData } from '../types';
import { draftParentEmail } from '../lib/api';
import { saveAsset } from '../lib/storage';

interface ParentEmailViewProps {
  onSaveSuccess: () => void;
}

export const ParentEmailView: React.FC<ParentEmailViewProps> = ({ onSaveSuccess }) => {
  const [studentName, setStudentName] = useState('Alex Taylor');
  const [parentName, setParentName] = useState('Ms. Taylor');
  const [reasonCategory, setReasonCategory] = useState('Academic Praise & Outstanding Progress');
  const [keyDetails, setKeyDetails] = useState(
    'Alex earned 100% on the science unit test and volunteered to help peer partners with their lab setup.'
  );
  const [desiredOutcome, setDesiredOutcome] = useState('Share positive feedback and encourage continued engagement.');
  const [tone, setTone] = useState('Warm, encouraging, and enthusiastic');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailData, setEmailData] = useState<ParentEmailData | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setSaved(false);

    try {
      const res = await draftParentEmail({
        studentName,
        parentName,
        reasonCategory,
        keyDetails,
        desiredOutcome,
        tone,
      });
      setEmailData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to draft email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!emailData) return;
    saveAsset(`Email re: ${studentName}`, 'parent_email', emailData);
    setSaved(true);
    onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyEmail = () => {
    if (!emailData) return;
    const text = `SUBJECT: ${emailData.subjectLine}\n\n${emailData.emailBody}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-rose-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-400/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Parent Email & Communication Drafter</h1>
            <p className="text-rose-200 text-sm">Craft respectful, clear, and empathetic updates for home-school collaboration.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            Communication Details
          </h2>

          <form onSubmit={handleDraft} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parent/Guardian Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Reason</label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                <option value="Academic Praise & Outstanding Progress">Academic Praise & Outstanding Progress</option>
                <option value="Behavioral Concern & Classroom Interventions">Behavioral Concern & Classroom Interventions</option>
                <option value="Missing Homework / Project Deadline">Missing Homework / Project Deadline</option>
                <option value="IEP / 504 Plan Progress Update">IEP / 504 Plan Progress Update</option>
                <option value="Upcoming Field Trip / Class Announcement">Upcoming Field Trip / Class Announcement</option>
                <option value="Attendance / Tardiness Notice">Attendance / Tardiness Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Communication Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                <option value="Warm, encouraging, and enthusiastic">Warm, encouraging, and enthusiastic</option>
                <option value="Professional, direct, and constructive">Professional, direct, and constructive</option>
                <option value="Gentle, supportive, and empathetic">Gentle, supportive, and empathetic</option>
                <option value="Urgent, clear, and action-oriented">Urgent, clear, and action-oriented</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Context / Specific Incidents</label>
              <textarea
                value={keyDetails}
                onChange={(e) => setKeyDetails(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="Mention what happened or specific scores..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Desired Outcome / Next Steps</label>
              <input
                type="text"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Schedule quick 10-min phone call"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Draft Parent Email</span>
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

        {/* Draft Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {emailData ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parent Email Draft</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-rose-600" />
                    <span>{copied ? 'Copied Email!' : 'Copy Email'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-colors ${
                      saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved!' : 'Save Email'}</span>
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-500 shrink-0 uppercase">Subject:</span>
                <span className="text-xs font-semibold text-slate-900">{emailData.subjectLine}</span>
              </div>

              {/* Email Body Card */}
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span>To: {parentName || 'Parent/Guardian'}</span>
                  <span>Re: {studentName}</span>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-lg border border-slate-200 shadow-inner">
                  {emailData.emailBody}
                </div>
              </div>

              {/* Phone Call Script Brief */}
              {emailData.phoneScriptBrief && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" /> Quick Phone Call Script (If calling instead):
                  </span>
                  <p className="text-indigo-950 italic">{emailData.phoneScriptBrief}</p>
                </div>
              )}

              {/* Follow-Up Suggestions */}
              {emailData.followUpSuggestions && emailData.followUpSuggestions.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-rose-600" /> Follow-Up Suggestions for Teacher:
                  </span>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 pt-1">
                    {emailData.followUpSuggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <Mail className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">No Email Drafted Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Fill in student details and communication reason on the left to generate a polished email and call script.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
