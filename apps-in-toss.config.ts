import { defineConfig } from '@apps-in-toss/web-framework/config';

// 토스 번들은 --mode toss 로 빌드합니다 (src/utils/toss.ts 의 IS_TOSS 가 true 가 됩니다).
// 앱 이름·로고는 SDK 3.x 에서 콘솔에서만 설정합니다.
export default defineConfig({
  appName: 'sinsangpick',
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'vite --mode toss',
      build: 'vite build --mode toss',
    },
  },
  permissions: [],
});
