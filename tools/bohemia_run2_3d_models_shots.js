/* RUN TWO [the 3D models on your screens], 10/19/26: the VOTE picture, from the game's camera (his phone upright,
   390 x 844 at 3x). BEFORE is the two screens as they were at BASE (served from git, nothing else changed); NOW is the
   working tree. Three rows, old on the left and new on the right:
     the town on market day around the stall (the keepers and the crowd: ANIMATION's flat people, then CHARACTER's
       thirteen gangs standing in 3D);
     a man in the crowd tapped, speaking (the old painted 64 off his body sheet, then PORTRAIT's 3D head for his look);
     the crew screen's card (his face only, then his whole 3D body beside it).
   Run: node tools/bohemia_run2_3d_models_shots.js <out.webp> [base sha] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process'), os = require('os');
const ROOT = path.dirname(__dirname), PORT = 8905, OUT = path.resolve(process.argv[2] || 'shots.webp'), BASE = process.argv[3] || '43339b58';
const OLD = ['slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'slices/BOHEMIA_ROSTER_SCREEN.html', 'engine/bohemia_crew_faces.js'];
let old = false;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const before = {}; OLD.forEach(f => { before['/' + f] = cp.execSync('git show ' + BASE + ':' + f, { cwd: ROOT, maxBuffer: 1 << 26 }); });
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && before[u]) { rs.setHeader('content-type', TYPE[path.extname(u)]); return rs.end(before[u]); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
async function shoot(b, isOld, tmp) {
  old = isOld;
  const tag = isOld ? 'old' : 'new';
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ['market_day'], night: false }));
  await p.waitForTimeout(1500);
  const at = await p.evaluate(() => { const xy = BohemiaSettlement.where('stall'); return xy; });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: path.join(tmp, tag + '_town.png'), clip: { x: 0, y: Math.max(0, at.y - 190), width: 390, height: 330 } });
  /* a man in the crowd, tapped: the first one whose tap opens him (his face, his body) */
  let pt = null;
  for (let i = 0; i < 12 && !pt; i++) {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(250); }
    const t = await p.evaluate(i => { const L = BohemiaSettlement.folk().filter(x => x.crowd), q = L[i]; if (!q) return null; const s0 = BohemiaSettlement.scale();
      BohemiaSettlement.where('stall'); const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
      return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s, look: q.look, slot: q.slot }; }, i);
    if (!t) break;
    await p.waitForTimeout(200); await p.mouse.click(t.x, t.y); await p.waitForTimeout(900);
    const got = await p.evaluate(() => { const q = BohemiaSettlement.state.person; return q ? { look: q.look, slot: q.slot } : null; });
    if (got && got.slot === t.slot && got.look === t.look) pt = t;
  }
  await p.evaluate(() => { const c = document.querySelector('#sheet.on .who canvas.face'); if (c && c.__talk) { clearInterval(c.__talk); c.__talk = null; } });
  if (!isOld) await p.evaluate(() => new Promise(r => { const c = document.querySelector('#sheet.on .who canvas.face'), F = window.BohemiaCrewFaces;
    if (!c || !F || c.dataset.face !== 'fresh') return r(); F.draw(c.getContext('2d'), c.dataset.look, c.width); setTimeout(r, 200); }));
  const row = await p.$('#sheet.on .who');
  if (row) await row.screenshot({ path: path.join(tmp, tag + '_speaks.png') });
  const said = await p.evaluate(() => { const c = document.querySelector('#sheet.on .who canvas.face'); return c ? { face: c.dataset.face, look: c.dataset.look } : null; });
  /* the crew card */
  const q = await ctx.newPage();
  await q.addInitScript(() => { try { localStorage.setItem('bohemia.formation.v1', 'null'); } catch (e) {} });
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await q.waitForTimeout(2500);
  await q.evaluate(() => { const c = document.querySelector('#card canvas.face'); if (c && c.__talk) { clearInterval(c.__talk); c.__talk = null; } });
  if (!isOld) await q.evaluate(() => new Promise(r => { const c = document.querySelector('#card canvas.face'), F = window.BohemiaCrewFaces;
    if (!c || !F) return r(); F.draw(c.getContext('2d'), c.dataset.look, c.width); setTimeout(r, 200); }));
  const card = await q.$('#card .top'); await card.scrollIntoViewIfNeeded(); await q.waitForTimeout(300);
  await card.screenshot({ path: path.join(tmp, tag + '_card.png') });
  await ctx.close();
  return { said, crowd: pt && pt.look };
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'run2-3d-'));
  const m0 = await shoot(b, true, tmp), m1 = await shoot(b, false, tmp);
  await b.close(); srv.close();
  console.log(JSON.stringify({ before: m0, now: m1 }));
  cp.execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out = sys.argv[1], sys.argv[2]
rows = ['town', 'speaks', 'card']
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 30)
except Exception: F = ImageFont.load_default()
ims = {(r, t): Image.open('%s/%s_%s.png' % (tmp, t, r)).convert('RGB') for r in rows for t in ('old', 'new')}
W = max(im.width for im in ims.values()); G = 24; L = 56
H = sum(max(ims[(r, 'old')].height, ims[(r, 'new')].height) + L for r in rows) + G * (len(rows) + 1)
sheet = Image.new('RGB', (W * 2 + G * 3, H), (20, 15, 11)); d = ImageDraw.Draw(sheet); y = G
for r in rows:
    for i, t in enumerate(('old', 'new')):
        x = G + i * (W + G)
        d.text((x, y + 10), ('BEFORE' if t == 'old' else 'NOW, 3D'), fill=(168, 151, 124) if t == 'old' else (217, 168, 90), font=F)
        sheet.paste(ims[(r, t)], (x, y + L))
    y += max(ims[(r, 'old')].height, ims[(r, 'new')].height) + L + G
sheet.save(out, 'WEBP', quality=90, method=6)
print(out, sheet.size)
`, tmp, OUT], { stdio: 'inherit' });
})().catch(e => { console.error(e); process.exit(1); });
