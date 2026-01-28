
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Check, Clock, AlertCircle, Calendar, Tag, MoreVertical } from 'lucide-react';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    subject: '',
    priority: 'Medium',
    estimatedTime: 30,
    deadline: new Date().toISOString().split('T')[0]
  });

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      subject: newTask.subject || 'General',
      priority: newTask.priority as any || 'Medium',
      estimatedTime: Number(newTask.estimatedTime) || 30,
      actualTime: 0,
      deadline: newTask.deadline!,
      status: 'Pending',
      tags: []
    };
    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem('sm_tasks', JSON.stringify(updated));
    setShowAdd(false);
    setNewTask({ title: '', subject: '', priority: 'Medium', estimatedTime: 30, deadline: new Date().toISOString().split('T')[0] });
  };

  const toggleStatus = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } as Task : t);
    setTasks(updated);
    localStorage.setItem('sm_tasks', JSON.stringify(updated));
  };

  const priorityColors = {
    High: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
    Medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    Low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Study Schedule</h3>
          <p className="text-sm text-slate-500">Manage your topics and deadlines</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition"
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-none transition-all group ${task.status === 'Completed' ? 'opacity-75' : ''}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <button className="text-slate-400 hover:text-indigo-600 transition">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h4 className={`text-lg font-bold mb-1 transition ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h4>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4 flex items-center gap-1">
                <Tag size={14} /> {task.subject}
              </p>
              
              <div className="space-y-2 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> <span>Due: {task.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> <span>Est: {task.estimatedTime} mins</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => toggleStatus(task.id)}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                task.status === 'Completed' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200'
              }`}
            >
              {task.status === 'Completed' ? <Check size={18} /> : null}
              {task.status === 'Completed' ? 'Completed' : 'Mark as Done'}
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6">New Study Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Solve Physics Chapter 4 Problems"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={newTask.subject}
                    onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="Math"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Duration (min)</label>
                  <input 
                    type="number" 
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Deadline</label>
                  <input 
                    type="date" 
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={addTask}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
