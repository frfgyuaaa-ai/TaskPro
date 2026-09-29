export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type Category = 'Work' | 'Personal' | 'Study' | 'Fitness' | 'Design System';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  isUrgent?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface ActivityItem {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  project?: string;
  dueDate: string;
  dueTime: string;
  isOverdue?: boolean;
  overdueText?: string;
  completedAt?: string;
  isPinned?: boolean;
  subtasks: Subtask[];
  assignees: {
    name: string;
    avatar: string;
  }[];
  attachments?: Attachment[];
  tags?: string[];
  metrics?: {
    calories?: string;
    duration?: string;
  };
  activities?: ActivityItem[];
  reminder?: {
    enabled: boolean;
    timing: string;
  };
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  appsConnected: number;
  avatarColor?: string;
}

export type Screen = 'feed' | 'new_task' | 'task_details' | 'auth' | 'today' | 'categories' | 'profile';
