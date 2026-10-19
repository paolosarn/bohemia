/* RUN TWO [his yeses in the demo], 10/19/26: the VOTE picture. The foot of the VOTE tab on his phone upright (390 x 844,
   deviceScaleFactor 3): the top of the list (the sum and the first IN THE DEMO lines) and the first NOT YET lines, side by
   side, from the working tree's registry, list and stamp file.
   Run: node tools/bohemia_run2_yeses_shots.js <out.webp> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8902, OUT = path.resolve(process.argv[2] || 'yeses.webp');
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.txt': 'text/plain' };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_VOTE_TAB.html', { waitUntil: 'load' });
  await p.waitForFunction('window.__yesReady === true', null, { timeout: 30000 });
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'yeses-'));
  await p.evaluate(() => window.scrollTo(0, document.getElementById('foot').getBoundingClientRect().top + window.scrollY - 70));
  await p.waitForTimeout(200); await p.screenshot({ path: path.join(tmp, 'a.png') });
  await p.evaluate(() => { const l = document.querySelector('#yeses .yl.not'); window.scrollTo(0, l.getBoundingClientRect().top + window.scrollY - 140); });
  await p.waitForTimeout(200); await p.screenshot({ path: path.join(tmp, 'b.png') });
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out = sys.argv[1], sys.argv[2]
W, GAP, BAR = 390, 20, 64
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except OSError: F = ImageFont.load_default()
heads = [('a', 'THE FOOT OF THE VOTE TAB:', 'HOW MANY OF YOUR YESES ARE IN'), ('b', 'AND WHICH ARE NOT YET,', 'WITH THE CHAT THAT HAS IT')]
s = Image.new('RGB', (W * 2 + GAP * 3, 844 + BAR + GAP), (11, 9, 7)); dr = ImageDraw.Draw(s)
for k, (f, a, b) in enumerate(heads):
    x = GAP + k * (W + GAP)
    im = Image.open('%s/%s.png' % (tmp, f)).convert('RGB').resize((W, 844), Image.LANCZOS)
    dr.text((x, 12), a, font=F, fill=(232, 200, 140)); dr.text((x, 34), b, font=F, fill=(232, 200, 140))
    s.paste(im, (x, BAR))
s.save(out, 'WEBP', quality=90, method=6); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
