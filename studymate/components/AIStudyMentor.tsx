
import React, { useState, useRef, useEffect } from 'react';
import { MentorMode, ChatMessage } from '../types';
import { getMentorResponse } from '../services/geminiService';
import { Send, Sparkles, MessageSquare, BookOpen, GraduationCap, Lightbulb, Search, ExternalLink, Globe } from 'lucide-react';

const AIStudyMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your AI Study Mentor. How can I help you excel today?" }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<MentorMode>(MentorMode.EXPLAIN);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const { text, sources } = await getMentorResponse(input, mode, history);
      setMessages(prev => [...prev, { role: 'model', content: text || 'Error.', sources }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Connection lost. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const modeOptions = [
    { type: MentorMode.EXPLAIN, label: 'Explain', icon: BookOpen, desc: 'Deep details' },
    { type: MentorMode.RESEARCH, label: 'Research', icon: Search, desc: 'Web grounding' },
    { type: MentorMode.TEACHING, label: 'Quiz', icon: MessageSquare, desc: 'Interactive' },
    { type: MentorMode.SIMPLIFY, label: 'Simplify', icon: Lightbulb, desc: 'Analogies' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modeOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setMode(opt.type)}
            className={`p-4 rounded-2xl text-left transition-all border-2 ${
              mode === opt.type 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 dark:border-indigo-400 shadow-md' 
              : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <opt.icon size={18} className={mode === opt.type ? 'text-indigo-600' : 'text-slate-400'} />
              <span className={`font-black text-sm ${mode === opt.type ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}>
                {opt.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{opt.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] space-y-2">
                <div className={`rounded-3xl px-6 py-4 ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none font-medium' 
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm'
                }`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                    {m.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {m.sources.map((s, si) => (
                      <a 
                        key={si} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                      >
                        <Globe size={12} /> {s.title} <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl px-6 py-4 border border-slate-100 dark:border-slate-700 animate-pulse flex items-center gap-2">
                <Sparkles className="text-indigo-500 animate-spin" size={20} />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  {mode === MentorMode.RESEARCH ? 'Grounded Research...' : 'Processing...'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask in ${mode.toLowerCase()} mode...`}
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl pl-6 pr-16 py-5 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudyMentor;
