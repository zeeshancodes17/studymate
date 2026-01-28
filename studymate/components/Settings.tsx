
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Trash2, Save, Moon, Sun, Monitor, Lock, EyeOff, Mail, Clock } from 'lucide-react';

type SettingsTab = 'general' | 'notifications' | 'privacy';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [userName, setUserName] = useState(localStorage.getItem('sm_username') || 'Student');
  const [academicLevel, setAcademicLevel] = useState(localStorage.getItem('sm_level') || 'Undergraduate');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Notification states
  const [notifStudyReminders, setNotifStudyReminders] = useState(true);
  const [notifEmailSummaries, setNotifEmailSummaries] = useState(false);
  const [notifTaskDeadlines, setNotifTaskDeadlines] = useState(true);

  // Privacy states
  const [privateMode, setPrivateMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('sm_username', userName);
    localStorage.setItem('sm_level', academicLevel);
    
    // In a real app, we'd save the other preferences too
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000); 
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all your study data? This cannot be undone.')) {
      localStorage.removeItem('sm_tasks');
      localStorage.removeItem('sm_notes');
      localStorage.removeItem('sm_sessions');
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="text-indigo-600" size={24} />
                Profile Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Display Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Academic Level</label>
                  <select 
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                    <option>PhD / Researcher</option>
                    <option>Self-taught Professional</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trash2 className="text-rose-600" size={24} />
                Data Management
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Take control of your data. You can reset your dashboard and clear all stored notes and tasks from your browser's local storage.
              </p>
              <button 
                onClick={clearData}
                className="flex items-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
              >
                <Trash2 size={18} /> Clear All Study Data
              </button>
            </section>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Bell className="text-indigo-600" size={24} />
                Notification Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Study Reminders</p>
                      <p className="text-xs text-slate-500">Get alerted when it's time for your focus sessions.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifStudyReminders(!notifStudyReminders)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifStudyReminders ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifStudyReminders ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Email Summaries</p>
                      <p className="text-xs text-slate-500">Weekly reports on your study progress and analytics.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifEmailSummaries(!notifEmailSummaries)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifEmailSummaries ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifEmailSummaries ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Task Deadlines</p>
                      <p className="text-xs text-slate-500">Notifications for upcoming deadlines in your planner.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifTaskDeadlines(!notifTaskDeadlines)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifTaskDeadlines ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifTaskDeadlines ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="text-indigo-600" size={24} />
                Privacy & Security
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <EyeOff size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Private Study Mode</p>
                      <p className="text-xs text-slate-500">Hide study sessions from global analytics and leaderboards.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPrivateMode(!privateMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${privateMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${privateMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">AI Learning Data</p>
                      <p className="text-xs text-slate-500">Allow AI to use your study patterns to improve recommendations.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDataSharing(!dataSharing)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${dataSharing ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${dataSharing ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                    <Shield size={18} />
                    Local-First Storage
                  </h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                    StudyMate Pro uses <strong>AES-256 encrypted local storage</strong>. Your data never leaves your device unless you explicitly enable cloud sync or use certain AI features that require processing.
                  </p>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs (Vertical in Desktop) */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              activeTab === 'general' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User size={20} /> General
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              activeTab === 'notifications' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell size={20} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              activeTab === 'privacy' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield size={20} /> Privacy & Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {renderContent()}

          <div className="flex justify-end gap-4">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 dark:shadow-none"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
              {saveStatus !== 'saving' && <Save size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
