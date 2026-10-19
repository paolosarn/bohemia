/* RUN TWO [a card's picture, full size], 10/19/26: the VOTE picture. COOK FOUR's five houses before and after (a 2720 px
   sheet, every house about 75 points on his phone, the size COMBAT TWO measured on its own card) on his phone upright (390 x 844, deviceScaleFactor 3): BEFORE is the VOTE tab as it
   stood before this row (BEFORE_SHA, served from git) with LOOK AT IT tapped; AFTER is the working tree, the card showing
   its one thing, then the tap on it: the sheet at one image pixel to one point. Three phone screens side by side.
   Run: node tools/bohemia_run2_full_size_shots.js <out.png> [card id] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8901, OUT = path.resolve(process.argv[2] || 'fullsize.png'), BEFORE_SHA = '16a8a94b';
const CARD = process.argv[3] || 'cook4-the-second-pass-10-18';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const OLD = cp.execSync('git show ' + BEFORE_SHA + ':slices/BOHEMIA_VOTE_TAB.html', { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
let old = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && u === '/slices/BOHEMIA_VOTE_TAB.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
  /* every card shows, sorted or not: the picture is about one card, not about the coordinator's tags */
  if (u === '/records/target/BOHEMIA_VOTE_TRIAGE.json') { rs.statusCode = 404; return rs.end(); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
async function phone(b) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_VOTE_TAB.html', { waitUntil: 'load' });
  await p.waitForFunction('window.__voteReady === true', null, { timeout: 30000 });
  const sel = '.row[data-id="' + CARD + '"]';
  await p.evaluate(s => { const r = document.querySelector(s); r.querySelector('.look').click(); }, sel);
  await p.evaluate(s => document.querySelector(s + ' .stage img').scrollIntoView({ block: 'start' }), sel);
  await p.waitForFunction(s => { const i = document.querySelector(s + ' .stage img'); return i && i.complete && i.naturalWidth > 0; }, sel, { timeout: 30000 });
  /* the card's title and the top of its picture on one screen, the way he scrolls to it */
  await p.evaluate(s => { const r = document.querySelector(s); window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 70); }, sel);
  await p.waitForTimeout(300);
  return { ctx, p, sel };
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'fullsize-'));
  old = true;
  let s = await phone(b); await s.p.screenshot({ path: path.join(tmp, 'before.png') }); await s.ctx.close();
  old = false;
  s = await phone(b); await s.p.screenshot({ path: path.join(tmp, 'card.png') });
  const at = await s.p.evaluate(q => { const r = document.querySelector(q + ' .stage img').getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: Math.min(r.top + r.height * 0.4, 800) }; }, s.sel);
  await s.p.touchscreen.tap(at.x, at.y);
  await s.p.waitForSelector('#full[data-ready="1"]', { timeout: 30000 });
  await s.p.waitForTimeout(300);
  await s.p.screenshot({ path: path.join(tmp, 'full.png') });
  const st = await s.p.evaluate(() => window.__voteFull.state());
  await s.ctx.close(); await b.close(); srv.close();
  console.log('full size: scale', st.s, 'sheet', st.nw + 'x' + st.nh);
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out = sys.argv[1], sys.argv[2]
W, GAP, BAR = 390, 20, 64
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except OSError: F = ImageFont.load_default()
heads = [('before', 'BEFORE: THE WHOLE SHEET,', 'EVERY THING ON IT TINY'), ('card', 'AFTER: THE CARD SHOWS', 'ONE THING'), ('full', 'AFTER: TAP IT. FULL SIZE,', 'DRAG, PINCH, TAP TO CLOSE')]
s = Image.new('RGB', (W * 3 + GAP * 4, 844 + BAR + GAP), (11, 9, 7)); dr = ImageDraw.Draw(s)
for k, (f, a, b) in enumerate(heads):
    x = GAP + k * (W + GAP)
    im = Image.open('%s/%s.png' % (tmp, f)).convert('RGB').resize((W, 844), Image.LANCZOS)
    dr.text((x, 12), a, font=F, fill=(232, 200, 140)); dr.text((x, 34), b, font=F, fill=(232, 200, 140))
    s.paste(im, (x, BAR))
s.save(out, optimize=True); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
