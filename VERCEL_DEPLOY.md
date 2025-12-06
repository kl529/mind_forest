# 🚀 Vercel 배포 가이드

## ✅ 배포 준비 완료 체크리스트

- [x] 프로젝트 구조 정리
- [x] 문서화 완료 (docs/ 폴더)
- [x] README.md 작성
- [x] Supabase 연동 완료
- [x] vercel.json 설정
- [x] .env.local.example 생성
- [x] Git 커밋 완료

## 🎯 Vercel 배포 3단계

### Step 1: Vercel 계정 로그인 (1분)

브라우저에서:
1. https://vercel.com 방문
2. "Sign Up" 또는 "Log In" 클릭
3. GitHub 계정으로 로그인

### Step 2: 프로젝트 배포 (2분)

#### 방법 A: CLI로 배포 (더 빠름)
```bash
# 터미널에서 실행
npx vercel

# 질문에 답변:
# ? Set up and deploy? → Y
# ? Which scope? → (본인 계정 선택)
# ? Link to existing project? → N
# ? What's your project's name? → mind-forest
# ? In which directory is your code located? → ./
# ? Want to override settings? → Y
# ? Build Command: npx expo export -p web
# ? Output Directory: dist
# ? Development Command: npx expo start --web
```

#### 방법 B: GitHub 연동 (더 자동화)
```bash
# 1. GitHub 저장소 생성 (github.com)
# 2. 원격 저장소 추가
git remote add origin https://github.com/[username]/mind_forest.git
git push -u origin main

# 3. Vercel 대시보드에서
# - "Add New..." → "Project" 클릭
# - GitHub에서 mind_forest 저장소 선택
# - "Import" 클릭
# - Build Settings:
#   - Framework Preset: Other
#   - Build Command: npx expo export -p web
#   - Output Directory: dist
#   - Install Command: npm install
```

### Step 3: 환경변수 설정 (1분)

Vercel 대시보드에서:
1. 배포된 프로젝트 선택
2. **Settings** → **Environment Variables** 클릭
3. 환경변수 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://oupcjhmfgifdxfzbplec.supabase.co` | Production, Preview, Development |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

4. **Save** 클릭
5. **Deployments** 탭 → 최신 배포 → **Redeploy** 클릭 (환경변수 적용을 위해)

## 🎉 배포 완료!

배포가 완료되면:
- **Production URL**: `https://mind-forest-xxx.vercel.app` (고유 URL 제공됨)
- **Preview URL**: PR 생성 시 자동으로 프리뷰 배포
- **자동 배포**: main 브랜치에 push하면 자동으로 재배포

## 🔗 URL 확인

```bash
# CLI에서 배포한 경우
# 터미널에 표시된 URL 확인

# 또는 Vercel 대시보드에서
# - 프로젝트 선택
# - "Visit" 버튼 클릭
```

## 📱 테스트 방법

### 웹 브라우저에서
1. 배포된 URL 접속
2. 로그인 (test@mindforest.app / testpassword123)
3. Entry 탭에서 기록 추가
4. Calendar 탭에서 확인

### 모바일에서
1. 스마트폰 브라우저에서 URL 접속
2. 홈 화면에 추가 (PWA 기능)
   - **iOS**: Safari → 공유 → "홈 화면에 추가"
   - **Android**: Chrome → 메뉴 → "홈 화면에 추가"

## 🔧 문제 해결

### 빌드 실패
```bash
# 로컬에서 먼저 빌드 테스트
npx expo export -p web

# 에러 확인 후 수정
# 수정 후 다시 배포
git add .
git commit -m "Fix build errors"
git push
```

### 환경변수 적용 안 됨
1. Vercel 대시보드 → Settings → Environment Variables 확인
2. 모든 Environment (Production, Preview, Development) 체크
3. Deployments → 최신 배포 → Redeploy 클릭

### 로그인 안 됨
1. Supabase 대시보드에서 URL과 Key 재확인
2. Vercel 환경변수가 올바른지 확인
3. 브라우저 개발자 도구 (F12) → Console 탭에서 에러 확인

## 📊 배포 모니터링

### Vercel Analytics (무료)
- 방문자 수 추적
- 페이지 로딩 속도
- 지역별 트래픽

활성화:
1. Vercel 프로젝트 → **Analytics** 탭
2. **Enable Analytics** 클릭

### 커스텀 도메인 (선택사항)
```
1. 도메인 구입 ($10-20/년)
   - Namecheap, GoDaddy 등

2. Vercel에서 도메인 연결
   - Settings → Domains
   - Add Domain
   - DNS 설정 (자동 안내)

3. 결과
   mind-forest.vercel.app → mindforest.app
```

## 🚀 다음 단계

### 즉시 (배포 후)
- [ ] 친구 10명에게 URL 공유
- [ ] 피드백 수집 (Google Forms 등)
- [ ] 버그 및 개선사항 기록

### 1주 후
- [ ] 사용자 행동 분석 (Analytics)
- [ ] 피드백 기반 개선
- [ ] 추가 기능 개발

### 1개월 후
- [ ] PWA 최적화 (오프라인 지원)
- [ ] 푸시 알림 추가
- [ ] 스토어 출시 검토

## 💡 유용한 명령어

```bash
# 프로덕션 배포
npx vercel --prod

# 프리뷰 배포 (테스트용)
npx vercel

# 배포 로그 확인
npx vercel logs

# 환경변수 확인
npx vercel env ls

# 도메인 확인
npx vercel domains ls
```

## 📞 추가 도움

- [Vercel 공식 문서](https://vercel.com/docs)
- [Expo 웹 배포 가이드](https://docs.expo.dev/distribution/publishing-websites/)
- [Supabase 환경변수 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/react)

---

**배포 완료를 축하합니다! 🎉**

이제 Mind Forest가 전 세계 누구나 접속할 수 있습니다.

*업데이트: 2025-12-06*
