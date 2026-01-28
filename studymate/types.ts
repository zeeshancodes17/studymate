
export enum View {
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  MENTOR = 'MENTOR',
  NOTES = 'NOTES',
  ANALYTICS = 'ANALYTICS',
  CAREER = 'CAREER',
  IDEAS = 'IDEAS',
  SETTINGS = 'SETTINGS',
  TIMER = 'TIMER',
  ACHIEVEMENTS = 'ACHIEVEMENTS'
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  deadline: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  tags: string[];
  xpEarned?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  updatedAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // minutes
  subject: string;
  focusScore: number; // 1-10
  type: 'Pomodoro' | 'Manual';
}

export enum MentorMode {
  EXPLAIN = 'EXPLAIN',
  EXAM = 'EXAM',
  TEACHING = 'TEACHING',
  SIMPLIFY = 'SIMPLIFY',
  RESEARCH = 'RESEARCH'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
}
