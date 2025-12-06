# 🚀 지금 바로 배포하기

## ⚡ 가장 빠른 방법 (3분)

### 터미널에서 이 명령어 하나만 실행하세요:

```bash
npx vercel
```

### 질문에 이렇게 답변하세요:

```
? Set up and deploy? → Y
? Which scope? → (본인 계정 선택)
? Link to existing project? → N
? What's your project's name? → mind-forest
? In which directory is your code located? → ./ (엔터)
? Want to override settings? → Y
  ? Build Command: npx expo export -p web
  ? Output Directory: dist
  ? Development Command: npx expo start --web
```

## ✅ 배포 후 할 일

1. **URL 복사**: 터미널에 표시된 `https://mind-forest-xxx.vercel.app`
2. **환경변수 설정**: https://vercel.com/dashboard → 프로젝트 선택 → Settings → Environment Variables
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://oupcjhmfgifdxfzbplec.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = `.env.local` 파일의 키 복사
3. **재배포**: Deployments → 최신 배포 → Redeploy

## 🎉 완료!

URL을 친구들에게 공유하세요!

---

더 자세한 가이드: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
