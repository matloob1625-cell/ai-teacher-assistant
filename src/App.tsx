import React, { useState, useEffect } from 'react';
import { ActiveTool } from './types';
import { getSavedAssets } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonPlanView } from './components/LessonPlanView';
import { QuizGeneratorView } from './components/QuizGeneratorView';
import { RubricView } from './components/RubricView';
import { AutoGraderView } from './components/AutoGraderView';
import { DifferentiationView } from './components/DifferentiationView';
import { ParentEmailView } from './components/ParentEmailView';
import { AccommodationView } from './components/AccommodationView';
import { ChatCoPilotView } from './components/ChatCoPilotView';
import { SavedLibraryView } from './components/SavedLibraryView';

export default function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('lesson_plan');
  const [savedCount, setSavedCount] = useState<number>(0);

  const updateSavedCount = () => {
    const assets = getSavedAssets();
    setSavedCount(assets.length);
  };

  useEffect(() => {
    updateSavedCount();
  }, []);

  const handleSaveSuccess = () => {
    updateSavedCount();
  };

  const renderActiveView = () => {
    switch (activeTool) {
      case 'lesson_plan':
        return <LessonPlanView onSaveSuccess={handleSaveSuccess} />;
      case 'quiz':
        return <QuizGeneratorView onSaveSuccess={handleSaveSuccess} />;
      case 'rubric':
        return <RubricView onSaveSuccess={handleSaveSuccess} />;
      case 'grader':
        return <AutoGraderView onSaveSuccess={handleSaveSuccess} />;
      case 'differentiation':
        return <DifferentiationView onSaveSuccess={handleSaveSuccess} />;
      case 'parent_email':
        return <ParentEmailView onSaveSuccess={handleSaveSuccess} />;
      case 'accommodation':
        return <AccommodationView onSaveSuccess={handleSaveSuccess} />;
      case 'chat':
        return <ChatCoPilotView />;
      case 'library':
        return (
          <SavedLibraryView
            onLoadAsset={(type) => {
              setActiveTool(type);
            }}
          />
        );
      default:
        return <LessonPlanView onSaveSuccess={handleSaveSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeTool={activeTool} setActiveTool={setActiveTool} savedCount={savedCount} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

        {/* Content Workspace */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-6 text-xs text-center">
        <p className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AI Teacher Assistant — Empowering educators with AI tools.</span>
          <span className="text-slate-500">Built with Google Gemini 3.6 Flash & React 19</span>
        </p>
      </footer>
    </div>
  );
}
