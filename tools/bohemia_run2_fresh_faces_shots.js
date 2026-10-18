/* RUN TWO [the fresh portraits wired in], 10/18/26 (rule 115(h) amended: 'I liked it when it was the portrait, not
   when you zoom in on the creepy model's face... it has to be made fresh portrait').
   Shoots the three places a crew face shows on RUN TWO's screens, at his phone's pixels (390 x 844 at 3x):
     roster.png  the crew screen, the line and WHO IS WEARING WHAT
     lot.png     the scavenge sheet, YOU speaking the lot (where two men fell, so the line is long enough to talk)
     hall.png    the hiring post, the men who want work
   --talk (the new tree only): the card's man and YOU at the lot are stepped through the line's own mouths
   (BohemiaCrewFaces.sounds), each frame drawn the module's way and shot off the glass, with where each face sits.
   Run once on the old tree and once on the new, then tools/bohemia_run2_fresh_faces_sheet.py lays them side by side.
   Run: node tools/bohemia_run2_fresh_faces_shots.js <out dir> [--talk] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8873, OUT = path.resolve(process.argv[2] || '.'), TALK = process.argv.includes('--talk');
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* step a talking face through its line, one frame a mouth, shot off the glass; where it sits under `under` */
async function talkFrames(pg, sel, lineSel, under, name, meta) {
  const info = await pg.evaluate(async ({ sel, lineSel, under }) => {
    const c = document.querySelector(sel), F = window.BohemiaCrewFaces; if (!c || c.dataset.face !== 'fresh') return null;
    if (c.__talk) { clearInterval(c.__talk); c.__talk = null; }
    const line = document.querySelector(lineSel).textContent.replace(/[“”]/g, '');
    const r = c.getBoundingClientRect(), u = under ? document.querySelector(under).getBoundingClientRect() : { left: -scrollX, top: -scrollY };
    return { line, seq: F.sounds(line), look: c.dataset.look, x: r.left - u.left, y: r.top - u.top, w: r.width, h: r.height };   /* the border box, what an element shot covers */
  }, { sel, lineSel, under });
  if (!info) return;
  const keys = ['rest'].concat(Array.from(new Set(info.seq)));
  for (const k of keys) {
    await pg.evaluate(async ({ sel, k }) => { const c = document.querySelector(sel), F = window.BohemiaCrewFaces;
      const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = F.src(c.dataset.look, k, c.width); });
      const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.clearRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); }, { sel, k });
    await pg.waitForTimeout(60);
    await pg.locator(sel).screenshot({ path: path.join(OUT, name + '_' + k + '.png') });
  }
  meta[name] = info;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.addInitScript(() => { try { localStorage.setItem('bohemia.formation.v1', 'null'); } catch (e) {} });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(OUT, 'roster.png'), fullPage: true });
  const meta = { cardBottom: await p.evaluate(() => document.getElementById('card').getBoundingClientRect().bottom + scrollY) };
  if (TALK) await talkFrames(p, '#card canvas.face', '#card .pain', null, 'card', meta);

  const s = await ctx.newPage();
  await s.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await s.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await s.waitForTimeout(500);
  const tapB = async k => {
    if (await s.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await s.click('#close'); await s.waitForTimeout(300); }
    const xy = await s.evaluate(k => BohemiaSettlement.where(k), k);
    await s.mouse.click(xy.x, xy.y); await s.waitForTimeout(900);
  };
  await s.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], fights: [{ day: 3, fallen: 2 }] }));
  await s.waitForTimeout(300);
  await tapB('lot');
  await s.locator('#sheet').screenshot({ path: path.join(OUT, 'lot.png') });
  if (TALK) await talkFrames(s, '#sbody canvas.face', '#sbody .say p', '#sheet', 'lot', meta);
  await tapB('hall');
  await s.locator('#sheet').screenshot({ path: path.join(OUT, 'hall.png') });
  fs.writeFileSync(path.join(OUT, 'talk.json'), JSON.stringify(meta, null, 1));
  await b.close(); srv.close();
  console.log('shots in ' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
