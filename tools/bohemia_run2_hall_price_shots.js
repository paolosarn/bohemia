/* RUN TWO [the hire price is the formula], 10/19/26: the VOTE picture. The hall at a fortress on his phone upright
   (390 x 844 at 3x), the six men at the post: BEFORE is the settlement screen as it stood before this row (BEFORE_SHA,
   served from git), AFTER is the working tree. The same week, the same men, side by side.
   Run: node tools/bohemia_run2_hall_price_shots.js <out.webp> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8904, OUT = path.resolve(process.argv[2] || 'hall.webp'), BEFORE_SHA = '52a45049';
const OLD = cp.execSync('git show ' + BEFORE_SHA + ':slices/BOHEMIA_SETTLEMENT_SCREEN.html', { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
let old = false;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && u === '/slices/BOHEMIA_SETTLEMENT_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
async function shot(b, before, file) {
  old = before;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'BOULDER CITY', tier: 'fortress' }, traits: [], day: 4, batteries: 60 }));   /* week 0, the one week the old post could show: the same six men both sides */
  await p.waitForTimeout(900);
  const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(700);
  await p.evaluate(() => { const h = document.querySelectorAll('#sheet .hire'); if (h.length) h[h.length - 1].scrollIntoView({ block: 'end' }); });
  await p.waitForTimeout(200);
  const prices = await p.evaluate(() => Array.from(document.querySelectorAll('#sheet .hire')).map(h => (h.querySelector('.nm') || {}).textContent.split('·').pop().trim() + ' ' + ((Array.from(h.querySelectorAll('button')).find(x => /Hire/.test(x.textContent)) || {}).textContent || '').replace('Hire', '')));
  await p.screenshot({ path: file }); await ctx.close();
  return prices;
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'hall-'));
  const a = await shot(b, true, path.join(tmp, 'before.png')), z = await shot(b, false, path.join(tmp, 'after.png'));
  await b.close(); srv.close();
  console.log('before', a.join(', ')); console.log('after ', z.join(', '));
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out = sys.argv[1], sys.argv[2]
W, GAP, BAR = 390, 20, 64
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except OSError: F = ImageFont.load_default()
heads = [('before', 'BEFORE: THE SAME SIX MEN,', 'THE MILITIAMAN 53 (UP TO 225)'), ('after', 'NOW: BATTLE BROTHERS\\' OWN PRICE,', 'FOUR FIFTHS OF IT (RULE 117)')]
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
