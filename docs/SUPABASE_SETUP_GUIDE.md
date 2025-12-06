# Supabase 설정 가이드

## 📋 Step 1: Supabase 프로젝트 생성

### 1. Supabase 가입 및 프로젝트 생성

1. **Supabase 웹사이트 방문**
   - https://supabase.com 접속
   - "Start your project" 클릭

2. **로그인/가입**
   - GitHub 계정으로 로그인 (추천)
   - 또는 이메일로 가입

3. **새 프로젝트 생성**
   - "New Project" 클릭
   - Organization 선택 (없으면 생성)

4. **프로젝트 설정**
   ```
   Project Name: mind-forest
   Database Password: [강력한 비밀번호 생성] (꼭 저장!)
   Region: Northeast Asia (Seoul) - 한국 사용자에게 최적
   Pricing Plan: Free tier 선택
   ```

5. **프로젝트 생성 대기**
   - 약 2-3분 소요
   - 완료되면 대시보드로 이동

---

## 📋 Step 2: API 키 확인

프로젝트가 생성되면:

1. **Settings** (왼쪽 메뉴 하단) → **API** 클릭

2. **다음 정보 복사**:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbG...
   service_role key: eyJhbG... (서버 전용, 지금은 사용 안함)
   ```

3. **안전하게 저장** (임시로 메모장에 복사)

---

## 📋 Step 3: 데이터베이스 테이블 생성

1. **SQL Editor 열기**
   - 왼쪽 메뉴에서 **SQL Editor** 클릭

2. **새 Query 생성**
   - "+ New query" 클릭

3. **아래 SQL 실행** (한 번에 하나씩):

### 3-1. activity_entries 테이블 생성

```sql
-- Activity entries table
CREATE TABLE activity_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  category text NOT NULL CHECK (category IN ('physical', 'emotional', 'behavioral')),
  reaction text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes
CREATE INDEX idx_activity_entries_user_id ON activity_entries(user_id);
CREATE INDEX idx_activity_entries_entry_date ON activity_entries(entry_date);
CREATE INDEX idx_activity_entries_user_date ON activity_entries(user_id, entry_date DESC);

-- Enable RLS
ALTER TABLE activity_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own entries"
  ON activity_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON activity_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON activity_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON activity_entries FOR DELETE
  USING (auth.uid() = user_id);
```

**"Run" 버튼 클릭하여 실행**

### 3-2. user_streaks 테이블 생성

```sql
-- User streaks table
CREATE TABLE user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_entry_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);
```

**"Run" 버튼 클릭하여 실행**

### 3-3. 확인

- **Table Editor** 메뉴 클릭
- `activity_entries`, `user_streaks` 테이블이 보이면 성공!

---

## 📋 Step 4: 환경 변수 설정 (로컬)

프로젝트 루트 디렉토리에 `.env.local` 파일 생성:

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**중요**:
- `.env.local` 파일은 `.gitignore`에 추가되어 있어야 함
- 실제 값으로 교체

---

## 📋 Step 5: 인증(Auth) 설정

1. **Authentication** 메뉴 클릭

2. **Providers** 탭:
   - Email 활성화 (기본으로 켜져있음)
   - 소셜 로그인 (선택사항):
     - Google
     - Apple
     - 나중에 추가 가능

3. **Email Templates** (선택사항):
   - 회원가입 이메일 커스터마이징
   - 비밀번호 재설정 이메일 커스터마이징

4. **URL Configuration**:
   - Site URL: `http://localhost:8081` (개발 중)
   - 나중에 프로덕션 URL로 변경

---

## 📋 Step 6: 테스트 데이터 삽입 (선택사항)

SQL Editor에서:

```sql
-- 테스트 사용자는 Authentication에서 수동으로 생성하거나
-- 앱에서 회원가입 기능으로 생성

-- 테스트 데이터 삽입 (user_id는 실제 생성된 사용자 ID로 교체)
INSERT INTO activity_entries (user_id, category, reaction, intensity, notes, entry_date)
VALUES
  ('your-user-id-here', 'emotional', '불안', 4, '오늘 발표가 있어서 긴장됨', '2025-12-03'),
  ('your-user-id-here', 'physical', '두근거림', 3, '카페인 과다 섭취', '2025-12-03');
```

---

## ✅ 체크리스트

완료한 항목을 체크하세요:

- [ ] Supabase 프로젝트 생성
- [ ] API 키 복사 및 저장
- [ ] `activity_entries` 테이블 생성
- [ ] `user_streaks` 테이블 생성
- [ ] RLS 정책 활성화 확인
- [ ] `.env.local` 파일 생성
- [ ] 환경변수 설정
- [ ] Email 인증 활성화

---

## 🔍 문제 해결

### SQL 실행 에러
- 각 SQL 블록을 개별적으로 실행
- 이미 존재하는 테이블 에러: `DROP TABLE IF EXISTS table_name;` 후 재실행

### RLS 정책 에러
- 테이블이 먼저 생성되어 있는지 확인
- `auth.uid()` 함수는 Supabase Auth와 연동됨

### API 연결 안됨
- `.env.local` 파일 위치 확인 (프로젝트 루트)
- 환경변수 이름 확인 (`EXPO_PUBLIC_` 접두사 필수)
- 개발 서버 재시작 필요

---

## 📚 다음 단계

1. ✅ Supabase 클라이언트 설치 (완료)
2. ✅ 데이터베이스 스키마 생성 (완료)
3. ⏳ 앱에 Supabase 클라이언트 설정
4. ⏳ DataStorage 업데이트
5. ⏳ 인증 기능 구현

---

*작성일: 2025-12-03*
