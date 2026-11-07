import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// 애드센스 코드는 PC 사이트(pc.sinsangpick.kr)에만 넣습니다.
// 빌드 후 dist/index.html에 코드를 넣은 dist/pc.html을 만들고, vercel.json이 pc 주소 요청을 pc.html로 보냅니다.
const ADSENSE_TAG = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916" crossorigin="anonymous"></script>';
function pcAdsenseHtml() {
  let outDir = 'dist';
  return {
    name: 'pc-adsense-html',
    apply: 'build' as const,
    configResolved(c: { root: string; build: { outDir: string } }) { outDir = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      const src = path.join(outDir, 'index.html');
      if (!fs.existsSync(src)) return;
      const html = fs.readFileSync(src, 'utf8').replace('<head>', '<head>\n    ' + ADSENSE_TAG);
      fs.writeFileSync(path.join(outDir, 'pc.html'), html);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientId = env.NAVER_CLIENT_ID || env.VITE_NAVER_CLIENT_ID || '';
  const clientSecret = env.NAVER_CLIENT_SECRET || env.VITE_NAVER_CLIENT_SECRET || '';

  return {
    plugins: [
      react(),
      pcAdsenseHtml(),
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
        name: 'giftishow-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/giftishow', async (req, res) => {
            try {
              // 핸들러가 process.env 에서 서버 전용 키를 읽으므로 .env 값을 먼저 주입
              for (const [key, value] of Object.entries(env)) {
                if (process.env[key] === undefined) process.env[key] = value;
              }
              const handler = (await import('./api/giftishow.js')).default;
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const query = Object.fromEntries(url.searchParams.entries());

              let body = {};
              if (req.method === 'POST') {
                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
              }

              const fakeRes = {
                setHeader(name, val) {
                  res.setHeader(name, val);
                },
                status(code) {
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

              await handler({ query, body, method: req.method, headers: req.headers }, fakeRes);
            } catch (err) {
              console.error('Giftishow middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      },
      {
        name: 'pending-products-middleware',
        configureServer(server) {
          server.middlewares.use('/api/pending-products', async (req, res) => {
            try {
              for (const key of ['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_ANON_KEY', 'NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET']) {
                if (env[key] && !process.env[key]) process.env[key] = env[key];
              }
              const handlerModule = await import('./api/pending-products.js');
              const handler = handlerModule.default;
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const query = Object.fromEntries(url.searchParams.entries());

              const executeHandler = async (body = '') => {
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

                await handler({ query, method: req.method, headers: req.headers, body }, fakeRes);
              };

              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });
                req.on('end', () => {
                  executeHandler(body);
                });
              } else {
                await executeHandler('');
              }
            } catch (err: any) {
              console.error('Pending products middleware error:', err);
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
      },
      {
        name: 'naver-api-middleware',
        configureServer(server) {
          if (clientId && !process.env.NAVER_CLIENT_ID) {
            process.env.NAVER_CLIENT_ID = clientId;
          }
          if (clientSecret && !process.env.NAVER_CLIENT_SECRET) {
            process.env.NAVER_CLIENT_SECRET = clientSecret;
          }

          server.middlewares.use('/api/naver', async (req, res) => {
            try {
              if (clientId && !process.env.NAVER_CLIENT_ID) process.env.NAVER_CLIENT_ID = clientId;
              if (clientSecret && !process.env.NAVER_CLIENT_SECRET) process.env.NAVER_CLIENT_SECRET = clientSecret;

              const handlerModule = await import('./api/naver.js');
              const handler = handlerModule.default;
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const query = Object.fromEntries(url.searchParams.entries());

              const executeHandler = async (body = '') => {
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

                await handler({ query, method: req.method, headers: req.headers, body }, fakeRes);
              };

              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });
                req.on('end', () => {
                  executeHandler(body);
                });
              } else {
                await executeHandler('');
              }
            } catch (err) {
              console.error('NAVER API middleware error:', err);
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
    },
  };
});
