import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  Trash2,
  Download,
  Eye,
  FileText,
  BookOpen,
  FileQuestion,
  Table,
  CheckSquare,
  Layers,
  Mail,
  HeartHandshake,
  X,
  Copy
} from 'lucide-react';
import { SavedAsset, ActiveTool } from '../types';
import { getSavedAssets, deleteAsset, clearAllAssets } from '../lib/storage';

interface SavedLibraryViewProps {
  onLoadAsset: (type: ActiveTool, data: any) => void;
}

export const SavedLibraryView: React.FC<SavedLibraryViewProps> = ({ onLoadAsset }) => {
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<SavedAsset | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAssets(getSavedAssets());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteAsset(id);
    setAssets(updated);
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved library items?')) {
      clearAllAssets();
      setAssets([]);
      setSelectedAsset(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `teacher_assistant_library_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredAssets = assets.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getToolIcon = (type: ActiveTool) => {
    switch (type) {
      case 'lesson_plan':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'quiz':
        return <FileQuestion className="w-4 h-4 text-sky-600" />;
      case 'rubric':
        return <Table className="w-4 h-4 text-emerald-600" />;
      case 'grader':
        return <CheckSquare className="w-4 h-4 text-purple-600" />;
      case 'differentiation':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'parent_email':
        return <Mail className="w-4 h-4 text-rose-600" />;
      case 'accommodation':
        return <HeartHandshake className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCopyJson = () => {
    if (!selectedAsset) return;
    navigator.clipboard.writeText(JSON.stringify(selectedAsset.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-xl border border-slate-700">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Saved Teacher Library</h1>
            <p className="text-slate-300 text-sm">Access, export, and manage your saved lesson plans, rubrics, and quizzes.</p>
          </div>
        </div>

        {assets.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Library (JSON)</span>
            </button>
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved assets..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lesson_plan', label: 'Lessons' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'rubric', label: 'Rubrics' },
            { id: 'grader', label: 'Grades' },
            { id: 'differentiation', label: 'Tiers' },
            { id: 'parent_email', label: 'Emails' },
            { id: 'accommodation', label: 'IEP/504' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
                    {getToolIcon(asset.type)}
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {asset.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize font-medium text-[11px] text-slate-600">
                  {asset.type.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors text-slate-400"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700">No Saved Items Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery || filterType !== 'all'
              ? 'No items match your search or filter criteria.'
              : 'When you save lesson plans, quizzes, rubrics, or emails, they will appear here in your permanent local library.'}
          </p>
        </div>
      )}

      {/* Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                {getToolIcon(selectedAsset.type)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedAsset.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Saved on {new Date(selectedAsset.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono bg-slate-900 text-emerald-400 rounded-b-xl">
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {JSON.stringify(selectedAsset.data, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
