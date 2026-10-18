/* RUN TWO [the bar names the news], 10/18/26: the VOTE picture. The bar at the Church on map day 4, at his phone's
   pixels (390 x 844 at 3x): the first tap of the bar, the line after one round, and the first tap the day the Reds have
   just raided the Mob (FACTIONS' ledger). BEFORE is the screen as it stood before this row (BEFORE_SHA, served from git);
   AFTER is the working tree. Lays both side by side.
   Run: node tools/bohemia_run2_bar_news_shots.js <out.png> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8894, OUT = path.resolve(process.argv[2] || 'bar_news.png');
const BEFORE_SHA = '26dc1002';   /* main with this row only claimed: the bar as ECONOMY measured it */
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
const LABELS = ['YOU WALK INTO THE BAR', 'YOU BUY THE CREW A ROUND', 'TWO NIGHTS AFTER THE REDS HIT THE MOB'];
async function side(b, dir, before) {
  old = before;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && (!window.BohemiaBarNews || BohemiaBarNews.ready()), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); } };
  const tapBar = async () => { await close(); const xy = await p.evaluate(() => BohemiaSettlement.where('bar')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1100); };
  const shot = n => p.locator('#sheet').screenshot({ path: path.join(dir, n + '.png') });
  fs.mkdirSync(dir, { recursive: true });
  await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [], batteries: 9 })); await p.waitForTimeout(300);
  await tapBar(); await shot('v0');
  await close(); await tapBar(); await p.click('#sheet .acts .act'); await p.waitForTimeout(1100); await shot('v1');
  await close();
  await p.evaluate(l => BohemiaSettlement.open({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [], ledger: l, batteries: 9 }), RAID); await p.waitForTimeout(300);
  await tapBar(); await shot('v2');
  await ctx.close();
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'barnews-'));
  await side(b, path.join(tmp, 'before'), true);
  await side(b, path.join(tmp, 'after'), false);
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out, labels = sys.argv[1], sys.argv[2], sys.argv[3].split('|')
K, W, GAP, BAR = 0.5, 585, 24, 44
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
except OSError: F = ImageFont.load_default()
def col(d, head):
    parts = [(head, None)] + [(labels[i], Image.open('%s/%s/v%d.png' % (tmp, d, i)).convert('RGB')) for i in range(3)]
    h = sum(BAR + (int(p.height * K) if p else 0) for _, p in parts)
    c = Image.new('RGB', (W, h), (11, 9, 7)); dr = ImageDraw.Draw(c); y = 0
    for t, p in parts:
        dr.text((12, y + 12), t, font=F, fill=(232, 200, 140)); y += BAR
        if p: c.paste(p.resize((int(p.width * K), int(p.height * K)), Image.LANCZOS), (0, y)); y += int(p.height * K)
    return c
a, z = col('before', 'BEFORE: THE BAR KNOWS NOTHING OF THE ROAD'), col('after', 'AFTER: THE KEEPER TELLS YOU, FREE')
s = Image.new('RGB', (W * 2 + GAP, max(a.height, z.height)), (11, 9, 7)); s.paste(a, (0, 0)); s.paste(z, (W + GAP, 0))
s.save(out, optimize=True); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT, LABELS.join('|')], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
