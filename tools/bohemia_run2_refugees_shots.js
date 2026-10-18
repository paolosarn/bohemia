/* RUN TWO [the neighbour takes the refugees], 10/18/26: the VOTE picture. Two nights after the Reds raid the Mob (FACTIONS'
   ledger), at his phone's pixels (390 x 844 at 3x), through the game's own door (the map's BOHEMIA_SETTLEMENT_OPEN, the
   arrival on): arriving at the Network (the Mob's nearest town on the map), the Network's hall, and arriving at the Mob
   itself with the map's dice handed beside the ledger (a market day). BEFORE is the screen as it stood before this row
   (BEFORE_SHA, served from git); AFTER is the working tree. Lays both side by side.
   Run: node tools/bohemia_run2_refugees_shots.js <out.png> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8896, OUT = path.resolve(process.argv[2] || 'refugees.png');
const BEFORE_SHA = '80780b4c';   /* the bar names the news shipped; no refugees, and handed dice switched the ledger off */
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const OLD = cp.execSync('git show ' + BEFORE_SHA + ':slices/BOHEMIA_SETTLEMENT_SCREEN.html', { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
let old = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && u === '/slices/BOHEMIA_SETTLEMENT_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const RAID = { marks: [{ place: 'Mob', trait: 'raided', by: 'Reds', party: 'p1', from: 2, until: 9 }] };
const LABELS = ['YOU ARRIVE AT THE NETWORK, THE MOB\'S NEIGHBOUR', 'THE NETWORK\'S HALL', 'YOU ARRIVE AT THE MOB, ON ITS MARKET DAY'];
async function side(b, dir, before) {
  old = before;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && (!window.BohemiaBarNews || BohemiaBarNews.ready()), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  fs.mkdirSync(dir, { recursive: true });
  /* the arrival card only, not the dark picture around it */
  const card = async n => { const r = await p.evaluate(() => { let a = null; document.querySelectorAll('#arrive > *').forEach(e => { const b = e.getBoundingClientRect(); if (!b.width) return;
      a = a ? { l: Math.min(a.l, b.left), t: Math.min(a.t, b.top), r: Math.max(a.r, b.right), b: Math.max(a.b, b.bottom) } : { l: b.left, t: b.top, r: b.right, b: b.bottom }; }); return a; });
    await p.screenshot({ path: path.join(dir, n + '.png'), clip: { x: 0, y: Math.max(0, r.t - 12), width: 390, height: r.b - r.t + 24 } }); };
  const arrive = async (name, traits) => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); }
    await p.evaluate(([n, t, l]) => { const o = document.getElementById('arrive'); if (o) o.remove(); BohemiaSettlement.state.arrivedAt = null;
      window.postMessage({ type: 'BOHEMIA_SETTLEMENT_OPEN', place: { name: n, tier: 'town' }, day: 4, ledger: l, ledgerPlace: n, traits: t, batteries: 9 }, '*'); }, [name, traits, RAID]);
    await p.waitForFunction(() => !!document.querySelector('#arrive.on .who'), null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(1200);
  };
  await arrive('Network', []); await card('v0');
  await p.evaluate(() => { const o = document.getElementById('arrive'); if (o) o.remove(); });
  const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1100);
  await p.locator('#sheet').screenshot({ path: path.join(dir, 'v1.png') });
  await arrive('Mob', ['market_day']); await card('v2');
  await ctx.close();
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'refugees-'));
  await side(b, path.join(tmp, 'before'), true);
  await side(b, path.join(tmp, 'after'), false);
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out, labels = sys.argv[1], sys.argv[2], sys.argv[3].split('|')
K, W, GAP, BAR = 0.5, 585, 24, 44
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 19)
except OSError: F = ImageFont.load_default()
def col(d, head):
    parts = [(head, None)] + [(labels[i], Image.open('%s/%s/v%d.png' % (tmp, d, i)).convert('RGB')) for i in range(3)]
    h = sum(BAR + (int(p.height * K * min(1, W / (p.width * K))) if p else 0) for _, p in parts)
    c = Image.new('RGB', (W, h), (11, 9, 7)); dr = ImageDraw.Draw(c); y = 0
    for t, p in parts:
        dr.text((12, y + 12), t, font=F, fill=(232, 200, 140)); y += BAR
        if p:
            k = K * min(1, W / (p.width * K)); q = p.resize((int(p.width * k), int(p.height * k)), Image.LANCZOS)
            c.paste(q, (0, y)); y += q.height
    return c
a, z = col('before', 'BEFORE: THE NEXT TOWN NEVER HEARS OF IT'), col('after', 'AFTER: THE PEOPLE WHO RAN ARE HERE')
s = Image.new('RGB', (W * 2 + GAP, max(a.height, z.height)), (11, 9, 7)); s.paste(a, (0, 0)); s.paste(z, (W + GAP, 0))
s.save(out, optimize=True); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT, LABELS.join('|')], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
