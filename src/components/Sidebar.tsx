import React from 'react';
import {
  BookOpen,
  FileQuestion,
  Table,
  CheckSquare,
  Layers,
  Mail,
  HeartHandshake,
  MessageSquare,
  FolderKanban
} from 'lucide-react';
import { ActiveTool } from '../types';

interface SidebarProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  const tools = [
    {
      id: 'lesson_plan' as ActiveTool,
      label: 'Lesson Plan Builder',
      description: 'Standards-aligned lesson plans',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      activeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'quiz' as ActiveTool,
      label: 'Quiz & Test Generator',
      description: 'MCQ, short answer & keys',
      icon: FileQuestion,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      activeColor: 'bg-sky-600 text-white',
    },
    {
      id: 'rubric' as ActiveTool,
      label: 'Rubric Matrix Builder',
      description: 'Multi-criteria rating grids',
      icon: Table,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      activeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'grader' as ActiveTool,
      label: 'Auto-Grader & Feedback',
      description: 'Instant student essay evaluation',
      icon: CheckSquare,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      activeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'differentiation' as ActiveTool,
      label: 'Tiered Differentiation',
      description: 'Below, On, Above & ELL versions',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      activeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'parent_email' as ActiveTool,
      label: 'Parent Email Drafter',
      description: 'Praise, behavior & updates',
      icon: Mail,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      activeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'accommodation' as ActiveTool,
      label: 'IEP & Accommodation Helper',
      description: 'Behavior & learning strategies',
      icon: HeartHandshake,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      activeColor: 'bg-teal-600 text-white',
    },
    {
      id: 'chat' as ActiveTool,
      label: 'Teacher Co-Pilot Chat',
      description: 'Pedagogy & planning advice',
      icon: MessageSquare,
      color: 'text-violet-600 bg-violet-50 border-violet-200',
      activeColor: 'bg-violet-600 text-white',
    },
    {
      id: 'library' as ActiveTool,
      label: 'My Saved Library',
      description: 'Stored materials & downloads',
      icon: FolderKanban,
      color: 'text-slate-600 bg-slate-100 border-slate-200',
      activeColor: 'bg-slate-800 text-white',
    },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-slate-200 shrink-0 p-4 space-y-2">
      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Pedagogical Tools
      </div>
      <nav className="space-y-1">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`w-full flex items-start space-x-3 p-3 rounded-xl transition-all text-left ${
                isActive
                  ? `${t.activeColor} shadow-md`
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : t.color
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-snug truncate">{t.label}</p>
                <p
                  className={`text-xs truncate ${
                    isActive ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-slate-200 px-3">
        <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 space-y-1">
          <p className="font-semibold text-indigo-950 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            AI Model Online
          </p>
          <p className="text-slate-600">Powered by Gemini 3.6 Flash server-side engine.</p>
        </div>
      </div>
    </aside>
  );
};
