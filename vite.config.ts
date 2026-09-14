import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clientId = env.VITE_NAVER_CLIENT_ID || 'ha89ylxb53';
  const clientSecret = env.VITE_NAVER_CLIENT_SECRET || '4hm7znMnOmGyvtw2xnvEjTWoRG1UZeLqlccI7b4p';

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
      }
    ],
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
