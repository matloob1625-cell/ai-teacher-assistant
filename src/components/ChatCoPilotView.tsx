import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../lib/api';

export const ChatCoPilotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello Educator! 👋 I'm your AI Teacher Co-Pilot. I can help you brainstorm classroom activities, design substitute plans, draft rubric criteria, refine classroom management strategies, or explain complex subjects simply. What are you working on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Give me 5 creative 5-minute warm-up activities for 8th Grade Math.',
    'Draft a detailed Substitute Teacher Plan for 5th Grade Science (Ecosystems).',
    'How can I de-escalate a talkative classroom during group work transition?',
    'Suggest 3 hands-on history projects for Ancient Greece with low materials.',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const replyText = await sendChatMessage(newHistory);
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message || 'Unable to connect.'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-violet-800 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-violet-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-500/20 text-violet-300 rounded-xl border border-violet-400/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI Teacher Co-Pilot</h1>
            <p className="text-violet-200 text-xs">Instant pedagogical advice, quick idea generation, & classroom support.</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: "Hello Educator! 👋 What can I help you plan or solve today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="px-3 py-1.5 bg-violet-950/80 border border-violet-700/60 hover:bg-violet-900 text-violet-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="p-2.5 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 rounded-xl text-left text-xs text-slate-700 transition-all flex items-start space-x-2 group shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-violet-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="line-clamp-2">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow ${
                  isUser ? 'bg-slate-800' : 'bg-gradient-to-tr from-violet-600 to-indigo-500'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.content}
                </div>

                <div
                  className={`flex items-center space-x-2 text-[10px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-slate-600 transition-colors flex items-center gap-1"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="px-4 py-2.5 bg-slate-100 rounded-2xl rounded-tl-none text-xs text-slate-600 flex items-center space-x-2">
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-ping" />
              <span>Teacher Co-Pilot is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Teacher Assistant anything (e.g., lesson ideas, rubric wording, IEP tips)..."
          className="flex-1 px-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
