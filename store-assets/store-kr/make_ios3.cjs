// 한국용 스토어 이미지 5장을 Codex로 생성(raw4)한 뒤 1290x2796으로 중앙 크롭(ios3)한다.
// 사용: node store-assets/store-kr/make_ios3.cjs
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname);
const names = ['kr_1_new', 'kr_2_rank', 'kr_3_review', 'kr_4_coupon', 'kr_5_signup'];
fs.mkdirSync(path.join(root, 'raw4'), { recursive: true });
fs.mkdirSync(path.join(root, 'ios3'), { recursive: true });
let log = '';
try {
  log = execFileSync('node', ['D:/sinsangpick-sns/plugin/scripts/codex-image.cjs', path.join(root, 'jobs_kr4.json')], { encoding: 'utf8', timeout: 540000 });
} catch (e) { log = String(e.stdout || e.message); }
fs.writeFileSync(path.join(root, 'raw4', 'run.log'), log);
const ff = require('D:/sinsangpick-sns/plugin/scripts/node_modules/ffmpeg-static');
const failed = [];
for (const n of names) {
  const src = path.join(root, 'raw4', n + '.png');
  if (!fs.existsSync(src)) { failed.push(n); continue; }
  execFileSync(ff, ['-y', '-loglevel', 'error', '-i', src, '-vf', 'scale=-2:2796,crop=1290:2796', path.join(root, 'ios3', n + '.png')]);
}
console.log(failed.length ? 'FAILED: ' + failed.join(', ') + '\n' + log.slice(-400) : 'OK: 5 images in ios3');
process.exit(failed.length ? 1 : 0);
