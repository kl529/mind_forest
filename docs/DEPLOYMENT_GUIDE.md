# Mind Forest - 배포 가이드

## 🚀 간단한 배포 방법들

### 방법 1: Vercel로 웹 배포 (가장 간단) ⭐

웹 버전으로 배포하여 URL로 즉시 공유할 수 있습니다.

#### 설정 단계:
1. **Vercel 계정 생성**
   - https://vercel.com 방문
   - GitHub 계정으로 로그인

2. **프로젝트 배포**
   ```bash
   npm install -g vercel
   vercel
   ```

   또는 **GitHub 연동** (더 간단):
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 선택 (mind_forest)
   - "Deploy" 클릭

3. **환경변수 설정**
   - Vercel 프로젝트 설정 → Environment Variables
   - `.env.local` 파일의 내용 추가:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://oupcjhmfgifdxfzbplec.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
     ```

4. **자동 배포**
   - main 브랜치에 push하면 자동으로 배포됩니다
   - 배포 URL: `https://mind-forest-xxx.vercel.app`

---

### 방법 2: Expo Development Build (QR 코드 공유)

현재 실행 중인 개발 서버를 QR 코드로 공유할 수 있습니다.

#### 사용 방법:
1. **개발 서버가 실행 중이어야 함**
   ```bash
   npm start
   ```

2. **QR 코드 공유**
   - 터미널에 표시된 QR 코드를 사진으로 찍어 공유
   - 또는 터널 모드로 실행:
     ```bash
     npm start -- --tunnel
     ```

3. **테스터가 Expo Go 앱 설치**
   - Android: Play Store에서 "Expo Go" 설치
   - iOS: App Store에서 "Expo Go" 설치
   - QR 코드 스캔하여 앱 실행

**제한사항**:
- 개발 서버가 계속 실행되어야 함
- 네트워크 환경에 따라 연결이 불안정할 수 있음

---

### 방법 3: EAS Build (APK 배포) - Android

실제 APK 파일을 생성하여 직접 설치할 수 있습니다.

#### 초기 설정:
1. **EAS CLI 설치**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo 계정 로그인**
   ```bash
   eas login
   ```

3. **프로젝트 설정**
   ```bash
   eas build:configure
   ```

4. **Android APK 빌드**
   ```bash
   eas build -p android --profile preview
   ```

   - 빌드 완료 후 APK 다운로드 링크가 제공됩니다
   - 링크를 공유하여 직접 설치 가능
   - 무료 플랜: 월 30회 빌드 가능

5. **환경변수 설정**
   - `eas.json` 파일에서 환경변수 설정
   - 또는 Expo 대시보드에서 설정

---

### 방법 4: GitHub Pages (웹 배포)

무료 정적 호스팅으로 간단하게 배포할 수 있습니다.

#### 설정 단계:
1. **정적 웹 빌드 생성**
   ```bash
   npx expo export -p web
   ```

2. **GitHub Pages 배포**
   - GitHub 저장소 → Settings → Pages
   - Source: "GitHub Actions" 선택
   - `.github/workflows/deploy.yml` 생성 (아래 참고)

3. **배포 URL**
   - `https://[username].github.io/mind_forest`

---

## 🎯 추천 방법

### 즉시 테스트하고 싶다면:
1. **Vercel** (웹) - 5분 내 배포 가능
2. **Expo Go** (모바일) - 현재 실행 중인 서버로 즉시 공유

### 실제 앱으로 배포하고 싶다면:
1. **EAS Build** (Android APK) - 20분 내 APK 생성
2. **TestFlight** (iOS) - Apple 개발자 계정 필요 ($99/년)

---

## 📝 다음 단계 추천

### 현재 상황:
- ✅ Supabase 연동 완료
- ✅ 기본 기능 구현 완료
- ⏸️ 배포 준비 필요

### 추천 순서:
1. **Vercel로 웹 배포** (5분)
   - URL로 즉시 공유 가능
   - 데스크탑/모바일 브라우저에서 테스트

2. **EAS Build로 APK 생성** (20분)
   - 안드로이드 실제 기기에서 테스트
   - Google Play Store 배포 전 테스트용

3. **피드백 수집 후 개선**
   - 실제 사용자 피드백 반영
   - UI/UX 개선

4. **스토어 배포**
   - Google Play Store (Android)
   - App Store (iOS)

---

## 🔍 문제 해결

### Vercel 배포 시 에러
- 환경변수가 제대로 설정되었는지 확인
- 빌드 로그에서 에러 메시지 확인

### EAS Build 실패
- `app.json` 설정 확인
- `eas.json` 프로필 확인
- 환경변수 설정 확인

### Expo Go 연결 안 됨
- 같은 Wi-Fi 네트워크에 연결되어 있는지 확인
- 방화벽 설정 확인
- `--tunnel` 옵션 사용

---

*업데이트: 2025-12-06*
