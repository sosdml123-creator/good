# Agent Guidelines - 신상픽 (Sinsangpick)

## 🚀 배포: 요청당 한 번, 명령 하나로
- 코드를 수정한 요청은 "배포해줘"가 없어도 **마지막에 한 번만** 아래 명령으로 배포합니다 (중간 단계마다 배포 금지, 여러 수정은 묶어서 한 커밋).
  - `node scripts/deploy.cjs "커밋 제목" "본문(선택)"`
  - 빌드(`tsc && vite build`) → `npx cap sync ios` → `git add -A` → 커밋 → `git push origin HEAD:main`을 한 번에 실행하고 결과를 한 줄로 출력합니다. 실패 시 해당 단계 로그만 출력되므로 고친 뒤 같은 명령을 다시 실행합니다.
  - build / cap sync / git add·commit·push를 따로 실행하지 않습니다.
- 푸시하면 Vercel Production이 자동 배포됩니다. iOS(`ios-deploy.yml`)는 자동 실행하지 않고, 앱 업로드가 필요할 때 Actions 탭에서 Run workflow로 수동 실행합니다 (macOS 분 과금). 배포 후 파이프라인·사이트 확인은 사용자가 요청할 때만 합니다.
- 코드 변경이 없는 질문·조사 요청은 배포하지 않습니다.
- 결과 보고는 변경 내용과 배포 커밋을 3~5줄로 짧게 전달합니다.

## 💡 토큰 절약
- `src/data/mockProducts.ts`(1MB 이상)와 루트·`scripts/`의 대형 `*.json`은 통째로 읽지 않습니다. Grep(`head_limit` 지정)으로 필요한 줄만 찾고 `offset`/`limit`으로 부분만 읽습니다.
- 수정할 파일만 읽고, 이미 읽은 파일을 다시 읽거나 수정 후 확인용으로 재조회하지 않습니다.
- 빌드·테스트 전체 로그를 출력하지 않습니다 (배포 스크립트가 요약).
- 브라우저 스크린샷 검증은 UI 변경을 사용자가 확인 요청했을 때만 합니다.

## 🚫 절대 금지: Capacitor `server.url` 설정 (앱 먹통 방지)
- `capacitor.config.ts`의 `server`에는 `server.url`을 **절대로** 추가하지 않습니다 (`androidScheme: 'https'`만 유지).
- 이유: 외부 URL을 지정하면 로컬 번들(`dist`) 대신 원격 사이트를 띄우므로, 배포 누락(404)·네트워크 장애 시 앱 전체가 먹통이 되고 App Store 가이드라인 4.2(웹 래퍼) 리젝 사유가 됩니다.
- 앱은 반드시 로컬 번들(`webDir: 'dist'`)을 서빙하고, 실시간 데이터(배너, 신제품, 랭킹 등)는 Supabase REST / Realtime API로 클라이언트에서 페치합니다.
