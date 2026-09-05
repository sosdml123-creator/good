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
