# 신상픽(SinSangPick) 웹-앱 실시간 콘텐츠 동기화 아키텍처

## 1. 개요
신상픽은 웹(Vercel)과 모바일 앱(iOS/Android Capacitor)이 100% 동일한 배너, 신제품, 홈 화면 구좌 설정을 실시간으로 공유하고 반영할 수 있도록 스마트 동기화 아키텍처를 적용했습니다.

---

## 2. 해결된 핵심 문제
1. **로컬스토리지 캐시 고착화 문제 해결**:
   - 기존에는 앱 기기에 `sinsangpick_banners`, `sinsangpick_products`가 저장되어 있으면 코드(`INITIAL_BANNERS`, `INITIAL_PRODUCTS`)의 변경사항이 덮어씌워지지 않고 옛날 데이터가 영구 고정되던 문제를 완전 해결했습니다.
   - `smartMergeBanners`, `smartMergeProducts`, `smartMergeHomeSections` 엔진을 통해 코드의 최신 공식 데이터와 사용자의 커스텀 수정 데이터를 지능적으로 병합합니다.
2. **웹 관리자 수정사항 실시간 클라우드 동기화**:
   - 웹 관리자 콘솔에서 배너를 추가/수정/삭제/순서변경하거나 제품을 수정하면, 로컬뿐만 아니라 원격 클라우드(`products` 테이블 내 `__sinsangpick_system_banners__` 컨테이너 및 `/api/site-content`)에 실시간 저장됩니다.
   - Supabase Realtime 리스너 및 앱 라이프사이클 훅(`appStateChange`, `focus`)을 통해 모바일 앱 기기에서도 앱을 켜거나 포그라운드로 복귀할 때 1초 이내에 자동 반영됩니다.

---

## 3. 동기화 파이프라인
```
[웹 관리자 콘솔]
   │
   ├─► 1. LocalStorage 저장 (초고속 캐싱)
   │
   └─► 2. Supabase Cloud Record (__sinsangpick_system_banners__) & API 저장
             │
             ├─► [Supabase Realtime Webhook / Postgres Changes]
             │         │
             │         ▼
             │   [모바일 앱 (iOS/Android)] 실시간 화면 갱신
             │
             └─► [앱 포그라운드 복귀 시 (Foreground Resume)]
                       │
                       ▼
                 [smartMergeBanners / smartMergeProducts] 최신 자동 머지
```

---

## 4. 관련 파일
- `api/site-content.js`: 원격 배너/설정 Vercel Serverless 엔드포인트
- `src/services/siteContentService.ts`: 원격 콘텐츠 조회 및 저장 서비스
- `src/context/AppContext.tsx`: 스마트 머지 및 실시간 동기화 상태 관리
- `src/components/admin/AdminDashboard.tsx`: 관리자 헤더 내 '웹/앱 실시간 동기화' 버튼
