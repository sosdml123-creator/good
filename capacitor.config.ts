import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sinsangpick.app',
  appName: '신상픽',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'never'
  },
  plugins: {
    PushNotifications: {
      // 앱이 열려 있을 때도 기기 알림 배너(상단 띠)를 띄웁니다. 없으면 iOS 가 포그라운드 푸시를 숨깁니다.
      presentationOptions: ['alert', 'badge', 'sound']
    }
  }
};

export default config;
