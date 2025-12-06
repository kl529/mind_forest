-- Mind Forest Database Schema
-- Migration 001: Initial Schema
-- Created: 2025-12-03

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: activity_entries
-- Purpose: Store all user stress/reaction entries
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Entry data
  entry_type text NOT NULL DEFAULT 'stress' CHECK (entry_type IN ('stress', 'relief')),
  category text NOT NULL CHECK (category IN ('physical', 'emotional', 'behavioral')),
  reaction text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text CHECK (char_length(notes) <= 500),

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_entries_user_id
  ON activity_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_activity_entries_entry_date
  ON activity_entries(entry_date);

CREATE INDEX IF NOT EXISTS idx_activity_entries_user_date
  ON activity_entries(user_id, entry_date DESC);

-- =====================================================
-- Table: user_streaks
-- Purpose: Store calculated streak data for performance
-- =====================================================

CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_entry_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on activity_entries
ALTER TABLE activity_entries ENABLE ROW LEVEL SECURITY;

-- Users can view their own entries
CREATE POLICY "Users can view own entries"
  ON activity_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own entries"
  ON activity_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own entries"
  ON activity_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own entries"
  ON activity_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on user_streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view their own streak
CREATE POLICY "Users can view own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own streak
CREATE POLICY "Users can insert own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own streak
CREATE POLICY "Users can update own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- Functions
-- =====================================================

-- Function: Calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id uuid)
RETURNS TABLE (
  current_streak integer,
  longest_streak integer,
  last_entry_date date
) AS $$
DECLARE
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_temp_streak integer := 0;
  v_last_date date;
  v_prev_date date := NULL;
  v_checking_current boolean := true;
BEGIN
  -- Get all distinct entry dates for user, ordered descending
  FOR v_last_date IN
    SELECT DISTINCT entry_date
    FROM activity_entries
    WHERE user_id = p_user_id
    ORDER BY entry_date DESC
  LOOP
    IF v_prev_date IS NULL THEN
      -- First iteration (most recent date)
      v_temp_streak := 1;

      -- Check if it's today or yesterday (current streak is active)
      IF v_last_date >= CURRENT_DATE - INTERVAL '1 day' THEN
        v_current_streak := 1;
      ELSE
        v_checking_current := false;
      END IF;

    ELSIF v_last_date = v_prev_date - INTERVAL '1 day' THEN
      -- Consecutive day
      v_temp_streak := v_temp_streak + 1;

      IF v_checking_current THEN
        v_current_streak := v_temp_streak;
      END IF;

    ELSE
      -- Gap in dates - streak broken
      v_checking_current := false;
      v_temp_streak := 1;
    END IF;

    -- Track longest streak
    IF v_temp_streak > v_longest_streak THEN
      v_longest_streak := v_temp_streak;
    END IF;

    v_prev_date := v_last_date;
  END LOOP;

  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_prev_date;
END;
$$ LANGUAGE plpgsql;

-- Function: Update user streak after insert
CREATE OR REPLACE FUNCTION update_user_streak_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_streak_data RECORD;
BEGIN
  -- Calculate new streak
  SELECT * INTO v_streak_data
  FROM calculate_user_streak(NEW.user_id);

  -- Upsert into user_streaks
  INSERT INTO user_streaks (
    user_id,
    current_streak,
    longest_streak,
    last_entry_date,
    updated_at
  )
  VALUES (
    NEW.user_id,
    v_streak_data.current_streak,
    v_streak_data.longest_streak,
    v_streak_data.last_entry_date,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    current_streak = v_streak_data.current_streak,
    longest_streak = GREATEST(user_streaks.longest_streak, v_streak_data.longest_streak),
    last_entry_date = v_streak_data.last_entry_date,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update streak after activity entry insert
DROP TRIGGER IF EXISTS trigger_update_streak_on_insert ON activity_entries;
CREATE TRIGGER trigger_update_streak_on_insert
  AFTER INSERT ON activity_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak_on_insert();

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE activity_entries IS 'User stress and reaction entries';
COMMENT ON TABLE user_streaks IS 'Calculated streak data for users';
COMMENT ON FUNCTION calculate_user_streak IS 'Calculate current and longest streak for a user';
