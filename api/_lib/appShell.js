// 빌드된 홈 본문 전체를 교체합니다. 중첩된 카드 div도 함께 제거합니다.
export function replaceRoot(html, body) {
  const root = /<div\b[^>]*\bid=["']root["'][^>]*>/i.exec(html);
  if (!root) throw new Error('App root missing from template');
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = root.index + root[0].length;
  let depth = 1;
  for (let tag; (tag = tags.exec(html));) {
    depth += /^<\//.test(tag[0]) ? -1 : 1;
    if (!depth) return html.slice(0, root.index + root[0].length) + body + html.slice(tag.index);
  }
  throw new Error('Unclosed app root');
}
