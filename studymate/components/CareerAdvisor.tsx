
import React, { useState } from 'react';
import { getCareerAdvice } from '../services/geminiService';
import { Search, Map, Compass, Book, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

const CareerAdvisor: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [strengths, setStrengths] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!interests || !strengths) return;
    setIsLoading(true);
    try {
      const res = await getCareerAdvice(interests, strengths);
      setAdvice(res || 'No advice generated.');
    } catch (err) {
      console.error(err);
      setAdvice('Error generating advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">AI Career & Degree Advisor</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Get personalized academic roadmaps, career suggestions, and skill paths based on your unique profile.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Compass className="text-indigo-600" size={20} />
              What interests you?
            </div>
            <textarea 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. AI ethics, space exploration, web development, public speaking..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl p-5 h-32 resize-none transition outline-none text-sm"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Briefcase className="text-purple-600" size={20} />
              Your Strengths?
            </div>
            <textarea 
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Logical reasoning, empathy, design thinking, writing, math..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 rounded-3xl p-5 h-32 resize-none transition outline-none text-sm"
            />
          </div>
        </div>
        <button 
          onClick={handleGetAdvice}
          disabled={isLoading || !interests || !strengths}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-3xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Map size={24} />}
          {isLoading ? 'Plotting Roadmap...' : 'Generate Career Path'}
        </button>
      </div>

      {advice && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 p-10 shadow-2xl animate-in zoom-in-95 duration-500">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="text-indigo-600" size={28} />
            Your Personalized Academic Roadmap
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            {advice.split('\n').map((line, i) => {
              if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold mt-6 mb-4">{line.replace('### ', '')}</h3>;
              if (line.startsWith('**')) return <p key={i} className="font-semibold text-indigo-600 dark:text-indigo-400 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
              return <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{line}</p>;
            })}
          </div>
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h4 className="font-bold">Ready to start?</h4>
                <p className="text-sm text-slate-500">Add the first skill from your roadmap to your Planner.</p>
              </div>
            </div>
            <button className="bg-white dark:bg-slate-900 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-2">
              Get Started <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Sparkles = ({ size, className }: { size?: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

export default CareerAdvisor;
