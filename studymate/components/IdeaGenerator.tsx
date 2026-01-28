
import React, { useState } from 'react';
import { generateIdeas } from '../services/geminiService';
import { Lightbulb, Rocket, Code, Star, Loader2, Sparkles, ChevronRight, BrainCircuit } from 'lucide-react';

interface Idea {
  title: string;
  type: string;
  difficulty: string;
  description: string;
  techStack: string[];
  learningOutcomes: string[];
}

const IdeaGenerator: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [focus, setFocus] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!interests || !focus) return;
    setIsLoading(true);
    try {
      const result = await generateIdeas(interests, focus);
      setIdeas(result.ideas || []);
    } catch (error) {
      console.error("Error generating ideas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'intermediate': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'advanced': return 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">AI Idea Forge</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Spark your next big project, hackathon win, or startup venture with AI-generated concepts tailored to your studies.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Sparkles className="text-indigo-600" size={20} />
              Personal Interests
            </div>
            <input 
              type="text" 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Sustainability, Fintech, AI Art, Healthcare..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 transition outline-none text-sm"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <BrainCircuit className="text-purple-600" size={20} />
              Academic Focus
            </div>
            <input 
              type="text" 
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. Computer Science, Psychology, Economics..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 rounded-2xl p-4 transition outline-none text-sm"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !interests || !focus}
          className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Lightbulb size={24} />}
          {isLoading ? 'Forging Ideas...' : 'Generate Creative Ideas'}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col hover:shadow-2xl transition-all group animate-in zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${difficultyColor(idea.difficulty)}`}>
                  {idea.difficulty}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                  {idea.type}
                </span>
              </div>
              
              <h4 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition">{idea.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed flex-1">
                {idea.description}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <Code size={14} /> Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {idea.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <Star size={14} /> Outcomes
                  </div>
                  <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    {idea.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <ChevronRight size={10} className="text-indigo-500" /> {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className="mt-6 w-full py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2">
                Save to Planner <Rocket size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {ideas.length === 0 && !isLoading && (
        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 flex flex-col items-center gap-4">
          <Lightbulb size={48} className="opacity-20" />
          <p>Enter your interests and focus above to forge new ideas.</p>
        </div>
      )}
    </div>
  );
};

export default IdeaGenerator;
