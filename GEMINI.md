# Agent Guidelines - 신상픽 (Sinsangpick)

## 🚀 필수 원칙: 배포 단계까지 무조건 완수 (Always Deploy)
사용자가 기능 구현, 버그 수정, UI 변경 등 어떠한 작업 명령을 내리더라도 코드 수정에서 멈추지 않고 **무조건 배포 단계까지 자동 완수**합니다.

### 완료 체크리스트 (매 작업 시 필수 실행)
1. **코드 구현 및 정합성 점검**
   - 요청된 요구사항 완성 및 기존 기능 사이드이펙트 방지
2. **빌드 & 타입 체크 검증**
   - `npm run build` (`tsc && vite build`) 통과 필수 (에러 0건)
   - Capacitor iOS 동기화: `npx cap sync ios`
3. **Git 커밋 & 원격 푸시 (배포 트리거)**
   - `git add .`
   - 작업 내용을 명확히 기술한 커밋 메시지로 `git commit -m "..."`
   - `git push origin main` 실행
   - GitHub Actions (`ios-deploy.yml` App Store Connect 업로드) 및 Vercel Production 자동 배포 트리거
4. **결과 보고**
   - 배포 커밋 및 배포 파이프라인 트리거 완료 상황을 사용자에게 명확히 전달

## 🚫 절대 금지 규칙: Capacitor `server.url` 외부 원격 웹뷰 URL 설정 금지 (앱 먹통 방지)
- **발생 배경 및 원인**:
  - `capacitor.config.ts`의 `server.url`에 `'https://sinsangpick.vercel.app'` 등 외부 URL을 지정하면, 앱 시작 시 로컬 번들(`dist`) 대신 해당 원격 웹사이트로 리다이렉트됩니다.
  - Vercel 배포 미존재(`404 DEPLOYMENT_NOT_FOUND`)나 네트워크 지연, 서버 장애 발생 시 iOS/Android 앱 전체가 에러 화면으로 즉시 먹통(Blackout)이 되어 사용자 접속이 전면 마비됩니다.
  - 또한 오프라인 구동 불가로 인해 Apple App Store 가이드라인 4.2(웹 래퍼 / 최소 기능 미충족) 리젝 사유가 됩니다.
- **영구 준수 철칙**:
  - `capacitor.config.ts`의 `server` 객체에는 `server.url`을 **절대로** 추가하지 않습니다 (`androidScheme: 'https'`만 유지).
  - 모바일 앱은 반드시 빌드된 로컬 번들(`webDir: 'dist'`)을 자체 로컬 서빙(`capacitor://localhost` / `https://localhost`)해야 합니다.
  - 실시간 데이터(배너, 신제품, 랭킹 등)는 웹뷰 URL 변경이 아니라 Supabase REST / Realtime API를 통해 클라이언트 내부에서 동적으로 페치합니다.

