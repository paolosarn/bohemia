/* RUN TWO [the keepers wear the starred faces], 10/19/26: the VOTE picture, from the game's camera (the settlement
   screen on his phone upright, 390 x 844 at 3x). For the bar, the clinic, the barber and the smith at one town: the body
   standing at the post (cut from the picture), then the keeper speaking as he did BEFORE (the face module switched off,
   so the screen falls back to the old painted 64 face off the body sheet, the face he complained about) and as he does
   NOW (PORTRAIT's fresh portrait of that same look, PEOPLE's name). Lays them out one post a row.
   Run: node tools/bohemia_run2_keepers_shots.js <out.webp> [place] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8903, OUT = path.resolve(process.argv[2] || 'keepers.webp'), PLACE = process.argv[3] || 'HENDERSON';
const POSTS = ['bar', 'clinic', 'barber', 'smith'];
let old = false;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && /bohemia_crew_faces\.js$/.test(u)) { rs.setHeader('content-type', 'text/javascript'); return rs.end('/* BEFORE: no fresh portraits */'); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
async function shoot(b, before, tmp) {
  old = before;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  await p.evaluate(n => BohemiaSettlement.open({ place: { name: n, tier: 'town' }, traits: [], day: 4 }), PLACE);
  await p.waitForTimeout(900);
  const meta = {};
  for (const k of POSTS) {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(250); }
    if (!before) {   /* the body at the post, out of the picture before the sheet covers it */
      const box = await p.evaluate(k => { const q = BohemiaSettlement.folk().filter(q => q.keeper && q.k === k)[0], s0 = BohemiaSettlement.scale();
        BohemiaSettlement.where(k); const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        const h = s0.person * v.s * 1.15, w = h * 0.62;
        return { x: r.left + v.ox + q.x * v.s - w / 2, y: r.top + v.oy + q.y * v.s - h, width: w, height: h * 1.05, look: q.look }; }, k);
      await p.screenshot({ path: path.join(tmp, 'body_' + k + '.png'), clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.width, height: box.height } });
      meta[k] = { look: box.look };
    }
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(700);
    await p.evaluate(() => { const c = document.querySelector('#sheet.on .who canvas.face'); if (c && c.__talk) { clearInterval(c.__talk); c.__talk = null; } });
    if (!before) await p.evaluate(() => new Promise(r => { const c = document.querySelector('#sheet.on .who canvas.face'), F = window.BohemiaCrewFaces;
      if (!c || !F || c.dataset.face !== 'fresh') return r(); F.draw(c.getContext('2d'), c.dataset.look, c.width); setTimeout(r, 150); }));   /* at rest for the still */
    const row = await p.$('#sheet.on .who');
    await row.screenshot({ path: path.join(tmp, (before ? 'old_' : 'new_') + k + '.png') });
    const info = await p.evaluate(() => { const c = document.querySelector('#sheet.on .who canvas.face'); return { face: c && c.dataset.face, look: c && c.dataset.look, nm: (document.querySelector('#sheet.on .who .nm') || {}).textContent }; });
    meta[k] = Object.assign(meta[k] || {}, before ? { oldFace: info.face } : info);
  }
  await ctx.close();
  return meta;
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'keepers-'));
  const m0 = await shoot(b, true, tmp), m1 = await shoot(b, false, tmp);
  await b.close(); srv.close();
  const meta = {}; POSTS.forEach(k => { meta[k] = Object.assign({}, m1[k], { oldFace: m0[k].oldFace }); });
  console.log(JSON.stringify(meta));
  fs.writeFileSync(path.join(tmp, 'meta.json'), JSON.stringify(meta));
  const py = `
import sys, json
from PIL import Image, ImageDraw, ImageFont
tmp, out, place = sys.argv[1], sys.argv[2], sys.argv[3]
meta = json.load(open(tmp + '/meta.json'))
posts = ['bar', 'clinic', 'barber', 'smith']
try:
    B = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
    S = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except OSError:
    B = S = ImageFont.load_default()
ROWH, GAP, BODYW, ROWW = 300, 24, 170, 760
def fit(im, w, h):
    r = min(w / im.width, h / im.height); return im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
W = GAP + BODYW + GAP + ROWW + GAP + ROWW + GAP
H = 120 + len(posts) * (ROWH + GAP)
s = Image.new('RGB', (W, H), (11, 9, 7)); d = ImageDraw.Draw(s)
d.text((GAP, 18), 'THE KEEPERS AT ' + place + ', ON YOUR PHONE', font=B, fill=(232, 200, 140))
d.text((GAP, 70), 'AT THE POST', font=S, fill=(170, 160, 140)); d.text((GAP * 2 + BODYW, 70), 'BEFORE: THE OLD PAINTED FACE', font=S, fill=(170, 160, 140))
d.text((GAP * 3 + BODYW + ROWW, 70), 'NOW: THE FRESH FACE OF THAT SAME MAN', font=S, fill=(232, 200, 140))
y = 120
for k in posts:
    body = fit(Image.open('%s/body_%s.png' % (tmp, k)).convert('RGB'), BODYW, ROWH)
    s.paste(body, (GAP + (BODYW - body.width) // 2, y + (ROWH - body.height) // 2))
    for i, kind in enumerate(['old', 'new']):
        im = fit(Image.open('%s/%s_%s.png' % (tmp, kind, k)).convert('RGB'), ROWW, ROWH)
        s.paste(im, (GAP * (2 + i) + BODYW + i * ROWW, y + (ROWH - im.height) // 2))
    y += ROWH + GAP
s.save(out, 'WEBP', quality=90, method=6); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT, PLACE], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
