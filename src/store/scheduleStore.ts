import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { toast } from 'react-hot-toast';

export interface ScheduleItem {
  id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-7 (7:00-15:00)
  class_name: string;
  room: string;
  icon: string | null;
  color: string;
  user_id: string;
  created_at: string;
}

interface ScheduleState {
  schedule: ScheduleItem[];
  loading: boolean;
  fetchSchedule: () => Promise<void>;
  addScheduleItem: (item: Omit<ScheduleItem, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
  getScheduleForDay: (day: number) => ScheduleItem[];
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedule: [],
  loading: false,
  
  fetchSchedule: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', user.id)
      .order('hour', { ascending: true });
    
    if (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
      set({ loading: false });
      return;
    }
    
    set({ schedule: data || [], loading: false });
  },
  
  addScheduleItem: async (itemData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const newItem = {
      ...itemData,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('schedule')
      .insert(newItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding schedule item:', error);
      toast.error('Failed to add schedule item');
      return;
    }
    
    set((state) => ({ schedule: [...state.schedule, data] }));
    toast.success('Schedule item added successfully');
  },
  
  updateScheduleItem: async (id, updates) => {
    const { error } = await supabase
      .from('schedule')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating schedule item:', error);
      toast.error('Failed to update schedule item');
      return;
    }
    
    set((state) => ({
      schedule: state.schedule.map((item) => 
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    
    toast.success('Schedule updated successfully');
  },
  
  deleteScheduleItem: async (id) => {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting schedule item:', error);
      toast.error('Failed to delete schedule item');
      return;
    }
    
    set((state) => ({
      schedule: state.schedule.filter((item) => item.id !== id),
    }));
    
    toast.success('Schedule item deleted successfully');
  },
  
  getScheduleForDay: (day) => {
    return get().schedule.filter((item) => item.day_of_week === day);
  },
}));