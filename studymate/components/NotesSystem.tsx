
import React, { useState } from 'react';
import { Note } from '../types';
import { summarizeNote } from '../services/geminiService';
import { Plus, Search, Sparkles, FileText, Trash2, Save, X } from 'lucide-react';

interface NotesSystemProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NotesSystem: React.FC<NotesSystemProps> = ({ notes, setNotes }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedNote) return;
    const newNotes = selectedNote.id 
      ? notes.map(n => n.id === selectedNote.id ? selectedNote : n)
      : [...notes, { ...selectedNote, id: Date.now().toString(), updatedAt: new Date().toISOString() }];
    
    setNotes(newNotes);
    localStorage.setItem('sm_notes', JSON.stringify(newNotes));
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    localStorage.setItem('sm_notes', JSON.stringify(newNotes));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  const handleSummarize = async () => {
    if (!selectedNote || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const summary = await summarizeNote(selectedNote.content);
      setSelectedNote({
        ...selectedNote,
        content: selectedNote.content + "\n\n---\n### AI Summary\n" + summary
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-160px)] animate-in fade-in duration-500">
      {/* List Panel */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button 
            onClick={() => {
              setSelectedNote({ id: '', title: 'New Note', content: '', subject: 'General', tags: [], updatedAt: new Date().toISOString() });
              setIsEditing(true);
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition text-sm"
          >
            <Plus size={18} /> New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No notes found</div>
          ) : (
            filteredNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => { setSelectedNote(note); setIsEditing(false); }}
                className={`p-4 rounded-2xl mb-2 cursor-pointer transition-all ${
                  selectedNote?.id === note.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 border' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <h4 className="font-bold text-sm truncate">{note.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">{note.subject}</span>
                  <span className="text-[10px] text-slate-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              {isEditing ? (
                <input 
                  type="text" 
                  value={selectedNote.title}
                  onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                  className="bg-transparent border-none text-xl font-bold focus:ring-0 w-full"
                />
              ) : (
                <h3 className="text-xl font-bold">{selectedNote.title}</h3>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing || !selectedNote.content}
                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition group relative"
                  title="Summarize with AI"
                >
                  <Sparkles size={20} className={isSummarizing ? 'animate-spin' : ''} />
                </button>
                {isEditing ? (
                  <button onClick={handleSave} className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition">
                    <Save size={20} />
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                    <FileText size={20} />
                  </button>
                )}
                <button onClick={() => handleDelete(selectedNote.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              {isEditing ? (
                <textarea 
                  value={selectedNote.content}
                  onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                  placeholder="Start writing..."
                  className="w-full h-full bg-transparent border-none focus:ring-0 resize-none leading-relaxed text-slate-700 dark:text-slate-300"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {selectedNote.content ? (
                    selectedNote.content.split('\n').map((line, i) => <p key={i}>{line}</p>)
                  ) : (
                    <p className="text-slate-400 italic">No content yet.</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSystem;
