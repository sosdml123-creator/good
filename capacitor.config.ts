import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sinsangpick.app',
  appName: '신상픽',
  webDir: 'dist',
  server: {
    url: 'https://sinsangpick.vercel.app',
    cleartext: true,
    androidScheme: 'https',
    allowNavigation: [
      'sinsangpick.vercel.app',
      '*.supabase.co',
      'accounts.google.com',
      'appleid.apple.com',
      'kauth.kakao.com'
    ]
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
