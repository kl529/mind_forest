# 📂 Mind Forest - 프로젝트 구조

## 📁 디렉토리 구조

```
mind_forest/
├── 📱 app/                      # 앱 화면 (Expo Router)
│   ├── (tabs)/                 # 탭 네비게이션
│   │   ├── _layout.tsx         # 탭 레이아웃 설정
│   │   ├── index.tsx           # 🏠 홈 화면
│   │   ├── calendar.tsx        # 📅 캘린더 화면
│   │   ├── entry.tsx           # ➕ 기록 추가 화면
│   │   └── terrarium.tsx       # 🌳 테라리움 화면
│   ├── auth.tsx                # 🔐 로그인 화면
│   └── _layout.tsx             # 루트 레이아웃 (인증 체크)
│
├── 🧩 components/              # 재사용 가능한 컴포넌트
│   ├── ThemedText.tsx          # 테마 적용 텍스트
│   ├── ThemedView.tsx          # 테마 적용 뷰
│   ├── TerrariumView.tsx       # 테라리움 시각화
│   ├── InputModal.tsx          # 입력 모달
│   └── ui/                     # UI 컴포넌트
│       ├── IconSymbol.tsx      # 아이콘 심볼
│       └── TabBarBackground.tsx
│
├── 🔧 services/                # 비즈니스 로직
│   └── supabaseService.ts      # Supabase API 호출 레이어
│
├── 📚 lib/                     # 라이브러리 설정
│   └── supabase.ts             # Supabase 클라이언트 초기화
│
├── 📝 types/                   # TypeScript 타입 정의
│   └── index.ts                # 공통 타입 (ActivityEntry 등)
│
├── 🛠 utils/                    # 유틸리티 함수
│   ├── stressCalculator.ts    # 스트레스 계산 로직
│   └── dataStorage.ts          # 데이터 저장 유틸리티
│
├── 🗄️ supabase/                # 데이터베이스
│   └── migrations/             # SQL 마이그레이션 파일
│       ├── 001_initial_schema.sql
│       └── 002_add_entry_type.sql
│
├── 📚 docs/                    # 프로젝트 문서
│   ├── README.md               # 문서 목차
│   ├── DEVELOPMENT.md          # 개발 가이드
│   ├── CODE_STRUCTURE.md       # 코드 구조 설명
│   ├── DATABASE_SCHEMA.md      # 데이터베이스 스키마
│   ├── SUPABASE_QUICK_START.md # Supabase 빠른 시작
│   ├── SUPABASE_SETUP_GUIDE.md # Supabase 상세 가이드
│   ├── FINAL_SETUP.md          # 최종 설정 및 테스트
│   ├── WEB_APP_STRATEGY.md     # 웹앱 배포 전략
│   ├── QUICK_DEPLOY.md         # 빠른 배포 가이드
│   ├── DEPLOYMENT_GUIDE.md     # 배포 가이드
│   ├── STORE_RELEASE_PLAN.md   # 스토어 출시 계획
│   └── PRODUCT_STRATEGY.md     # 제품 전략
│
├── 🎨 assets/                  # 정적 리소스
│   ├── images/                 # 이미지 파일
│   └── fonts/                  # 폰트 파일
│
├── 🎨 constants/               # 상수 정의
│   └── Colors.ts               # 테마 색상
│
├── 🔗 hooks/                   # 커스텀 React Hooks
│   ├── useColorScheme.ts       # 다크모드 감지
│   └── useColorScheme.web.ts   # 웹용 다크모드
│
├── 📦 node_modules/            # npm 패키지 (gitignore)
│
├── 🚀 .github/                 # GitHub Actions
│   └── workflows/
│       └── vercel-deploy.yml   # Vercel 자동 배포
│
├── 📄 설정 파일
│   ├── package.json            # npm 패키지 설정
│   ├── package-lock.json       # 패키지 버전 잠금
│   ├── tsconfig.json           # TypeScript 설정
│   ├── app.json                # Expo 앱 설정
│   ├── vercel.json             # Vercel 배포 설정
│   ├── eslint.config.js        # ESLint 설정
│   ├── .gitignore              # Git 제외 파일
│   ├── .env.local.example      # 환경변수 예시
│   └── .env.local              # 환경변수 (gitignore)
│
└── 📖 문서
    ├── README.md               # 프로젝트 소개
    └── PROJECT_STRUCTURE.md    # 이 파일
```

## 🎯 핵심 폴더 설명

