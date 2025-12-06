# Mind Forest - Supabase Database Schema

## 📊 Database Design

### Tables Overview

```
users (Supabase Auth)
    ↓
activity_entries (main data)
    ↓
user_streaks (calculated data)
```

---

## 1. Users Table
**Managed by Supabase Auth** - No custom table needed initially

Fields provided by Supabase Auth:
- `id` (uuid, primary key)
- `email`
- `created_at`
- `updated_at`

---

## 2. activity_entries Table

**Purpose**: Store all user stress/reaction entries

```sql
CREATE TABLE activity_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Entry data
  category text NOT NULL CHECK (category IN ('physical', 'emotional', 'behavioral')),
  reaction text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text,

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,

  -- Indexes
  CONSTRAINT valid_intensity CHECK (intensity BETWEEN 1 AND 5)
);

-- Indexes for performance
CREATE INDEX idx_activity_entries_user_id ON activity_entries(user_id);
CREATE INDEX idx_activity_entries_entry_date ON activity_entries(entry_date);
CREATE INDEX idx_activity_entries_user_date ON activity_entries(user_id, entry_date DESC);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `user_id`: Reference to authenticated user
- `category`: 'physical' | 'emotional' | 'behavioral'
- `reaction`: String (e.g., '불안', '두근거림', '회피')
- `intensity`: 1-5 scale
- `notes`: Optional text (max 500 chars)
- `created_at`: Timestamp when record was created
- `entry_date`: Date of the experience (can be backdated)

---

## 3. user_streaks Table (Optional - for caching)

**Purpose**: Store calculated streak data for performance

```sql
CREATE TABLE user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_entry_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Fields**:
- `user_id`: Reference to user
- `current_streak`: Current consecutive days
- `longest_streak`: All-time longest streak
- `last_entry_date`: Last date with an entry
- `updated_at`: Last calculation time

---

## 4. user_preferences Table (Future)

**Purpose**: Store user settings

```sql
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification settings
  notifications_enabled boolean DEFAULT false,
  notification_time time DEFAULT '20:00:00',

  -- Display preferences
  theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## Row Level Security (RLS)

### activity_entries policies

```sql
-- Enable RLS
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
```

### user_streaks policies

```sql
-- Enable RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view their own streak
CREATE POLICY "Users can view own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own streak
CREATE POLICY "Users can update own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## Database Functions

### Calculate Streak Function

```sql
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id uuid)
RETURNS TABLE (
  current_streak integer,
  longest_streak integer,
  last_entry_date date
) AS $$
DECLARE
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_last_date date;
  v_prev_date date := NULL;
  v_temp_streak integer := 0;
BEGIN
  -- Get all distinct entry dates for user, ordered descending
  FOR v_last_date IN
    SELECT DISTINCT entry_date
    FROM activity_entries
    WHERE user_id = p_user_id
    ORDER BY entry_date DESC
  LOOP
    IF v_prev_date IS NULL THEN
      -- First iteration
      v_temp_streak := 1;
      v_current_streak := 1;
    ELSIF v_last_date = v_prev_date - INTERVAL '1 day' THEN
      -- Consecutive day
      v_temp_streak := v_temp_streak + 1;
      IF v_current_streak = v_temp_streak THEN
        v_current_streak := v_temp_streak;
      END IF;
    ELSE
      -- Gap in dates
      IF v_prev_date = CURRENT_DATE OR v_prev_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- We're still calculating current streak
        v_current_streak := v_temp_streak;
      END IF;
      v_temp_streak := 1;
    END IF;

    IF v_temp_streak > v_longest_streak THEN
      v_longest_streak := v_temp_streak;
    END IF;

    v_prev_date := v_last_date;
  END LOOP;

  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_prev_date;
END;
$$ LANGUAGE plpgsql;
```

---

## Indexes Strategy

1. **User lookup**: `idx_activity_entries_user_id`
2. **Date range queries**: `idx_activity_entries_entry_date`
3. **User timeline**: `idx_activity_entries_user_date` (composite)

---

## Data Migration Strategy

### Phase 1: Initial Setup (Current)
- Create tables
- Set up RLS policies
- Deploy basic functions

### Phase 2: User Migration (Future)
- Migrate from AsyncStorage to Supabase
- Provide data export/import functionality
- Handle offline support

### Phase 3: Advanced Features (Future)
- Analytics tables
- Shared entries (if social features)
- Backup/restore functionality

---

## Storage Estimates

### Per User:
- **Average entry**: ~200 bytes
- **100 entries**: ~20 KB
- **1 year (365 entries)**: ~73 KB
- **10,000 users, 1 year**: ~730 MB

Supabase free tier: 500 MB storage (sufficient for MVP)

---

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Choose region (closest to users - Seoul/Tokyo for Korean users)
4. Save project URL and API keys

### 2. Run SQL Migrations
Execute the SQL scripts in order:
1. Create `activity_entries` table
2. Create `user_streaks` table
3. Enable RLS policies
4. Create indexes
5. Create functions

### 3. Get API Credentials
- Project URL: `https://[project-id].supabase.co`
- Anon Key: Public key for client-side access
- Service Key: Private key for server-side (not needed for client app)

---

## Environment Variables

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

*Last Updated: 2025-12-03*
