
import React from 'react';
import { Trophy, Medal, Star, Target, Zap, Award, Flame, ShieldCheck } from 'lucide-react';
import { StudySession, Task } from '../types';

interface AchievementsProps {
  sessions: StudySession[];
  tasks: Task[];
}

const Achievements: React.FC<AchievementsProps> = ({ sessions, tasks }) => {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  
  // XP Calculation: 10XP per minute + 100XP per task
  const totalXP = (totalMinutes * 10) + (completedTasks * 100);
  const level = Math.floor(Math.sqrt(totalXP / 500)) + 1;
  const nextLevelXP = Math.pow(level, 2) * 500;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 500;
  const progressToNext = ((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

  const badges = [
    { title: "First Step", desc: "Completed 1st task", icon: Medal, color: "text-blue-500", earned: completedTasks >= 1 },
    { title: "Deep Diver", desc: "10 hours studied", icon: Target, color: "text-indigo-500", earned: totalMinutes >= 600 },
    { title: "Consistent", desc: "5 tasks done", icon: Zap, color: "text-amber-500", earned: completedTasks >= 5 },
    { title: "Academic Elite", desc: "Reached Level 5", icon: Trophy, color: "text-purple-500", earned: level >= 5 },
    { title: "Sprint King", desc: "5 Pomodoro sessions", icon: Flame, color: "text-rose-500", earned: sessions.filter(s => s.type === 'Pomodoro').length >= 5 },
    { title: "Polymath", desc: "Studied 3 subjects", icon: Star, color: "text-emerald-500", earned: new Set(sessions.map(s => s.subject)).size >= 3 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      {/* Level Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-inner">
            <span className="text-5xl font-black">{level}</span>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-3xl font-black">Academic Level {level}</h2>
              <ShieldCheck className="text-indigo-300" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="uppercase tracking-widest text-indigo-200">Level Progress</span>
                <span>{totalXP} / {nextLevelXP} XP</span>
              </div>
              <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-indigo-300 transition-all duration-1000" 
                  style={{ width: `${progressToNext}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
        <Award className="absolute -right-12 -bottom-12 text-white/10 w-64 h-64" />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {badges.map((badge, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center space-y-3 ${
              badge.earned 
                ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl' 
                : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-40 grayscale'
            }`}
          >
            <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 ${badge.earned ? badge.color : 'text-slate-300'}`}>
              <badge.icon size={32} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white">{badge.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{badge.desc}</p>
            </div>
            {badge.earned && (
              <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