### `/app` - 앱 화면
Expo Router를 사용한 파일 기반 라우팅. 파일 구조가 곧 라우팅 구조입니다.

**주요 화면**:
- `(tabs)/` - 하단 탭 네비게이션 그룹
  - `index.tsx` - 홈 화면 (테라리움)
  - `calendar.tsx` - 캘린더 뷰
  - `entry.tsx` - 스트레스/해소 기록 추가
  - `terrarium.tsx` - 테라리움 상세 및 팁
- `auth.tsx` - 로그인/회원가입
- `_layout.tsx` - 앱 전체 레이아웃 (인증 체크)

### `/components` - 재사용 컴포넌트
여러 화면에서 사용되는 공통 UI 컴포넌트

**주요 컴포넌트**:
- `ThemedText.tsx`, `ThemedView.tsx` - 다크모드 지원 기본 컴포넌트
- `TerrariumView.tsx` - 테라리움 시각화 (나무, 식물 등)
- `InputModal.tsx` - 활동 기록 입력 모달

### `/services` - 비즈니스 로직
API 호출 및 데이터 처리 로직을 화면 컴포넌트와 분리

**주요 서비스**:
- `supabaseService.ts` - Supabase CRUD 작업
  - `saveEntry()` - 기록 저장
  - `getEntriesForMonth()` - 월별 데이터 조회
  - `signIn()`, `signUp()` - 인증

### `/lib` - 라이브러리 설정
외부 라이브러리 초기화 및 설정

**주요 파일**:
- `supabase.ts` - Supabase 클라이언트 생성 및 설정

### `/types` - TypeScript 타입
앱 전체에서 사용하는 타입 정의

**주요 타입**:
```typescript
ActivityEntry {
  id: string
  date: Date
  entry_type: 'stress' | 'relief'
  category: 'physical' | 'emotional' | 'behavioral'
  reaction: string
  intensity: 1-5
  notes?: string
}
```

### `/docs` - 프로젝트 문서
개발, 배포, 전략 관련 모든 문서

**문서 분류**:
- **개발**: DEVELOPMENT.md, CODE_STRUCTURE.md
- **데이터베이스**: DATABASE_SCHEMA.md, SUPABASE_*.md
- **배포**: WEB_APP_STRATEGY.md, DEPLOYMENT_GUIDE.md
- **전략**: PRODUCT_STRATEGY.md, STORE_RELEASE_PLAN.md

## 🔄 데이터 흐름

```
사용자 입력 (Entry Screen)
    ↓
SupabaseService.saveEntry()
    ↓
Supabase Database (activity_entries 테이블)
    ↓
SupabaseService.getEntriesForMonth()
    ↓
Calendar Screen (시각화)
```

## 🎨 스타일링 전략

- **Themed Components**: `ThemedText`, `ThemedView` 사용
- **Colors.ts**: 라이트/다크 모드 색상 정의
- **StyleSheet**: React Native 기본 스타일링
- **플랫폼별 스타일**: `Platform.select()` 사용

## 🔐 환경변수

```bash
# .env.local (gitignore)
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

**주의**: `.env.local`은 Git에 커밋되지 않습니다. `.env.local.example`을 참고하세요.

## 📦 주요 패키지

```json
{
  "expo": "~53.0.22",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "@supabase/supabase-js": "^2.47.10",
  "expo-router": "~4.0.23"
}
```

## 🚀 빌드 아웃풋

### 웹 빌드
```bash
npm run web
# → dist/ 폴더에 정적 파일 생성
```

### 네이티브 빌드
```bash
eas build -p android
# → APK/AAB 파일 생성
```

## 🔍 코드 네비게이션 팁

### 화면 추가하기
1. `app/(tabs)/` 에 새 파일 생성 (예: `stats.tsx`)
2. `app/(tabs)/_layout.tsx` 에 탭 설정 추가

### API 호출 추가하기
1. `services/supabaseService.ts` 에 메서드 추가
2. 화면 컴포넌트에서 호출

### 타입 추가하기
1. `types/index.ts` 에 타입 정의
2. 필요한 곳에서 import

## 📚 더 읽어보기

- [개발 가이드](docs/DEVELOPMENT.md) - 로컬 개발 환경 설정
- [코드 구조 상세](docs/CODE_STRUCTURE.md) - 각 파일 역할 설명
- [데이터베이스 스키마](docs/DATABASE_SCHEMA.md) - DB 구조 이해

---

*업데이트: 2025-12-06*
