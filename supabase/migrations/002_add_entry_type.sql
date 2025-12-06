-- Migration 002: Add entry_type field to support stress and relief entries
-- Created: 2025-12-06

-- Update the activity_entries table to include entry_type
ALTER TABLE activity_entries
  ADD COLUMN IF NOT EXISTS entry_type text NOT NULL DEFAULT 'stress'
  CHECK (entry_type IN ('stress', 'relief'));

-- Update the comment
COMMENT ON COLUMN activity_entries.entry_type IS 'Type of entry: stress (reaction) or relief (activity)';

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_entries_entry_type
  ON activity_entries(entry_type);

-- Optional: Update existing data (if any) to have entry_type
-- UPDATE activity_entries SET entry_type = 'stress' WHERE entry_type IS NULL;
