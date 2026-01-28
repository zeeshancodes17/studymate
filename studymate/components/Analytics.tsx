
import React from 'react';
import { StudySession, Task } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Target, Brain } from 'lucide-react';

interface AnalyticsProps {
  sessions: StudySession[];
  tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ sessions, tasks }) => {
  // Use session data or empty placeholders for zero progress
  const studyData = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ];

  // Map real session data if it exists
  sessions.forEach(session => {
    const day = new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' });
    const dataPoint = studyData.find(d => d.day === day);
    if (dataPoint) dataPoint.hours += session.duration / 60;
  });

  const subjectMap: Record<string, number> = {};
  sessions.forEach(s => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration;
  });

  const subjectData = Object.entries(subjectMap).length > 0 
    ? Object.entries(subjectMap).map(([name, value]) => ({ name, value }))
    : [{ name: 'No Data', value: 1 }];

  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Hours */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={24} />
              Weekly Study Time
            </h3>
            <span className="text-sm font-medium text-slate-400">Past 7 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="#e2e8f0">
                  {studyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 0 ? '#6366f1' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Effort Distribution */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PieChartIcon className="text-purple-600" size={24} />
              Effort by Subject
            </h3>
            <span className="text-sm font-medium text-slate-400">Focus Hours</span>
          </div>
          <div className="h-64 flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={subjectData[0].name === 'No Data' ? '#e2e8f0' : COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 flex flex-col justify-center gap-4">
              {subjectData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: subjectData[0].name === 'No Data' ? '#e2e8f0' : COLORS[i % COLORS.length]}} />
                  <span className="text-xs font-semibold text-slate-500">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Insights */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl text-white">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Brain className="text-indigo-400" size={24} />
          Academic Intelligence Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <Target className="text-indigo-300 mb-3" size={32} />
            <h4 className="font-bold text-lg mb-2">Efficiency Tracking</h4>
            <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">
              Start logging study sessions in the Mentor or Planner to track your deep work patterns and efficiency peaks.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <AlertCircle className="text-orange-300 mb-3" size={32} />
            <h4 className="font-bold text-lg mb-2">Consistency Insights</h4>
            <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">
              Maintain a daily streak to help AI predict burnout and recommend restorative breaks.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <TrendingUp className="text-emerald-300 mb-3" size={32} />
            <h4 className="font-bold text-lg mb-2">Retention Analysis</h4>
            <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">
              Review your notes and complete tasks to identify subjects needing more focus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon import aliases
const TrendingUp = ({ size, className }: { size?: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const AlertCircle = ({ size, className }: { size?: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;

export default Analytics;
