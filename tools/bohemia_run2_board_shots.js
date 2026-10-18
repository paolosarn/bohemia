/* RUN TWO [the board's quests are people], 10/18/26: the VOTE picture. The board at four places on one map day, at
   his phone's pixels (390 x 844 at 3x): a camp, a town, a fortress and the same town RAIDED by the Cartel (FACTIONS'
   raid ledger), then the town's first client speaking. BEFORE is the same visits with the shelf blocked (the four
   drafted offers, the same people everywhere); AFTER is QUESTS' act-one shelf. Lays both side by side.
   Run: node tools/bohemia_run2_board_shots.js <out.png> */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8876, OUT = path.resolve(process.argv[2] || 'board.png');
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let block = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (block && /BOHEMIA_BOARD_SHELF\.json$/.test(u)) { rs.statusCode = 404; return rs.end(); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const VISITS = [
  ['A CAMP: COPPER SHEDS', { place: { name: 'COPPER SHEDS', tier: 'camp' }, traits: [], day: 4, contracts: [] }],
  ['A TOWN: THE WASH', { place: { name: 'THE WASH, NORTH LAS VEGAS', tier: 'town' }, traits: [], day: 4, contracts: [] }],
  ['A FORTRESS: THE FORT', { place: { name: 'THE FORT', tier: 'fortress' }, traits: [], day: 4, contracts: [] }],
  ['THE WASH, RAIDED BY THE CARTEL', { place: { name: 'THE WASH, NORTH LAS VEGAS', tier: 'town' }, traits: null, day: 5, contracts: [],
    ledger: { marks: [{ place: 'THE WASH', trait: 'raided', by: 'Cartel', party: 'p1', from: 2, until: 9 }] }, ledgerPlace: 'THE WASH' }]];
async function side(b, dir, shelf) {
  block = !shelf;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  const tapBoard = async () => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); }
    const xy = await p.evaluate(() => BohemiaSettlement.where('board')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(900);
  };
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < VISITS.length; i++) {
    await p.evaluate(o => BohemiaSettlement.open(o), VISITS[i][1]); await p.waitForTimeout(300);
    await tapBoard();
    await p.locator('#sheet').screenshot({ path: path.join(dir, 'v' + i + '.png') });
  }
  await p.evaluate(o => BohemiaSettlement.open(o), VISITS[1][1]); await p.waitForTimeout(300);
  await tapBoard(); await p.click('#sheet .act.client'); await p.waitForTimeout(1500);
  await p.locator('#sheet').screenshot({ path: path.join(dir, 'say.png') });
  await ctx.close();
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'board-'));
  await side(b, path.join(tmp, 'before'), false);
  await side(b, path.join(tmp, 'after'), true);
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
tmp, out, labels = sys.argv[1], sys.argv[2], sys.argv[3].split('|')
K, W, GAP, BAR = 0.5, 585, 24, 44
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
except OSError: F = ImageFont.load_default()
def col(d, head):
    parts = [(head, None)] + [(labels[i], Image.open('%s/%s/v%d.png' % (tmp, d, i)).convert('RGB')) for i in range(4)] + [('THE TOWN\\'S FIRST CLIENT, TAPPED', Image.open('%s/%s/say.png' % (tmp, d)).convert('RGB'))]
    h = sum(BAR + (int(p.height * K) if p else 0) for _, p in parts)
    c = Image.new('RGB', (W, h), (11, 9, 7)); dr = ImageDraw.Draw(c); y = 0
    for t, p in parts:
        dr.text((12, y + 12), t, font=F, fill=(232, 200, 140)); y += BAR
        if p: c.paste(p.resize((int(p.width * K), int(p.height * K)), Image.LANCZOS), (0, y)); y += int(p.height * K)
    return c
a, z = col('before', 'BEFORE: THE SAME FOUR PEOPLE AT EVERY BOARD'), col('after', 'AFTER: EACH PLACE HAS ITS OWN PEOPLE')
s = Image.new('RGB', (W * 2 + GAP, max(a.height, z.height)), (11, 9, 7)); s.paste(a, (0, 0)); s.paste(z, (W + GAP, 0))
s.save(out, optimize=True); print(out, s.size)
`;
  const r = cp.spawnSync('python3', ['-c', py, tmp, OUT, VISITS.map(v => v[0]).join('|')], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
