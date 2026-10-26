/* PORTRAIT [every face breathes] (rule 246, 10/26/26): THE CARD SHOWS THE THING MOVING (the first votes, 9/21: animations play).
   Records the VOTE page slices/vote/PORTRAIT_EVERY_FACE_BREATHES.html in Chromium (the real face painter and its one clock, nothing
   drawn here) every half key for ten seconds, keeps each picture the painter changed to, and writes one animated WebP: per man, his
   face today (still) beside the same face breathing, at 128 and at the 64 thumb, one art pixel to one pixel (rule 89).
   node tools/bohemia_portrait_every_face_breathes_clip.js   ->   slices/vote/PORTRAIT_EVERY_FACE_BREATHES.webp */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const OUT = 'slices/vote/PORTRAIT_EVERY_FACE_BREATHES.webp';
const MEN = [['you', 'YOU, WHOLE'], ['person_town_0', 'STRUCK DOWN TODAY'], ['person_town_1', 'HEALED: STITCHES'], ['person_town_5', 'WHOLE']];
const SECS = 10, STEP = 60000 / 120 / 3 / 2;   // half a key of the game's grid

(async () => {
  const { chromium } = require('playwright');
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' })[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1400 } });
  await page.goto('http://127.0.0.1:' + server.address().port + '/slices/vote/PORTRAIT_EVERY_FACE_BREATHES.html', { waitUntil: 'load' });
  await page.waitForFunction((n) => document.querySelectorAll('canvas').length >= n, MEN.length * 2, { timeout: 20000 });
  await page.waitForTimeout(2500);   // every atlas loaded
  const shots = await page.evaluate(async ([men, secs, step]) => {
    const pick = (look, n) => Array.from(document.querySelectorAll('canvas')).find(c => c.dataset.look === look && c.width === n);
    const cs = []; men.forEach(m => [128, 64].forEach(n => cs.push(pick(m[0], n))));
    const out = [], last = cs.map(() => '');
    const t0 = performance.now();
    while (performance.now() - t0 < secs * 1000) {
      const row = cs.map((c, i) => { const u = c ? c.toDataURL('image/png') : ''; const same = u === last[i]; last[i] = u; return same ? null : u; });
      out.push({ t: performance.now() - t0, row });
      await new Promise(r => setTimeout(r, step));
    }
    return out;
  }, [MEN, SECS, STEP]);
  await browser.close(); server.close();
  /* the frames to disk, then one picture per moment the painter changed anything */
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'breathes-'));
  const keep = []; const now = MEN.map(() => [null, null]).flat();
  shots.forEach((s, k) => {
    let moved = false;
    s.row.forEach((u, i) => { if (u) { const f = path.join(tmp, k + '_' + i + '.png'); fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); now[i] = f; moved = true; } });
    if (moved || !keep.length) keep.push({ t: s.t, files: now.slice() });
  });
  const plan = { out: path.join(ROOT, OUT), men: MEN, frames: keep.map((f, i) => ({ files: f.files, ms: Math.max(40, Math.round(((keep[i + 1] ? keep[i + 1].t : SECS * 1000) - f.t))) })),
    today: MEN.map(m => m[0] === 'you' ? 'records/target/portrait/crew/you/' : 'records/target/character/barber/' + m[0] + '/face/') };
  fs.writeFileSync(path.join(tmp, 'plan.json'), JSON.stringify(plan));
  execFileSync('python3', [path.join(__dirname, 'bohemia_portrait_every_face_breathes_clip.py'), path.join(tmp, 'plan.json'), ROOT], { stdio: 'inherit' });
  console.log('frames', keep.length, 'from', shots.length, 'samples');
})().catch(e => { console.error(e); process.exit(1); });
