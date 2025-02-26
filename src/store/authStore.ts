import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  theme: 'dark',
  
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update theme in database if user is logged in
    const { user } = get();
    if (user) {
      supabase
        .from('profiles')
        .update({ theme })
        .eq('id', user.id)
        .then(() => {
          console.log('Theme updated in database');
        });
    }
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    set({ user: data.user, session: data.session });
    return data;
  },
  
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Create a profile for the new user
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        theme: 'dark',
      });
    }
    
    set({ user: data.user, session: data.session });
    return data;
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
  
  initialize: async () => {
    set({ loading: true });
    
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get user profile to get theme preference
      const { data: profile } = await supabase
        .from('profiles')
        .select('theme')
        .eq('id', user?.id)
        .single();
      
      if (profile && profile.theme) {
        get().setTheme(profile.theme as 'dark' | 'light');
      } else {
        // Default to dark theme
        get().setTheme('dark');
      }
      
      set({ user, session });
    } else {
      // Check local storage for theme preference
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
      get().setTheme(savedTheme);
    }
    
    set({ loading: false });
  },
}));