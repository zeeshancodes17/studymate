
import React, { useState, useEffect } from 'react';
import { View, Task, Note, StudySession } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import AIStudyMentor from './components/AIStudyMentor';
import NotesSystem from './components/NotesSystem';
import Analytics from './components/Analytics';
import CareerAdvisor from './components/CareerAdvisor';
import IdeaGenerator from './components/IdeaGenerator';
import Settings from './components/Settings';
import PomodoroTimer from './components/PomodoroTimer';
import Achievements from './components/Achievements';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('sm_tasks');
    const savedNotes = localStorage.getItem('sm_notes');
    const savedSessions = localStorage.getItem('sm_sessions');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const addSession = (session: StudySession) => {
    const updated = [...sessions, session];
    setSessions(updated);
    localStorage.setItem('sm_sessions', JSON.stringify(updated));
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard tasks={tasks} sessions={sessions} notes={notes} />;
      case View.PLANNER: return <Planner tasks={tasks} setTasks={setTasks} />;
      case View.TIMER: return <PomodoroTimer onSessionComplete={addSession} />;
      case View.MENTOR: return <AIStudyMentor />;
      case View.NOTES: return <NotesSystem notes={notes} setNotes={setNotes} />;
      case View.ANALYTICS: return <Analytics sessions={sessions} tasks={tasks} />;
      case View.ACHIEVEMENTS: return <Achievements sessions={sessions} tasks={tasks} />;
      case View.CAREER: return <CareerAdvisor />;
      case View.IDEAS: return <IdeaGenerator />;
      case View.SETTINGS: return <Settings />;
      default: return <Dashboard tasks={tasks} sessions={sessions} notes={notes} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar relative">
        <header className="px-10 py-6 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 border-b dark:border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
          <h2 className="text-xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            {currentView.replace(/_/g, ' ')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-black text-sm">
              S
            </div>
          </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
