import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { toast } from 'react-hot-toast';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  deadline: string | null;
  color: string;
  is_important: boolean;
  user_id: string;
  created_at: string;
  send_notification: boolean;
  parent_id: string | null;
  subtasks?: Task[];
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  getTasksWithSubtasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  
  fetchTasks: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      set({ loading: false });
      return;
    }
    
    set({ tasks: data || [], loading: false });
  },
  
  addTask: async (taskData) => {
    const user = useAuthStore.getState().user;
    if (!user) return null;
    
    const newTask = {
      ...taskData,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return null;
    }
    
    // Schedule notification if needed
    if (data.send_notification && data.deadline) {
      scheduleNotification(data);
    }
    
    set((state) => ({ tasks: [data, ...state.tasks] }));
    toast.success('Task added successfully');
    return data;
  },
  
  updateTask: async (id, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return;
    }
    
    // Update notification if needed
    if (data.send_notification && data.deadline) {
      scheduleNotification(data);
    }
    
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    }));
    
    toast.success('Task updated successfully');
  },
  
  deleteTask: async (id) => {
    // First, delete all subtasks
    const subtasks = get().tasks.filter(task => task.parent_id === id);
    for (const subtask of subtasks) {
      await supabase.from('tasks').delete().eq('id', subtask.id);
    }
    
    // Then delete the main task
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return;
    }
    
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id && task.parent_id !== id),
    }));
    
    toast.success('Task deleted successfully');
  },
  
  toggleTaskCompletion: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    
    const newStatus = !task.is_completed;
    
    await get().updateTask(id, { is_completed: newStatus });
  },
  
  getTasksWithSubtasks: () => {
    const allTasks = get().tasks;
    const parentTasks = allTasks.filter(task => !task.parent_id);
    
    return parentTasks.map(parentTask => {
      const subtasks = allTasks.filter(task => task.parent_id === parentTask.id);
      return {
        ...parentTask,
        subtasks: subtasks
      };
    });
  }
}));

// Helper function to schedule notifications
function scheduleNotification(task: Task) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const deadlineDate = new Date(task.deadline as string);
    const now = new Date();
    
    // Calculate time until deadline
    const timeUntilDeadline = deadlineDate.getTime() - now.getTime();
    
    if (timeUntilDeadline > 0) {
      // Schedule notification
      setTimeout(() => {
        new Notification('Task Reminder', {
          body: `Your task "${task.title}" is due now!`,
          icon: '/favicon.ico'
        });
      }, timeUntilDeadline);
      
      // Also schedule a 1-hour before notification if there's enough time
      if (timeUntilDeadline > 3600000) { // 1 hour in milliseconds
        setTimeout(() => {
          new Notification('Task Reminder', {
            body: `Your task "${task.title}" is due in 1 hour!`,
            icon: '/favicon.ico'
          });
        }, timeUntilDeadline - 3600000);
      }
    }
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      } else {
        toast.error('Notifications denied. You won\'t receive task reminders.');
      }
    });
  }
}