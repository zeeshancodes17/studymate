
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Bell, Settings } from 'lucide-react';
import { StudySession } from '../types';

interface PomodoroTimerProps {
  onSessionComplete: (session: StudySession) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(0);
  
  const totalTime = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();

    if (mode === 'work') {
      const newSession: StudySession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: 25,
        subject: 'Focus Session',
        focusScore: 9,
        type: 'Pomodoro'
      };
      onSessionComplete(newSession);
      setSessionCount(prev => prev + 1);
      setMode(sessionCount % 4 === 3 ? 'longBreak' : 'shortBreak');
      setTimeLeft(sessionCount % 4 === 3 ? 15 * 60 : 5 * 60);
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white">Focus Sanctuary</h2>
        <p className="text-slate-500 font-medium">Deep work is the superpower of the 21st century.</p>
      </div>

      <div className="relative group">
        {/* Progress Ring */}
        <div className="w-80 h-80 rounded-full flex items-center justify-center relative shadow-2xl shadow-indigo-200 dark:shadow-none bg-white dark:bg-slate-900 border-8 border-slate-50 dark:border-slate-800 overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-linear bg-indigo-600/10 dark:bg-indigo-400/5" 
            style={{ height: `${progress}%` }} 
          />
          <div className="text-center z-10">
            <div className="text-7xl font-mono font-black text-slate-800 dark:text-white tracking-tighter">
              {formatTime(timeLeft)}
            </div>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs mt-2">
              {mode === 'work' ? 'Time to Focus' : 'Take a Break'}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute -top-4 -right-4 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                i <= (sessionCount % 4) ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-300 dark:border-slate-700'
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:scale-110 transition active:scale-95"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-110 transition active:scale-95"
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={() => {
            setMode(mode === 'work' ? 'shortBreak' : 'work');
            setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
          }}
          className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:scale-110 transition active:scale-95"
        >
          {mode === 'work' ? <Coffee size={24} /> : <Brain size={24} />}
        </button>
      </div>

      <div className="flex gap-4">
        <div className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <Bell className="text-amber-500" size={18} />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Sound: On</span>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <Settings className="text-slate-400" size={18} />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
