/*
  # Initial schema for StudyBuddy app

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `username` (text, nullable)
      - `theme` (text)
    - `tasks`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text, nullable)
      - `is_completed` (boolean)
      - `deadline` (timestamp, nullable)
      - `color` (text)
      - `is_important` (boolean)
      - `user_id` (uuid, foreign key to auth.users)
      - `send_notification` (boolean)
      - `parent_id` (uuid, nullable, self-reference)
    - `schedule`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
      - `day_of_week` (integer)
      - `hour` (integer)
      - `class_name` (text)
      - `room` (text)
      - `icon` (text, nullable)
      - `color` (text)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  username text,
  theme text DEFAULT 'dark'
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  is_completed boolean DEFAULT false,
  deadline timestamptz,
  color text DEFAULT '#ffffff',
  is_important boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  send_notification boolean DEFAULT false,
  parent_id uuid REFERENCES tasks(id) ON DELETE CASCADE
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  hour integer NOT NULL,
  class_name text NOT NULL,
  room text NOT NULL,
  icon text,
  color text DEFAULT '#e0f2fe'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for schedule
CREATE POLICY "Users can view their own schedule"
  ON schedule
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule items"
  ON schedule
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule items"
  ON schedule
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule items"
  ON schedule
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_parent_id_idx ON tasks(parent_id);
CREATE INDEX IF NOT EXISTS schedule_user_id_idx ON schedule(user_id);
CREATE INDEX IF NOT EXISTS schedule_day_hour_idx ON schedule(day_of_week, hour);