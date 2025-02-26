export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          is_completed: boolean
          deadline: string | null
          color: string
          is_important: boolean
          user_id: string
          send_notification: boolean
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          is_completed?: boolean
          deadline?: string | null
          color?: string
          is_important?: boolean
          user_id: string
          send_notification?: boolean
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          is_completed?: boolean
          deadline?: string | null
          color?: string
          is_important?: boolean
          user_id?: string
          send_notification?: boolean
          parent_id?: string | null
        }
      }
      schedule: {
        Row: {
          id: string
          created_at: string
          user_id: string
          day_of_week: number
          hour: number
          class_name: string
          room: string
          icon: string | null
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          day_of_week: number
          hour: number
          class_name: string
          room: string
          icon?: string | null
          color?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          day_of_week?: number
          hour?: number
          class_name?: string
          room?: string
          icon?: string | null
          color?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string | null
          theme: string
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          theme?: string
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          theme?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}