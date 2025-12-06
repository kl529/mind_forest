# Supabase 빠른 시작 가이드

## Step 1: SQL 실행하기

Supabase 대시보드에서:

1. **SQL Editor** 클릭 (왼쪽 메뉴)
2. **+ New query** 클릭
3. 아래 SQL 전체를 복사해서 붙여넣기
4. **Run** 버튼 클릭

```sql
-- Mind Forest Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create activity_entries table
CREATE TABLE IF NOT EXISTS activity_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  entry_type text NOT NULL DEFAULT 'stress' CHECK (entry_type IN ('stress', 'relief')),
  category text NOT NULL CHECK (category IN ('physical', 'emotional', 'behavioral')),
  reaction text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text CHECK (char_length(notes) <= 500),

  created_at timestamptz NOT NULL DEFAULT now(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_entries_user_id ON activity_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_entries_entry_date ON activity_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_activity_entries_user_date ON activity_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entries_entry_type ON activity_entries(entry_type);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_entry_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE activity_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_entries
CREATE POLICY "Users can view own entries" ON activity_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entries" ON activity_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON activity_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON activity_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_streaks
CREATE POLICY "Users can view own streak" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streak" ON user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON user_streaks FOR UPDATE USING (auth.uid() = user_id);
```

## Step 2: API 키 복사하기

1. **Settings** → **API** 클릭
2. 아래 2개를 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (긴 문자열)

## Step 3: .env.local 파일 업데이트

프로젝트 루트의 `.env.local` 파일을 열어서:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**실제 값으로 교체**해주세요!

## Step 4: 개발 서버 재시작

터미널에서 Ctrl+C로 서버 중지 후:

```bash
npm start
```

---

완료! 이제 앱에서 Supabase에 데이터를 저장할 수 있습니다.
