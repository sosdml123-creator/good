import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientId = env.VITE_NAVER_CLIENT_ID || 'ha89ylxb53';
  const clientSecret = env.VITE_NAVER_CLIENT_SECRET || '4hm7znMnOmGyvtw2xnvEjTWoRG1UZeLqlccI7b4p';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api/naver': {
          target: 'https://naverapihub.apigw.ntruss.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const type = url.searchParams.get('type') || 'news';
            url.searchParams.delete('type');
            const search = url.searchParams.toString();
            return `/search/v1/${type}${search ? `?${search}` : ''}`;
          },
          headers: {
            'X-NCP-APIGW-API-KEY-ID': clientId,
            'X-NCP-APIGW-API-KEY': clientSecret,
          },
        },
      },
    },
  };
});
