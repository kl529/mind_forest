# 🌱 Mind Forest

> 스트레스를 기록하고, 해소하고, 성장하는 나만의 마음 숲

Mind Forest는 20대를 위한 스트레스 관리 앱입니다. 일상의 스트레스를 쉽게 기록하고, 패턴을 발견하며, 건강한 대처법을 키워갈 수 있습니다.

## ✨ 주요 기능

### 📝 간편한 기록
- **스트레스 기록**: 신체적/정서적/행동적 반응을 빠르게 기록
- **해소 활동 추적**: 스트레스 해소에 도움된 활동 기록
- **강도 선택**: 1-5 단계로 강도 표시
- **메모 작성**: 상황과 감정을 자유롭게 기록

### 📅 시각적 캘린더
- **월간 뷰**: 한눈에 보는 스트레스 패턴
- **색상 코딩**: 날짜별 스트레스 레벨을 색상으로 표시
- **상세 보기**: 날짜를 탭하여 일별 기록 확인

### 🌳 테라리움 성장
- **시각적 피드백**: 꾸준한 기록으로 성장하는 나무
- **Streak 추적**: 연속 기록 일수 확인
- **동기부여**: 성장하는 숲을 보며 동기 유지

### 💡 실용적인 팁
- **상황별 팁**: 다양한 스트레스 해소 방법 제안
- **카테고리별 전략**: 신체적/정서적/행동적 대처법

## 🚀 빠른 시작

### 웹에서 사용하기
🌐 **배포된 앱**: [https://mind-forest.vercel.app](https://mind-forest.vercel.app) (배포 예정)

### 로컬 개발 환경

#### 요구사항
- Node.js 18+
- npm 또는 yarn

#### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/[username]/mind_forest.git
cd mind_forest

# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 웹 브라우저에서 실행
npm run web

# iOS 시뮬레이터에서 실행 (Mac only)
npm run ios

# Android 에뮬레이터에서 실행
npm run android
```

#### 환경변수 설정
```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# Supabase 키 입력
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 문서

### 개발 가이드
- [개발 가이드](docs/DEVELOPMENT.md) - 로컬 개발 환경 설정
- [코드 구조](docs/CODE_STRUCTURE.md) - 프로젝트 파일 구조 설명
- [데이터베이스 스키마](docs/DATABASE_SCHEMA.md) - Supabase 데이터베이스 구조

### Supabase 설정
- [Supabase 빠른 시작](docs/SUPABASE_QUICK_START.md) - Supabase 설정 및 SQL 실행
- [Supabase 설정 가이드](docs/SUPABASE_SETUP_GUIDE.md) - 상세 설정 가이드
- [최종 설정 및 테스트](docs/FINAL_SETUP.md) - 완전한 설정 및 테스트 방법

### 배포 가이드
- [웹앱 배포 전략](docs/WEB_APP_STRATEGY.md) - PWA 및 웹앱 배포 가이드 (추천)
- [빠른 배포 가이드](docs/QUICK_DEPLOY.md) - Vercel, Expo Go, EAS Build
- [배포 가이드](docs/DEPLOYMENT_GUIDE.md) - 다양한 배포 옵션
- [스토어 출시 계획](docs/STORE_RELEASE_PLAN.md) - Google Play / App Store 출시 가이드

### 제품 전략
- [제품 전략](docs/PRODUCT_STRATEGY.md) - 문제 정의 및 솔루션

## 🛠 기술 스택

### Frontend
- **React Native** - 크로스 플랫폼 모바일 앱
- **Expo** (~53.0.22) - React Native 개발 도구
- **TypeScript** - 타입 안정성

### Backend
- **Supabase** - 백엔드 서비스
  - PostgreSQL 데이터베이스
  - 인증 (Authentication)
  - Row Level Security (RLS)

### 배포
- **Vercel** - 웹 호스팅
- **Expo EAS** - 네이티브 앱 빌드 (선택사항)

## 📂 프로젝트 구조

```
mind_forest/
├── app/                      # 앱 화면 (Expo Router)
│   ├── (tabs)/              # 탭 네비게이션
│   │   ├── index.tsx        # 홈 화면
│   │   ├── calendar.tsx     # 캘린더 화면
│   │   ├── entry.tsx        # 기록 추가 화면
│   │   └── terrarium.tsx    # 테라리움 화면
│   ├── auth.tsx             # 로그인 화면
│   └── _layout.tsx          # 루트 레이아웃
├── components/              # 재사용 가능한 컴포넌트
│   ├── TerrariumView.tsx
│   ├── InputModal.tsx
│   └── ui/                  # UI 컴포넌트
├── services/                # 비즈니스 로직
│   └── supabaseService.ts   # Supabase API 호출
├── lib/                     # 라이브러리 설정
│   └── supabase.ts          # Supabase 클라이언트
├── types/                   # TypeScript 타입 정의
│   └── index.ts
├── utils/                   # 유틸리티 함수
│   ├── stressCalculator.ts
│   └── dataStorage.ts
├── supabase/                # 데이터베이스 마이그레이션
│   └── migrations/
├── docs/                    # 프로젝트 문서
└── assets/                  # 이미지, 폰트 등
```

## 🎯 문제 정의

### 타겟 문제
Mind Forest는 스트레스를 받는 성인들이 직면한 3가지 핵심 과제를 해결합니다:

1. **인지 Gap**: 자신이 얼마나 스트레스를 받고 있는지 인지하지 못함
2. **해결 Gap**: 스트레스를 인지하지만 어떻게 해결해야 할지 모름
3. **실천 Gap**: 해결 방법을 알지만 꾸준히 실천하기 어려움

### 타겟 사용자

**주요 타겟**: 20대 스트레스를 받는 성인
- 아직 효과적인 스트레스 관리법을 개발하지 못한 사람들
- 최근 직장 생활 시작, 업무와 대인관계 스트레스
- 가벼운 피로와 신체화 증상 경험
- "힘들다"는 인식은 있지만 다음 단계를 모름

## 🎯 로드맵

### Phase 1: MVP (완료) ✅
- [x] 스트레스/해소 기록 기능
- [x] 캘린더 시각화
- [x] Supabase 연동
- [x] 기본 인증

### Phase 2: 웹앱 배포 (진행 중) 🚀
- [ ] Vercel 배포
- [ ] PWA 최적화
- [ ] 베타 테스트

### Phase 3: 개선 (계획)
- [ ] 통계 및 인사이트
- [ ] 푸시 알림
- [ ] 오프라인 지원
- [ ] 데이터 내보내기

### Phase 4: 스토어 출시 (미래)
- [ ] Google Play Store
- [ ] Apple App Store

## 🤝 기여하기

이 프로젝트는 현재 개인 프로젝트입니다. 피드백과 제안은 언제나 환영합니다!

## 📄 라이선스

MIT License

## 📞 문의

프로젝트 관련 문의나 피드백은 Issues를 통해 남겨주세요.

---

*Made with ❤️ for better mental health*
