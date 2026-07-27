import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTool } from '../types';

interface NavbarProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTool, setActiveTool, savedCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTool('lesson_plan')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-100">AI Teacher Assistant</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Pro Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Intelligent Co-Pilot for Educators</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTool('library')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTool === 'library'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            <span>Saved Library</span>
            {savedCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-indigo-500/30 text-indigo-200 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTool('chat')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTool === 'chat'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800 hover:bg-indigo-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Ask AI Co-Pilot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
