// 한 번에 배포: 빌드 → cap sync ios → 커밋 → main 푸시
// 사용: node scripts/deploy.cjs "커밋 제목" ["본문 문단" ...]
// 성공한 단계의 로그는 숨기고, 실패한 단계만 마지막 40줄을 출력한다.
const { spawnSync } = require('child_process');

const paragraphs = process.argv.slice(2).filter(Boolean);
if (paragraphs.length === 0) {
  console.error('커밋 메시지가 필요합니다: node scripts/deploy.cjs "메시지"');
  process.exit(1);
}

function run(label, cmd, { allowFail = false } = {}) {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  if (r.status !== 0 && !allowFail) {
    console.error(`✗ ${label} 실패\n${out.trim().split(/\r?\n/).slice(-40).join('\n')}`);
    process.exit(1);
  }
  return { ok: r.status === 0, out: out.trim() };
}

function git(label, args, opts) {
  const r = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  if (r.status !== 0 && !(opts && opts.allowFail)) {
    console.error(`✗ ${label} 실패\n${out.split(/\r?\n/).slice(-40).join('\n')}`);
    process.exit(1);
  }
  return { ok: r.status === 0, out };
}

run('build', 'npm run build');
run('cap sync ios', 'npx cap sync ios');

git('add', ['add', '-A']);
const staged = git('diff', ['diff', '--cached', '--name-only']).out;
if (staged) {
  git('commit', ['commit', ...paragraphs.flatMap((p) => ['-m', p])]);
} else {
  console.log('· 커밋할 변경 없음');
}

let push = git('push', ['push', 'origin', 'HEAD:main'], { allowFail: true });
if (!push.ok) {
  // 다른 세션이 먼저 푸시한 경우: rebase 후 한 번만 재시도
  git('pull --rebase', ['pull', '--rebase', 'origin', 'main']);
  push = git('push', ['push', 'origin', 'HEAD:main']);
}

const head = git('log', ['log', '-1', '--format=%h %s']).out;
const files = staged ? staged.split(/\r?\n/).length : 0;
console.log(`✓ 빌드·동기화·푸시 완료 — ${head} (${files}개 파일)`);
