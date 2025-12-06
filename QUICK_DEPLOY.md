# Mind Forest - 빠른 배포 가이드

## 🚀 가장 간단한 방법: Vercel로 웹 배포 (5분)

### Step 1: Vercel 계정 생성
1. https://vercel.com 방문
2. "Start Deploying" 또는 "Sign Up" 클릭
3. GitHub 계정으로 로그인

### Step 2: GitHub에 코드 푸시
```bash
# 현재 변경사항 커밋
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 3: Vercel에서 프로젝트 임포트
1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub에서 `mind_forest` 저장소 선택
3. **"Import"** 클릭

### Step 4: 프로젝트 설정
1. **Framework Preset**: "Other" 선택
2. **Build Command**: `npx expo export -p web`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### Step 5: 환경변수 설정
"Environment Variables" 섹션에서 추가:

| Name | Value |
|------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://oupcjhmfgifdxfzbplec.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (전체 키) |

### Step 6: 배포 시작
1. **"Deploy"** 버튼 클릭
2. 빌드 완료까지 2-3분 대기
3. 배포 완료 후 URL 확인: `https://mind-forest-xxx.vercel.app`

### Step 7: URL 공유
- 배포된 URL을 친구들과 공유
- 모바일/데스크탑 브라우저에서 접속 가능
- **주의**: 웹 버전이므로 일부 네이티브 기능은 제한될 수 있음

---

## 📱 대안: Expo Go로 즉시 테스트 (현재 실행 중)

현재 개발 서버가 실행 중이므로 즉시 공유할 수 있습니다!

### 테스터에게 전달할 내용:
1. **Expo Go 앱 설치**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **QR 코드 스캔**
   - 터미널에 표시된 QR 코드를 사진으로 찍어 공유
   - Expo Go 앱에서 QR 코드 스캔

3. **또는 터널 모드 사용** (더 안정적)
   ```bash
   # 현재 서버 중지 (Ctrl+C)
   npm start -- --tunnel
   ```
   - 공개 URL이 생성됩니다
   - 이 URL을 공유하면 어디서든 접속 가능

---

## 📦 APK 파일로 배포 (Android)

실제 앱처럼 설치 가능한 APK를 만들고 싶다면:

### Step 1: EAS CLI 설치
```bash
npm install -g eas-cli
```

### Step 2: Expo 계정 생성
```bash
eas login
# 계정이 없다면:
# https://expo.dev 에서 회원가입 후 로그인
```

### Step 3: 프로젝트 설정
```bash
eas build:configure
```

### Step 4: APK 빌드
```bash
eas build -p android --profile preview
```

- 빌드 시작 후 20-30분 대기
- 완료 후 APK 다운로드 링크 제공
- 링크를 공유하여 직접 설치 가능
- **무료 플랜**: 월 30회 빌드 가능

---

## 🎯 추천 순서

### 지금 당장 테스트하고 싶다면:
1. **Expo Go** (현재 실행 중) - 0분
   - 개발 서버가 이미 실행 중
   - QR 코드만 공유하면 끝

2. **터널 모드** - 1분
   ```bash
   npm start -- --tunnel
   ```
   - 공개 URL 생성
   - 안정적인 연결

### 제대로 된 URL로 공유하고 싶다면:
- **Vercel 배포** - 5분
  - 웹 URL로 공유
  - 자동 배포 설정

### 실제 앱으로 설치하고 싶다면:
- **EAS Build** - 30분
  - Android APK 생성
  - 직접 설치 가능

---

## ✅ 현재 상태 체크

- ✅ `vercel.json` 생성 완료
- ✅ GitHub Actions 워크플로우 설정 완료
- ✅ 개발 서버 실행 중
- ⏸️ GitHub에 푸시 필요
- ⏸️ Vercel 계정 생성 및 연동 필요

---

## 🆘 필요한 도움

어떤 방법으로 배포하고 싶으신가요?

1. **Vercel (웹)** - 가장 간단, URL로 즉시 공유
2. **Expo Go** - 현재 서버로 즉시 테스트
3. **EAS Build (APK)** - 실제 앱 설치 파일

선택하시면 해당 방법을 함께 진행하겠습니다!
