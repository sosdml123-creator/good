// Vercel Routing Middleware
// Vercel은 정적 파일(dist/index.html)을 rewrites보다 먼저 서빙하므로,
// pc.sinsangpick.kr 첫 화면(/)도 애드센스 코드가 든 pc.html을 받도록 여기서 바꿔 줍니다.
// (나머지 경로는 vercel.json의 host 조건 rewrite가 처리)
export const config = { matcher: ['/', '/index.html'] };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname !== 'pc.sinsangpick.kr') return;
  url.pathname = '/pc.html';
  return new Response(null, { headers: { 'x-middleware-rewrite': url.toString() } });
}
