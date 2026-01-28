
import React from 'react';
import { Task, Note, StudySession } from '../types';
import { TrendingUp, Clock, BookOpen, CheckCircle2, ChevronRight, Zap, Trophy, Target } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  sessions: StudySession[];
  notes: Note[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, sessions, notes }) => {
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const totalStudyTime = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  
  // XP Logic
  const totalXP = (totalStudyTime * 10) + (completedCount * 100);
  const level = Math.floor(Math.sqrt(totalXP / 500)) + 1;
  const nextLevelXP = Math.pow(level, 2) * 500;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 500;
  const progress = ((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Level Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-200 dark:shadow-none">
            {level}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Academic Level {level}</h2>
            <p className="text-slate-500 font-medium">Rank: Scholarship Seeker</p>
          </div>
        </div>
        <div className="flex-1 max-w-md w-full space-y-2">
          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
            <span>Next Level</span>
            <span>{Math.round(nextLevelXP - totalXP)} XP Left</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-1000" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Study Hours</p>
              <h3 className="text-2xl font-bold">{(totalStudyTime / 60).toFixed(1)}h</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tasks Done</p>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</p>
              <h3 className="text-2xl font-bold">{totalXP} XP</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Badges</p>
              <h3 className="text-2xl font-bold">Locked</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Target className="text-indigo-600" size={20} />
              Focus Roadmap
            </h3>
            <button className="text-indigo-600 text-sm font-black flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 4).map(task => (
                <div key={task.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <div>
                      <h4 className="font-bold group-hover:text-indigo-600 transition">{task.title}</h4>
                      <p className="text-xs text-slate-500">{task.subject} • Due {task.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">+{task.estimatedTime * 5} XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                No focus tasks. High performance starts with a plan!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={20} />
            Efficiency
          </h3>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h4 className="font-black text-lg mb-2">Study Heatmap</h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                You're most active between <strong>6 PM - 9 PM</strong>. Try scheduling your hardest subjects during this window.
              </p>
              <div className="flex gap-1 h-12 items-end">
                {[4, 2, 8, 3, 5, 9, 4].map((v, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${v * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
