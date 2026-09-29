import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientId = env.NAVER_CLIENT_ID || env.VITE_NAVER_CLIENT_ID || '';
  const clientSecret = env.NAVER_CLIENT_SECRET || env.VITE_NAVER_CLIENT_SECRET || '';

  return {
    plugins: [
      react(),
      {
        name: 'discount-crawler-middleware',
        configureServer(server) {
          server.middlewares.use('/api/crawl-discounts', async (req, res) => {
            try {
              const handlerModule = await import('./api/crawl-discounts.js');
              const handler = handlerModule.default;
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const query = Object.fromEntries(url.searchParams.entries());
              
              const fakeRes = {
                statusCode: 200,
                headers: {},
                setHeader(name, val) {
                  this.headers[name] = val;
                  res.setHeader(name, val);
                },
                status(code) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
                end(data) {
                  res.end(data);
                }
              };

              await handler({ query, method: req.method, headers: req.headers }, fakeRes);
            } catch (err) {
              console.error('Crawler middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      },
      {
        name: 'kamis-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/kamis', async (req, res) => {
            try {
              const handlerModule = await import('./api/kamis.js');
              const handler = handlerModule.default;
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const query = Object.fromEntries(url.searchParams.entries());

              const fakeRes = {
                statusCode: 200,
                headers: {},
                setHeader(name, val) {
                  this.headers[name] = val;
                  res.setHeader(name, val);
                },
                status(code) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
                end(data) {
                  res.end(data);
                }
              };

              await handler({ query, method: req.method, headers: req.headers }, fakeRes);
            } catch (err) {
              console.error('KAMIS middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      }
    ],
    build: {
      // 청크 경고 임계값 상향 (대형 mock 데이터 파일 고려)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 벤더 라이브러리를 별도 청크로 분리 (장기 캐시 활용)
          manualChunks: (id) => {
            // React 코어 (가장 안정적, 장기 캐시)
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            // Supabase SDK (업데이트 빈도 낮음)
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            // Capacitor 플러그인 (업데이트 빈도 낮음)
            if (id.includes('node_modules/@capacitor/') || id.includes('node_modules/@capacitor-community/')) {
              return 'vendor-capacitor';
            }
            // lucide-react 아이콘 라이브러리
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-lucide';
            }
            // Admin 전용 컴포넌트 (일반 유저 불필요)
            if (id.includes('/components/admin/')) {
              return 'chunk-admin';
            }
            // 대용량 Mock 데이터 파일들 (별도 청크로 분리)
            if (
              id.includes('/data/mockProducts') ||
              id.includes('/data/samyangProducts') ||
              id.includes('/data/tljProducts') ||
              id.includes('/data/sungsimdangProducts') ||
              id.includes('/data/iceCreamProducts') ||
              id.includes('/data/pizzaProducts') ||
              id.includes('/data/agriMarineProducts')
            ) {
              return 'data-products';
            }
            // 나머지 data 파일
            if (id.includes('/src/data/')) {
              return 'data-misc';
            }
          },
        },
      },
      // 소스맵 (production에서 불필요하므로 비활성화로 번들 크기 감소)
      sourcemap: false,
      // 최적화 타겟
      target: 'es2020',
    },
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
