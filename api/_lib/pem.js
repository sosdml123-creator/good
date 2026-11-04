/**
 * 환경변수에 붙여넣은 비공개 키를 Node crypto 가 읽을 수 있는 PEM 으로 정리합니다.
 * Vercel 입력창에 붙여넣으면서 생기는 흔한 깨짐을 모두 받아줍니다:
 *  - 줄바꿈이 문자 그대로 "\n" 이거나 공백으로 합쳐진 경우
 *  - 앞뒤 따옴표가 붙은 경우
 *  - BEGIN/END 줄 없이 본문(base64)만 넣은 경우
 *  - PEM 전체를 다시 base64 로 인코딩해 넣은 경우
 */
export function normalizePrivateKey(raw) {
  let text = String(raw || '').trim().replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n').trim();
  if (!text) return '';

  if (!text.includes('-----BEGIN')) {
    const decoded = Buffer.from(text.replace(/\s+/g, ''), 'base64').toString('utf8');
    if (decoded.includes('-----BEGIN')) text = decoded.trim();
  }

  const match = text.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  const label = match ? match[1] : 'PRIVATE KEY';
  const body = (match ? match[2] : text).replace(/[^A-Za-z0-9+/=]/g, '');
  if (!body) return '';
  const lines = body.match(/.{1,64}/g).join('\n');
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}
