/* RUN TWO [the crew screen at fourteen], 10/18/26: the VOTE picture. A company of fourteen (two laid up) on his phone
   upright (390 x 844, one screen) and on a laptop (1440 x 900, one screen). BEFORE is the screen as it stood before this row
   (BEFORE_SHA, served from git); AFTER is the working tree. Lays both side by side.
   Run: node tools/bohemia_run2_crew_fourteen_shots.js <out.png> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8900, OUT = path.resolve(process.argv[2] || 'crew14.png'), BEFORE_SHA = '2c89a244';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const OLD = cp.execSync('git show ' + BEFORE_SHA + ':slices/BOHEMIA_ROSTER_SCREEN.html', { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
let old = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && u === '/slices/BOHEMIA_ROSTER_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const COMPANY = n => {
  const C = window.BohemiaRoster, base = C.startingCrew();
  const names = ['YOU', 'Reyna', 'Tavo', 'Lupe', 'Raul', 'Nene', 'Coco', 'Teo', 'Marisol', 'Pancho', 'Inez', 'Beto', 'Chuy', 'Dora'];
  const crew = [];
  for (let i = 0; i < n; i++) { const d = base[i % base.length]; const m = C.manOf({ name: names[i], background: d.bgId, main: i === 0, jobs: [] }, i);
    m.gear = JSON.parse(JSON.stringify(d.gear)); if (i === 3 || i === 9) { m.hurt = { days: 12, of: 30 }; m.mark = { id: 'x', name: 'Broken Hand' }; } crew.push(m); }
  ['bohemia.formation.v1', 'bohemia.climb.v1', 'bohemia.hired.v1'].forEach(k => localStorage.removeItem(k));
  BohemiaRosterScreen.open({ crew, bag: [] });
};
async function shot(b, before, vw, vh, phone, file) {
  old = before;
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: phone ? 3 : 1, isMobile: phone, hasTouch: phone });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(400); await p.evaluate(COMPANY, 14); await p.waitForTimeout(1200);
  await p.screenshot({ path: file }); await ctx.close();
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'crew14-'));
  for (const bf of [true, false]) { const t = bf ? 'before' : 'after';
    await shot(b, bf, 390, 844, true, path.join(tmp, t + '_phone.png')); await shot(b, bf, 1440, 900, false, path.join(tmp, t + '_laptop.png')); }
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out = sys.argv[1], sys.argv[2]
W, GAP, BAR = 640, 24, 44
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 19)
except OSError: F = ImageFont.load_default()
def fit(im, w): return im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
def col(t, head):
    ph = fit(Image.open('%s/%s_phone.png' % (tmp, t)).convert('RGB'), 390); lp = fit(Image.open('%s/%s_laptop.png' % (tmp, t)).convert('RGB'), W)
    parts = [(head, None), ('ON HIS PHONE, FOURTEEN MEN, THE FIRST SCREEN', ph), ('ON A LAPTOP, THE FIRST SCREEN', lp)]
    h = sum(BAR + (p.height if p else 0) for _, p in parts)
    c = Image.new('RGB', (W, h), (11, 9, 7)); dr = ImageDraw.Draw(c); y = 0
    for tx, p in parts:
        dr.text((12, y + 12), tx, font=F, fill=(232, 200, 140)); y += BAR
        if p: c.paste(p, ((W - p.width) // 2, y)); y += p.height
    return c
a, z = col('before', 'BEFORE: THE LINE RUNS OFF THE PHONE'), col('after', 'AFTER: EVERY MAN IN ONE LOOK')
s = Image.new('RGB', (W * 2 + GAP, max(a.height, z.height)), (11, 9, 7)); s.paste(a, (0, 0)); s.paste(z, (W + GAP, 0))
s.save(out, optimize=True); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
